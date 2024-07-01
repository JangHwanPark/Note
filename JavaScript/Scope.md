### 스코프 (Scope)

---
스코프는 프로그램에서 변수와 함수가 유효한 범위를 지정하는 개념이다. (즉, 사용 가능 범위) 자바스크립트에서 스코프는 Global Scope, Function Scope, Block Scope 로 나뉜다.

**전역 스코프(Global Scope)**  
코드의 어느곳에서든 접근이 가능하기 때문에 전역 스코프에 선언한 변수는 모든 함수와 블록에서 사용할 수 있다.

```javascript
let globalValue = 'Global Scope';
const test = () => console.log(globalValue);

test();
console.log(globalValue);
```

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