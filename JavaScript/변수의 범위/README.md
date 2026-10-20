## 전역 변수 (Global Variable)
**전역 스코프(Global Scope)**  
코드의 어느곳에서든 접근이 가능하기 때문에 전역 스코프에 선언한 변수는 모든 함수와 블록에서 사용할 수 있다.

```javascript
let globalValue = 'Global Scope';
const test = () => console.log(globalValue);

test();
console.log(globalValue);
```

<br/>

## 지역 변수 (Local Variable)
<br>**함수 스코프(Function Scope)**  
함수 내에서 정의된 변수는 함수 내부에서만 유효하며, 함수 외부에서 접근할 수 없다.

```javascript
const functionScope = () => {
  let functionValue = "function value";
  return functionValue;
}

console.log(functionScope())
console.log(functionValue) // Error
```

<br>**블록 스코프(Block Scope)**  
ES6(ECMAScript 2015)에서 도입되었으며, let 과 const 로 선언된 변수는 블록 `{}`내에서만 유요하다. (중괄호 외부에서는 사용할 수 없다)

```javascript
if (true) {
  let count = true;
  console.log(count)
}
console.log(count)
```

<br/>

## 범위 (Scope)
스코프는 프로그램에서 변수와 함수가 유효한 범위를 지정하는 개념이다. (즉, 사용 가능 범위) 자바스크립트에서 스코프는 Global Scope, Function Scope, Block Scope 로 나뉜다.

<br/>

## 같은 변수 이름의 사용 (Shadowing)
또한 전역 스코프와 같은 이름으로 블록스코프에서 선언 하더라도,
블록스코프 내부에서 선언한 변수가 우선적으로 출력된다.

이를 함수밖의 변수는 잠시 그림자로 가려지는것 처럼 가려지기때문에 블록 스코프와 변수의 `섀도잉 (shadowing)`이라고 한다.
- 블록 스코프 뿐 아니라 다른 환경에서도 `섀도잉`이 발생한다.

```javascript
let count = 1
if (count === 1) {
  let count = true;
  console.log(count)
}
console.log(count)
```

<br/>

## 호이스팅 (Hoisting)
hoist는 "끌어올리다"라는 뜻이다. 자바스크립트에서 호이스팅은 변수와 함수 선언이 스코프 맨 위로 끌어올려진 것처럼 동작하는 현상을 말한다. 코드가 실제로 옮겨지는 것은 아니고, 엔진이 코드를 실행하기 전에 스코프 안의 선언을 먼저 등록하기 때문에 생긴다.

### var
var로 선언한 변수는 등록과 동시에 undefined로 초기화된다. 그래서 선언보다 위에서 읽어도 오류 없이 undefined가 나온다.

```javascript
console.log(a); // undefined
var a = 1;
console.log(a); // 1
```

### let, const
let과 const도 호이스팅되지만 초기화는 선언문에 도달했을 때 일어난다. 스코프 시작부터 선언문까지의 구간을 TDZ(Temporal Dead Zone, 일시적 사각지대)라고 하고, 이 구간에서 접근하면 ReferenceError가 난다.

```javascript
console.log(b); // ReferenceError
let b = 2;
```

### 함수 선언문과 함수 표현식
함수 선언문은 함수 전체가 호이스팅되어 선언보다 위에서 호출할 수 있다. 변수에 함수를 담는 함수 표현식은 변수의 규칙을 따르므로 선언 전에는 호출할 수 없다.

```javascript
hello(); // "hello"
function hello() {
  console.log("hello");
}

bye(); // ReferenceError
const bye = () => console.log("bye");
```

함수 표현식을 var로 선언했다면 bye는 undefined라서 호출할 때 TypeError가 난다.
