## 어떤 실수였나
- 입력창(`<input>`)에 쓴 글자를 상태로 관리하면서, 상태 타입을 글자(`string`)가 아니라 입력창 DOM 객체(`HTMLInputElement`)로 잘못 지정한 실수
- AI의 도움을 받아 입력창을 만들 때 내가 자주 하던 실수다. 한 줄 실수로 타입 오류가 세 군데에서 난다
- 상태에는 화면을 그리는 데 필요한 데이터를 담고, DOM 요소를 직접 가리키고 싶을 때는 [useRef](../useRef%20훅(useRef%20Hook)/README.md) 를 쓴다

### 제어 컴포넌트 (Controlled Component)
제어의 사전적 의미는 상대편이 마음대로 움직이지 못하게 다스리는 것이다.
React에서 제어 컴포넌트는 입력창의 값을 브라우저가 아니라 React 상태가 쥐고 있는 입력 요소를 말한다. `value` 에 상태를 넣고 `onChange` 에서 상태를 바꾸면, 화면에 보이는 글자는 항상 상태와 같다. 이 노트의 실수를 고친 결과가 바로 제어 컴포넌트다.

<br/>

## 실수한 코드
```tsx
import { type ChangeEvent, useState } from "react";

const Input = () => {
  const [input, setInput] = useState<HTMLInputElement>();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <input type="text" value={input} onChange={(e) => onChange(e)} />
      <div>{input}</div>
    </div>
  );
};
```

의도는 입력창의 글자를 저장하는 것이었다. 그런데 `useState<HTMLInputElement>()` 는 이 상태에 입력창 DOM 객체나 `undefined` 가 들어간다고 선언한 것이다. 상태 타입이 하나 틀리니 그 상태를 쓰는 세 곳에서 모두 오류가 난다.

아래 오류 메시지는 TypeScript 5.6, `@types/react` 19.3.0에서 실제로 나온 것이다.

<br/>

## 오류 세 가지
### 1. 상태 변경 함수에 글자를 넣을 때
```tsx
setInput(e.target.value);
```

```text
error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<HTMLInputElement | undefined>'.
```

`e.target` 은 입력창 요소(`HTMLInputElement`)이고 `e.target.value` 는 그 안의 글자(`string`)다. 그런데 `setInput` 은 `HTMLInputElement` 를 받도록 선언되어 있어서 글자를 넣을 수 없다.

### 2. 입력창의 value에 상태를 넣을 때
```tsx
<input type="text" value={input} />
```

```text
error TS2322: Type 'HTMLInputElement | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
  Type 'HTMLInputElement' is not assignable to type 'string | number | readonly string[] | undefined'.
```

`value` 에는 화면에 보여 줄 글자나 숫자가 와야 한다. 입력창의 값으로 입력창 객체 자체를 넣으려는 코드가 된 것이다.

### 3. 상태를 화면에 그릴 때
```tsx
<div>{input}</div>
```

```text
error TS2322: Type 'HTMLInputElement | undefined' is not assignable to type 'ReactNode'.
  Type 'HTMLInputElement' is not assignable to type 'ReactNode'.
    Type 'HTMLInputElement' is missing the following properties from type 'ReactPortal': props, key
```

React가 JSX 안에서 그릴 수 있는 것(`ReactNode`)은 글자, 숫자, JSX 요소, `null` 같은 것들이다. `HTMLInputElement` 같은 실제 DOM 객체는 어떻게 그려야 할지 모르므로 타입 단계에서 막힌다.

<br/>

## 고친 코드
상태 타입을 `string` 으로 바꾸고 빈 문자열로 시작한다. 초깃값 `""` 만 줘도 `string` 으로 추론된다.

```tsx
import { type ChangeEvent, useState } from "react";

const Input = () => {
  const [inputValue, setInputValue] = useState("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <div>{inputValue}</div>
    </div>
  );
};
```

이 코드는 같은 환경에서 `strict` 타입 검사를 오류 없이 통과했다. 초깃값을 `""` 로 준 것도 중요하다. 초깃값이 `undefined` 이면 처음에는 비제어였다가 글자를 입력하는 순간 제어 컴포넌트로 바뀌어, React가 개발 모드에서 `A component is changing an uncontrolled input to be controlled.` 경고를 띄운다(React 19.2에서 확인).

<br/>

## 더 볼 것 (TODO)
- 비제어 컴포넌트(Uncontrolled Component)와 `useRef`, `defaultValue` 로 입력값 읽기
- 입력창이 여러 개일 때 상태를 객체 하나로 관리하기
