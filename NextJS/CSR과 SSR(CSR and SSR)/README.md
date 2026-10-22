## CSR과 SSR이란 ?
- CSR(Client-Side Rendering)은 브라우저가 JavaScript를 받아 화면을 만드는 방식, SSR(Server-Side Rendering)은 요청이 올 때마다 서버가 HTML을 만들어 보내는 방식이다
- Next.js App Router는 둘 중 하나를 고르는 구조가 아니다. 첫 화면은 서버에서 HTML로 만들고(빌드할 때든 요청이 올 때든), 그 뒤 브라우저에서 JavaScript를 붙여 움직이게 한다
- 이 노트는 Next.js 16.4 공식 문서(`next` 16.4.2 패키지에 들어 있는 문서)를 기준으로, App Router에서 어떤 코드가 어디서 렌더링되는지를 정리한다

CSR, SSR, SSG, 하이드레이션의 일반 개념은 [클라이언트-서버 구조 프론트엔드 관점](../../CS_Basic/클라이언트-서버%20구조%20프론트엔드%20관점(Frontend))에 정리했다. 여기서는 그 개념이 Next.js에서 어떻게 나타나는지를 본다.

<br/>

## 왜 구분해야 할까
CSR은 첫 화면이 늦고, SSR은 서버 부담이 크다. 자세한 비교는 위 문서에 있다.
Next.js는 이 두 방식을 섞어 쓴다. 그래서 코드를 쓸 때 이 컴포넌트가 서버에서 실행되는지, 브라우저에서 실행되는지, 둘 다인지를 알아야 한다. 이걸 헷갈리면 서버에서 `window` 를 읽다가 오류가 나거나, 서버에서 해도 될 일을 브라우저로 넘겨 첫 화면이 늦어진다.

<br/>

## 서버 컴포넌트와 클라이언트 컴포넌트
### 서버 컴포넌트 (Server Component)
App Router에서 컴포넌트는 기본으로 서버 컴포넌트다. 서버에서만 실행되고, 결과만 브라우저로 보낸다. 컴포넌트 코드 자체는 브라우저로 가지 않는다.
그래서 DB 조회나 비밀 키를 쓰는 요청처럼 서버에서만 해야 하는 일을 컴포넌트 안에서 바로 할 수 있다. 대신 `useState`, `onClick` 처럼 브라우저에서 움직이는 기능은 쓸 수 없다.

### 클라이언트 컴포넌트 (Client Component)
파일 맨 위에 `'use client'` 를 쓰면 클라이언트 컴포넌트가 된다. 상태, 이벤트 처리, 브라우저 API를 쓸 수 있다.
`'use client'` 는 컴포넌트 하나가 아니라 경계를 정한다. 이 파일이 가져오는(import) 컴포넌트도 지시어가 없어도 클라이언트 컴포넌트가 된다. 다만 서버 컴포넌트를 import하지 않고 `children` 같은 props로 받아 끼우면, 그 부분은 서버 컴포넌트로 남는다. 서버에서 이미 렌더링된 결과를 자리에 넣을 뿐이기 때문이다.

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count} likes</button>
}
```

### 'use client'는 CSR이라는 뜻이 아니다
`'use client'` 를 쓰면 브라우저에서만 렌더링된다고 생각하기 쉽지만 그렇지 않다. 공식 문서에 따르면 클라이언트 컴포넌트도 서버에서 먼저 HTML로 미리 렌더링(prerender)된다. prerender는 pre(미리)와 render(그리다)를 합친 말이다. 위의 `Counter` 도 서버에서 `0 likes` 가 적힌 버튼 HTML로 만들어져 브라우저로 간다.
`'use client'` 가 뜻하는 것은 이 컴포넌트의 JavaScript도 브라우저로 보내서, 브라우저에서 다시 실행해 움직이게 하라는 것이다. 서버에서만 실행되는 서버 컴포넌트와 달리, 클라이언트 컴포넌트는 서버와 브라우저 양쪽에서 실행된다.

<br/>

## 첫 화면은 어떻게 만들어질까
공식 문서는 처음 페이지를 열 때의 과정을 서버와 브라우저로 나눠 설명한다.

### 서버에서
1. 서버 컴포넌트를 렌더링해 RSC Payload(React Server Component Payload)라는 React 전용 데이터 형식으로 만든다
2. 이 RSC Payload와 클라이언트 컴포넌트를 함께 써서 HTML을 미리 만든다

payload는 실어 나르는 짐, 화물이라는 뜻이다. 네트워크에서는 전송되는 데이터 중 실제 내용 부분을 말한다. RSC Payload는 서버 컴포넌트를 렌더링한 결과와, 클라이언트 컴포넌트가 들어갈 자리 같은 정보를 담은 데이터다.

### 브라우저에서
1. 받은 HTML로 움직이지 않는 미리보기 화면을 바로 보여 준다
2. RSC Payload로 서버 컴포넌트와 클라이언트 컴포넌트의 트리를 맞춘다
3. JavaScript로 클라이언트 컴포넌트를 하이드레이션해서 버튼이 눌리는 화면으로 만든다

하이드레이션(Hydration)은 위 문서에서 본 대로, 정적인 HTML에 이벤트 처리기를 붙여 상호작용이 되는 화면으로 바꾸는 React의 과정이다. 첫 화면은 SSR처럼 서버에서 만들고, 움직임은 CSR처럼 브라우저가 맡는 셈이다.

### 페이지를 옮겨 다닐 때
첫 로드가 끝난 뒤 `<Link>` 로 다른 페이지로 이동하면 페이지 전체를 새로 받지 않는다. `<Link>` 가 화면에 보이면 Next.js가 그 경로를 미리 받아 두고(prefetch), 이동할 때 새 페이지의 RSC Payload로 바뀐 부분만 그린다. 정적 경로는 전체를 미리 받지만, 동적 경로는 `loading.tsx` 가 있는 구간까지만 미리 받거나 아예 건너뛴다. 그래서 동적 경로는 누른 뒤 서버 응답을 기다린다. prefetch는 프로덕션에서만 동작한다. 이때 클라이언트 컴포넌트는 서버가 만든 HTML 없이 브라우저에서만 렌더링된다. 이동 중에는 CSR에 가깝게 동작한다.

<br/>

## 언제 렌더링할까: 정적 렌더링과 동적 렌더링
서버에서 HTML을 만든다고 해도, 언제 만드는지에 따라 두 가지로 나뉜다.

### 정적 렌더링 (Static Rendering)
static은 정지한, 움직이지 않는이라는 뜻이다. 한 번 만든 화면이 요청마다 바뀌지 않고 그대로 있다는 데서 이 이름이 붙었다. `next build` 를 할 때 HTML을 미리 만들어 두고, 요청이 오면 만들어 둔 것을 보낸다. `revalidate` 로 재검증 주기를 정해 두면, 그 시간이 지난 뒤 들어온 요청을 계기로 다시 만든다. 이때 그 요청에는 일단 예전 화면을 보내고 뒤에서 새로 만든다(stale-while-revalidate). 새 화면은 그다음 요청부터 보인다. 이 방식을 흔히 ISR(Incremental Static Regeneration)이라 부른다. 모든 사용자에게 같은 화면을 보여 줘도 되는 페이지에 맞다. 일반 개념으로는 SSG에 해당한다.

### 동적 렌더링 (Dynamic Rendering)
dynamic은 움직이는, 변하는이라는 뜻이다. 요청에 따라 화면이 바뀐다는 뜻으로 쓴다. 요청이 올 때마다 서버가 HTML을 새로 만든다. 일반 개념의 SSR이 이것이다.
공식 문서에 따르면 컴포넌트가 요청마다 달라지는 정보를 읽는 Request-time API를 쓰면 동적 렌더링이 된다. `cookies()`, `headers()`, `searchParams`, `draftMode()` 가 여기에 해당한다. 요청이 와야 알 수 있는 값이라 빌드할 때 미리 만들 수 없기 때문이다.

```tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()   // 요청마다 다른 값이라 이 페이지는 동적 렌더링된다
  const theme = cookieStore.get('theme')
  return <p>{theme?.value}</p>
}
```

Request-time API가 없으면 페이지는 빌드할 때 한 번 만들어지므로, `Math.random()` 이나 현재 시각도 그때 값으로 굳는다. 요청마다 새 값이 필요하면 `next/server` 의 `connection()` 을 먼저 `await` 해서 요청이 올 때까지 렌더링을 미룬다.
Next.js 16에는 `next.config` 에서 `cacheComponents` 를 켜서 쓰는 새 캐싱 방식이 있고, 공식 문서는 이전 방식을 "Previous Model"로 따로 정리해 두었다. 이 노트는 `cacheComponents` 를 켜지 않은 경우를 기준으로 썼다. 켰을 때 무엇이 달라지는지는 확인하지 않았다.

이 방식(`cacheComponents` 를 끈 경우)에서는 `fetch` 에 `cache: 'no-store'` 를 주거나, 라우트에 `export const dynamic = 'force-dynamic'` 을 써도 동적 렌더링이 된다.

### 빌드 결과로 확인하기
어느 쪽으로 렌더링되는지는 `next build` 결과에 표시된다. 아래는 공식 문서에 나온 예시다.

```
Route (app)
┌ ○ /_not-found
└ ƒ /products/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

`○` 는 빌드할 때 미리 만든 정적 페이지, `ƒ` 는 요청이 올 때마다 서버에서 만드는 동적 페이지다. 정적이어도 될 페이지가 `ƒ` 로 나오면 Request-time API, `cache: 'no-store'` 로 보낸 `fetch`, 라우트 설정(`dynamic`) 가운데 무엇이 쓰였는지 찾아본다.

<br/>

## 서버에서 렌더링하지 않으려면
클라이언트 컴포넌트도 서버에서 미리 렌더링되므로, `window` 나 `document` 를 바로 쓰는 라이브러리는 서버에서 실행되다가 오류가 날 수 있다. 서버에는 브라우저가 없어서 이런 객체가 없기 때문이다.
이때는 `next/dynamic` 으로 불러오면서 `ssr: false` 를 주면 그 컴포넌트는 브라우저에서만 렌더링된다. 이 경우가 Next.js에서 말 그대로의 CSR이다.

```tsx
'use client'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('../components/chart'), { ssr: false })
```

`ssr: false` 는 클라이언트 컴포넌트 안에서만 쓸 수 있다. 서버 컴포넌트에서 쓰면 `` `ssr: false` is not allowed with `next/dynamic` in Server Components `` 오류가 난다(`next` 16.4.2에 들어 있는 메시지로 확인). 이 제한이 몇 버전부터 생겼는지는 확인 필요.

데이터만 브라우저에서 가져오는 경우도 있다. 화면 틀은 서버에서 만들고, 사용자 조작에 따라 자주 바뀌는 데이터는 클라이언트 컴포넌트에서 React Query 같은 도구로 가져오는 방식이다. 어느 요청을 서버와 브라우저 중 어디서 할지는 [Next.js에서 React Query 요청 위치 정리](../React%20Query%20요청%20위치(Where%20to%20Fetch%20with%20React%20Query))에서 이어서 정리한다.

<br/>

## 한눈에 비교
| 구분 | 서버 컴포넌트 | 클라이언트 컴포넌트 | `ssr: false` 로 불러온 컴포넌트 |
| --- | --- | --- | --- |
| 서버에서 HTML로 만드는가 | 만든다 | 만든다 | 만들지 않는다 |
| 코드가 브라우저로 가는가 | 가지 않는다 | 간다 | 간다 |
| 상태, 이벤트 처리 | 쓸 수 없다 | 쓸 수 있다 | 쓸 수 있다 |
| `window` 바로 접근 | 할 수 없다 | 렌더링 중에는 못 하고, `useEffect` 나 이벤트 처리기 안에서는 된다 | 할 수 있다 |
| 가까운 일반 개념 | SSR, SSG | SSR 뒤 하이드레이션 | CSR |

<br/>

[목차](..)
