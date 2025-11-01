useLocation을 useEffect 내부에서만 써야 할까?
❌ 꼭 useEffect 내부에서만 써야 하는 것은 아님.
useLocation은 현재 URL 경로 정보를 가져오는 훅이기 때문에 컴포넌트 렌더링 시점에서 바로 사용할 수도 있음.


useLocation을 사용해야 하는 경우
렌더링 시점에서 URL을 기반으로 UI를 변경해야 할 때

location.pathname을 직접 읽어서 특정 UI를 다르게 렌더링할 때
useEffect 내부에서 URL 변경을 감지하고 특정 동작을 수행해야 할 때

예를 들어, URL이 변경될 때마다 애니메이션 적용, API 요청 등을 실행할 때


useEffect 내부에서 사용하는 경우 (경로 변경 감지)
✔ URL이 변경될 때만 특정 동작을 실행해야 하는 경우
✅ useEffect 내부에서 location.pathname을 감지하여 추가적인 처리가 필요할 때 사용!

📌 예제: URL 변경 시 콘솔 로그 출력
```js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ExampleComponent = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("🔹 현재 경로:", location.pathname);
  }, [location.pathname]); // location.pathname 변경 시 실행

  return <div>현재 경로: {location.pathname}</div>;
};

export default ExampleComponent;
```


렌더링 시점에서 바로 사용하는 경우
✔ URL에 따라 특정 UI를 다르게 렌더링할 때
✅ useEffect 없이 바로 location.pathname을 사용!

📌 예제: 현재 경로에 따라 네비게이션 버튼 강조
```js
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
```
➡️ useEffect 없이도 렌더링 시점에서 location.pathname을 기반으로 UI를 다르게 렌더링 가능!

렌더링 시점에서 URL을 확인하고 UI를 다르게 렌더링해야 한다면 → useEffect 없이 바로 사용
URL이 변경될 때마다 특정 동작(애니메이션, API 요청 등)을 실행해야 한다면 → useEffect 내부에서 사용 ([location.pathname] 감지)