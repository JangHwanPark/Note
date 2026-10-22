## 핀 고정이란 ?
- 스크롤하는 동안 요소를 화면의 한 자리에 붙여 두고, 나머지 내용만 그 아래로 지나가게 하는 효과
- ScrollTrigger의 `pin` 옵션으로 정한 구간(`start` 부터 `end` 까지) 동안 요소를 고정한다
- 고정한 채로 그 안의 요소를 움직이면 스크롤로 진행되는 장면을 만들 수 있다. 이름과 쓰임새는 [인터랙션 패턴](../00_인터랙션%20패턴(Interaction%20Patterns)/README.md)에 정리했다

### 핀 (Pin)
사전적 의미는 핀, 무언가를 꽂아 고정하는 작은 못이다.
게시판에 종이를 압정으로 꽂아 두는 것과 같다. 게시판(페이지)이 위로 밀려 올라가도 압정을 꽂은 동안은 종이가 그 자리에 남아 있다. 압정을 뽑으면(`end` 를 지나면) 종이는 다시 게시판과 함께 움직인다.

<br/>

## 왜 필요할까
제품 소개 페이지처럼 그림 한 장을 화면에 띄워 둔 채 설명을 차례로 바꾸고 싶을 때가 있다. 요소가 스크롤과 함께 지나가 버리면 그 요소를 두고 이어지는 장면을 보여 줄 수 없다. 핀은 요소를 붙잡아 두는 동안 스크롤 양을 애니메이션 진행률로 쓸 수 있게 해 준다.

<br/>

## 동작
### pin과 pinSpacing
`pin: true` 는 `trigger` 요소를 고정한다. 다른 요소를 고정하려면 `pin` 에 그 요소를 넘긴다. 고정할 수 있는 요소는 하나지만 그 안에 요소를 얼마든지 넣을 수 있다.

고정하는 동안에도 스크롤은 계속 쌓인다. 그래서 ScrollTrigger는 기본으로 고정 구간 길이만큼 아래쪽에 여백(`pinSpacing`)을 넣어 다음 내용을 밀어 낸다. 고정이 풀리는 순간 다음 내용이 바로 이어 붙게 하기 위해서다. `pinSpacing: false` 로 끄면 다음 내용이 고정된 요소 아래로 겹쳐 지나간다. 부모가 `display: flex` 이면 여백이 원하는 대로 붙지 않아서 기본값이 `false` 가 된다(공식 문서 pinSpacing 항목).

### 고정한 요소 자체는 움직이지 않는다
공식 문서 pin 항목은 고정한 요소 자체를 애니메이션하지 말라고 경고한다. ScrollTrigger는 성능을 위해 위치를 미리 계산해 두는데, 고정한 요소가 움직이면 그 계산이 틀어진다. 움직일 요소는 고정한 요소 안에 넣고 그 안쪽 요소를 움직인다.

### 끝나는 지점
`end: "+=500"` 은 시작 지점에서 500px 더 스크롤한 곳이다. 고정 구간의 길이가 곧 애니메이션에 쓸 수 있는 스크롤 양이다.

<br/>

## 예시 코드
섹션(`sectionRef`)을 고정하고, 그 안의 상자(`boxRef`)가 아래에서 떠올라 오른쪽으로 움직인다.

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ScrollRevealPin = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", // 섹션 위쪽 끝이 화면 위쪽 끝에 닿으면 고정 시작
          end: "+=500", // 시작에서 500px 더 스크롤하면 고정 해제
          scrub: 1, // 1초에 걸쳐 스크롤 위치를 따라잡는다
          pin: true, // trigger인 섹션을 고정한다
          markers: true, // 시작과 끝 위치를 화면에 표시한다. 개발할 때만 쓴다
        },
      });

      tl.from(boxRef.current, { y: 100, opacity: 0, duration: 0.5 }) // 아래에서 떠오른다
        .to(boxRef.current, { x: 200, duration: 0.5 }); // 이어서 오른쪽으로 움직인다
    },
    { scope: sectionRef }
  );

  return (
    <div>
      <div style={{ height: "100vh" }}>스크롤을 내려 보세요</div>

      {/* 고정할 섹션. 움직이는 상자는 이 안에 둔다 */}
      <div ref={sectionRef} style={{ height: "100vh", position: "relative", background: "#f0f0f0" }}>
        <div
          ref={boxRef}
          style={{ position: "absolute", left: "40%", top: "40%", width: 200, height: 200, background: "blue" }}
        >
          스크롤에 따라 나타나고 고정됨
        </div>
      </div>

      <div style={{ height: "100vh" }}>계속 스크롤하세요</div>
    </div>
  );
};

export default ScrollRevealPin;
```

타임라인 안의 `duration` 은 초가 아니라 비율로 읽는다. `scrub` 을 쓰면 타임라인 전체 길이(여기서는 1)가 고정 구간 500px에 펼쳐지므로, 앞의 0.5는 처음 250px, 뒤의 0.5는 나머지 250px 동안 진행된다.

`useGSAP` 은 컴포넌트가 사라질 때 이 안에서 만든 애니메이션과 ScrollTrigger만 골라 되돌린다. `useEffect` 에서 정리할 때 `ScrollTrigger.getAll()` 로 모두 지우면 같은 페이지의 다른 컴포넌트가 만든 ScrollTrigger까지 사라진다.

<br/>

## 다른 구현 방법
### 트리거와 다른 요소를 고정하기
`pin` 에 요소나 선택자를 넘기면 트리거는 섹션으로 두고 그 안의 다른 요소를 고정할 수 있다. 이때도 움직이는 것은 고정한 요소의 안쪽 요소다.

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "bottom top",
    pin: ".sticky-element", // 이 요소를 고정한다
    scrub: true,
  },
});

tl.to(".sticky-element .moving-element", { x: 200, y: 100, duration: 1 });
```

### 고정이 풀릴 때 애니메이션 하기
`onLeave` 는 스크롤이 `end` 를 지나 앞으로 빠져나갈 때마다 불린다(`once: true` 를 주지 않는 한 다시 올라왔다 내려가면 또 불린다). 고정이 풀리는 시점이라 여기서 따로 애니메이션을 시작할 수 있다. 다만 다시 위로 올라와도 이 애니메이션은 저절로 되돌아가지 않으므로, 되돌리려면 `onEnterBack` 에서 반대 애니메이션을 직접 실행한다.

```js
ScrollTrigger.create({
  trigger: ".pin-section",
  start: "top top",
  end: "+=500",
  pin: true,
  anticipatePin: 1, // 빠르게 스크롤할 때 고정이 늦게 걸려 보이는 것을 막는다
  onLeave: () => {
    gsap.to(".pin-section .content", { y: -50, opacity: 0.5, duration: 0.5 });
  },
});
```

`anticipatePin` 은 성능 옵션이 아니다. 브라우저는 스크롤 화면을 별도 스레드에서 그리기 때문에, 빠르게 스크롤하면 고정이 걸리기 직전 화면이 한 프레임쯤 보였다가 고정된다. `anticipatePin` 은 스크롤 속도를 보고 고정을 조금 일찍 걸어 이 순간을 감춘다. 공식 문서는 1이면 대개 충분하고, 기본값은 0이며 대부분은 필요 없다고 안내한다.

<br/>

## CSS만으로 고정하기
```css
.sticky-element {
  position: sticky;
  top: 0; /* 부모 안에서 스크롤하는 동안 화면 위쪽 끝에 붙는다 */
}
```

단순히 붙여 두기만 할 때는 CSS `position: sticky` 로 충분하다. 붙는 범위는 부모 요소 안으로 제한되므로 부모가 충분히 길어야 오래 붙어 있다. 스크롤 양에 맞춰 안쪽 요소를 움직이거나 고정 구간을 정밀하게 정하려면 ScrollTrigger를 쓴다.

<br/>

## 대표적인 사용 사례
| 사용 사례 | 고정하는 것 | 스크롤로 바뀌는 것 |
| --- | --- | --- |
| 제품 소개 페이지 | 제품 이미지 | 옆의 설명 글 |
| 스토리텔링 페이지 | 장면 배경 | 장면 안의 요소와 문장 |
| 포트폴리오 | 작품 영역 | 차례로 나타나는 작품 |
| 기업 랜딩 페이지 | 핵심 메시지 영역 | 메시지 문구 |

<br/>

## 참고 자료
- [GSAP 공식 문서: ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) (pin, pinSpacing, anticipatePin, end 항목)
- 예시 코드는 gsap 3.15.0, @gsap/react 2.1.2, @types/react 19.3, TypeScript 5.6 `strict` 로 타입 검사만 했다. 브라우저에서 실제 움직임은 확인하지 않았다(브라우저 확인 필요).

<br/>

[목차](../README.md) | [이전 장: 가로 스크롤](../11_가로%20스크롤(Horizontal%20Scroll)/README.md) | [다음 장: 패럴랙스와 관성 스크롤](../13_패럴랙스와%20관성%20스크롤(Parallax%20and%20Smooth%20Scroll)/README.md)
