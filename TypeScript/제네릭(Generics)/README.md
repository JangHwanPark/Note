## 제네릭이란 ?
- 타입을 매개변수처럼 받아서, 함수나 클래스를 쓰는 쪽이 어떤 타입으로 쓸지 정하게 하는 기능
- 한 번 작성한 코드를 여러 타입에 다시 쓰면서도, 타입 검사는 그대로 받을 수 있다
- 타입이 정해지고 검사되는 것은 실행할 때가 아니라 컴파일할 때다. 실행되는 자바스크립트에는 제네릭이 남지 않는다

### 제네릭 (Generic)
사전적 의미는 일반적인, 포괄적인이다. 특정한 하나가 아니라 같은 종류 전체에 두루 해당한다는 뜻이다.
프로그래밍에서 제네릭은 특정 타입 하나에 묶이지 않고 여러 타입에 두루 쓸 수 있는 코드를 말한다. 코드는 한 번만 쓰고, 어떤 타입으로 쓸지는 쓰는 쪽이 정한다.

택배 상자에 붙이는 내용물 라벨과 같다. 상자 모양은 하나지만, 라벨에 "책"이라고 쓰면 그 상자에는 책만 들어가고 꺼낼 때도 책이 나온다고 믿을 수 있다. 제네릭의 `<T>` 가 이 라벨 칸이다.

<br/>

## 왜 필요할까
받은 값을 그대로 돌려주는 함수를 생각해 보자. 제네릭 없이 만드는 방법은 두 가지인데, 둘 다 문제가 있다.

### any로 만들면 타입 검사를 잃는다
```ts
function identity(value: any): any {
  return value;
}

const result = identity(10); // result는 any
result.toUpperCase();        // 컴파일은 통과
                             // 실행하면 TypeError: result.toUpperCase is not a function
```

숫자를 넣었다는 정보가 반환값에서 사라진다. `any` 를 쓰면 왜 위험한지는 [any와 never 타입](../any와%20never%20타입(any%20and%20never%20Types)/README.md) 노트에 정리했다.

### 타입을 하나로 정하면 다른 타입을 못 쓴다
```ts
function identity(value: number): number {
  return value;
}

identity(10);      // 정상
identity("Hello");
// error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

타입 검사는 되지만, 문자열용 함수를 또 만들어야 한다.

### 제네릭으로 만들면 둘 다 얻는다
```ts
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(10); // num은 number
const str = identity("Hello");    // T를 적지 않으면 string으로 정해진다

console.log(num.toFixed(2));      // 10.00
console.log(str.toUpperCase());   // HELLO
```

`T` 는 타입 매개변수(Type Parameter)라고 부른다. 함수의 매개변수가 값을 받듯 `T` 는 타입을 받는다. `identity<number>(10)` 처럼 직접 적을 수도 있고, 적지 않으면 컴파일러가 넘긴 값을 보고 정한다. 이것을 타입 추론(Type Inference)이라고 한다. 들어온 타입이 그대로 반환 타입이 되므로 숫자를 넣으면 숫자가 나온다는 정보가 유지된다.

<br/>

## 어디에 쓸 수 있을까
### 제네릭 인터페이스
```ts
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 };
const stringBox: Box<string> = { value: "Hello" };
```

`Box` 라는 모양은 하나지만, `value` 에 무엇이 들어갈지는 쓰는 쪽이 정한다.

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
stringStorage.remove("Apple");
console.log(stringStorage.getData()); // [ 'Banana' ]
```

`new DataStorage<string>()` 으로 만든 저장소에는 문자열만 넣을 수 있다. 숫자를 넣으려 하면 컴파일 오류가 난다.

### 타입 매개변수 여러 개
```ts
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const person = merge({ name: "Alice" }, { age: 25 });
console.log(person.name, person.age); // Alice 25
```

타입 매개변수는 여러 개 둘 수 있다. `T & U` 는 교차 타입(Intersection Type)이다. Intersection의 사전적 의미는 교차, 겹치는 부분이다. 값의 집합으로 보면 `T & U` 는 T의 조건과 U의 조건을 모두 만족하는 겹치는 부분이다. 두 조건을 모두 만족해야 하므로, 속성으로 보면 양쪽 속성을 모두 가진다. 그래서 결과에서 `name` 과 `age` 를 모두 쓸 수 있다.

### 배열 요소 타입 유지
```ts
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(getFirstElement([10, 20, 30]));   // 10 (number | undefined)
console.log(getFirstElement<string>([]));     // undefined
```

넘긴 배열의 요소 타입이 그대로 반환 타입이 된다. 빈 배열이면 `undefined` 가 나오므로 반환 타입에 함께 적었다.

<br/>

## 제네릭 제한하기
### 제약 (Constraint)
사전적 의미는 조건을 붙여 자유를 제한함이다.
제네릭은 기본적으로 어떤 타입이든 받는다. 그런데 함수 안에서 `length` 처럼 특정 속성을 써야 한다면, 그 속성이 있는 타입만 받도록 범위를 좁혀야 한다. 이것을 제약이라고 하고 `extends` 로 적는다.

### extends로 범위 좁히기
```ts
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("Hello");          // 5
logLength([1, 2, 3]);        // 3
logLength({ length: 10 });   // 10
logLength(100);
// error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

`T extends { length: number }` 는 `length` 속성이 숫자인 타입만 `T` 가 될 수 있다는 뜻이다. 택배 상자 비유로 보면 라벨에 아무거나 쓰지 못하게 하고 "길이를 잴 수 있는 물건"만 쓰게 하는 것이다.

### keyof와 함께 쓰기
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice" };
console.log(getProperty(user, "name")); // Alice
console.log(getProperty(user, "id"));   // 1
getProperty(user, "email");
// error TS2345: Argument of type '"email"' is not assignable to parameter of type '"name" | "id"'.
```

`keyof T` 는 `T` 의 속성 이름들을 모은 타입이다. `K extends keyof T` 라고 제한하면 객체에 실제로 있는 속성 이름만 넘길 수 있다. 반환 타입 `T[K]` 는 그 속성의 타입이라서, `"name"` 을 넘기면 문자열, `"id"` 를 넘기면 숫자가 나온다.

<br/>

## 타입 매개변수 기본값 (Generic Parameter Defaults)
함수 매개변수의 기본값처럼, 타입 매개변수에도 적지 않았을 때 쓸 타입을 정해 둘 수 있다. 자주 쓰는 타입을 기본값으로 두면 쓰는 쪽이 매번 적지 않아도 된다.

```ts
function createPair<T = string, U = number>(a: T, b: U) {
  return { a, b };
}

const pair = createPair<boolean>(true, 10);
console.log(pair); // { a: true, b: 10 }
// pair의 타입은 { a: boolean; b: number } (U는 기본값 number)

const pair2 = createPair(true, "x");
// pair2의 타입은 { a: boolean; b: string } (둘 다 추론)
```

타입 인자를 하나도 적지 않으면 기본값보다 추론이 먼저다. 그래서 `pair2` 의 U는 `"x"` 를 보고 string으로 정해진다. 앞쪽 일부만 적으면 나머지는 추론하지 않고 기본값을 쓴다. `createPair<boolean>(true, 10)` 의 U가 number인 것은 10을 보고 추론한 것이 아니라 기본값이기 때문이다.

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 제네릭 (Generic) | 일반적인, 포괄적인 | 쓰는 쪽이 타입을 정하는 재사용 코드 |
| 타입 매개변수 (Type Parameter) | Parameter: 매개변수, 결과를 정하는 조건 값 | `<T>` 처럼 타입이 들어갈 빈칸 |
| 타입 추론 (Type Inference) | 미루어 생각함 | 적지 않아도 컴파일러가 타입을 알아내는 것 |
| 제약 (Constraint) | 조건을 붙여 제한함 | `extends` 로 `T` 가 될 수 있는 타입을 좁히기 |
| 교차 타입 (Intersection Type) | 교차, 겹치는 부분 | 여러 타입의 조건을 모두 만족해 양쪽 속성을 다 가진 타입 |
| keyof | 무엇의 키 | 객체 타입의 속성 이름들을 모은 타입 |
| 타입 매개변수 기본값 (Generic Parameter Defaults) | 정해 둔 값 | 적지 않았을 때 쓸 타입 |

<br/>

## 더 볼 것 (TODO)
- 조건부 타입: `T extends U ? X : Y`
- 제네릭 타입 추론이 실패하는 경우와 직접 적어야 할 때

<br/>

[TypeScript 목차](../README.md)
