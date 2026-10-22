## React Router란 ?
- React 앱에서 URL에 따라 보여 줄 화면을 바꿔 주는 라우팅(Routing) 라이브러리
- 페이지를 새로 불러오지 않고 브라우저 안에서 화면을 전환한다
- `useLocation` 같은 훅으로 현재 URL 정보를 컴포넌트에서 읽을 수 있다

### 라우팅 (Routing)
route의 사전적 의미는 길, 경로다. 라우팅은 목적지까지 갈 길을 정하는 일이다.
웹에서는 주소(URL)를 보고 어떤 화면을 보여 줄지 정하는 일을 말한다. `/about` 으로 오면 소개 화면을, `/posts/3` 으로 오면 3번 글 화면을 고르는 식이다.

<br/>

## 패키지 이름 (v6와 v7)
v6까지는 웹에서 `react-router-dom` 을 설치해 썼다. v7부터는 `react-router` 하나로 합쳐졌고, `react-router-dom` 은 옮겨 가는 동안 쓰라고 남겨 둔 패키지다. 7.18.4의 `react-router-dom` 타입 정의를 열어 보면 `react-router` 의 모든 것을 그대로 다시 내보내고(`export * from 'react-router'`), DOM 전용인 `RouterProvider`, `HydratedRouter` 만 `react-router/dom` 에서 가져와 함께 내보낸다. 그래서 v7에서는 `import { useLocation } from "react-router"` 로 쓰고, 이 두 컴포넌트는 `react-router/dom` 에서 가져온다.

<br/>

## 목차
- [useLocation 훅](./useLocation%20훅(useLocation%20Hook)/README.md) : 현재 URL 정보를 읽는 훅, 렌더링 중에 바로 쓰는 경우와 useEffect로 경로 변경에 반응하는 경우, NavLink

<br/>

## 더 볼 것 (TODO)
- 라우트 정의와 중첩 라우트, Outlet
- useNavigate와 useParams, useSearchParams
- 라우팅 패턴: 레이아웃 라우트, 보호된 라우트, 동적 라우트
