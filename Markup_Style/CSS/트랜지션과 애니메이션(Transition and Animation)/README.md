## 트랜지션과 애니메이션이란 ?
- CSS로 요소의 모양이 바뀌는 과정을 시간에 걸쳐 보여 주는 두 가지 방법
- 트랜지션(Transition)은 속성 값이 바뀔 때 그 사이를 부드럽게 채우고, 키프레임 애니메이션(Keyframe Animation)은 시작부터 끝까지의 단계를 미리 정해 두고 재생한다
- 둘 다 크기, 위치, 회전을 바꾸는 트랜스폼(Transform)과 함께 쓰는 경우가 많다

<br/>

## 트랜지션 (Transition)
사전적 의미는 이행, 넘어감. 한 상태에서 다른 상태로 옮겨 가는 과정이다.
CSS에서는 속성 값이 바뀔 때 즉시 바꾸지 않고 정해 둔 시간 동안 조금씩 바꾸는 기능을 말한다. 비유하면 전등 스위치를 딸깍 켜는 대신 밝기 조절기를 천천히 돌리는 것과 같다.

### 왜 필요할까
`:hover` 로 버튼 색을 바꾸면 기본으로는 한 프레임 만에 바뀐다. 바뀌는 순간이 너무 갑작스러우면 사용자가 무엇이 바뀌었는지 알아채기 어렵다. 트랜지션을 주면 바뀌는 과정이 보여서 조작에 대한 반응이 자연스럽다.

### 동작
트랜지션은 스스로 시작하지 않는다. `:hover`, `:active`, 클래스 추가처럼 속성 값이 바뀌는 일이 있어야 그 사이를 채운다.

```css
.button {
  background: steelblue;
  transition: background 0.3s ease;
}

.button:hover {
  background: tomato;
}
```

`transition` 은 바꿀 속성, 걸리는 시간, 타이밍 함수, 지연 시간을 한 번에 적는 축약형이다. 시간을 적지 않으면 기본값이 `0s` 라서 아무 효과가 없다. headless Chromium 156.0.8078.4에서 아무 스타일도 없는 요소의 `transition-duration` 은 `0s` 였다.

<br/>

## 트랜스폼 (Transform)
사전적 의미는 변형하다, 모양을 바꾸다.
CSS에서는 요소를 그린 뒤에 그 모습을 이동, 회전, 확대, 기울이는 기능을 말한다. 트랜스폼 자체는 애니메이션이 아니지만 트랜지션이나 키프레임과 함께 자주 쓴다. 주변 요소의 배치를 다시 계산하지 않고 그려진 모습만 바꾸기 때문에, `top` 이나 `width` 를 바꾸는 것보다 움직임에 쓰기 좋다.

- `rotate(45deg)` 는 요소를 지정한 각도만큼 회전시킨다. 각도 단위는 `deg`, `turn`, `rad` 등을 쓴다.
- `scale(x, y)` 는 요소를 확대하거나 축소한다. `scale(1.5)` 처럼 값 하나를 주면 가로세로를 같이 바꾼다.
- `translate(x, y)` 는 요소를 지정한 거리만큼 옮긴다. px, em, % 단위를 쓸 수 있고, %는 요소 자신의 크기를 기준으로 한다.
- `skew(x, y)` 는 요소를 지정한 각도만큼 기울인다.

`translate`, `rotate`, `scale` 은 `transform` 함수 말고 따로 쓰는 속성으로도 있다. headless Chromium 156.0.8078.4에서 높이 100px인 요소에 `translate: 0 -50%` 와 `transform: translateX(30px)` 을 함께 주었더니 둘 다 적용되어 (30px, -50px) 위치에 그려졌다. `-50%` 는 요소 자기 높이의 절반이라 -50px가 되었다.

<br/>

## 키프레임 애니메이션 (Keyframe Animation)
키프레임(Keyframe)은 원래 애니메이션 제작에서 움직임의 중요한 순간을 그린 그림을 말한다. 그 사이 장면은 나중에 채운다.
CSS에서도 `@keyframes` 로 0%, 50%, 100% 같은 중요한 순간의 스타일을 정해 두면, 브라우저가 그 사이를 채워 재생한다. 비유하면 트랜지션이 출발점과 도착점만 정한 이동이라면, 키프레임은 들를 곳을 미리 찍어 둔 경로다.

트랜지션과 다른 점은 두 가지다. 값이 바뀌는 계기 없이도 요소에 붙이는 순간 재생되고, 반복이나 방향을 정할 수 있다.

```css
@keyframes fade {
  from { opacity: 0.2; }
  to   { opacity: 0.8; }
}

.box {
  animation: fade 1s linear 1s; /* 이름, 시간, 타이밍 함수, 지연 */
}
```

### 키프레임 주요 속성
- `@keyframes` 는 애니메이션의 각 단계를 정의한다.
- `animation-name` 은 적용할 애니메이션 이름을 지정한다.
- `animation-duration` 은 한 번 재생하는 데 걸리는 시간을 지정한다.
- `animation-timing-function` 은 속도 곡선을 지정한다.
- `animation-delay` 는 시작하기 전 기다리는 시간을 지정한다.
- `animation-iteration-count` 는 반복 횟수를 지정한다. 숫자나 `infinite` 를 쓰고 기본값은 1이다.
- `animation-direction` 은 진행 방향을 지정한다. `normal`(기본값), `reverse`, `alternate`, `alternate-reverse` 가 있다.
- `animation-fill-mode` 는 애니메이션이 재생되지 않는 동안, 즉 지연 시간 중과 끝난 뒤에 어떤 스타일을 보일지 지정한다.

### animation-fill-mode가 하는 일
원래 `opacity: 1` 인 요소에 위의 `fade` 를 1초 지연으로 걸고, 지연 중(0.5초), 재생 중(1.5초), 끝난 뒤(2.5초)의 `opacity` 를 headless Chromium 156.0.8078.4에서 읽었다.

| 값 | 지연 중 | 재생 중 | 끝난 뒤 |
| --- | --- | --- | --- |
| `none` (기본값) | 1 (원래 값) | 0.5 | 1 (원래 값) |
| `forwards` | 1 (원래 값) | 0.5 | 0.8 (마지막 키프레임) |
| `backwards` | 0.2 (첫 키프레임) | 0.5 | 1 (원래 값) |
| `both` | 0.2 (첫 키프레임) | 0.5 | 0.8 (마지막 키프레임) |

`forwards` 는 끝난 뒤 마지막 모습을 유지하고, `backwards` 는 지연 시간 동안 첫 모습을 미리 보여 준다. 나타나는 효과에 지연을 줄 때 `backwards` 가 없으면 지연 동안 원래 모습이 보였다가 갑자기 투명해진다.

<br/>

## 타이밍 함수 (Timing Function)
타이밍 함수는 시간이 흐를 때 값이 얼마나 빨리 바뀌는지를 정하는 곡선이다. 트랜지션과 키프레임 애니메이션 모두에 쓴다.

- `ease` 는 조금 빠르게 출발해 가속한 뒤 끝에서 느려진다. `cubic-bezier(0.25, 0.1, 0.25, 1)` 과 같다. `transition-timing-function` 과 `animation-timing-function` 의 기본값이다(headless Chromium 156.0.8078.4에서 둘 다 `ease` 확인).
- `linear` 는 처음부터 끝까지 같은 속도로 진행한다.
- `ease-in` 은 천천히 시작해서 점점 빨라진다.
- `ease-out` 은 빠르게 시작해서 점점 느려진다.
- `ease-in-out` 은 시작과 끝이 같은 정도로 느린 대칭 곡선이다(`cubic-bezier(0.42, 0, 0.58, 1)`). `ease` 보다 출발이 느리다.
- `cubic-bezier()` 는 속도 곡선을 직접 정한다.
- `steps(n)` 은 값을 부드럽게 바꾸지 않고 n번에 나눠 끊어서 바꾼다.

<br/>

## 무엇을 쓸까
상태가 바뀔 때 그 사이만 부드럽게 하면 되는 경우(hover, 메뉴 열고 닫기)는 트랜지션이 간단하다. 요소가 나타나자마자 재생하거나, 반복하거나, 중간 단계가 여러 개인 경우(로딩 표시, 깜빡임)는 키프레임 애니메이션을 쓴다. 스크롤에 맞추거나 순서를 세밀하게 제어해야 하면 GSAP 같은 라이브러리를 쓴다. GSAP으로 깜빡임을 만드는 방법과 CSS 키프레임 방식의 비교는 [GSAP 깜빡임 효과](../../../Libraries/GSAP/05_깜빡임%20효과(Blink%20Effect)/README.md)에 정리했다.

<br/>

## 참고 자료
- [MDN: transition](https://developer.mozilla.org/ko/docs/Web/CSS/transition)
- [MDN: animation-fill-mode](https://developer.mozilla.org/ko/docs/Web/CSS/animation-fill-mode)
- 기본값과 fill-mode 결과는 Playwright 1.64.1의 headless Chromium 156.0.8078.4에서 Web Animations API로 재생 시점을 옮겨 가며 읽었다

<br/>

## 더 볼 것 (TODO)
- `prefers-reduced-motion` 으로 움직임 줄이기 (React 노트의 [스크롤 애니메이션](../../../React/스크롤%20애니메이션(Scroll%20Animation)/README.md)에서 일부 다룸)
- 어떤 속성이 트랜지션될 수 있는지(애니메이션 가능 속성)
- 트랜지션과 애니메이션의 끝을 알리는 `transitionend`, `animationend` 이벤트
