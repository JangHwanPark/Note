## 가로 스크롤이란 ?
- 사용자는 평소처럼 세로로 스크롤하는데, 화면에서는 항목들이 왼쪽으로 지나가는 효과
- 섹션을 화면에 고정(`pin`)해 두고, 세로로 스크롤한 양만큼 안쪽 목록을 `x` 로 왼쪽으로 민다
- 포트폴리오의 작업 목록처럼 가로로 길게 늘어선 카드를 보여 줄 때 많이 쓴다

### 가로 스크롤 (Horizontal Scroll)
horizontal의 사전적 의미는 수평의, 가로의다.
여기서 말하는 가로 스크롤은 브라우저의 진짜 가로 스크롤바를 쓰는 것이 아니다. 세로 스크롤 입력을 가로 움직임으로 바꿔 보여 주는 연출이다. 러닝머신 위에서 걷는 것과 같다. 사람(섹션)은 제자리에 있고 발밑(목록)만 뒤로 지나간다.

<br/>

## 왜 필요할까
가로로 긴 목록을 가로 스크롤바로 두면, 마우스 휠을 그냥 굴렸을 때 페이지는 세로로만 움직이고 목록은 가로로 움직이지 않는다. 목록을 넘기려면 트랙패드로 옆으로 밀거나, 브라우저에 따라 Shift를 누른 채 휠을 굴려야 한다. 세로 스크롤을 가로 움직임으로 바꾸면 평소처럼 휠만 굴려도 목록 끝까지 볼 수 있다.

<br/>

## 동작
1. 섹션을 `pin: true` 로 고정한다. 고정된 동안 섹션은 화면에 붙어 있고, 스크롤은 계속 쌓인다
2. 목록을 왼쪽으로 밀 거리는 목록 전체 너비에서 섹션 너비를 뺀 값이다. 그만큼만 밀어야 마지막 항목이 화면 오른쪽 끝에 딱 맞는다
3. `end: "+=거리"` 로 고정 구간 길이를 같은 거리로 잡는다. 스크롤 1px이 가로 이동 1px이 되어 손으로 끄는 느낌이 난다
4. `scrub` 으로 이동을 스크롤 위치에 묶고 `ease: "none"` 으로 일정하게 움직이게 한다

섹션 높이를 직접 늘릴 필요는 없다. `pin` 을 쓰면 ScrollTrigger가 고정 구간 길이만큼 아래쪽에 여백(`pinSpacing`)을 자동으로 넣어 다음 내용을 밀어 낸다(공식 문서 pinSpacing 항목). 섹션 높이를 `화면 높이 + 이동 거리` 로 직접 늘리고 `pin` 까지 쓰면 이 여백이 한 번 더 붙어, 목록이 다 지나간 뒤에도 빈 스크롤이 남는다.

거리는 숫자로 한 번 계산해 두지 말고 함수로 넘긴다. 화면 크기가 바뀌면 ScrollTrigger가 위치를 다시 계산하는데, 이때 함수로 준 `end` 는 다시 불린다. `x` 처럼 애니메이션 값까지 다시 계산하려면 `invalidateOnRefresh: true` 를 함께 준다(공식 문서 end, invalidateOnRefresh 항목).

<br/>

## 예시 코드
```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5", "Project 6"];

const HorizontalProjects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      // 목록 전체 너비에서 섹션 안쪽 너비를 뺀 만큼이 밀어야 할 거리
      // window.innerWidth는 세로 스크롤바 너비까지 포함하므로 섹션의 clientWidth로 잰다
      const distance = () => Math.max(0, list.scrollWidth - (sectionRef.current?.clientWidth ?? 0));

      gsap.to(list, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`, // 가로 이동 거리만큼 세로로 스크롤하는 동안 고정
          scrub: 1, // 1초에 걸쳐 스크롤 위치를 따라잡는다
          pin: true, // trigger인 섹션을 고정한다
          invalidateOnRefresh: true, // 화면 크기가 바뀌면 x 값도 다시 계산한다
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden bg-green-100">
      <h2>My Work</h2>
      <ul ref={listRef} className="flex w-max">
        {projects.map((name) => (
          <li key={name} className="w-[300px] shrink-0 p-8">
            <h3>{name}</h3>
            <p>Category</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HorizontalProjects;
```

`className` 은 Tailwind CSS 클래스다. 목록에 `w-max`, 항목에 `shrink-0` 을 준 이유는 flex 항목이 기본으로 부모 너비에 맞춰 줄어들기 때문이다(`flex-shrink: 1`). 그대로 두면 300px짜리 항목 여섯 개가 화면 너비 안으로 눌려 들어가 `scrollWidth` 가 섹션 너비와 같아지고, 밀 거리가 0이 된다. 목록이 섹션보다 짧을 때 음수로 밀리지 않도록 `Math.max(0, ...)` 로 막았다.

고정한 섹션(`sectionRef`)이 아니라 그 안의 목록(`listRef`)을 움직인다는 점도 중요하다. 공식 문서는 고정한 요소 자체를 애니메이션하면 위치 계산이 틀어지니 그 안쪽 요소를 움직이라고 안내한다(pin 항목).

<br/>

## 참고 자료
- [GSAP 공식 문서: ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) (end, pin, pinSpacing, invalidateOnRefresh 항목)
- 예시 코드는 gsap 3.15.0, @gsap/react 2.1.2, @types/react 19.3, TypeScript 5.6 `strict` 로 타입 검사만 했다. 브라우저에서 실제 움직임과 여백은 확인하지 않았다(브라우저 확인 필요).

<br/>

[목차](../README.md) | [이전 장: 스크롤 시점 애니메이션](../10_스크롤%20시점%20애니메이션(Scroll-triggered%20Animation)/README.md) | [다음 장: 핀 고정](../12_핀%20고정(Pin)/README.md)
