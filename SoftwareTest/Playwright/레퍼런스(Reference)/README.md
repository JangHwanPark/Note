## Playwright 레퍼런스란 ?
- spec 파일을 짤 때 자주 찾아보는 Playwright Test의 API와 문법을 장별로 모은 노트
- 프로젝트에서 어떤 결정을 내렸는지 적은 회고형 노트와 달리, 이 묶음은 "이 API가 무엇을 하는가"만 다룬다
- 이 책의 예시와 기본값은 `@playwright/test` 1.64.1, Chromium에서 확인했다. 장마다 확인한 내용을 끝에 적었다

### 레퍼런스 (Reference)
사전적 의미는 참고, 참조. 필요할 때 펼쳐 보는 자료를 말한다.
여기서는 처음부터 끝까지 읽기보다, spec을 짜다가 막힐 때 해당 장만 찾아 읽는 참고서라는 뜻으로 붙였다.

<br/>

## 목차
- [01 describe 언제 쓰나](./01_describe%20언제%20쓰나(When%20to%20Use%20describe)/README.md) : 테스트를 묶어야 할 때와 묶지 않아도 될 때의 판단 기준
- [02 test 객체 API](./02_test%20객체%20API(test%20API)/README.md) : 테스트 등록, hook, skip과 fixme, describe 변형, 기본 fixture와 `test.extend`
- [03 expect 객체 API](./03_expect%20객체%20API(expect%20API)/README.md) : 조건이 맞을 때까지 기다리는 web-first assertion, 자주 쓰는 matcher, soft와 poll
- [04 page 객체 주요 메서드](./04_page%20객체%20주요%20메서드(page%20Methods)/README.md) : 이동, 조작, 조회, 대기, 네트워크 가로채기 메서드와 자주 쓰는 패턴
- [05 Locator 우선순위](./05_Locator%20우선순위(Locator%20Priority)/README.md) : `getByRole` 을 먼저 쓰는 이유와 Locator 고르는 순서
- [06 Locator 공식 문서 링크](./06_Locator%20공식%20문서%20링크(Locator%20Docs)/README.md) : `getByRole` 등 공식 API와 WAI-ARIA role 문서 모음
- [07 playwright.config.ts](./07_playwright.config.ts(Playwright%20Config)/README.md) : 설정 파일의 역할, 주요 옵션, webServer
- [08 실무 E2E 예외 케이스](./08_실무%20E2E%20예외%20케이스(E2E%20Edge%20Cases)/README.md) : 타이밍, 격리, 인증, 외부 의존, DOM, 인프라에서 만난 예외 사례

<br/>

## 처음 읽는다면
참고서라 정해진 순서는 없다. 처음 읽는다면 02, 04, 05, 03, 01, 07, 08 순서가 spec을 짤 때 마주치는 순서와 맞는다. 테스트를 등록하고(02), 요소를 조작하고(04), Locator를 고르고(05), 결과를 검증한 뒤(03), 테스트를 묶고(01), 전역 설정을 정하고(07), 실전 예외에 대응하는(08) 흐름이다. 그래서 앞 장에서 뒤 장을 미리 가리키는 곳이 있다(예: 4장에서 5장의 Locator 우선순위). 06은 05를 읽다가 공식 문서가 필요할 때 펼친다.

<br/>

## 더 볼 것 (TODO)
- 커스텀 fixture를 worker 범위로 만들기 (`{ scope: 'worker' }`)
- `page.route` 와 HAR 파일로 네트워크 모킹하기
- 스크린샷 비교(`toHaveScreenshot`)의 기준 이미지 관리
- `expect.extend` 로 커스텀 matcher 만들기
