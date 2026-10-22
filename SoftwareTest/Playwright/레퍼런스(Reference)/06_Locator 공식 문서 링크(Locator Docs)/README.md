## Locator 공식 문서 링크 모음
- `getByRole` 같은 Locator 메서드를 배우거나 디버깅할 때 찾아볼 공식 문서와 관련 표준을 모은 장
- 메서드 이름과 옵션은 @playwright/test 1.64.1 타입 정의로 확인했다

<br/>

## 가장 자주 보는 문서
- [Locators](https://playwright.dev/docs/locators): 개요와 모든 `getBy*` 메서드, 자주 쓰는 패턴이 한 페이지에 있다. 처음 볼 문서로 가장 좋다
- [Best Practices: Use locators](https://playwright.dev/docs/best-practices#use-locators): 왜 사용자에게 보이는 속성을 우선하는지

<br/>

## API 레퍼런스: Page 클래스
| 메서드 | 공식 API |
| --- | --- |
| `page.getByRole()` | [page-get-by-role](https://playwright.dev/docs/api/class-page#page-get-by-role) |
| `page.getByLabel()` | [page-get-by-label](https://playwright.dev/docs/api/class-page#page-get-by-label) |
| `page.getByPlaceholder()` | [page-get-by-placeholder](https://playwright.dev/docs/api/class-page#page-get-by-placeholder) |
| `page.getByText()` | [page-get-by-text](https://playwright.dev/docs/api/class-page#page-get-by-text) |
| `page.getByTitle()` | [page-get-by-title](https://playwright.dev/docs/api/class-page#page-get-by-title) |
| `page.getByTestId()` | [page-get-by-test-id](https://playwright.dev/docs/api/class-page#page-get-by-test-id) |
| `page.getByAltText()` | [page-get-by-alt-text](https://playwright.dev/docs/api/class-page#page-get-by-alt-text) |
| `page.locator()` (CSS, XPath) | [page-locator](https://playwright.dev/docs/api/class-page#page-locator) |

<br/>

## Locator 클래스: 이어서 찾기와 거르기
- [Locator class](https://playwright.dev/docs/api/class-locator): 전체 메서드
- [locator.filter()](https://playwright.dev/docs/api/class-locator#locator-filter): `hasText`, `hasNotText`, `has`, `hasNot` 옵션으로 결과를 거른다

자주 쓰는 보조 메서드는 아래와 같다.

- `.filter({ hasText, has })` 로 조건에 맞는 것만 남긴다
- `.first()`, `.last()`, `.nth(n)` 으로 여러 개 중 하나를 고른다
- `.and(other)`, `.or(other)` 로 두 Locator의 조건을 합치거나 둘 중 하나를 찾는다
- `.locator(child)`, `.getByRole(...)` 으로 안쪽 요소를 이어서 찾는다

<br/>

## getByRole의 첫 인수: 역할 (WAI-ARIA Role)
`getByRole('button', ...)` 의 첫 인수는 WAI-ARIA 명세가 정한 역할(role) 이름이다.

- [WAI-ARIA 1.2: Role Definitions](https://www.w3.org/TR/wai-aria-1.2/#role_definitions): W3C 공식 명세
- [MDN: ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles)

자주 쓰는 역할과 그 역할을 가지는 요소는 아래와 같다.

| 역할 | 해당하는 요소와 용도 |
| --- | --- |
| `button` | `<button>`, `role="button"`, `<input type="submit">` |
| `link` | `href` 가 있는 `<a>`, `role="link"` |
| `textbox` | `<input type="text">`, `<textarea>` |
| `checkbox` | `<input type="checkbox">` |
| `radio` | `<input type="radio">` |
| `heading` | `<h1>` ~ `<h6>` (`level` 옵션으로 단계를 고른다) |
| `dialog` | `<dialog>`, `role="dialog"`, 모달 |
| `list`, `listitem` | `<ul>`, `<ol>` 과 그 안의 `<li>` |
| `row`, `cell` | 표의 행과 칸 |
| `tab`, `tabpanel` | 탭 UI |
| `navigation` | `<nav>` |
| `region` | 접근 가능한 이름(`aria-label` 등)이 있는 `<section>` |
| `alert` | `role="alert"`, 화면 낭독기가 바로 끼어들어 읽어 주는 알림(토스트 등) |
| `status` | `role="status"`, 화면 낭독기가 지금 읽던 내용을 마친 뒤 읽어 주는 알림(polite) |
| `img` | `<img>`. 단 `alt=""` 인 이미지는 장식으로 보고 찾지 않는다(alt가 있는 것, alt가 없는 것, `alt=""` 인 것 세 개 중 2개를 찾았다) |

<br/>

## 추천 Locator를 만들어 주는 도구
내가 쓴 Locator가 안정적인지, 어떤 역할과 이름으로 잡을지 모를 때 쓴다.

- [Codegen](https://playwright.dev/docs/codegen): `pnpm exec playwright codegen http://localhost:3000` 으로 화면을 클릭하면 추천 Locator가 만들어진다
- [VS Code 확장](https://playwright.dev/docs/getting-started-vscode): "Pick locator"로 에디터 안에서 요소를 집어 Locator를 뽑는다

<br/>

## 디버깅과 문제 해결
- [Auto-waiting (actionability)](https://playwright.dev/docs/actionability): 동작 전에 Locator가 자동으로 기다리는 상태들
- [Trace Viewer](https://playwright.dev/docs/trace-viewer): 실패한 spec에서 Locator가 무엇을 잡았는지 추적한다
- [Debugging tests](https://playwright.dev/docs/debug): Playwright Inspector와 UI 모드

<br/>

## 읽는 순서
1. [Locators](https://playwright.dev/docs/locators)에서 `getBy*` 메서드와 권장 방향, 자주 쓰는 패턴을 먼저 본다. 대부분은 이 문서로 해결된다
2. [Best Practices: Use locators](https://playwright.dev/docs/best-practices#use-locators)에서 우선순위를 권하는 이유를 본다
3. 역할 이름이 헷갈리면 [WAI-ARIA Role Definitions](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)를 사전처럼 찾아본다
4. `.filter()`, `.nth()` 같은 보조 메서드가 필요하면 [Locator class](https://playwright.dev/docs/api/class-locator)를 본다

우선순위를 정한 이유는 [5장 Locator 우선순위](../05_Locator%20우선순위(Locator%20Priority)/README.md), 페이지 메서드 전반은 [4장 page 객체 주요 메서드](../04_page%20객체%20주요%20메서드(page%20Methods)/README.md)에 정리했다.

<br/>

[목차](../README.md) | [이전 장: Locator 우선순위](../05_Locator%20우선순위(Locator%20Priority)/README.md) | [다음 장: playwright.config.ts](../07_playwright.config.ts(Playwright%20Config)/README.md)
