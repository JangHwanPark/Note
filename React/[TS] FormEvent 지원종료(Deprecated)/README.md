## FormEvent deprecated란 ?
- React 타입 정의(`@types/react`)에서 `FormEvent`와 `FormEventHandler`가 deprecated로 표시됐다
- 19.2.9까지는 `onSubmit`의 타입이 `FormEventHandler`였고, 19.2.10부터 `SubmitEventHandler`로 바뀌었다
- 코드가 바로 깨지지는 않지만, 에디터에서 취소선과 함께 "'FormEvent' is deprecated." 경고가 뜬다

deprecated의 사전적 의미는 반대하다, 비난하다이다. 소프트웨어에서는 아직 동작은 하지만 앞으로 쓰지 말라고 공식적으로 표시한 기능을 말한다. 당장 지우지는 않되 다른 방법으로 옮겨 가라는 신호라서, 지원 종료보다는 사용 중단 권고에 가깝다.

<br/>

## 왜 바뀌었을까
DOM에는 FormEvent라는 이벤트가 실제로 없다. 폼에서 일어나는 이벤트는 제출할 때의 `submit`, 값이 바뀔 때의 `change`, 입력할 때의 `input`처럼 각자 따로 있고, 이벤트마다 들고 있는 정보도 다르다. 그런데 React 타입은 이 이벤트들을 FormEvent 하나로 뭉뚱그려 왔다.

`@types/react` 19.3.0의 FormEvent 정의에 붙은 주석에도 그대로 적혀 있다.

```ts
/**
 * @deprecated FormEvent doesn't actually exist.
 *             You probably meant to use {@link ChangeEvent}, {@link InputEvent}, {@link SubmitEvent}, or just {@link SyntheticEvent} instead
 *             depending on the event type.
 */
interface FormEvent<T = Element> extends SyntheticEvent<T> {
}
```

이벤트 종류에 맞는 타입을 쓰면 그 이벤트에만 있는 정보를 타입으로 받을 수 있다. 예를 들어 `SubmitEvent`에는 어떤 버튼으로 제출했는지 알려 주는 `submitter`가 있고, `target`이 항상 `HTMLFormElement`로 잡혀 있다.

<br/>

## 무엇으로 바꾸나
| 이벤트 | 이전 타입 | 바꿀 타입 |
|---|---|---|
| `onSubmit` | `FormEvent<HTMLFormElement>` | `SubmitEvent<HTMLFormElement>` |
| `onChange` | `FormEvent<HTMLInputElement>` | `ChangeEvent<HTMLInputElement>` |
| `onInput` | `FormEvent<HTMLInputElement>` | `InputEvent<HTMLInputElement>` |
| 종류를 특정할 수 없을 때 | `FormEvent` | `SyntheticEvent` |

```tsx
import type { SubmitEvent, ChangeEvent } from 'react';

const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  console.log(formData.get('email'), e.submitter);
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

export const Form = () => (
  <form onSubmit={handleSubmit}>
    <input name="email" onChange={handleChange} />
    <button type="submit">가입</button>
  </form>
);
```

19.2.9와 19.2.10의 타입 정의를 직접 비교해 `onSubmit`, `onChange`, `onInput`이 모두 `FormEventHandler`에서 각자의 타입으로 바뀐 것을 확인했다. 위 코드는 `@types/react` 19.3.0, TypeScript 5.6에서 `strict` 옵션으로 타입 검사를 통과했다. 같은 환경에서 `FormEvent<HTMLFormElement>`로 쓴 핸들러도 오류 없이 통과하고, 에디터에 deprecated 경고만 표시된다.

`SubmitEvent`는 브라우저 전역 타입에도 같은 이름이 있다. React 핸들러에 쓸 때는 위처럼 `react`에서 가져오거나 `React.SubmitEvent`로 써야 React의 이벤트 타입이 잡힌다.

<br/>

## 참고
- [React 공식 문서: form](https://ko.react.dev/reference/react-dom/components/form)
