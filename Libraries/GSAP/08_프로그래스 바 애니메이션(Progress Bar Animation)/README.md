## GSAP으로 막대 채우기
- 프로그래스 바의 안쪽 막대가 차오르는 움직임을 CSS `transition` 대신 GSAP 트윈으로 그리는 방법
- 진행률은 React 상태로 두고, 상태가 바뀔 때마다 `gsap.to()` 로 막대의 `width` 를 새 값까지 움직인다
- 막대의 구조와 접근성 속성은 [React 프로그래스 바](../../../React/UI%20컴포넌트%20만들기(Building%20UI%20Components)/프로그래스%20바(Progress%20Bar)/README.md)에 정리했다

<br/>

## 구현
CSS `transition` 으로도 막대는 부드럽게 찬다. GSAP을 쓰면 `ease` 를 골라 차오르는 느낌을 바꾸거나, 다 찬 뒤에 다른 애니메이션을 이어 붙이기 쉽다.

```tsx
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GsapProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: "power1.out",
      });
    },
    { dependencies: [progress] } // progress가 바뀔 때마다 다시 실행
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full bg-gray-300 rounded-full h-4 relative">
        <div ref={barRef} className="absolute left-0 top-0 bg-blue-500 h-4 rounded-full" style={{ width: "0%" }} />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setProgress((prev) => Math.min(prev + 20, 100))}
      >
        진행
      </button>
    </div>
  );
};

export default GsapProgressBar;
```

진행 버튼을 누르면 `progress` 가 20씩 오르고, `useGSAP` 이 `dependencies` 로 그 변화를 받아 막대의 `width` 를 0.5초 동안 새 값까지 늘린다. 막대의 너비는 React가 아니라 GSAP이 바꾸므로, `style` 의 `width: "0%"` 는 처음 한 번의 시작값으로만 쓰인다.

이 예시는 움직임만 보이려고 접근성 속성을 뺐다. 실제로 쓸 때는 바깥 막대에 `role="progressbar"`, `aria-valuenow`, `aria-label` 을 붙인다. 이유는 React 프로그래스 바 노트의 접근성 속성 부분에 정리했다.

`useEffect` 로 같은 일을 하면 정리 함수가 없어 StrictMode에서 트윈이 두 번 만들어지고, 컴포넌트가 사라진 뒤에도 트윈이 남을 수 있다. `useGSAP` 은 컴포넌트가 사라질 때 만든 트윈을 정리해 준다. 이유는 [ref와 className](../06_ref와%20className(Ref%20and%20className)/README.md)의 StrictMode 부분에 정리했다.

gsap 3.15.0, `@gsap/react` 2.1.2, React 19.2를 jsdom에서 실행해 progress를 20으로 바꾸고 0.7초 뒤 막대의 `width` 가 `20%` 가 된 것을 확인했다.

<br/>

[목차](../README.md) | [이전 장: 캐러셀 슬라이드](../07_캐러셀%20슬라이드(Carousel)/README.md) | [다음 장: ScrollTrigger 기본](../09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md)
