## 왜 로그인 상태를 저장할까
- 로그인이 필요한 페이지를 테스트할 때 spec마다 로그인 폼을 다시 채우면 느리고 깨지기 쉽다
- Playwright가 권하는 방법은 한 번만 로그인하고, 그 상태를 파일로 저장하고, 모든 테스트가 그 파일을 다시 쓰는 것이다. 이 일을 `setup` 프로젝트로 한다
- 아래 코드는 @playwright/test 1.64.1에서 로그인 폼과 쿠키를 흉내 낸 작은 서버를 띄워 실제로 돌려 확인했다. 확인할 때는 `baseURL` 을 그 서버 주소로 두고 계정은 테스트용 값을 넣었다

### 저장 상태 (Storage State)
storage의 사전적 의미는 저장, 보관이고 state는 상태다.
Playwright에서는 브라우저 컨텍스트가 가진 쿠키와 출처(origin)별 localStorage를 JSON 파일 하나로 저장한 것을 말한다. 이 파일을 새 컨텍스트에 넣으면 로그인한 상태로 시작한다. 놀이공원 입장 팔찌를 받아 두면 놀이기구마다 표를 다시 사지 않아도 되는 것과 같다.

<br/>

## 핵심 세 가지
| 요소 | 하는 일 |
| --- | --- |
| `auth.setup.ts` | 실제 로그인을 한 번 하고 로그인 상태를 파일로 저장한다 |
| `storageState` | 저장한 파일을 테스트의 브라우저 컨텍스트에 넣는다 |
| `dependencies` | 모든 테스트보다 setup이 먼저 돌게 순서를 보장한다 |

```
playwright test 실행
└─ [setup 프로젝트]  auth.setup.ts 실행 → 로그인 → user.json 저장
   └─ [chromium 프로젝트]  user.json을 storageState로 넣은 채 spec 실행
      └─ dashboard.spec.ts  // 이미 로그인한 상태로 시작하므로 로그인 코드가 없다
```

<br/>

## 1. 로그인 setup 작성
```ts
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login'); // config의 use.baseURL 기준
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // 쿠키가 실제로 심긴 뒤에 저장해야 한다.
  // 로그인은 보통 여러 번 이동하면서 쿠키를 심는다.
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // 쿠키와 localStorage를 파일 하나로 저장한다
  await page.context().storageState({ path: authFile });
});
```

`test as setup` 은 `test` 에 알아보기 쉬운 이름을 붙인 것뿐이다. 이 파일이 setup이라는 구분은 config의 `testMatch` 가 한다.

기본 저장 대상은 쿠키와 localStorage다. IndexedDB는 기본으로 저장하지 않는다. localStorage와 IndexedDB에 값을 넣고 저장해 보니, 기본 호출은 출처마다 `localStorage` 만 담았고 `storageState({ path, indexedDB: true })` 로 불러야 `indexedDB` 까지 담았다. Firebase 인증처럼 토큰을 IndexedDB에 두는 앱이면 이 옵션을 켠다.

<br/>

## 2. config에서 setup과 테스트를 잇기
```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: { baseURL: 'https://myapp.example.com' }, // page.goto('/login') 의 기준 주소
  projects: [
    // setup 프로젝트: *.setup.ts 만 골라 먼저 실행한다
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', // 저장한 로그인 상태를 넣는다
      },
      dependencies: ['setup'], // setup이 끝나야 이 프로젝트가 시작된다
    },
  ],
});
```

config 옵션 전반은 [레퍼런스 7장 playwright.config.ts](../레퍼런스(Reference)/07_playwright.config.ts(Playwright%20Config)/README.md)에 정리했다.

<br/>

## 3. 테스트는 로그인 코드 없이 바로 시작
```ts
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('인증 상태에서 대시보드가 보인다', async ({ page }) => {
  await page.goto('/dashboard'); // 이미 로그인한 채로 시작한다
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

실행하면 `[setup]` 프로젝트의 로그인이 먼저 돌고, 이어서 `[chromium]` 프로젝트의 spec이 로그인한 상태로 통과했다.

<br/>

## 특정 테스트만 비로그인으로
랜딩이나 로그인 화면처럼 공개된 페이지는 로그인 상태를 비워야 한다. 파일이나 `describe` 단위로 덮어쓴다.

```ts
test.use({ storageState: { cookies: [], origins: [] } });

test('비로그인 상태에서 홈이 보인다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
```

<br/>

## 더 빠른 방법: API로 로그인
UI 폼을 거치지 않고 로그인 API를 직접 호출해 상태만 저장하면 더 빠르고 안정적이다. 공유 계정 하나만 쓰는 경우에 가장 알맞다.

```ts
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via API', async ({ request }) => {
  const response = await request.post('/api/login', {
    form: { email: process.env.TEST_USER_EMAIL!, password: process.env.TEST_USER_PASSWORD! },
  });
  await expect(response).toBeOK(); // 로그인이 실패했으면 여기서 멈춘다
  await request.storageState({ path: authFile });
});
```

저장하기 전에 `expect(response).toBeOK()` 로 응답이 2xx인지 확인한다. 확인 없이 저장하면 로그인이 실패해도 빈 상태 파일이 만들어져, 실패 원인이 엉뚱한 spec에서 드러난다. `request` fixture도 config의 `baseURL` 을 쓰고 응답의 쿠키를 기억하므로 `request.storageState()` 로 같은 형식의 파일을 만들 수 있다. 이렇게 만든 파일을 `test.use({ storageState })` 로 넣은 spec도 로그인한 상태로 통과했다.

<br/>

## 역할별 계정 나누기 (admin, user)
setup에서 계정마다 다른 파일에 저장하고, spec에서 `test.use` 로 골라 쓴다.

```ts
// auth.setup.ts: setup 함수 두 개
setup('auth as admin', async ({ page }) => { /* ... */ await page.context().storageState({ path: 'playwright/.auth/admin.json' }); });
setup('auth as user',  async ({ page }) => { /* ... */ await page.context().storageState({ path: 'playwright/.auth/user.json'  }); });

// admin.spec.ts
test.use({ storageState: 'playwright/.auth/admin.json' });
```

<br/>

## 빠지기 쉬운 함정
| 함정 | 대응 |
| --- | --- |
| 저장하는 순간 쿠키가 아직 안 심김 | `storageState()` 전에 `waitForURL`, `expect(...).toBeVisible()` 로 로그인이 끝났는지 확인한다 |
| 인증 파일이 git에 올라감(자격 증명 유출) | `.gitignore` 에 `playwright/.auth/` 를 넣는다 |
| 자격 증명을 코드에 적음 | `process.env` 로 빼고 `.env` 나 CI 비밀 값을 쓴다 |
| 토큰이 만료되어 다음 실행에서 인증 실패 | setup이 실행마다 새로 돌므로 보통 문제없다. 파일을 오래 재사용한다면 만료를 확인하고 다시 로그인하는 처리를 둔다 |
| 공개 페이지 테스트가 로그인 상태로 돌아 실패 | 그 spec에 `test.use({ storageState: { cookies: [], origins: [] } })` 를 둔다 |
| IndexedDB에 둔 토큰이 저장되지 않음 | `storageState({ path, indexedDB: true })` 로 저장한다 |

```gitignore
# .gitignore
playwright/.auth/
```

정리하면 로그인은 `setup` 프로젝트에서 한 번만 하고 `storageState` 로 파일에 저장한다. 나머지 프로젝트는 `dependencies: ['setup']` 과 `use.storageState` 로 그 파일을 다시 써서 테스트 본문에서 로그인 코드를 없앤다. 속도가 중요하면 API 로그인, 권한별 시나리오가 필요하면 계정별 파일을 쓴다. 로그인 절차를 페이지 객체로 옮기는 방법은 [POM 리팩토링](../POM%20리팩토링(POM%20Refactoring)/README.md)에 정리했다.

<br/>

## 참고 자료
- [Authentication](https://playwright.dev/docs/auth)
- [BrowserContext.storageState()](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)
