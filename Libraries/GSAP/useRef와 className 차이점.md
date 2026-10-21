| 비교 항목     | ref 사용 방식          | className 사용 방식           |
|-----------|--------------------|---------------------------|
| 제어 방식     | 특정 요소 하나를 직접 제어    | 같은 클래스를 가진 모든 요소 제어       |
| React 연동  | Virtual DOM과 잘 맞음  | Virtual DOM과 충돌 가능        |
| 재사용성      | 낮음 (각 요소마다 ref 필요) | 높음 (CSS처럼 활용 가능)          |
| 성능        | 최적화 가능             | 많은 요소에 적용 시 성능 저하 가능      |
| 복잡한 애니메이션 | 가능 (각 요소 개별 제어 가능) | 불가능 (모든 요소에 동일한 애니메이션 적용) |

## ref 사용 방식
React의 useRef를 활용하여 특정 요소를 직접 참조하는 방식

### 특징
- 컴포넌트 내부에서 특정 요소를 직접 제어할 수 있음 
- 동적인 요소를 조작할 때 유리 
- React의 Virtual DOM과 원활하게 연동 
- 재사용성이 낮음 (고유한 ref 필요)

### 장점
- ref를 통해 DOM 요소를 직접 제어 
- 컴포넌트가 여러 개 존재할 때 충돌 없이 개별 요소 조작 가능 
- React.StrictMode에서 동작 안정적

### 단점
- 반복되는 애니메이션을 적용할 때 불편 (매번 ref 선언 필요)
- 여러 개의 요소를 한 번에 조작하기 어려움

### 사용 예시 (ref 활용)
```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ExampleRef = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(boxRef.current, { x: 100, duration: 1 });
  }, []);

  return (
    <div ref={boxRef} className="w-20 h-20 bg-blue-500">
      Box
    </div>
  );
};

export default ExampleRef;
```

<br/>

## className 사용 방식
GSAP가 document.querySelectorAll()을 활용하여 특정 클래스를 가진 모든 요소를 찾아 조작

### 특징
- 여러 개의 요소를 한 번에 제어할 때 유리 
- 재사용성이 높음 
- useRef 없이 편리하게 사용 가능 
- 가끔 Virtual DOM과 충돌 가능

### 장점
- 같은 클래스를 가진 여러 개의 요소에 한 번에 적용 가능
- 재사용성 높음 (CSS처럼 사용 가능)
- 코드가 간결

### 단점
- Virtual DOM과 충돌 가능
- 특정 요소만 개별적으로 조작할 때 불편
- document.querySelectorAll(".box") 방식이므로 여러 요소를 애니메이션할 경우 성능 저하 가능

### 사용 예시 (className 활용)
```tsx
import { useEffect } from "react";
import gsap from "gsap";

const ExampleClass = () => {
  useEffect(() => {
    gsap.to(".box", { x: 100, duration: 1 });
  }, []);

  return (
    <div className="box w-20 h-20 bg-red-500">
      Box
    </div>
  );
};

export default ExampleClass;
```

<br/>

## 언제 어떤 방식을 사용해야 할까?
| 상황 | 알맞은 방식 |
| --- | --- |
| 하나의 요소에 애니메이션 적용 | ref |
| 여러 요소에 한꺼번에 적용 | className |
| 컴포넌트 내부에서만 사용해야 함 | ref |
| 반복되는 컴포넌트에 적용해야 함 | className |
| 애니메이션 대상이 동적으로 변할 수 있음 | ref |
| StrictMode에서 안정적인 동작 필요 | ref |

<br/>

## 여러 요소에 같은 애니메이션 적용하기
클래스로 고른 여러 요소에 애니메이션을 줄 때는 한 번에 넘기는 방법과, 요소를 하나씩 돌며 이벤트를 붙이는 방법이 있다. React에서 반복되는 요소를 ref 배열로 모으는 방법은 [여러 요소에 ref 연결하기](../../React/여러%20요소에%20ref%20연결하기(Refs%20for%20Multiple%20Elements)/README.md)에 정리했다.

### 한 번에 적용하기
`gsap.to(".box", ...)` 처럼 선택자 문자열을 그대로 넘겨도 GSAP이 요소를 모두 찾아 같은 애니메이션을 건다. `stagger` 를 주면 요소마다 시작 시간을 조금씩 늦춰 차례로 움직인다.

`gsap.utils.toArray()` 는 선택자로 찾은 요소들(NodeList)을 진짜 배열로 바꿔 준다. 애니메이션만 걸 때는 필요 없고, 배열 메서드(`map`, `forEach`)를 쓰거나 몇 번째 요소인지 알아야 할 때 쓴다. 두 번째 인자로 범위가 될 요소를 주면 그 안에서만 찾으므로, 같은 클래스를 쓰는 다른 컴포넌트의 요소가 섞이지 않는다.

```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const StaggerBoxes = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boxes = gsap.utils.toArray<HTMLElement>(".box", containerRef.current); // 이 컴포넌트 안의 .box만
    const tween = gsap.from(boxes, {
      opacity: 0,
      y: 50,
      stagger: 0.2, // 요소마다 0.2초씩 늦게 시작
      duration: 1,
    });
    return () => {
      tween.revert(); // 컴포넌트가 사라질 때 애니메이션을 되돌린다
    };
  }, []);

  return (
    <div ref={containerRef}>
      {[1, 2, 3].map((n) => (
        <div key={n} className="box">Box {n}</div>
      ))}
    </div>
  );
};
```

`gsap.from()` 은 지정한 값에서 시작해 원래 상태로 돌아오므로, 상자 세 개가 투명한 상태에서 차례로 나타난다. jsdom에서 실행해 시작할 때 세 상자의 opacity가 0, 끝난 뒤 1인 것을 확인했다(GSAP 3.13).

### 요소마다 이벤트 등록하기
마우스를 올렸을 때 그 요소만 커지게 하는 것처럼 요소마다 따로 반응해야 하면, 요소를 하나씩 돌며 이벤트를 붙인다. 익명 함수로 바로 붙이면 나중에 같은 함수를 넘길 수 없어 `removeEventListener` 로 떼어 낼 수 없다. 그래서 핸들러를 변수에 담아 두고, effect의 정리 함수에서 떼어 낸다.

```tsx
useEffect(() => {
  const boxes = gsap.utils.toArray<HTMLElement>(".box", containerRef.current);

  const cleanups = boxes.map((box) => {
    const handleEnter = () => gsap.to(box, { scale: 1.2, duration: 0.3 });
    const handleLeave = () => gsap.to(box, { scale: 1, duration: 0.3 });

    box.addEventListener("mouseenter", handleEnter);
    box.addEventListener("mouseleave", handleLeave);

    return () => {
      box.removeEventListener("mouseenter", handleEnter);
      box.removeEventListener("mouseleave", handleLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}, []);
```

여기서는 요소마다 `forEach` 대신 `map` 으로 돌며 떼어 낼 함수를 모아 두려고 `toArray()` 를 썼다. 컴포넌트를 없앤 뒤 `mouseleave` 를 보내도 크기가 바뀌지 않아, 이벤트가 떨어진 것을 확인했다.

React 컴포넌트라면 이렇게 직접 붙이기보다 JSX의 `onMouseEnter`, `onMouseLeave` 를 쓰는 편이 간단하다. 붙이고 떼는 일을 React가 맡아 준다.

```tsx
<div
  className="box"
  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })}
  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
>
  Box
</div>
```
