## GSAP 캐러셀이란 ?
- 슬라이드를 가로로 세우고 트랙을 옆으로 미는 캐러셀의 이동을 CSS `transition` 대신 GSAP 트윈으로 처리한 것
- `ease` 를 고르거나, 이동이 끝난 순간에 할 일(`onComplete`)을 붙일 수 있어 무한 캐러셀을 만들기 쉽다
- 캐러셀의 원리와 GSAP 없이 만드는 React 버전은 [React 캐러셀](../../React/UI%20컴포넌트%20만들기(Building%20UI%20Components)/캐러셀(Carousel)/README.md)에 정리했다

<br/>

## GSAP으로 구현하기
React 컴포넌트 안에서는 `@gsap/react` 의 `useGSAP` 훅으로 애니메이션을 건다. `dependencies` 에 넣은 값이 바뀔 때마다 콜백이 다시 실행되고, 컴포넌트가 사라질 때 만든 애니메이션을 정리해 준다.

```tsx
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type CarouselProps = {
  slides: string[];
};

export const GsapCarousel = ({ slides }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const lastIndex = slides.length - 1;

  useGSAP(
    () => {
      gsap.to(trackRef.current, {
        xPercent: -currentIndex * 100,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { dependencies: [currentIndex] }
  );

  return (
    <div className="relative w-full overflow-hidden">
      <ul ref={trackRef} className="flex">
        {slides.map((slide) => (
          <li key={slide} className="w-full shrink-0">
            {slide}
          </li>
        ))}
      </ul>
      <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}>이전</button>
      <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, lastIndex))}>다음</button>
    </div>
  );
};
```

`className` 은 Tailwind CSS 클래스이고, Tailwind의 기본 초기화 스타일(Preflight)이 `ul` 의 기본 여백과 목록 기호를 지워 준다는 전제로 썼다. Tailwind 없이 쓰면 `ul` 에 `padding: 0; margin: 0; list-style: none` 을 직접 줘야 트랙 너비와 슬라이드 너비가 맞는다.

`xPercent` 는 요소 자신의 너비에 대한 퍼센트로 옮기는 GSAP 속성이다. 트랙 너비가 창 너비와 같으므로 `-100` 이 한 장이다. gsap 3.15, @gsap/react 2.1, React 19에서 jsdom으로 실행해 다음을 한 번 누르고 0.5초가 지나면 트랙의 `transform` 이 `translate(-100%, 0%)` 가 되는 것을 확인했다.

<br/>

## 무한 캐러셀
마지막 장에서 다음을 누르면 첫 장으로 돌아가되, 뒤로 휙 감기지 않고 계속 앞으로 가는 것처럼 보이게 하는 캐러셀이다.

### 왜 그냥은 안 될까
마지막 번호에서 0으로 바꾸면 트랙이 슬라이드 개수만큼 거꾸로 달려가는 애니메이션이 보인다. 앞으로 한 칸 간 것처럼 보이려면, 마지막 장 다음 칸에도 첫 장이 있어야 한다.

### 복사본 슬라이드로 해결하기
1. 마지막 슬라이드 뒤에 첫 슬라이드의 복사본을 하나 붙인다. 슬라이드가 3장이면 칸은 4개다
2. 다음 버튼은 복사본 칸(번호 3)까지 이동할 수 있게 둔다. 사용자 눈에는 첫 장이 앞에서 들어오는 것처럼 보인다
3. 복사본 칸에 도착한 순간(`onComplete`) `gsap.set()` 으로 트랙을 진짜 첫 칸(0)으로 애니메이션 없이 옮기고, 번호도 0으로 바꾼다. 두 칸의 그림이 같아서 순간 이동이 눈에 띄지 않는다

위의 일반 캐러셀처럼 다음 버튼을 `Math.min(prev + 1, 마지막 번호)` 로 막아 두면 번호가 마지막 장에서 멈춰, 복사본 칸으로 넘어가는 순간이 오지 않는다. 그래서 다음 버튼은 복사본 칸의 번호(슬라이드 개수와 같다)까지 허용하고, 그 칸에 도착했을 때만 순간 이동시킨다.

```tsx
export const InfiniteCarousel = ({ slides }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const total = slides.length;
  const items = [...slides, slides[0]]; // 마지막 슬라이드 뒤에 첫 슬라이드 복사본을 붙인다

  useGSAP(
    () => {
      gsap.to(trackRef.current, {
        xPercent: -currentIndex * 100,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // 복사본에 도착하면 진짜 첫 슬라이드 자리로 순간 이동한다
          if (currentIndex === total) {
            gsap.set(trackRef.current, { xPercent: 0 });
            setCurrentIndex(0);
          }
        },
      });
    },
    { dependencies: [currentIndex] }
  );

  // 복사본(total)까지만 간다. 순간 이동이 끝나기 전에는 더 넘어가지 않는다
  const next = () => setCurrentIndex((prev) => (prev < total ? prev + 1 : prev));

  return (
    <div className="relative w-full overflow-hidden">
      <ul ref={trackRef} className="flex">
        {items.map((slide, index) => (
          <li key={index} className="w-full shrink-0">
            {slide}
          </li>
        ))}
      </ul>
      <button onClick={next}>다음</button>
    </div>
  );
};
```

슬라이드 3장으로 jsdom에서 실행해, 다음을 누르고 0.7초씩 기다리며 트랙의 `transform` 을 확인했다.

```text
칸 개수: 4
다음 1번: translate(-100%, 0%)
다음 2번: translate(-200%, 0%)
다음 3번: translate(0, 0)        // 복사본 칸까지 간 뒤 첫 칸으로 순간 이동
다음 4번: translate(-100%, 0%)
```

이전 버튼까지 무한으로 만들려면 첫 슬라이드 앞에도 마지막 슬라이드의 복사본을 붙이고, 같은 방식으로 반대쪽 끝에서 순간 이동시킨다.

<br/>

## 더 볼 것 (TODO)
- 이전 방향 무한 이동
- 애니메이션 도중 버튼 연타 처리
