## 리액트에서 배열에 데이터 추가시 push 금지
리액트에서 기존 배열 수정(push)시 화면이 변경되지 않음.  
기존 데이터를 가져와 스프레드연산자로 펼치고 새 데이터를 뒤에 붙이는식으로
배열을 통으로 줘야함

```ts
// 오류 또는 문제발생
// setData({ newData });
// setData(prev)            // 리렌더 X
// prev.push(newData);      // 같은배열 참조를 그대로 반환(리렌더 X)

// spread 연산자 활용
// 새 배열 생성 → 참조가 바뀜 → 리렌더 O
setData((prev) => [...prev, newData]);
```

<br/>

## setState를 자식 컴포넌트(prop)로 넘길때 타입지정
상태 변경함수를 prop으로 넘길때는 리액트에서 제공하는 Dispatch 및 SetStateAction 타입을 사용해야한다.  

SetStateAction<T>는 내부적으로 `T | ((prev: T) => T)`타입.  
값을 넘기던 함수를 넘기던 둘 다 받을 수 있음
```ts
/**
 * The instruction passed to a {@link Dispatch} function in {@link useState}
 * to tell React what the next value of the {@link useState} should be.
 * Often found wrapped in {@link Dispatch}.
 * @template S The type of the state.
 *
 * @example
 * ```tsx
 * // This return type correctly represents the type of
 * // `setCount` in the example below.
 * const useCustomState = (): Dispatch<SetStateAction<number>> => {
 *   const [count, setCount] = useState(0);
 *
 *   return setCount;
 * }
 */
type SetStateAction<S> = S | ((prevState: S) => S);
```
useState 내의 Dispatch 함수(예: setCount)에 전달되는 지침(Instruction)입니다.  
React에게 useState의 다음 값(next value)이 무엇이 되어야 하는지 알려주기 위해 사용됩니다.  
보통 Dispatch 타입에 감싸진 형태로 자주 발견됩니다. (예: Dispatch<SetStateAction<S>>)  
@template S: 상태(State)의 타입을 나타냅니다.