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
| 상황                      | ref 사용이 유리 | className 사용이 유리 |
|-------------------------|------------|------------------|
| 하나의 요소에 애니메이션 적용        | ✅          | ❌                |
| 여러 요소에 한꺼번에 적용          | ❌          | ✅                |
| 컴포넌트 내부에서만 사용해야 함       | ✅          | ❌                |
| 반복되는 컴포넌트에 적용해야 함       | ❌          | ✅                |
| 애니메이션 대상이 동적으로 변할 수 있음  | ✅          | ❌                |
| StrictMode에서 안정적인 동작 필요 | ✅          | ❌                |