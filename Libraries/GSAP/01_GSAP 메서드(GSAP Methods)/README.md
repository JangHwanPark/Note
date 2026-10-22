## GSAP 메서드란 ?
- GSAP으로 애니메이션 하나(트윈)를 만드는 함수. 가장 많이 쓰는 것이 `gsap.to()`, `gsap.from()`, `gsap.fromTo()` 셋이다
- 셋 다 대상, 목표 값, 시간을 받는다. 차이는 시작 값과 끝 값을 어디서 가져오느냐다
- `to()` 는 지금 상태에서 적은 값으로, `from()` 은 적은 값에서 지금 상태로, `fromTo()` 는 적은 시작 값에서 적은 끝 값으로 움직인다

### 트윈 (Tween)
between(사이)에서 온 말로, 애니메이션 업계에서 시작 그림과 끝 그림 사이를 채워 넣는 일을 가리켰다.
GSAP에서는 시작 값과 끝 값을 주면 그 사이 값을 시간에 맞춰 계산해 주는 애니메이션 하나를 말한다. `gsap.to()` 같은 메서드가 돌려주는 객체가 트윈이고, 이 객체로 재생, 멈춤, 되감기를 할 수 있다.

출발지와 도착지만 알려 주면 길은 내비게이션이 계산하는 것과 같다. `to()` 는 목적지만 말하고 출발은 지금 자리, `from()` 은 출발지만 말하고 도착은 지금 자리, `fromTo()` 는 둘 다 말한다.

<br/>

## 왜 세 가지로 나뉘었을까
애니메이션을 만들 때 둘 중 하나는 이미 정해져 있는 경우가 많다. 버튼을 눌러 상자를 옮길 때는 지금 자리가 출발점이다. 페이지가 열리며 글자가 아래에서 떠오를 때는 CSS로 잡아 둔 최종 배치가 도착점이다. 이미 정해진 쪽은 GSAP이 요소의 현재 스타일에서 읽어 오게 하고, 모르는 쪽만 적도록 메서드를 나눴다.

<br/>

## gsap.to()
지금 상태에서 적은 값으로 움직인다. 시작 값은 애니메이션이 처음 실행될 때 요소의 현재 스타일에서 읽는다.

```js
gsap.to(".box", {
  x: 100,       // 지금 위치에서 x축으로 100px 이동
  opacity: 1,   // 지금 투명도에서 1로
  duration: 2,  // 2초 동안
});
```

`opacity: 0.5` 인 상자에 위 코드를 실행하고 진행률을 50%로 맞추면 `transform` 은 `translate3d(75px, 0px, 0px)`, `opacity` 는 `0.875` 였다. 50% 시점인데 75px인 이유는 기본 이징이 `power1.out` 이라 처음에 빨리 가기 때문이다(2장). 움직이는 동안은 `translate3d`, 끝나면 `translate` 로 적히는 것은 GSAP의 `force3D` 기본값(`"auto"`) 때문이다. 움직이는 동안만 3D 변형으로 바꿔 GPU 합성을 쓰게 하고, 끝나면 일반 2D 변형으로 돌린다. `force3D: false` 를 주니 움직이는 동안에도 `translate(75px, 0px)` 로 적혔다. 100%에서는 `translate(100px, 0px)`, `opacity: 1` 이다.

버튼을 눌러 특정 위치로 옮기기, 마우스를 올렸을 때 커지기처럼 지금 상태에서 출발하는 움직임에 쓴다.

React에서는 `useGSAP` 훅 안에서 ref로 대상을 넘긴다. `useGSAP` 은 `@gsap/react` 패키지에 있고, 컴포넌트가 사라질 때 그 안에서 만든 애니메이션을 정리해 준다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const MoveBox = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.to(boxRef.current, {
      x: 100,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    });
  }, []);

  return <div ref={boxRef} className="w-20 h-20 bg-red-500 opacity-0">Box</div>;
};
```

`opacity-0` 은 Tailwind 클래스다. 처음에는 투명했다가 1.5초 동안 나타나면서 오른쪽으로 100px 움직인다.

<br/>

## gsap.from()
적은 값에서 출발해 지금 상태로 돌아온다. 도착 값은 요소의 현재 스타일이다.

```js
gsap.from(".box", {
  x: -100,     // 왼쪽 100px에서 출발
  opacity: 0,  // 투명한 상태에서 출발
  duration: 2,
});
```

`from()` 은 만들자마자 시작 값을 요소에 바로 적용한다. `opacity: 1` 인 상자에 위 코드를 실행한 직후 스타일을 읽으면 이미 `translate(-100px, 0px)`, `opacity: 0` 이었고, 끝나면 `translate(0, 0)`, `opacity: 1` 로 돌아왔다. 그래서 트윈을 만든 뒤에는 요소가 원래 모습으로 잠깐 보였다가 사라지는 깜빡임 없이 시작 위치에서 출발한다. 다만 트윈을 만들기 전, 즉 서버가 그린 HTML이 먼저 보이고 스크립트가 아직 실행되지 않은 사이에는 최종 상태가 잠깐 보일 수 있다. 이때는 CSS로 처음부터 `visibility: hidden` 을 주고 `opacity` 대신 `autoAlpha` 로 나타나게 하는 방법이 알려져 있다(`autoAlpha` 는 `opacity` 와 함께 `visibility` 도 바꾼다, 확인 필요).

CSS로 최종 배치를 잡아 두고 등장 효과만 덧붙일 때 편하다. 페이지가 열릴 때 나타나기, 목록이 차례로 떠오르기가 대표적이다.

```tsx
useGSAP(() => {
  gsap.from(boxRef.current, {
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  });
}, []);
```

주의할 점이 하나 있다. 이미 `from()` 이 진행 중인 요소에 다시 `from()` 을 걸면, 그 순간의 중간 값을 현재 상태로 읽어 거기로 돌아간다. `opacity: 1` 인 요소에 `from({ opacity: 0 })` 을 걸고 절반쯤(0.5)에서 같은 `from()` 을 다시 걸었더니, 두 번째 애니메이션은 1이 아니라 0.5에서 끝났다. 같은 효과를 여러 번 재생해야 하면 시작과 끝을 모두 적는 `fromTo()` 가 안전하다.

<br/>

## gsap.fromTo()
시작 값과 끝 값을 모두 적는다. 첫 번째 객체가 시작, 두 번째 객체가 끝이고 `duration` 같은 설정은 두 번째 객체에 넣는다.

```js
gsap.fromTo(".box",
  { x: -100, opacity: 0 },               // 시작 상태
  { x: 100, opacity: 1, duration: 2 },   // 끝 상태와 설정
);
```

요소의 현재 스타일과 상관없이 늘 같은 구간을 움직이므로, 여러 번 다시 재생해도 결과가 같다. 스크롤에 맞춰 정해진 구간을 오가게 할 때도 쓴다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const Title = () => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
    );
  }, []);

  return <h1 ref={textRef} className="text-4xl font-bold">Hello, GSAP!</h1>;
};
```

글자가 50px 아래에서 투명하게 출발해 제자리로 떠오른다.

<br/>

## 세 메서드 비교
| 메서드 | 시작 값 | 끝 값 | 어울리는 경우 |
| --- | --- | --- | --- |
| `gsap.to()` | 요소의 현재 스타일 | 적은 값 | 버튼을 눌러 이동, 마우스를 올리면 커지기 |
| `gsap.from()` | 적은 값 | 요소의 현재 스타일 | 페이지가 열릴 때 나타나기 |
| `gsap.fromTo()` | 적은 값 | 적은 값 | 같은 효과를 반복 재생, 스크롤 구간에 맞춘 움직임 |

<br/>

## ScrollTrigger와 함께 쓰기
세 메서드 모두 `scrollTrigger` 설정을 넣으면 스크롤 위치에 맞춰 재생된다. 아래는 상자의 윗변이 화면 위에서 75% 지점(화면 아래쪽 4분의 1 위)에 닿으면 나타나고, 다시 위로 올리면 사라지게 하는 예다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const RevealBox = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.from(boxRef.current, {
      opacity: 0,
      y: 100,
      duration: 1.5,
      scrollTrigger: {
        trigger: boxRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return <div ref={boxRef} className="w-20 h-20 bg-purple-500">Box</div>;
};
```

`start`, `toggleActions` 의 뜻은 [9장 ScrollTrigger 기본](../09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md)에서 다룬다.

<br/>

## 확인한 환경
- gsap 3.15.0, jsdom 25, Node.js v22.13.0. 진행률을 직접 맞춰 요소의 `style` 값을 읽는 방식으로 확인했다
- 기본 `duration` 0.5초, 기본 이징 `power1.out` 은 `gsap.defaults()` 로 확인했다
- React 예시는 실행하지 않았다. 화면에서 보이는 움직임도 브라우저로 확인하지 않았다

<br/>

[목차](../README.md) | [이전 장: 인터랙션 패턴](../00_인터랙션%20패턴(Interaction%20Patterns)/README.md) | [다음 장: 이징](../02_이징(Easing)/README.md)
