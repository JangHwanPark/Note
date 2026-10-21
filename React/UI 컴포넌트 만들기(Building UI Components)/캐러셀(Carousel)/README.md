## 캐러셀이란 ?
- 여러 장의 슬라이드를 한 자리에서 한 장씩 넘겨 보여 주는 UI 컴포넌트
- 슬라이드를 가로로 한 줄로 세우고, 보이는 창 밖으로 넘친 부분은 숨긴 채 줄 전체를 옆으로 밀어 다음 장을 보여 준다
- React에서는 지금 보이는 슬라이드 번호 하나를 상태로 두고, 그 번호로 얼마나 밀지 계산한다

### 캐러셀 (Carousel)
사전적 의미는 회전목마다. 같은 자리에서 말들이 차례로 돌아 나오는 놀이기구다.
UI에서는 같은 자리에 슬라이드가 차례로 돌아 나오는 컴포넌트를 말한다. 배너, 상품 이미지, 후기처럼 공간은 좁은데 보여 줄 것이 여러 개일 때 쓴다.

<br/>

## 어떻게 동작할까
필름 띠를 작은 창 뒤에서 옆으로 당기는 것과 같다. 필름 띠는 길지만 창으로는 한 칸만 보이고, 띠를 한 칸 너비만큼 당기면 다음 칸이 창에 들어온다.

- 바깥 컨테이너가 창이다. `overflow: hidden` 으로 창 밖으로 넘친 슬라이드를 숨긴다
- 안쪽 트랙이 필름 띠다. `display: flex` 로 슬라이드를 가로로 세우고, 슬라이드마다 `flex: 0 0 100%` 를 줘 한 장이 창 너비를 꽉 채우게 한다
- 트랙을 `transform: translateX(-N * 100%)` 로 밀어 N번째 슬라이드를 창에 맞춘다. `translateX` 의 퍼센트는 트랙 자신의 너비 기준이고, 트랙 너비가 곧 창 너비라서 100%가 정확히 한 장이다. 트랙을 `ul` 로 만들면 브라우저 기본 스타일의 왼쪽 안쪽 여백(padding) 때문에 슬라이드 한 장이 창보다 좁아져 100%와 어긋나므로, `padding` 과 `margin` 을 0으로 지운다
- `transition: transform` 을 주면 번호가 바뀔 때 브라우저가 밀리는 과정을 부드럽게 그려 준다

<br/>

## React로 구현하기
React가 할 일은 현재 번호 `currentIndex` 를 기억하고, 바뀔 때마다 트랙의 `transform` 값을 새로 계산하는 것뿐이다. 실제로 움직이는 애니메이션은 CSS `transition` 이 맡는다.

```tsx
import { useState, type ReactNode } from "react";

type CarouselProps = {
  slides: ReactNode[];
};

export default function Carousel({ slides }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndex = slides.length - 1;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <ul
        style={{
          display: "flex",
          padding: 0, // ul 기본 여백을 지워 트랙 너비와 슬라이드 너비를 맞춘다
          margin: 0,
          listStyle: "none",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {slides.map((slide, index) => (
          <li key={index} style={{ flex: "0 0 100%" }}>
            {slide}
          </li>
        ))}
      </ul>
      <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} disabled={currentIndex === 0}>
        이전
      </button>
      <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, lastIndex))} disabled={currentIndex === lastIndex}>
        다음
      </button>
    </div>
  );
}
```

```tsx
<Carousel slides={["Slide 1", "Slide 2", "Slide 3"]} />
```

React 19, TypeScript 5.6 `strict` 에서 타입 검사를 통과했다. jsdom에서 렌더링해 보면 처음 트랙의 `transform` 은 `translateX(-0%)` 이고, 다음을 두 번 누르면 `translateX(-200%)` 가 되면서 다음 버튼이 비활성화된다.

`Math.max`, `Math.min` 은 번호가 0보다 작아지거나 마지막 번호를 넘지 않게 막는다. 버튼의 `disabled` 와 함께 두 겹으로 막아 둔 것이다.

슬라이드 목록은 순서가 바뀌거나 중간에 끼어들지 않는다고 보고 `key` 로 번호를 썼다. 슬라이드를 추가, 삭제, 정렬한다면 슬라이드마다 고유한 id를 `key` 로 쓴다.

### React 없이 만든다면
처음에는 같은 원리를 DOM을 직접 고치는 방식으로 만들었다. 현재 번호를 변수에 두고, 버튼 클릭 이벤트에서 번호를 바꾼 뒤 `track.style.transform` 을 직접 바꾼다. React 버전은 이 `transform` 을 바꾸는 일을 React에게 맡기고, 개발자는 번호 상태만 바꾼 것이다.

<br/>

## GSAP으로 움직이기
`ease` 를 세밀하게 고르거나, 마지막 장에서 첫 장으로 자연스럽게 이어지는 무한 캐러셀을 만들 때는 GSAP을 쓰기도 한다. GSAP 버전과 무한 캐러셀 구현은 [GSAP 캐러셀 슬라이드](../../../Libraries/GSAP/캐러셀%20슬라이드(Carousel).md)에 정리했다.

<br/>

## 더 볼 것 (TODO)
- 자동 재생과 마우스를 올렸을 때 멈추기
- 터치 스와이프로 넘기기
- 접근성: 현재 슬라이드 알리기, 자동 재생 멈춤 버튼
