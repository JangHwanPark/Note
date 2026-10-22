## 애니메이션 대상을 고르는 두 방법
- React 컴포넌트에서 GSAP에게 움직일 요소를 알려 주는 두 가지 방법
- ref 방식은 `useRef` 로 잡아 둔 DOM 요소를 넘기고, className 방식은 `".box"` 같은 선택자 문자열을 넘겨 GSAP이 문서에서 찾게 한다
- 두 방식 모두 컴포넌트가 사라질 때 애니메이션을 정리해야 하고, React에서는 `@gsap/react` 의 `useGSAP` 이 그 일을 맡아 준다

### 선택자 (Selector)
사전적 의미는 고르는 것, 고르는 장치다.
공학적으로는 `".box"`, `"#title"` 처럼 문서에서 어떤 요소를 고를지 적은 문자열을 말한다. GSAP에 선택자를 넘기면 GSAP이 `document.querySelectorAll()` 과 같은 방식으로 요소를 찾는다.

### ref (Reference)
사전적 의미는 참조, 가리킴이다. 무언가를 직접 들고 있지 않고 그것이 어디 있는지 가리킨다는 뜻이다.
React에서 ref는 렌더링과 상관없이 값을 담아 두는 객체이고, 요소에 연결하면 `ref.current` 가 그 DOM 요소를 가리킨다. GSAP에 `ref.current` 를 넘기면 GSAP은 찾을 필요 없이 가리킨 요소를 바로 움직인다.

이름표를 달아 둔 물건을 직접 건네주는 것(ref)과, "빨간 상자 전부"라고 말로 시키는 것(className)의 차이와 같다. 말로 시키면 편하지만, 다른 방에 있는 빨간 상자까지 들고 올 수 있다.

<br/>

## 두 방식의 차이
| 기준 | ref | className(선택자) |
| --- | --- | --- |
| 무엇을 고르나 | ref에 연결한 요소 하나(배열이면 여러 개) | 문서 전체에서 그 클래스를 가진 요소 모두 |
| 다른 컴포넌트에 미치는 영향 | 없다 | 같은 클래스를 쓰는 다른 컴포넌트 요소까지 잡힌다 |
| 여러 요소를 다룰 때 | ref 배열을 따로 만들어야 한다 | 선택자 하나로 끝난다 |
| 요소마다 다른 값 주기 | 가능하다 | 가능하다(함수 값, `stagger`) |

gsap 3.15.0과 React 19.2를 jsdom에서 실행해, 컴포넌트 안에서 `gsap.to(".box", ...)` 를 부르면 컴포넌트 바깥에 있는 `.box` 요소에도 트윈이 걸리는 것을 확인했다. 선택자 방식의 진짜 문제는 이것이다. 반대로 선택자로 골라도 요소마다 다른 값을 줄 수 있다. `x: (i) => i * 100` 처럼 함수를 넘기면 세 상자가 각각 0, 100px, 200px로 움직였다.

<br/>

## ref로 고르기
`useRef` 로 만든 ref를 요소에 연결하고, 그 요소를 GSAP에 넘긴다. 이 컴포넌트가 그린 요소만 정확히 가리키므로 같은 컴포넌트를 화면에 여러 번 그려도 서로 섞이지 않는다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ExampleRef = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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

요소가 여러 개면 ref도 여러 개 필요하다. map으로 그린 요소를 ref 배열로 모으는 방법은 [여러 요소에 ref 연결하기](../../../React/여러%20요소에%20ref%20연결하기(Refs%20for%20Multiple%20Elements)/README.md)에 정리했다.

<br/>

## 선택자로 고르기
선택자는 코드가 짧고, 같은 클래스를 가진 요소 여러 개에 한 번에 애니메이션을 걸 수 있다. 문제는 범위다. 그냥 `".box"` 라고 쓰면 문서 전체에서 찾으므로, 다른 컴포넌트가 같은 클래스를 쓰면 그 요소까지 움직인다.

`useGSAP` 에 `scope` 로 컨테이너 ref를 주면, 그 안에서 쓴 선택자는 컨테이너 안에서만 찾는다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ExampleClass = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".box", { x: 100, duration: 1 }); // containerRef 안의 .box만
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <div className="box w-20 h-20 bg-red-500">Box</div>
    </div>
  );
};

export default ExampleClass;
```

gsap 3.15.0, `@gsap/react` 2.1.2, React 19.2에서 실행해 바깥의 `.box` 에는 트윈이 걸리지 않는 것을 확인했다.

<br/>

## StrictMode와 정리
개발 환경의 StrictMode는 컴포넌트를 붙였다 떼었다 다시 붙여서 effect를 두 번 실행한다. `useEffect` 안에서 `gsap.to()` 만 부르고 정리하지 않으면 트윈이 두 개 생긴다. 이것은 ref 방식이든 선택자 방식이든 같다. gsap 3.15.0, React 19.2에서 두 방식 모두 StrictMode에서 요소에 걸린 트윈이 2개였다.

그래서 어느 방식을 고르느냐보다 정리를 하느냐가 중요하다. `useGSAP` 은 컴포넌트가 사라질 때 그 안에서 만든 애니메이션을 되돌려 주므로, 같은 조건에서 트윈이 1개만 남았다. `useEffect` 를 쓴다면 만든 트윈의 `revert()` 나 `kill()` 을 정리 함수에서 부른다.

<br/>

## 언제 어떤 방식을 쓸까
| 상황 | 알맞은 방식 |
| --- | --- |
| 요소 하나를 움직일 때 | ref |
| 컴포넌트 안의 같은 클래스 요소 여러 개를 한 번에 | `scope` 를 준 선택자 |
| 같은 컴포넌트를 화면에 여러 번 그릴 때 | ref, 또는 `scope` 를 준 선택자 |
| 요소마다 따로 반응해야 할 때(마우스 올림 등) | ref, 또는 JSX 이벤트 props |

<br/>

## 여러 요소에 같은 애니메이션 적용하기
클래스로 고른 여러 요소에 애니메이션을 줄 때는 한 번에 넘기는 방법과, 요소를 하나씩 돌며 이벤트를 붙이는 방법이 있다. React에서 반복되는 요소를 ref 배열로 모으는 방법은 [여러 요소에 ref 연결하기](../../../React/여러%20요소에%20ref%20연결하기(Refs%20for%20Multiple%20Elements)/README.md)에 정리했다.

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

`gsap.from()` 은 지정한 값에서 시작해 원래 상태로 돌아오므로, 상자 세 개가 투명한 상태에서 차례로 나타난다. gsap 3.15.0을 jsdom에서 실행해, 첫 프레임 뒤 아직 차례가 오지 않은 두 상자는 opacity 0으로 기다리고 끝난 뒤에는 세 상자 모두 1인 것을 확인했다.

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

React 컴포넌트라면 이렇게 직접 붙이기보다 JSX의 `onMouseEnter`, `onMouseLeave` 를 쓰는 편이 간단하다. 이벤트를 붙이고 떼는 일은 React가 맡아 준다. 다만 React가 떼어 주는 것은 이벤트이고, 핸들러 안에서 만든 트윈은 아니다. 핸들러를 `useGSAP` 이 돌려주는 `contextSafe` 로 감싸면 그 안에서 만든 트윈도 컴포넌트가 사라질 때 함께 정리된다.

```tsx
const { contextSafe } = useGSAP();

const handleEnter = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
  gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 });
});
const handleLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
  gsap.to(e.currentTarget, { scale: 1, duration: 0.3 });
});

return (
  <div className="box" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
    Box
  </div>
);
```

그냥 핸들러에서 `gsap.to()` 를 부른 요소는 컴포넌트를 없앤 뒤에도 트윈이 1개 남았고, `contextSafe` 로 감싼 요소는 0개였다.

<br/>

## 확인한 환경
이 장의 실행 결과는 gsap 3.15.0, `@gsap/react` 2.1.2, React 19.2.0, Node.js 22.13.0, jsdom 25에서 확인했다. 예시 코드는 TypeScript 5.6 strict로 타입 검사했다. jsdom은 화면을 그리지 않으므로 움직임은 트윈 개수와 스타일 값으로만 확인했다.

<br/>

[목차](../README.md) | [이전 장: 깜빡임 효과](../05_깜빡임%20효과(Blink%20Effect)/README.md) | [다음 장: 캐러셀 슬라이드](../07_캐러셀%20슬라이드(Carousel)/README.md)
