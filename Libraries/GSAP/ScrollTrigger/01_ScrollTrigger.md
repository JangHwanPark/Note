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
import {ScrollTrigger} from "gsap/ScrollTrigger";

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

## ScrollTrigger 속성
### 트리거 위치 설정
- **trigger** - 트리거 기준점이 될 DOM 요소 (예: `trigger: ".my-element"`)
- **start** - 트리거 시작 위치. 가능한 값 조합:
    - `"top top"` - 요소 상단이 뷰포트 상단에 닿을 때
    - `"top center"` - 요소 상단이 뷰포트 중앙에 닿을 때
    - `"top bottom"` - 요소 상단이 뷰포트 하단에 닿을 때
    - `"center top"` - 요소 중앙이 뷰포트 상단에 닿을 때
    - `"bottom top"` - 요소 하단이 뷰포트 상단에 닿을 때
    - `"top+=100 center"` - 요소 상단 + 100px이 뷰포트 중앙에 닿을 때
    - `"50% 75%"` - 요소의 50% 지점이 뷰포트의 75% 지점에 닿을 때
- **end** - 트리거 종료 위치 (start와 동일한 값 형식 사용)
- **endTrigger** - 종료 트리거로 사용할 다른 요소 (기본값은 시작 trigger와 동일)

<br/>

### 고정(Pin) 관련 속성
- **pin** - 스크롤 중 요소 고정 (boolean 또는 요소 지정)
- **pinSpacing** - 핀 고정 시 공간 생성 여부 (boolean)
- **pinReparent** - 핀 고정 시 요소의 부모를 변경할지 여부 (boolean)
- **pinType** - 핀 고정 방식 ("fixed" 또는 "transform")

<br/>

### 스크롤 동기화 속성
- **scrub** - 스크롤 위치에 애니메이션 진행 연동
    - `scrub: true` - 스크롤 위치에 즉시 반응
    - `scrub: 1` - 1초 지연으로 부드럽게 따라감
- **snap** - 스크롤 릴리스 시 가까운 지점으로 스냅
    - `snap: 1/4` - 1/4 간격으로 스냅
    - `snap: { snapTo: [0, 0.5, 1], duration: 0.5 }` - 특정 지점으로 스냅

<br/>

### 토글 및 클래스 속성
- **toggleClass** - 활성화 시 클래스 추가/제거
    - `toggleClass: "active"` - 단일 클래스
    - `toggleClass: { targets: ".sidebar", className: "show" }` - 대상 지정
- **toggleActions** - 트리거 진입/퇴장 시 행동 정의 (총 4개 값)
    - 첫 번째 값: 트리거 진입 시 (onEnter)
    - 두 번째 값: 트리거 퇴장 시 (onLeave)
    - 세 번째 값: 트리거 재진입 시 (onEnterBack)
    - 네 번째 값: 트리거 재퇴장 시 (onLeaveBack)
    - 가능한 각 값: "play", "pause", "resume", "reverse", "restart", "reset", "complete", "none"
    - 예: `toggleActions: "play reverse play reverse"`

<br/>

### 디버깅 속성
- **markers** - 개발 시 트리거 지점 표시 (boolean 또는 객체)
    - `markers: true` - 기본 마커 표시
    - `markers: { startColor: "green", endColor: "red", fontSize: "18px" }` - 커스텀 마커

<br/>

### 기타 속성
- **id** - ScrollTrigger의 고유 식별자
- **anticipatePin** - 핀 고정 전 성능 최적화 (숫자, 초 단위)
- **fastScrollEnd** - 빠른 스크롤 시 end 이벤트 처리 방식
- **preventOverlaps** - 여러 트리거 간 충돌 방지
- **horizontal** - 가로 스크롤 감지 (boolean)
- **once** - 트리거가 한 번만 작동하도록 설정 (boolean)

<br/>

### ScrollTrigger 콜백 이벤트
1. **onEnter** - 트리거 영역에 진입할 때 실행
2. **onLeave** - 트리거 영역을 떠날 때 실행
3. **onEnterBack** - 트리거 영역에 뒤로 돌아올 때 실행
4. **onLeaveBack** - 트리거 영역을 뒤로 떠날 때 실행
5. **onUpdate** - 스크롤 위치가 업데이트될 때마다 실행
6. **onToggle** - 활성/비활성 상태가 전환될 때 실행
7. **onRefresh** - 화면 크기 변경 등으로 ScrollTrigger가 새로고침될 때 실행

<br/>

### ScrollTrigger에서 자주 사용되는 특수 값
1. **self.progress** - 트리거 진행률 (0-1)
2. **self.direction** - 스크롤 방향 (-1: 위로, 1: 아래로)
3. **self.isActive** - 트리거가 활성 상태인지 여부 (true/false)
4. **self.getVelocity()** - 현재 스크롤 속도

<br/><br/>

## React에서 GSAP ScrollTrigger 사용
Next.js 및 React에서 사용하려면 useEffect를 활용해야 합니다.

```js
import {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

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

#### GSAP ScrollTrigger 예제 (스크롤 애니메이션)
```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: boxRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      }
    );
  }, []);

  return <div ref={boxRef} className="w-20 h-20 bg-blue-500 mx-auto my-40" />;
}
```
scrollTrigger를 사용하여 스크롤 시 박스가 나타나는 애니메이션
scrub: true → 스크롤 속도에 따라 애니메이션 조정됨

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