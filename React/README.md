## 리액트란 ?
- 리액트(React)는 사용자 인터페이스(UI)를 만드는 JavaScript 라이브러리다. Meta(옛 Facebook)가 만들었다
- 화면을 컴포넌트라는 작은 조각으로 나눠 만들고, 그 조각들을 조립해 페이지를 만든다
- 개발자는 상태에 따라 화면이 어떻게 보여야 하는지만 적고, 상태가 바뀌면 바뀐 부분을 다시 그리는 일은 React가 맡는다
- 이 폴더는 프레임워크 없이 쓰는 React 자체의 개념을 정리한다. Next.js 고유의 내용은 [NextJS](../NextJS) 폴더에 둔다

### 리액트 (React)
사전적 의미는 반응하다. 어떤 자극을 받아 그에 맞게 움직이는 것이다.
공학적으로는 데이터(상태)가 바뀌면 화면이 그 변화에 반응해 다시 그려진다는 뜻으로 이 이름이 붙었다. 버튼을 눌러 숫자가 바뀌면, 그 숫자를 보여 주는 부분이 알아서 새 값으로 바뀐다.

### 컴포넌트 (Component)
사전적 의미는 구성 요소, 부품. 기계를 이루는 하나하나의 부품을 말한다.
공학적으로는 화면의 한 부분을 맡는, 다시 쓸 수 있는 UI 조각을 말한다. 버튼, 입력창, 카드처럼 작은 부품을 만들어 두고, 이를 조립해 더 큰 화면을 만든다. React에서는 JSX를 돌려주는 함수로 만든다.

```jsx
function Greeting({ name }) {
  return <h1>안녕, {name}</h1>
}
```

### 상태 (State)
사전적 의미는 사물이나 현상이 놓여 있는 모양이나 형편.
공학적으로는 컴포넌트가 기억하고 있다가, 바뀌면 화면을 다시 그리게 하는 값을 말한다. 입력창에 쓴 글자, 열린 메뉴, 장바구니에 담긴 수량처럼 사용자의 조작에 따라 바뀌는 값이 상태다. `useState` 로 만든다.

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

`setCount` 로 값을 바꾸면 React가 `Counter` 를 다시 실행해 화면의 숫자를 새 값으로 바꾼다. 화면을 직접 고치는 코드(`button.textContent = ...`)를 쓰지 않아도 된다.

<br/>

## Hooks
- [useRef 훅](./useRef%20훅(useRef%20Hook)) : useRef 기본과 실제로 쓰는 경우
- [여러 요소에 ref 연결하기](./여러%20요소에%20ref%20연결하기(Refs%20for%20Multiple%20Elements)) : map으로 그린 여러 요소를 ref 하나로 관리하는 방법과 타입
- [useMemo와 useCallback](./useMemo와%20useCallback(useMemo%20and%20useCallback)) : 두 메모이제이션 훅의 사용 기준

<br/>

## 상태
- [배열 상태 다루기](./배열%20상태%20다루기(Array%20State)) : 배열 상태에 push를 쓰지 않는 이유와 setState를 props로 넘길 때의 타입
- [입력창 상태 타입 실수](./입력창%20상태%20타입%20실수(Input%20State%20Type%20Mistakes)) : 상태에 DOM 객체를 담았을 때 나는 타입 오류와 제어 컴포넌트

<br/>

## 컴포넌트와 문법
- [컴포넌트 패턴](./컴포넌트%20패턴(Component%20Patterns)) : 합성, 컨테이너/프레젠테이션, 렌더 프롭, 고차 컴포넌트, 커스텀 훅
- [프래그먼트](./프래그먼트(Fragment)) : Fragment와 단축 문법의 차이, key가 필요한 경우
- [FormEvent 사용 중단](./FormEvent%20사용%20중단(FormEvent%20Deprecation)) : @types/react에서 FormEvent가 deprecated로 바뀐 내용과 SubmitEventHandler
- [UI 컴포넌트 만들기](./UI%20컴포넌트%20만들기(Building%20UI%20Components)) : 스텝퍼, 캐러셀, 페이지네이션, 프로그래스 바
- [스크롤 애니메이션](./스크롤%20애니메이션(Scroll%20Animation)) : 화면에 들어올 때 나타나는 효과와 특정 위치로 스크롤하기

<br/>

## 참고 링크
- [React TypeScript 치트시트](https://react-typescript-cheatsheet.netlify.app/)

<br/>

## 더 볼 것 (TODO)
- useReducer 잘 쓰기
- 상태 관리란 무엇인가
- 서버 상태와 클라이언트 상태
- 리렌더링과 최적화 (React.memo, React.lazy와 Suspense, 가상화)
