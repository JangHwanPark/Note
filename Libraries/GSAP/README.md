## GSAP이란 ?
- GSAP(GreenSock Animation Platform)은 웹 요소에 애니메이션을 주는 JavaScript 라이브러리
- `to()`, `from()`, `fromTo()` 로 시작과 끝 상태를 정해 움직임을 만든다
- ScrollTrigger 플러그인을 쓰면 스크롤 위치에 맞춰 애니메이션을 실행하거나 요소를 고정할 수 있다

<br/>

## 목차
- [모던 웹사이트에서 인기 있는 인터랙션 패턴](./00_인터랙션%20패턴(Interaction%20Patterns)/README.md) : 스크롤 기반 패턴 등 자주 쓰이는 인터랙션 종류
- [gsap 메서드](./01_GSAP%20메서드(GSAP%20Methods)/README.md) : to(), from(), fromTo()의 차이와 사용법
- [ease 속성 종류 및 차이점](./02_이징(Easing)/README.md) : Power 계열 등 ease 종류
- [애니메이션 종류](./03_애니메이션%20종류(Animation%20Types)/README.md) : 페이드 인 등 애니메이션 종류와 맞는 GSAP 메서드
- [애니메이션 시작과 종료시 특정 스타일 적용하기](./04_시작과%20끝에%20스타일%20바꾸기(Callbacks)/README.md) : onComplete로 끝난 뒤 스타일 바꾸기
- [깜빡임 효과](./05_깜빡임%20효과(Blink%20Effect)/README.md) : GSAP과 Tailwind @keyframes 방식 비교
- [useRef와 className 차이점](./06_ref와%20className(Ref%20and%20className)/README.md) : React에서 애니메이션 대상을 ref와 className으로 고를 때의 차이, 여러 요소에 같은 애니메이션 적용하기
- [캐러셀 슬라이드](./07_캐러셀%20슬라이드(Carousel)/README.md) : GSAP으로 슬라이드를 움직이고, 복사본 슬라이드로 무한 캐러셀 만들기
- [프로그래스 바 애니메이션](./08_프로그래스%20바%20애니메이션(Progress%20Bar%20Animation)/README.md) : 진행률 상태가 바뀔 때 `gsap.to()`로 막대 너비를 채우기
- [ScrollTrigger](./09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md) : ScrollTrigger 기본 사용법과 예제
- [스크롤 시점에 나타나는 애니메이션](./10_스크롤%20시점%20애니메이션(Scroll-triggered%20Animation)/README.md) : 스크롤 위치에 따라 요소가 변하는 애니메이션
- [가로스크롤](./11_가로%20스크롤(Horizontal%20Scroll)/README.md) : 세로 스크롤로 요소를 좌우로 움직이는 방법
- [핀 고정](./12_핀%20고정(Pin)/README.md) : 스크롤 중 요소를 특정 위치에 고정하는 효과
- [패럴랙스와 관성 스크롤](./13_패럴랙스와%20관성%20스크롤(Parallax%20and%20Smooth%20Scroll)/README.md) : ScrollTrigger scrub으로 만드는 패럴랙스, Lenis 관성 스크롤과 ScrollTrigger 함께 쓰기
