## 패럴랙스와 관성 스크롤이란 ?
- 패럴랙스는 배경과 앞의 요소를 서로 다른 속도로 움직여 깊이감을 주는 효과다
- 관성 스크롤은 휠을 멈춰도 스크롤이 바로 서지 않고 서서히 멈추게 하는 효과다
- 패럴랙스는 ScrollTrigger의 `scrub` 옵션으로, 관성 스크롤은 Lenis 라이브러리로 만들고, 둘을 함께 쓸 때는 스크롤 위치를 맞춰 줘야 한다

라이브러리 없이 만드는 스크롤 효과는 [스크롤 애니메이션](../../../React/스크롤%20애니메이션(Scroll%20Animation)/README.md)에 정리했다.

<br/>

## 패럴랙스 만들기
### 패럴랙스 (Parallax)
사전적 의미는 시차, 보는 위치에 따라 물체가 다르게 보이는 현상이다. 달리는 기차에서 보면 가까운 전봇대는 빠르게 지나가고 먼 산은 천천히 움직인다.
화면에서는 이 현상을 흉내 내 배경은 느리게, 앞의 요소는 빠르게 움직여 평면인 화면에 깊이감을 준다.

### 동작
ScrollTrigger의 `scrub` 은 애니메이션 진행률을 스크롤 위치에 묶는다. 시간이 아니라 스크롤한 만큼 애니메이션이 진행된다.

문서 흐름 안에 있는 배경은 스크롤하면 앞의 내용과 같은 속도로 올라간다. 여기에 스크롤하는 동안 배경을 아래쪽(양수 방향)으로 조금씩 밀어 주면, 올라가는 속도에서 그만큼이 빠져 앞의 내용보다 느리게 지나가는 것처럼 보인다. 음수로 주면 거꾸로 더 빨리 올라간다. `yPercent` 는 화면 높이가 아니라 요소 자기 높이에 대한 비율이고, 배경을 밀어 낸 만큼 반대쪽이 비어 보일 수 있어서 배경을 감싸는 영역보다 크게 만들어 둔다.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.to('.bg', {
  yPercent: 30, // 스크롤하는 동안 배경을 자기 높이의 30%만큼 아래로 밀어 전경보다 느리게 올라가게 한다
  ease: 'none',  // 스크롤한 만큼 일정하게 움직이도록 가감속을 뺀다
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',     // .hero 위쪽이 화면 위쪽에 닿을 때 시작
    end: 'bottom top',    // .hero 아래쪽이 화면 위쪽에 닿을 때 끝
    scrub: true,          // 스크롤 위치와 애니메이션 진행률을 연결
  },
});
```

<br/>

## 관성 스크롤 만들기
### 관성 스크롤 (Smooth Scroll)
smooth의 사전적 의미는 매끄러운, 부드러운이다. 영어로는 smooth scroll이라 부르고, 우리말로는 움직이던 것이 바로 서지 않고 이어 움직이는 성질(관성)에 빗대 관성 스크롤이라고 흔히 부른다.
화면에서는 휠 입력이 멈춘 뒤에도 스크롤이 목표 위치까지 따라가다 서서히 멈추게 하는 효과를 말한다. Lenis는 물리 계산을 하지 않고, 목표 위치를 향해 남은 거리를 일정 비율씩 줄여 간다. 문 닫힘 장치가 달린 문이 처음엔 빨리 움직이다 거의 닫힐 즈음 천천히 닫히는 것과 비슷하다.

### 동작
트랙패드와 터치 화면은 브라우저가 이미 관성 스크롤을 해 주고, 브라우저에 따라 마우스 휠 스크롤도 부드럽게 움직인다. 다만 이 움직임은 브라우저와 기기가 정하므로 개발자가 이동 거리나 감속 정도를 정할 수 없다.

Lenis는 휠 입력을 받아 목표 위치를 정하고, 매 프레임 지금 위치를 목표 위치 쪽으로 남은 거리의 일정 비율만큼 옮긴다. 이것을 선형 보간(lerp)이라고 한다. 이 비율을 정하는 것이 `lerp` 옵션이고 기본값은 0.1이다. 처음엔 남은 거리가 커서 빨리 움직이고, 가까워질수록 느려진다. 이 계산을 매 프레임 해야 하므로 `lenis.raf()` 를 매 프레임 불러 준다.

다만 1.3.27 소스는 `lerp` 값을 그대로 매 프레임 비율로 쓰지 않는다. `damp(현재, 목표, lerp * 60, 지난 프레임 이후 흐른 초)` 로 계산하고, 이 함수는 `1 - Math.exp(-lerp * 60 * 흐른 초)` 를 비율로 쓴다. 프레임이 몇 번 돌든 같은 시간 동안 같은 거리를 가게 맞추는 방식이다. 기본값 0.1이면 60fps에서 한 프레임에 남은 거리의 약 9.5%, 120fps에서는 약 4.9%를 간다(Node에서 식을 계산한 값). `duration` 과 `easing` 옵션을 주면 이 방식 대신 정해진 시간 동안 이징 곡선을 따라 움직인다(참고 자료 2).

1.3.27 타입 정의 기준으로 휠 스크롤을 부드럽게 하는 `smoothWheel` 은 기본값이 `true`, 터치 스크롤까지 Lenis가 맡게 하는 `syncTouch` 는 기본값이 `false` 다(참고 자료 2). 기본 설정에서는 터치 스크롤을 브라우저에 맡긴다는 뜻으로 읽히지만 실제 기기에서 확인하지는 않았다(확인 필요).

```js
import Lenis from 'lenis';

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

1.3.27 타입 정의에는 사용자의 `prefers-reduced-motion` 설정을 따를지 정하는 `respectReducedMotion` 옵션이 있고 기본값은 `true` 다(참고 자료 2). 타입 설명에는 이 설정이 켜져 있으면 부드러운 이동을 끈다고 적혀 있지만 실제 동작은 확인하지 못했다(확인 필요). 1.3.4 타입 정의에는 이 옵션이 없으므로 쓰는 버전을 확인한다.

<br/>

## ScrollTrigger와 함께 쓰기
Lenis가 스크롤을 직접 움직이면 ScrollTrigger가 보는 스크롤 위치와 실제 화면이 어긋날 수 있다. Lenis README가 안내하는 방법은 아래 세 가지다(참고 자료 1).

1. Lenis가 스크롤할 때마다 `ScrollTrigger.update` 를 불러 위치를 맞춘다
2. Lenis의 프레임 갱신을 GSAP의 ticker에 맡겨 두 라이브러리가 같은 프레임에 움직이게 한다. GSAP ticker의 시간은 초 단위라 밀리초로 바꿔 넘긴다
3. GSAP의 lagSmoothing을 끈다. lagSmoothing은 프레임이 크게 밀렸을 때 GSAP가 시간을 보정하는 기능인데, README는 스크롤 애니메이션이 늦어지지 않도록 끄라고 안내한다

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // 초를 밀리초로 바꾼다
});

gsap.ticker.lagSmoothing(0);
```

이때는 위의 `requestAnimationFrame` 반복문을 따로 돌리지 않는다. 같은 일을 GSAP ticker가 대신한다.

<br/>

## 참고 자료
1. [Lenis README](https://github.com/darkroomengineering/lenis/blob/main/README.md)
2. lenis 1.3.27 패키지의 타입 정의 `dist/lenis.d.ts` (`lerp`, `smoothWheel`, `syncTouch`, `respectReducedMotion` 옵션 설명과 기본값)와 소스 `dist/lenis.mjs` (`damp` 함수와 `advance` 메서드)

예시 코드는 gsap 3.15.0, lenis 1.3.27 타입 정의로 TypeScript 5.6 `strict` 타입 검사만 했다. 패럴랙스 방향(양수일 때 배경이 느리게 보이는 것)을 포함해 브라우저에서 실제 움직임은 확인하지 않았다(브라우저 확인 필요).

<br/>

[목차](../README.md) | [이전 장: 핀 고정](../12_핀%20고정(Pin)/README.md)
