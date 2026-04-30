# 프론트엔드 성능 개선기 - Lighthouse 77점, FCP 1.0초 달성까지
## 발견 경위

베타 릴리스(2/14) 이후 실제로 서비스를 사용하면서 체감 속도가 느리다는 걸 느꼈다. 테스트 케이스를 만들고, 스위트 목록을 보고, 마일스톤으로 이동하는 — 이 기본적인 흐름이 매번 로딩 스피너를 거쳐야 했다. 사이드바 메뉴를 클릭하면 빈 화면이 보이고, 새로고침하면 데이터가 표시되기까지 체감상 오래 걸렸다.

DevTools Network 탭을 열어보니 원인이 보였다. 모든 페이지가 `'use client'` + `useQuery` 조합이라, **브라우저가 JS를 다운로드하고 실행한 뒤에야 API 요청이 시작**됐다. 서버에서 할 수 있는 일을 클라이언트에 전부 떠넘기고 있었다.

```
[브라우저]                              [서버]
  HTML 다운로드 (빈 껍데기)     ───>
  JS 번들 다운로드              ───>
  JS 파싱 & 실행
  React 하이드레이션
  useQuery → API 호출           ───>    DB 쿼리
  데이터 수신                   <───    응답
  UI 렌더링 (데이터 표시)
```

여기에 데이터 의존 관계도 문제였다. 대시보드 페이지에서 `slug → dashboardStats → projectId → testCases/testRuns` 순서로 쿼리가 순차 실행됐다. dashboardStats가 돌아와야 projectId를 알 수 있고, 그제서야 나머지 쿼리가 시작되는 **워터폴** 구조였다.

```
9b70df0  feat(app): 서버 데이터 prefetch 로직 추가 및 전역 상태 최적화  (23 files, +309 -63)
5b108eb  풀 리퀘스트 병합 #63
```

<br/>

## 병목 분석

| 병목 | 원인 | 영향 |
|------|------|------|
| Client-side 데이터 페칭 | 모든 페이지가 `useQuery`로만 데이터 로드 | JS 실행 후 추가 API 왕복 필요 |
| 외부 CDN 폰트 | Pretendard를 jsdelivr CDN `<link>` 태그로 로드 | CSS 다운로드까지 렌더 차단 |
| 데이터 워터폴 | `slug → dashboardStats → projectId → testCases/Runs` 순차 호출 | 종속 쿼리가 첫 쿼리 완료 대기 |
| staleTime 미세분화 | 스위트/마일스톤 등 기본 60초 | 페이지 전환마다 동일 데이터 재요청 |
| 페이지 전환 지연 | 네비게이션 클릭 후 데이터 로드 시작 | 클릭 → 로딩 스피너 → 데이터 표시 |

<br/>

## 적용한 최적화 5가지

### 1. Server-side Prefetch + Hydration

처음 써보는 기법이었다. TanStack Query의 `prefetchQuery` + `HydrationBoundary` 조합으로 서버에서 데이터를 미리 가져와 HTML에 포함시키는 방식이다.

기존에는 9개 `page.tsx`가 전부 클라이언트 컴포넌트였다. 이걸 async Server Component로 전환하고, 서버에서 `QueryClient`를 생성해 데이터를 prefetch한 뒤 `dehydrate`로 클라이언트에 넘기는 구조로 바꿨다.

```tsx
// Before — 빈 껍데기 HTML + 클라이언트에서 전부 페칭
const ProjectDashboardRoute = () => {
  return <ProjectDashboardView />;
};

// After — 서버에서 데이터 prefetch → HTML에 포함
export default async function ProjectDashboardRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60 * 1000 } },
  });

  try {
    const statsData = await queryClient.fetchQuery(dashboardQueryOptions.stats(slug));
    const projectId = statsData?.success ? statsData.data.project.id : undefined;

    if (projectId) {
      await Promise.all([
        queryClient.prefetchQuery(testCasesQueryOptions(projectId)),
        queryClient.prefetchQuery(testRunsQueryOptions(projectId)),
        queryClient.prefetchQuery(dashboardQueryOptions.storageInfo(projectId)),
      ]);
    }
  } catch {
    // prefetch 실패 시 클라이언트에서 재시도
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDashboardView />
    </HydrationBoundary>
  );
}
```

핵심은 `try-catch`로 감싼 부분이다. prefetch가 실패해도 페이지 렌더링을 차단하지 않는다. 실패하면 클라이언트의 `useQuery`가 자동으로 재요청하므로 **graceful degradation**이 보장된다. 서버 prefetch는 "있으면 좋고, 없어도 동작하는" 최적화 레이어로 설계했다.

처음 적용해보면서 느낀 점은, 이 패턴이 생각보다 직관적이라는 것이다. 서버에서 `queryClient.prefetchQuery`로 캐시를 채우고 `dehydrate`로 직렬화해서 넘기면, 클라이언트의 `useQuery`는 이미 캐시에 데이터가 있으니 API 호출 없이 바로 렌더링한다. 기존 클라이언트 코드를 하나도 건드리지 않고 `page.tsx`만 수정하면 되는 게 큰 장점이었다.

<br/>

### 2. next/font 로컬 폰트 최적화

기존에는 Pretendard를 jsdelivr CDN의 `<link rel="stylesheet">`로 로드하고 있었다. 이 방식은 외부 DNS 조회 → TCP 연결 → TLS 핸드셰이크 → CSS 다운로드 → 폰트 파일 다운로드까지 렌더 차단이 발생한다.

```tsx
// Before — 외부 CDN 의존
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
/>

// After — next/font/local로 빌드타임 번들링
const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});
```

`next/font/local`은 빌드 시점에 폰트를 번들에 포함시키므로 런타임 비용이 0이다. `display: 'swap'`으로 폰트 로드 전에도 텍스트가 즉시 표시되고, 가변 폰트(Variable Font) 하나로 모든 weight를 커버하니 파일 수도 줄었다.

<br/>

### 3. 네비게이션 호버 Prefetch

이 기법이 체감상 가장 효과가 컸다. 사이드바 메뉴에 마우스를 올리면(`onMouseEnter`) 해당 페이지에 필요한 데이터를 미리 가져오는 방식이다.

```tsx
// 메뉴 라벨 → prefetch할 쿼리 매핑
const PREFETCH_MAP: Record<string, (projectId: string) => QueryOptions> = {
  '테스트 케이스': (pid) => testCasesQueryOptions(pid),
  '테스트 스위트': (pid) => testSuitesQueryOptions(pid),
  '마일스톤': (pid) => milestonesQueryOptions(pid),
  '테스트 실행': (pid) => testRunsQueryOptions(pid),
};

// 호버 시 prefetch 실행
const handlePrefetch = useCallback((label: string) => {
  const optionsFn = PREFETCH_MAP[label];
  if (!optionsFn) return;

  const statsData = queryClient.getQueryData(dashboardQueryKeys.stats(projectSlug));
  const projectId = statsData?.success ? statsData.data.project.id : undefined;
  if (!projectId) return;

  queryClient.prefetchQuery(optionsFn(projectId));
}, [queryClient, projectSlug]);
```

사용자가 메뉴 위에 마우스를 올린 후 클릭까지 평균 200~400ms가 걸린다. 이 시간 동안 데이터를 백그라운드로 가져오면, 클릭 시점에는 이미 캐시에 데이터가 있어 로딩 없이 즉시 렌더링된다. 단, 호버 없이 바로 클릭하거나 prefetch가 완료되기 전에 클릭하면 기존처럼 로딩이 발생한다.

처음엔 "이게 정말 체감될까?" 싶었는데, 적용 후 페이지 전환이 **진짜 즉시** 일어나는 걸 보고 놀랐다. 로딩 스피너가 거의 안 보인다. 사용자 행동 패턴을 이용한 투기적 최적화(speculative optimization)라는 개념을 이론으로만 알고 있었는데, 직접 적용해보니 효과가 확실했다.

<br/>

### 4. 데이터 워터폴 제거

대시보드에서 `projectId`를 얻으려면 무거운 `dashboardStats` 쿼리(통계 데이터 집계 포함)가 완료되어야 했다. 그 뒤에야 `testCases`, `testRuns` 쿼리가 시작됐다.

가벼운 `projectIdQuery`(단순 SELECT)를 별도로 만들어 `projectId`를 빠르게 확보하고, 나머지 쿼리를 즉시 시작할 수 있게 했다.

```tsx
// Before — dashboardStats가 끝나야 projectId를 알 수 있음
const { data: dashboardData } = useQuery(dashboardQueryOptions.stats(slug));
const projectId = dashboardData?.success ? dashboardData.data.project.id : undefined;

// After — 가벼운 쿼리로 projectId를 빠르게 확보
const { data: projectIdData } = useQuery(projectIdQueryOptions(slug));
const projectId = projectIdData?.success ? projectIdData.data.id : undefined;
```

```
Before (워터폴)
dashboardStats(slug)  ──── 집계 쿼리 ────>  projectId 확보
                                              │
testCases(projectId)  ──── 추가 대기 ────>    ▼  데이터 표시
총 대기: 순차 실행

After (병렬)
projectIdQuery(slug)  ──── 단순 SELECT ──>  projectId 확보
dashboardStats(slug)  ──── 집계 쿼리 ───>   (병렬 실행)
testCases(projectId)  ──────────>│          더 빨리 시작
총 대기: 병렬 실행
```

<br/>

### 5. staleTime 세분화

모든 쿼리의 staleTime이 60초(기본값)이거나 5분이었다. 데이터 특성을 무시한 획일적인 설정이었다. 데이터 변경 빈도에 따라 3단계로 나눴다.

```ts
// src/shared/constants/query/query.ts
export const QUERY_STALE_TIME_SHORT = 1000 * 30;       // 30초 — 활발히 변경되는 데이터
export const QUERY_STALE_TIME_DEFAULT = 1000 * 60 * 5; // 5분 — 일반 데이터
export const QUERY_STALE_TIME_LONG = 1000 * 60 * 30;   // 30분 — 거의 안 변하는 데이터
```

| 데이터 | Before | After | 근거 |
|--------|--------|-------|------|
| 프로젝트 ID (slug→id) | — | Infinity | 불변 데이터 |
| 스위트 목록/상세 | 60초 | **5분** | 구조는 자주 안 변함 |
| 마일스톤 목록/상세 | 60초 | **5분** | 동일 |
| 저장 용량 정보 | 5분 | **30분** | 파일 업로드 시에만 변경 |
| 테스트 실행 목록 | 60초 | 60초 (유지) | 활발히 변경되는 데이터 |

매직넘버로 흩어져 있던 staleTime을 상수로 통합한 것도 부수적인 개선이었다. `QUERY_STALE_TIME_DEFAULT`만 봐도 의도가 전달된다.

<br/>

## 추가 수정: Barrel Import 순환 참조

Server Component에서 `@/features` barrel을 import하면 해당 모듈의 모든 export(클라이언트 컴포넌트 포함)가 서버 번들에 포함되어 **무한 컴파일**이 발생했다. `page.tsx`에서 barrel import를 직접 경로로 변경해서 해결했다.

```ts
// Before — barrel import (전체 모듈 로드)
import { getDashboardStats } from '@/features';

// After — 직접 경로 (필요한 것만 로드)
import { getDashboardStats } from './get-dashboard-stats';
```

Server Component에서 barrel import를 쓰면 안 된다는 건 이번에 처음 알았다. 클라이언트 컴포넌트에서는 tree-shaking이 되지만, Server Component에서는 모듈 전체가 평가되기 때문에 `'use client'` 컴포넌트까지 서버 번들에 끌려들어온다.

<br/>

## Lighthouse 측정 결과

최적화 적용 후 프로젝트 대시보드 페이지를 Lighthouse로 측정한 결과다.

> 측정 환경: localhost, `next build` + `next start` (프로덕션 모드), Chrome DevTools Lighthouse
>
> Before 값은 최적화 전에 Lighthouse 측정을 하지 않았으므로 없다. 아래는 최적화 적용 후 현재 상태의 실측값이다.

| 지표 | 측정값 | 비고 |
|------|--------|------|
| **Performance Score** | **77** | |
| **FCP** | **1.0초** | |
| **LCP** | **2.2초** | |
| **TBT** | **70ms** | 양호 |
| **CLS** | **0.001** | 매우 양호 |
| **Speed Index** | **4.6초** | 개선 여지 있음 |

### 해석

- **FCP 1.0초**는 양호한 수준이다. 서버 prefetch 덕분에 HTML에 데이터가 포함되어 첫 화면이 빠르게 표시된다.
- **LCP 2.2초**는 아직 개선 여지가 있다. 사용하지 않는 JavaScript 1,138KiB가 진단에 잡혔고, 기본 스레드 작업이 2.6초로 긴 태스크 4개가 발견됐다. JS 번들 사이즈 최적화가 다음 과제다.
- **CLS 0.001**은 `next/font/local`의 `display: 'swap'` 적용과 레이아웃 안정화 덕분이다.
- **Speed Index 4.6초**는 높은 편인데, JS 번들이 크고 하이드레이션에 시간이 걸리면서 시각적 완성이 지연되는 것으로 보인다.

### 남은 과제

Lighthouse 진단에서 지적된 항목

| 진단 | 내용 |
|------|------|
| 사용하지 않는 JS | 예상 절감 용량 1,138KiB — 코드 스플리팅, dynamic import 적용 필요 |
| 기본 스레드 작업 | 2.6초 — 긴 태스크 4개 발견, 하이드레이션 최적화 필요 |
| 네트워크 페이로드 | 총 3,048KiB — 번들 분석 후 불필요한 의존성 제거 필요 |
| 레거시 JavaScript | 예상 절감 14KiB — 미미하지만 확인 필요 |

### 페이지 전환 속도에 대해

호버 prefetch에 의한 SPA 내 페이지 전환 속도는 Lighthouse로 측정할 수 없다 (Lighthouse는 초기 로드만 측정). 체감상 로딩 스피너가 대부분 사라졌지만, 정확한 ms 단위 수치를 제시하려면 Performance 패널에서 녹화하거나 `performance.mark()`로 계측해야 한다. 현재는 정량적 수치 없이 **"호버 후 클릭 시 로딩 스피너가 대부분 미노출"** 수준으로만 확인된 상태다.

<br/>

## 적용 범위

커밋: `9b70df0` (23 files, +309 -63)

- Server Prefetch 적용: 9개 `page.tsx`
- 워터폴 제거: 4개 View 컴포넌트
- 호버 Prefetch: `aside.tsx`, `aside-nav-item.tsx`
- staleTime 세분화: 3개 `query.ts`
- 폰트 최적화: `layout.tsx`, `globals.css`
- Circular import 수정: 2개 `query.ts`

<br/>

## 느낀 점

이번 작업에서 가장 크게 배운 건 **Server-side Prefetch + Hydration** 패턴이다. 이론으로만 알던 걸 직접 적용해봤는데, 기존 클라이언트 코드를 건드리지 않고 `page.tsx`만 수정해서 성능을 끌어올릴 수 있다는 게 인상적이었다. prefetch가 실패해도 클라이언트 `useQuery`가 받아주니 안전하고, 성공하면 API 왕복이 통째로 사라진다.

호버 prefetch도 처음 써봤다. 코드 몇 줄인데 체감 효과가 가장 컸다. 사용자의 의도를 예측해서 미리 데이터를 가져오는 방식이 이렇게까지 차이가 나는 줄 몰랐다. 이론상 "마우스를 올린 후 클릭까지 200-400ms"라는 시간이 있다는 걸 알고 있었지만, 실제로 적용해보니 로딩 스피너가 거의 사라져서 체감이 확실했다.

반면 barrel import가 Server Component에서 문제를 일으킨다는 건 삽질을 통해 알게 됐다. 클라이언트에서는 아무 문제 없던 `@/features` import가 서버에서는 무한 컴파일을 유발했다. Next.js App Router에서 서버/클라이언트 모듈 경계를 의식하면서 import 경로를 설계해야 한다는 교훈을 얻었다.

그리고 **성능 개선 전에 반드시 Before를 측정해야 한다**는 것도 이번에 배웠다. 최적화 후에야 Lighthouse를 돌렸기 때문에 Before/After 비교가 불가능하다. "체감상 빨라졌다"는 알지만, 얼마나 빨라졌는지를 정량적으로 증명할 수 없다. 다음에 성능 작업을 할 때는 작업 전에 먼저 측정하고 시작할 것이다.

현재 Lighthouse 77점, FCP 1.0초. 나쁘지 않지만 LCP 2.2초와 사용하지 않는 JS 1,138KiB는 다음 최적화 과제로 남아 있다.
