## useRef 를 언제 배열로 관리해야할까?
리액트에서 gsap 애니메이션 적용시, 클래스를 사용해도 되지만, 이는 리액트 상태관리 방법과는 맞지 않는다.

useRef 를 사용하여 캐러셀(slider), 리스트 아이템, 카드 UI 등과 같이 여러 개의 요소에 개별적으로 애니메이션을 적용해야 하는 경우, 각 요소를 useRef 배열로 관리하는 것이 더욱 적절하다.

<br/>

## useRef 배열로 관리하는법
여러 개의 요소를 useRef를 활용해 배열로 저장하려면, 초기에는 빈 배열을 생성하고, 각 요소를 순회하면서 해당 ref를 개별적으로 할당해야 한다.
```tsx
import { useRef, useEffect } from "react";
import gsap from "gsap";

const AnimatedList = () => {
  const itemsRef = useRef([]); // useRef 배열 선언

  useEffect(() => {
    gsap.to(itemsRef.current, {
      opacity: 1,
      y: -20,
      stagger: 0.2, // 순차적으로 애니메이션 적용
      duration: 1,
    });
  }, []);

  return (
      <div>
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                ref={(el) => (itemsRef.current[i] = el)} // 요소를 개별적으로 배열에 저장
                className="item"
                style={{ opacity: 0 }}
            >
              Item {i + 1}
            </div>
        ))}
      </div>
  );
};

export default AnimatedList;
```
| 상황                              | 설명                                                                                   |
|-----------------------------------|---------------------------------------------------------------------------------------|
| 캐러셀(슬라이더) 애니메이션       | 여러 개의 슬라이드에 개별적으로 애니메이션 적용해야 할 때                              |
| 리스트(그리드) 애니메이션         | 반복되는 리스트 항목에 순차적인 효과(stagger)를 주고 싶을 때                           |
| 개별적인 요소를 직접 조작할 때     | 특정 요소만 선택해서 애니메이션을 적용해야 할 때                                       |
| 클래스로 요소를 선택할 수 없을 때 | gsap.utils.toArray(".class")를 사용하면 React의 상태 변화 시 예상치 못한 동작이 발생할 가능성이 있을 때 |

<br/>

GSAP에서 여러 개의 요소에 동일한 애니메이션을 적용할 때, GSAP의 utils 메서드를 사용하는 경우와 직접 이벤트를 등록하는 경우의 차이는 다음과 같다.

## GSAP.utils.toArray()를 사용하는 경우
GSAP의 utils.toArray()는 선택자로 가져온 여러 요소를 배열로 변환해주며, 이를 활용하면 gsap.to() 등의 애니메이션을 한 번에 적용할 수 있다.
```tsx
import gsap from "gsap";

const elements = gsap.utils.toArray(".box"); // 여러 개의 요소를 배열로 변환
gsap.to(elements, {
  opacity: 1,
  y: -50,
  stagger: 0.2, // 요소 간 간격을 주면서 애니메이션 적용
  duration: 1,
});
```
- utils.toArray()는 NodeList를 배열로 변환하여 쉽게 반복문을 돌릴 수 있음 '
- stagger 옵션을 활용하면 각 요소를 순차적으로 애니메이션 적용 가능
- 같은 애니메이션을 단순하게 여러 요소에 적용할 때 적합

<br/>

## 직접 forEach() 또는 addEventListener를 사용하는 경우
요소를 직접 순회하며 각 요소마다 개별적으로 gsap.to()를 적용하는 방법
```tsx
const boxes = document.querySelectorAll(".box");

boxes.forEach((box) => {
  box.addEventListener("mouseenter", () => {
    gsap.to(box, { scale: 1.2, duration: 0.3 });
  });

  box.addEventListener("mouseleave", () => {
    gsap.to(box, { scale: 1, duration: 0.3 });
  });
});
```
- 각 요소별로 개별 이벤트 적용 가능 
- mouseenter, mouseleave 같은 상호작용 기반 애니메이션을 만들 때 유용 
- utils.toArray() 방식보다 유연하지만 코드가 길어질 수 있음

<br/>

## useRef와 a[index] = el 방식
React에서는 useRef를 사용해 DOM 요소를 직접 참조할 수 있습니다. 여러 개의 요소를 배열로 관리하려면 빈 배열을 선언한 후 개별적으로 요소를 할당할 수 있다.
```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

const MyComponent = () => {
  const boxesRef = useRef([]); // 빈 배열 선언

  useEffect(() => {
    gsap.to(boxesRef.current, {
      opacity: 1,
      y: -50,
      stagger: 0.2,
      duration: 1,
    });
  }, []);

  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (boxesRef.current[i] = el)} // 개별적으로 참조 추가
          className="box"
        >
          Box {i + 1}
        </div>
      ))}
    </div>
  );
};
```
- useRef를 사용하여 boxesRef.current[i] = el 방식으로 개별 요소를 직접 할당 
- boxesRef.current 배열에 undefined 값이 들어갈 수 있어 초기화를 잘 관리해야 함
- React의 렌더링과 관계없이 유지되므로, 애니메이션 적용 시 효율적 
- 특정 순서를 보장할 수 있음 (index를 명시적으로 관리)