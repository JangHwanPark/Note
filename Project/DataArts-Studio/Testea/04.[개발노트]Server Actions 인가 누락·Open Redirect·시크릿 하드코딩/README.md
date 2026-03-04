## 발견 경위

베타 릴리스(2/14)를 이틀 앞두고 배포 전 보안 점검을 진행했다. 미들웨어 기반 접근 제어가 정상 동작하는지 확인하던 중, Server Actions를 직접 HTTP 요청으로 호출하면 **인가 없이 데이터 조작이 가능한 상태**라는 것을 발견했다. 이를 기점으로 인증·인가 흐름 전체를 재점검했고, 추가로 두 가지 보안 이슈를 더 찾아냈다.

세 가지 이슈를 단일 커밋으로 일괄 수정했다.

```
6f75b7d  Feat: 프로젝트 접근 권한 검증 로직 추가  (15 files, +201 lines)
```

| # | 증상 | 원인 | 심각도 |
|---|---|---|---|
| 1 | 비인가 사용자가 Server Actions로 데이터 변경 가능 | Server Actions에 인가 검증 누락 | Critical |
| 2 | 로그인 후 외부 사이트로 리디렉트 가능 | 리다이렉트 URL 미검증 (Open Redirect) | High |
| 3 | 프리뷰 환경에서 하드코딩 시크릿으로 토큰 서명 | `NODE_ENV` 조건부 fallback 시크릿 | High |

<br/>

## 이슈 1: Server Actions 인가 누락 (Critical)

### 증상

미들웨어로 페이지 접근은 차단되지만, `curl`이나 브라우저 DevTools에서 Server Actions 엔드포인트를 직접 POST 요청하면 **비밀번호 입력 없이 데이터 CRUD가 가능**했다.

### 원인 분석

Testea는 프로젝트별 비밀번호 → JWT 토큰 → 쿠키 저장 방식으로 접근을 제어한다. 문제는 이 JWT 검증이 **미들웨어에만 적용**되어 있었다는 점이다.

```
[클라이언트] → [미들웨어: JWT 검증 ✅] → [페이지 렌더링]
[클라이언트] → [Server Action: JWT 검증 ❌] → [DB 조작]  ← 여기가 빈 구간
```

미들웨어는 페이지 렌더링 요청만 가로챈다. Server Actions는 별도 HTTP POST 엔드포인트로 동작하므로 미들웨어를 거치지 않는다. 즉 **미들웨어 인가와 API 인가는 별개 레이어**인데, API 레이어가 완전히 열려 있었다.

### 해결

`requireProjectAccess()` 유틸리티를 만들어 9개 파일의 모든 mutation Server Actions에 적용했다.

```ts
// src/access/lib/require-access.ts
export async function requireProjectAccess(projectId: string): Promise<boolean> {
  try {
    const tokenMap = await getAllAccessTokenCookies();
    for (const [, token] of tokenMap) {
      const result = await verifyProjectAccessToken(token);
      if (result.valid && result.payload.projectId === projectId) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
```

Server Actions 유형에 따라 두 가지 검증 패턴을 적용했다.

```ts
// create 계열 — input에 projectId가 있으므로 바로 검증
const hasAccess = await requireProjectAccess(input.projectId);
if (!hasAccess) {
  return { success: false, errors: { _testCase: ['접근 권한이 없습니다.'] } };
}

// update/archive 계열 — 리소스를 먼저 조회해서 projectId를 확인
const [existing] = await db
  .select({ projectId: testCases.project_id })
  .from(testCases)
  .where(eq(testCases.id, id))
  .limit(1);
if (!existing?.projectId || !(await requireProjectAccess(existing.projectId))) {
  return { success: false, errors: { _testCase: ['접근 권한이 없습니다.'] } };
}
```

적용 범위 — 9개 파일

```
entities/milestone/api/server-actions.ts
  → create, update, archive, addTestCases, removeTestCase, addTestSuites, removeTestSuite

entities/project/api/server-actions.ts     → archiveProject
entities/test-case/api/server-actions.ts   → create, update, archive
entities/test-suite/api/server-actions.ts  → create, update, archive
features/runs-create/model/server-action.ts → createTestRunAction
features/runs-edit/model/                   → addCases, addMilestones, addSuites
features/runs/api/update-test-case-run.ts   → updateTestCaseRunStatus
```

가장 깊은 체이닝은 `updateTestCaseRunStatus` — testCaseRun → testRun → project_id 순서로 두 번 조회해야 했다.

### 검증

수정 후 Server Actions 직접 호출 시 `접근 권한이 없습니다.` 에러 반환을 확인했다. 유효한 JWT 쿠키가 있는 상태에서만 정상 동작한다.

<br/>

## 이슈 2: Open Redirect 취약점 (High)

### 증상

프로젝트 접근 폼 URL에 `?redirect=https://evil.com`을 붙이면, 사용자가 비밀번호를 정상 입력한 뒤 **외부 사이트로 이동**하는 현상.

### 원인 분석

리다이렉트 URL을 쿼리 파라미터에서 받아 **검증 없이 그대로 사용**하고 있었다.

```tsx
// Before — 취약한 코드
router.push(redirectUrl || result.redirectUrl);
```

공격 시나리오: 공격자가 `https://testea.com/access?redirect=https://phishing.com`을 메일로 전송 → 사용자가 정상 비밀번호 입력 → 피싱 사이트로 이동. OWASP Top 10에 포함되는 기본적인 취약점이지만, 빠르게 개발할 때 놓치기 쉽다.

### 해결

상대 경로만 허용하도록 검증을 추가했다.

```tsx
// After — Open Redirect 방지
const safeRedirect =
  redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')
    ? redirectUrl
    : result.redirectUrl;
router.push(safeRedirect);
```

검증 조건
1. `redirectUrl`이 존재하는지
2. `/`로 시작하는지 (상대 경로)
3. `//`로 시작하지 않는지 (`//evil.com`은 프로토콜 상대 URL로 외부 이동 가능)

통과하지 못하면 서버가 반환한 기본 리다이렉트 URL을 사용한다.

### 검증

`?redirect=https://evil.com`, `?redirect=//evil.com`, `?redirect=javascript:alert(1)` 모두 기본 리다이렉트로 폴백되는 것을 확인했다. `?redirect=/projects/123`은 정상 동작.

<br/>

## 이슈 3: 시크릿 하드코딩 (High)

### 증상

Vercel 프리뷰 배포에서 `ACCESS_TOKEN_SECRET` 환경 변수 없이도 JWT 서명이 정상 동작하는 현상.

### 원인 분석

JWT 시크릿에 개발 편의용 fallback이 하드코딩되어 있었다.

```ts
// Before — NODE_ENV=production에서만 에러, 나머지는 하드코딩 키 사용
function getTokenSecret(): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('ACCESS_TOKEN_SECRET environment variable is required in production');
  }
  return secret || 'dev-secret-key-do-not-use-in-production';
}
```

문제점
- Vercel 프리뷰 배포는 `NODE_ENV=production`이 아닐 수 있어 하드코딩 키가 사용됨
- 하드코딩 키가 소스코드에 노출되어 있으므로 **키를 아는 누구나 유효한 토큰을 위조** 가능
- staging, preview 같은 비프로덕션 환경이 사실상 무방비 상태

### 해결

모든 환경에서 환경 변수를 필수로 요구하도록 변경했다.

```ts
// After — 모든 환경에서 필수
function getTokenSecret(): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      'ACCESS_TOKEN_SECRET environment variable is required. ' +
      'Set it in .env.local for development.'
    );
  }
  return secret;
}
```

### 검증

환경 변수 미설정 시 서버 시작 단계에서 즉시 에러가 발생하는 것을 확인했다. `.env.local`에 시크릿을 설정한 후 정상 동작.

<br/>

## 추가 수정: Rate Limiting 키 충돌

같은 커밋에서 발견한 부수 이슈도 함께 수정했다.

### 증상

한 사용자가 비밀번호를 5번 틀리면, **다른 사용자도 같은 프로젝트에 접근 불가**해지는 현상.

### 원인

Rate Limiting 키가 프로젝트 이름만으로 생성되어 모든 사용자가 동일한 카운터를 공유하고 있었다.

```ts
// Before — 프로젝트 이름만으로 키 생성 (모든 사용자가 카운터 공유)
const rateLimitKey = `project:${projectName}`;

// After — 프로젝트 + IP 복합 키 (사용자별 독립 카운팅)
const headerStore = await headers();
const clientIp = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
const rateLimitKey = `project:${projectName}:ip:${clientIp}`;
```

### 잔존 한계

현재 인메모리 `Map` 기반이라 서버 재시작 시 초기화되고, 멀티 인스턴스 배포 시 무력화된다. 베타 단계(단일 인스턴스)에서는 유효하지만 프로덕션 전 Redis 전환이 필요하다.

```ts
/**
 * TODO [프로덕션 전 필수]: Redis 기반으로 전환 필요
 * - 현재 인메모리 Map은 서버 재시작 시 초기화됨
 * - 멀티 인스턴스 배포 시 인스턴스별로 독립 카운팅되어 무력화됨
 * - 베타 단계(단일 인스턴스)에서만 유효
 */
```

<br/>

## 근본 원인

네 가지 이슈 모두 같은 패턴에서 비롯됐다: **빠르게 기능을 만들면서 보안 레이어를 한 곳(미들웨어)에만 의존**한 것이다.

- 미들웨어가 모든 요청을 가로챈다고 가정 → Server Actions는 별도 경로
- 리다이렉트 URL은 내부에서만 온다고 가정 → 쿼리 파라미터는 외부 입력
- 프로덕션 환경 변수는 항상 설정된다고 가정 → 프리뷰 배포는 다를 수 있음
- Rate Limiting 키는 프로젝트 단위면 충분하다고 가정 → 한 명이 전체를 잠금

모두 **"정상 경로에서는 문제없다"**는 가정이 깨지는 순간 취약점이 되는 케이스였다.

<br/>

## 재발 방지

1. **방어는 레이어별로 중첩 적용** — 미들웨어 인가와 API 인가는 별개다. Server Actions, API Routes 등 각 엔드포인트 내부에서도 독립적으로 인가를 검증해야 한다.
2. **외부 입력은 항상 검증** — 쿼리 파라미터, 헤더, 폼 입력 등 클라이언트에서 오는 값은 신뢰하지 않는다. 리다이렉트 URL, 파일 경로 등 모든 외부 입력에 화이트리스트 검증을 적용한다.
3. **시크릿 fallback은 만들지 않는다** — "개발 편의를 위한 기본값"은 반드시 프로덕션에 누출된다. 환경 변수가 없으면 에러를 내는 것이 안전하다.
4. **보안 이슈는 발견 즉시 일괄 수정** — 관련 이슈를 하나의 커밋으로 묶으면 추적에도 롤백에도 유리하다.
