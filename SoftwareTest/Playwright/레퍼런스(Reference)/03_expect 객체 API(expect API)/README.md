## expect 객체란 ?
- `@playwright/test` 의 `expect` 는 Playwright 전용 web-first assertion이다
- Locator와 Page를 대상으로 하는 matcher는 바로 판정하지 않고, 조건이 맞을 때까지 다시 확인하며 기다린다(기본 5초)
- 숫자나 객체 같은 일반 값에 쓰는 matcher는 Vitest처럼 바로 판정한다

```ts
import { test, expect } from '@playwright/test';
```

### web-first assertion
assertion의 사전적 의미는 주장, 단언이다. 테스트에서는 "이 값은 이래야 한다"고 못 박아 두고 아니면 실패시키는 확인 문장을 말한다.
web-first는 웹 화면이 비동기로 바뀐다는 것을 먼저 전제한다는 뜻이다. 화면은 클릭 직후가 아니라 조금 뒤에 바뀌는 경우가 많으므로, 확인을 한 번만 하지 않고 정해진 시간 동안 반복한다.

<br/>

## 왜 자동으로 기다릴까
웹 화면은 요청 응답이나 애니메이션 때문에 조금 늦게 바뀐다. 즉시 판정하는 assertion은 바뀌기 전 화면을 보고 실패해서, 같은 테스트가 돌릴 때마다 통과와 실패를 오가는(flaky) 원인이 된다.

```ts
// 즉시 판정 (Vitest + jsdom + jest-dom 식): 토스트가 뜨기 전에 확인하면 실패한다
expect(document.querySelector('.toast')).toBeVisible();

// Playwright: 토스트가 나타날 때까지 기다린 뒤 판정한다
await expect(page.getByText('저장되었습니다')).toBeVisible();
```

이 덕분에 `waitFor` 같은 명시적 대기를 거의 쓰지 않아도 된다. 대신 `await` 를 빠뜨리면 기다리지 않고 다음 줄로 넘어가므로, Locator와 Page 대상 assertion에는 반드시 `await` 를 붙인다.

기본 대기 시간은 5초다. 없는 요소에 `toBeVisible()` 을 걸었더니 약 5초 뒤에 실패하는 것을 확인했다.

<br/>

## 자주 쓰는 matcher

### Locator 대상

| Matcher | 의미 |
| --- | --- |
| `toBeVisible()` | DOM에 있고 화면에 보인다 |
| `toBeHidden()` | DOM에 없거나 보이지 않는다 |
| `toBeEnabled()` / `toBeDisabled()` | 버튼 등의 활성 상태 |
| `toBeChecked()` | 체크박스, 라디오가 체크됨 |
| `toBeFocused()` | 포커스를 받음 |
| `toBeEmpty()` | 입력창이면 값이 비었고, 그 밖의 요소면 안에 텍스트가 없다 |
| `toHaveText(text)` | 텍스트 일치 (정규식 가능) |
| `toContainText(text)` | 텍스트 부분 일치 |
| `toHaveValue(value)` | input, textarea의 값 |
| `toHaveAttribute(name, value)` | 속성 값 |
| `toHaveClass(cls)` | class 속성 전체가 일치 (정규식 가능) |
| `toContainClass(cls)` | 주어진 클래스를 포함 |
| `toHaveCount(n)` | 매칭되는 요소 개수 |
| `toBeInViewport()` | 뷰포트 안에 있음 |

`toHaveClass` 는 문자열을 주면 class 속성 전체와 비교한다. `class="row middle selected"` 인 요소에 `toHaveClass('selected')` 를 걸면 실패하고, `toContainClass('selected')` 나 `toHaveClass(/selected/)` 는 통과했다. 클래스 하나만 확인하려면 `toContainClass` 를 쓴다.

### Page 대상

| Matcher | 의미 |
| --- | --- |
| `toHaveURL(url)` | 현재 URL 일치 (정규식 가능) |
| `toHaveTitle(title)` | `document.title` 일치 |
| `toHaveScreenshot()` | 기준 스크린샷과 비교 (시각 회귀 테스트) |

### 일반 값 (즉시 판정)

```ts
expect(2 + 2).toBe(4);
expect({ a: 1 }).toEqual({ a: 1 });
expect([1, 2, 3]).toContain(2);
```

Vitest와 같은 방식이라 `await` 를 붙이지 않는다.

<br/>

## 부정, soft, poll

```ts
// 부정: 조건이 아니게 될 때까지 기다린다
await expect(locator).not.toBeVisible();

// soft: 실패해도 테스트를 멈추지 않고, 끝에서 모아서 실패로 보고한다
await expect.soft(locator).toHaveText('A');
await expect.soft(locator2).toHaveText('B');

// poll: Locator가 아닌 값을 조건이 맞을 때까지 반복해서 확인한다
await expect.poll(async () => {
  const res = await page.request.get('/api/status');
  return res.status();
}).toBe(200);
```

`expect.poll` 은 API 응답이나 DB 값처럼 화면 요소가 아닌 것을 기다릴 때 쓴다.

<br/>

## 타임아웃 바꾸기

```ts
await expect(locator).toBeVisible({ timeout: 10_000 });
```

5초로 부족할 때만 늘린다. 늘려야 통과하는 테스트는 실제로 화면이 느린 것일 수 있어서, 시간을 늘리기 전에 원인을 먼저 본다. 프로젝트 전체 기본값은 설정 파일의 `expect.timeout` 으로 바꾼다([7장](../07_playwright.config.ts(Playwright%20Config)/README.md)).

<br/>

## 자주 쓰는 패턴

### 토스트 표시 확인
```ts
await page.getByRole('button', { name: '저장' }).click();
await expect(page.getByText('저장되었습니다')).toBeVisible();
```

### 페이지 이동 확인
```ts
await page.getByRole('button', { name: '생성' }).click();
await expect(page).toHaveURL(/\/projects\/[\w-]+/);
```

### 폼 검증 메시지
```ts
await page.getByRole('button', { name: '다음' }).click();
await expect(page.getByText('이름을 입력하세요')).toBeVisible();
await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
```

### 목록 항목 개수
```ts
await expect(page.getByRole('listitem')).toHaveCount(5);
```

<br/>

## Vitest의 expect와 헷갈리지 않기

| 항목 | Vitest expect | Playwright expect |
| --- | --- | --- |
| 가져오는 곳 | `'vitest'` | `'@playwright/test'` |
| `await` | 대부분 필요 없음 | Locator, Page 대상은 필수 |
| 자동 대기 | 없음 | 있음 (web-first) |
| 주로 쓰는 대상 | 값, jest-dom 확장 matcher | Locator, Page, 일반 값 |

Playwright spec 안에서는 `'@playwright/test'` 의 `expect` 만 쓴다. 두 `expect` 를 섞으면 어느 쪽이 기다리는지 헷갈린다.

정리하면 Locator와 Page를 대상으로 할 때는 `await expect(...)` 로 쓰고, 기다림은 `expect` 에 맡긴다.

<br/>

## 공식 문서
- [Assertions](https://playwright.dev/docs/test-assertions)
- [LocatorAssertions](https://playwright.dev/docs/api/class-locatorassertions)
- [Soft assertions](https://playwright.dev/docs/test-assertions#soft-assertions)
- [expect.poll](https://playwright.dev/docs/test-assertions#expectpoll)

기본 5초 대기, `toBeHidden`, `toBeEmpty`, `toHaveClass` 와 `toContainClass` 의 차이는 `@playwright/test` 1.64.1과 Chromium에서 실행해 확인했다.

[목차](../README.md) | [이전 장: test 객체 API](../02_test%20객체%20API(test%20API)/README.md) | [다음 장: page 객체 주요 메서드](../04_page%20객체%20주요%20메서드(page%20Methods)/README.md)
