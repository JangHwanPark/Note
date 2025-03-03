## 왜 Fragment를 사용하는지?
### 불필요한 div 제거
JSX에서는 항상 하나의 부모 요소가 필요한데, div로 감싸면 불필요한 DOM이 생길 수 있다.

### HTML 구조 최적화
<></> 또는 <React.Fragment>를 사용하면 렌더링할 때 실제 DOM에 추가되지 않음

### key 속성을 줄 때
<React.Fragment key={uniqueKey}>처럼 key를 설정해야 할 때 <> </> 단축 문법은 사용할 수 없음.


## 불필요한 <div> 제거 예제
불필요한 div가 생김
```js
return (
  <div>
    <h1>제목</h1>
    <p>설명</p>
  </div>
);
```

Fragment를 사용하여 불필요한 div 제거</br>
이렇게 하면 실제 렌더링될 때 <div>가 생성되지 않음!
```js
return (
  <>
    <h1>제목</h1>
    <p>설명</p>
  </>
);
```


## key 속성이 필요할 때 (<> 사용 불가)
<>는 key 속성을 줄 수 없음
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
- <> </> → 단순히 여러 요소를 감쌀 때 사용 (더 짧고 간편)
- <React.Fragment> → key 속성을 줄 때 필요