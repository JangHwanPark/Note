리액트 쿼리를 NextJS에서 사용하는 팀프로젝트가 많았다. 이걸 사용하다보면 Next.js에도 캐시가 붙은 fetch가 있는데 React Query를 왜 같이 쓰는지, 요청을 서버와 클라이언트 중 어디서 보내야 하는지 헷갈린다.

## Next.JS는 향상된 fetch를 지원하는데 왜 ReactQuery를 사용할까?
- Next.js의 향상된 fetch()는 `서버 중심 데이터 패칭`용
- React Query는 `클라이언트 상태 관리 + 실시간 갱신`용

용도 자체가 달라서 보완 관계다. React Query는 단순히 `use client 대응`이라기보단 브라우저에서 서버 데이터를 캐싱하고, 다시 가져오고, 자동으로 동기화해 주는 상태 관리 도구다. 클라이언트 컴포넌트도 첫 화면은 서버에서 HTML로 만들어지므로 클라이언트 컴포넌트를 CSR 환경이라고 부르지는 않는다. 자세한 내용은 [CSR과 SSR](../CSR과%20SSR)에 정리했다.

## Next.js의 향상된 fetch()가 하는 일
Next.js는 서버에서 실행되는 fetch()에 캐시와 재검증 옵션을 덧붙였다. 서버 컴포넌트에서 데이터를 가져올 때 결과를 서버의 데이터 캐시에 저장할지, 얼마 뒤에 다시 가져올지를 요청마다 정할 수 있다.

```ts
// 캐시해 두고 재사용
await fetch(url, { cache: 'force-cache' });

// 매 요청마다 새로 가져오기
await fetch(url, { cache: 'no-store' });

// 60초가 지나면 다시 가져오기
await fetch(url, { next: { revalidate: 60 } });

// 태그를 달아 두고, 데이터가 바뀌면 revalidateTag로 이 태그의 캐시를 무효화
await fetch(url, { next: { tags: ['posts'] } });
```

한 번 렌더링하는 동안 같은 URL과 옵션으로 보낸 GET 요청은 실제로 한 번만 나가고 나머지는 그 결과를 공유한다(Request Memoization). 그래서 여러 서버 컴포넌트가 같은 데이터를 각자 fetch해도 요청이 중복되지 않는다.

Next.js 15부터는 fetch 결과가 기본으로 캐시되지 않는다. 캐시가 필요하면 위처럼 cache나 revalidate를 직접 지정한다.

이 기능은 모두 서버에서만 동작한다. 브라우저에서 호출한 fetch는 일반 fetch와 같으므로, 클라이언트 쪽 캐싱과 재요청은 React Query가 맡는다.


## React Query의 역할 (클라이언트 중심)
Next.js의 fetch가 끝나는 지점, 즉 브라우저에 화면이 뜬 뒤의 데이터를 React Query가 맡는다.

- 같은 `queryKey` 로 요청한 데이터를 브라우저 캐시에 두고 여러 컴포넌트가 함께 쓴다
- 데이터가 오래됐다고(stale) 판단되면, 컴포넌트가 새로 마운트되거나 창에 다시 포커스가 오거나 네트워크가 다시 연결될 때 백그라운드에서 다시 가져온다. 오래됐다고 보는 기준 시간이 `staleTime` 이고 기본값은 0이다
- `useMutation` 으로 데이터를 바꾼 뒤 관련 쿼리를 무효화해 화면을 최신으로 맞춘다

<br/>

## 요청은 어디서 보낼까
아래는 이 노트에서 정리한 기준이다.

- 첫 화면에 바로 보여야 하는 데이터는 서버에서 가져온다. 서버 컴포넌트에서 fetch하거나, React Query의 `prefetchQuery` 로 미리 받아 클라이언트에 넘긴다
- 사용자 조작(검색어 입력, 필터, 페이지 이동)에 따라 바뀌는 데이터는 클라이언트 컴포넌트에서 `useQuery` 로 가져온다
- 데이터를 바꾸는 요청(작성, 수정, 삭제)과 그 뒤의 다시 가져오기는 클라이언트에서 React Query로 처리한다
- 쿠키나 비밀 키가 필요한 요청은 서버에서 보낸다. 브라우저 코드에는 비밀 키를 넣지 않는다

서버에서 prefetch한 데이터를 클라이언트에서 같은 queryKey로 재사용하는 흐름은 [React Query SSR + Hydration 정리](../../Libraries/ReactQuery/SSR과%20Hydration(SSR%20and%20Hydration)/README.md)에 정리했다.