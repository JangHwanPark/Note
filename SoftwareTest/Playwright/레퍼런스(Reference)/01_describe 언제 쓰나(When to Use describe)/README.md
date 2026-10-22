## describe는 언제 쓸까
- `test.describe()` 는 여러 테스트를 하나의 그룹으로 묶는 함수다. Vitest의 `describe` 와 쓰는 법이 거의 같다
- 묶으면 hook과 옵션을 그룹 단위로 공유하고, 리포트에 그룹 단위로 표시된다
- 공유할 것이 없으면 쓰지 않아도 된다. Playwright에서는 spec 파일 하나가 이미 하나의 그룹 역할을 하기 때문이다

### describe
사전적 의미는 묘사하다, 서술하다이다.
테스트 코드에서는 "이 묶음은 무엇을 확인하는 테스트들인지"를 한 문장으로 서술하는 자리라 이 이름이 붙었다. 그룹 이름이 리포트에 그대로 찍히므로 화면이나 기능 이름을 적는다.

<br/>

## 쓰는 경우 네 가지

### 1. beforeEach, afterEach 공유 (가장 흔함)
같은 사전 동작이 여러 테스트에 반복되면 묶는다. 묶지 않으면 hook을 테스트 수만큼 중복해서 적어야 한다.

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

`closeNoticeDialogs` 는 작업하던 프로젝트에서 만든 헬퍼 함수다.

### 2. 리포트에서 영역 구분하기
`describe` 이름은 테스트 이름 앞에 붙어 리포트에 함께 찍힌다. HTML 리포트는 파일별로 테스트를 나열하고, 각 테스트를 `describe` 이름과 테스트 이름을 `›` 로 이은 한 줄로 보여 준다. 묶어 두면 어느 영역의 테스트가 깨졌는지 이름만 보고 알 수 있다.

```text
프로젝트 생성 › Happy Path › 이름 입력 후 대시보드 이동      통과
프로젝트 생성 › Cancel › Step 2에서 취소 시 모달 닫힘        통과
프로젝트 생성 › Validation › 빈 이름 → 다음 버튼 비활성     실패
```

1.64.1로 HTML 리포트를 만들어 보니, 리포트 데이터에는 `describe` 경로가 배열(`path`)로 들어 있고 화면에서는 이를 `›` 로 이어 붙였다. `describe` 를 접고 펼치는 트리로 보여 주는 것은 UI 모드(`--ui`)와 VS Code 확장의 테스트 목록이다.

### 3. 그룹 단위 실행 옵션 바꾸기

```ts
test.describe('상태 공유 시나리오', () => {
  test.describe.configure({ mode: 'serial' }); // 이 그룹은 순서대로 실행
  // ...
});

test.describe('외부 API를 쓰는 그룹', () => {
  test.describe.configure({ retries: 3 }); // 이 그룹만 3번까지 재시도
  // ...
});
```

`test.describe.configure()` 는 호출한 위치의 그룹(파일 최상위면 파일 전체)에 적용된다. 순서대로 실행하는 그룹은 [test 객체 API](../02_test%20객체%20API(test%20API)/README.md)의 serial 설명을 함께 본다. 앞 테스트가 실패하면 뒤 테스트는 실행되지 않는다.

### 4. 그룹 단위 skip, only

```ts
test.describe.skip('아직 미구현', () => { /* ... */ });
```

<br/>

## 안 쓰는 게 나은 경우
테스트가 1~2개뿐인 spec은 파일 자체가 이미 그룹이라 묶을 이유가 없다. 테스트마다 사전 동작이 모두 다르면 공유할 것이 없다. 세 단계 이상 중첩하면 오히려 읽기 어려워지므로, 그때는 파일을 나눈다.

<br/>

## Vitest보다 덜 쓰는 이유
Vitest는 단위 테스트라 한 파일에 작은 테스트 수십 개를 두고, `describe` 로 컴포넌트나 상태 단위로 묶는 것이 자연스럽다.
Playwright는 spec 파일 하나가 이미 큰 단위(시나리오 하나)라서 `describe` 없이도 파일이 그룹 역할을 한다. 그래서 Vitest만큼 자주 쓰지 않는다.

판단 기준을 한 문장으로 줄이면, 여러 테스트에 같은 hook이나 같은 설정을 적용하고 싶을 때 `describe` 로 묶는다.

<br/>

## 공식 문서
- [test.describe](https://playwright.dev/docs/api/class-test#test-describe)
- [test.describe.configure](https://playwright.dev/docs/api/class-test#test-describe-configure)
- [Test Hooks](https://playwright.dev/docs/api/class-test#test-before-each)

`test.describe.configure` 의 `mode`, `retries` 옵션은 `@playwright/test` 1.64.1 타입 정의에서 확인했다.

[목차](../README.md) | [다음 장: test 객체 API](../02_test%20객체%20API(test%20API)/README.md)
