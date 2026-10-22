## Playwright란 ?
- 웹 애플리케이션을 실제 브라우저(Chromium, Firefox, WebKit)로 띄워 사용자처럼 조작하고 결과를 확인하는 E2E(End-to-End) 테스트 프레임워크
- 테스트 러너인 `@playwright/test` 가 테스트 등록, 병렬 실행, 재시도, 리포트를 함께 제공한다
- 요소를 조작하거나 확인할 때 조건이 맞을 때까지 자동으로 기다려서, 비동기로 바뀌는 화면도 대기 코드 없이 테스트할 수 있다

### 플레이라이트 (Playwright)
playwright의 사전적 의미는 극작가, 희곡을 쓰는 사람이다.
테스트 코드는 브라우저가 무대 위에서 어떤 순서로 무엇을 할지 적은 대본이고, Playwright는 그 대본을 써서 브라우저에게 연기를 시키는 도구라는 뜻으로 읽을 수 있다. 이름의 유래는 공식 문서에서 확인하지 않았다.

<br/>

## 목차
- [레퍼런스](./레퍼런스(Reference)/README.md) : test, expect, page API와 Locator 우선순위, 설정 파일, 실무 예외 케이스를 장별로 정리한 참고서
- [인증 정보 저장하기](./인증%20정보%20저장하기(Authentication%20State)/README.md) : 로그인 상태를 파일로 저장해 테스트마다 로그인하지 않는 방법
- [POM (Page Object Model)](./POM(Page%20Object%20Model)/README.md) : 페이지를 객체로 감싸 Locator와 동작을 모아 두는 패턴
- [POM 리팩토링](./POM%20리팩토링(POM%20Refactoring)/README.md) : 인증 setup 코드를 Page Object Model로 바꾼 과정

<br/>

## 공식 문서
- [Playwright 공식 문서](https://playwright.dev/)
- [시작하기 (Installation)](https://playwright.dev/docs/intro)
- [Test API](https://playwright.dev/docs/api/class-test)
- [Locators 가이드](https://playwright.dev/docs/locators)
- [Codegen (자동 코드 생성)](https://playwright.dev/docs/codegen)

<br/>

## 테스트 실행 명령어
`npx playwright test` 가 기본 명령이고, 파일 경로, `-g`(제목으로 거르기), `--headed`(브라우저를 띄워서 보기), `--ui`(UI 모드), `--project`(설정의 프로젝트 하나만) 같은 옵션을 붙여 범위를 좁힌다.

```bash
# 전체 테스트
npx playwright test

# 파일 하나
npx playwright test e2e/tests/access/project-access.spec.ts

# 파일 안에서 제목에 이 문자열이 들어간 테스트만
npx playwright test e2e/tests/access/project-access.spec.ts -g "title contains"

# 브라우저를 띄워서 보면서 실행
npx playwright test e2e/tests/access/project-access.spec.ts --headed

# UI 모드
npx playwright test --ui

# test.only가 남아 있으면 실패 (CI용)
npx playwright test --forbid-only
```

아래는 pnpm 모노레포로 구성된 작업 프로젝트에서 쓰던 명령이다. `e2e`, `e2e:ui` 는 그 프로젝트의 `apps/web/package.json` 에 정의한 스크립트이고, `--filter web` 은 pnpm 워크스페이스에서 `web` 패키지를 고르는 옵션이라 다른 프로젝트에서는 이름이 다르다.

```bash
# apps/web 디렉터리에서 실행 (레포 루트에서는 안 됨)
pnpm e2e e2e/tests/access/project-access.spec.ts
pnpm e2e e2e/tests/access/project-access.spec.ts -g "title contains"
pnpm e2e e2e/tests/access/project-access.spec.ts --headed
pnpm e2e:ui e2e/tests/access/project-access.spec.ts

# 레포 루트(어디서나)에서 실행
pnpm --filter web exec playwright test
pnpm --filter web exec playwright test --project=setup   # 인증 setup만 따로 돌리기
pnpm --filter web e2e e2e/tests/access/project-access.spec.ts
```

명령 옵션 `-g`, `--headed`, `--ui`, `--project`, `--forbid-only` 는 `@playwright/test` 1.64.1에서 확인했다.
