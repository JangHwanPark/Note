## useMemo와 useCallback이란 ?
- 컴포넌트가 다시 렌더링될 때 이전 렌더링에서 만든 것을 다시 쓰게 해 주는 React의 메모이제이션 훅
- `useMemo` 는 계산한 값을, `useCallback` 은 함수 자체를 기억한다
- 둘 다 성능 최적화용이다. 이 훅이 없으면 동작이 틀어지는 코드라면 최적화가 아니라 다른 문제를 먼저 고쳐야 한다

### 메모이제이션 (Memoization)
메모(memo)는 잊지 않으려고 적어 두는 짧은 글이다.
공학적으로 메모이제이션은 같은 입력으로 다시 계산할 일이 생기면 계산하지 않고 적어 둔 결과를 돌려주는 기법을 말한다. React에서는 입력 대신 의존성 배열을 보고, 의존성이 지난 렌더링과 같으면 적어 둔 값이나 함수를 그대로 돌려준다.

시험 문제의 답을 노트에 적어 두는 것과 같다. 같은 문제가 다시 나오면 풀지 않고 노트를 본다. 문제가 바뀌면(의존성이 바뀌면) 다시 푼다.

<br/>

## 왜 필요할까
컴포넌트 함수는 렌더링될 때마다 처음부터 다시 실행된다. 그래서 그 안에서 만든 값과 함수도 매번 새로 만들어진다.

대부분은 문제가 되지 않는다. 문제가 되는 것은 두 경우다. 하나는 계산 자체가 느린 경우다. 다른 하나는 매번 새로 만든 객체, 배열, 함수를 다른 곳에서 지난번 값과 같은지 비교하는 경우다. React는 props와 의존성을 `Object.is` 로 비교하는데, 내용이 같아도 새로 만든 객체나 함수는 다른 것으로 본다. 그러면 `memo` 로 감싼 자식(props가 지난번과 같으면 렌더링을 건너뛰는 컴포넌트, 아래에서 다룬다)이 다시 렌더링되고, 그 값을 의존성으로 쓰는 `useEffect` 가 다시 실행된다.

<br/>

## useMemo: 값을 기억한다
의존성이 바뀌지 않으면 계산 함수를 다시 실행하지 않고 지난번 결과를 돌려준다.

```tsx
const sortedList = useMemo(() => [...list].sort((a, b) => a - b), [list]);
```

`list` 가 같은 배열이면 정렬을 다시 하지 않는다. `[3, 1, 2]` 를 받은 컴포넌트를 상관없는 상태 변경으로 두 번 더 렌더링해 보면, 화면은 `1,2,3` 이고 정렬 함수는 처음 한 번만 실행됐다.

아래처럼 객체에서 값 하나를 꺼내는 계산은 기억해 둘 만큼 비싸지 않다. 이런 계산은 그냥 쓰는 편이 읽기 쉽다.

```tsx
// 객체 조회 한 번이라 useMemo의 이득이 거의 없다
const pathName = useMemo(() => pathMap[location.pathname] || "페이지 없음", [location.pathname]);
```

React 공식 문서는 수천 개의 객체를 만들거나 순회하는 게 아니면 대개 비싸지 않다고 본다. `console.time` 으로 재 봐서 1ms 이상 걸릴 때 메모이제이션을 고려하라고 한다.

<br/>

## useCallback: 함수를 기억한다
의존성이 바뀌지 않으면 지난번에 만든 함수를 그대로 돌려준다. `useMemo(() => fn, deps)` 와 같은 일을 함수에 맞게 줄여 쓴 것이다.

```tsx
const handleClick = useCallback(() => {
  console.log("클릭");
}, []);
```

### useCallback만으로는 자식이 다시 렌더링된다
`useCallback` 은 함수를 같은 것으로 유지할 뿐이다. 자식 렌더링을 건너뛰게 하는 것은 `memo` 이고, `memo` 는 props가 지난번과 같을 때만 건너뛴다. 그래서 둘을 함께 써야 효과가 있다.

```tsx
const MemoChild = memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log("클릭"), []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>부모 {count}</button>
      <MemoChild onClick={handleClick} />
    </>
  );
}
```

부모 버튼을 두 번 눌러 부모를 두 번 더 렌더링하고, 자식이 몇 번 렌더링됐는지 세어 봤다(React 19.2, StrictMode 없이). StrictMode 개발 환경에서는 렌더링을 두 번씩 해서 숫자가 달라진다.

| 자식 | 넘긴 함수 | 자식 렌더링 횟수 |
| --- | --- | --- |
| 그냥 컴포넌트 | 매번 새 함수 | 3 |
| 그냥 컴포넌트 | `useCallback` | 3 |
| `memo` 로 감쌈 | 매번 새 함수 | 3 |
| `memo` 로 감쌈 | `useCallback` | 1 |

`memo` 없이 `useCallback` 만 쓰면 자식은 부모와 함께 매번 렌더링된다. 반대로 `memo` 만 쓰고 함수를 매번 새로 만들면 props가 달라졌다고 보고 역시 렌더링된다. 둘 다 있을 때만 처음 한 번으로 끝났다.

### useEffect 의존성에 함수가 들어갈 때
effect 안에서 쓰는 함수를 컴포넌트에 두면 그 함수가 의존성에 들어가고, 매 렌더링마다 새 함수라 effect도 매번 실행된다. `useCallback` 으로 감싸면 막을 수 있다.

```tsx
const fetchData = useCallback(async () => {
  const data = await getData();
  setData(data);
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

다만 그 함수를 effect에서만 쓴다면 함수를 effect 안으로 옮기는 편이 더 간단하다. 그러면 의존성에 함수가 들어가지 않는다.

```tsx
useEffect(() => {
  const fetchData = async () => {
    const data = await getData();
    setData(data);
  };
  fetchData();
}, []);
```

<br/>

## 언제 쓰면 효과가 있을까
React 공식 문서는 메모이제이션이 효과 있는 경우를 아래 세 가지로 정리한다.

1. 계산이 눈에 띄게 느리고 의존성은 잘 바뀌지 않을 때 (`useMemo`)
2. `memo` 로 감싼 컴포넌트에 props로 넘길 때 (객체와 배열은 `useMemo`, 함수는 `useCallback`)
3. 그 값이나 함수를 다른 훅의 의존성으로 쓸 때 (`useEffect`, 다른 `useMemo` 나 `useCallback`)

그 밖의 경우에는 이득이 없다. 크게 해가 되지도 않지만 코드가 읽기 어려워진다. 그래서 어떤 컴포넌트인지보다 위 세 경우에 해당하는지로 정한다.

### React Compiler
React Compiler는 빌드할 때 컴포넌트와 훅을 분석해 메모이제이션을 자동으로 넣어 주는 도구다. 2025년 10월 7일 1.0이 첫 안정 버전으로 나왔다. 컴파일러를 쓰는 프로젝트라면 `useMemo`, `useCallback`, `memo` 를 직접 쓸 일이 크게 줄어든다.

<br/>

## 참고 자료
- [React 공식 문서: useMemo](https://react.dev/reference/react/useMemo)
- [React 공식 문서: useCallback](https://react.dev/reference/react/useCallback)
- [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)

<br/>

## 더 볼 것 (TODO)
- `memo` 가 props를 비교하는 방식과 비교 함수 직접 넘기기
- React Compiler 설정과 기존 코드에 점진적으로 적용하기
- 리렌더링이 일어나는 조건 전체 정리 (리렌더링과 최적화)
