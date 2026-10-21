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
- [CSR과 SSR](./CSR과%20SSR) : 서버 컴포넌트와 클라이언트 컴포넌트, 첫 화면이 만들어지는 과정, 정적 렌더링과 동적 렌더링
- [레이아웃 children에 props를 왜 못내릴까](./레이아웃%20children에%20props를%20왜%20못내릴까) : App Router의 layout에서 page로 데이터를 props로 넘길 수 없는 이유
- [Next.js에서 React Query 요청 위치 정리(서버 vs 클라이언트)](./Next.js에서%20React%20Query%20요청%20위치%20정리(서버%20vs%20클라이언트)) : Next.js의 fetch와 React Query를 언제 어디서 쓰는지
- [FullStack DTO 전략(Class vs Interface 의사결정 기준)](./FullStack%20-%20DTO%20전략(Class%20vs%20Interface%20의사결정%20기준)) : 풀스택에서 DTO를 interface/type으로 쓸지 클래스로 쓸지 정하는 기준
- [페이지 전환 애니메이션](./페이지%20전환%20애니메이션(Page%20Transition)) : layout 대신 template.tsx에 애니메이션을 넣는 이유와 다시 마운트되는 조건

<br/>

## Next.js 프로젝트 생성 (npx 사용)
```bash
npx create-next-app@latest app-name --typescript
```

<br/>

## 설치하면 좋은 라이브러리
### axios
```bash
npm install axios
```

### 리액트 쿼리
```bash
npm install @tanstack/react-query
```

### zustand
```bash
npm install zustand
```

### clsx
```bash
npm install clsx
```
