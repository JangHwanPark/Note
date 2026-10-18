# 낙관적 업데이트 & 데이터 반응성 — 서버 응답 0ms의 환상

> **시리즈**: 프론트엔드 성능 개선기 (3/3)
> **날짜**: 2026-03-06 ~ 2026-03-07
> **주요 커밋**: `d9353d4`, `d34a38d`, `27d9e02`, `b12e6bf`
> **PR**: #66, #67
> **이전 글**: [07. Skeleton UI & 번들 경량화](./07.%5B개발노트%5DSkeleton%20UI%20%26%20번들%20경량화.md)

---

## 배경

Phase 1에서 데이터를 빨리 가져오게 만들었고, Phase 2에서 로딩 중 화면을 안정적으로 만들었다. 이제 남은 건 **"사용자 액션에 대한 피드백 속도"**다.

테스트 케이스를 생성하면 서버에서 DB INSERT → 응답까지 200~500ms가 걸린다. 테스트 실행에서 케이스 상태를 변경(Pass/Fail)할 때도 마찬가지다. 이 대기 시간 동안 사용자는 "버튼을 눌렀는데 반응이 없네?"라고 느낀다.

낙관적 업데이트(Optimistic Update)는 서버 응답을 기다리지 않고 **즉시 UI를 업데이트**한 뒤, 서버 응답이 오면 확정하거나 롤백하는 패턴이다.

<br/>

## 적용한 최적화

### 1. 테스트 케이스 생성 — 낙관적 삽입

`useCreateCase` 훅에 TanStack Query의 `onMutate` / `onError` / `onSettled` 패턴을 적용했다. (`d9353d4`)

```tsx
const useCreateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestCase,

    onMutate: async (newCase) => {
      // 1. 진행 중인 쿼리 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['testCases'] });

      // 2. 현재 캐시 스냅샷 (롤백용)
      const previousCases = queryClient.getQueryData(['testCases']);

      // 3. 캐시에 임시 데이터 삽입
      queryClient.setQueryData(['testCases'], (old) => ({
        ...old,
        data: [
          ...(old?.data ?? []),
          { ...newCase, id: `temp-${Date.now()}`, isOptimistic: true },
        ],
      }));

      return { previousCases };
    },

    onError: (_err, _newCase, context) => {
      // 실패 시 스냅샷으로 롤백
      queryClient.setQueryData(['testCases'], context?.previousCases);
    },

    onSettled: () => {
      // 성공/실패 무관하게 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ['testCases'] });
    },
  });
};
```

UI에서는 `isOptimistic` 플래그로 낙관적 항목을 시각적으로 구분한다:

```tsx
<div className={cn(
  'transition-opacity',
  testCase.isOptimistic && 'opacity-60 animate-pulse'
)}>
  {/* 케이스 카드 내용 */}
</div>
```

사용자 경험:
1. "생성" 버튼 클릭 → **즉시** 목록에 반투명 + 펄스 애니메이션으로 새 항목 표시
2. 서버 응답 성공 → 반투명 해제, 실제 데이터로 교체
3. 서버 응답 실패 → 항목 제거 + 에러 토스트

<br/>

### 2. 테스트 실행 인라인 상태 변경

테스트 실행 상세 페이지에서 각 케이스의 상태를 변경할 때(Pass/Fail/Blocked/Skipped), 드롭다운 선택 즉시 상태 아이콘과 색상이 바뀌도록 낙관적 업데이트를 적용했다. (`d34a38d`)

기존에는 상태 변경 → 서버 응답 대기 → 쿼리 무효화 → 리렌더링까지 체감 딜레이가 있었다. 이제는 클릭 즉시 반영된다.

<br/>

### 3. 섹션 CRUD 에러 처리 강화

섹션 추가/삭제 시 서버 에러가 발생하면 낙관적으로 추가된 항목을 롤백하고, 쿼리 무효화로 서버 상태와 동기화하도록 보강했다. (`27d9e02`)

- 섹션 생성 실패 시: 토스트로 에러 메시지 표시 + 쿼리 무효화
- 섹션 삭제 실패 시: 토스트 + 쿼리 무효화 (삭제된 것처럼 보이던 섹션 복원)

<br/>

### 4. 테스트 케이스 복제

"케이스 복제" 기능을 추가하면서 서버 액션에 `db.transaction`을 적용했다. (`b12e6bf`, `02aad25`)

- 복제 시 원본 케이스의 모든 필드(스텝, 태그, 섹션 등)를 트랜잭션 내에서 복사
- 낙관적 업데이트로 복제 즉시 목록에 표시

<br/>

## 낙관적 업데이트의 핵심 원칙

이번 작업을 통해 정리한 원칙:

**1. 항상 롤백 경로를 만들어 둘 것**
- `onMutate`에서 이전 캐시를 반드시 스냅샷
- `onError`에서 스냅샷으로 복원
- 이게 없으면 서버 실패 시 UI와 서버 상태가 어긋남

**2. `onSettled`에서 항상 서버 동기화**
- 성공이든 실패든, 마지막에 `invalidateQueries`로 서버의 진짜 데이터를 가져옴
- 낙관적 데이터는 어디까지나 "임시"

**3. 낙관적 항목은 시각적으로 구분**
- `isOptimistic` 플래그 + 반투명 + 펄스 애니메이션
- 사용자가 "아직 확정되지 않은 데이터"라는 걸 인지할 수 있어야 함

**4. 실패 시 사용자에게 반드시 알릴 것**
- 롤백만 하면 사용자는 "방금 만든 게 왜 사라졌지?" 혼란
- 토스트로 실패 사실과 이유를 명확히 전달

<br/>

## 적용 범위

| 카테고리 | 대상 | 커밋 |
|----------|------|------|
| 케이스 생성 낙관적 업데이트 | `use-create-case.ts`, `test-cases-view.tsx` | `d9353d4` |
| 실행 상태 인라인 변경 | 실행 상세 위젯 | `d34a38d` |
| 섹션 CRUD 에러 처리 | 섹션 추가/삭제 mutation | `27d9e02` |
| 케이스 복제 | `duplicateTestCase` + 트랜잭션 | `b12e6bf`, `02aad25` |
| 벌크 상태 변경 | 실행 케이스 일괄 변경 + 복사 | `8b62ce2`, `60504d5` |

<br/>

## 시리즈 종합 — 남은 과제

3편에 걸친 성능 개선의 현재 상태와 다음 단계:

| 항목 | 내용 | 우선순위 |
|------|------|----------|
| 사용하지 않는 JS | 예상 절감 1,138KiB — 코드 스플리팅, dynamic import 확대 필요 | P1 |
| 기본 스레드 작업 | 2.6초 — 긴 태스크 4개, 하이드레이션 최적화 필요 | P1 |
| 네트워크 페이로드 | 총 3,048KiB — 번들 분석 후 불필요한 의존성 제거 | P2 |
| 대시보드 LCP | 2.2초 — 2.0초 이하로 최적화 목표 | P2 |
| 페이지 전환 계측 | `performance.mark()`로 호버 prefetch 효과 정량화 | P3 |

<br/>

## 느낀 점

낙관적 업데이트는 "성능 최적화"라기보다 **"인터랙션 디자인"**에 가깝다. 실제 서버 응답 시간은 줄어들지 않는다. 하지만 사용자가 느끼는 반응 속도는 서버 RTT(200~500ms)에서 **0ms**로 줄어든다.

다만 복잡도가 올라간다. 단순한 `mutationFn` + `invalidateQueries`에 비해 `onMutate`/`onError`/`onSettled` 세 곳에 로직이 분산되고, 캐시 조작 코드가 생긴다. 모든 mutation에 적용할 필요는 없고, **사용자가 빈번하게 수행하는 액션**에만 선별 적용하는 게 맞다.

Phase 1~3을 거치면서 성능 최적화의 레이어를 정리할 수 있었다:

1. **서버에서 미리 가져오기** (Prefetch) — 네트워크 왕복 제거
2. **클라이언트에서 불필요한 것 빼기** (Lazy load, 번들 경량화) — 초기 로드 축소
3. **로딩 중에도 형태 보여주기** (Skeleton) — 체감 속도 개선
4. **서버 응답 전에 UI 반영하기** (Optimistic) — 인터랙션 즉시 반응

각 레이어가 독립적이면서도 누적 효과를 낸다. 전부 적용할 필요는 없지만, 어느 레이어에서 병목이 생기는지 진단할 수 있게 되었다.
