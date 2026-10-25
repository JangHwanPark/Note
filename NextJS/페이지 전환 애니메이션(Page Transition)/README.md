## 페이지 전환 애니메이션이란 ?
- 다른 페이지로 이동할 때 새 화면이 갑자기 바뀌지 않고 서서히 나타나거나 밀려 들어오게 하는 효과
- Next.js App Router에서는 페이지를 감싸는 `template.tsx` 에 애니메이션을 넣는다
- `layout.tsx` 는 이동해도 다시 마운트되지 않아 애니메이션이 처음 한 번만 실행되고, `template.tsx` 는 해당 경로 구간(route segment)이 바뀔 때마다 새로 마운트되어 그때마다 실행된다

### 전환 (Transition)
사전적 의미는 다른 방향이나 상태로 바뀜이다. 연극에서 장면이 바뀔 때 조명이 어두워졌다 밝아지는 것처럼, 바뀌는 순간을 자연스럽게 잇는 것을 말한다.
화면에서는 한 상태에서 다른 상태로 넘어가는 사이를 애니메이션으로 채우는 것을 말한다.

<br/>

## 왜 layout이 아니라 template일까
모든 페이지에 같은 애니메이션을 주려면 페이지를 감싸는 공통 컴포넌트에 넣는 것이 자연스럽다. 그런데 App Router의 레이아웃은 경로를 옮겨도 그대로 남아 상태를 유지하고 다시 렌더링되지 않는다(참고 자료 2). 레이아웃에 넣은 애니메이션은 처음 들어올 때 한 번만 실행된다.

템플릿은 레이아웃처럼 페이지를 감싸지만, Next.js가 템플릿에 경로 구간마다 다른 `key` 를 붙인다(참고 자료 1). React는 `key` 가 바뀌면 이전 컴포넌트를 버리고 새로 마운트하므로, 템플릿 안의 상태는 초기화되고 `useEffect` 같은 효과도 다시 실행된다. 이 점을 이용해 마운트될 때 애니메이션을 시작하면 이동할 때마다 실행된다.

```jsx
// Next.js가 만드는 구조를 단순하게 쓴 것
<Layout>
  <Template key={routeParam}>{children}</Template>
</Layout>
```

<br/>

## 동작
아래는 GSAP로 새 페이지가 아래에서 살짝 떠오르며 나타나게 하는 템플릿이다. 템플릿은 기본이 서버 컴포넌트라서, 훅을 쓰려면 맨 위에 `'use client'` 를 적는다.

```tsx
// app/template.tsx
'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: 20, duration: 0.4, ease: 'power1.out' });
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
```

`gsap.from` 은 지정한 값(투명, 20px 아래)에서 원래 상태로 움직인다. 템플릿이 새로 마운트될 때마다 이 효과가 실행되고, `useGSAP` 은 템플릿이 사라질 때 만든 애니메이션을 정리한다.

처음 접속할 때는 서버가 만든 HTML이 먼저 보이고, JavaScript가 실행된 뒤에야 `gsap.from` 이 내용을 투명하게 만들었다가 다시 보이게 한다. 그래서 첫 화면에서 내용이 잠깐 보였다 사라졌다 다시 나타나는 깜빡임이 생길 수 있다(확인 필요). 이런 경우 처음 상태(투명)를 CSS로 미리 주고 `gsap.to` 로 보이게 하는 방법이 있지만, 그러면 JavaScript가 늦거나 실패할 때 내용이 계속 안 보이는 문제가 생긴다.

### 언제 다시 실행될까
템플릿은 자기 자리의 경로 구간이 바뀔 때만 새로 마운트된다. 공식 문서의 예를 따르면 `app/template.tsx` 와 `app/blog/template.tsx` 가 있을 때 아래처럼 동작한다(참고 자료 1).

| 이동 | 루트 템플릿 | blog 템플릿 |
| --- | --- | --- |
| `/` 에서 `/about` | 다시 마운트 | 없음 |
| `/about` 에서 `/blog` | 다시 마운트 | 새로 마운트 |
| `/blog` 에서 `/blog/first-post` | 그대로 | 다시 마운트 |
| `/blog/first-post` 에서 `/blog/second-post` | 그대로 | 다시 마운트 |

루트 템플릿 하나만 두면 `/blog/first-post` 에서 `/blog/second-post` 로 갈 때는 애니메이션이 실행되지 않는다. 첫 구간(`blog`)이 같기 때문이다. 하위 경로 사이 이동에도 애니메이션을 주려면 그 구간에도 템플릿을 둔다. 검색 파라미터(`?page=2`)만 바뀔 때도 다시 마운트되지 않는다.

템플릿은 새로 마운트될 때 실행되는 방식이라 이 방법으로 만들 수 있는 것은 새 페이지가 들어오는 애니메이션이다. 이전 페이지가 사라지는 애니메이션은 이전 템플릿이 이미 버려진 뒤라 따로 방법이 필요하다.

<br/>

## 참고 자료
1. Next.js 공식 문서, [template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template)
2. Next.js 공식 문서, [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

설명은 Next.js 16.4 공식 문서를 기준으로 했다. 예시 코드는 @types/react 19.3.0, TypeScript 5.6.3 `strict`, gsap 3.15.0, @gsap/react 2.1.2로 타입 검사만 했다. App Router는 Next.js에 들어 있는 React canary 버전을 쓰므로, 실제 앱에서 도는 React는 package.json에 적은 버전과 다를 수 있다. `gsap.from()` 과 `useGSAP` 사용법은 [GSAP 01장](../../Libraries/GSAP/01_GSAP%20메서드(GSAP%20Methods)/README.md)과 [GSAP 06장](../../Libraries/GSAP/06_ref와%20className(Ref%20and%20className)/README.md)에 정리했다. Next.js 앱에서 실제로 띄워 보지는 않았다. 템플릿이 다시 마운트되는 조건은 공식 문서의 설명을 옮긴 것이다.

<br/>

## 더 볼 것 (TODO)
- 이전 페이지가 사라지는 애니메이션 만들기 (View Transitions API 등)
- Pages Router에서 페이지 전환 애니메이션 주기

<br/>

[목차](..)
