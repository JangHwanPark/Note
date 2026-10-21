`<React.Fragment>`를 쓰는 것과 `<>` (단축 문법)를 쓰는 것의 가장 큰 차이점은 key 속성을 전달할 수 있는지 여부

## key 속성 사용 여부

### `<React.Fragment key={...}>...</React.Fragment>` (명시적 구문)

- key 속성 전달 가능: 배열을 map() 등으로 순회하며 여러 Fragment를 렌더링할 때, 각 Fragment에 고유한 key를 지정해야 할 경우 이 명시적인 구문을 사용
- React가 리스트의 항목을 효율적으로 식별하고 업데이트하는 데 필요

### `<>...</>` (단축 구문)

- key 속성 전달 불가: 이 단축 구문은 key를 포함한 어떠한 속성도 허용하지 않습니다.

두 구문 모두 DOM에 불필요한 추가 노드(`<div>` 등)를 생성하지 않고 여러 JSX 엘리먼트(자식)를 그룹화하기 위해 사용됩니다. 이는 유효하지 않은 HTML 구조(예: `<table>` 안에 `<div>` 없이 바로 `<td>`를 넣어야 하는 경우)를 피하거나, DOM 구조를 깔끔하게 유지하여 성능 및 스타일 관련 문제를 방지하는 데 도움을 줍니다.

## 왜 Fragment를 사용하는지?
### 불필요한 div 제거
JSX에서는 항상 하나의 부모 요소가 필요한데, div로 감싸면 불필요한 DOM이 생길 수 있다.

### HTML 구조 최적화
`<></>` 또는 `<React.Fragment>`를 사용하면 렌더링할 때 실제 DOM에 추가되지 않음


## 불필요한 `<div>` 제거 예제
불필요한 div가 생김
```js
return (
  <div>
    <h1>제목</h1>
    <p>설명</p>
  </div>
);
```

Fragment를 사용하여 불필요한 div 제거

이렇게 하면 실제 렌더링될 때 `<div>`가 생성되지 않음!
```js
return (
  <>
    <h1>제목</h1>
    <p>설명</p>
  </>
);
```


## key 속성이 필요할 때 (`<>` 사용 불가)
`<>`는 key 속성을 줄 수 없음
```js
return (
  <>
    {items.map((item) => (
      <p key={item.id}>{item.name}</p> // ❌ 오류 발생 가능
    ))}
  </>
);
```

React.Fragment를 사용하면 key를 줄 수 있음
```js
return (
  <React.Fragment key={uniqueKey}>
    {items.map((item) => (
      <p key={item.id}>{item.name}</p>
    ))}
  </React.Fragment>
);
```


## 결론
- `<> </>` → 단순히 여러 요소를 감쌀 때 사용 (더 짧고 간편)
- `<React.Fragment>` → key 속성을 줄 때 필요


map 함수 내에서 Fragment에 key를 추가하는 방법을 보여주는 영상입니다. React: Fragment에 Key를 추가하는 방법을 참고하시면 이 차이점을 더 잘 이해할 수 있습니다.

https://youtu.be/PlFu8_r1FTM?si=xzSLNDhLyoHfPJvk