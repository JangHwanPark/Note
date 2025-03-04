## GSAP에서 to(), from(), fromTo()의 차이점과 각각의 사용법
`GSAP`에서는 애니메이션을 구현할 때 to(), from(), fromTo() 세 가지 주요 메서드를 사용합니다. 각각의 차이점과 적절한 사용 사례를 정리합니다.
- 현재 상태에서 목표 위치로 이동 → to()
- 특정한 시작 위치에서 원래 자리로 이동 → from()
- 특정한 시작 위치에서 특정한 끝 위치로 이동 → fromTo()

### gsap.to()
"야 너 저기로 가라~" 하는 느낌
- 현재 상태에서 지정한 값으로 애니메이션 실행
- 애니메이션이 시작할 때 요소의 현재 스타일을 기준으로, 목표 상태(target state)로 변화합니다.

#### 언제 쓰냐?
- 현재 위치에서 특정 위치로 이동할 때
- 버튼 클릭 시 특정 위치로 이동 
- 자동으로 어떤 상태로 변화하는 애니메이션

#### 사용법
```js
gsap.to(".box", {
  x: 100, // 현재 위치에서 x축으로 100px 이동
  opacity: 1, // 투명도를 1로 변경
  duration: 2 // 2초 동안 애니메이션 실행
});
```
- 현재 .box의 위치에서 x: 100 위치로 이동.
- 현재 opacity 값에서 opacity: 1로 변경.
- 애니메이션은 2초 동안 실행됨.

#### 예제
```js
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
```
- 처음에는 opacity: 0이었지만, 1.5초 동안 opacity: 1로 변경되면서 x: 100px 이동함.


### gsap.from()
"너 저기서 출발해~" 하는 느낌
- 초기값을 지정한 후, 원래 상태로 되돌아가는 애니메이션 
- 애니메이션이 시작할 때의 상태를 명시적으로 지정한 뒤, 현재 스타일로 되돌아감.

#### 언제 쓰냐?
- 특정 위치에서 현재 위치로 애니메이션 줄 때
- 페이드인 효과 (처음에 안 보이다가 나타나는 애니메이션)
- 페이지 로딩 시 자연스럽게 등장

#### 사용법
```js
gsap.from(".box", {
  x: -100, // 시작할 때 x축 -100px 위치에서 시작
  opacity: 0, // 처음에는 투명함
  duration: 2
});
```
- x: -100에서 시작한 후, 원래 위치로 애니메이션 실행. 
- 처음에는 opacity: 0이지만, 원래 스타일(기본 opacity 값)로 복귀.

#### 예제
```js
const boxRef = useRef<HTMLDivElement | null>(null);

useGSAP(() => {
  gsap.from(boxRef.current, {
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  });
}, []);

return <div ref={boxRef} className="w-20 h-20 bg-blue-500">Box</div>;
```
처음에는 x: -100px 위치에서 시작했다가 원래 위치로 이동하면서 opacity: 1이 됨.


### gsap.fromTo()
"너 여기서 출발해서 저기까지 가라~" 하는 느낌
- 초기값과 최종값을 모두 명확히 지정하는 애니메이션 (특정한 시작 위치에서 특정한 끝 위치로 이동)
- 애니메이션 시작 상태와 끝 상태를 동시에 설정할 수 있음.

#### 언제 쓰냐?
- 특정한 시작 상태에서 특정한 끝 상태로 이동할 때
- 특정한 위치에서 특정한 위치로 이동해야 할 때 
- 스크롤에 맞춰 요소의 상태를 바꿀 때

#### 사용법
```js
gsap.fromTo(".box",
  { x: -100, opacity: 0 },  // 애니메이션 시작 상태
  { x: 100, opacity: 1, duration: 2 } // 애니메이션 종료 상태
);
```
- 처음에는 x: -100, opacity: 0에서 시작. 
- 2초 동안 x: 100, opacity: 1 상태로 이동.

#### 예제
```js
const boxRef = useRef<HTMLDivElement | null>(null);

useGSAP(() => {
  gsap.fromTo(boxRef.current,
    { x: -100, opacity: 0 },  // 시작 값
    { x: 100, opacity: 1, duration: 1.5, ease: "power2.out" } // 종료 값
  );
}, []);

return <div ref={boxRef} className="w-20 h-20 bg-green-500">Box</div>;
```
- 처음에는 x: -100px, opacity: 0에서 시작
- 1.5초 동안 x: 100px, opacity: 1로 변함.


### to(), from(), fromTo() 비교
| 메서드 | 설명 | 	예제 |
|-----|----|-----|
| to() | 현재 스타일에서 지정한 값으로 애니메이션 실행 | gsap.to(".box", { x: 100, opacity: 1 }) |
| from() | 지정한 초기값에서 현재 스타일로 되돌아감 | gsap.from(".box", { x: -100, opacity: 0 }) |
| fromTo() | 초기값과 최종값을 모두 지정 | gsap.fromTo(".box", { x: -100 }, { x: 100 }) |


언제 to(), from(), fromTo()를 사용할까?
사용 상황	적절한 메서드
현재 상태에서 특정 위치로 이동	gsap.to()
특정 위치에서 현재 상태로 이동	gsap.from()
특정 시작 상태에서 특정 종료 상태로 이동	gsap.fromTo()
예를 들어,

홈페이지에서 Fade-in 효과를 줄 때: gsap.from()
버튼 클릭 시 특정 위치로 이동할 때: gsap.to()
스크롤 시 특정 상태에서 특정 상태로 이동할 때: gsap.fromTo()


실전 예제: ScrollTrigger + to() vs from() vs fromTo()

```js
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "GSAP/ScrollTrigger/01_ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Example = () => {
  const boxRef = useRef < HTMLDivElement | null > (null);
  
  useGSAP(() => {
    gsap.from(boxRef.current, {
      opacity: 0,
      y: 100,
      duration: 1.5,
      scrollTrigger: {
        trigger: boxRef.current,
        start: "top 75%",
        end: "bottom 50%",
        toggleActions: "play none none reverse",
      }
    });
  }, []);
  
  return <div ref={boxRef} className="w-20 h-20 bg-purple-500">Box</div>;
};

export default Example;
```


결론
현재 상태에서 애니메이션을 실행하려면 → to()
애니메이션을 시작할 때 초기 위치를 지정하려면 → from()
특정 시작 상태에서 특정 종료 상태로 애니메이션을 실행하려면 → fromTo()