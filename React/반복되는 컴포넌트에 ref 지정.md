## map 함수를 사용해 반복되는 컴포넌트에 ref 지정하기
직접적인 방법으로는 map 함수를 사용해 반복되는 컴포넌트에 ref를 지정할 수 없다.

map 함수는 각 요소에 대해 새로운 컴포넌트를 생성하지만 ref 는 특정 DOM 노드의 대한
참조를 저장하므로, map의 각 반복에서 생성되는 여러 컴포넌트에 동시에 ref를 할당하는건 
불가능 하다.

map 내부에서 ref를 할당하려면 useRef 훅과 콜백함수를 사용해 각 컴포넌트에 대한 참조를 저장해야한다.

---

## React useRef와 map 내부 ref 할당 시 타입 오류 해결
`TS2322: Type 'HTMLLIElement' is not assignable to type 'never'`와 같은 타입 오류가 발생하는 이유는 `contentRef.current`가 초기에는 빈 배열로 선언되어 `TypeScript`가 그 안에 어떤 타입의 요소가 들어갈지 추론할 수 없기 때문에 발생한다.

즉, `useRef([])`는 `RefObject<never[]>`로 추론되어 `contentRef.current[index]`에 `HTMLLIElement`를 할당하려고 할 때 never 타입에 할당할 수 없다고 판단하기 때문이다.

문제 해결 방법: useRef 타입 명시
이 문제를 해결하려면 useRef를 선언할 때, 배열 안에 어떤 타입의 DOM 요소가 들어갈지 명시적으로 알려줘야한다.

```tsx
import React, { useRef } from 'react';

// FeatureItem props의 타입을 정의
interface FeatureItemProps {
  index: number;
  image: string;
  title: string;
  subTitle: string;
  description: string;
}

const HomeFeatureItem = ({
  index,
  image,
  title,
  subTitle,
  description
}: FeatureItemProps) => {
  // ✅ 핵심: useRef에 HTMLLIElement 배열임을 명시
  // <HTMLLIElement[]>는 useRef 훅이 HTMLLIElement 타입의 객체들을 담는 배열을
  // current 속성으로 가질 것이라고 TypeScript에 알려줌
  // 타입 힌트를 주면, TypeScript는 contentRef.current[index]에 
  // HTMLLIElement를 할당하는 것을 올바른 타입으로 인식한다.
  const contentRef = useRef<HTMLLIElement[]>([]);

  return (
    <li
      {/* ref 콜백 함수는 인자로 해당 DOM 요소(el)를 받는데, */}
      {/* 이 el은 DOM 요소이거나 컴포넌트가 언마운트될 때는 null이 될 수 있다. */}
      {/* 따라서 HTMLLIElement | null로 타입을 명시하는 것이 좋다. */}
      ref={(el: HTMLLIElement | null) => { // 콜백 함수의 el 타입도 명시적으로 지정
        if (el) {
          contentRef.current[index] = el;
        }
      }}
      className={`mt-56 flex items-center text-center gap-10 ${index === 1 && "flex-row-reverse"}`}
    >
      <img
        src={image}
        alt={title + ' 이미지'}
        className='h-32 w-32 object-contain md:h-[180px] md:w-[180px] lg:h-[300px] lg:w-[300px]'
      />
      <div className='text-left'>
        <h3 className='text-lg font-semibold md:text-2xl lg:text-4xl'>
          {title}
        </h3>
        <h4 className='text-xl mt-3'>{subTitle}</h4>
        <p className='mt-5 text-sm text-gray-600 md:text-base lg:text-lg'>
          {description}
        </p>
      </div>
    </li>
  );
};

export default HomeFeatureItem;
```