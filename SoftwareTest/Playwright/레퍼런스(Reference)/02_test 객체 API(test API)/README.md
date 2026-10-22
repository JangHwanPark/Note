## test 객체란 ?
- `@playwright/test` 에서 가져오는 `test` 는 테스트 케이스를 등록하는 함수이면서, 그룹화, hook, 옵션, fixture API가 메서드로 붙어 있는 객체다
- `test()` 로 케이스를 만들고, `test.describe` 로 묶고, `test.extend` 로 fixture를 늘리는 것이 큰 그림이다
- 검증은 같은 패키지의 `expect` 가 맡는다. 등록과 실행은 `test`, 확인은 `expect` 로 역할이 나뉜다

```ts
import { test, expect } from '@playwright/test';
```

### fixture
사전적 의미는 고정된 설비, 붙박이 가구다. 집에 미리 설치되어 있어 들어가면 바로 쓰는 것을 말한다.
테스트에서는 테스트가 시작되기 전에 미리 준비해 두고 끝나면 정리해 주는 실행 환경을 말한다. Playwright에서는 `async ({ page }) => {}` 처럼 콜백 인수에서 구조 분해로 꺼내 쓰고, 꺼낸 것만 준비된다.

<br/>

## 기본 사용

```ts
test('이름', async ({ page }) => {
  // 테스트 본문
});
```

첫 번째 인수는 테스트 이름, 두 번째 인수는 async 함수다. 함수의 첫 인수로 fixture가 들어오고, 두 번째 인수로 현재 테스트 정보(`testInfo`)가 들어온다.

<br/>

## 핵심 메서드

| 메서드 | 용도 |
| --- | --- |
| `test.describe(name, fn)` | 그룹화와 리포트 트리 |
| `test.beforeEach(fn)` | 각 테스트 직전 |
| `test.afterEach(fn)` | 각 테스트 직후 |
| `test.beforeAll(fn)` | 파일이나 describe 단위로 worker마다 1회 |
| `test.afterAll(fn)` | 파일이나 describe 단위로 worker마다 1회 |
| `test.skip()` | 건너뛰기, 조건을 줄 수 있다 |
| `test.only()` | 이 테스트만 실행 (디버깅용, 커밋 전에 지운다) |
| `test.fixme()` | 고쳐야 할 테스트로 표시하고 실행하지 않는다 |
| `test.fail()` | 실패가 예상된다고 표시. 실패하면 통과로, 통과하면 실패로 본다 |
| `test.slow()` | 타임아웃을 세 배로 늘린다 |
| `test.step(name, fn)` | 본문을 단계로 나눠 리포트에 표시 |
| `test.setTimeout(ms)` | 이 테스트만 타임아웃 변경 |

`test.slow()` 를 부르면 기본 타임아웃 30초가 90초가 된다. `testInfo.timeout` 을 찍어 30000에서 90000으로 바뀌는 것을 확인했다. `test.fail()` 로 표시한 테스트 안에서 `expect(1).toBe(2)` 가 실패하자 결과 집계에서 통과로 셌다.

<br/>

## describe 변형

| 변형 | 효과 |
| --- | --- |
| `test.describe.configure(opts)` | 그룹의 실행 방식(`mode`), 재시도(`retries`), 타임아웃 지정 |
| `test.describe.serial()` | 그룹 안 테스트를 순서대로 실행 |
| `test.describe.parallel()` | 그룹 안 테스트를 병렬로 실행 |
| `test.describe.skip()` | 그룹 전체 skip |
| `test.describe.only()` | 이 그룹만 실행 |
| `test.describe.fixme()` | 그룹 전체를 고쳐야 할 것으로 표시 |

1.64.1 타입 정의는 `serial` 과 `parallel` 대신 `test.describe.configure({ mode: 'serial' })` 처럼 `configure` 로 실행 방식을 정하라고 안내한다. 순서대로 실행하는 그룹은 앞 테스트가 실패하면 뒤 테스트를 실행하지 않고, 재시도도 그룹 전체를 다시 돈다. 실행해 보니 첫 테스트가 실패하자 두 번째 테스트는 실행되지 않은 것으로 표시됐다. 공식 문서도 serial은 권하지 않고, 테스트마다 독립적으로 돌 수 있게 만들라고 한다.

<br/>

## 옵션과 확장 메서드

| 메서드 | 용도 |
| --- | --- |
| `test.use({ ... })` | 파일이나 그룹 단위 옵션 (viewport, locale, baseURL 등) |
| `test.extend({ ... })` | 커스텀 fixture 추가 |
| `test.info()` | 현재 테스트 정보 (제목, 파일, 재시도 횟수 등) |

<br/>

## 기본 fixture

| Fixture | 설명 |
| --- | --- |
| `page` | 테스트마다 새로 여는 페이지 (가장 많이 쓴다) |
| `context` | BrowserContext. 쿠키와 storage를 함께 쓰는 단위 |
| `browser` | worker가 함께 쓰는 브라우저 |
| `browserName` | `'chromium'`, `'firefox'`, `'webkit'` 중 하나 |
| `request` | API 테스트용 요청 객체(APIRequestContext) |
| `playwright` | playwright 라이브러리 자체 |

테스트마다 새 context와 새 page를 만들기 때문에 기본으로 서로 격리된다. 쿠키나 로그인 상태가 다른 테스트로 새지 않는다.

<br/>

## 자주 쓰는 패턴

### 그룹에 옵션 적용
```ts
test.describe('한국어 환경', () => {
  test.use({ locale: 'ko-KR' });
  test('...', async ({ page }) => {});
});
```

### 커스텀 fixture
```ts
import { test as base, type Page } from '@playwright/test';

const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    await page.goto('/login');
    // ... 로그인 동작
    await use(page);
  },
});

test('로그인 후 ...', async ({ authedPage }) => {
  // 미리 로그인된 상태로 시작
});
```

`use()` 앞은 준비, 뒤는 정리 코드다. 로그인을 테스트마다 반복하지 않으려면 로그인 상태를 파일로 저장해 두는 방법이 더 빠르다. [인증 정보 저장하기](../../인증%20정보%20저장하기(Authentication%20State)/README.md)에 정리했다.

### step으로 본문 나누기
```ts
test('프로젝트 생성', async ({ page }) => {
  await test.step('메인 진입', async () => {
    await page.goto('/');
  });
  await test.step('이름 입력', async () => {
    await page.getByLabel('이름').fill('foo');
  });
  await test.step('생성 클릭', async () => {
    await page.getByRole('button', { name: '생성' }).click();
  });
});
```

리포트에 단계별로 표시되어, 실패했을 때 어느 단계에서 멈췄는지 바로 보인다.

### 디버깅과 조건부 skip
```ts
test.only('지금 이거만', async ({ page }) => {});

test('WebKit 제외', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit 제외');
  // ...
});
```

`test.only` 가 커밋되면 CI에서 다른 테스트가 모두 빠진 채 통과해 버린다. 설정에 `forbidOnly: !!process.env.CI` 를 두거나 `--forbid-only` 로 실행하면 `.only` 가 남은 순간 실행 자체가 실패한다. `--forbid-only` 로 돌려 `item focused with '.only' is not allowed` 오류가 나는 것을 확인했다.

조건에 `browserName` 처럼 fixture 값이 필요하면 테스트 본문이나 hook 안에서 부른다. `process.env` 처럼 fixture 없이 알 수 있는 조건이면 파일 최상위나 `describe` 안에서 `test.skip(!!process.env.CI, 'CI에서 제외')` 처럼 불러 그 범위의 테스트를 모두 건너뛸 수 있다.

<br/>

## test와 expect의 관계
`test` 는 등록과 실행 API, `expect` 는 검증 API다. 같은 패키지에서 함께 가져온다.

```ts
import { test, expect } from '@playwright/test';

test('...', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toHaveText('Testea');
});
```

이 `expect` 는 조건이 맞을 때까지 기다리는 web-first assertion이라 Vitest의 `expect` 와 다른 객체다. 자세한 내용은 [3장](../03_expect%20객체%20API(expect%20API)/README.md)에서 다룬다.

<br/>

## 공식 문서
- [test API class](https://playwright.dev/docs/api/class-test)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Test Hooks](https://playwright.dev/docs/api/class-test#test-before-each)

메서드 이름과 serial, parallel 안내는 `@playwright/test` 1.64.1 타입 정의로, `slow`, `fail`, serial 실패, `--forbid-only` 동작은 1.64.1과 Chromium에서 실행해 확인했다.

[목차](../README.md) | [이전 장: describe 언제 쓰나](../01_describe%20언제%20쓰나(When%20to%20Use%20describe)/README.md) | [다음 장: expect 객체 API](../03_expect%20객체%20API(expect%20API)/README.md)
