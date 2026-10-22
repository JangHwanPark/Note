# describe 언제 쓰나

Playwright의 `test.describe()`는 vitest의 `describe`와 거의 동일하다. 다만 **공유할 게 없으면 안 써도 된다.**

## 쓰는 경우 4가지

### 1. beforeEach / afterEach 공유 (가장 흔함)
같은 사전 동작이 3개 이상 test에 반복되면 묶는다.

```ts
test.describe('프로젝트 생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeNoticeDialogs(page);
  });

  test('이름 입력 후 다음', async ({ page }) => {});
  test('동의 미체크 시 비활성', async ({ page }) => {});
  test('취소 시 모달 닫힘', async ({ page }) => {});
});
```

describe 없으면 hook을 세 곳에 중복해서 적어야 한다.

### 2. 리포트 트리 구조화
HTML reporter는 `describe → test` 계층으로 표시.

```
프로젝트 생성
  ├── Happy Path
  │   └── 이름 입력 후 대시보드 이동      ✓
  ├── Cancel
  │   └── Step 2에서 취소 시 모달 닫힘    ✓
  └── Validation
      └── 빈 이름 → 다음 버튼 비활성     ✗
```

평탄하게 두면 어느 영역이 깨졌는지 한눈에 안 보인다.

### 3. 그룹 단위 실행 옵션 변경

```ts
test.describe.serial('상태 공유 시나리오', () => {
  // 순차 실행
});

test.describe.configure({ retries: 3 });
// 이 그룹만 3번 retry
```

### 4. 그룹 단위 skip / only

```ts
test.describe.skip('아직 미구현', () => { /* ... */ });
```

## 안 쓰는 게 나은 경우

- test가 1~2개뿐인 spec — 파일 자체가 이미 그룹.
- 모든 test의 beforeEach가 다름 — 공유할 게 없음.
- 3단 이상 중첩 — 가독성 깨짐. 차라리 파일을 분리.

## vitest와 자주 쓰는 빈도가 다른 이유

vitest는 unit test라 한 파일에 작은 test 수십 개 + describe로 컴포넌트·상태 단위 묶는 게 자연스럽다.

Playwright는 **한 spec 파일이 이미 큰 단위(시나리오 1개)** 라서 describe 없이도 spec 자체가 그룹 역할. 그래서 vitest만큼 자주 안 쓴다.

## 판단 기준 한 줄

> "이 test 3개에 같은 hook이나 같은 설정을 적용하고 싶다" — 그때 describe.

## 공식 문서

- [Test Groups](https://playwright.dev/docs/api/class-test#test-describe)
- [Test Hooks](https://playwright.dev/docs/api/class-test#test-before-each)
