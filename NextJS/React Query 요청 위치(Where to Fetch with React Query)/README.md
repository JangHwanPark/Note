## Next.js에 fetch가 있는데 React Query를 왜 쓸까
- Next.js에는 캐시와 재검증 옵션이 붙은 `fetch` 가 있는데, 팀 프로젝트에서는 React Query를 함께 쓰는 경우가 많았다. 둘을 왜 같이 쓰는지, 요청을 서버와 브라우저 중 어디서 보내야 하는지 헷갈려서 정리했다
- Next.js의 `fetch` 는 서버에서 데이터를 가져올 때 쓰고, React Query는 브라우저에 화면이 뜬 뒤 데이터를 캐싱하고 다시 가져와 화면과 맞추는 데 쓴다. 맡는 자리가 달라 서로 보완한다
- 이 노트는 Next.js 16 공식 문서의 이전 캐싱 방식(`cacheComponents` 를 켜지 않은 경우)과 TanStack Query 5를 기준으로 썼다

React Query를 `'use client'` 에서 쓰는 도구 정도로만 보기 쉽지만, 실제로는 서버 데이터를 브라우저에 캐싱하고 다시 가져오고 화면과 동기화해 주는 상태 관리 도구다. 또 클라이언트 컴포넌트도 첫 화면은 서버에서 HTML로 만들어지므로, 클라이언트 컴포넌트를 곧 CSR이라고 부르지는 않는다. 자세한 내용은 [CSR과 SSR](../CSR과%20SSR(CSR%20and%20SSR))에 정리했다.

<br/>

## Next.js의 향상된 fetch()가 하는 일
Next.js는 서버에서 실행되는 fetch()에 캐시와 재검증 옵션을 덧붙였다. 서버 컴포넌트에서 데이터를 가져올 때 결과를 서버의 데이터 캐시에 저장할지, 얼마 뒤에 다시 가져올지를 요청마다 정할 수 있다.

```ts
// 캐시해 두고 재사용
await fetch(url, { cache: 'force-cache' });

// 매 요청마다 새로 가져오기
await fetch(url, { cache: 'no-store' });

// 60초가 지나면 다시 가져오기
await fetch(url, { next: { revalidate: 60 } });

// 태그를 달아 두고, 데이터가 바뀌면 revalidateTag('posts', 'max')로 이 태그의 캐시를 오래된 것으로 표시
await fetch(url, { next: { tags: ['posts'] } });
```

한 번 렌더링하는 동안 같은 URL과 옵션으로 보낸 GET `fetch()` 요청은 실제로 한 번만 나가고 나머지는 그 결과를 공유한다(Request Memoization). 그래서 여러 서버 컴포넌트가 같은 데이터를 각자 fetch해도 요청이 중복되지 않는다.

Next.js 15부터는 `fetch` 결과가 기본으로 캐시되지 않는다(14까지는 기본이 캐시였다). 캐시가 필요하면 위처럼 `cache` 나 `revalidate` 를 직접 지정한다. 다만 캐시하지 않는다는 것은 데이터 캐시에 저장하지 않는다는 뜻이다. 페이지가 정적으로 렌더링되면 빌드할 때 가져온 결과가 HTML에 들어간 채 남으므로, 요청마다 새로 가져오려면 페이지가 동적 렌더링되어야 한다. 이 차이는 [CSR과 SSR](../CSR과%20SSR(CSR%20and%20SSR))의 정적 렌더링과 동적 렌더링에 정리했다.

Next.js 16에서 `revalidateTag` 는 두 번째 인수로 cacheLife 프로필(권장은 `'max'`)을 받는다. 인수 하나로 쓰는 방식은 사용 중단(deprecated)이다. 데이터를 바꾼 사용자가 바로 새 값을 봐야 하면 Server Action 안에서 `updateTag` 를 쓴다(`next` 16.4.2 타입 정의와 공식 문서 revalidateTag로 확인).

이 기능은 모두 서버에서만 동작한다. 브라우저에서 호출한 `fetch()` 는 일반 `fetch()` 와 같으므로, 클라이언트 쪽 캐싱과 재요청은 React Query가 맡는다.

<br/>

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
- API 키처럼 비밀 값이 필요한 요청은 서버에서 보낸다. 브라우저 코드에 넣은 값은 누구나 볼 수 있기 때문이다. 쿠키는 브라우저가 같은 출처 요청에 자동으로 붙이므로 쿠키 때문에 서버로 옮길 필요는 없다

서버에서 prefetch한 데이터를 클라이언트에서 같은 queryKey로 재사용하는 흐름은 [React Query SSR + Hydration 정리](../../Libraries/ReactQuery/SSR과%20Hydration(SSR%20and%20Hydration)/README.md)에 정리했다.

<br/>

[목차](..)
