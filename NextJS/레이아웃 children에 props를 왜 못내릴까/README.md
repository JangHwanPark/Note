## 궁금했던점
레이아웃을 사용하면 children 부분에 페이지(page.tsx)가 렌더링 되는데 레이아웃단에서 데이터를 받아 children 으로 데이터를 props로 내릴수있는지가 궁금했다.

찾아보니까 결론적으로 안되는거같다. Next.js App Router의 서버 컴포넌트 layout.tsx에서 page.tsx로 children 외의 다른 props(데이터)를 직접 전달할 수 없다고 한다.

### 왜 안될까?
리액트 자체에는 레이아웃이나 페이지라는 정해진 개념이 없고 UI를 만들기 위한 컴포넌트 라이브러리다. 일반적으로 리액트는 부모컴포넌트가 자식컴포넌트를 직접 랜더링하면서 props를 넘겨준다.
```js
// React
function Layout() {
  const role = "admin";
  // Page를 직접 렌더링하며 props를 넘김
  return <Page role={role} />;
}
```
하지만 Next.js App Router의 레이아웃과 페이지의 관계는 다르다. 레이아웃은 페이지를 소유하거나 렌더링하지 않는다. (부모 자식관계가 아니다.)

Next.js 프레임워크가 페이지를 먼저 렌더링하고 렌더링 결과를 레이아웃의 `children`의 `props`으로 끼워넣는다.