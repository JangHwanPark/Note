# 인증정보 추가하기 (Authentication setup)
로그인이 필요한 페이지를 테스트할 때, **모든 spec마다 로그인 폼을 다시 채우는 건 느리고 깨지기 쉽다**. Playwright의 정석은 "한 번만 로그인 → 그 상태를 파일로 저장 → 모든 테스트가 그 파일을 재사용"하는 패턴이다. 이걸 `setup` 프로젝트로 구현한다.

## 핵심 3요소

| 요소 | 역할 |
| --- | --- |
| `auth.setup.ts` | 실제 로그인 1회 수행 후 인증 상태를 파일로 저장 |
| `storageState` | 저장된 인증 파일을 테스트 컨텍스트에 주입 |
| `dependencies` | "모든 테스트 전에 setup 먼저 돌려라"는 순서 보장 |

## 흐름

```
playwright test 실행
└─ [setup 프로젝트]  auth.setup.ts 실행 → 로그인 → user.json 저장
   └─ [chromium 프로젝트]  user.json을 storageState로 로드한 채 spec 실행
      └─ dashboard.spec.ts  // 이미 로그인된 상태로 시작, 로그인 코드 0줄
```

## 1. 로그인 setup 작성

```ts
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('https://myapp.example.com/login');
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // 쿠키가 실제로 세팅될 때까지 기다린 뒤 저장하는 게 핵심.
  // 로그인은 보통 여러 리다이렉트를 거치며 쿠키를 심는다.
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // cookies + localStorage + IndexedDB 를 한 파일로 저장
  await page.context().storageState({ path: authFile });
});
```

> `test as setup`은 그냥 `test`를 의미 있는 이름으로 별칭한 것뿐이다. 마법 아님 — config의 `testMatch`로 "이 파일은 setup"이라고 구분한다.

## 2. config에서 setup → 테스트 의존성 연결

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // setup 프로젝트: *.setup.ts 만 골라 먼저 실행
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', // 저장된 인증 상태 주입
      },
      dependencies: ['setup'], // setup이 끝나야 이 프로젝트가 시작됨
    },
  ],
});
```

## 3. 테스트에선 로그인 코드 없이 바로 시작

```ts
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('인증 상태에서 대시보드가 보인다', async ({ page }) => {
  await page.goto('/dashboard'); // 이미 로그인된 채로 시작
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

## 특정 테스트만 비로그인으로

공개 페이지(랜딩, 로그인 화면 자체)는 인증 상태를 비워야 한다. 파일/`describe` 단위로 오버라이드:

```ts
test.use({ storageState: { cookies: [], origins: [] } });

test('비로그인 상태에서 홈이 보인다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
```

## 더 빠른 대안: API 로그인

UI 폼을 거치지 않고 로그인 API를 직접 때려 상태만 저장하면 더 빠르고 안정적이다. 단일 공유 계정이면 이게 best.

```ts
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via API', async ({ request }) => {
  await request.post('https://myapp.example.com/api/login', {
    form: { user: process.env.TEST_USER!, password: process.env.TEST_PW! },
  });
  await request.storageState({ path: authFile });
});
```

## 역할별 다중 계정 (admin / user)

setup 안에서 계정별로 다른 파일에 저장하고, spec에서 `test.use`로 골라 쓴다.

```ts
// auth.setup.ts — 두 개의 setup 함수
setup('auth as admin', async ({ page }) => { /* ... */ await page.context().storageState({ path: 'playwright/.auth/admin.json' }); });
setup('auth as user',  async ({ page }) => { /* ... */ await page.context().storageState({ path: 'playwright/.auth/user.json'  }); });

// admin.spec.ts
test.use({ storageState: 'playwright/.auth/admin.json' });
```

## 함정 (Gotchas)

| 함정 | 대응 |
| --- | --- |
| 저장 시점에 쿠키가 아직 안 심김 | `storageState()` 전에 `waitForURL` / `expect(...).toBeVisible()`로 로그인 완료를 보장 |
| 인증 파일이 git에 커밋됨 (자격증명 유출) | `.gitignore`에 `playwright/.auth/` 추가 |
| 자격증명을 코드에 하드코딩 | `process.env`로 빼고 `.env`/CI secret 사용 |
| 토큰 만료로 다음 실행에서 인증 실패 | setup은 매 실행마다 새로 도므로 보통 OK. 장기 캐시한다면 만료 체크 후 재로그인 로직 추가 |
| 공개 페이지 테스트가 로그인 상태로 돌아 깨짐 | 해당 spec에 `test.use({ storageState: { cookies: [], origins: [] } })` |

```gitignore
# .gitignore
playwright/.auth/
```

## 결론
- **로그인은 `setup` 프로젝트에서 단 한 번** → `storageState`로 파일 저장.
- 나머지 프로젝트는 `dependencies: ['setup']` + `use.storageState`로 그 파일을 재사용 → 테스트 본문엔 로그인 코드가 사라진다.
- 속도가 중요하면 UI 대신 **API 로그인**, 권한 시나리오가 필요하면 **역할별 파일 분리**.
- 인증 파일·자격증명은 반드시 `.gitignore` + `env`로 격리.

## 참고
- [Playwright Authentication 공식 문서](https://playwright.dev/docs/auth)
- [관련 노트: 07. playwright.config.ts](../reference/07.%20playwright.config.ts.md) — `projects` / `dependencies` / `use` 옵션 상세
