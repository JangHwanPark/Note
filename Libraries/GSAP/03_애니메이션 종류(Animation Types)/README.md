## 어떤 움직임을 만들 수 있나
- 페이드 인, 슬라이드 인, 흔들림처럼 자주 쓰는 움직임에 붙인 이름과, 그 움직임을 GSAP으로 만들 때 쓰는 메서드와 속성의 짝
- 대부분은 1장의 `to()`, `from()`, `fromTo()` 에 어떤 속성을 바꾸느냐, 2장의 어떤 이징을 쓰느냐, 반복하느냐의 조합이다
- 이 장은 그 조합표와 함께 반복(`repeat`, `yoyo`), 순서(`timeline`, `stagger`), 재생 제어 메서드, 자주 쓰는 속성을 모아 둔다

<br/>

## 움직임별 메서드와 속성
| 움직임 | 설명 | 쓰는 메서드와 속성 |
| --- | --- | --- |
| 페이드 인 (Fade In) | 부드럽게 나타난다 | `from()` 또는 `fromTo()` 로 `opacity: 0` 에서 시작 |
| 페이드 아웃 (Fade Out) | 점점 사라진다 | `to()` 로 `opacity: 0` |
| 슬라이드 인 (Slide In) | 왼쪽이나 오른쪽에서 들어온다 | `from()` 으로 `x` 또는 `xPercent` |
| 스케일 팝 (Scale Pop) | 작았다가 톡 튀어나오며 커진다 | `fromTo()` 로 `scale`, `ease: "back.out"` |
| 확대 (Expand) | 점점 커지며 나타난다 | `fromTo()` 로 `scale`, `opacity` |
| 축소 (Shrink) | 점점 작아지며 사라진다 | `to()` 로 `scale` |
| 튕기기 (Bounce) | 점프하듯 튕긴다 | `to()` 에 `ease: "bounce.out"` |
| 흔들림 (Shake) | 좌우로 살짝 흔들린다 | `to()` 로 `x` 를 바꾸고 `repeat`, `yoyo` |
| 진동 (Vibration) | 빠르게 떨린다 | 짧은 `duration` 에 `repeat: -1`, `yoyo: true` |
| 물결 (Wave) | 물결처럼 부드럽게 오간다 | `to()` 에 `ease: "sine.inOut"`, `repeat`, `yoyo` |
| 반짝임 (Shimmering) | 밝아졌다 흐려졌다 한다 | `to()` 로 `opacity` 에 `repeat: -1`, `yoyo: true` |
| 무한 회전 (Loop Rotation) | 계속 돈다 | `to()` 로 `rotation: 360`, `repeat: -1`, `ease: "none"` |
| 3D 뒤집기 (Flip) | 카드처럼 뒤집힌다 | `to()` 로 `rotationY: 180`, 부모에 `perspective` |
| 비틀기 (Twist) | 비틀린 듯 기운다 | `to()` 로 `skewX`, `skewY` |
| 흐림 (Blur In/Out) | 흐릿했다가 또렷해진다 | `from()` 으로 `filter: "blur(10px)"` 에서 시작. 흐려지며 사라질 때는 `to()` |
| 배경색 전환 | 배경색이 서서히 바뀐다 | `to()` 로 `backgroundColor` |
| 랜덤 이동 (Random Motion) | 요소마다 다른 곳으로 움직인다 | `x: "random(-100, 100)"` 또는 함수 값 |
| 글리치 (Glitch) | 화면이 깨진 듯 순간적으로 어긋난다 | 짧은 `to()` 여러 개를 `timeline` 으로, `x: "random(-10, 10)"` |
| 타이핑 (Typing) | 글자가 한 글자씩 나타난다 | 글자를 하나씩 `<span>` 으로 나눈 뒤 `from()` 에 `stagger`. 나누는 일은 SplitText 플러그인이 해 준다 |
| 끌어서 옮기기 (Draggable) | 마우스로 끌어 옮긴다 | Draggable 플러그인의 `Draggable.create()` |
| 스크롤 기반 | 스크롤 위치에 따라 움직인다 | ScrollTrigger 플러그인 (9장부터) |

`"random(-100, 100)"` 처럼 문자열로 쓰면 GSAP이 요소마다 그 범위의 값을 골라 준다. 실행해 보니 `translate(-6.9577px, 0px)` 처럼 범위 안의 값이 들어갔다.

<br/>

## 언제 실행할까
| 방식 | 실행 시점 | 어울리는 경우 |
| --- | --- | --- |
| `useGSAP` 안에서 바로 실행 | 컴포넌트가 처음 화면에 붙을 때 한 번 | 페이지 진입 효과 |
| `onMouseEnter`, `onMouseLeave` 같은 이벤트 핸들러 | 이벤트가 일어날 때마다 | 마우스를 올렸을 때 효과 |
| ScrollTrigger | 스크롤 위치에 닿을 때 | 스크롤 등장, 고정 |

이벤트 핸들러 안에서 만든 애니메이션도 컴포넌트가 사라질 때 정리되게 하려면 `useGSAP` 이 돌려주는 `contextSafe` 로 감싼다(@gsap/react 타입 정의에서 반환값에 `contextSafe` 가 있는 것을 확인했다).

<br/>

## 반복하기
`repeat`, `yoyo`, `repeatDelay` 를 함께 쓰면 일정 간격으로 오가는 움직임이 된다.

```js
gsap.to(".box", {
  y: -50,
  duration: 1,
  repeat: -1,       // 끝없이 반복
  yoyo: true,       // 갔던 길을 되돌아온다
  repeatDelay: 1,   // 한 번 끝날 때마다 1초 쉰다
  ease: "power1.inOut",
});
```

`yoyo` 가 없으면 끝에 닿은 뒤 처음 자리로 순간 이동해서 다시 출발한다. 위아래로 오가는 움직임에는 `yoyo: true` 가 필요하다.

`yoyo` 로 되돌아올 때는 이징도 시간을 거꾸로 돌린 모양으로 재생된다. `ease: "bounce.out"` 에 `yoyo: true` 를 주고 되돌아오는 구간의 값을 읽어 보니 0.988, 0.931, 0.766, 0.681, 0.076으로, 튕김이 바닥이 아니라 꼭대기 근처에서 일어났다. 내려올 때 바닥에서 튕기게 하려면 되돌아오는 구간의 이징만 따로 정하는 `yoyoEase: "bounce.out"` 을 쓴다. 이렇게 하니 같은 구간 값이 0.810, 0.507, 0.140, 0.113, 0.020으로 바닥 근처에서 튕겼다.

위로 올라갔다 내려오는 움직임은 아래처럼 고른다.

| 원하는 느낌 | 설정 |
| --- | --- |
| 올라갔다가 떨어져 튕긴다 | 올라갈 때와 내려올 때를 다른 트윈으로 나눈 `timeline`, 또는 `yoyoEase: "bounce.out"` |
| 부드럽게 올라갔다 부드럽게 내려온다 | `ease: "power2.inOut"`, `yoyo: true` |
| 계속 오르내린다 | `repeat: -1`, `yoyo: true` |
| 오르내린 뒤 잠깐 쉬었다 다시 한다 | `repeat: -1`, `yoyo: true`, `repeatDelay: 1` |

<br/>

## 타임라인 (Timeline)
여러 애니메이션을 시간 순서대로 이어 붙이는 그릇이다. `gsap.timeline()` 으로 만든 뒤 `.to()`, `.from()` 을 이어 쓰면 앞의 것이 끝난 뒤 다음 것이 시작한다.

```js
const tl = gsap.timeline();

tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { x: 200, duration: 1 })   // box1이 끝난 뒤 시작
  .to(".box3", { x: 300, duration: 1 });  // box2가 끝난 뒤 시작
```

각 애니메이션에 `delay` 를 계산해 넣지 않아도 되고, 앞 애니메이션의 길이를 바꾸면 뒤가 알아서 밀린다. 1초짜리 두 개를 이어 붙인 타임라인의 `duration()` 은 2였다. 타임라인 전체를 한 번에 멈추거나 되감을 수도 있다.

<br/>

## 여러 요소를 차례로 움직이기 (stagger)
같은 애니메이션을 여러 요소에 시간 차를 두고 거는 설정이다. `stagger: 0.2` 면 요소마다 0.2초씩 늦게 출발한다. 0.5초짜리 애니메이션을 세 요소에 `stagger: 0.2` 로 걸면 전체 길이는 0.9초다.

### 되돌아올 때 순서가 뒤집히는 문제
stagger로 1, 2, 3 순서로 올린 애니메이션을 `reverse()` 로 되돌리면 3, 2, 1 순서로 내려온다. `reverse()` 는 애니메이션 전체를 거꾸로 재생하기 때문이다. 끝나기 0.25초 전 시점의 위치를 읽어 보니 1번은 아직 -50px 그대로이고 3번이 먼저 -37.5px로 내려오고 있었다.

올라간 순서 그대로 내려오게 하려면 `reverse()` 대신 요소마다 따로 오가게 한다. `stagger` 에 객체를 넘기고 그 안에 `repeat`, `yoyo` 를 두면, 반복이 전체가 아니라 요소 하나하나의 애니메이션에 걸린다.

```js
gsap.to(".item", {
  y: -50,
  duration: 0.5,
  stagger: {
    each: 0.2,     // 요소마다 0.2초 간격
    repeat: 1,     // 요소마다 한 번 더 (돌아오기)
    yoyo: true,
  },
});
```

`ease: "none"` 으로 실행해 위치를 읽으니 1.0초에 1번은 이미 0으로 돌아왔고 2번은 -20px, 3번은 -40px였다. 1, 2, 3 순서로 올라가서 같은 순서로 내려온다.

### 요소마다 다른 이징 주기
`ease` 는 요소마다 다른 값을 함수로 받지 않는다. 선택자로 나눠 따로 건다.

```js
gsap.to(".item:nth-child(odd)", {
  y: -50,
  duration: 1,
  ease: "bounce.out",
  stagger: 0.2,
});

gsap.to(".item:nth-child(even)", {
  y: -50,
  duration: 1,
  ease: "elastic.out(1, 0.3)",
  stagger: 0.2,
});
```

홀수 번째(`odd`, 1번, 3번…) 요소는 bounce, 짝수 번째(`even`) 요소는 elastic으로 움직인다. `nth-child` 는 부모 안의 모든 형제 중 몇 번째인지로 세므로, `.item` 앞에 다른 요소가 있으면 순서가 밀린다. 실제로 `.item` 앞에 `<div>` 하나를 두니 `odd` 에 2번, 4번 항목이 잡혔다.

### 요소마다 다른 높이로 튕기기
값 자리에 함수를 넣으면 요소마다 그 함수를 따로 불러 값을 정한다.

```js
gsap.to(".item", {
  y: () => gsap.utils.random([-100, -50, -80]),  // 배열에서 하나를 고른다
  duration: 1,
  ease: "bounce.out",
  stagger: 0.2,
});
```

`gsap.utils.random([-100, -50, -80])` 을 다섯 번 부르니 `-100, -80, -50, -100, -80` 처럼 배열 안의 값만 나왔다.

<br/>

## 예제: 아래로 스크롤하면 숨고 위로 올리면 나타나는 헤더
```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const AutoHideHeader = () => {
  const headerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    // yPercent -100(헤더 높이만큼 위, 화면 밖)에서 제자리로 내려오는 애니메이션
    const showAnim = gsap
      .from(headerRef.current, { yPercent: -100, paused: true, duration: 0.2 })
      .progress(1); // 끝 상태(제자리)로 맞춰 두어 처음에는 헤더가 보인다

    ScrollTrigger.create({
      start: "top top",
      end: "max",    // 페이지 끝까지
      onUpdate: (self) => {
        // direction 은 위로 스크롤하면 -1, 아래로 스크롤하면 1
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
    });
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: 15, background: "#333", color: "white", zIndex: 100 }}
      >
        헤더
      </header>
      <div style={{ paddingTop: 60, height: 2000 }}>스크롤을 내려 보세요</div>
    </>
  );
};
```

`from()` 은 `yPercent: -100` 에서 제자리(0)로 오는 애니메이션이다. `.progress(1)` 로 끝 상태에 맞춰 두면 처음에는 헤더가 제자리에 보인다. 실행해 보니 `progress(1)` 에서 `transform` 은 `translate(0, 0)`, `progress(0)` 에서는 `translate(0%, -100%)` 였다. 아래로 스크롤하면 `reverse()` 로 시작 상태(화면 밖)로 돌아가 숨고, 위로 스크롤하면 `play()` 로 다시 내려온다.

컴포넌트가 사라질 때 `useGSAP` 이 안에서 만든 애니메이션과 ScrollTrigger를 함께 정리한다. `useEffect` 로 쓰면서 정리 함수에서 `ScrollTrigger.getAll().forEach(t => t.kill())` 를 부르면 다른 컴포넌트가 만든 ScrollTrigger까지 모두 지워지므로 피한다.

`end: "max"` 는 스크롤할 수 있는 끝까지라는 뜻이다. 큰 숫자(`end: 99999`)를 넣어도 비슷하게 동작하지만 의도가 덜 드러난다. gsap 3.15.0의 ScrollTrigger 소스에 `end: "max"` 를 따로 처리하는 코드가 있는 것까지 확인했고, 브라우저에서 실행하지는 않았다.

<br/>

## 재생을 다루는 메서드
`gsap.to()` 같은 메서드와 `gsap.timeline()` 은 애니메이션 객체를 돌려준다. 이 객체로 재생을 직접 다룬다.

| 메서드 | 하는 일 |
| --- | --- |
| `play()` | 재생한다 |
| `pause()` | 멈춘다 |
| `reverse()` | 거꾸로 재생한다 |
| `restart()` | 처음부터 다시 재생한다 |
| `progress(값)` | 진행률을 0에서 1 사이 값으로 맞춘다 |
| `seek(시간)` | 특정 시각으로 옮긴다 |
| `timeScale(값)` | 빠르기를 바꾼다. 1이 보통, 0.5는 절반, 2는 두 배 |
| `kill()` | 애니메이션을 없앤다 |

이 밖에 `gsap.set(대상, 값)` 은 애니메이션 없이 속성을 바로 바꾼다. `gsap.set(el, { rotation: 45 })` 을 실행하면 바로 `rotate(45deg)` 가 붙었다.

<br/>

## 자주 쓰는 속성
### 위치와 변형
CSS `transform` 을 직접 쓰지 않고 아래 이름으로 따로 적는다. GSAP이 모아서 `transform` 하나로 만든다.

| 속성 | 뜻 |
| --- | --- |
| `x`, `y` | 가로, 세로 이동(px) |
| `xPercent`, `yPercent` | 요소 자기 너비, 높이에 대한 비율로 이동. `yPercent: -100` 은 자기 높이만큼 위로 |
| `rotation` | 회전(도) |
| `rotationX`, `rotationY` | 가로축, 세로축 기준 3D 회전 |
| `scale`, `scaleX`, `scaleY` | 크기. 1이 원래 크기 |
| `skewX`, `skewY` | 비틀기(도) |
| `transformOrigin` | 변형의 기준점. 예: `"center center"` |

### 투명도와 색
`opacity` (0이 완전 투명), `color`, `backgroundColor`, `borderColor`, SVG의 `fill`, `stroke` 를 바꿀 수 있다.

### 크기와 위치
`width`, `height`, `top`, `left` 같은 속성도 바꿀 수 있지만, 바뀔 때마다 브라우저가 배치를 다시 계산하므로 움직임에는 `x`, `y`, `scale` 을 먼저 쓴다.

### 시간과 반복
| 속성 | 뜻 |
| --- | --- |
| `duration` | 걸리는 시간(초). 적지 않으면 0.5 |
| `delay` | 시작 전 기다리는 시간(초) |
| `ease` | 빠르기 변화(2장). 적지 않으면 `power1.out` |
| `repeat` | 반복 횟수. -1이면 끝없이 |
| `repeatDelay` | 반복 사이 쉬는 시간 |
| `yoyo` | 반복할 때 거꾸로 되돌아올지 |
| `stagger` | 여러 요소 사이의 시간 차 |
| `paused` | 멈춘 상태로 만들기 |

<br/>

## 확인한 환경
- gsap 3.15.0, jsdom 25, Node.js v22.13.0. 위치와 순서에 대한 숫자는 진행 시각을 직접 맞추고 요소의 `style` 을 읽어 확인했다
- 표의 움직임별 설정과 React 예제(헤더)의 스크롤 동작은 브라우저에서 실행하지 않았다. 헤더 예제는 애니메이션 부분(`progress` 값에 따른 위치)만 확인했다
- ScrollTrigger의 시작과 끝 위치 문법은 9장에서 다룬다

<br/>

[목차](../README.md) | [이전 장: 이징](../02_이징(Easing)/README.md) | [다음 장: 시작과 끝에 스타일 바꾸기](../04_시작과%20끝에%20스타일%20바꾸기(Callbacks)/README.md)
