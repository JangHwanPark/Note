## React Query SSR + Hydration 정리

### 왜 SSR + Hydration 이 필요할까?
React Query SSR + Hydration 방식을 쓰면, 여러 컴포넌트가 같은 `queryKey`로 `useQuery()`를 호출해도 중복 요청 없이 이미 Hydration 된 데이터를 활용할 수 있다. 따라서 불필요한 데이터 드릴링도 필요 없고, 각 컴포넌트마다 `useQuery`를 자유롭게 호출할 수 있다.

<br/>

### useQuery()를 여러 컴포넌트에서 호출해도 비효율적이지 않은 이유
React Query는 동일한 `queryKey`로 `useQuery()`가 호출되면 캐시에서 데이터를 반환한다. 즉, 이미 서버에서 `prefetchQuery()`로 받아 온 데이터가 있으면, 다른 컴포넌트에서 `useQuery()`를 호출해도 네트워크 요청 없이 즉시 캐시를 반환하게 된다.

- 컴포넌트마다 `useQuery()` 호출 = “여러 번 네트워크 요청”이 아니라, 이미 캐싱된 데이터를 컴포넌트들이 공유하기 때문에 오버헤드가 없다.
- 데이터 드릴링(props drilling) 없이 하위 컴포넌트에서도 `useQuery()`로 데이터를 활용 가능.

<br/>

### SSR + Hydration 를 통한 데이터 캐싱 방법
#### 부제: 데이터 드릴링(Props Drilling) 없이 Hydration을 적용하는 방법

#### 전체 흐름
- 서버 컴포넌트 (`layout.tsx`)에서 `prefetchQuery()`로 데이터 로드
- React Query의 `dehydrate(queryClient)`로 직렬화하여 클라이언트에 전달
- 클라이언트 컴포넌트 (`Providers.tsx`)에서 `HydrationBoundary`로 캐시 복원
- 각 컴포넌트에서 `useQuery()`로 동일 `queryKey`를 사용하면, 캐시된 데이터를 재활용
- 예: 레이아웃(혹은 최상위 `layout.tsx`) 또는 페이지 레벨에서 서버 컴포넌트로 `queryClient.prefetchQuery()`를 실행.  
- 이렇게 하면 React Query의 캐시에 미리 데이터가 채워짐.  
- 서버에서 `dehydrate(queryClient)`로 직렬화된 캐시(Hydration Data) 생성  
- **클라이언트 컴포넌트에서 `HydrationBoundary`**와 `QueryClientProvider`로 감싸기  
- `HydrationBoundary`의 `state`에 서버에서 직렬화해 준 캐시(`dehydratedState`)를 넘겨줌.  
- 각 컴포넌트(심지어 깊은 Children)에서 `useQuery()`  
- 똑같은 `queryKey(["someKey", id])`로 `useQuery()` 호출 → 이미 캐시에 있는 데이터를 즉시 사용  
- 추가 fetch 없이 서버에서 넘긴 데이터를 활용

##### 이 방식의 장점
- “초기 데이터”를 각 컴포넌트에 직접 props로 넘길 필요(데이터 드릴링)가 전혀 없다.
- 레벨 깊은 컴포넌트에서도 동일 key만 쓰면 자동으로 캐시 활용.
- 렌더링 트리에 어느 위치에서나 데이터를 편하게 가져올 수 있음.

#### “레이아웃이 클라이언트 렌더링이 될까 봐 걱정”일 때
Next.js App Router에서 서버 컴포넌트(`layout.tsx`)가 **React Query의 `QueryClientProvider`**를 직접 감싸려면, 그 레이아웃 자체가 Client Component가 되어야 하므로, `"use client"` 선언이 필요. 결과적으로 서버 컴포넌트가 아닌, 클라이언트 컴포넌트 레이아웃이 된다.  
만약 전체 레이아웃이 클라이언트로 전환되는 걸 원치 않는다면, 상단에 서버 컴포넌트 레이아웃을 두고, 그 안에서 별도의 클라이언트 컴포넌트(예: `<Providers>` 래퍼)만 `HydrationBoundary` + `QueryClientProvider`를 감싸는 구조로 나눈다.

##### 예시
```js
// app/layout.tsx (서버 컴포넌트)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Providers는 Client Component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```
```js
// app/Providers.tsx (클라이언트 컴포넌트)
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  // 이 안에서 서버에서 받아온 dehydratedState를 적용할 수도 있음
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
```
이렇게 하면 RootLayout은 여전히 서버 컴포넌트이고,
**Providers**만 “클라이언트 컴포넌트”로 동작하면서 React Query 세팅을 관리.


정리: SSR + Hydration + React Query
서버에서 prefetchQuery()
App Router 환경에서는 서버 컴포넌트에서 fetch/prefetchQuery로 데이터 준비.
dehydrate(queryClient)로 직렬화하여 클라이언트로 전달
**클라이언트 측에서 HydrationBoundary**로 감싸고, 동일한 key로 useQuery() → 캐시 재활용.
데이터 드릴링 없이, 컴포넌트마다 useQuery() 호출해도 중복 요청 없이 캐시 사용.
따라서 “컴포넌트가 여러 개의 useQuery()를 호출하면 비효율적이지 않을까”라는 걱정은 React Query의 캐시 메커니즘 덕분에 문제 되지 않는다.

SSR과 CSR을 효과적으로 병행할 수 있으며, 초기 렌더링(SSR)은 빠르게, 이후 상호작용은 CSR로 이어지는 하이브리드 렌더링이 가능해진다.




“레이아웃에서 미리 데이터를 불러오고(Hydration), 하위 컴포넌트(사용자 카드, 프로젝트 카드)에서 각각 useQuery()로 캐시된 데이터를 받아서 렌더링” 과정을 단계별로 살펴보자.

폴더 구조 예시
```text
app/
 ┣ layout.tsx          // (서버 컴포넌트) SSR로 prefetchQuery
 ┣ Providers.tsx       // (클라이언트 컴포넌트) React Query 세팅 & HydrationBoundary
 ┗ dashboard/
   ┗ page.tsx          // (클라이언트 컴포넌트) 여러 카드(UserCard, ProjectCard)를 렌더링
     ┣ components/
       ┣ UserCard.tsx  // (클라이언트 컴포넌트) 사용자 카드
       ┗ ProjectCard.tsx  // (클라이언트 컴포넌트) 프로젝트 카드
```
layout.tsx (서버 컴포넌트)
**서버에서 prefetchQuery**로 데이터를 불러온 뒤, **dehydrate**로 직렬화해 **Providers**에 넘김.
```js
// app/layout.tsx
import { ReactNode } from "react";
import Providers from "./Providers";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchUsers, fetchProjects } from "@/lib/api";

// Next.js App Router의 서버 컴포넌트
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 1) 서버에서 QueryClient 생성
  const queryClient = new QueryClient();

  // 2) 서버에서 데이터를 미리 가져옴 (prefetch)
  await queryClient.prefetchQuery(["users"], () => fetchUsers());
  await queryClient.prefetchQuery(["projects"], () => fetchProjects());

  // 3) 캐시 상태를 직렬화
  const dehydratedState = dehydrate(queryClient);

  return (
    <html>
      <body>
        {/*
          4) Providers에 dehydratedState를 전달.
             Providers는 클라이언트 컴포넌트이므로 "use client"
        */}
        <Providers dehydratedState={dehydratedState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```
동작 요약
서버에서 fetchUsers(), fetchProjects()로 데이터를 미리 로드.
Next.js가 서버에서 미리 채운 QueryClient를 dehydrate로 직렬화하여 **dehydratedState**를 만든다.
Providers(클라이언트 컴포넌트)로 **dehydratedState**를 넘겨주어, 클라이언트가 하이드레이션할 수 있게 한다.


Providers.tsx (클라이언트 컴포넌트)
여기서 **HydrationBoundary**와 **QueryClientProvider**를 설정한다.
```js
// app/Providers.tsx
"use client";

import React from "react";
import { HydrationBoundary } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState: any;
}) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* 서버에서 넘어온 dehydratedState를 HydrationBoundary로 감싼다 */}
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
```
동작 요약
클라이언트가 화면을 로드할 때, 서버에서 직렬화된 캐시(dehydratedState)를 React Query가 받아서 캐시를 복원(Hydration)한다.
이후 같은 queryKey로 useQuery()를 호출하면 이미 캐시에 있는 데이터를 즉시 사용하게 됨.


dashboard/page.tsx (클라이언트 컴포넌트)
사용자 카드와 프로젝트 카드를 함께 렌더링.
이 페이지 자체에서 useQuery()를 호출해도 되고, 각각 카드 내부에서 호출해도 됨(React Query 캐시가 있기 때문).
```js
// app/dashboard/page.tsx
"use client";

import UserCard from "./components/UserCard";
import ProjectCard from "./components/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, fetchProjects } from "@/lib/api";

export default function DashboardPage() {
  // 1) 만약 여기서도 다시 useQuery를 호출해도,
  //    이미 hydrate된 캐시가 있기 때문에 네트워크 요청 없음
  const { data: users } = useQuery(["users"], fetchUsers);
  const { data: projects } = useQuery(["projects"], fetchProjects);

  return (
    <div>
      <h1>대시보드</h1>

      <section style={{ display: "flex", gap: "16px" }}>
        <UserCard />
        <ProjectCard />
      </section>

      <hr />
      <section>
        {/* 여기서도 users, projects를 활용해 뭔가를 보여줄 수 있음 */}
        <p>유저 수: {users?.length}</p>
        <p>프로젝트 수: {projects?.length}</p>
      </section>
    </div>
  );
}
```
동작 요약
**useQuery(["users"])**를 호출하면, 서버에서 이미 prefetched해둔 캐시가 있으면 즉시 캐싱된 데이터를 반환.
실제 네트워크 요청은 일어나지 않고, 초기 렌더링에서 이미 Hydration이 완료된 상태를 사용.


UserCard.tsx (클라이언트 컴포넌트)
사용자 목록을 캐시에서 꺼내온다.
```js
// app/dashboard/components/UserCard.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api";

export default function UserCard() {
  // 같은 queryKey로 호출
  const { data: users } = useQuery(["users"], fetchUsers);

  return (
    <div style={{ border: "1px solid black", padding: "8px", width: "200px" }}>
      <h2>사용자 카드</h2>
      <ul>
        {users?.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```
동작 요약
동일한 ["users"] queryKey로 useQuery()를 호출 ⇒ 이미 Hydration된 데이터를 사용 ⇒ 네트워크 요청 X.
렌더링 시점에 즉시 데이터가 있으므로 로딩 지연 없이 사용자 목록 표시.


ProjectCard.tsx (클라이언트 컴포넌트)
프로젝트 목록을 캐시에서 꺼내온다.
```js
// app/dashboard/components/ProjectCard.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/lib/api";

export default function ProjectCard() {
  // 같은 queryKey로 호출
  const { data: projects } = useQuery(["projects"], fetchProjects);

  return (
    <div style={{ border: "1px solid black", padding: "8px", width: "200px" }}>
      <h2>프로젝트 카드</h2>
      <ul>
        {projects?.map((p: any) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
```
동작 요약
**["projects"]**로 useQuery() ⇒ 서버에서 미리 받아온 캐시 활용.
서로 다른 컴포넌트지만, 같은 쿼리 키를 사용하면 중복 요청 없이 데이터를 재사용.


렌더링 순서 요약
서버 측 렌더링 단계

Next.js가 layout.tsx를 실행(서버 컴포넌트).
prefetchQuery(["users"]) + prefetchQuery(["projects"]) → 서버가 fetchUsers(), fetchProjects() 호출, 응답을 받음.
queryClient에 캐시가 채워짐 → dehydrate(queryClient)로 직렬화.
결과적으로 초기 HTML에 React Query 캐시 정보가 포함된 Hydration Data가 담긴 상태로 응답.
클라이언트 하이드레이션 단계

브라우저가 HTML/CSS/JS를 로드, Providers(클라이언트 컴포넌트)가 실행.
QueryClientProvider + HydrationBoundary가 dehydratedState를 복원.
React Query는 이미 가져온 ["users"], ["projects"] 데이터를 캐시에 보관.
클라이언트 렌더링

dashboard/page.tsx와 그 내부 컴포넌트(UserCard, ProjectCard)가 useQuery(["users"]), useQuery(["projects"])를 각각 호출.
이미 캐시에 있는 데이터를 즉시 반환하므로, 중복 네트워크 요청 없음.
최종 화면에 사용자 카드, 프로젝트 카드가 즉시 렌더링.


결론
서버에서 prefetchQuery로 가져온 데이터를 클라이언트에서 동일한 queryKey로 useQuery()하면, 이미 캐싱된 데이터를 즉시 활용할 수 있음.
여러 컴포넌트(예: UserCard, ProjectCard)에서 똑같은 쿼리를 사용해도, 추가 네트워크 요청 없이 캐시를 공유.
데이터 드릴링을 강제로 할 필요가 없고, 컴포넌트 깊이가 달라도 useQuery만 있으면 자동으로 캐시 사용.
전체 렌더링 순서는 “서버에서 prefetch → HydrationBoundary → 클라이언트 컴포넌트들이 캐시 사용” 순서로 진행.
이 과정을 통해 SSR으로 초기 로딩 속도와 SEO를 챙기고, 이후엔 CSR에 가까운 React Query 캐싱 로직을 사용할 수 있어!