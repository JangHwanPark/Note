## 움직일 수 없는 스타일은 어떻게 바꿀까
- 애니메이션이 시작하거나 끝나는 순간, 또는 스크롤이 특정 구간을 지나는 순간에 `position` 처럼 움직일 수 없는 스타일을 바꾸는 방법
- 방법은 셋이다. 트윈의 콜백(`onStart`, `onComplete`), ScrollTrigger의 `toggleClass`, ScrollTrigger의 콜백(`onEnter`, `onLeave` 등)
- 이 장의 예시는 헤더를 스크롤 구간에 따라 `position: fixed` 와 `relative` 사이에서 바꾸는 상황이다

### 콜백 (Callback)
call back은 다시 전화하다라는 뜻이다. 용건을 남겨 두면 상대가 때가 됐을 때 전화를 걸어 준다.
공학적으로는 미리 넘겨 둔 함수를, 정해진 일이 일어났을 때 상대 쪽에서 불러 주는 것을 말한다. GSAP에 `onComplete` 로 함수를 넘겨 두면 애니메이션이 끝나는 순간 GSAP이 그 함수를 부른다.

<br/>

## 왜 필요할까
`position`, `display` 처럼 중간값이 없는 속성은 서서히 바꿀 수 없다. fixed와 relative의 반쯤인 상태는 없기 때문이다. 그래서 움직이는 값(`y`, `opacity`)은 애니메이션에 맡기고, 이런 속성은 특정 순간에 한 번에 바꾼다. 그 순간을 알려 주는 것이 콜백과 ScrollTrigger의 상태 변화다.

<br/>

## 방법 1: onStart, onComplete
트윈에 `onStart`, `onComplete` 를 넘기면 애니메이션이 시작할 때, 끝날 때 함수를 부른다.

```js
gsap.to(headerRef.current, {
  y: -100,
  duration: 1.2,
  onStart: () => {
    headerRef.current.style.position = "fixed";     // 시작할 때
  },
  onComplete: () => {
    headerRef.current.style.position = "relative";  // 끝났을 때
  },
  scrollTrigger: {
    trigger: headerRef.current,
    start: "top 100px",
    end: "top 50px",
    scrub: true,
  },
});
```

`start: "top 100px"` 는 트리거 요소의 윗변이 화면 위에서 100px 지점에 닿을 때 시작한다는 뜻이고, `end: "top 50px"` 는 50px 지점에 닿을 때 끝난다는 뜻이다. `scrub: true` 면 스크롤 위치가 곧 진행률이라 사용자가 앞뒤로 오가며 진행률이 오르내린다(위치 문법과 `scrub` 은 9장에서 자세히 다룬다). 이때 콜백이 언제 불리는지 진행률을 직접 바꿔 가며 확인해 보니 아래와 같았다.

| 진행률 변화 | 불린 콜백 | 그 뒤 `position` |
| --- | --- | --- |
| 0 → 0.5 | `onStart` | fixed |
| 0.5 → 1 | `onComplete` | relative |
| 1 → 0.5 (되돌아감) | 없음 | relative 그대로 |
| 0.5 → 0 | `onReverseComplete` | relative 그대로 |
| 0 → 0.5 (다시 진행) | `onStart` | fixed |

끝에서 되돌아가는 동안에는 콜백이 불리지 않고, 진행률이 0에 닿을 때 `onReverseComplete` 만 불린다. 이 예시는 그 콜백을 쓰지 않았으므로 되돌아가는 내내 relative가 남는다. 되돌아갈 때도 바꾸려면 `onReverseComplete` 에서 원래대로 돌려놓아야 한다. 애니메이션이 한 번만 재생되고 다시 되감기지 않을 때 이 방법이 가장 간단하다.

<br/>

## 방법 2: toggleClass
ScrollTrigger는 스크롤 위치가 `start` 와 `end` 사이에 있을 때 활성 상태가 된다. `toggleClass` 를 주면 활성일 때 클래스를 붙이고, 구간을 벗어나면 뗀다.

```js
gsap.to(headerRef.current, {
  y: -100,
  scrollTrigger: {
    trigger: headerRef.current,
    start: "top 100px",
    end: "top 50px",
    scrub: true,
    toggleClass: { targets: headerRef.current, className: "relative-header" },
  },
});
```

```css
.relative-header {
  position: relative !important;
}
```

스타일을 CSS에 두므로 JavaScript에서 스타일 값을 직접 다루지 않아도 되고, 앞뒤로 스크롤해도 구간 안팎에 따라 알아서 붙었다 떨어진다.

다만 클래스가 붙어 있는 것은 구간 안에 있을 때뿐이다. 위 예시라면 50px 구간을 지나는 동안만 relative였다가 구간을 지나면 다시 원래 스타일로 돌아간다. 구간을 지난 뒤에도 바뀐 상태를 유지하고 싶다면 방법 3이 맞다. 클래스를 붙이고 떼는 조건은 gsap 3.15.0의 ScrollTrigger 소스에서 `isActive` 일 때 `add`, 아닐 때 `remove` 를 부르는 코드로 확인했다.

<br/>

## 방법 3: ScrollTrigger 콜백
구간의 경계를 넘는 네 가지 순간에 각각 함수를 걸 수 있다.

| 콜백 | 불리는 순간 |
| --- | --- |
| `onEnter` | 아래로 스크롤하다 `start` 를 지나 구간에 들어올 때 |
| `onLeave` | 아래로 스크롤하다 `end` 를 지나 구간을 벗어날 때 |
| `onEnterBack` | 위로 스크롤하다 `end` 를 지나 구간에 다시 들어올 때 |
| `onLeaveBack` | 위로 스크롤하다 `start` 를 지나 구간 위로 벗어날 때 |

구간을 지난 뒤에는 relative, 구간 안이나 구간 위에서는 fixed로 두려면 아래처럼 쓴다.

```js
ScrollTrigger.create({
  trigger: headerRef.current,
  start: "top 100px",
  end: "top 50px",
  onEnter: () => { headerRef.current.style.position = "fixed"; },
  onLeave: () => { headerRef.current.style.position = "relative"; },     // 구간 아래로 벗어남
  onEnterBack: () => { headerRef.current.style.position = "fixed"; },    // 다시 구간으로
  onLeaveBack: () => { headerRef.current.style.position = "fixed"; },    // 구간 위로 벗어남
});
```

애니메이션 없이 순간만 알고 싶을 때는 `gsap.to()` 없이 `ScrollTrigger.create()` 만 쓴다. 이때는 진행률을 따라갈 애니메이션이 없으므로 `scrub` 은 필요 없다. 네 콜백이 언제 불리는지는 gsap 3.15.0 ScrollTrigger 소스에서 진행률이 0에서 들어오면 enter, 1에 닿으면 leave, 1에서 돌아오면 enterBack, 0으로 돌아가면 leaveBack으로 나누는 코드로 확인했다.

<br/>

## 어떤 방법을 고를까
| 방법 | 좋은 점 | 아쉬운 점 |
| --- | --- | --- |
| `onStart`, `onComplete` | 트윈 하나 안에서 끝난다 | 되돌아갈 때는 불리지 않아 직접 처리해야 한다 |
| `toggleClass` | 스타일을 CSS에 두고, 앞뒤 스크롤을 알아서 처리한다 | 구간 안에 있을 때만 적용된다 |
| ScrollTrigger 콜백 | 네 경계마다 원하는 상태를 정할 수 있다 | 코드가 길어진다 |

애니메이션이 한 번 끝나고 바뀐 상태로 남으면 방법 1, 정해진 구간에서만 스타일이 달라야 하면 방법 2, 구간을 지난 뒤의 상태까지 정해야 하면 방법 3을 쓴다. 콜백 전체 목록은 [9장 ScrollTrigger 기본](../09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md)에 정리했다.

<br/>

## 확인한 환경
- gsap 3.15.0, jsdom 25, Node.js v22.13.0
- 방법 1의 콜백 순서는 ScrollTrigger 없이 트윈의 `progress()` 를 0, 0.5, 1 사이로 바꿔 가며 확인했다. 실제 스크롤로 진행률을 움직인 것은 아니다
- 방법 2, 3의 동작은 ScrollTrigger 소스 코드를 읽어 확인했다. 브라우저에서 스크롤하며 실행하지는 않았다
- 예시는 `position` 이 바뀌는 헤더 자신을 `trigger` 로 쓴다. fixed와 relative가 바뀌면 헤더의 위치가 달라져 `start`, `end` 계산이 어긋날 수 있으므로, 실제로는 위치가 바뀌지 않는 감싸는 요소를 `trigger` 로 두는 편이 안전할 것으로 보인다(확인 필요)

<br/>

[목차](../README.md) | [이전 장: 애니메이션 종류](../03_애니메이션%20종류(Animation%20Types)/README.md) | [다음 장: 깜빡임 효과](../05_깜빡임%20효과(Blink%20Effect)/README.md)
