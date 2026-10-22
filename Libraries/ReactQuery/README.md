## React Query란 ?
- 서버에서 가져온 데이터를 브라우저에서 캐싱하고, 다시 가져오고, 화면과 동기화해 주는 라이브러리
- 지금 이름은 TanStack Query이고, React용 패키지는 `@tanstack/react-query` 다. npm 기록으로 보면 `react-query` 패키지는 3.39.3에서 멈췄고, `@tanstack/react-query` 는 4.0.5(2022-07-18)부터 올라와 있어 v4부터 이름이 바뀐 것으로 보인다
- 같은 `queryKey` 로 요청한 데이터는 캐시를 함께 쓴다. 같은 키의 요청이 진행 중이거나 데이터가 `staleTime` 안이면 여러 컴포넌트가 각자 `useQuery` 를 불러도 요청이 다시 나가지 않는다

### 캐시 (Cache)
사전적 의미는 은닉처, 귀중품을 숨겨 두는 곳이다.
공학적으로는 한 번 가져온 데이터를 가까운 곳에 보관해 두고 다음에 다시 쓰는 저장소를 말한다. React Query는 `queryKey` 를 이름표로 서버 데이터를 보관해 두고, 같은 키로 다시 부르면 서버에 묻기 전에 보관해 둔 값을 먼저 내준다. 얼마 동안 보관한 값을 새것으로 볼지는 `staleTime` 으로 정한다(기본값 0).

<br/>

## 목차
- [SSR과 Hydration](./SSR과%20Hydration(SSR%20and%20Hydration)/README.md) : Next.js 페이지에서 prefetch한 캐시를 HydrationBoundary로 넘겨 같은 queryKey로 재사용하는 흐름, staleTime을 0보다 크게 두는 이유, useQueries로 여러 데이터 함께 쓰기

<br/>

## 함께 보면 좋은 노트
- [Next.js에서 React Query 요청 위치 정리(서버 vs 클라이언트)](../../NextJS/React%20Query%20요청%20위치(Where%20to%20Fetch%20with%20React%20Query)) : Next.js의 fetch와 React Query의 역할 차이, 요청을 어디서 보낼지
- [CSR과 SSR](../../NextJS/CSR과%20SSR(CSR%20and%20SSR)) : App Router에서 서버 컴포넌트와 클라이언트 컴포넌트가 렌더링되는 위치

<br/>

## 더 볼 것 (TODO)
- useQuery 기본: queryKey 설계, staleTime과 gcTime의 차이
- useMutation과 invalidateQueries로 변경 후 다시 가져오기
