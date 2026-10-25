## Next.js란 ?
- Next.js는 React로 풀스택 웹 애플리케이션을 만들기 위한 프레임워크다. Vercel이 만들고 관리한다
- 폴더 구조가 곧 URL이 되는 파일 기반 라우팅, 서버에서 화면을 만드는 렌더링, 서버에서 실행되는 데이터 요청을 기본으로 제공한다
- React는 화면을 그리는 라이브러리이고, Next.js는 그 위에 라우팅, 렌더링, 빌드 같은 앱 전체의 틀을 정해 준다

### 프레임워크 (Framework)
사전적 의미는 뼈대, 틀. 건물의 골조처럼 전체 모양을 잡아 주는 구조다.
공학적으로는 앱의 구조와 실행 흐름을 미리 정해 두고, 개발자는 정해진 자리에 코드를 채워 넣는 도구를 말한다. 라이브러리는 내 코드가 필요할 때 불러 쓰지만, 프레임워크는 프레임워크가 내 코드를 정해진 때에 불러 쓴다. Next.js에서 `app` 폴더 안의 `page.tsx` 를 Next.js가 찾아 화면으로 쓰는 것이 이런 예다.

이 폴더는 React 자체가 아니라 Next.js에만 해당하는 기능을 정리한다. React 개념은 [React](../React) 폴더에 둔다.

<br/>

## 목차
- [CSR과 SSR](./CSR과%20SSR(CSR%20and%20SSR)) : 서버 컴포넌트와 클라이언트 컴포넌트, 첫 화면이 만들어지는 과정, 정적 렌더링과 동적 렌더링
- [레이아웃과 props](./레이아웃과%20props(Layout%20and%20Props)) : 레이아웃에서 페이지로 props를 넘길 수 없는 이유와 같은 데이터를 함께 쓰는 방법
- [React Query 요청 위치](./React%20Query%20요청%20위치(Where%20to%20Fetch%20with%20React%20Query)) : Next.js의 fetch와 React Query가 맡는 자리, 요청을 서버와 브라우저 중 어디서 보낼지
- [DTO 설계 기준](./DTO%20설계%20기준(DTO%20Strategy)) : DTO를 타입으로 쓸지 클래스로 쓸지 정하는 기준
- [페이지 전환 애니메이션](./페이지%20전환%20애니메이션(Page%20Transition)) : layout 대신 template.tsx에 애니메이션을 넣는 이유와 다시 마운트되는 조건

<br/>

## 프로젝트 만들기
```bash
npx create-next-app@latest app-name
```

`create-next-app` 16.4.2의 `--help` 기준으로 TypeScript(`--ts`)와 Tailwind CSS(`--tailwind`)는 기본으로 켜져 있어서 따로 적지 않아도 된다. 질문 없이 만들려면 `--yes` 를 붙인다. `--help` 설명은 "Use saved preferences or defaults for unprovided options"라서, 전에 저장해 둔 설정이 있으면 기본값보다 그 값이 먼저 쓰인다. JavaScript로 만들려면 `--js` 를 준다.

<br/>

## 자주 함께 설치하는 라이브러리
아래는 내가 Next.js 프로젝트를 시작할 때 자주 함께 설치한 것이다. 꼭 필요한 목록은 아니다.

- `axios` : HTTP 요청 클라이언트
- `@tanstack/react-query` : 서버 데이터 캐싱과 동기화 ([React Query](../Libraries/ReactQuery))
- `zustand` : 가벼운 전역 상태 관리
- `clsx` : 조건에 따라 className 문자열을 합치는 도구

```bash
npm install axios @tanstack/react-query zustand clsx
```
