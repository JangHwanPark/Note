## 실무 E2E 예외 케이스 모음
- spec의 안정성을 깨는 대표 사례를 모은 장이다. 항목마다 원인, 왜 그런지, 해결 방법 순서로 적는다
- 지금 프로젝트에서 모두 겪은 것은 아니고, 도메인별 spec이 늘어나면 한두 번씩 마주치게 되는 패턴들이다
- Playwright 동작에 대한 서술은 @playwright/test 1.64.1, Chromium에서 실행하거나 공식 문서로 확인했다. 실행하지 않은 것은 항목에 따로 적었다

### 플래키 테스트 (Flaky Test)
flaky의 사전적 의미는 얇게 벗겨지는, 믿을 수 없는이다.
테스트에서는 코드를 바꾸지 않았는데도 돌릴 때마다 통과와 실패가 오가는 테스트를 말한다. 이 장의 사례 대부분이 플래키 테스트의 원인이다.

<br/>

## 1. 타이밍과 비동기
### 1-1. 하이드레이션 전에 클릭
SSR로 HTML은 이미 그려졌는데 React나 Next.js의 클라이언트 하이드레이션(Hydration)이 끝나기 전에 클릭한 경우다. 이벤트 핸들러가 아직 붙지 않아서 클릭은 들어가도 아무 일도 일어나지 않는다.

CI 러너는 보통 CPU와 메모리가 개발 PC보다 적어서 JS 실행이 느리고, 하이드레이션도 로컬보다 늦게 끝난다. Playwright는 로컬에서도 기본이 헤드리스라서 헤드리스 여부 자체보다 이 자원 차이가 원인이다. 그래서 로컬은 통과하고 CI만 깨지는 전형적인 사례가 된다.

여기서 `await expect(button).toBeEnabled()` 는 신호가 되지 못한다. 서버가 그린 버튼은 하이드레이션 전에도 이미 enabled 상태이기 때문이다. 해결 방법은 아래와 같다.

- 클릭의 결과를 기다리고, 결과가 안 나오면 클릭부터 다시 하게 묶는다. `await expect(async () => { await button.click(); await expect(dialog).toBeVisible({ timeout: 1000 }); }).toPass();`
- 앱이 하이드레이션을 마친 뒤 붙이는 표시(예: `<body data-hydrated="true">`)를 두고 그 표시를 기다린다. 앱 쪽 협조가 필요하다
- 폼 구성을 서버에서 받아 오는 경우는 폼 안의 요소가 보이는 것을 신호로 쓴다. `await expect(form.getByRole('textbox', { name: '이름' })).toBeVisible()`
- `page.waitForTimeout(N)` 으로 시간을 메우지 않는다. 플래키 테스트의 주범이다

### 1-2. 애니메이션 중 클릭과 단언
모달이 열리는 중(transition 300ms)에 클릭하면, 움직이는 요소 위로 클릭 좌표가 떨어져 빗나갈 수 있다. 또 페이드 인 중인 요소에 `toBeVisible` 을 걸면 투명도와 상관없이 바로 통과한다. Playwright의 "보인다"는 크기가 0이 아니고 `visibility: hidden` 이 아니라는 뜻이라서, `opacity: 0` 인 요소도 보이는 것으로 판정한다(실행 결과 `opacity: 0` 은 `true`, `visibility: hidden` 은 `false`).

클릭 같은 동작 전에는 요소가 안정(stable)될 때까지 기다린다. 안정은 연속된 두 애니메이션 프레임에서 요소의 위치와 크기가 같다는 뜻이다. 그래서 transform으로 움직이는 동안은 기다리지만, 투명도만 바뀌는 애니메이션은 기다리지 않는다. 해결 방법은 아래와 같다.

- CI에서 동작 줄이기 미디어 쿼리를 켠다. `use: { reducedMotion: 'reduce' }`. 앱이 이 미디어 쿼리를 따르게 만들어 두었다면 애니메이션이 0초가 된다
- 또는 테스트 환경에서 `* { transition: none !important }` 같은 CSS를 넣는다
- 단언은 최종 상태를 나타내는 값으로 한다. `await expect(modal).toHaveAttribute('data-state', 'open')` 처럼 상태 표시를 기다린다

### 1-3. 입력 디바운스와 스로틀
검색 입력에 300ms 디바운스(debounce)가 걸려 있으면 `fill()` 직후에는 아직 요청이 나가지 않았다. 이때 결과를 단언하면 실패한다. spec이 빠르게 진행할수록 잘 드러나고, 천천히 입력하는 사용자는 겪지 않는다.

해결 방법은 아래와 같다.

- 결과 자체를 기다린다. `await expect(resultList).toBeVisible()` 이나 결과 항목의 텍스트를 단언한다
- 또는 네트워크 응답을 기다린다. `await page.waitForResponse(r => r.url().includes('/api/search'))`
- 디바운스 시간을 환경 변수로 줄이는 방법은 권하지 않는다. 실제 사용자 경험과 spec이 멀어진다

### 1-4. 스켈레톤에서 실제 콘텐츠로 바뀔 때
스켈레톤(skeleton) 컴포넌트가 실제 데이터와 같은 자리에 비슷한 텍스트를 가지면 `getByText('로딩')` 같은 Locator가 뜻하지 않게 스켈레톤을 잡는다.

해결 방법은 아래와 같다.

- 스켈레톤에 `data-testid="skeleton"` 이나 `aria-busy="true"` 를 붙여 구분한다
- 스켈레톤이 사라지길 기다린 뒤 단언한다. `await expect(page.getByTestId('skeleton')).toBeHidden()`

### 1-5. 무한 스크롤과 지연 로딩
목록 아래쪽 항목이 화면에 들어와야 데이터를 받아 오는 구조면 `getByText('마지막 항목')` 은 스크롤하기 전까지 나타나지 않는다.

해결 방법은 아래와 같다.

- 이미 그려진 마지막 항목으로 스크롤해 다음 페이지를 불러온다. `await list.getByRole('listitem').last().scrollIntoViewIfNeeded()` 를 원하는 항목이 나올 때까지 반복하거나 `page.mouse.wheel(0, 1000)` 을 쓴다
- 분량이 많으면 페이지 이동을 직접 호출하거나 API 응답을 흉내 내(mock) 첫 페이지에 다 보이게 한다

<br/>

## 2. 상태 격리
### 2-1. 병렬 워커가 같은 DB 행을 건드림
워커 4개로 돌리면 4개가 동시에 같은 프로젝트 데이터를 고칠 수 있다. 테스트 A가 만든 케이스를 테스트 B가 모르고 지운다. 격리가 부족한 전형적인 경우이고, 로컬 단일 워커로는 안 보이다가 CI에서만 터진다.

해결 방법은 아래와 같다.

- fixture가 테스트마다 고유한 데이터를 만들게 해서 spec끼리 같은 행을 건드리지 않게 한다

  ```ts
  const name = `e2e-${Date.now()}-${randomUUID()}`;
  ```

- 또는 `workers: 1` 로 고정한다. 느려지지만 안전하다
- 완전한 격리가 필요하면 워커마다 DB 스키마를 나눈다(Postgres `SET search_path`). 인프라가 많이 복잡해진다

### 2-2. 쿠키와 localStorage가 테스트 사이에 새는 경우
Playwright는 기본으로 테스트마다 새 브라우저 컨텍스트(BrowserContext)와 새 `page` 를 만든다. `test.describe.configure({ mode: 'serial' })` 로 순서대로 돌려도 테스트마다 `page` 는 새로 만들어진다(실행해 보니 앞 테스트에서 그린 내용이 다음 테스트의 `page` 에 남아 있지 않았다).

상태가 새는 것은 `beforeAll` 에서 `browser.newContext()` 나 `newPage()` 로 직접 만든 컨텍스트를 여러 테스트가 같이 쓸 때다. 이때 앞 테스트의 로그인 쿠키가 다음 테스트에 그대로 남는다.

해결 방법은 아래와 같다.

- 가능하면 기본 `page` fixture를 쓰고, 컨텍스트를 직접 만들어 공유하지 않는다
- 공유가 꼭 필요하면 테스트 시작 시 `context.clearCookies()` 등으로 정리한다
- 무엇이 남았는지는 `await context.storageState()` 를 찍어 보면 보인다

### 2-3. 테스트 순서에 기대는 경우
테스트 A가 항목을 만들고 테스트 B가 그 항목을 클릭한다. A가 건너뛰어지면 B는 항상 실패한다. 각 테스트는 혼자 돌려도 통과해야 하므로 이것은 잘못된 방법이다.

해결 방법은 아래와 같다.

- 공유할 준비 작업은 `beforeAll` 이나 fixture에 드러나게 둔다
- 순서가 꼭 필요한 시나리오(4단계 마법사 같은)는 테스트 하나 안에서 `test.step()` 으로 단계를 나눈다

<br/>

## 3. 인증과 세션
### 3-1. spec 도중 토큰 만료
토큰 유효 시간이 5분인데 spec이 7분 돌면 중간에 401이 난다. 무한 스크롤이나 백그라운드 폴링이 있는 페이지에서 자주 보인다.

해결 방법은 아래와 같다.

- spec이 길어지지 않게 잘게 나눈다
- 저장해 둔 로그인 상태(storageState)가 오래됐으면 fixture에서 다시 로그인해 갱신한다. 로그인 상태 저장은 [인증 정보 저장하기](../../인증%20정보%20저장하기(Authentication%20State)/README.md)에 정리했다
- 또는 CI 환경에서만 토큰 유효 시간을 길게 둔다(환경 변수)

### 3-2. CSRF 토큰 불일치
폼에 숨은 입력 `_csrf` 가 있고 서버가 이 토큰을 검증하는데, spec이 오래된 토큰으로 폼을 제출하는 경우다.

해결 방법은 아래와 같다.

- 가능하면 UI 흐름 그대로(페이지 열기, 입력, 제출) 진행한다. 페이지가 준 토큰을 그대로 들고 간다
- API로 우회할 때는 먼저 토큰부터 받는다(`GET /csrf` 같은 엔드포인트)

### 3-3. 쿠키의 SameSite와 domain
`SameSite=Strict` 쿠키는 다른 사이트에서 넘어오는 이동에 실리지 않는다. OAuth 콜백 같은 흐름에서 세션이 사라지는 원인이 된다. 또 `domain=.example.com` 쿠키는 `localhost` 에서 쓰이지 않는다.

해결 방법은 아래와 같다.

- 테스트 도메인을 운영과 비슷하게 맞춘다(`localhost.test` 같은 별칭과 hosts 파일)
- `context.addCookies()` 로 직접 넣을 때 `domain`, `path`, `sameSite` 를 정확히 맞춘다

<br/>

## 4. 외부 의존
### 4-1. 캡차, 결제, 지도 같은 외부 위젯
외부 도메인 위젯은 대개 iframe 안에 있다. Playwright는 다른 출처(cross-origin)의 iframe 안도 `frameLocator()` 로 들어갈 수 있다(서버 두 개를 띄워 다른 출처 iframe 안의 버튼을 찾고 클릭해 확인). 문제는 들어갈 수 있느냐보다, 외부 위젯이 자동화를 막거나 매번 다르게 동작한다는 점이다.

해결 방법은 아래와 같다.

- 위젯이 만들어 내는 결과 값(숨은 입력)을 기다린다. Turnstile은 `cf-turnstile-response`, reCAPTCHA는 `g-recaptcha-response` 다
- 테스트 환경에서는 위젯을 끄거나 항상 통과하는 테스트 키로 바꾼다(Turnstile 테스트 사이트 키 `1x00000000000000000000AA`)
- Stripe Elements는 공식 테스트 카드(`4242 4242 4242 4242`)를 쓰고 iframe 안 입력에 채운다. `await page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('[name="cardnumber"]').fill(...)`. iframe 이름과 입력 이름은 Stripe 버전에 따라 다르니 확인 필요

### 4-2. 이메일, SMS 인증 흐름
회원가입 후 이메일 링크를 눌러야 인증이 끝나는데, spec이 메일함을 들여다볼 수 없다.

해결 방법은 아래와 같다.

- 테스트 전용 메일 수신 서버를 쓴다. Mailpit, MailHog는 직접 띄우는 SMTP 수신 서버이고, MailSlurp는 외부에서 제공하는 메일함 서비스다. 어느 쪽이든 spec에서 HTTP API로 받은 메일을 조회한다
- 또는 테스트 환경에서만 서버가 응답에 토큰을 실어 주게 한다(환경 변수로 반드시 막아 둔다)
- "이메일 보내기" 단계까지만 spec으로 확인하고, 토큰 발급 뒤의 처리는 인증 엔드포인트를 직접 호출해 확인한다

### 4-3. 파일 업로드와 다운로드
운영체제의 파일 선택 창은 브라우저 밖이라 클릭으로 다룰 수 없다.

해결 방법은 아래와 같다.

- 업로드는 선택 창을 거치지 않고 파일을 직접 넣는다. `await page.getByLabel('첨부').setInputFiles('fixtures/sample.png')`
- 다운로드는 이벤트를 먼저 기다리게 걸고 클릭한다

  ```ts
  const downloadPromise = page.waitForEvent('download');
  await button.click();
  const download = await downloadPromise;
  await download.saveAs('tmp/' + download.suggestedFilename());
  ```

### 4-4. 클립보드
`navigator.clipboard.readText()` 는 보안 컨텍스트와 권한이 필요하다. 헤드리스에서는 권한이 기본으로 거부된다.

해결 방법은 아래와 같다.

- 컨텍스트 옵션에 권한을 준다. `permissions: ['clipboard-read', 'clipboard-write']`. 이 권한 이름은 Chromium 기준이고 브라우저마다 다르다(확인 필요)
- 또는 클립보드를 읽는 대신, 앱이 클립보드에 무엇을 넣었는지 확인하는 테스트 전용 함수를 앱 쪽에 둔다

<br/>

## 5. 브라우저 API 제약
### 5-1. 기본 대화 상자 (alert, confirm, prompt)
Playwright는 `dialog` 이벤트를 듣는 코드가 없으면 대화 상자를 자동으로 닫는다(dismiss). 그래서 spec이 멈추지는 않지만 `confirm()` 은 항상 `false` 를 돌려준다(실행 결과 `false`). 삭제 확인 창 같은 흐름이 소리 없이 취소되는 원인이 된다.

해결 방법은 아래와 같다.

- 동작 전에 처리 방법을 등록한다. `page.once('dialog', d => d.accept())` 또는 `d.dismiss()`
- 가능하면 앱에서 기본 대화 상자 대신 직접 만든 모달을 쓴다. 테스트하기도 쉽고 사용자 경험도 낫다

### 5-2. 위치, 카메라, 알림 권한
권한 요청 창이 뜨면 기대한 흐름으로 진행되지 않는다.

해결 방법은 아래와 같다.

- 컨텍스트 옵션으로 미리 허용한다. `permissions: ['geolocation']`, `geolocation: { latitude, longitude }`
- 카메라와 마이크는 Chromium 실행 인수 `--use-fake-ui-for-media-stream`, `--use-fake-device-for-media-stream` 을 `launchOptions.args` 로 준다

### 5-3. 서비스 워커와 PWA 캐시
첫 방문에 서비스 워커(Service Worker)가 등록되면 두 번째 방문부터 캐시된 옛 HTML이 보일 수 있다.

해결 방법은 아래와 같다.

- 컨텍스트 옵션 `serviceWorkers: 'block'` 으로 등록을 막는다
- 또는 spec 시작 시 등록을 지운다. `await page.evaluate(() => navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())))`

<br/>

## 6. DOM 조작
### 6-1. iframe 경계
일반 `page.getByRole()` 은 iframe 안 요소를 찾지 않는다. 문서가 따로 있기 때문이다.

해결 방법은 iframe을 먼저 고르고 그 안에서 찾는 것이다. `const frame = page.frameLocator('iframe[name="x"]'); await frame.getByRole('button').click()`. 같은 출처든 다른 출처든 같은 방법으로 들어갈 수 있다.

### 6-2. 섀도 DOM
웹 컴포넌트(Lit 등)를 쓰는 디자인 시스템은 요소를 섀도 DOM(Shadow DOM) 안에 둔다.

Playwright의 Locator는 기본으로 열린(open) 섀도 루트 안까지 찾는다. `getByRole` 뿐 아니라 CSS Locator도 그렇다. 예외는 두 가지다. XPath는 섀도 루트를 뚫지 못하고, 닫힌(closed) 섀도 루트는 지원하지 않는다(실행 결과 열린 섀도 안 버튼을 CSS와 `getByRole` 은 1개, XPath는 0개, 닫힌 섀도 안 버튼은 CSS로 0개 찾았다). 1.64.1에는 섀도를 뚫는 별도 메서드가 없다.

해결 방법은 아래와 같다.

- 역할과 이름으로 찾는 Locator를 먼저 쓴다. XPath는 쓰지 않는다
- 닫힌 섀도 루트라면 컴포넌트가 밖으로 내놓은 속성(part 등)이나 결과 값으로 확인한다

### 6-3. 가상 스크롤
react-window, TanStack Virtual 같은 라이브러리는 화면 밖 행을 DOM에 그리지 않는다. 그래서 50번째 행을 찾을 수 없다.

해결 방법은 아래와 같다.

- 스크롤 컨테이너를 직접 움직이며 원하는 행이 나타날 때까지 찾는다. `page.mouse.wheel()` 이나 컨테이너의 `scrollTop` 을 바꾼다
- 또는 테스트용 prop으로 가상화를 끈다(앱 쪽 협조가 필요하다)

### 6-4. 드래그 앤 드롭
`await source.dragTo(target)` 이 @dnd-kit 같은 라이브러리에서 동작하지 않는 경우가 있다. @dnd-kit은 포인터를 누른 뒤 정해 둔 거리 이상 움직여야 드래그로 인식하는 활성 조건(activation constraint)을 둘 수 있는데, `dragTo` 는 기본으로 `mousemove` 를 목표 지점에 한 번만 보내서 이 조건을 못 채울 수 있다. 1.64.1의 `dragTo` 에는 중간 이동을 여러 번 보내는 `steps` 옵션(기본 1)이 있으니 `dragTo(target, { steps: 10 })` 을 먼저 써 본다(타입 정의로 확인, 실제 @dnd-kit에서는 확인 필요). react-dnd의 HTML5 백엔드는 마우스 이벤트가 아니라 브라우저의 drag 이벤트를 써서 원인이 다를 수 있다(확인 필요).

해결 방법은 아래와 같다.

- 동작을 직접 나눠서 보낸다. `source.hover()`, `page.mouse.down()`, `page.mouse.move(x, y, { steps: 10 })`, `target.hover()`, `page.mouse.up()`
- @dnd-kit이 키보드 센서를 지원하면 키보드로 한다. `source.focus()`, Space, 방향키, Space

### 6-5. 파일을 끌어다 놓는 영역
`input[type=file]` 이 아니라 드롭존 위에 파일을 놓아야 하는 UI다.

해결 방법은 아래와 같다.

- 브라우저 안에서 `DataTransfer` 를 만들어 `drop` 이벤트로 보낸다

  ```ts
  const dataTransfer = await page.evaluateHandle(() => {
    const dt = new DataTransfer();
    dt.items.add(new File(['내용'], 'sample.txt', { type: 'text/plain' }));
    return dt;
  });
  await page.getByTestId('dropzone').dispatchEvent('drop', { dataTransfer });
  ```

- 위 코드는 드롭존의 `drop` 이벤트가 `sample.txt` 를 받는 것까지 실행해 확인했다. 드래그 중 화면 효과(`dragenter`, `dragover`)까지 보려면 그 이벤트도 같은 방식으로 보낸다
- 가능하면 앱이 숨은 `input[type=file]` 을 함께 두게 한다. 그러면 `setInputFiles` 로 테스트할 수 있다

### 6-6. 새 탭과 팝업
`target=_blank` 링크를 누르면 새 페이지가 열리는데, 기존 `page` 변수는 그대로 원래 탭을 가리킨다.

해결 방법은 새 페이지 이벤트를 먼저 기다리게 걸고 클릭한 뒤, 이후 작업은 새 페이지로 하는 것이다.

```ts
const pagePromise = context.waitForEvent('page');
await link.click();
const newPage = await pagePromise;
```

<br/>

## 7. 데이터와 시간
### 7-1. 시간대
spec이나 서버가 한국 시간 기준 날짜를 쓰는데 CI가 UTC면 "오늘"이 달라진다.

해결 방법은 아래와 같다.

- 컨텍스트 옵션 `timezoneId: 'Asia/Seoul'` 로 브라우저 시간대를 맞춘다
- 더 안전하게는 앱이 항상 UTC로 저장하고 화면에 보일 때만 바꾸게 한다. spec은 화면에 보이는 값을 단언한다

### 7-2. 로캘
통화와 날짜 형식은 로캘(locale)마다 다르다. 예를 들어 `1,000` 이 de-DE에서는 `1.000` 이다.

해결 방법은 아래와 같다.

- 컨텍스트 옵션 `locale: 'ko-KR'` 로 맞춘다
- 또는 숫자 모양만 단언한다. `await expect(el).toHaveText(/1[.,]000/)`

### 7-3. 랜덤 ID와 UUID
만들 때마다 ID가 다른데 spec이 `toBe('123')` 처럼 값을 박아 두는 경우다.

해결 방법은 아래와 같다.

- 만든 직후 ID를 읽어 둔다. `const id = await el.getAttribute('data-id')`
- 단언은 형식으로 한다. `expect(id).toMatch(/^[0-9a-f-]{36}$/)`

<br/>

## 8. 인프라와 환경
### 8-1. 로컬은 통과, CI만 실패
자주 겪은 원인을 순서대로 적으면 아래와 같다.

1. 운영체제와 설치된 폰트의 차이(글자 폭과 렌더링이 미세하게 달라진다)
2. CI 러너의 CPU와 메모리가 적어 느리고, 그래서 타이밍 문제가 드러남
3. 환경 변수 누락(Turnstile 키, `DATABASE_URL`)
4. 시간대와 로캘 차이
5. CI의 공유 DB가 다른 PR과 충돌

해결 방법은 아래와 같다.

- CI의 trace 파일과 영상을 받아 재생한다. 대부분 여기서 보인다
- 로컬에서 `--headed` 로 화면을 보며 돌려 비교하고 뷰포트를 같게 맞춘다(`viewport: { width: 1280, height: 720 }`)
- 환경 변수가 들어왔는지 확인할 때는 값이 아니라 있는지만 찍는다(`!!process.env.X`). 비밀 값을 로그에 남기지 않는다

### 8-2. CDN과 캐시
정적 파일이 CDN에 캐시되어 spec이 옛 JS로 돌아간다. 배포 직후 처음 돌릴 때 실패한다.

해결 방법은 아래와 같다.

- 배포 뒤 첫 헬스 체크가 통과한 다음 spec을 시작한다. 가장 깔끔한 방법이다
- 또는 `page.route()` 로 CDN 요청을 가로채거나 캐시를 피하는 쿼리를 붙인다

### 8-3. 콘텐츠 보안 정책(CSP)이 스크립트를 막음
엄격한 CSP(Content Security Policy)가 있으면 `page.addScriptTag()` 처럼 페이지에 스크립트를 넣는 동작이 막힌다. `script-src 'none'` 헤더를 준 페이지에서 `addScriptTag` 는 `Executing inline script violates the following Content Security Policy directive` 오류로 실패했고, `bypassCSP: true` 를 주자 통과했다.

해결 방법은 아래와 같다.

- 컨텍스트 옵션 `bypassCSP: true` 로 테스트 컨텍스트에서만 CSP를 무시한다
- 또는 테스트 환경에서만 CSP를 완화한다(환경 변수로 막아 둔다)

### 8-4. 느린 네트워크
CI 러너의 네트워크가 느려 일부 요청이 시간 초과로 끝난다.

해결 방법은 아래와 같다.

- 단언마다 시간을 늘리기보다 응답을 흉내 내는 편이 안정적이다. `await page.route('**/api/slow', r => r.fulfill({ json: { ... } }))`
- 정말 느린 API를 검증하는 일은 별도 spec으로 나눈다

<br/>

## 9. 그 밖에 자주 겪는 경우
### 9-1. 같은 이름의 버튼이 여러 개
페이지에 "삭제" 버튼이 여러 개면 `getByRole('button', { name: '삭제' })` 로 클릭할 때 strict mode 위반으로 실패한다.

해결 방법은 아래와 같다.

- 범위를 좁힌다. `row.getByRole('button', { name: '삭제' })`
- 또는 `.first()`, `.nth(0)` 으로 "첫 번째"라는 뜻을 드러낸다

### 9-2. 토스트가 사라지기 전에 단언
토스트가 3초 뒤 자동으로 사라지면, spec이 늦게 확인할 때 놓친다.

해결 방법은 아래와 같다.

- 클릭 바로 뒤에 단언한다. `await expect(toast).toBeVisible()` 는 나타날 때까지 다시 확인한다
- 또는 토스트를 사용자가 직접 닫게 바꾼다(자동으로 사라지지 않게). 접근성도 좋아진다

### 9-3. 포커스 가두기와 키보드 이동
모달 안에서 Tab 키가 돌지 않거나, 모달을 닫은 뒤 포커스가 엉뚱한 곳에 있는 경우다.

해결 방법은 아래와 같다.

- 포커스를 단언한다. `await expect(page.getByRole('button', { name: '열기' })).toBeFocused()`
- 모달 라이브러리(Radix Dialog 등)의 포커스 처리를 믿고, 단언은 결과만 한다

<br/>

## 10. 일반 원칙
| 원칙 | 뜻 |
| --- | --- |
| 의미로 찾는 Locator 우선 | `getByRole`, `getByLabel` 다음 `getByText`, 그다음 `data-testid`, CSS는 마지막 |
| 결과를 기다린다 | `networkidle`, `waitForTimeout` 대신 동작의 결과를 단언한다 |
| 격리 | 테스트마다 새 데이터, 워커끼리 겹치지 않는 fixture |
| 외부 의존 줄이기 | 위젯, 메일, 결제는 결과 값만 보거나 흉내 낸다 |
| trace와 영상 믿기 | 플래키 테스트 추적은 로그보다 trace 파일이 빠르다 |

<br/>

## 참고 자료
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Auto-waiting (actionability)](https://playwright.dev/docs/actionability)
- [Dialogs](https://playwright.dev/docs/dialogs)
- [Locators: Shadow DOM](https://playwright.dev/docs/locators#locate-in-shadow-dom)
- Cal.com, Documenso 같은 오픈소스의 e2e 폴더: 실제 격리와 fixture 패턴을 보기 좋다

<br/>

[목차](../README.md) | [이전 장: playwright.config.ts](../07_playwright.config.ts(Playwright%20Config)/README.md)
