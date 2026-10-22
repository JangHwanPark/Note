## GSAP이란 ?
- GSAP(GreenSock Animation Platform)은 웹 요소에 애니메이션을 주는 JavaScript 라이브러리
- `to()`, `from()`, `fromTo()` 로 시작과 끝 상태를 정해 움직임을 만든다
- ScrollTrigger 플러그인을 쓰면 스크롤 위치에 맞춰 애니메이션을 실행하거나 요소를 고정할 수 있다
- 이 책의 예시는 gsap 3.15.0, @gsap/react 2.1.2 기준으로 확인했고, 장마다 끝에 확인한 환경을 적었다

<br/>

## 목차
- [00 인터랙션 패턴](./00_인터랙션%20패턴(Interaction%20Patterns)) : 스크롤, 내비게이션, 마우스 조작 같은 인터랙션 패턴과 패턴마다 GSAP 기능과 CSS 중 무엇으로 만드는지
- [01 GSAP 메서드](./01_GSAP%20메서드(GSAP%20Methods)) : to(), from(), fromTo()가 시작 값과 끝 값을 어디서 가져오는지와 각각 어울리는 경우
- [02 이징](./02_이징(Easing)) : in, out, inOut의 뜻과 Power, Back, Elastic, Bounce 계열의 진행률 값 비교, 상황별 이징 고르기
- [03 애니메이션 종류](./03_애니메이션%20종류(Animation%20Types)) : 움직임별 메서드와 속성, repeat와 yoyo, timeline, stagger 순서 문제, 재생 제어 메서드
- [04 시작과 끝에 스타일 바꾸기](./04_시작과%20끝에%20스타일%20바꾸기(Callbacks)) : onStart/onComplete, toggleClass, ScrollTrigger 콜백으로 position 같은 속성을 바꾸는 세 방법과 차이
- [05 깜빡임 효과](./05_깜빡임%20효과(Blink%20Effect)) : `repeat` 와 `yoyo` 로 깜빡이기, Tailwind와 CSS 키프레임 방식과 고르는 기준
- [06 ref와 className](./06_ref와%20className(Ref%20and%20className)) : GSAP에 요소를 ref로 넘길 때와 선택자로 넘길 때의 차이, `scope` 와 StrictMode 정리, 여러 요소에 적용하기
- [07 캐러셀 슬라이드](./07_캐러셀%20슬라이드(Carousel)) : GSAP으로 슬라이드를 움직이고, 복사본 슬라이드로 무한 캐러셀 만들기
- [08 프로그래스 바 애니메이션](./08_프로그래스%20바%20애니메이션(Progress%20Bar%20Animation)) : 진행률 상태가 바뀔 때 `gsap.to()` 로 막대 너비를 채우기
- [09 ScrollTrigger 기본](./09_ScrollTrigger%20기본(ScrollTrigger%20Basics)) : trigger와 start/end, scrub과 toggleActions, 고정 설정과 콜백, React에서 `useGSAP` 으로 쓰기
- [10 스크롤 시점 애니메이션](./10_스크롤%20시점%20애니메이션(Scroll-triggered%20Animation)) : start와 end로 스크롤 구간을 정하고 scrub으로 진행률을 묶는 법, 트리거를 무엇으로 잡을지
- [11 가로 스크롤](./11_가로%20스크롤(Horizontal%20Scroll)) : 섹션을 고정하고 세로 스크롤만큼 목록을 x로 미는 방법, 밀 거리 계산과 화면 크기 변화 대응
- [12 핀 고정](./12_핀%20고정(Pin)) : pin과 pinSpacing의 동작, 고정한 요소 대신 안쪽 요소를 움직이는 이유, anticipatePin과 CSS sticky
- [13 패럴랙스와 관성 스크롤](./13_패럴랙스와%20관성%20스크롤(Parallax%20and%20Smooth%20Scroll)) : ScrollTrigger scrub으로 만드는 패럴랙스, Lenis 관성 스크롤과 ScrollTrigger 함께 쓰기

<br/>

## 더 볼 것 (TODO)
- 캐러셀에서 이전 방향으로도 끝없이 이어지게 하기
- 애니메이션 도중 버튼을 연달아 눌렀을 때 처리하기
- React에서 Lenis를 쓸 때 컴포넌트가 사라지면 `lenis.destroy()` 와 ticker 정리하기
- 여러 겹 레이어에 속도를 다르게 준 패럴랙스
- ScrollTrigger 위치 문법의 상대값(`"top+=20% center"` 같은 표현) 확인
