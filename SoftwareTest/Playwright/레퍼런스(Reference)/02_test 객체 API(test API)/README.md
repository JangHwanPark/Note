# test 객체 API

`@playwright/test`에서 import하는 `test`는 단순한 함수가 아니라 **메서드를 잔뜩 달고 있는 객체**다. test 케이스를 등록하는 함수로도 쓰이고, 그 위에 그룹화·hook·옵션·fixture API가 다 붙어 있다.

```ts
import { test, expect } from '@playwright/test';
```

## 기본 사용

```ts
test('이름', async ({ page }) => {
  // 테스트 본문
});
```

첫 인자: 테스트 이름. 두 번째 인자: async 함수, 인자는 **fixture**(자동 주입).

## 핵심 메서드 (자주 씀)

| 메서드 | 용도 |
| --- | --- |
| `test.describe(name, fn)` | 그룹화 + 리포트 트리 |
| `test.beforeEach(fn)` | 각 test 직전 |
| `test.afterEach(fn)` | 각 test 직후 |
| `test.beforeAll(fn)` | 파일·describe 단위 1회 |
| `test.afterAll(fn)` | 파일·describe 단위 1회 |
| `test.skip()` | 건너뛰기 (조건 가능) |
| `test.only()` | 그것만 실행 (디버깅용, 커밋 전 제거) |
| `test.fixme()` | "고쳐야 함" 표시, 실행 안 됨 |
| `test.fail()` | 실패가 예상됨 (성공하면 fail) |
| `test.slow()` | 타임아웃 3배로 (네트워크 느린 시나리오) |
| `test.step(name, fn)` | 본문 안 step 그룹화 (리포트 가독성) |
| `test.setTimeout(ms)` | 이 test만 타임아웃 변경 |

## describe 변형

| 변형 | 효과 |
| --- | --- |
| `test.describe.serial()` | 그룹 안 test를 순차 실행 (병렬 X) |
| `test.describe.parallel()` | 명시적 병렬 |
| `test.describe.skip()` | 그룹 째로 skip |
| `test.describe.only()` | 그룹만 실행 |
| `test.describe.fixme()` | 그룹 "고쳐야 함" |
| `test.describe.configure(opts)` | retries·mode 등 그룹 옵션 |

## 옵션·확장 메서드

| 메서드 | 용도 |
| --- | --- |
| `test.use({ ... })` | 그룹 단위 옵션 (viewport, locale, baseURL 등) |
| `test.extend({ ... })` | **커스텀 fixture 추가** — Playwright의 진짜 시작점 |
| `test.info()` | 현재 test 정보 (제목, 파일, retry 횟수 등) |

## 콜백 인자(Fixture)

`async ({ page }) => {}` 처럼 destructuring으로 받는 게 fixture. 기본 제공:

| Fixture | 설명 |
| --- | --- |
| `page` | 새 페이지 (가장 많이 씀) |
| `context` | BrowserContext. 쿠키·storage 공유 단위 |
| `browser` | 전체 브라우저 |
| `browserName` | 'chromium' / 'firefox' / 'webkit' |
| `request` | API 테스트용 fetch context |
| `playwright` | playwright 인스턴스 |

각 test는 기본적으로 **새 context + 새 page** → 자동 격리.

## 자주 쓰는 패턴

### 옵션 그룹 적용
```ts
test.describe('한국어 환경', () => {
  test.use({ locale: 'ko-KR' });
  test('...', async ({ page }) => {});
});
```

### 커스텀 fixture
```ts
const test = base.extend({
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

### step으로 본문 가독성
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

리포트에 단계별로 표시되어 디버깅 쉬움.

### 디버깅용
```ts
test.only('지금 이거만', async ({ page }) => {});
// ↑ 커밋 전 반드시 제거. CI에 들어가면 다른 test 다 skip됨.

test.skip(browserName === 'webkit', 'WebKit 제외');
// 조건부 skip
```

## test와 expect의 관계

`test`는 등록·실행 API, `expect`는 검증 API. 별개로 import해서 같이 쓴다.

```ts
import { test, expect } from '@playwright/test';

test('...', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toHaveText('Testea');
});
```

`expect`는 Playwright 전용 web-first assertion이라 자동 wait 포함. vitest의 `expect`와는 다른 객체.

## 한 줄 요약

> `test`는 등록 함수이자 그룹화·hook·skip·fixture 확장의 진입점. `test()`로 케이스를 만들고, `test.describe`로 묶고, `test.extend`로 fixture를 만드는 게 큰 그림.

## 공식 문서

- [test API class](https://playwright.dev/docs/api/class-test)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures) — `test.extend` 패턴
- [Test Hooks](https://playwright.dev/docs/api/class-test#test-before-each)
