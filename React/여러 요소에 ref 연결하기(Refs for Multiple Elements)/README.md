## 반복해서 그린 요소를 ref로 가리키기
- `map()` 으로 반복해서 그린 요소들 하나하나를 ref로 가리키는 방법이다
- ref 하나에 배열(또는 Map)을 담아 두고, 요소마다 ref 콜백(ref callback)으로 자기 자리에 자신을 넣는다
- 리스트 항목 중 하나로 스크롤하거나 포커스를 줄 때, 애니메이션 라이브러리에 요소 목록을 넘길 때 쓴다

`useRef` 의 기본 동작은 [useRef 훅](../useRef%20훅(useRef%20Hook)/README.md)에 정리했다.

### 콜백 (Callback)
사전적 의미는 다시 부름, 회신 전화다. 전화를 걸어 두면 상대가 준비됐을 때 다시 걸어 주는 것과 같다.
공학적으로는 함수를 넘겨 두고, 정해진 때가 되면 상대가 그 함수를 대신 불러 주는 방식을 말한다. ref 콜백은 `ref` 에 객체 대신 함수를 넘긴 것으로, React가 요소를 화면에 붙일 때 그 DOM 요소를 인자로 이 함수를 불러 준다.

<br/>

## 왜 ref 하나로는 안 될까
`useRef` 가 만든 ref 객체의 `current` 에는 값이 하나만 들어간다. 같은 ref를 반복되는 요소 모두에 넘기면 React가 요소를 붙일 때마다 `current` 를 덮어써서, 마지막 요소만 남는다. 아래 코드에서 `ref.current` 는 `c` 항목을 가리킨다.

```tsx
const ref = useRef<HTMLLIElement>(null);

return (
  <ul>
    {['a', 'b', 'c'].map((t) => (
      <li key={t} ref={ref}>{t}</li> // 세 요소가 같은 ref를 덮어쓴다
    ))}
  </ul>
);
```

그렇다고 `map()` 안에서 항목마다 `useRef` 를 부를 수도 없다. 훅은 컴포넌트 최상위에서만 불러야 하고, 반복문이나 조건문 안에서 부르면 렌더링마다 호출 순서가 달라질 수 있기 때문이다.

그래서 ref는 하나만 만들되 그 안에 배열을 담고, 요소마다 ref 콜백으로 자기 자리에 자신을 넣는다. 칸마다 번호가 붙은 사물함과 같다. 사물함(ref)은 하나지만 칸이 여러 개라서, 요소마다 자기 번호 칸에 들어간다.

<br/>

## 배열로 관리하기
ref 콜백은 요소가 화면에 붙을 때 그 DOM 요소를, 사라질 때 `null` 을 인자로 불린다. 그 값을 `index` 자리에 넣어 두면 나중에 `itemsRef.current[2]` 처럼 원하는 요소를 꺼내 쓸 수 있다.

```tsx
import { useRef, useState } from 'react';

const ItemList = () => {
  const [items] = useState(['사과', '바나나', '체리']);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  const focusItem = (index: number) => {
    itemsRef.current[index]?.focus();
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li
            key={item}
            tabIndex={-1}
            ref={(el) => {
              itemsRef.current[index] = el; // 붙을 때는 요소, 사라질 때는 null
            }}
          >
            {item}
          </li>
        ))}
      </ul>
      <button onClick={() => focusItem(2)}>세 번째 항목으로</button>
    </div>
  );
};
```

`<li>` 는 원래 포커스를 받을 수 없는 요소라서 `tabIndex={-1}` 을 줬다. -1은 Tab 키 순서에는 넣지 않고 `focus()` 로만 포커스를 받게 하는 값이다. 버튼을 누르면 `체리` 항목에 포커스가 간다(React 19.2, jsdom에서 확인).

JSX 안에 바로 쓴 ref 콜백은 렌더링할 때마다 새 함수로 만들어진다. React는 콜백이 바뀌면 이전 콜백을 `null` 로 부르고 새 콜백을 요소로 다시 부르므로, 상태가 바뀌어 다시 렌더링될 때마다 모든 항목에서 `null` 호출과 요소 호출이 한 번씩 일어난다. 결과는 같은 요소가 다시 들어가는 것이라 동작에는 문제가 없다.

이 방식은 항목이 줄어들 때 배열 길이가 줄지 않는다. 항목을 세 개에서 하나로 줄이면 배열은 `[<li>사과</li>, null, null]` 처럼 사라진 자리에 `null` 이 남는다. 꺼내 쓸 때 `?.` 로 `null` 을 확인하는 이유다.

<br/>

## 타입을 꼭 적어야 하는 이유
타입 없이 `useRef([])` 로 만들면 TypeScript는 빈 배열의 요소 타입을 알 수 없어 `RefObject<never[]>` 로 추론한다. never는 어떤 값도 들어갈 수 없는 타입이라서 요소를 넣는 줄에서 오류가 난다. 빈 배열을 `never[]` 로 추론하는 것은 `strict`(정확히는 `strictNullChecks`)를 켰을 때이고, 끄면 `any[]` 로 추론되어 오류 없이 통과한다.

```tsx
const itemsRef = useRef([]);

<li key={item} ref={(el) => { if (el) itemsRef.current[index] = el; }}>{item}</li>
```

```text
error TS2322: Type 'HTMLLIElement' is not assignable to type 'never'.
```

위 오류는 TypeScript 5.6, `@types/react` 19.3에서 `strict` 로 검사한 결과다. `if (el)` 없이 `el` 을 그대로 넣으면 `Type 'HTMLLIElement | null' is not assignable to type 'never'.` 로 나온다.

`useRef<(HTMLLIElement | null)[]>([])` 처럼 배열에 들어갈 요소 타입을 적어 주면 해결된다. ref 콜백이 사라질 때 `null` 로 불리므로 `| null` 을 함께 적는다. `null` 을 넣고 싶지 않다면 `useRef<HTMLLIElement[]>([])` 로 두고 콜백 안에서 `if (el)` 로 걸러 넣는다.

<br/>

## ref 콜백은 값을 돌려주면 안 된다
아래처럼 쓴 코드는 React 19 타입에서 오류가 난다.

```tsx
ref={(el) => (itemsRef.current[i] = el)}
```

화살표 함수 본문을 중괄호 없이 쓰면 대입한 값이 그대로 반환된다. React 19부터 ref 콜백은 정리(cleanup) 함수를 돌려줄 수 있게 바뀌어서, 타입 정의가 반환값을 아무것도 없거나 함수로 제한한다. 요소를 돌려주면 아래 오류가 난다(`@types/react` 19.3에서 확인).

```text
error TS2322: Type '(el: HTMLLIElement | null) => HTMLLIElement | null' is not assignable to type 'Ref<HTMLLIElement> | undefined'.
  Type '(el: HTMLLIElement | null) => HTMLLIElement | null' is not assignable to type '(instance: HTMLLIElement | null) => void | (() => VoidOrUndefinedOnly)'.
```

본문을 중괄호로 감싸 `{ itemsRef.current[i] = el; }` 로 쓰면 반환값이 없어져 통과한다.

<br/>

## 정리 함수로 지우기 (React 19)
React 19에서는 ref 콜백이 함수를 돌려주면, 요소가 사라질 때 `null` 로 다시 부르는 대신 그 함수를 불러 준다. 이 정리 함수에서 항목을 지우면 사라진 요소가 남지 않는다. 항목을 키로 찾는다면 배열보다 Map이 편하다. React 공식 문서도 같은 방식을 쓴다.

```tsx
const itemsRef = useRef(new Map<string, HTMLLIElement>());

{items.map((item) => (
  <li
    key={item}
    ref={(el) => {
      if (el) itemsRef.current.set(item, el);
      return () => {
        itemsRef.current.delete(item); // 요소가 사라질 때 불린다
      };
    }}
  >
    {item}
  </li>
))}
```

항목을 세 개에서 하나로 줄이면 Map의 키도 `['사과']` 하나만 남는다(React 19.2, jsdom에서 확인).

<br/>

## 애니메이션 대상으로 쓸 때
캐러셀 슬라이드, 카드 목록처럼 반복되는 요소에 GSAP 같은 라이브러리로 애니메이션을 줄 때도 이 배열을 넘긴다. `.box` 같은 클래스 선택자로 고르면 같은 클래스를 쓰는 다른 컴포넌트의 요소까지 잡힐 수 있지만, ref 배열은 이 컴포넌트가 그린 요소만 가리킨다. GSAP에서 ref와 클래스 선택자를 비교한 내용은 [useRef와 className 차이점](../../Libraries/GSAP/useRef와%20className%20차이점.md)에 정리했다.

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| ref 콜백 (Ref Callback) | 다시 부름 | 요소가 붙고 떨어질 때 React가 불러 주는 함수 |
| 정리 함수 (Cleanup Function) | 치우는 일 | 요소가 사라질 때 뒷정리를 하라고 돌려주는 함수 |
| never | 결코 ~않다 | 어떤 값도 들어갈 수 없는 TypeScript 타입 |

<br/>

## 참고 자료
- [React 공식 문서: ref로 DOM 조작하기](https://ko.react.dev/learn/manipulating-the-dom-with-refs)
- [React 공식 문서: ref 콜백 함수](https://ko.react.dev/reference/react-dom/components/common#ref-callback)

<br/>

## 더 볼 것 (TODO)
- 자식 컴포넌트의 DOM 요소를 부모가 ref 배열로 모으기
