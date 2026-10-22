## page 객체란 ?
- `page` 는 브라우저의 탭 하나를 조작하는 객체다. 테스트 콜백에 fixture로 들어온다
- 이동, 요소 찾기, 대기, 네트워크 가로채기는 `page` 에서 하고, 클릭과 입력 같은 조작은 `page.getByRole()` 등이 돌려주는 Locator에서 한다
- spec 대부분은 `page.getByRole` 로 찾고, Locator의 `click`, `fill` 로 조작하고, `expect` 로 확인하는 세 줄의 반복이다

```ts
test('...', async ({ page }) => {
  // page 사용
});
```

<br/>

## 이동

| 메서드 | 용도 |
| --- | --- |
| `page.goto(url, opts?)` | URL 이동. `waitUntil` 로 언제 끝난 것으로 볼지 정한다 |
| `page.reload()` | 새로고침 |
| `page.goBack()` / `page.goForward()` | 뒤로, 앞으로 |

`waitUntil` 은 `'load'`(기본값), `'domcontentloaded'`, `'networkidle'`, `'commit'` 중 하나다. `'networkidle'` 은 500ms 동안 네트워크 요청이 없을 때까지 기다리는데, 1.64.1 타입 정의 주석은 이 값을 권하지 않는다(DISCOURAGED). 요청이 계속 오가는 페이지에서는 끝나지 않거나 느려지기 때문이다. 대신 확인하려는 요소를 `expect` 로 기다린다.

설정 파일에 `baseURL` 을 두면 상대 경로로 이동할 수 있다.

```ts
await page.goto('/projects/Testea'); // baseURL이 http://localhost:3000이면 http://localhost:3000/projects/Testea
```

<br/>

## 요소 찾기 (Locator)
`page.getByRole()`, `page.getByLabel()`, `page.getByText()`, `page.locator()` 는 모두 Locator를 돌려준다. Locator는 만드는 순간 요소를 찾지 않고, 조작하거나 확인하는 시점에 찾는다. 그래서 화면이 다시 그려져도 같은 Locator를 계속 쓸 수 있다. 어떤 것을 먼저 쓸지는 [Locator 우선순위](../05_Locator%20우선순위(Locator%20Priority)/README.md)에 정리했다.

<br/>

## 조작
아래는 모두 Locator의 메서드다.

| 메서드 | 용도 |
| --- | --- |
| `locator.click()` | 클릭 |
| `locator.dblclick()` | 더블 클릭 |
| `locator.fill(value)` | input, textarea에 값을 채운다 (기존 내용을 지우고 덮어쓴다) |
| `locator.pressSequentially(text)` | 한 글자씩 키를 눌러 입력 |
| `locator.press(key)` | 키 입력 (`'Enter'`, `'Tab'`, `'Control+A'`) |
| `locator.check()` / `locator.uncheck()` | 체크박스 |
| `locator.selectOption(value)` | `<select>` 선택 |
| `locator.hover()` | 마우스 올리기 |
| `locator.focus()` / `locator.blur()` | 포커스 주기, 빼기 |
| `locator.dragTo(target)` | 다른 Locator로 끌어다 놓기 |
| `locator.setInputFiles(path)` | 파일 업로드 |

조작 메서드는 실행 전에 요소가 보이는지, 안정적인지, 클릭할 수 있는지 같은 조건(actionability)을 확인하고, 맞을 때까지 기다린 뒤 동작한다.

한 글자씩 입력하던 `locator.type()` 은 1.64.1 타입 정의에서 사용 중단(deprecated)으로 표시돼 있다. 아직 동작은 하지만, 대부분은 `fill()` 로 충분하고 키 입력마다 반응하는 화면(자동 완성 등)만 `pressSequentially()` 를 쓰라고 안내한다. 두 메서드로 각각 `ab`, `cd` 를 입력해 `abcd` 가 되는 것을 확인했다.

<br/>

## 조회

| 메서드 | 용도 |
| --- | --- |
| `locator.textContent()` | DOM의 텍스트 (숨긴 텍스트 포함) |
| `locator.innerText()` | 화면에 그려진 텍스트 |
| `locator.inputValue()` | input의 값 |
| `locator.getAttribute(name)` | 속성 값 |
| `locator.count()` | 매칭되는 요소 개수 |
| `locator.isVisible()` | 지금 보이는지 (기다리지 않고 바로 답한다) |

조회 메서드는 기다리지 않고 지금 상태를 돌려준다. 검증에는 기다려 주는 `expect` 를 쓰고, 조회 메서드는 값에 따라 분기해야 할 때만 쓴다.

<br/>

## 대기

| 메서드 | 용도 |
| --- | --- |
| `page.waitForURL(url)` | URL이 바뀔 때까지 |
| `page.waitForLoadState(state)` | `'load'`, `'domcontentloaded'`, `'networkidle'` 상태까지 |
| `page.waitForResponse(url)` | 특정 응답이 올 때까지 |
| `page.waitForRequest(url)` | 특정 요청이 나갈 때까지 |
| `locator.waitFor(opts)` | 요소 상태(`'visible'`, `'hidden'`, `'attached'`, `'detached'`)가 될 때까지 |

대부분은 `expect` 가 기다려 주므로, 명시적 대기는 특정 API 요청과 응답을 확인해야 할 때처럼 화면만으로 알 수 없는 경우에 쓴다. `'networkidle'` 을 권하지 않는 이유는 위 이동 섹션과 같다.

<br/>

## 네트워크 가로채기

| 메서드 | 용도 |
| --- | --- |
| `page.route(url, handler)` | 요청을 가로채 응답을 바꾸거나 막는다 (모킹) |
| `page.unroute(url)` | 가로채기 해제 |

```ts
await page.route('**/api/dashboard', route =>
  route.fulfill({ json: { /* mock */ } })
);
```

<br/>

## 디버깅과 유틸

| 메서드 | 용도 |
| --- | --- |
| `page.screenshot(opts?)` | 스크린샷 |
| `page.evaluate(fn)` | 페이지 안에서 JS 실행 |
| `page.title()` | `document.title` |
| `page.url()` | 현재 URL |
| `page.content()` | 페이지 HTML 전체 |
| `page.pause()` | Playwright Inspector를 띄우고 멈춘다 |

<br/>

## 다이얼로그와 콘솔

```ts
page.on('dialog', dialog => dialog.accept());
page.on('console', msg => console.log(msg.text()));
```

브라우저 기본 다이얼로그(`alert`, `confirm`)와 콘솔 메시지는 이벤트 리스너로 받는다. 리스너는 다이얼로그를 띄우는 동작보다 먼저 등록해야 한다.

<br/>

## 자주 쓰는 패턴

### 폼 제출
```ts
await page.goto('/projects/new');
await page.getByLabel('이름').fill('Test Project');
await page.getByLabel('동의').check();
await page.getByRole('button', { name: '생성' }).click();
await expect(page).toHaveURL(/\/projects\//);
```

### 클립보드
```ts
test('링크 복사', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/projects/1');
  await page.getByRole('button', { name: '링크 복사' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('/projects/');
});
```

Chromium에서는 권한을 주지 않으면 `readText()` 가 `NotAllowedError: ... Read permission denied.` 로 실패했다. `context.grantPermissions()` 로 읽기, 쓰기 권한을 준 뒤에는 복사한 주소를 읽었다. 권한 이름과 동작은 브라우저마다 달라서 Firefox, WebKit은 확인 필요다.

### 파일 업로드
```ts
await page.getByLabel('첨부').setInputFiles('./fixtures/sample.png');
```

<br/>

## 공식 문서
- [Page class](https://playwright.dev/docs/api/class-page)
- [Locators](https://playwright.dev/docs/locators)
- [Auto-waiting (Actionability)](https://playwright.dev/docs/actionability)

`waitUntil` 값, `'networkidle'` 과 `type()` 에 대한 안내는 `@playwright/test` 1.64.1 타입 정의에서, `type()` 과 `pressSequentially()` 입력 결과와 클립보드 권한 동작은 1.64.1과 Chromium에서 실행해 확인했다.

[목차](../README.md) | [이전 장: expect 객체 API](../03_expect%20객체%20API(expect%20API)/README.md) | [다음 장: Locator 우선순위](../05_Locator%20우선순위(Locator%20Priority)/README.md)
