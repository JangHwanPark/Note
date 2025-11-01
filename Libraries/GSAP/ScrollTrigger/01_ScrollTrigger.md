## GSAP ScrollTrigger 기본 사용법 & 예제
- GSAP의 ScrollTrigger를 사용하면 스크롤 기반 애니메이션을 쉽게 구현할 수 있음.
- 요소가 보일 때 애니메이션 실행, 특정 지점에서 고정(Pin), 패럴랙스 효과 등 가능!

<br/><br/>

## ScrollTrigger 기본 옵션
| 옵션            | 설명                                      |
|---------------|-----------------------------------------|
| trigger       | 애니메이션을 실행할 요소 지정 (".box" 등)             |
| start         | 애니메이션이 시작될 스크롤 위치 ("top 80%" 등)         |
| end           | 애니메이션이 끝나는 위치 ("top 30%" 등)             |
| scrub         | true 또는 숫자를 주면 스크롤과 함께 애니메이션 진행         |
| pin           | 요소를 특정 구간 동안 고정 (true 사용)               |
| toggleActions | "play pause resume reverse" 등의 옵션 사용 가능 |
| markers       | true 설정 시 시작점과 끝점 표시 (디버깅용)             |

<br/>

### 기본 예제 : 스크롤 시 이동하는 애니메이션

```js
import gsap from "gsap";
import {ScrollTrigger} from "Libraries/GSAP/ScrollTrigger/01_ScrollTrigger";

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

gsap.to(".box", {
  x: 500, // x축으로 500px 이동
  duration: 2, // 애니메이션 지속시간
  scrollTrigger: {
    trigger: ".box", // 해당 요소가 보이면 실행
    start: "top 80%", // 트리거가 시작될 스크롤 위치 (요소의 top이 뷰포트의 80% 지점에 닿을 때)
    end: "top 30%", // 트리거가 끝나는 지점
    scrub: 1, // 스크롤과 함께 애니메이션이 진행되도록 설정
    markers: true, // 디버깅용 마커 표시
  },
});
```
- trigger: 스크롤에 반응할 요소
- start: 애니메이션이 시작되는 위치 (top bottom, top center 등)
- end: 애니메이션이 끝나는 위치
- scrub: true 또는 숫자(예: 1)를 주면 스크롤에 따라 애니메이션이 조절됨
- markers: true를 설정하면 시작점과 끝점을 확인할 수 있음 (디버깅용)

<br/>

### 다양한 예제
#### 요소 고정 (pin)
```js
gsap.to(".section", {
  scrollTrigger: {
    trigger: ".section",
    pin: true, // 스크롤할 때 고정
    start: "top top",
    end: "+=500", // 500px 동안 고정
    scrub: 1,
  },
});
```

#### 배경색 변경
```js
gsap.to(".bg", {
  backgroundColor: "blue",
  duration: 1,
  scrollTrigger: {
    trigger: ".bg",
    start: "top center",
    end: "bottom top",
    scrub: true,
  },
});
```

#### 여러 요소 순차 애니메이션
```js
gsap.utils.toArray(".item").forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: item,
      start: "top 90%",
      end: "top 70%",
      scrub: 1,
    },
  });
});
```

<br/><br/>

## React에서 GSAP ScrollTrigger 사용
Next.js 및 React에서 사용하려면 useEffect를 활용해야 합니다.

```js
import {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "Libraries/GSAP/ScrollTrigger/01_ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    gsap.to(".box", {
      x: 300,
      scrollTrigger: {
        trigger: ".box",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    });
  }, []);
  
  return (
    <div style={{height: "200vh", padding: "50px"}}>
      <div className="box" style={{width: "100px", height: "100px", background: "red"}}></div>
    </div>
  );
}
```

<br/>

#### ScrollTrigger와 GSAP Timeline 연동
GSAP timeline을 사용하면 여러 개의 애니메이션을 순차적으로 실행할 수 있습니다.
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
});

tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { x: 200, duration: 1 })
  .to(".box3", { x: 300, duration: 1 });
```

#### ScrollTrigger를 활용한 Parallax 효과
```js
gsap.to(".parallax", {
  y: -200,
  scrollTrigger: {
    trigger: ".parallax",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});
```
요소가 스크롤될 때 배경이 천천히 움직이는 패럴랙스 효과 적용