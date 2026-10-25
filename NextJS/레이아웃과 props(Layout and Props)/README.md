## 레이아웃에서 페이지로 props를 넘길 수 있을까
- 레이아웃(`layout.tsx`)을 쓰면 `children` 자리에 페이지(`page.tsx`)가 들어간다. 그래서 레이아웃에서 받은 데이터를 `children` 에게 props로 내려 줄 수 있는지 궁금했다
- 결론은 넘길 수 없다. App Router에서 레이아웃이 받는 것은 `children`, `params`, 병렬 라우트를 쓸 때의 슬롯뿐이고, 페이지에 다른 props를 직접 꽂아 줄 방법이 없다
- 대신 페이지에서 같은 데이터를 다시 가져오면 된다. 같은 요청 안에서는 한 번만 실행되게 만들 수 있어서 중복 요청을 걱정하지 않아도 된다
- 이 노트는 Next.js 16.4 공식 문서와 `next` 16.4.2 타입 정의를 기준으로 썼다

<br/>

## 왜 안 될까
React만 쓸 때는 부모 컴포넌트가 자식을 직접 렌더링하면서 props를 넘긴다. 레이아웃이나 페이지라는 개념은 React에 따로 없고, 그냥 컴포넌트가 컴포넌트를 부를 뿐이다.

```jsx
// React만 쓸 때
function Layout() {
  const role = 'admin'
  return <Page role={role} /> // Page를 직접 렌더링하며 props를 넘긴다
}
```

App Router의 레이아웃과 페이지는 이런 부모 자식 관계가 아니다. 레이아웃은 페이지를 import하지도, 렌더링하지도 않는다. Next.js가 URL에 맞는 페이지를 찾아 렌더링하고, 그 결과를 레이아웃의 `children` 자리에 끼워 넣는다. 레이아웃 입장에서 `children` 은 이미 만들어진 결과물이라 거기에 props를 더할 수 없다.

택배 상자에 비유하면, 레이아웃은 상자이고 페이지는 공장에서 이미 포장되어 온 물건이다. 상자는 물건을 감쌀 수는 있지만, 포장을 뜯고 안에 무언가를 넣을 수는 없다.

또 레이아웃은 페이지를 옮겨 다녀도 다시 렌더링되지 않는다(공식 문서 Layouts and Pages). 공식 문서 useSearchParams의 Layouts 항목은 레이아웃이 `searchParams` 를 받지 않는 이유를 이것으로 설명한다. 공유 레이아웃은 이동할 때 다시 렌더링되지 않으므로, 이동 사이에 `searchParams` 가 오래된 값으로 남을 수 있다는 것이다. 레이아웃이 페이지에 props를 넘길 수 없는 것도 같은 이유로 보인다. 페이지만 바뀔 때 레이아웃이 그 값을 다시 계산하지 않아 오래된 값이 남기 때문이다. 다만 일반 props에 대해서는 공식 문서가 직접 설명하지 않으므로 이 부분은 추론이다(확인 필요).

<br/>

## 대신 어떻게 할까
### 같은 함수로 각자 가져오기
레이아웃과 페이지가 같은 데이터가 필요하면 둘 다 같은 함수를 부른다. 데이터 가져오는 함수를 React의 `cache` 로 감싸 두면, 한 요청 안에서 여러 번 불러도 실제로는 한 번만 실행되고 결과를 함께 쓴다.

```ts
// lib/data.ts
import { cache } from 'react'

export type User = { id: string; role: 'admin' | 'member' }

export const getUser = cache(async (): Promise<User> => {
  // DB 조회나 API 요청
  return { id: 'u1', role: 'admin' }
})
```

```tsx
// app/dashboard/layout.tsx
import { getUser } from '@/lib/data'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  return (
    <section>
      <header>{user.role} 대시보드</header>
      {children}
    </section>
  )
}
```

```tsx
// app/dashboard/page.tsx
import { getUser } from '@/lib/data'

export default async function DashboardPage() {
  const user = await getUser() // 레이아웃과 같은 요청 안이라 한 번만 실행된다
  return <p>{user.id}님의 페이지</p>
}
```

`fetch` 로 가져오는 경우는 `cache` 로 감싸지 않아도 된다. 같은 URL과 옵션의 GET 요청은 레이아웃, 페이지, 서버 컴포넌트 사이에서 자동으로 한 번만 보낸다(Request Memoization). `cache` 는 DB 조회처럼 `fetch` 가 아닌 요청에 쓴다.

`cache` 가 결과를 기억하는 범위는 서버에서 한 요청을 렌더링하는 동안뿐이다. 서버 컴포넌트 밖, 예를 들어 Node.js에서 그냥 실행하면 기억하지 않는다. 같은 함수를 두 번 부르는 스크립트를 Node.js 22.13.0에서 실행해 보니 두 번 다 실행됐다.

### 클라이언트 컴포넌트에 넘겨야 할 때
레이아웃에서 가져온 데이터를 아래쪽 클라이언트 컴포넌트들이 써야 한다면, 레이아웃에서 Context Provider로 감싸 넘기는 방법도 있다. 공식 문서의 스트리밍 가이드는 레이아웃에서 프로미스를 만들어 Provider에 넘기고, 아래 컴포넌트가 `use()` 로 꺼내 쓰는 예를 보여 준다. 이때 Provider는 클라이언트 컴포넌트여야 하고, 넘기는 값은 직렬화할 수 있어야 한다.

<br/>

## 참고 자료
1. Next.js 공식 문서, [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
2. Next.js 공식 문서, [Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) (React.cache로 데이터 재사용하기)
3. Next.js 공식 문서, [Glossary: Memoization](https://nextjs.org/docs/app/glossary#memoization)
4. React 공식 문서, [cache](https://react.dev/reference/react/cache)
5. Next.js 공식 문서, [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) (Layouts 항목)

예시 코드는 `next` 16.4.2, react 19.3.1(package.json에 설치한 버전), TypeScript 5.6.3 `strict` 로 타입 검사만 했다. App Router는 Next.js에 들어 있는 React canary 버전으로 실행되므로 실제 실행 버전은 다를 수 있다. Next.js 앱으로 띄워 한 번만 실행되는지는 확인하지 않았다.

<br/>

[목차](..)
