## 클로저란 ?
- 함수와 그 함수가 선언된 렉시컬 환경(Lexical Environment)의 조합
- 함수는 자신이 선언된 곳의 변수를 기억하고 있어서, 선언된 스코프 밖에서 호출되어도 그 변수에 접근할 수 있다
- 바깥 함수가 끝난 뒤에도 변수를 유지하거나(상태 유지), 바깥에서 직접 건드리지 못하게 숨길 때(데이터 은닉) 쓴다

### 클로저 (Closure)
사전적 의미는 닫음, 폐쇄다.
프로그래밍에서는 함수가 바깥 변수들을 함께 감싸 닫아 둔 묶음을 말한다. 함수 본문만 따로 떠도는 것이 아니라, 필요한 바깥 변수까지 한 덩어리로 닫혀 있다는 뜻이다.

### 렉시컬 (Lexical)
사전적 의미는 어휘의, 낱말의다. 여기서는 코드에 적힌 글자 그대로, 즉 소스 코드상의 위치를 뜻한다.
렉시컬 스코프는 함수를 어디서 호출했는지가 아니라 코드 어디에 적었는지(선언했는지)로 바깥 스코프가 정해진다는 규칙이다. 클로저는 이 규칙 덕분에 생긴다.

클로저는 집을 떠난 뒤에도 들고 다니는 집 열쇠와 같다. 함수(사람)가 바깥 함수(집)를 떠나 다른 곳에서 호출되어도, 열쇠가 있으니 집 안의 변수(물건)를 꺼내 쓸 수 있다.

<br/>

## 렉시컬 환경 (Lexical Environment)
자바스크립트 엔진이 코드를 실행하면서 스코프에 들어갈 때마다 새로 만드는 구조다. 그 스코프에 선언된 식별자(변수, 함수 이름)와 값을 짝지어 기록한다. 명세(ECMAScript)에 정의된 내부 구조라서 코드에서 객체처럼 직접 꺼내 볼 수는 없다.

렉시컬 환경은 두 가지를 갖는다. 하나는 현재 스코프의 식별자와 값을 기록한 환경 레코드(Environment Record)이고, 다른 하나는 바로 바깥 스코프의 환경을 가리키는 외부 렉시컬 환경 참조(Outer Lexical Environment Reference)다.

변수를 찾을 때는 먼저 현재 환경 레코드를 보고, 없으면 외부 참조를 따라 바깥으로 한 단계씩 올라가며 찾는다. 이 연결을 스코프 체인(Scope Chain)이라고 부른다.

이 두 부분 나눔은 ES2020 명세까지의 표현이다. ES2021 명세부터는 별도의 렉시컬 환경 타입 없이 환경 레코드가 바깥 환경을 가리키는 `[[OuterEnv]]` 필드를 직접 갖는다. 이름만 정리됐을 뿐 바깥으로 올라가며 이름을 찾는 동작은 같다. 많은 책과 글이 아직 렉시컬 환경이라는 이름을 쓰므로 이 노트도 그 이름을 쓴다.

```javascript
function environmentOuter() {
  let a = 10; // environmentOuter의 환경 레코드에 기록됨

  function environmentInner() {
    let b = 20; // environmentInner의 환경 레코드에 기록됨
    // a는 자기 환경 레코드에 없으므로 외부 참조를 따라 environmentOuter에서 찾는다
    console.log(a, b);
  }

  environmentInner();
}

environmentOuter(); // 10 20
```

<br/>

## 클로저가 생기는 과정
함수는 만들어질 때 자신이 선언된 곳의 렉시컬 환경을 기억해 둔다. 나중에 함수를 호출하면 새 렉시컬 환경이 만들어지는데, 그 외부 참조가 바로 기억해 둔 환경을 가리킨다. 그래서 바깥 함수가 이미 끝났어도 안쪽 함수가 그 환경을 붙잡고 있는 한 바깥 변수는 사라지지 않는다.

```javascript
function createCounter() {
  let count = 0; // createCounter가 끝나도 아래 함수가 이 환경을 붙잡고 있다

  return function () {
    count++;
    console.log(count);
  };
}

const counter = createCounter(); // createCounter는 여기서 끝났다
counter(); // 1
counter(); // 2

const counter2 = createCounter(); // 호출할 때마다 새 환경이 생긴다
counter2(); // 1
```

`counter` 와 `counter2` 는 서로 다른 `count` 를 기억한다. `createCounter` 를 호출할 때마다 새 렉시컬 환경이 만들어지기 때문이다.

### 값을 복사하는 것이 아니라 변수를 가리킨다
클로저는 선언될 때의 값을 복사해 두는 것이 아니라 변수 자체를 가리킨다. 그래서 함수를 만든 뒤에 값이 바뀌면 바뀐 값이 보인다.

```javascript
let x = 1;
const show = () => console.log(x);
x = 2;
show(); // 2
```

<br/>

## 어디에 쓸까
### 데이터 은닉
바깥에서 직접 바꾸면 안 되는 값을 함수 안에 두고, 정해 둔 함수로만 다루게 할 수 있다.

```javascript
function createAccount() {
  let balance = 0;
  return {
    deposit(n) { balance += n; return balance; },
    get() { return balance; },
  };
}

const account = createAccount();
account.deposit(100);
console.log(account.get());   // 100
console.log(account.balance); // undefined (밖에서는 balance에 접근할 수 없다)
```

### 반복문과 클로저
`var` 는 블록 스코프를 무시하고 함수 스코프를 따른다([스코프](../스코프(Scope)) 노트 참고). 그래서 `var` 로 만든 반복 변수는 반복 전체가 하나의 변수를 함께 쓴다. 그래서 반복 안에서 만든 함수들은 모두 같은 `i` 를 가리키고, 반복이 끝난 뒤의 값 3을 본다. `let` 은 반복마다 새 변수를 만들어 각 함수가 자기 회차의 값을 기억한다.

```javascript
const withVar = [];
for (var i = 0; i < 3; i++) withVar.push(() => i);
console.log(withVar.map((f) => f())); // [ 3, 3, 3 ]

const withLet = [];
for (let j = 0; j < 3; j++) withLet.push(() => j);
console.log(withLet.map((f) => f())); // [ 0, 1, 2 ]
```

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 클로저 (Closure) | 닫음, 폐쇄 | 바깥 변수를 함께 닫아 둔 함수 |
| 렉시컬 환경 (Lexical Environment) | 어휘의 환경 | 스코프마다 이름과 값을 기록해 둔 구조 |
| 환경 레코드 (Environment Record) | 환경의 기록 | 현재 스코프의 이름과 값 목록 |
| 외부 렉시컬 환경 참조 | 바깥 환경을 가리킴 | 바깥 스코프로 올라가는 연결 |

예시의 출력은 Node.js 22.13.0에서 실행한 결과다.

<br/>

## 더 볼 것 (TODO)
- 클로저와 메모리: 붙잡힌 변수가 해제되지 않아 메모리가 남는 경우
- 오래된 클로저(stale closure): 클로저가 붙잡은 변수가 이미 지난 값을 가리키게 되는 경우 (React 훅에서 생기는 사례는 React 노트에서 따로 다룬다)
