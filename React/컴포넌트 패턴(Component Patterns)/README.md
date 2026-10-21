## 컴포넌트 패턴이란 ?
- 컴포넌트를 나누고 조립할 때 자주 쓰는 정해진 방식
- 이 문서는 React에서 자주 이야기되는 합성, 컨테이너/프레젠테이션, 렌더 프롭, 고차 컴포넌트, 커스텀 훅 다섯 가지를 다룬다
- 모두 화면과 로직을 다시 쓰기 쉽게 나누려는 방법이고, 훅이 나온 뒤로는 로직을 나누는 일 대부분을 커스텀 훅이 맡는다

### 패턴 (Pattern)
사전적 의미는 본, 틀, 되풀이되는 모양이다. 옷을 만들 때 쓰는 본처럼 같은 모양을 여러 번 만들 수 있게 해 주는 기준이다.
공학적으로는 자주 만나는 문제에 대해 여러 사람이 써 보고 효과가 확인된 해결 방식을 말한다. 코드를 그대로 복사하는 것이 아니라 문제를 나누는 모양을 따라 하는 것이다.

<br/>

## 합성 (Composition)
사전적 의미는 둘 이상을 합쳐 하나를 이루는 것이다. 레고 블록을 끼워 큰 모양을 만드는 것과 같다.

React에서는 컴포넌트 안에 다른 컴포넌트를 넣어 큰 화면을 만드는 방식을 말한다. 상속으로 기능을 물려주는 대신, 바깥 틀만 만들어 두고 안에 들어갈 내용은 쓰는 쪽이 정하게 한다.

### 왜 필요할까
카드, 모달, 레이아웃처럼 겉모양은 같고 안의 내용만 다른 컴포넌트가 많다. 내용마다 컴포넌트를 따로 만들면 겉모양을 고칠 때 전부 고쳐야 한다.

### 동작
태그 사이에 넣은 내용은 `children` prop으로 들어온다. 들어갈 자리가 여러 곳이면 `title`, `footer`처럼 prop을 나눠 받는다. 이렇게 자리를 나눈 prop을 흔히 슬롯(slot)이라고 부른다.

```tsx
import type { ReactNode } from 'react';

function Card({ title, footer, children }: { title: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

<Card title="공지" footer={<button>확인</button>}>
  <p>오늘 점검이 있습니다.</p>
</Card>
```

렌더링 결과는 아래와 같다.

```html
<section><h2>공지</h2><div><p>오늘 점검이 있습니다.</p></div><footer><button>확인</button></footer></section>
```

`Card`는 안에 무엇이 들어오는지 모른다. 그래서 공지, 상품, 프로필 어디에나 같은 카드를 쓸 수 있다.

<br/>

## 컨테이너/프레젠테이션 패턴 (Container/Presentational Pattern)
컨테이너(container)의 사전적 의미는 물건을 담는 그릇, 프레젠테이션(presentation)은 보여 주기다.

데이터를 가져오고 상태를 다루는 컴포넌트(컨테이너)와, 받은 데이터를 화면에 그리기만 하는 컴포넌트(프레젠테이션)를 나누는 방식이다. 데이터와 상태를 그릇처럼 담아 들고 있는 쪽이 컨테이너, 받은 것을 보여 주기만 하는 쪽이 프레젠테이션이다.

### 왜 필요할까
데이터 요청과 화면 그리기가 한 컴포넌트에 섞여 있으면, 같은 목록 화면을 다른 데이터로 다시 쓰기 어렵고 테스트할 때도 매번 요청을 흉내 내야 한다. 화면만 그리는 컴포넌트는 props만 넣으면 결과가 정해지므로 다시 쓰고 확인하기 쉽다.

### 동작
```tsx
import { useEffect, useState } from 'react';

type User = { id: number; name: string };

// 프레젠테이션: 받은 데이터를 그리기만 한다
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// 컨테이너: 데이터를 가져와 넘겨준다
function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return <UserList users={users} />;
}
```

`/api/users` 가 Alice, Bob 두 명을 돌려주도록 흉내 내고 실행하면 `<ul><li>Alice</li><li>Bob</li></ul>` 가 그려진다.

이 패턴을 널리 알린 Dan Abramov는 2019년 글 머리에 이제는 컴포넌트를 이렇게 나누라고 권하지 않는다는 갱신 메모를 달았다. 이 방식의 쓸모는 복잡한 상태 로직을 따로 떼어 내는 데 있었는데, 훅으로도 같은 일을 할 수 있기 때문이다(참고 자료 1). 아래 [커스텀 훅](#커스텀-훅-custom-hooks)에서 같은 코드를 훅으로 바꿔 본다.

<br/>

## 렌더 프롭 (Render Props)
렌더(render)의 사전적 의미는 무엇을 어떤 상태로 만들어 내다, 표현하다이다. 화면에서는 데이터를 눈에 보이는 모습으로 그려 내는 일을 렌더링이라고 한다.

렌더 프롭은 prop으로 함수를 넘기고, 컴포넌트가 그 함수를 불러 무엇을 그릴지 정하게 하는 방식이다. 이름 그대로 그려 내는 일을 맡는 prop이다.

### 왜 필요할까
켜고 끄기, 마우스 위치 추적처럼 상태와 동작은 같은데 화면 모양은 쓰는 곳마다 다른 경우가 있다. 상태 로직은 컴포넌트 하나에 두고, 그리는 일만 바깥에 맡기려고 쓴다.

### 동작
```tsx
import { useState, type ReactNode } from 'react';

function Toggle({ children }: { children: (on: boolean, toggle: () => void) => ReactNode }) {
  const [on, setOn] = useState(false);
  return <>{children(on, () => setOn((prev) => !prev))}</>;
}

<Toggle>
  {(on, toggle) => <button onClick={toggle}>{on ? '켜짐' : '꺼짐'}</button>}
</Toggle>
```

처음에는 버튼에 꺼짐이 보이고, 누르면 켜짐으로 바뀐다. `Toggle`은 상태만 들고 있고, 버튼으로 그릴지 체크박스로 그릴지는 넘겨준 함수가 정한다.

함수를 꼭 `render` 라는 이름의 prop으로 넘길 필요는 없다. `children` 도 prop이므로, 위처럼 태그 사이에 함수를 넣어 `children` 으로 넘기는 것도 렌더 프롭이다.

목록 컴포넌트가 항목 하나를 어떻게 그릴지 `renderItem` 같은 함수로 받는 것도 같은 방식이다. 로직을 나누는 용도는 대부분 커스텀 훅으로 옮겨 갔지만, 그리는 방법을 바깥에서 정하게 하는 용도로는 지금도 쓴다.

<br/>

## 고차 컴포넌트 (HOC, Higher-Order Component)
고차(higher-order)의 사전적 의미는 더 높은 차수다. 함수를 받거나 돌려주는 함수를 한 단계 위의 함수라는 뜻으로 고차 함수라고 부르는 데서 왔다. 고차 컴포넌트는 컴포넌트를 받아 기능을 덧붙인 새 컴포넌트를 돌려주는 함수다.

### 왜 필요할까
로딩 표시, 권한 확인처럼 여러 컴포넌트에 똑같이 붙여야 하는 기능이 있다. 컴포넌트마다 같은 코드를 넣는 대신 감싸는 함수 하나로 붙인다.

### 동작
```tsx
import type { ComponentType } from 'react';

function withLoading<P extends object>(Component: ComponentType<P>) {
  return function WithLoading({ loading, ...props }: P & { loading: boolean }) {
    if (loading) return <p>불러오는 중...</p>;
    return <Component {...(props as P)} />;
  };
}

const UserListWithLoading = withLoading(UserList);

<UserListWithLoading loading={true} users={[]} />                          // <p>불러오는 중...</p>
<UserListWithLoading loading={false} users={[{ id: 1, name: 'Alice' }]} /> // <ul><li>Alice</li></ul>
```

감싸는 층이 늘어날수록 어떤 prop이 어느 층에서 왔는지 알기 어려워지고, 위처럼 타입을 맞추는 코드도 복잡해진다. 그래서 새로 만드는 로직 재사용에는 잘 쓰지 않고, 라이브러리가 제공하는 HOC를 쓰거나 오래된 코드에서 만나는 경우가 많다.

<br/>

## 커스텀 훅 (Custom Hooks)
훅(hook)의 사전적 의미는 갈고리다. 무언가를 걸어 끌어오는 도구다. React의 훅은 함수 컴포넌트가 상태나 생명주기 같은 React 기능을 걸어 끌어다 쓰게 해 준다는 뜻으로 붙은 이름이다.

커스텀 훅은 `use`로 시작하는 이름의 함수 안에서 다른 훅을 불러, 상태 로직을 묶어 둔 것이다. React가 제공하는 훅처럼 컴포넌트에서 불러 쓴다.

### 왜 필요할까
렌더 프롭과 HOC는 로직을 나누려고 컴포넌트를 한 겹 더 감싼다. 커스텀 훅은 감싸는 컴포넌트 없이 함수 호출 한 줄로 같은 로직을 가져온다. React 공식 문서도 컴포넌트 사이에서 로직을 다시 쓰는 방법으로 커스텀 훅을 안내한다(참고 자료 2).

### 동작
앞의 렌더 프롭 `Toggle`을 훅으로 바꾸면 아래와 같다.

```tsx
import { useState } from 'react';

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((prev) => !prev);
  return [on, toggle] as const;
}

function LightSwitch() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? '켜짐' : '꺼짐'}</button>;
}
```

컨테이너 컴포넌트도 훅으로 바꿀 수 있다. 데이터를 가져오는 로직은 훅으로 옮기고, 화면은 앞의 `UserList`를 그대로 쓴다. `User` 타입과 `UserList` 는 컨테이너/프레젠테이션 예시의 것을 그대로 쓴다.

```tsx
import { useEffect, useState } from 'react';

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return users;
}

function UserPage() {
  const users = useUsers();
  return <UserList users={users} />;
}
```

커스텀 훅은 상태 자체가 아니라 상태를 만드는 로직을 나눈다. `LightSwitch`를 두 개 그리고 첫 번째만 누르면 첫 번째는 켜짐, 두 번째는 꺼짐이다. 훅을 부를 때마다 각자 자기 상태를 갖기 때문이다. 여러 컴포넌트가 같은 값을 함께 봐야 한다면 훅이 아니라 상태를 위로 올리거나 Context 같은 다른 방법이 필요하다.

### 언제 무엇을 쓸까
| 패턴 | 나누는 것 | 지금 주로 쓰는 곳 |
| --- | --- | --- |
| 합성 | 겉모양과 안의 내용 | 카드, 모달, 레이아웃 같은 틀 컴포넌트 |
| 컨테이너/프레젠테이션 | 데이터 처리와 화면 그리기 | 지금은 데이터 처리를 커스텀 훅으로 떼는 경우가 많다 |
| 렌더 프롭 | 상태 로직과 그리는 방법 | 항목을 어떻게 그릴지 바깥에서 정하는 목록 |
| 고차 컴포넌트 | 공통 기능과 원래 컴포넌트 | 라이브러리가 제공하는 것, 오래된 코드 |
| 커스텀 훅 | 상태 로직과 컴포넌트 | 로직 재사용 대부분 |

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 패턴 (Pattern) | 본, 틀 | 자주 쓰는 검증된 나누는 방식 |
| 합성 (Composition) | 합쳐 하나를 이룸 | 틀 안에 내용을 끼워 넣기 |
| 컨테이너 (Container) | 담는 그릇 | 데이터와 상태를 들고 넘겨주는 컴포넌트 |
| 프레젠테이션 (Presentational) | 보여 주기 | 받은 데이터를 그리기만 하는 컴포넌트 |
| 렌더 프롭 (Render Props) | 렌더: 만들어 내다, 표현하다 | 무엇을 그릴지 함수로 넘기기 |
| 고차 컴포넌트 (HOC) | 더 높은 차수 | 컴포넌트를 감싸 기능을 붙이는 함수 |
| 커스텀 훅 (Custom Hook) | 훅: 갈고리 | `use`로 시작하는 로직 묶음 함수 |

<br/>

## 참고 자료
1. Dan Abramov, [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), 2015 (2019 갱신 메모)
2. React 공식 문서, [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

예시 코드는 React 19.2, TypeScript 5.6 `strict`로 타입 검사하고, 렌더링 결과와 클릭 동작은 jsdom에서 실행해 확인했다.

<br/>

## 더 볼 것 (TODO)
- Context로 여러 컴포넌트가 같은 값을 함께 보기
- 포털(Portal)로 모달을 DOM 계층 밖에 그리기
- 제어 컴포넌트와 비제어 컴포넌트
- 컴파운드 컴포넌트 패턴(`<Tabs>`, `<Tabs.Item>` 처럼 함께 쓰는 컴포넌트 묶음)
