## React Query란 ?
- 서버에서 가져온 데이터를 브라우저에서 캐싱하고, 다시 가져오고, 화면과 동기화해 주는 라이브러리
- 지금 이름은 TanStack Query이고, React용 패키지는 `@tanstack/react-query` 다
- 같은 `queryKey` 로 요청한 데이터는 캐시를 함께 써서 여러 컴포넌트가 각자 `useQuery` 를 불러도 요청이 중복되지 않는다

<br/>

## 목차
- [React Query SSR + Hydration 정리](./SSR과%20Hydration(SSR%20and%20Hydration)/README.md) : Next.js 서버 컴포넌트에서 prefetch한 데이터를 클라이언트에서 같은 queryKey로 재사용하는 흐름과 폴더 구조 예시

<br/>

## 함께 보면 좋은 노트
- [Next.js에서 React Query 요청 위치 정리(서버 vs 클라이언트)](../../NextJS/Next.js에서%20React%20Query%20요청%20위치%20정리(서버%20vs%20클라이언트)) : Next.js의 fetch와 React Query의 역할 차이, 요청을 어디서 보낼지
- [CSR과 SSR](../../NextJS/CSR과%20SSR) : App Router에서 서버 컴포넌트와 클라이언트 컴포넌트가 렌더링되는 위치
