## 직접 구현할 수 있는 스크롤 UX 개선 기법
OS에서 동작 줄이기를 켠 사용자(`prefers-reduced-motion: reduce`)에게는 아래 효과를 끄거나 약하게 하는 것이 좋다. 움직임에 민감한 사용자는 큰 스크롤 효과에 어지러움을 느낄 수 있다.

### 부드러운 스크롤 (Smooth Scroll)
앵커 링크나 버튼으로 이동할 때 한 번에 점프하지 않고 미끄러지듯 이동하게 한다. CSS 한 줄이나 `scrollIntoView` 옵션으로 된다.

```css
html {
  scroll-behavior: smooth;
}
```

```js
document.querySelector('#section2').scrollIntoView({ behavior: 'smooth' });
```

### 스크롤 스냅 (Scroll Snap)
스크롤을 멈추면 가장 가까운 섹션의 시작 위치에 맞춰 멈추게 한다. 풀페이지 섹션이나 가로 카드 슬라이더에 쓴다. 스크롤 컨테이너에 `scroll-snap-type`을, 자식에 `scroll-snap-align`을 준다.

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

### 스크롤 트리거 애니메이션 (Scroll Trigger Animation)
요소가 화면에 들어오는 시점에 애니메이션을 시작한다. 브라우저 기본 API인 IntersectionObserver로 요소가 보이는지 감지하고, 보이면 클래스를 붙인다.

```jsx
const FadeIn = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect(); // 한 번만 실행
      }
    }, { threshold: 0.2 }); // 20% 보이면 실행

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={visible ? 'fade-in' : 'hidden'}>{children}</div>;
};
```

시작 지점이나 진행률 연동처럼 세밀한 제어가 필요하면 GSAP ScrollTrigger를 쓴다. 사용법은 [스크롤 시점에 나타나는 애니메이션](../Libraries/GSAP/ScrollTrigger/02_스크롤%20시점에%20나타나는%20애니메이션.md)에 정리했다.

### 패럴랙스 효과 (Parallax Scrolling)
배경과 전경을 서로 다른 속도로 움직여 깊이감을 주는 효과다. 스크롤 진행률에 애니메이션을 묶는 GSAP ScrollTrigger의 `scrub` 옵션으로 만들 수 있다.

```js
gsap.to('.bg', {
  yPercent: -30, // 스크롤하는 동안 배경을 30%만 올려 전경보다 느리게 보이게 한다
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true, // 스크롤 위치와 애니메이션 진행률을 연결
  },
});
```

### 가속도 기반 스크롤 (Momentum Scrolling)
휠을 멈춰도 스크롤이 바로 서지 않고 관성을 받아 서서히 멈추게 한다. 브라우저 기본 스크롤로는 안 되므로 Lenis 같은 라이브러리가 매 프레임 스크롤 위치를 목표 값까지 보간해서 움직인다.

```js
import Lenis from 'lenis';

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

GSAP ScrollTrigger와 함께 쓰면 두 라이브러리가 보는 스크롤 위치가 어긋날 수 있다. 이때는 Lenis의 스크롤 이벤트에서 `ScrollTrigger.update()`를 호출해 맞춘다.

<br/>


## 페이지 전환시 애니메이션 적용하기
페이지가 전환될 때 부드러운 페이드인/페이드아웃 또는 슬라이드 효과를 추가하려면,
GSAP을 활용한 애니메이션 컴포넌트를 만들고 페이지에 적용하는 것이 좋다.

페이지 전환 애니메이션을 적용하는 방법은 여러 가지가 있지만,
최적의 방법은 Layout 컴포넌트를 만들어 모든 페이지에 적용하는거다.

### GSAP을 활용한 전역 애니메이션 (Layout 컴포넌트 활용)
- PageTransition 컴포넌트를 만들어서 페이지에 fade-in 애니메이션 적용 
- 모든 페이지를 PageTransition으로 감싸기 
- Next.js App Router에서는 `app/template.tsx`에서 감싼다. `layout.tsx`는 페이지를 이동해도 다시 마운트되지 않아 애니메이션이 처음 한 번만 실행되지만, `template.tsx`는 이동할 때마다 새로 마운트되어 전환마다 실행된다.
- Pages Router라면 `_app.tsx`에서 감싼다.