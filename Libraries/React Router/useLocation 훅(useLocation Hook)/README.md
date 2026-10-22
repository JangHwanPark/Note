## useLocation 훅이란 ?
- 현재 URL 정보를 담은 location 객체를 돌려주는 React Router 훅
- location에는 `pathname`(경로), `search`(`?` 뒤 쿼리 문자열), `hash`(`#` 뒤), `state`(이동할 때 함께 넘긴 값), `key`(이동 기록마다 붙는 값)가 들어 있다
- URL이 바뀌면 이 훅을 쓴 컴포넌트가 다시 렌더링되어 새 location을 받는다
- 이 문서의 예시는 react-router 7.18.4, React 19.2에서 `MemoryRouter` 로 실행해 확인했다

### 로케이션 (Location)
사전적 의미는 위치, 장소다.
웹에서 location은 지금 보고 있는 페이지의 주소를 말한다. 브라우저의 `window.location` 과 이름이 같다. 차이는 바뀔 때 화면이 따라오느냐다. `window.location` 은 값을 읽기만 하는 객체라 바뀌어도 컴포넌트가 다시 렌더링되지 않지만, `useLocation` 이 돌려준 location은 주소가 바뀌면 그 컴포넌트를 다시 렌더링해 새 값을 넘겨준다.

지도 앱의 현재 위치 표시와 같다. 내가 움직이면 표시가 따라 바뀌고, 화면은 그 위치를 보고 무엇을 보여 줄지 정한다.

<br/>

## useEffect 안에서만 써야 할까
그렇지 않다. `useLocation` 은 훅이므로 컴포넌트 본문 최상위(조건문이나 반복문 밖)에서 부르고, 돌려받은 location은 렌더링 중에 바로 읽어도 된다. URL이 바뀌면 컴포넌트가 다시 렌더링되므로 렌더링 중에 읽은 값도 항상 최신이다.

`useEffect` 가 필요한 경우는 따로 있다. 화면을 그리는 일이 아니라 경로가 바뀐 뒤에 해야 하는 일(로그 보내기, 데이터 요청, 스크롤 위치 되돌리기 등)이 있을 때다. 정리하면 아래와 같다.

- 경로에 따라 화면을 다르게 그릴 때는 렌더링 중에 바로 읽는다
- 경로가 바뀐 뒤 어떤 동작을 해야 할 때는 `useEffect` 의 의존성 배열에 경로를 넣는다

<br/>

## 렌더링 중에 바로 쓰기
현재 경로와 같은 링크에 `active` 클래스를 붙이는 예시다.

```jsx
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav>
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        Home
      </Link>
      <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
        About
      </Link>
    </nav>
  );
};
```

`/` 에서는 Home 링크에, `/about` 으로 이동한 뒤에는 About 링크에 `active` 가 붙는 것을 확인했다.

현재 경로 표시만 필요하다면 `NavLink` 가 더 간단하다. `NavLink` 는 자기 `to` 와 현재 경로가 맞으면 스스로 `active` 클래스를 붙인다. `/about` 으로 이동했을 때 `<NavLink to="/about">` 의 class가 `active` 가 되는 것을 확인했다.

위의 `pathname === ...` 비교와 다른 점이 있다. `NavLink` 는 하위 경로에서도 active가 된다. `/posts/3` 에서 `<NavLink to="/posts">` 는 active였고, `end` 를 붙인 `<NavLink to="/posts" end>` 는 active가 아니었다. `to="/"` 는 예외라서 `/posts/3` 에서 active가 아니었다. 루트 링크가 모든 페이지에서 켜지지 않도록 정확히 `/` 일 때만 맞는다.

<br/>

## useEffect로 경로 변경에 반응하기
```jsx
import { useEffect } from "react";
import { useLocation } from "react-router";

const PageViewLogger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("현재 경로:", location.pathname);
  }, [location.pathname]);

  return <div>현재 경로: {location.pathname}</div>;
};
```

`/` 에서 시작해 `/about` 으로 이동하면 effect가 `/`, `/about` 순서로 두 번 실행됐다(StrictMode 없이). 개발 환경에서 `StrictMode` 로 감싸면 처음 마운트할 때 effect를 한 번 더 실행해서, 첫 경로가 두 번 찍힌다. `/posts/3` 에서 시작했을 때 `/posts/3` 이 두 번 기록되는 것을 확인했다.

의존성에 `location.pathname` 만 넣으면 쿼리 문자열만 바뀌는 이동에는 반응하지 않는다. `/about` 에서 `/about?q=1` 로 이동했을 때 effect가 다시 실행되지 않았다. 검색어처럼 `?` 뒤 값이 바뀔 때도 반응해야 하면 `location.search` 도 의존성에 넣는다.

<br/>

## 참고 자료
- [React Router useLocation](https://reactrouter.com/api/hooks/useLocation)
- [React Router NavLink](https://reactrouter.com/api/components/NavLink)

<br/>

## 더 볼 것 (TODO)
- location.state로 이동할 때 값 넘기기
- 경로가 바뀔 때 스크롤을 맨 위로 되돌리기 (`ScrollRestoration` 은 `createBrowserRouter` 같은 데이터 라우터에서만 쓸 수 있다고 문서에 나와 있어 확인 필요, `<BrowserRouter>` 에서는 useEffect로 직접)
