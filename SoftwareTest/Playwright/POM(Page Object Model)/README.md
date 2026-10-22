## POM이란 ?
- POM(Page Object Model)은 테스트 자동화에서 웹 페이지 하나를 객체 하나로 나타내는 디자인 패턴이다
- 페이지의 요소(Locator)와 그 페이지에서 할 수 있는 동작(메서드)을 클래스 하나에 모아 감추는 것이 핵심이다
- 보통 페이지마다 클래스를 만들고, 테스트 스크립트는 그 클래스의 메서드를 불러 쓴다

### 페이지 객체 (Page Object)
object의 사전적 의미는 물체, 대상이다.
공학적으로는 데이터와 그 데이터를 다루는 동작을 함께 묶은 단위를 말한다. 페이지 객체는 "로그인 페이지"라는 대상을 코드 속 객체 하나로 옮겨, 그 페이지의 입력창과 버튼(데이터)과 로그인하기(동작)를 함께 갖게 한 것이다. 리모컨과 같다. 사용자는 "전원" 버튼만 누르고, 안에서 어떤 신호가 오가는지는 몰라도 된다.

<br/>

## 왜 필요할까
spec마다 `page.getByLabel('Email').fill(...)` 처럼 Locator를 직접 쓰면, 화면의 레이블 하나가 바뀌어도 그 Locator를 쓴 spec을 모두 찾아 고쳐야 한다. 또 spec이 "무엇을 확인하는지"보다 "어떻게 클릭하는지"로 채워져 읽기 어렵다.

페이지 객체를 두면 Locator는 클래스 안에 한 번만 적고, spec은 `loginPage.login(email, password)` 처럼 동작 이름만 부른다. 화면이 바뀌면 클래스 한 곳만 고친다.

<br/>

## 어떻게 생겼나
```ts
// e2e/pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

생성자에서 Locator를 만들어 두고, 밖에는 `login()` 만 내놓는다. 이 클래스로 로그인 setup을 바꾼 과정과 fixture로 넘겨받는 방법은 [POM 리팩토링](../POM%20리팩토링(POM%20Refactoring)/README.md)에 정리했다.

<br/>

## BasePage를 둘까
처음 코드를 쓸 때는 공통 부모 클래스 `BasePage` 를 만들고 모든 페이지 클래스가 이를 상속하게 했다. 페이지가 여러 개이고 모두 같은 헤더, 같은 이동 메서드를 쓴다면 이렇게 공통 부분을 한곳에 두는 것이 이득이다.

하지만 페이지 클래스가 하나뿐이면 `BasePage` 는 물려줄 상대가 없는 껍데기라 굳이 필요 없다. 상속 단계만 하나 늘어서 코드를 따라 읽기 번거로워진다. 그래서 페이지가 하나일 때는 페이지 클래스만 두고, 두 번째 페이지가 생겨 실제로 겹치는 코드가 나왔을 때 `BasePage` 로 뽑아내는 편이 낫다. 공통 동작이 헤더 같은 일부 영역뿐이라면 상속보다 그 영역만 맡는 객체(예: `Header`)를 따로 만들어 페이지 객체가 가지게 하는 방법도 있다.

<br/>

## 참고 자료
- [Page object models](https://playwright.dev/docs/pom)
