## ScrollTrigger란 ?
- 스크롤 위치에 맞춰 GSAP 애니메이션을 시작하거나, 스크롤한 만큼 진행시키거나, 요소를 고정하는 GSAP 플러그인
- 어떤 요소(`trigger`)의 어느 지점이 화면의 어느 지점에 닿을 때(`start`, `end`) 무엇을 할지 정한다
- 따로 가져와 `gsap.registerPlugin(ScrollTrigger)` 로 등록한 뒤 트윈의 `scrollTrigger` 옵션에 설정을 넣는다

### 트리거 (Trigger)
사전적 의미는 방아쇠다. 당기면 총알이 나가듯, 어떤 일을 일으키는 계기를 말한다.
ScrollTrigger에서는 기준이 되는 요소를 말한다. 그 요소가 스크롤로 정해 둔 위치에 오는 순간이 방아쇠를 당기는 순간이 되어 애니메이션이 움직인다.

<br/>

## 왜 필요할까
요소가 화면에 들어올 때 무언가를 하려면 원래는 스크롤 이벤트에서 요소의 위치를 계산하고, 화면 크기가 바뀌면 다시 계산해야 한다. 요소가 보이는지만 알면 되는 경우는 브라우저의 IntersectionObserver로 충분하다([스크롤 애니메이션](../../../React/스크롤%20애니메이션(Scroll%20Animation)/README.md) 참고). 하지만 스크롤한 만큼 애니메이션을 정확히 진행시키거나, 일정 구간 동안 요소를 고정하는 일은 직접 만들기 어렵다. ScrollTrigger는 이 계산과 다시 계산을 대신 해 준다.

<br/>

## 기본 사용법
```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); // 플러그인은 한 번 등록해야 쓸 수 있다

gsap.to(".box", {
  x: 500, // 오른쪽으로 500px
  scrollTrigger: {
    trigger: ".box",   // 위치 계산의 기준 요소
    start: "top 80%",  // 요소의 위쪽이 화면 위에서 80% 지점에 닿을 때 시작
    end: "top 30%",    // 요소의 위쪽이 화면 위에서 30% 지점에 닿을 때 끝
    scrub: 1,          // 스크롤한 만큼 진행, 1초에 걸쳐 따라잡는다
    markers: true,     // 시작점과 끝점을 화면에 표시(개발용)
  },
});
```

`start` 와 `end` 는 "요소의 지점 화면의 지점" 두 단어로 쓴다. `"top 80%"` 는 요소의 위쪽 끝이 화면 위에서 80% 내려온 곳에 닿을 때라는 뜻이다. 아무것도 적지 않으면 `start` 는 `"top bottom"`(요소 위쪽이 화면 아래쪽에 닿을 때), `end` 는 `"bottom top"` 이다. `pin: true` 를 쓰면 `start` 기본값은 `"top top"` 이 된다.

`scrub` 을 쓰면 애니메이션은 시간이 아니라 스크롤 진행률을 따라간다. 그래서 `duration` 은 거의 의미가 없고, 여러 트윈을 타임라인으로 묶을 때 서로의 길이 비율로만 쓰인다.

<br/>

## 자주 쓰는 설정
### 위치
| 설정 | 하는 일 |
| --- | --- |
| `trigger` | 위치 계산의 기준이 되는 요소 |
| `start` | 시작 위치. `"top center"`, `"top+=100 center"`(요소 위쪽에서 100px 아래 지점), `"50% 75%"` 처럼 쓴다 |
| `end` | 끝 위치. `start` 와 같은 형식, 또는 `"+=500"`(시작에서 500px 뒤) |
| `endTrigger` | 끝 위치를 다른 요소 기준으로 잡을 때. 없으면 `trigger` 를 쓴다 |
| `horizontal` | 가로로 스크롤하는 화면이면 `true` |

### 진행 방식
`scrub` 이 있으면 스크롤에 따라 진행하고, 없으면 지점을 지나는 순간에 정해 둔 동작을 한다. 그 동작을 정하는 것이 `toggleActions` 다. 값 네 개를 공백으로 이어 쓰고, 순서는 아래와 같다. 기본값은 `"play none none none"` 이다.

1. `onEnter`: 아래로 스크롤해 `start` 를 지날 때
2. `onLeave`: 아래로 스크롤해 `end` 를 지날 때
3. `onEnterBack`: 위로 스크롤해 `end` 를 다시 지나 돌아올 때
4. `onLeaveBack`: 위로 스크롤해 `start` 를 다시 지나 나갈 때

자리마다 `play`, `pause`, `resume`, `reverse`, `restart`, `reset`, `complete`, `none` 중 하나를 쓴다. 예를 들어 `"play reverse play reverse"` 는 구간에 들어오면 재생하고 나가면 되감는다.

| 설정 | 하는 일 |
| --- | --- |
| `scrub` | `true` 면 스크롤 진행률과 애니메이션 진행률을 바로 묶는다. 숫자면 그 초만큼 걸려 따라잡아 부드럽게 뒤따른다 |
| `snap` | 스크롤을 멈추면 가까운 진행률로 맞춘다. `0.25` 면 0, 25%, 50%처럼 맞춘다 |
| `once` | 끝 위치에 한 번 닿으면 ScrollTrigger를 없앤다. 애니메이션은 남는다 |
| `toggleClass` | 구간 안에 있는 동안 클래스를 붙인다. `"active"` 또는 `{ targets: ".sidebar", className: "show" }` |

### 고정
| 설정 | 하는 일 |
| --- | --- |
| `pin` | 구간 동안 요소를 화면에 고정한다. `true` 면 `trigger` 를 고정한다 |
| `pinSpacing` | 고정된 동안 아래 내용이 밀려 올라오지 않도록 빈 공간을 넣을지 |
| `anticipatePin` | 빠르게 스크롤할 때 고정이 늦어 보이는 것을 막으려고 조금 일찍 고정한다. 보통 1이면 되고 기본값은 0 |
| `pinType` | `"fixed"` 또는 `"transform"`. 기본은 스크롤하는 대상이 `body` 일 때만 `fixed` |
| `pinReparent` | 고정하는 동안 요소를 `body` 아래로 옮긴다. 조상 요소의 `transform` 때문에 고정이 깨질 때만 쓴다 |

### 여러 트리거가 이어질 때
| 설정 | 하는 일 |
| --- | --- |
| `fastScrollEnd` | 구간을 빠르게 지나가면 애니메이션을 바로 끝 상태로 만든다(기본 기준 속도 2500px/s) |
| `preventOverlaps` | 이 트리거가 시작될 때 앞선 트리거들의 애니메이션을 끝내 겹치지 않게 한다 |

### 개발할 때
| 설정 | 하는 일 |
| --- | --- |
| `markers` | 시작점과 끝점을 화면에 표시한다. `{ startColor: "green", endColor: "red" }` 처럼 색을 바꿀 수 있다. 배포 전에는 지운다 |
| `id` | 마커와 `ScrollTrigger.getById()` 에서 쓰는 이름 |

위 설명은 [GSAP 공식 문서의 ScrollTrigger 페이지](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)를 옮긴 것이다. 기본값 `"play none none none"` 은 GSAP 3.15 소스에서도 기본값이 `"play"` 하나로 들어 있고 나머지 자리가 비어 `none` 처럼 동작하는 것을 확인했다.

<br/>

## 콜백과 진행 상태
`toggleActions` 의 네 자리와 같은 이름의 콜백(`onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack`)을 직접 넘길 수도 있다. 그 밖에 스크롤할 때마다 불리는 `onUpdate`, 구간 안팎이 바뀔 때 불리는 `onToggle`, 화면 크기가 바뀌어 위치를 다시 계산했을 때 불리는 `onRefresh` 가 있다.

콜백은 ScrollTrigger 자신(`self`)을 받는다. 자주 읽는 값은 아래와 같다.

- `self.progress`: 구간 안에서 얼마나 왔는지, 0부터 1까지
- `self.direction`: 아래로 스크롤 중이면 1, 위로면 -1
- `self.isActive`: 지금 구간 안에 있는지
- `self.getVelocity()`: 지금 스크롤 속도(초당 픽셀)

```js
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  end: "bottom center",
  onUpdate: (self) => console.log(self.progress.toFixed(2), self.direction),
});
```

GSAP 3.15를 jsdom에서 불러 `progress`, `direction`, `isActive`, `getVelocity` 가 있는 것만 확인했다. jsdom은 레이아웃을 계산하지 않아 실제 값은 브라우저에서 확인해야 한다.

<br/>

## 예시
### 구간 동안 고정하기
애니메이션 없이 고정만 할 때는 `ScrollTrigger.create()` 로 만든다.

```js
ScrollTrigger.create({
  trigger: ".section",
  pin: true,
  start: "top top",
  end: "+=500", // 시작에서 500px 스크롤하는 동안 고정
});
```

고정은 [핀 고정](../12_핀%20고정(Pin)/README.md)에서 자세히 다룬다.

### 스크롤에 따라 배경색 바꾸기
```js
gsap.to(".bg", {
  backgroundColor: "blue",
  scrollTrigger: {
    trigger: ".bg",
    start: "top center",
    end: "bottom top",
    scrub: true,
  },
});
```

### 여러 요소를 각자 나타나게 하기
요소마다 자기 위치에서 나타나야 하면 요소마다 ScrollTrigger를 따로 만든다. 여러 요소를 트윈 하나에 넣으면 ScrollTrigger도 하나뿐이라, 모든 요소가 같은 구간을 기준으로 함께 움직인다.

```js
gsap.utils.toArray(".item").forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    y: 50,
    scrollTrigger: {
      trigger: item,
      start: "top 90%",
      end: "top 70%",
      scrub: 1,
    },
  });
});
```

### 타임라인과 묶기
타임라인에 `scrollTrigger` 를 주면 안의 트윈들이 스크롤 진행에 맞춰 차례로 움직인다. 각 트윈의 `duration` 은 전체 스크롤 구간을 나누는 비율이 된다.

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
});

tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { x: 200, duration: 1 })
  .to(".box3", { x: 300, duration: 1 });
```

패럴랙스는 [패럴랙스와 관성 스크롤](../13_패럴랙스와%20관성%20스크롤(Parallax%20and%20Smooth%20Scroll)/README.md)에 따로 정리했다.

<br/>

## React에서 쓰기
React에서는 컴포넌트가 화면에 붙은 뒤에 ScrollTrigger를 만들고, 사라질 때 없애야 한다. 없애지 않으면 페이지를 옮긴 뒤에도 트리거가 남아 위치 계산이 어긋난다. `@gsap/react` 의 `useGSAP` 은 그 안에서 만든 트윈과 ScrollTrigger를 컴포넌트가 사라질 때 함께 정리한다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollAnimation() {
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: boxRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      }
    );
  });

  return <div ref={boxRef} className="w-20 h-20 bg-blue-500 mx-auto my-40" />;
}
```

박스가 화면 아래쪽 80% 지점에 들어올 때부터 30% 지점까지 올라오는 동안, 스크롤한 만큼 투명에서 보이는 상태로 바뀌며 위로 올라온다. Next.js App Router에서는 이 파일 맨 위에 `'use client'` 가 필요하다.

이 코드는 gsap 3.15.0, `@gsap/react` 2.1.2, React 19.2, TypeScript 5.6 strict로 타입 검사만 했다. 스크롤 동작은 브라우저에서 확인해야 한다(확인 필요).

<br/>

[목차](../README.md) | [이전 장: 프로그래스 바 애니메이션](../08_프로그래스%20바%20애니메이션(Progress%20Bar%20Animation)/README.md) | [다음 장: 스크롤 시점 애니메이션](../10_스크롤%20시점%20애니메이션(Scroll-triggered%20Animation)/README.md)
