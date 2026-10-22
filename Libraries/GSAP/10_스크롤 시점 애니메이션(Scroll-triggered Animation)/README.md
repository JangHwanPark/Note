## 스크롤 시점 애니메이션이란 ?
- 스크롤 위치에 맞춰 요소가 나타나거나, 움직이거나, 사라지게 하는 애니메이션 기법
- ScrollTrigger의 `start`, `end` 로 애니메이션이 걸릴 스크롤 구간을 정하고, `scrub` 으로 그 구간의 스크롤 양에 진행률을 묶는다
- 이 장은 세로 타임라인 선이 스크롤에 맞춰 늘어나는 예시로 `start`, `end`, `scrub` 을 실제로 써 본다

트리거의 뜻과 기본 옵션은 [9장](../09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md)에서 정리했다. 적용 사례는 [인터랙션 패턴](../00_인터랙션%20패턴(Interaction%20Patterns)/README.md)의 스크롤 기반 패턴에 정리했다.

<br/>

## 왜 필요할까
시간으로 재생하는 애니메이션은 사용자가 그 요소를 보고 있지 않을 때도 흘러가 버린다. 페이지 아래쪽 요소의 애니메이션이 첫 화면을 여는 순간 이미 끝나 있는 식이다.
스크롤 시점에 묶으면 사용자가 그 요소까지 내려왔을 때 애니메이션이 시작된다. `scrub` 을 쓰면 한 걸음 더 나아가, 스크롤을 내린 만큼 진행되고 올리면 되감긴다. 사용자가 손으로 재생 막대를 움직이는 것과 같다.

<br/>

## 동작
### start와 end
`start: "top center"` 처럼 값 두 개를 쓴다. 앞은 트리거 요소의 위치, 뒤는 화면(스크롤러)의 위치이고, 두 지점이 만날 때가 시작이다. `"top center"` 는 트리거의 위쪽 끝이 화면 가운데에 닿을 때다.
퍼센트와 픽셀은 언제나 요소나 화면의 위쪽 끝에서 잰다(GSAP 공식 문서 ScrollTrigger의 start 항목). 그래서 `end: "300% bottom"` 은 트리거 위쪽 끝에서 트리거 높이의 300%만큼 내려간 지점이 화면 아래쪽 끝에 닿을 때 끝난다는 뜻이다. 트리거보다 긴 구간에 걸쳐 천천히 진행하고 싶을 때 이렇게 쓴다.

### scrub
`scrub: true` 는 애니메이션 진행률을 스크롤 위치에 바로 붙인다. 숫자를 주면 그 초만큼 걸려 스크롤 위치를 따라잡는다. `scrub: 3` 은 스크롤을 멈춰도 애니메이션이 3초에 걸쳐 스크롤 위치를 따라온다는 뜻이다. 공식 문서는 `scrub: 1` 을 "1초에 걸쳐 따라잡는다"고 설명한다.
`scrub` 을 쓸 때는 `ease: "none"` 을 주는 경우가 많다. 스크롤한 양과 움직인 양이 일정하게 맞아야 손으로 조종하는 느낌이 나기 때문이다.

<br/>

## 예시 코드
세로 선(`lineRef`)이 스크롤에 맞춰 0%에서 100%까지 늘어나고, 아래쪽 점(`dotRef`)이 함께 떠오른다. 두 애니메이션이 같은 구간을 쓰므로 타임라인 하나에 ScrollTrigger를 한 번만 붙였다.

트리거는 늘어나는 선이 아니라 선을 감싼 틀(`frameRef`)로 잡았다. ScrollTrigger는 시작과 끝 위치를 만들 때와 화면 크기가 바뀔 때만 계산하고, 트리거 요소가 애니메이션으로 커져도 다시 계산하지 않는다(공식 문서 start 항목). 높이 0%에서 시작하는 선을 트리거로 삼으면 높이가 0일 때 잰 값으로 구간이 정해져 `300%` 도 0이 된다.

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ScrollAnimation = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top center", // 트리거 위쪽 끝이 화면 가운데에 닿으면 시작
          end: "300% bottom", // 트리거 높이의 300% 지점이 화면 아래쪽 끝에 닿으면 끝
          scrub: 3, // 3초에 걸쳐 스크롤 위치를 따라잡는다
        },
      });

      tl.fromTo(lineRef.current, { height: "0%" }, { height: "100%", ease: "none" })
        .fromTo(dotRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, 0); // 0초 지점에 함께 시작
    },
    { scope: frameRef }
  );

  return (
    <section className="relative flex flex-col items-center py-20">
      <h2 className="text-5xl">Scroll-triggered Animation</h2>

      {/* 타임라인 선이 자라는 틀 */}
      <div ref={frameRef} className="relative mt-10 h-[500px] w-[3px] bg-purple-100">
        <div ref={lineRef} className="absolute left-0 top-0 w-full bg-purple-500" />
        <div
          ref={dotRef}
          className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-purple-500"
        />
      </div>
    </section>
  );
};

export default ScrollAnimation;
```

`useGSAP` 은 컴포넌트가 사라질 때 그 안에서 만든 애니메이션과 ScrollTrigger를 자동으로 되돌린다. `useEffect` 로 쓰면 이 정리를 직접 해야 한다. `className` 은 Tailwind CSS 클래스다.

<br/>

## 참고 자료
- [GSAP 공식 문서: ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) (start, end, scrub 항목)
- 예시 코드는 gsap 3.15.0, @gsap/react 2.1.2, @types/react 19.3, TypeScript 5.6 `strict` 로 타입 검사만 했다. 브라우저에서 실제 움직임은 확인하지 않았다(브라우저 확인 필요).

<br/>

[목차](../README.md) | [이전 장: ScrollTrigger 기본](../09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md) | [다음 장: 가로 스크롤](../11_가로%20스크롤(Horizontal%20Scroll)/README.md)
