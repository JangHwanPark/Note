## 캐러셀 슬라이드 구현 원리
캐러셀 슬라이드는 수평(X축)으로 아이템을 정렬하고, translateX()를 이용하여 이동하는 방식으로 구현됨.  
애니메이션을 활용하면 부드러운 전환 효과를 추가할 수 있음.

- 슬라이드 아이템을 display: flex로 가로 정렬 
- 부모 컨테이너에 overflow: hidden 적용 → 넘치는 부분 감춤 
- 버튼 클릭 시 transform: translateX(-N%)을 사용해 이동 
- 애니메이션을 추가해 자연스럽게 전환

<br/>

## CSS 구현
CSS만 사용하여 기본적인 캐러셀 슬라이드를 구현할 수 있음.

### 마크업
```html
<div class="carousel-container">
  <div class="carousel-track">
    <div class="carousel-slide">Slide 1</div>
    <div class="carousel-slide">Slide 2</div>
    <div class="carousel-slide">Slide 3</div>
  </div>
  <button class="prev">이전</button>
  <button class="next">다음</button>
</div>
```
### 스타일 적용
```css
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  flex: 0 0 100%; /* 100% 너비 유지 */
}
```
### 이동기능 추가
```js
let currentIndex = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;
const track = document.querySelector(".carousel-track");

document.querySelector(".next").addEventListener("click", () => {
 if (currentIndex < totalSlides - 1) {
  currentIndex++;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
 }
});

document.querySelector(".prev").addEventListener("click", () => {
 if (currentIndex > 0) {
  currentIndex--;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
 }
});
```

<br/>

## GSAP 구현
GSAP을 사용하면 더 부드럽고 자연스러운 애니메이션 효과를 적용할 수 있음.
```tsx
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Carousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const totalSlides = Array.isArray(children) ? children.length : 1;

  useGSAP(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: `-${currentIndex * 100}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden">
      <ul ref={carouselRef} className="flex">
        {children}
      </ul>
      <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}>
        이전
      </button>
      <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1))}>
        다음
      </button>
    </div>
  );
};
```

<br/>

## 무한 캐러셀 구현 원리
무한 캐러셀을 만들려면 "가짜 슬라이드"를 추가하고, 첫 번째 슬라이드로 자연스럽게 되돌리는 기법을 사용해야 함.

- 마지막 슬라이드 뒤에 첫 번째 슬라이드의 복사본을 추가
- 마지막 슬라이드로 이동 후 → setTimeout을 사용해 0번째 슬라이드로 리셋
- GSAP의 set()을 활용해 순간적으로 0번째로 이동하여 깜빡임 방지

```tsx
useGSAP(() => {
  if (carouselRef.current) {
    gsap.to(carouselRef.current, {
      x: `-${currentIndex * 100}%`,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        if (currentIndex === totalSlides) {
          gsap.set(carouselRef.current, { x: "0%" });
          setCurrentIndex(0);
        }
      },
    });
  }
}, [currentIndex]);
```

<br/>

## Tip - 버튼을 정 중앙에 맞추는법
```tsx
<div className="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2">
  <button>이전</button>
  <button>다음</button>
</div>
```
- top-1/2 → 부모 높이의 50% 위치로 이동
- -translate-y-1/2 → 자기 자신의 높이의 50%만큼 위로 이동하여 완벽한 정중앙 배치