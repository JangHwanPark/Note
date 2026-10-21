## 프래그먼트란 ?
- 여러 JSX 요소를 하나로 묶되, 실제 DOM에는 아무 요소도 추가하지 않는 React 문법
- `react` 에서 가져온 `<Fragment>...</Fragment>` 로 쓰거나 줄여서 `<>...</>` 로 쓴다. 짧은 문법은 가져오지 않아도 된다
- React 19.2 안정판 기준으로 두 방법의 차이는 하나다. `<Fragment>` 에는 `key` 를 줄 수 있고, `<>` 에는 어떤 속성도 줄 수 없다

### 프래그먼트 (Fragment)
사전적 의미는 조각, 파편이다.
React에서는 화면의 한 조각을 이루는 요소들을 묶어 두는 이름 없는 묶음을 말한다. 묶음 자체는 화면에 남지 않고 안의 요소들만 그대로 들어간다.

물건 여러 개를 고무줄로 묶어 건네는 것과 같다. 받는 쪽에서는 물건만 꺼내 쓰고 고무줄은 남지 않는다. 상자(`<div>`)에 담아 건네면 상자까지 같이 남는다.

<br/>

## 왜 필요할까
JSX 식은 맨 바깥에 요소가 하나여야 한다. JSX는 결국 요소 하나를 만드는 함수 호출로 바뀌기 때문이다. 그래서 컴포넌트가 제목과 설명처럼 나란한 요소 두 개를 돌려주려면 무언가로 감싸야 한다.

```tsx
return (
  <div>
    <h1>제목</h1>
    <p>설명</p>
  </div>
);
```

`<div>` 로 감싸면 실제 DOM에도 `<div>` 가 하나 더 생긴다. 이 `<div>` 가 문제를 만드는 경우가 있다.

- HTML 구조 규칙을 깬다. `<tr>` 안에는 `<td>` 가, `<ul>` 안에는 `<li>` 가 바로 와야 하는데 사이에 `<div>` 가 끼면 잘못된 구조가 된다
- 스타일이 깨진다. 부모가 flex나 grid라면 감싼 `<div>` 하나가 항목 하나로 취급되어 배치가 달라진다

프래그먼트로 감싸면 이런 요소가 생기지 않는다.

```tsx
return (
  <>
    <h1>제목</h1>
    <p>설명</p>
  </>
);
```

React 19.2에서 렌더링한 결과는 `<h1>제목</h1><p>설명</p>` 이다. 감싼 것은 DOM에 남지 않는다.

<br/>

## key가 필요할 때는 Fragment를 쓴다
`map` 으로 목록을 만들 때 React는 항목마다 `key` 를 요구한다. 항목 하나가 요소 하나라면 그 요소에 `key` 를 주면 되므로 `<>` 로 감싸도 아무 문제가 없다.

```tsx
return (
  <>
    {items.map((item) => (
      <p key={item.id}>{item.term}</p>
    ))}
  </>
);
```

`key` 가 필요한 것은 바깥 `<>` 가 아니라 `map` 이 돌려주는 각 항목이다. 문제가 되는 것은 항목 하나가 여러 요소로 이루어질 때다. 용어 목록처럼 항목마다 `<dt>` 와 `<dd>` 를 함께 돌려줘야 하면 둘을 묶을 것이 필요하고, 그 묶음에 `key` 를 줘야 한다. `<>` 는 `key` 를 받을 수 없다.

```tsx
// key를 줄 곳이 없어 경고가 난다
<dl>
  {items.map((item) => (
    <>
      <dt>{item.term}</dt>
      <dd>{item.desc}</dd>
    </>
  ))}
</dl>
```

이 코드를 개발 모드로 실행하면 `Each child in a list should have a unique "key" prop.` 경고가 콘솔에 나온다. 이때 `<Fragment>` 를 쓰고 `key` 를 준다.

```tsx
import { Fragment } from "react";

<dl>
  {items.map((item) => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.desc}</dd>
    </Fragment>
  ))}
</dl>
```

경고 없이 `<dl><dt>HTML</dt><dd>구조</dd><dt>CSS</dt><dd>모양</dd></dl>` 로 렌더링된다. `<>` 안에서 `<p>` 에 key를 준 예시, `<>` 로 `<dt>` 와 `<dd>` 를 묶은 예시, `<Fragment key>` 로 묶은 예시를 모두 React 19.2에서 실행해 경고 여부와 결과 HTML을 확인했다.

정리하면 그냥 묶을 때는 짧은 `<>` 를 쓰고, `map` 안에서 묶음 자체에 `key` 를 줘야 할 때만 `<Fragment key={...}>` 를 쓴다.

<br/>

## 참고 자료
- [React 공식 문서: Fragment](https://react.dev/reference/react/Fragment)

<br/>

## 더 볼 것 (TODO)
- `key` 가 하는 일과 배열 인덱스를 `key` 로 쓰면 생기는 문제
