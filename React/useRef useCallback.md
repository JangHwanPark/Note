## useMemo vs useCallback 사용 기준
둘 다 React의 메모이제이션 훅이지만, 목적과 사용 시점이 다름.

## useMemo: 값(결과)을 메모이제이션
- 계산량이 많은 함수의 결과를 캐싱하여 성능 최적화 
- 컴포넌트가 리렌더링될 때 불필요한 연산을 방지 
- location.pathname, 데이터 가공, 객체/배열 생성 같은 연산에 사용


### 언제 사용해야 할까?
- 복잡한 연산 결과를 캐싱하여 불필요한 재계산을 막고 싶을 때 
- 객체/배열을 props로 전달할 때 (useEffect의 의존성 변화 방지)
- 이전 값과 비교하여 최적화가 필요할 때


### URL 경로를 한글로 변환하여 캐싱 예제
- location.pathname이 변경될 때만 pathMap을 조회
- 불필요한 pathMap 조회 방지 → 성능 최적화
```js
const pathName = useMemo(() => pathMap[location.pathname] || "페이지 없음", [location.pathname]);
```


### 배열 정렬 캐싱 예제
list가 변경되지 않으면 정렬 연산을 다시 수행하지 않음
```js
const sortedList = useMemo(() => list.sort((a, b) => a.value - b.value), [list]);
```


## useCallback: 함수를 메모이제이션
- 컴포넌트가 리렌더링될 때 동일한 함수를 유지 
- useEffect, props로 함수 전달, 이벤트 핸들러 최적화 시 유용


### 언제 사용해야 할까?
- 자식 컴포넌트에 함수를 props로 전달할 때 useCallback을 사용하지 않으면, 부모가 리렌더링될 때마다 새로운 함수가 생성됨 → 불필요한 리렌더링 발생
- 의존성이 없는 이벤트 핸들러를 최적화할 때 onClick, onChange 같은 이벤트 핸들러가 항상 새로운 함수로 생성되는 걸 방지
- useEffect의 의존성을 최적화할 때 useCallback을 사용하면 useEffect가 필요 이상으로 실행되는 걸 막을 수 있음


### 자식 컴포넌트에 props로 전달하는 이벤트 핸들러 예제
- useCallback이 없으면 부모가 리렌더링될 때마다 새로운 handleClick 함수가 생성됨 
- useCallback을 사용하면 불필요한 함수 재생성 방지 → 자식 컴포넌트 최적화 (React.memo와 함께 사용)
```js
const handleClick = useCallback(() => {
  console.log("클릭됨!");
}, []);

<ChildComponent onClick={handleClick} />;
```

### useEffect의 의존성 줄이기 예제
- useCallback이 없으면 fetchData가 매번 새로 생성되어 useEffect가 계속 실행됨 
- useCallback을 사용하면 함수가 재생성되지 않음 → useEffect의 불필요한 실행 방지
```js
const fetchData = useCallback(async () => {
  const data = await getData();
  setData(data);
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

## 정리: useMemo vs useCallback 언제 쓰는 게 적절할까?
### `useMemo` 사용에 적합한 경우
- 값(배열, 객체, 연산 결과)을 캐싱 → useMemo
- props로 객체/배열을 넘길 때 → useMemo
- 한 번 로드한 데이터를 여러 곳에서 재사용할 때
  - 한 페이지에서 모든 섹션을 출력하는 경우 (useMemo로 URL 매핑을 캐싱하는 것처럼), 대부분 useMemo가 더 적절한 선택이 됨!
- 자식 컴포넌트가 리렌더링될 때마다 불필요한 연산이 반복되지 않도록 값을 캐싱할 때
- 네비게이션, 레이아웃 같은 고정된(변하지 않는) 요소를 저장할 때
- 매번 새로 계산할 필요 없는 데이터를 보관할 때 (예: URL 매핑, 테이블 구조)

### useMemo를 사용하면 좋은 컴포넌트 (주로 값(데이터)을 캐싱하는 컴포넌트)
- 네비게이션 바 (Navbar)
  - URL 매핑을 캐싱하여 네비게이션을 빠르게 렌더링 
- 사이드바(Sidebar)
  - 페이지별 메뉴 리스트를 미리 계산해 캐싱 
- 테이블 컴포넌트 (DataTable)
  - 데이터 필터링, 정렬된 결과를 불필요한 연산 없이 유지 
- 검색 결과 리스트 (SearchResults)
  - 검색 결과 데이터를 가공하여 캐싱 후 여러 곳에서 활용 
- 차트 컴포넌트 (ChartComponent)
  - 복잡한 데이터 가공 후 차트를 그릴 때 연산을 최소화 
- 상품 목록 (ProductList)
  - API에서 받은 데이터를 정렬/필터링하여 캐싱
```js
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
```

### `useCallback` 사용에 적합한 경우
- 함수를 캐싱 → useCallback
- props로 함수를 넘길 때 → useCallback 
- 부모가 리렌더링될 때 자식 컴포넌트에 전달하는 함수가 계속 새로 만들어지는 문제를 막을 때 
- 클릭, 마우스 이동, 드래그 같은 이벤트 핸들러를 저장할 때 
- 애니메이션(GSAP)에서 반복적으로 쓰이는 함수 최적화할 때 
- useEffect에서 의존성 때문에 불필요하게 실행되는 함수 방지할 때 
- 자주 호출되는 함수(API 요청, 사용자 입력 핸들러 등)를 캐싱할 때

### `useCallback`을 사용하면 좋은 컴포넌트 (주로 함수(이벤트 핸들러)를 캐싱하는 컴포넌트)
- 버튼 (Button)
  - 클릭 이벤트 핸들러를 최적화하여 불필요한 재생성 방지
- 폼 (Form)
  - 입력값 변경 핸들러(onChange), 제출 핸들러(onSubmit)를 캐싱
- 애니메이션 컴포넌트 (AnimatedComponent)
  - GSAP 또는 Framer Motion에서 애니메이션 함수 캐싱
- 드래그 앤 드롭 (DragAndDrop)
  - 마우스 드래그 이벤트(onDrag, onDrop) 캐싱
- 리스트 아이템 (ListItem)
  - 개별 리스트 항목에 대한 클릭/마우스 이벤트 핸들러 최적화
- API 호출 버튼 (FetchButton)
  - API 요청 함수(handleFetchData)를 useCallback으로 최적화
```js
const handleClick = useCallback(() => {
  console.log("Button clicked!");
}, []);

```

### useMemo	useCallback
|   | **useMemo** | **useCallback** |
|---|------------|---------------|
| **메모이제이션 대상** | 값 (객체, 배열, 연산 결과) | 함수 |
| **목적** | 연산 최적화 (불필요한 재계산 방지) | 함수 재생성 방지 (불필요한 리렌더링 방지) |
| **주로 사용하는 경우** | - 배열 정렬, 객체 생성, 데이터 가공 캐싱<br>- `props`로 전달하는 객체/배열 최적화 | - `props`로 전달하는 함수 최적화<br>- 이벤트 핸들러 최적화<br>- `useEffect`의 의존성 최소화 |
| **어느 시점에 사용하면 좋을까?** | - 같은 연산을 여러 번 수행해야 할 때<br>- `useEffect`의 의존성을 불필요하게 증가시키는 경우 | - 부모가 리렌더링될 때, 자식 컴포넌트의 함수가 계속 재생성되는 경우<br>- `useEffect`에서 함수 의존성으로 인한 불필요한 실행이 발생할 때 |
| **결론** | ✅ 값(결과) 캐시 → `useMemo`<br>✅ `props`로 객체/배열을 전달하면 `useMemo` 사용 | ✅ 함수 캐시 → `useCallback`<br>✅ `props`로 함수를 전달하면 `useCallback` 사용 |