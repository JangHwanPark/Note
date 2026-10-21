## 스크롤 애니메이션이란 ?
- 사용자가 스크롤할 때 화면이 부드럽게 움직이거나, 요소가 보이는 시점에 맞춰 나타나게 하는 효과
- 부드러운 스크롤과 스크롤 스냅은 CSS만으로 되고, React에서는 ref로 요소를 잡아 특정 위치로 이동시키거나 요소가 화면에 들어왔는지 감지해 애니메이션을 시작한다
- 이 문서는 라이브러리 없이 만들 수 있는 것만 다룬다. GSAP로 만드는 패럴랙스와 관성 스크롤은 [패럴랙스와 관성 스크롤](../../Libraries/GSAP/13_패럴랙스와%20관성%20스크롤(Parallax%20and%20Smooth%20Scroll)/README.md), Next.js의 페이지 전환 애니메이션은 [페이지 전환 애니메이션](../../NextJS/페이지%20전환%20애니메이션(Page%20Transition)/README.md)에 정리했다

### 스크롤 (Scroll)
사전적 의미는 두루마리다. 옛 문서처럼 길게 말린 종이를 펼쳐 가며 읽는 것을 말한다.
화면에서는 한 번에 다 보이지 않는 내용을 위아래나 좌우로 밀어 가며 보는 동작을 말한다. 두루마리를 펼치듯 보이는 부분만 옮겨 간다.

<br/>

## React 없이 CSS로 되는 것
### 부드러운 스크롤 (Smooth Scroll)
앵커 링크로 이동할 때 한 번에 점프하지 않고 미끄러지듯 이동하게 한다. CSS 한 줄이면 된다.

```css
html {
  scroll-behavior: smooth;
}
```

### 스크롤 스냅 (Scroll Snap)
스냅(snap)의 사전적 의미는 딱 하고 맞물리는 것이다. 스크롤을 멈추면 가장 가까운 섹션의 시작 위치에 딱 맞춰 멈추게 한다. 풀페이지 섹션이나 가로 카드 슬라이더에 쓴다.

스크롤 컨테이너에 `scroll-snap-type` 을, 자식에 `scroll-snap-align` 을 준다.

```css
.container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory; /* y축, 항상 스냅 */
}

.section {
  height: 100vh;
  scroll-snap-align: start;
}
```

<br/>

## ref로 특정 위치까지 스크롤하기
버튼을 눌러 특정 섹션으로 이동하려면 그 섹션의 DOM 요소가 필요하다. React에서는 `document.querySelector` 대신 `useRef` 로 요소를 잡는다. 같은 컴포넌트를 여러 번 그려도 각자 자기 요소를 가리키기 때문이다.

```tsx
import { useRef } from 'react';

function Page() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <button onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
        소개로 이동
      </button>
      <section ref={sectionRef}>소개</section>
    </>
  );
}
```

`behavior: 'smooth'` 를 주면 CSS의 `scroll-behavior` 없이도 이 이동만 부드럽게 한다. `sectionRef.current` 는 처음 렌더링 전에는 `null` 이므로 `?.` 로 확인한다.

<br/>

## 화면에 들어올 때 나타나게 하기
요소가 화면에 들어오는 시점에 애니메이션을 시작하는 효과다. 아래로 내려가며 카드가 하나씩 떠오르는 화면에서 흔히 본다.

### 왜 IntersectionObserver를 쓸까
Intersection의 사전적 의미는 교차, Observer는 지켜보는 사람이다. 이름 그대로 요소와 화면이 겹치는지 지켜보는 API다.

스크롤 이벤트마다 요소 위치를 직접 계산하면 스크롤할 때마다 계산이 돌아 화면이 버벅일 수 있다. IntersectionObserver는 브라우저에 내장된 API로, 요소와 화면이 겹치는 정도가 정해 둔 기준을 넘나들 때만 알려 준다. 그래서 이 계산을 브라우저에 맡길 수 있다.

### 동작
1. `useRef` 로 지켜볼 요소를 잡는다
2. 마운트되면 `useEffect` 에서 IntersectionObserver를 만들고 요소를 지켜보게 한다
3. 요소가 20% 이상 보이면 상태를 바꿔 클래스를 붙이고, 더 지켜볼 필요가 없으니 관찰을 끊는다
4. 컴포넌트가 사라질 때도 관찰을 끊는다

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';

function FadeIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.2) {
        setVisible(true);
        observer.disconnect(); // 한 번 보이면 더 지켜보지 않는다
      }
    }, { threshold: 0.2 }); // 보이는 비율이 20%를 넘나들 때 알려 준다

    observer.observe(el);
    return () => observer.disconnect(); // 언마운트할 때도 정리한다
  }, []);

  return <div ref={ref} className={visible ? 'fade-in' : 'before-fade'}>{children}</div>;
}
```

```css
.before-fade {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in {
  opacity: 1;
  transform: none;
  transition: opacity 0.5s, transform 0.5s;
}
```

조건을 `entry.isIntersecting` 이 아니라 `intersectionRatio >= 0.2` 로 쓴 이유가 있다. `observe()` 를 부르면 기준을 넘지 않았어도 지금 상태를 알려 주는 콜백이 한 번 바로 오고, `isIntersecting` 은 조금이라도 겹치면 `true` 다. 그래서 `isIntersecting` 만 보면 화면 끝에 1px만 걸쳐 있어도 바로 나타나 버린다. 보이는 비율을 직접 비교해야 20% 기준이 지켜진다.

`ref.current` 를 `useEffect` 안에서 읽는 이유는 렌더링이 끝나 DOM이 붙은 뒤에야 값이 들어오기 때문이다.

시작 지점을 세밀하게 정하거나 스크롤 진행률에 맞춰 움직이게 하려면 GSAP ScrollTrigger를 쓴다. 사용법은 [스크롤 시점에 나타나는 애니메이션](../../Libraries/GSAP/10_스크롤%20시점%20애니메이션(Scroll-triggered%20Animation)/README.md)에 정리했다.

<br/>

## 움직임을 줄이고 싶은 사용자 배려
OS에서 동작 줄이기를 켜면 브라우저의 `prefers-reduced-motion` 값이 `reduce` 로 바뀐다. 움직임에 민감한 사용자는 큰 스크롤 효과에 어지러움을 느낄 수 있으므로, 이 설정일 때는 위의 효과를 끄거나 약하게 하는 것이 좋다.

CSS로 준 효과는 미디어 쿼리로 끈다. 부드러운 스크롤뿐 아니라 나타나기 효과의 이동과 전환도 함께 끈다.

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .before-fade,
  .fade-in {
    transform: none;
    transition: none;
  }
}
```

JavaScript에서 넘긴 `scrollIntoView({ behavior: 'smooth' })` 는 이 CSS로 꺼지지 않는다. `matchMedia` 로 설정을 읽어 직접 바꾼다.

```ts
function scrollToSection(el: HTMLElement | null) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
```

<br/>

## 참고 자료
1. MDN, [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
2. MDN, [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

예시 코드는 React 19.2, TypeScript 5.6 `strict`로 타입 검사했다. jsdom에는 IntersectionObserver와 `scrollIntoView` 가 없어서 둘을 흉내 낸 객체로 바꿔 실행했다. 보이는 비율이 0.05일 때는 `before-fade` 그대로이고 0.2가 되면 `fade-in` 이 붙고 관찰이 끊기는 것, 버튼을 누르면 `scrollIntoView({ behavior: 'smooth' })` 가 불리는 것을 확인했다. 실제 브라우저에서 움직임을 본 것은 아니다.

<br/>

## 더 볼 것 (TODO)
- 여러 요소를 IntersectionObserver 하나로 지켜보기
- 무한 스크롤을 IntersectionObserver로 만들기
