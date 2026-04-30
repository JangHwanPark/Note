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

<br/>

## useRef 실제로 언제쓸까?
### 폼(input) 관리 (포커스, 값 유지)
상황: 사용자가 폼을 빠르게 입력할 수 있도록 특정 입력 필드에 자동 포커스를 주고 싶을 때

useRef를 사용하면 컴포넌트가 리렌더링되더라도 참조값이 유지되므로, 포커스를 안정적으로 적용할 수 있습니다.

#### 예제: 로그인 화면에서 이메일 입력 필드 자동 포커스
```tsx
import { useEffect, useRef } from "react";

const LoginForm = () => {
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus(); // 컴포넌트가 마운트될 때 자동으로 포커스 설정
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
사용 이유 : useRef를 사용하면 불필요한 렌더링 없이 특정 input 필드를 참조하고 조작할 수 있음.

<br/>

#### GSAP 같은 애니메이션 적용
- 상황: GSAP으로 특정 요소에 애니메이션을 적용해야 할 때
- useRef를 활용하면 React 상태 변화와 관계없이 애니메이션을 적용할 수 있음.
- 여러 개의 요소에 애니메이션을 적용해야 하면 useRef([]) 배열 방식으로 관리.

예제: GSAP를 활용한 리스트 애니메이션
```tsx
import { useRef, useEffect } from "react";
import gsap from "gsap";

const AnimatedList = () => {
  const itemsRef = useRef([]); // 여러 요소를 배열로 관리

  useEffect(() => {
    gsap.to(itemsRef.current, {
      opacity: 1,
      y: -20,
      stagger: 0.2, // 요소들을 순차적으로 애니메이션
      duration: 1,
    });
  }, []);

  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (itemsRef.current[i] = el)}
          className="item"
          style={{ opacity: 0 }}
        >
          Item {i + 1}
        </div>
      ))}
    </div>
  );
};
```
사용 이유
- 클래스로 선택하는 방식보다 안정적이며, 요소 개별 관리가 가능함. 
- useRef를 사용하면 React 상태와 관계없이 애니메이션을 적용할 수 있음.

<br/>

#### setInterval / setTimeout을 관리할 때
상황: 특정 작업을 일정 간격마다 실행하고 싶지만, 컴포넌트가 리렌더링될 때 setInterval을 유지해야 할 때

useRef를 사용하면 리렌더링 없이 setInterval을 저장하고 참조 가능.

예제: 자동으로 숫자가 증가하는 타이머
```tsx
import { useRef, useEffect, useState } from "react";

const Timer = () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null); // setInterval을 관리

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current); // 언마운트 시 정리
  }, []);

  return <div>타이머: {count}초</div>;
};
```
사용 이유
setInterval을 useRef에 저장하면 컴포넌트가 리렌더링될 때도 setInterval ID가 유지됨.
clearInterval(intervalRef.current)을 호출하여 언마운트 시 정리할 수 있음.

<br/>

#### 이전 상태(previous state) 값 저장
상황: 상태 변화 이전의 값을 유지하고 싶을 때

useRef를 사용하면 렌더링을 트리거하지 않으면서 이전 값을 저장할 수 있음.

예제: 이전 count 값 비교
```tsx
import { useState, useEffect, useRef } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(count);

  useEffect(() => {
    prevCountRef.current = count; // count 변경 시 이전 값 저장
  }, [count]);

  return (
    <div>
      <p>현재 값: {count}</p>
      <p>이전 값: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};
```
사용 이유
- 이전 값을 저장하면서도 렌더링을 발생시키지 않음. 
- useEffect 내부에서 prevCountRef.current = count를 업데이트하여 최신 값 유지.

<br/>

스크롤 위치 감지 및 조작
상황: 특정 요소로 스크롤 이동을 구현할 때

useRef를 활용하면 DOM 요소를 직접 참조하여 scrollIntoView() 등을 활용 가능.

예제: 버튼 클릭 시 특정 섹션으로 스크롤 이동
```tsx
import { useRef } from "react";

const ScrollComponent = () => {
  const sectionRef = useRef(null);

  const handleScroll = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <button onClick={handleScroll}>섹션으로 이동</button>
      <div style={{ height: "100vh" }} /> {/* 빈 공간 */}
      <div ref={sectionRef} style={{ height: "500px", background: "lightblue" }}>
        📌 여기로 스크롤됨
      </div>
    </div>
  );
};
```
사용 이유
- useRef를 사용하면 클릭 이벤트 발생 시 특정 DOM 요소로 부드럽게 스크롤 가능. 
- 상태 업데이트 없이 DOM 조작 가능하여 성능적으로도 효율적.

<br/>

#### 외부 클릭 감지 (Dropdown, Modal)
상황: 특정 영역 바깥을 클릭했을 때 모달/드롭다운을 닫아야 할 때

useRef를 활용하면 컴포넌트 바깥 클릭을 감지할 수 있음.

예제: 바깥 클릭 시 드롭다운 닫기
```tsx
import { useRef, useEffect, useState } from "react";

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>메뉴</button>
      {open && <div className="dropdown-content">드롭다운 내용</div>}
    </div>
  );
};
```
사용 이유 : useRef를 이용해 드롭다운 영역을 감지하여, 바깥을 클릭하면 닫힘.