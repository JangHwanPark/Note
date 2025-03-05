> ## 제네릭(Generics)
컴파일 시점에 타입을 지정하지 않고, 실행될 때 사용할 타입을 지정할 수 있도록 하는 타입 시스템의 한 기능.   
재사용 가능한 타입 안정성이 높은 코드를 작성할 수 있도록 도와줌.

<br/>

> ## 왜 제네릭이 필요한가?
제네릭을 사용하지 않으면 타입의 유연성과 안정성을 동시에 유지하기 어렵다.   

### **타입을 지정하지 않은 함수**
```ts
function identity(value: any): any {
  return value;
}

const result = identity(10); // 결과가 any 타입 -> 타입 안전성 X
console.log(result.toUpperCase()); // 런타임 에러 발생 가능!
```
identity 함수의 반환 타입이 any이므로, 타입 안정성을 보장할 수 없다.  

<br/>

### 특정 타입으로 제한한 함수
```ts
function identity(value: number): number {
  return value;
}

const result = identity(10); // ✅ 정상 작동
console.log(result.toFixed(2)); // ✅ 정상 작동
```
이 방법은 타입 안정성을 보장하지만, 숫자 이외의 타입을 처리할 수 없다.

<br/>

## 제네릭을 사용한 개선된 코드
제네릭을 사용하면 입력된 타입을 기반으로 반환 타입을 유연하게 지정할 수 있다.
```ts
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(10); // number 타입 유지
const str = identity<string>("Hello"); // string 타입 유지

console.log(num.toFixed(2)); // ✅ 정상 작동
console.log(str.toUpperCase()); // ✅ 정상 작동
```
제네릭 <T> 를 사용하면 다양한 타입을 안전하게 처리할 수 있다.

<br/>

> ## 제네릭 기본 문법
### 제네릭 함수
```ts
function func<T>(param: T): T {
  return param;
}

const result = func<number>(100); // result는 number 타입
const result2 = func<string>("Hello"); // result2는 string 타입
```
<T>는 타입을 나타내며, 함수가 호출될 때 자동으로 타입이 결정된다.

<br/>

### 제네릭 인터페이스
```ts
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 }; // number 타입
const stringBox: Box<string> = { value: "Hello" }; // string 타입
```
T를 사용하여 인터페이스가 다양한 타입을 받을 수 있도록 설정

<br/>

### 제네릭 클래스
```ts
class DataStorage<T> {
  private data: T[] = [];

  add(item: T) {
    this.data.push(item);
  }

  remove(item: T) {
    this.data = this.data.filter((el) => el !== item);
  }

  getData(): T[] {
    return this.data;
  }
}

const stringStorage = new DataStorage<string>();
stringStorage.add("Apple");
stringStorage.add("Banana");
console.log(stringStorage.getData()); // ["Apple", "Banana"]

const numberStorage = new DataStorage<number>();
numberStorage.add(42);
console.log(numberStorage.getData()); // [42]
```
클래스에서도 제네릭을 사용할 수 있으며, 타입 안정성을 유지하면서 유연한 데이터 구조를 만들 수 있다.

<br/>

> ## 제네릭 활용 예제
### 제네릭을 활용한 유틸리티 타입
```ts
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const person = merge({ name: "Alice" }, { age: 25 });
console.log(person.name); // "Alice"
console.log(person.age); // 25
```
두 개의 객체를 병합하면서도 타입을 유지할 수 있다.

<br/>

### 제네릭을 활용한 배열 처리
```ts
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const firstNumber = getFirstElement([10, 20, 30]); // 10 (number 타입)
const firstString = getFirstElement(["a", "b", "c"]); // "a" (string 타입)
```
배열 요소의 타입을 자동으로 추론하며, 유연하고 안전한 함수를 만들 수 있다.

<br/>

### keyof와 함께 사용하여 객체 속성 추출
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice" };
console.log(getProperty(user, "name")); // "Alice"
console.log(getProperty(user, "id")); // 1
```
keyof 키워드를 활용하면 객체에서 올바른 속성만 접근하도록 제한할 수 있다.

<br/>

## 제네릭의 제한 (Constraints)
제네릭은 기본적으로 모든 타입을 받을 수 있지만, 특정 타입으로 제한할 수도 있다.

<br/>

### extends 키워드를 사용한 제한
```ts
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("Hello"); // 5
logLength([1, 2, 3]); // 3
logLength({ length: 10 }); // 10
// logLength(100); // ❌ 오류 발생 (number는 length 속성이 없음)
```
제네릭을 특정 타입(여기서는 length 속성을 가진 타입)으로 제한할 수 있다.

<br/>

### 기본 타입 설정 (Default Type)
```ts
function createPair<T = string, U = number>(a: T, b: U) {
  return { a, b };
}

const pair1 = createPair(); // { a: string, b: number } (기본값 적용)
const pair2 = createPair<boolean, string>(true, "Yes"); // { a: boolean, b: string }
```
제네릭의 기본값을 설정하여 더 유연하게 사용할 수 있다.