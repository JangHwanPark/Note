## div를 제목으로 만들려면
- `<div>` 나 `<p>` 를 보조 기술에 제목으로 알리려면 `role="heading"` 과 `aria-level` 을 함께 준다
- 하지만 가장 좋은 방법은 처음부터 `<h1>` ~ `<h6>` 를 쓰는 것이다. `role="heading"` 은 마크업을 바꾸기 어려운 기존 코드를 고칠 때만 쓴다
- `aria-label`, `aria-labelledby` 는 요소에 이름을 붙이는 속성이지 제목을 만드는 속성이 아니다. 역할을 따로 주지 않은 `<div>`, `<p>` 에는 쓰면 안 된다

### ARIA (Accessible Rich Internet Applications)
이름을 풀면 접근 가능한 풍부한 인터넷 애플리케이션이다.
HTML만으로는 의미를 전할 수 없는 화면을 위해, 요소의 역할(role), 상태, 이름을 보조 기술에 알려 주는 속성 모음이다. W3C의 WAI-ARIA 명세가 정한다. 화면 낭독기(Screen Reader) 같은 보조 기술은 이 정보로 "제목 2수준", "주 메뉴" 처럼 요소를 소개한다.

ARIA는 문에 나중에 덧붙이는 점자 안내판과 같다. `<h2>` 는 처음부터 점자 안내판이 붙어 나오는 문이라 따로 할 일이 없다. `<div>` 는 아무 표시 없는 문이라, 제목이라고 알리려면 안내판(`role`, `aria-level`)을 직접 붙여야 하고 빠뜨리거나 잘못 붙이면 그대로 잘못 안내된다.

<br/>

## 왜 h1 ~ h6를 먼저 쓸까
화면 낭독기 사용자는 제목만 골라 들으며 페이지 구조를 파악한다. `<h2>` 는 따로 설정하지 않아도 "제목, 2수준"이라는 정보를 가진다. 같은 일을 `<div>` 로 하려면 ARIA 속성을 직접 붙여야 하고, 빠뜨리거나 틀리면 그 정보가 사라진다.

MDN의 heading 역할 문서([Best practices](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/heading_role#best_practices))도 이 역할은 쓰지 않는 것이 가장 좋다고 말한다. "The best way to use this role is to not use it at all, and instead use the native heading tags h1 through h6 as shown in the example above." 이 역할과 `aria-level` 은 크게 바꿀 수 없는 레거시 코드에 접근성을 덧붙일 때만 쓰라고 한다.

```html
<h2>새 소식</h2>
```

<br/>

## role="heading"과 aria-level
`<h1>` ~ `<h6>` 를 쓸 수 없을 때는 역할과 수준을 함께 준다.

```tsx
<div role="heading" aria-level={2}>이것은 제목입니다</div>
<p role="heading" aria-level={3}>이것은 제목입니다</p>
```

`aria-level` 은 `<h1>` 의 1, `<h2>` 의 2처럼 제목의 수준이다. MDN은 이 속성을 반드시 쓰라고 하고, 빠뜨리면 브라우저가 2로 처리한다고 적었다. 수준이 틀리면 화면 낭독기 사용자가 듣는 페이지 구조도 틀어지므로, 앞뒤 제목과 맞는 수준을 직접 정해야 한다.

React(TSX)에서는 `aria-level` 에 숫자를 넣는다. HTML처럼 `aria-level="2"` 로 문자열을 쓰면 타입 오류가 난다. @types/react 19.3.0, TypeScript 5.6.3 strict에서 확인한 메시지는 아래와 같다.

```text
error TS2322: Type '{ children: string; role: "heading"; "aria-level": string; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
  Type '{ children: string; role: "heading"; "aria-level": string; }' is not assignable to type 'HTMLAttributes<HTMLDivElement>'.
    Types of property '"aria-level"' are incompatible.
      Type 'string' is not assignable to type 'number'.
```

<br/>

## aria-labelledby와 aria-label은 제목을 만들지 않는다
두 속성은 요소의 접근 가능한 이름(accessible name)을 정한다. `aria-labelledby` 는 다른 요소의 글을 이름으로 가져오고, `aria-label` 은 이름을 문자열로 직접 적는다. 이름이 생겨도 요소의 역할은 그대로라서, 제목이 되지는 않는다.

게다가 역할을 따로 주지 않은 `<div>` 와 `<p>` 에는 이 두 속성을 쓰면 안 된다. 이때 `<div>` 의 역할은 generic, `<p>` 는 paragraph다. WAI-ARIA 1.2는 이 두 역할을 이름을 붙일 수 없는 역할 목록([5.2.8.6 Roles which cannot be named](https://www.w3.org/TR/wai-aria-1.2/#namefromprohibited))에 넣었고, 이름을 붙일 수 없는 역할에 대해 "Authors MUST NOT use the aria-label or aria-labelledby attributes to name the element."라고 적었다([5.2.8 Accessible Name Calculation](https://www.w3.org/TR/wai-aria-1.2/#namecalculation)). `role="heading"` 처럼 다른 역할을 준 `<div>` 는 그 역할의 규칙을 따른다. 그래서 아래 두 코드는 의도대로 동작한다고 기대할 수 없다.

```html
<!-- 쓰지 않는다 -->
<p aria-labelledby="title">이 문장은 제목에 연결됨</p>
<div aria-label="이것은 제목입니다">내용</div>
```

두 속성은 영역이나 내비게이션처럼 이름이 필요한 요소에 쓴다. 아래는 섹션의 이름을 안의 제목에서 가져오고, 메뉴에 이름을 붙이는 예다.

```tsx
<section aria-labelledby="news-title">
  <h2 id="news-title">새 소식</h2>
</section>

<nav aria-label="주 메뉴">
  <a href="/">홈</a>
</nav>
```

제목 요소에 `aria-label` 을 붙이는 것도 피하는 편이 좋다. 금지 규칙은 아니고 MDN의 경고다([Accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/heading_role#accessibility_concerns)). "Using aria-label or aria-labelledby will hide the content of your heading from assistive technologies, reading the label instead of the heading."

<br/>

## 한눈에 보는 속성
| 속성 | 하는 일 | 쓰는 곳 |
|---|---|---|
| `role="heading"` | 요소의 역할을 제목으로 알린다 | `<h1>` ~ `<h6>` 를 쓸 수 없는 기존 코드 |
| `aria-level` | 제목의 수준을 알린다. MDN은 HTML과 맞추려면 6을 넘기지 말라고 한다 | `role="heading"` 과 함께 |
| `aria-labelledby` | 다른 요소의 글로 이 요소의 이름을 정한다 | `<section>`, `<nav>`, 대화 상자처럼 이름이 필요한 요소 |
| `aria-label` | 이 요소의 이름을 문자열로 정한다 | 화면에 글이 없는 버튼, 같은 종류가 여럿인 `<nav>` |

<br/>

## 확인한 것
- 인용한 문장은 MDN heading 역할 문서와 WAI-ARIA 1.2 명세(5.2.8, 5.2.8.6절) 원문에서 그대로 옮겼다
- TSX 예시는 @types/react 19.3.0, TypeScript 5.6.3 strict로 타입 검사했다
- 실제 화면 낭독기(NVDA, VoiceOver 등)가 어떻게 읽는지는 확인하지 않았다(확인 필요)

<br/>

## 참고 자료
- [MDN: ARIA heading role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/heading_role)
- [WAI-ARIA 1.2: 5.2.8.6 Roles which cannot be named](https://www.w3.org/TR/wai-aria-1.2/#namefromprohibited)

<br/>

## 더 볼 것 (TODO)
- 접근 가능한 이름이 정해지는 순서(accessible name 계산)
- 랜드마크 역할(`main`, `nav`, `region`)과 화면 낭독기의 랜드마크 이동
- 화면 낭독기로 직접 제목 목록 들어 보기
