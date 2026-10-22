## SSR과 Hydration이란 ?
- 서버 사이드 렌더링(Server-Side Rendering, SSR)은 서버에서 화면을 미리 만들어 HTML로 보내는 방식이다
- 이 문서는 SSR에서 React Query를 쓰는 흐름을 다룬다. 서버에서 데이터를 미리 받아 캐시에 넣고(미리 가져오기, prefetch), 그 캐시를 주고받을 수 있는 객체로 바꿔 브라우저로 넘긴 뒤(말리기, dehydrate), 브라우저의 캐시에 다시 채운다(되살리기, hydrate)
- 브라우저의 컴포넌트는 같은 `queryKey` 로 `useQuery` 를 부르기만 하면 서버에서 받은 데이터를 첫 화면부터 쓴다
- 그래서 데이터가 필요한 컴포넌트가 깊은 곳에 있어도 props로 내려 줄 필요가 없다
- 이 문서의 코드는 @tanstack/react-query 5.104.5, React 19.2, TypeScript 5.6 strict로 타입 검사했다. 캐시 동작은 jsdom에서 실행해 확인했고, Next.js 앱으로 띄워 보지는 않았다. Next.js 구성은 App Router 기준이며 버전별 동작은 확인 필요다

### 하이드레이션 (Hydration)
사전적 의미는 수화, 물을 공급함이다. 말린 음식에 물을 부어 원래 상태로 되돌리는 일을 떠올리면 된다.
React Query에서는 서버가 말려서(dehydrate) 보낸 캐시를 브라우저가 물을 부어(hydrate) 살아 있는 캐시로 되돌리는 일을 말한다. `dehydrate` 는 캐시를 함수나 클래스가 없는 평범한 객체로 바꿔 줄 뿐이고, 이 객체를 문자열로 바꿔(직렬화, Serialization) 브라우저에 보내는 일은 Next.js가 서버 컴포넌트의 props를 넘길 때 한다.

React에도 하이드레이션이라는 말이 있는데 다른 일이다. React의 하이드레이션은 서버가 만든 HTML에 브라우저가 이벤트 처리기를 붙여 움직이는 화면으로 만드는 일이다. 이 문서에서 하이드레이션은 React Query 캐시를 채우는 일을 가리킨다.

동결 건조 식품과 같다. 공장(서버)에서 음식을 만들어 말려 보내면, 집(브라우저)에서는 물만 부어 바로 먹는다. 처음부터 다시 요리(요청)하지 않는다.

<br/>

## 왜 필요할까
서버 컴포넌트에서 받은 데이터를 클라이언트 컴포넌트에 쓰려면 보통 props로 넘긴다. 데이터가 필요한 컴포넌트가 트리 깊은 곳에 있으면 중간 컴포넌트들이 쓰지도 않는 props를 계속 넘겨야 한다(props drilling).

React Query 캐시를 서버에서 채워 넘기면 이 전달이 필요 없다. 깊은 곳의 컴포넌트도 같은 `queryKey` 로 `useQuery` 를 부르면 캐시에서 바로 꺼낸다.

### useQuery를 여러 곳에서 불러도 괜찮은 이유
React Query는 `queryKey` 를 기준으로 캐시를 하나만 둔다. 같은 키로 `useQuery` 를 여러 번 불러도 결과는 모든 컴포넌트가 나눠 쓴다. 다만 요청이 한 번으로 줄어드는 것은 두 경우뿐이다. 같은 키의 요청이 이미 진행 중일 때, 그리고 캐시의 데이터가 아직 `staleTime` 안일 때다.

jsdom에서 확인한 결과는 아래와 같다.

- 같은 화면에서 `["users"]` 를 세 컴포넌트가 동시에 써도 `fetchUsers` 는 한 번 불렸다
- 기본 설정(`staleTime` 0)에서 첫 요청이 끝난 뒤 같은 키를 쓰는 컴포넌트가 새로 나타나면 한 번 더 불렸다(총 2번)
- `staleTime` 을 60초로 두면 나중에 나타난 컴포넌트도 캐시를 그대로 써서 총 1번이었다

<br/>

## staleTime을 0보다 크게 두는 이유
서버에서 받은 데이터가 있어도 기본 설정 그대로면 브라우저가 마운트하자마자 다시 요청한다. `staleTime` 기본값이 0이라서, 하이드레이션된 데이터도 받는 즉시 오래된(stale) 데이터로 취급되기 때문이다. 오래된 데이터를 가진 쿼리는 컴포넌트가 마운트될 때 백그라운드에서 다시 가져온다.

jsdom에서 서버 쪽 `QueryClient` 로 `users`, `projects` 를 prefetch하고 dehydrate한 값을 브라우저 쪽 `QueryClient` 에 하이드레이션해 비교했다. 기본값(`staleTime` 0)에서는 첫 렌더링에 데이터가 이미 있었지만, 마운트 직후 키마다 한 번씩 총 2번 다시 요청했다. `staleTime` 을 60초로 두면 첫 렌더링은 같고 추가 요청은 0번이었다.

두 경우 모두 첫 화면에는 데이터가 바로 나온다. 차이는 그 뒤에 같은 요청을 한 번 더 보내느냐다. TanStack Query 문서도 SSR에서는 `staleTime` 을 0보다 크게 두라고 권한다(참고 자료 1).

<br/>

## 전체 흐름
1. 페이지의 서버 컴포넌트에서 `QueryClient` 를 만들고 `prefetchQuery` 로 데이터를 받아 캐시에 넣는다
2. `dehydrate(queryClient)` 로 캐시를 직렬화해 `HydrationBoundary` 의 `state` 로 넘긴다. `HydrationBoundary` 는 클라이언트 컴포넌트라서, 이 값은 서버 컴포넌트가 클라이언트 컴포넌트에 넘기는 props로 함께 전달된다
3. 브라우저에서 `HydrationBoundary` 가 받은 캐시를 `QueryClientProvider` 의 캐시에 채운다
4. 그 아래 컴포넌트가 같은 `queryKey` 로 `useQuery` 를 부르면 채워진 데이터를 바로 쓴다

<br/>

## 폴더 구조 예시
```text
app/
 ┣ get-query-client.ts   // QueryClient를 만드는 함수 (staleTime 설정)
 ┣ providers.tsx         // (클라이언트) QueryClientProvider
 ┣ layout.tsx            // (서버) Providers로 감싸기만 한다
 ┗ dashboard/
   ┣ page.tsx            // (서버) prefetch + HydrationBoundary
   ┣ Dashboard.tsx       // (클라이언트) useQueries로 두 데이터를 함께 쓴다
   ┗ components/
     ┣ UserCard.tsx      // (클라이언트) useQuery(["users"])
     ┗ ProjectCard.tsx   // (클라이언트) useQuery(["projects"])
```

prefetch는 레이아웃이 아니라 페이지에서 한다. Next.js 문서에 따르면 App Router의 레이아웃은 그 아래 페이지끼리 이동할 때 다시 렌더링되지 않는다(직접 실행해 확인하지는 않았다). 그래서 레이아웃에서 prefetch하면 처음 들어온 한 번만 실행된다. 페이지마다 자기에게 필요한 데이터를 prefetch하고 `HydrationBoundary` 로 감싸는 것이 TanStack Query 문서의 구성이다.

### get-query-client.ts
```ts
import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 서버에서 받아 온 데이터를 클라이언트가 곧바로 다시 요청하지 않도록 0보다 크게 둔다
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) return makeQueryClient(); // 서버는 요청마다 새로 만든다
  if (!browserQueryClient) browserQueryClient = makeQueryClient(); // 브라우저는 하나를 계속 쓴다
  return browserQueryClient;
}
```

서버에서 `QueryClient` 를 요청마다 새로 만드는 이유는 사용자끼리 캐시가 섞이지 않게 하려는 것이다. 하나를 모듈 변수로 두고 함께 쓰면 A 사용자의 데이터가 B 사용자의 화면에 나갈 수 있다.

### providers.tsx (클라이언트 컴포넌트)
```tsx
"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

`QueryClientProvider` 는 React Context를 쓰므로 클라이언트 컴포넌트여야 한다. 레이아웃 전체에 `"use client"` 를 붙이면 레이아웃이 통째로 클라이언트 컴포넌트가 되므로, 이렇게 Provider만 따로 떼어 낸다.

### layout.tsx (서버 컴포넌트)
```tsx
import type { ReactNode } from "react";
import Providers from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### dashboard/page.tsx (서버 컴포넌트)
```tsx
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import { fetchProjects, fetchUsers } from "@/lib/api";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // 두 요청은 서로 기다릴 필요가 없으니 동시에 보낸다
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["users"], queryFn: fetchUsers }),
    queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: fetchProjects }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
```

`prefetchQuery` 는 요청이 실패해도 예외를 던지지 않는다. 실패한 쿼리는 서버 캐시에 error 상태로 남지만, `dehydrate` 는 기본으로 성공한 쿼리만 담는다. 실패하는 쿼리와 성공하는 쿼리를 하나씩 prefetch한 뒤 dehydrate하면 성공한 쪽 키만 들어 있는 것을 확인했다. 그래서 서버 요청이 실패해도 페이지는 그려지고, 브라우저의 `useQuery` 가 그 데이터를 처음부터 다시 요청한다.

### dashboard/Dashboard.tsx (클라이언트 컴포넌트)
여러 데이터를 한 컴포넌트에서 함께 쓸 때는 `useQuery` 를 여러 번 불러도 되고, `useQueries` 로 한 번에 불러도 된다. `useQueries` 는 쿼리 목록을 받아 결과를 같은 순서의 배열로 돌려준다. 몇 개를 부를지 렌더링 중에 정해질 때(목록의 id마다 하나씩 등)는 `useQuery` 를 반복문 안에서 부를 수 없으므로 `useQueries` 를 쓴다.

```tsx
"use client";

import { useQueries } from "@tanstack/react-query";
import { fetchProjects, fetchUsers } from "@/lib/api";
import UserCard from "./components/UserCard";
import ProjectCard from "./components/ProjectCard";

export default function Dashboard() {
  const [usersQuery, projectsQuery] = useQueries({
    queries: [
      { queryKey: ["users"], queryFn: fetchUsers },
      { queryKey: ["projects"], queryFn: fetchProjects },
    ],
  });

  return (
    <div>
      <h1>대시보드</h1>
      <p>사용자 수: {usersQuery.data?.length}</p>
      <p>프로젝트 수: {projectsQuery.data?.length}</p>
      <section style={{ display: "flex", gap: "16px" }}>
        <UserCard />
        <ProjectCard />
      </section>
    </div>
  );
}
```

### components/UserCard.tsx (클라이언트 컴포넌트)
```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api";

export default function UserCard() {
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  return (
    <div>
      <h2>사용자 카드</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

`ProjectCard` 는 키를 `["projects"]`, 함수를 `fetchProjects` 로 바꾼 같은 모양이다. `Dashboard` 와 두 카드가 같은 키를 쓰지만, 데이터가 `staleTime` 안이라 요청은 늘지 않는다. `fetchUsers` 가 `Promise<User[]>` 를 돌려주도록 타입을 적어 두면 `users` 도 `User[] | undefined` 로 잡혀서 `any` 를 쓸 필요가 없다.

<br/>

## 렌더링 순서
서버에서는 아래 순서로 진행된다.

1. `/dashboard` 요청이 오면 Next.js가 `layout.tsx` 와 `dashboard/page.tsx` 를 서버에서 실행한다
2. `page.tsx` 가 `users`, `projects` 를 prefetch해 서버 쪽 `QueryClient` 캐시를 채운다
3. `dehydrate` 결과가 `HydrationBoundary` 의 props로 넘어간다
4. 클라이언트 컴포넌트(`Dashboard`, 두 카드)도 서버에서 한 번 렌더링되어 데이터가 채워진 HTML이 만들어진다. `HydrationBoundary` 는 렌더링하는 도중에 캐시를 채우므로(jsdom에서도 첫 렌더링에 데이터가 이미 있었다) HTML에 목록이 들어간다. Next.js에서 실제 HTML로 확인하지는 않았다

브라우저에서는 이어서 아래 순서로 진행된다.

1. HTML이 먼저 화면에 보인다
2. `Providers` 가 브라우저용 `QueryClient` 를 만들고, `HydrationBoundary` 가 받은 캐시를 그 `QueryClient` 에 채운다
3. React가 HTML에 이벤트 처리기를 붙인다(React의 하이드레이션). 이때 `useQuery` 는 캐시의 데이터를 그대로 쓰므로 서버 HTML과 같은 화면이 유지되고, `staleTime` 안이라면 추가 요청도 없다

<br/>

## 참고 자료
1. TanStack Query, [Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
2. TanStack Query, [useQueries](https://tanstack.com/query/latest/docs/framework/react/reference/useQueries)

<br/>

## 더 볼 것 (TODO)
- prefetch하지 않고 서버 컴포넌트에서 기다리지 않는 방식 (스트리밍과 `useSuspenseQuery`)
- 서버에서 요청이 실패했을 때 오류 화면을 보여 주는 방법
