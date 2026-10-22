## 왜 리팩토링했나
- [인증 정보 저장하기](../인증%20정보%20저장하기(Authentication%20State)/README.md)의 `auth.setup.ts` 는 로그인 절차(Locator와 클릭 순서)를 setup 파일 안에 그대로 적은 절차형 코드다
- 동작은 하지만 로그인 폼의 Locator가 바뀌면 setup, 다시 로그인하는 helper 등 여러 곳을 함께 고쳐야 한다. "로그인한다"는 의도가 `fill`, `click` 나열에 묻혀 잘 읽히지 않고, 같은 로그인 단계를 다른 spec에서 다시 쓸 방법도 없다
- POM(Page Object Model)은 한 페이지의 Locator와 동작을 클래스 하나에 모아 이 세 가지를 함께 해결한다. POM 자체는 [POM 노트](../POM(Page%20Object%20Model)/README.md)에 정리했다
- 아래 코드는 @playwright/test 1.64.1에서 로그인 폼을 흉내 낸 작은 서버를 띄워 실제로 돌려 확인했다

<br/>

## 리팩토링 전후
```
[Before] 절차형
auth.setup.ts ─ goto/fill/fill/click/waitForURL  ← Locator가 setup에 드러난다

[After] POM
auth.setup.ts ─ new LoginPage(page).login(id, pw) ← 의도만 드러난다
                      └─ LoginPage 클래스가 Locator와 단계를 혼자 가진다
```

| 관점 | Before (절차형) | After (POM) |
| --- | --- | --- |
| Locator 위치 | setup 파일에 흩어짐 | `LoginPage` 한 곳 |
| Locator가 바뀔 때 고칠 곳 | 쓰는 곳 전부 | `LoginPage` 만 |
| setup 읽기 | 단계 나열 | `login()` 한 줄 |
| 다시 쓰기 | 복사해 붙이기 | `LoginPage` 를 가져다 쓰기 |

<br/>

## 1. 폴더 구조
```
(레포 루트)
├─ e2e/
│  ├─ pages/
│  │  └─ LoginPage.ts        ← 로그인 페이지의 Locator와 동작
│  └─ tests/
│     ├─ auth.setup.ts       ← LoginPage를 부르기만 한다
│     └─ dashboard.spec.ts
└─ playwright/.auth/user.json   ← 레포 루트에 저장, gitignore 대상
```

`auth.setup.ts` 의 `path.join(__dirname, '../../playwright/.auth/user.json')` 은 `e2e/tests` 에서 두 단계 올라간 레포 루트를 가리킨다.

<br/>

## 2. 페이지 객체 클래스
```ts
// e2e/pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  // Locator를 readonly로 한 곳에 모아 둔다
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

  /** 로그인 폼 작성부터 제출까지를 한 동작으로 묶는다. 결과 확인은 부른 쪽이 한다 */
  async login(email: string, password: string) {
    await this.goto();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

Locator는 `private readonly` 로 숨기고, 밖에는 `login()` 같은 동작 메서드만 내놓는다. spec과 setup은 "어떻게(Locator)"는 모르고 "무엇을(login)"만 안다.

여기서 `login()` 은 제출까지만 하고 아무것도 돌려주지 않는다. 로그인 뒤 도착하는 페이지의 페이지 객체(`DashboardPage`)를 돌려주게 만들어 `const dashboard = await loginPage.login(...)` 처럼 이어 쓰는 방식도 있다. 이 노트는 결과 확인을 setup이 맡게 하려고 돌려주지 않는 쪽을 택했다.

<br/>

## 3. setup이 페이지 객체를 부른다
```ts
// e2e/tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(
    process.env.TEST_USER_EMAIL!,
    process.env.TEST_USER_PASSWORD!,
  );

  // 쿠키가 실제로 심긴 뒤에 저장해야 하므로 로그인 성공을 여기서 확인한다
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
```

setup이 하는 일이 로그인시키기(`LoginPage`), 성공 확인, 상태 저장(`storageState`) 세 단계로 정리됐다. `login()` 은 제출까지만 하므로 저장 전에 대시보드에 들어갔는지는 setup이 확인한다. 이제 Locator가 바뀌면 `LoginPage.ts` 만 고친다. `playwright.config.ts` 의 `projects`, `dependencies` 설정은 [인증 정보 저장하기의 config 설정](../인증%20정보%20저장하기(Authentication%20State)/README.md#2-config에서-setup과-테스트를-잇기)과 같다.

<br/>

## 4. fixture로 LoginPage를 자동으로 넘겨받기
매번 `new LoginPage(page)` 를 쓰는 것도 반복이다. `test` 를 확장해 fixture로 넘겨주면 spec에서 바로 꺼내 쓸 수 있다.

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
// 사용하는 곳: 로그인하지 않은 상태에서 로그인 동작을 검증하는 spec 등
import { test, expect } from '../fixtures';

test('잘못된 비밀번호면 에러 메시지', async ({ loginPage, page }) => {
  await loginPage.login('user@test.com', 'wrong-pw');
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});
```

이 spec은 로그인 상태를 비운 `describe` 안에서 돌려 통과했다. 로그인 상태가 들어 있는 프로젝트에서 돌린다면 `test.use({ storageState: { cookies: [], origins: [] } })` 로 비운다.

<br/>

## POM을 쓸 때 지키는 선
| 원칙 | 이유 |
| --- | --- |
| Locator는 페이지 객체 안에서만 정의한다 | 바뀔 곳을 한 곳으로 모으는 것이 POM을 쓰는 이유다 |
| 메서드는 동작 단위(`login`)로 만들고 Locator를 꺼내 주는 getter를 남발하지 않는다 | spec이 다시 Locator를 알게 되면 감춘 의미가 없어진다 |
| 페이지 객체 안에서는 `expect` 를 쓰지 않는다 | 단언은 spec에서만 한다. 페이지 객체는 동작과 기다리기(`waitFor`)까지만 맡는다 |
| 테스트 데이터를 필드에 쌓아 두지 않는다 | Locator와 `page` 말고는 필드에 두지 않는다. 입력값은 메서드 인수로 받아 테스트끼리 값이 새지 않게 한다 |

세 번째 원칙은 내가 정한 규칙이다. Playwright 공식 POM 문서의 예시는 페이지 객체 메서드 안에서 `expect(...).toBeVisible()` 을 부른다. 동작이 끝났는지 확인하는 단언까지 페이지 객체에 넣는 팀도 있으니, 팀 안에서 한쪽으로 정해 두는 것이 중요하다.

정리하면 절차형 setup의 `fill`, `click` 나열을 `LoginPage` 클래스로 옮겨 Locator가 바뀔 때 고칠 곳을 한 파일로 줄였고, setup에는 의도만 남았다. 반복 생성이 거슬리면 fixture로 넘겨받는 데까지 간다. 핵심은 Locator는 페이지 객체가 혼자 갖고, 밖에는 동작만 내놓는다는 것이다.

<br/>

## 참고 자료
- [Page object models](https://playwright.dev/docs/pom)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
