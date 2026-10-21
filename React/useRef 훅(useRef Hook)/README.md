## useRef란 ?
- 렌더링과 상관없이 값을 넣어 두는 사물함을 만드는 React 훅이다
- `useRef(초기값)` 은 `{ current: 초기값 }` 모양의 객체를 돌려주고, 이 객체는 컴포넌트가 화면에서 사라질 때까지 같은 객체로 유지된다
- `current` 를 바꿔도 컴포넌트는 다시 렌더링되지 않는다. 그래서 DOM 요소를 가리키거나, 화면에 보이지 않는 값(타이머 ID 등)을 담을 때 쓴다

`useRef` 를 처음 공부할 때는 바꿔도 리렌더링이 안 되는데 왜 쓰는지 궁금했다. 입력창 포커스, 타이머 정리, 드롭다운 바깥 클릭 감지처럼 화면을 다시 그릴 필요는 없지만 값이나 요소를 붙잡고 있어야 하는 일을 만들면서 사용 목적을 이해하게 되어 정리했다.

### 참조 (Reference)
사전적 의미는 참고로 비교하고 대조하여 봄이다. 무언가를 볼 때 다른 것을 함께 가리켜 찾아본다는 뜻이다.
공학적으로는 이 가리켜 찾아본다는 뜻을 살려, 값 자체가 아니라 값이 있는 곳을 가리키는 것을 말한다. ref는 reference의 줄임말로, `inputRef.current` 가 실제 `<input>` DOM 요소를 가리키게 해서 그 요소를 직접 다룰 수 있게 한다.

### 사물함으로 이해하기
`useRef` 는 컴포넌트가 받은 사물함과 같다. 사물함 안의 물건(`current`)은 언제든 바꿔 넣을 수 있지만, 바꿔 넣었다고 누가 알려 주지는 않는다. 반면 `useState` 는 게시판이라서 내용을 바꾸면 모두가 다시 본다(리렌더링).

<br/>

## 왜 필요할까
컴포넌트 함수 안에서 `let` 으로 만든 변수는 렌더링될 때마다 함수가 다시 실행되면서 처음 값으로 돌아간다. 값을 유지하려면 `useState` 를 써야 하는데, `useState` 는 값을 바꿀 때마다 다시 렌더링한다. 화면에 보여 줄 필요가 없는 값까지 상태로 두면 쓸데없이 렌더링이 일어난다.

`useRef` 는 그 사이를 채운다. 렌더링이 여러 번 일어나도 값이 유지되고, 값을 바꿔도 렌더링이 일어나지 않는다.

| 방법 | 렌더링 사이에 값 유지 | 값을 바꾸면 리렌더링 |
| --- | --- | --- |
| 일반 변수 (`let`) | 안 됨 | 안 됨 |
| `useState` | 됨 | 됨 |
| `useRef` | 됨 | 안 됨 |

<br/>

## 어떻게 동작할까
React는 컴포넌트마다 처음 렌더링할 때 `{ current: 초기값 }` 객체를 하나 만들어 두고, 이후 렌더링에서는 같은 객체를 돌려준다. 우리가 바꾸는 것은 이 객체 안의 `current` 속성뿐이고 객체 자체는 그대로다. `current` 를 바꾸는 것은 `setState` 처럼 리렌더링을 요청하지 않는다. React는 상태가 바뀌었을 때만 다시 렌더링하므로 화면도 그대로다.

아래 예시에서 버튼을 누르면 `countRef.current` 는 올라가지만 화면의 숫자는 0에 머문다. 다른 이유로 리렌더링이 일어날 때 그동안 쌓인 값이 한꺼번에 보인다. 이 예시는 차이를 보여 주려고 JSX에서 `countRef.current` 를 읽는데, 이는 아래에서 볼 규칙에 어긋나므로 실제 코드에서는 이렇게 쓰지 않는다.

```tsx
import { useRef } from 'react';

const RefCounter = () => {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current += 1;
    console.log(countRef.current); // 1, 2, 3... 콘솔에서는 올라간다
  };

  return <button onClick={handleClick}>{countRef.current}</button>; // 화면은 0 그대로
};
```

<br/>

## DOM 요소 참조하기
JSX 요소에 `ref={inputRef}` 를 넘기면 React가 화면에 요소를 붙인 뒤 `inputRef.current` 에 그 DOM 요소를 넣고, 요소가 사라지면 `null` 로 되돌린다. 이렇게 처음 화면에 붙는 것을 마운트(mount)라고 한다. 사전적 의미는 받침대에 올려 고정하는 것이고, 사라지는 것은 반대로 언마운트(unmount)라고 한다. 처음 렌더링하는 동안에는 아직 마운트 전이라 `current` 가 `null` 이다. 그래서 TypeScript에서는 `useRef<HTMLInputElement>(null)` 처럼 가리킬 요소의 타입과 초기값 `null` 을 함께 쓰고, 쓸 때는 `null` 인지 확인한다.

```tsx
import { useRef } from 'react';

const FocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus(); // 아직 화면에 없으면 null 이라 확인 후 호출
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>포커스</button>
    </div>
  );
};
```

`map()` 으로 그린 여러 요소에 ref를 하나씩 연결하는 방법은 [여러 요소에 ref 연결하기](../여러%20요소에%20ref%20연결하기(Refs%20for%20Multiple%20Elements)/README.md)에 정리했다.

<br/>

## 렌더링 중에는 ref를 읽거나 쓰지 않는다
React 공식 문서는 초기화할 때를 빼고는 렌더링 중(컴포넌트 함수 본문과 JSX)에 `ref.current` 를 읽거나 쓰지 말라고 한다. React는 컴포넌트 본문이 같은 입력에 같은 결과를 내는 순수 함수처럼 동작하기를 기대하는데, 렌더링과 따로 바뀌는 ref를 렌더링 중에 다루면 결과를 예측할 수 없게 되기 때문이다. ref는 이벤트 핸들러나 `useEffect` 안에서 다룬다.

렌더링 횟수를 세는 아래 예시가 이 규칙을 어기는 흔한 경우다.

```tsx
import { useEffect, useRef, useState } from 'react';

const RenderCount = () => {
  const [count, setCount] = useState(0);
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1; // 렌더링이 끝날 때마다 1 증가
  });

  return (
    <div>
      <p>카운터: {count}</p>
      <p>리렌더링: {renderCount.current}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
};
```

React 19.2에서 처음 화면에 나왔을 때와 버튼을 두 번 누른 뒤를 차례로 보면, 일반 모드에서는 리렌더링이 1, 2, 3으로 맞게 나온다. 그런데 `StrictMode` 를 켠 개발 환경에서는 1, 3, 4로 나온다. `StrictMode` 는 실수를 찾으려고 처음 마운트될 때 effect를 한 번 더 실행하는데, 그 실행까지 횟수에 더해졌기 때문이다. 또 이 숫자는 `count` 가 바뀌어 다시 렌더링될 때만 화면에 반영된다. 렌더링 횟수를 보고 싶다면 화면에 그리지 말고 effect 안에서 `console.log` 로 찍는 편이 맞다.

<br/>

## 실제로 언제 쓸까
### 폼 입력창에 자동 포커스
로그인 화면이 열리자마자 이메일 입력창에 커서를 두고 싶을 때 쓴다. 요소가 화면에 붙은 뒤에 실행되는 `useEffect` 에서 포커스를 준다.

```tsx
import { useEffect, useRef } from 'react';

const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus(); // 마운트된 뒤 이메일 입력창에 포커스
  }, []);

  return (
    <form>
      <input ref={emailRef} type="email" placeholder="이메일을 입력하세요" />
      <input type="password" placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>
  );
};
```

### 타이머 ID 보관
`setInterval` 이 돌려주는 ID는 나중에 `clearInterval` 로 멈출 때만 필요하고 화면에는 보이지 않는다. 상태로 두면 ID를 저장할 때 쓸데없는 렌더링이 일어나므로 ref에 둔다. 아래처럼 다른 이벤트 핸들러에서 멈추려면 effect 밖에서도 ID에 접근할 수 있어야 해서 ref가 필요하다.

```tsx
import { useEffect, useRef, useState } from 'react';

const Timer = () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current); // 언마운트 시 정리
    };
  }, []);

  const handleStop = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
  };

  return (
    <div>
      타이머: {count}초 <button onClick={handleStop}>멈춤</button>
    </div>
  );
};
```

`setInterval` 앞에 `window.` 를 붙인 것은 타입 때문이다. Node 타입이 함께 잡혀 있는 프로젝트에서는 `setInterval` 이 `NodeJS.Timeout` 을 돌려주는 것으로 잡혀 `number` 와 맞지 않을 수 있다. `window.setInterval` 은 항상 `number` 를 돌려준다.

### 특정 섹션으로 스크롤
DOM 요소를 가리켜 두면 `scrollIntoView()` 같은 DOM 메서드를 바로 부를 수 있다.

```tsx
import { useRef } from 'react';

const ScrollComponent = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <button onClick={handleScroll}>섹션으로 이동</button>
      <div style={{ height: '100vh' }} />
      <div ref={sectionRef} style={{ height: '500px', background: 'lightblue' }}>
        여기로 스크롤됨
      </div>
    </div>
  );
};
```

### 바깥 클릭으로 드롭다운 닫기
드롭다운 영역을 ref로 가리켜 두고, 문서 전체에서 일어난 클릭이 그 영역 안인지 `contains()` 로 확인한다. 바깥이면 닫는다.

```tsx
import { useEffect, useRef, useState } from 'react';

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>메뉴</button>
      {open && <div className="dropdown-content">드롭다운 내용</div>}
    </div>
  );
};
```

### 이전 값 기억하기
흔히 아래처럼 effect에서 이전 값을 ref에 저장하고 화면에 그린다. `count` 를 1씩 올리는 버튼을 붙여 두 번 누르면 일반 모드에서 현재 값 1, 이전 값 0, 그다음 현재 값 2, 이전 값 1로 나와 동작은 한다.

```tsx
const [count, setCount] = useState(0);
const prevCountRef = useRef(count);

useEffect(() => {
  prevCountRef.current = count; // 렌더링이 끝난 뒤 지금 값을 저장
}, [count]);

// JSX에서 prevCountRef.current 를 그린다
```

하지만 렌더링 중에 `prevCountRef.current` 를 읽으므로 앞의 규칙에 어긋난다. 화면에 보여 줄 값은 상태로 두는 것이 원칙이므로 이전 값도 상태로 둔다. 값을 바꾸는 곳에서 바꾸기 전 값을 함께 저장하면 된다.

```tsx
const [count, setCount] = useState(0);
const [prevCount, setPrevCount] = useState<number | null>(null);

const handleClick = () => {
  setPrevCount(count);
  setCount(count + 1);
};
```

이전 값을 화면에 그리지 않고 effect나 이벤트 핸들러 안에서만 비교한다면 ref로 두어도 된다.

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 참조 (Reference, ref) | 참고로 비교하고 대조하여 봄 | 값이나 DOM 요소를 넣어 두는 사물함 |
| current | 현재의 | ref 사물함 안에 든 지금 값 |
| 리렌더링 (Re-rendering) | 다시 그림 | 상태나 props가 바뀌어 컴포넌트 함수가 다시 실행되는 것 |
| StrictMode | 엄격한 모드 | 개발 중에 일부 동작을 두 번 실행해 실수를 드러내는 React 기능 |

<br/>

## 참고 자료
- [React 공식 문서: useRef](https://ko.react.dev/reference/react/useRef)
- [React 공식 문서: Ref로 값 참조하기](https://ko.react.dev/learn/referencing-values-with-refs)

<br/>

## 더 볼 것 (TODO)
- 자식 컴포넌트의 DOM에 ref 넘기기 (React 19의 ref prop, 이전의 forwardRef)
- useImperativeHandle
