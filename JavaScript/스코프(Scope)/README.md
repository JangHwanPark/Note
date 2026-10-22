## 스코프란 ?
- 변수와 함수 이름을 어디서 쓸 수 있는지 정하는 범위
- 자바스크립트의 스코프는 전역 스코프, 함수 스코프, 블록 스코프로 나뉜다. ES 모듈 파일은 여기에 모듈 스코프가 더해진다
- 안쪽 스코프에서는 바깥 이름을 쓸 수 있지만, 바깥에서는 안쪽 이름을 쓸 수 없다

### 스코프 (Scope)
사전적 의미는 범위, 영역이다. 어떤 일이나 힘이 미치는 테두리를 가리킨다.
프로그래밍에서는 어떤 이름(변수, 함수)이 보이고 쓸 수 있는 코드의 영역을 말한다. 같은 이름이라도 어느 스코프에 선언했는지에 따라 보이는 곳이 달라진다.

스코프는 건물의 층과 같다. 각 층(안쪽 스코프)에서는 로비(전역)에 걸린 안내판을 볼 수 있지만, 로비에서는 각 층 사무실 안의 메모를 볼 수 없다.

### 왜 필요할까
모든 변수가 어디서나 보인다면 서로 다른 함수가 같은 이름을 쓰는 순간 값을 덮어쓴다. 스코프로 이름이 보이는 범위를 좁혀 두면 함수 안에서 쓴 `count` 와 다른 함수의 `count` 가 부딪히지 않는다. 변수를 쓰는 곳 가까이에 두게 되어 코드를 읽기도 쉬워진다.

<br/>

## 전역 스코프 (Global Scope)
어떤 함수나 블록에도 속하지 않은 맨 바깥 영역이다. 여기서 선언한 변수(전역 변수, Global Variable)는 모든 함수와 블록에서 쓸 수 있다.

이 설명은 브라우저의 일반 `<script>` 를 기준으로 한다. ES 모듈 파일(`<script type="module">`, `import` 를 쓰는 파일)의 맨 바깥은 그 파일 안에서만 보이는 모듈 스코프다. Node.js에서 실행하는 파일도 맨 바깥 변수가 다른 파일에 보이지 않는다. 아래 예시는 한 파일 안에서의 동작이라 어느 쪽이든 결과가 같다.

```javascript
let globalValue = 'Global Scope';
const test = () => console.log(globalValue);

test();                   // Global Scope
console.log(globalValue); // Global Scope
```

어디서나 바꿀 수 있다는 점이 편하면서도 위험하다. 어느 함수가 값을 바꿨는지 찾기 어려우므로 전역 변수는 꼭 필요한 것만 둔다.

<br/>

## 지역 스코프 (Local Scope)
함수나 블록 안쪽 영역이다. 여기서 선언한 변수를 지역 변수(Local Variable)라고 한다.

### 함수 스코프 (Function Scope)
함수 안에서 선언한 변수는 그 함수 안에서만 쓸 수 있다.

```javascript
const functionScope = () => {
  let functionValue = "function value";
  return functionValue;
}

console.log(functionScope()); // function value
console.log(functionValue);   // ReferenceError: functionValue is not defined
```

### 블록 스코프 (Block Scope)
ES2015(ES6)에서 들어온 `let` 과 `const` 는 중괄호 `{}` 블록 안에서만 쓸 수 있다. `if`, `for` 의 중괄호도 블록이다.

```javascript
if (true) {
  let count = true;
  console.log(count); // true
}
console.log(count);   // ReferenceError: count is not defined
```

`var` 는 블록을 무시하고 함수 스코프만 따른다. 그래서 `if` 블록 안에서 선언해도 바깥에서 보인다. 블록 스코프가 생긴 뒤로 `var` 대신 `let`, `const` 를 쓰는 이유 중 하나다.

```javascript
if (true) {
  var v = 'var';
}
console.log(v); // var
```

<br/>

## 섀도잉 (Shadowing)
shadow의 사전적 의미는 그림자, 그늘이다.
안쪽 스코프에서 바깥과 같은 이름으로 변수를 선언하면, 안쪽에서는 안쪽 변수가 쓰이고 바깥 변수는 그림자에 가려진 것처럼 보이지 않는다. 이것을 섀도잉이라고 한다. 바깥 변수가 바뀌는 것은 아니다.

```javascript
let count = 1;
if (count === 1) {
  let count = true;
  console.log(count); // true (블록 안의 count)
}
console.log(count);   // 1 (바깥 count는 그대로)
```

블록뿐 아니라 함수 안에서 바깥과 같은 이름의 변수나 매개변수를 선언할 때도 섀도잉이 일어난다.

<br/>

## 호이스팅 (Hoisting)
hoist의 사전적 의미는 끌어올리다이다. 자바스크립트에서 호이스팅은 변수와 함수 선언이 스코프 맨 위로 끌어올려진 것처럼 동작하는 현상을 말한다. 코드가 실제로 옮겨지는 것은 아니고, 엔진이 코드를 실행하기 전에 스코프 안의 선언을 먼저 등록하기 때문에 생긴다.

### var
`var` 로 선언한 변수는 등록과 동시에 `undefined` 로 초기화된다. 그래서 선언보다 위에서 읽어도 오류 없이 `undefined` 가 나온다.

```javascript
console.log(a); // undefined
var a = 1;
console.log(a); // 1
```

### let, const
`let` 과 `const` 도 호이스팅되지만 초기화는 선언문에 도달했을 때 일어난다. 스코프에 들어간 때부터 선언문이 실행될 때까지의 시간 동안 접근하면 ReferenceError가 난다. 이 구간을 일시적 사각지대(TDZ, Temporal Dead Zone)라고 한다. 코드의 위치가 아니라 실행되는 시점으로 정해지기 때문에 temporal(시간의)이라는 말이 붙었다.

```javascript
console.log(b); // ReferenceError: Cannot access 'b' before initialization (V8 기준 메시지)
let b = 2;
```

Node.js와 Chrome이 쓰는 V8 엔진의 메시지가 `is not defined` 가 아니라 `before initialization` 인 점이 호이스팅의 흔적이다. 오류 메시지 문구는 엔진마다 다르다. 엔진은 `b` 가 있다는 것은 알지만 아직 초기화되지 않았다고 알려 준다.

### 함수 선언문과 함수 표현식
함수 선언문은 함수 전체가 호이스팅되어 선언보다 위에서 호출할 수 있다. 변수에 함수를 담는 함수 표현식은 변수의 규칙을 따르므로 선언 전에는 호출할 수 없다.

```javascript
hello(); // hello
function hello() {
  console.log("hello");
}

bye(); // ReferenceError: Cannot access 'bye' before initialization
const bye = () => console.log("bye");
```

함수 표현식을 `var` 로 선언했다면 그 시점의 값이 `undefined` 라서 `TypeError: bye is not a function` 이 난다.

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 스코프 (Scope) | 범위, 영역 | 이름이 보이는 코드 영역 |
| 섀도잉 (Shadowing) | 그림자로 가림 | 안쪽 같은 이름이 바깥 이름을 가림 |
| 호이스팅 (Hoisting) | 끌어올림 | 선언을 먼저 등록해 위로 올린 것처럼 동작 |
| 일시적 사각지대 (TDZ, Temporal Dead Zone) | 시간상의 사각지대 | `let`, `const` 를 선언 전에 못 쓰는 구간 |

예시의 출력은 Node.js 22.13.0(V8 엔진)에서 실행한 결과다.

<br/>

## 더 볼 것 (TODO)
- 렉시컬 스코프를 더 깊게: 렉시컬 스코프의 기본 뜻과 스코프 체인은 [클로저](../클로저(Closure)) 노트에서 다룬다. `eval`, `with` 처럼 이 규칙을 흔드는 문법은 아직 정리하지 않았다
- 전역 객체(`window`, `globalThis`)와 `var` 전역 변수의 관계
- 모듈 스코프 자세히: ES 모듈과 CommonJS에서 맨 바깥 변수가 어떻게 다뤄지는지
