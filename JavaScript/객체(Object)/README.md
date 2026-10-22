## 객체 속성에 접근하는 두 방법
- 객체에 담긴 값을 키(속성(property) 이름)로 꺼내거나 바꾸는 방법
- 점 표기법(`obj.key`)과 대괄호 표기법(`obj['key']`) 두 가지가 있다
- 키를 코드에 그대로 적을 수 있으면 점 표기법, 키가 변수에 들어 있거나 식별자로 쓸 수 없는 이름(공백, 하이픈이 있거나 숫자로 시작)이면 대괄호 표기법을 쓴다

### 객체 (Object)
사전적 의미는 대상, 물체다. 눈앞에 있어서 가리킬 수 있는 하나의 것을 말한다.
자바스크립트에서는 이름(키)과 값을 짝지어 묶어 둔 값을 말한다. 사람 한 명을 이름, 나이, 좋아하는 색처럼 여러 정보의 묶음으로 나타낼 수 있다.

서랍장과 같다. 서랍마다 이름표(키)가 붙어 있고, 이름표를 보고 서랍을 열어 안의 물건(값)을 꺼낸다.

<br/>

## 점 표기법
`객체.키` 로 쓴다. 짧고 읽기 쉬워서 가장 많이 쓴다.

```js
const user = { name: 'Kim', 'favorite color': 'blue' };

console.log(user.name); // Kim
```

점 뒤에는 키 이름을 코드에 그대로 적어야 한다. 그래서 두 가지 경우에는 쓸 수 없다.

- 키 이름이 식별자 규칙에 맞지 않을 때. 공백이나 하이픈이 들어 있거나 숫자로 시작하는 키(`favorite color`, `1`)는 `user.favorite color` 처럼 쓸 수 없다
- 키 이름이 변수에 들어 있을 때. `user.key` 는 변수 `key` 의 값이 아니라 이름이 `'key'` 인 속성을 찾는다

<br/>

## 대괄호 표기법
`객체[식]` 로 쓴다. 대괄호 안의 식을 먼저 계산하고, 그 결과를 문자열로 바꿔 키로 쓴다. 그래서 변수, 공백이 든 이름, 숫자 키를 모두 쓸 수 있다. 단, 결과가 심볼(Symbol)이면 문자열로 바꾸지 않고 심볼 그대로 키로 쓴다. [이터레이션](../이터레이션(Iteration)) 노트의 `obj[Symbol.iterator]` 가 이런 경우다.

```js
const user = { name: 'Kim', 'favorite color': 'blue', 1: 'one' };

console.log(user['favorite color']); // blue

const key = 'name';
console.log(user[key]);  // Kim
console.log(user.key);   // undefined ('key'라는 속성을 찾는다)

console.log(user[1], user['1']); // one one (숫자 1도 문자열 '1'로 바뀌어 같은 키가 된다)
```

키를 상황에 따라 바꿔야 할 때, 예를 들어 반복문으로 여러 키를 돌거나 함수 인수로 받은 키로 값을 꺼낼 때 대괄호 표기법을 쓴다.

객체를 만들 때도 대괄호로 키를 계산할 수 있다(계산된 속성 이름, computed property name).

```js
const field = 'age';
const person = { [field]: 20 };

console.log(person); // { age: 20 }
```

<br/>

## 없는 키에 접근하면
없는 키를 읽으면 오류가 나지 않고 `undefined` 가 나온다. 하지만 `undefined` 의 속성을 다시 읽으면 TypeError가 난다. 중간 값이 없을 수도 있으면 ES2020에 들어온 옵셔널 체이닝(`?.`)을 쓴다. 앞의 값이 `null` 이나 `undefined` 면 더 읽지 않고 `undefined` 를 돌려준다.

```js
const user = { name: 'Kim' };

console.log(user.address);        // undefined
console.log(user.address?.city); // undefined
// user.address.city 는 TypeError (Node.js 메시지: Cannot read properties of undefined (reading 'city'))
```

<br/>

## 참고 자료
- [MDN: 속성 접근자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Property_accessors)
- 예시는 Node.js v22.13.0에서 실행해 결과를 확인했다

<br/>

## 더 볼 것 (TODO)
- `Object.keys`, `Object.values`, `Object.entries` 로 객체 돌기
- 객체 복사: 얕은 복사와 깊은 복사, `structuredClone`
- 구조 분해 할당과 스프레드로 객체 다루기
