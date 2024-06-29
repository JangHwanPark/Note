### useRef Hook

---
`useRef`를 처음 공부할때 컴포넌트의 리랜더링이 안되는데 왜 사용하는지 궁금했었다. 최근 모달 팝업을 만들면서 `useRef`의 사용 목적을 이해하게 되어 정리했다.

- `useRef`의 사용목적은 DOM 요소나 자바스크립트의 객체를 `직접 참조`하기 위해 사용한다.
- useRef 는 참조한 객체가 변경되어도 컴포넌트가 리랜더링 되지 않는다.
- 초기값은 `{ current: initialValue }` 형태로 설정된다.
- 주로 포커스를 설정하거나 DOM 요소의 값을 읽거나 외부 라이브러리와 상호작용할 때 사용한다.

ref 를 사용하여 둠 요소에 접근 예제
```javascript
import React, {useRef} from "react";

const FocusInput = () => {
    // useRef 를 사용해 input 요소에 대한 참조 생성
    const inputRef = useRef(null);
    
    // 버튼 클릭시 input 요소에 포커스 설정
    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }
    
    return (
        <div>
            <input ref={inputRef} type={"text"}/>
            <button onClick={handleFocus}>포커스</button>
        </div>
    )
}
```

ref 를 사용하여 값을 유지하는 예제
```javascript
import React, { useRef, useState, useEffect } from 'react';

const RenderCount = () => {
  const [count, setCount] = useState(0);
  
  // useRef를 사용하여 렌더링 횟수를 추적
  const renderCount = useRef(1);

  // 컴포넌트가 리렌더링될 때마다 useEffect가 실행됨
  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>카운터: {count}</p>
      <p>리랜더링: {renderCount.current} times</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
};
```

ref 를 사용하여 이전값을 기억하는 예제
```javascript
import React, { useState, useRef, useEffect } from 'react';

const PreviousValue = () => {
  const [count, setCount] = useState(0);
  
  // useRef를 사용하여 이전 count 값을 저장
  const prevCountRef = useRef(0);

  // count 값이 변경될 때마다 useEffect가 실행됨
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <p>이전 카운트: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
};
```

### <br>useRef 의 리랜더링

---
리랜더링이란 컴포넌트의 상태나 props 가 변경될 때 리액트가 컴포넌트를 화면에 다시 그리는 과정이다. 이때 컴포넌트는 최신 상태를 반영하여 UI를 업데이트한다.

`useRef`훅은 참조(reference)를 저장할 수 있는 객체를 반환하며, 이 객체는 컴포넌트의 `전체 수명`동안 유지된다. 이는 DOM 요소나 다른 값을 저장할때 유용하게 사용되며 `useRef`로 생성된 참조 객체의 `.current`속성이 변경되어도 컴포넌트는 리랜더링 되지 않는다.

#### <br>참조의 변경
`useRef`를 통해 참조된 객체는 변경될 수 있지만, `참조 객체 자체`가 변경되지 않는한 컴포넌트는 리랜더링되지 않는다.

#### <br>상태관리와의 차이
`useState`를 사용하면 `상태가 변경될 때`마다 컴포넌트가 리랜더링된다. `useRef`의 경우 참조된 객체의 `.current`속성만 변경되며 컴포넌트는 그래도 유지된다.