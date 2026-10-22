## 배열 상태를 바꾸는 방법
- `useState` 에 배열을 담아 두고 항목을 추가, 삭제, 수정하는 방법
- 원래 배열을 고치지 않고 새 배열을 만들어 상태 변경 함수에 넘겨야 화면이 바뀐다
- 상태 변경 함수를 자식 컴포넌트에 넘길 때는 React가 제공하는 `Dispatch<SetStateAction<T>>` 타입을 쓴다

### 불변성 (Immutability)
사전적 의미는 변하지 않는 성질이다.
공학적으로는 한 번 만든 값을 고치지 않고, 바꿀 일이 생기면 바뀐 내용을 담은 새 값을 만드는 방식을 말한다. React의 상태는 이 방식으로 다뤄야 React가 바뀐 것을 알아챈다.

<br/>

## push로 추가하면 화면이 바뀌지 않는다
```tsx
function PushList() {
  const [items, setItems] = useState<string[]>(["a"]);

  const add = () => {
    items.push("b");   // 원래 배열을 직접 고친다
    setItems(items);   // 같은 배열을 다시 넘긴다
  };

  return (
    <>
      <button onClick={add}>추가</button>
      <p>{items.join(",")}</p>
    </>
  );
}
```

추가 버튼을 눌러도 화면에는 `a` 만 남아 있다. 배열 안에는 `b` 가 들어갔지만 React는 다시 렌더링하지 않았다. 더 헷갈리는 점은, 그 뒤에 다른 상태가 바뀌어 이 컴포넌트가 다시 렌더링되면 그때 갑자기 `a,b` 가 보인다는 것이다. 배열은 이미 고쳐져 있었고 화면만 늦게 따라온 것이라, 버그가 엉뚱한 곳에서 난 것처럼 보이게 된다.

### 왜 그럴까
React는 상태 변경 함수에 받은 새 값을 지난 값과 `Object.is` 로 비교하고, 같으면 렌더링을 건너뛴다. 배열은 내용이 아니라 참조(메모리 위치)로 비교된다. `push` 는 같은 배열의 내용만 바꾸므로 참조가 그대로이고, React 입장에서는 아무것도 바뀌지 않은 것이다.

```js
const arr = [1];
Object.is(arr, arr);       // true (같은 배열)
Object.is(arr, [...arr]);  // false (내용은 같아도 새 배열)
```

사물함 번호로 물건이 바뀌었는지 확인하는 관리인과 같다. 같은 사물함 안의 물건만 바꾸면 번호가 그대로라 관리인은 바뀐 줄 모른다. 새 사물함에 담아 번호를 바꿔 줘야 알아챈다.

### 해결
스프레드 연산자로 기존 항목을 펼친 새 배열을 만들어 넘긴다.

```tsx
const add = () => {
  setItems([...items, "b"]); // 새 배열이라 참조가 바뀌고 다시 렌더링된다
};
```

이렇게 바꾸면 버튼을 눌렀을 때 화면이 바로 `a,b` 로 바뀐다.

이전 값을 바탕으로 새 값을 만들 때는 아래처럼 함수를 넘기는 형태도 쓴다. `prev` 는 React가 넘겨 주는 가장 최신 상태다. 한 이벤트 안에서 여러 번 업데이트해도 앞의 업데이트 결과를 이어받으므로, 렌더링 시점의 `items` 를 쓰는 앞의 방식보다 안전하다. 아래 props 예시도 이 형태를 쓴다.

```tsx
setItems((prev) => [...prev, "b"]);
```

삭제는 `filter`, 수정은 `map` 처럼 새 배열을 돌려주는 메서드를 쓰면 같은 원리로 동작한다.

<br/>

## 상태 변경 함수를 props로 넘길 때의 타입
자식 컴포넌트가 부모의 상태를 바꿔야 하면 상태 변경 함수를 props로 넘긴다. 이때 타입은 `Dispatch<SetStateAction<T>>` 로 쓴다.

```tsx
import { useState, type Dispatch, type SetStateAction } from "react";

function AddButton({ setItems }: { setItems: Dispatch<SetStateAction<string[]>> }) {
  return <button onClick={() => setItems((prev) => [...prev, "b"])}>추가</button>;
}

function List() {
  const [items, setItems] = useState<string[]>(["a"]);
  return (
    <>
      <AddButton setItems={setItems} />
      <p>{items.join(",")}</p>
    </>
  );
}
```

`(items: string[]) => void` 처럼 직접 쓰면 `setItems(prev => ...)` 처럼 함수를 넘기는 쓰임을 막아 버린다. `@types/react` 의 정의를 보면 이유가 보인다.

```ts
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
```

`SetStateAction<S>` 는 상태 변경 함수에 넘길 수 있는 것, 즉 새 값 자체이거나 이전 값을 받아 새 값을 돌려주는 함수다. `Dispatch<A>` 는 그것을 받아 실행하고 아무것도 돌려주지 않는 함수다. 둘을 합친 `Dispatch<SetStateAction<string[]>>` 가 `useState<string[]>` 가 돌려주는 상태 변경 함수의 타입과 정확히 같다.

이 노트의 예시는 TypeScript 5.6, `@types/react` 19.3.0, `strict` 에서 타입 검사를 통과했다. React 19.2에서 실행해 `push` 는 `a` 그대로, 다른 상태가 바뀐 뒤에는 `a,b`, 새 배열을 넘기면 바로 `a,b` 가 되는 것을 확인했다.

<br/>

## 더 볼 것 (TODO)
- 객체 상태와 중첩된 배열 상태를 불변으로 고치기
- 배열 상태가 커질 때 `useReducer` 로 옮기기
