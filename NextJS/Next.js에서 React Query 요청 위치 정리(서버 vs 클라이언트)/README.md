리액트 쿼리를 NextJS에서 사용하는 팀프로젝트가 많았다. 이걸 사용하다보면 

## Next.JS는 향상된 fetch를 지원하는데 왜 ReactQuery를 사용할까?
- Next.js의 향상된 fetch()는 `서버 중심 데이터 패칭`용
- React Query는 `클라이언트 상태 관리 + 실시간 갱신`용

용도 자체가 달라서 보완 관계로 React Query는 단순히 `use client 대응`이라기보단 CSR 환경에서 데이터를 캐싱, 리프레시, 자동 동기화해주는 상태 관리 도구다.

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

서버에서 prefetch한 데이터를 클라이언트에서 같은 queryKey로 재사용하는 흐름은 [React Query SSR + Hydration 정리](../../Libraries/ReactQuery/NextJS%20SSR.md)에 정리했다.