```tsx
import {type ChangeEvent, useState} from "react";

const Input = () => {
 const [input, setInput] = useState<HTMLInputElement>();
 const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  setInput(e.target.value);
 }
 return (
  <div>
   <h1>인풋 박스</h1>
   <div className='border-2 border-white rounded-lg'>
    <label htmlFor="input">
     <input id="input" type="text" className='w-full' value={input} onChange={(e) => onChange(e)} />
    </label>
   </div>
   <div>{input}</div>
  </div>
 );
};

export default Input;
```

AI의 도움을 받다보면 `useState`내 데이터가 아닌 `DOM 객체`를 저장하는 경우가 있다.  
그때 다음과 같은 오류가 발생한다.

```text
TS2322: Type HTMLInputElement | undefined is not assignable to type ReactNode
Type HTMLInputElement is not assignable to type ReactNode
Type HTMLInputElement is missing the following properties from type ReactPortal: props, key
index. d. ts(2173, 9): The expected type comes from property children which is declared here on type
```

내 의도는 input 의 텍스트값(String)을 저장하려했으나 input 이라는 상태변수에는 HTML 입력창
DOM 객체 (HTMLInputElement) 또는 undefined 가 저장될꺼야 라고 선언했던것이다.  


### 1. onChange 함수에서의 타입 불일치
```tsx
const onChange = (e: ChangeEvent<HTMLInputElement>) => {
 setInput(e.target.value); // 여기서 첫 번째 오류 발생
}
```

`e.target`은 `input`요소를 가리키는 `HTMLInputElement`객체이고 `e.target.value`는
그 입력창 내부의 텍스트값(string)타입이다. 하지만 `setInput` 함수는 `HTMLInputElement` 
타입의 값을 받도록 설정되어 있으며, 코드에서 `string` 타입을 `HTMLInputElement` 타입이
필요한 곳에 넣으려고 해서 TypeScript 오류가 발생한다. (`Type 'string' is not assignable to type 'HTMLInputElement | undefined'`)  


### 2. <input>의 value 속성에서의 타입 불일치
```tsx
// 여기서 두 번째 오류 발생
<input ... value={input} ... />
```
HTML `input`요소의 `value`속성에는 화면에 출력할 문자열(string)이 와야한다. 하지만 현재
`input`상태 변수의 타입은 `HTMLInputElement`객체로 입력창의 value 값으로 
입력창 객체 자체를 넣으려는 이상한 코드가 되었다.


### 3. 화면에 input을 직접 렌더링할 때의 오류
```tsx
<div>{input}</div> // 여기서 세 번째 오류 발생
```
이 코드가 `Type HTMLInputElement | undefined is not assignable to type ReactNode` 오류다.  
리액트는 화면에 `string`, `number`, 다른 리액트 컴포넌트(JSX) 등은 출력할 수 있지만,
`HTMLInputElement`와 같은 순수 DOM 객체는 어떻게 그려야 할 지 모르기 떄문에 오류가 발생한다.


이 문제를 해결하기위해서는 상태에는 데이터를 저장해야한다.
`useState`가 문자열(string)을 저장할 수 있도록 타입을 바꿔주면된다.
이렇게 수정된 코드는 리액트에서 `제어 컴포넌트(Controlled Component)`라 부른다.
```tsx
 const [inputValue, setInputValue] = useState<string>("");
const onChange = (value: string) => {
 setInputValue(value);
}
```