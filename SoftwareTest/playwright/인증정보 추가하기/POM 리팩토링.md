# 인증정보 추가하기 — POM 형식으로 리팩토링

[기본 setup 노트](./README.md)의 `auth.setup.ts`는 로그인 절차(셀렉터 + 클릭 순서)를 setup 파일 안에 그대로 박아 넣은 **절차형 코드**다. 동작은 하지만:

- 로그인 폼 셀렉터가 바뀌면 setup·재로그인 헬퍼 등 **여러 곳을 동시에 고쳐야** 한다.
- "로그인한다"는 의도가 `fill` / `click` 나열에 묻혀 **읽히지 않는다**.
- 같은 로그인 단계를 다른 spec에서 재사용할 방법이 없다.

POM(Page Object Model)은 **"한 페이지의 셀렉터 + 행동"을 클래스 하나에 캡슐화**해서 이 셋을 동시에 해결한다.

## 리팩토링 전후 한눈에

```
[Before] 절차형
auth.setup.ts ─ goto/fill/fill/click/waitForURL  ← 셀렉터가 setup에 노출

[After] POM
auth.setup.ts ─ new LoginPage(page).login(id, pw) ← 의도만 노출
                      └─ LoginPage 클래스가 셀렉터·단계를 독점 소유
```

| 관점 | Before (절차형) | After (POM) |
| --- | --- | --- |
| 셀렉터 위치 | setup 파일에 흩어짐 | `LoginPage` 한 곳 |
| 셀렉터 변경 영향 | 사용처 전부 수정 | `LoginPage`만 수정 |
| setup 가독성 | 단계 나열 | `login()` 한 줄 |
| 재사용 | 복붙 | `LoginPage` import |

## 1. 폴더 구조

```
e2e/
├─ pages/
│  └─ LoginPage.ts        ← 로그인 페이지의 셀렉터 + 행동
├─ tests/
│  ├─ auth.setup.ts       ← LoginPage를 호출만
│  └─ dashboard.spec.ts
└─ playwright/.auth/user.json   (gitignore 대상)
```

## 2. Page Object 클래스

```ts
// e2e/pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  // 셀렉터를 readonly Locator로 한 곳에 모아 소유
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  /** 로그인 폼 작성 → 제출 → 인증 완료까지를 한 행동으로 캡슐화 */
  async login(email: string, password: string) {
    await this.goto();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    // 쿠키가 실제로 심길 때까지 기다리는 책임도 페이지 객체가 가진다
    await this.page.waitForURL('**/dashboard');
    await expect(
      this.page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  }
}
```

> 포인트: 셀렉터는 **`private readonly Locator`** 로 숨기고, 외부에는 `login()` 같은 **행동 메서드만** 노출한다. spec/setup은 "어떻게(셀렉터)"를 모르고 "무엇을(login)"만 안다.

## 3. setup이 POM을 호출

```ts
// e2e/tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(
    process.env.TEST_USER_EMAIL!,
    process.env.TEST_USER_PASSWORD!,
  );
  await page.context().storageState({ path: authFile });
});
```

setup의 책임이 **"로그인 시킨다(LoginPage) + 상태를 저장한다(storageState)"** 두 줄로 정리됐다. 셀렉터 변경은 이제 `LoginPage.ts`만 건드린다. `playwright.config.ts`의 `projects` / `dependencies` 설정은 [기본 노트](./README.md#2-config에서-setup--테스트-의존성-연결)와 동일하게 유지.

## 4. (한 단계 더) fixture로 LoginPage 자동 주입

매번 `new LoginPage(page)` 하는 것도 반복이다. `test`를 확장해 fixture로 주입하면 spec에서 바로 꺼내 쓸 수 있다.

```ts
// e2e/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
export { expect } from '@playwright/test';
```

```ts
// 사용처 — 비로그인 로그인 동작을 검증하는 spec 등에서
import { test, expect } from '../fixtures';

test('잘못된 비밀번호면 에러 메시지', async ({ loginPage, page }) => {
  await loginPage.login('user@test.com', 'wrong-pw');
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});
```

## POM 적용 시 지켜야 할 선

| 원칙 | 이유 |
| --- | --- |
| 셀렉터는 page object 안에서만 정의 | 변경 지점을 1곳으로 — POM의 존재 이유 |
| 메서드는 "행동" 단위 (`login`), getter 남발 X | spec이 셀렉터를 다시 알게 되면 캡슐화 깨짐 |
| `expect` 단언은 신중히 — 행동 보장용만 | 페이지 객체에 테스트별 검증까지 넣으면 재사용성 하락. 일반 검증은 spec에 |
| page object는 상태를 갖지 않게 | 테스트 간 누수 방지. 데이터는 인자로 받기 |

## 결론

- 절차형 setup의 `fill/click` 나열을 **`LoginPage` 클래스**로 캡슐화 → 셀렉터 변경은 한 파일로 국소화, setup은 의도만 남는다.
- setup은 `new LoginPage(page).login()` + `storageState()` 두 줄. config 연결은 기본 노트와 동일.
- 반복 생성이 거슬리면 **fixture로 LoginPage 주입**까지 진행.
- 핵심 규칙: **셀렉터는 page object가 독점, 외부엔 행동만 노출**.

## 참고

- [기본 노트: 인증정보 추가하기 (setup)](./README.md) — setup 프로젝트 / storageState / dependencies 기초
- [Playwright Page Object Models 공식 문서](https://playwright.dev/docs/pom)
- [Playwright Fixtures 공식 문서](https://playwright.dev/docs/test-fixtures)
