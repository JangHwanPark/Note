## 깜빡임 효과란 ?
- 요소를 보였다 안 보였다 반복해서 눈에 띄게 하는 효과. 입력 커서, 로딩 표시, 알림 점에 쓴다
- 투명도(`opacity`)를 1과 0 사이에서 계속 오가게 하면 된다
- GSAP의 `repeat` 와 `yoyo` 로 만들 수도 있고, GSAP 없이 CSS `@keyframes` (Tailwind라면 `animate-*` 클래스)로 만들 수도 있다

### 요요 (Yoyo)
사전적 의미는 줄을 감았다 풀며 오르내리게 하는 장난감이다.
GSAP에서는 애니메이션을 반복할 때 매번 처음으로 돌아가지 않고, 끝에서 거꾸로 되감아 시작 상태로 돌아오게 하는 옵션을 말한다. 요요가 내려갔다 올라오듯 1에서 0으로 갔다가 다시 1로 돌아온다.

<br/>

## 어떤 방법을 고를까
| 방법 | 어울리는 경우 | 이유 |
| --- | --- | --- |
| GSAP | 로딩이 끝나면 멈추는 것처럼 코드로 멈추고 다시 시작해야 할 때 | 트윈 객체를 받아 `pause()`, `kill()` 로 제어할 수 있다 |
| Tailwind `animate-*` | Tailwind를 쓰는 프로젝트에서 항상 깜빡이면 될 때 | 클래스 하나로 붙이고 뗄 수 있다 |
| CSS `@keyframes` | 라이브러리 없이 항상 깜빡이면 될 때 | 추가 설치가 없고, 브라우저가 알아서 돌린다 |

깜빡이기만 하면 되고 코드로 제어할 일이 없다면 CSS로 충분하다. GSAP은 움직임을 실행 중에 바꿔야 할 때 고른다.

<br/>

## GSAP으로 깜빡이기
`repeat: -1` 은 끝없이 반복하라는 뜻이다. 여기에 `yoyo: true` 를 주면 반복할 때마다 방향이 바뀌어 1에서 0으로, 다시 0에서 1로 오간다. `yoyo` 가 없으면 0이 된 뒤 순간적으로 1로 돌아가 다시 사라지므로 깜빡임이 끊겨 보인다.

```tsx
useGSAP(() => {
  gsap.to(cursorRef.current, {
    opacity: 0,         // 투명하게 만들었다가
    duration: 0.5,      // 한 방향(1에서 0까지)에 0.5초
    repeat: -1,         // 끝없이 반복
    yoyo: true,         // 반복할 때마다 거꾸로 돌아와 다시 보이게
    ease: "power1.inOut",
  });
}, []);
```

`duration` 은 한 방향에 걸리는 시간이다. 사라졌다 다시 나타나는 한 번의 깜빡임은 0.5초 두 번, 즉 1초가 걸린다. GSAP 3.15에서 `ease: "none"` 으로 바꿔 시간별 투명도를 찍어 보면 아래처럼 나온다.

```text
0초 1.00 / 0.25초 0.50 / 0.5초 0.00 / 0.75초 0.50 / 1초 1.00
```

`useGSAP` 은 `@gsap/react` 의 훅이다. 컴포넌트가 사라질 때 만든 애니메이션을 정리해 주므로 끝없이 도는 트윈을 직접 지우지 않아도 된다. 자세한 이유는 [ref와 className](../06_ref와%20className(Ref%20and%20className)/README.md)에서 다룬다.

<br/>

## Tailwind로 깜빡이기
```tsx
<div ref={cursorRef} className="w-5 h-10 bg-[#eae5ec] rounded-sm animate-blink"></div>
```

`animate-blink` 는 Tailwind 기본 클래스가 아니라서 직접 등록해야 한다. Tailwind v4는 설정을 CSS 파일의 `@theme` 안에 쓴다. `--animate-*` 변수를 정의하면 같은 이름의 `animate-*` 클래스가 생긴다.

```css
@import "tailwindcss";

@theme {
  --animate-blink: blink 1s infinite;

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
}
```

v3 이하 프로젝트라면 tailwind.config.js의 `theme.extend` 에 등록한다.

```js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s infinite",
      },
    },
  },
};
```

키프레임을 0~50%는 보이게, 51~100%는 안 보이게 나눴으므로 GSAP 예시와 달리 거의 끊어서 깜빡인다. 다만 키프레임 사이는 여전히 보간되므로 50%에서 51%로 넘어가는 1%(1초 애니메이션이면 약 10ms) 동안은 서서히 흐려진다. 완전히 끊고 싶으면 `animation: blink 1s step-end infinite;` 처럼 타이밍 함수를 `step-end` 로 주면 다음 키프레임 직전까지 값을 유지하다 한 번에 바뀐다. 이 차이는 CSS 애니메이션 동작을 바탕으로 쓴 것이고 브라우저에서 확인하지는 않았다(확인 필요). 입력 커서처럼 보이고 싶을 때 이 방식을 쓴다.

<br/>

## CSS @keyframes로 깜빡이기
Tailwind 없이도 같은 키프레임을 클래스에 붙이면 된다. 키프레임 속성은 [키 프레임 (Keyframes)](../../../Markup_Style/CSS/animation.md)에 정리했다.

```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.blink {
  animation: blink 1s infinite;
}
```

```tsx
<div ref={cursorRef} className="w-5 h-10 bg-[#eae5ec] rounded-sm blink"></div>
```

Tailwind와 CSS 예시는 설정 문법을 옮긴 것으로, 이 노트를 정리하며 브라우저에서 다시 띄워 보지는 않았다(확인 필요).

<br/>

[목차](../README.md) | [이전 장: 시작과 끝에 스타일 바꾸기](../04_시작과%20끝에%20스타일%20바꾸기(Callbacks)/README.md) | [다음 장: ref와 className](../06_ref와%20className(Ref%20and%20className)/README.md)
