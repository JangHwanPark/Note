## any와 never 타입이란 ?
- 타입스크립트의 특수한 타입으로, 타입 검사를 어떻게 다루는지가 서로 정반대다
- `any` 는 어떤 값이든 받아들이고 타입 검사를 꺼 버리는 타입이다
- `never` 는 어떤 값도 될 수 없는 가장 좁은 타입으로, 절대 일어나지 않는 경우를 나타낸다. 반대로 어떤 값이든 될 수 있는 가장 넓은 타입은 `unknown` 이고, `any` 는 이 규칙 밖에서 검사를 꺼 버리는 예외다

<br/>

## any 타입
### any
사전적 의미는 어떤 것이든, 아무것이나다.
타입스크립트에서 `any` 는 어떤 타입의 값이든 담을 수 있고, 그 값을 어디에 넘겨도 컴파일러가 검사하지 않는 타입이다. 이름 그대로 아무것이나 허용한다.

### 왜 생겼을까
타입스크립트는 자바스크립트 위에 타입을 얹은 언어라서, 타입이 없던 기존 자바스크립트 코드를 조금씩 옮겨 올 수 있어야 했다. `any` 는 아직 타입을 정하지 못한 부분을 일단 통과시키는 탈출구 역할을 한다.

### 어떻게 동작할까
`any` 로 선언한 변수에는 무엇이든 넣을 수 있고, 그 값을 다른 타입의 변수에 넣어도 오류가 나지 않는다(뒤에서 볼 `never` 만 예외다). 존재하지 않는 메서드를 불러도 컴파일은 통과한다. 문제는 실행할 때 드러난다.

```ts
let value: any = 10;
value = "hello";
value = true;

const n: number = value; // 컴파일 오류 없음
console.log(n);          // true (number 변수에 불리언이 들어 있다)

value.toFixed(2);        // 컴파일은 통과
                         // 실행하면 TypeError: value.toFixed is not a function
```

공항 검색대를 건너뛰는 통로와 같다. 들어갈 때는 빠르지만, 가방에 무엇이 들었는지는 비행기 안에서 문제가 생긴 뒤에야 알게 된다. 그래서 `any` 는 되도록 쓰지 않는다.

직접 적지 않아도 `any` 가 들어오는 경우가 있다. `JSON.parse()` 의 반환 타입이 `any` 라서, 그 결과를 그대로 쓰면 검사 없이 코드 전체로 퍼진다.

### any 대신 unknown
`unknown` 의 사전적 의미는 알려지지 않은, 미지의다. 타입스크립트에서도 이름 그대로 무엇인지 아직 모르는 값이라서, 무엇인지 확인하기 전에는 쓸 수 없다.
어떤 값이든 담을 수 있다는 점은 `any` 와 같다. 다른 점은 타입을 확인하는 조건문(타입 가드, Type Guard)을 거친 뒤에야 그 타입의 메서드를 쓸 수 있다는 것이다.

```ts
let input: unknown = "hi";

input.toUpperCase();
// error TS18046: 'input' is of type 'unknown'.

if (typeof input === "string") {
  console.log(input.toUpperCase()); // HI
}
```

`JSON.parse()` 결과도 `unknown` 으로 받아 확인한 뒤 쓰면 안전하다.

```ts
const data: unknown = JSON.parse('{"name":"Alice"}');

if (typeof data === "object" && data !== null && "name" in data) {
  console.log(data.name); // Alice
}
```

받는 값의 타입을 정말 모를 때는 `any` 대신 `unknown` 을 쓰면, 확인을 빼먹는 실수를 컴파일러가 막아 준다.

<br/>

## never 타입
### never
사전적 의미는 결코 ~않다, 한 번도 ~않다이다.
타입스크립트에서 `never` 는 어떤 값도 속하지 않는 타입이다. 값이 결코 생기지 않는 자리, 즉 절대 일어나지 않는 경우를 나타낸다.

### 왜 필요할까
코드에는 실행이 끝까지 가지 않는 경우가 있다. 항상 예외를 던지는 함수는 값을 돌려주지 않고, 모든 경우를 다 처리한 뒤의 `else` 는 실행될 일이 없다. `never` 는 이런 자리를 타입으로 표시해서, 정말 일어나지 않는지 컴파일러가 확인하게 한다.

### 반환하지 않는 함수
항상 예외를 던지거나 끝나지 않는 함수는 반환 타입을 `never` 로 적는다. 값을 돌려주는 일 자체가 없기 때문이다.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

화살표 함수는 적지 않아도 `never` 로 추론되지만, `function` 선언문은 적지 않으면 `void` 로 추론된다. 그래서 위 예시처럼 직접 적는다.

### 모든 경우를 처리했는지 검사하기
`never` 가 가장 쓸모 있는 곳은 유니온 타입의 모든 경우를 빠짐없이 처리했는지 확인할 때다. 유니온 타입(Union Type)은 `A | B` 처럼 여러 타입 중 하나라는 뜻의 타입이다. Union의 사전적 의미는 결합, 합침이다.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    default: {
      const unreachable: never = shape; // 여기까지 오는 Shape는 없다
      return unreachable;
    }
  }
}
```

`switch` 의 `case` 를 지날 때마다 컴파일러는 남은 경우를 하나씩 지운다. 이것을 타입 좁히기(Narrowing)라고 한다. `default` 에 도착하면 남은 경우가 없으므로 `shape` 의 타입은 `never` 가 되고, 위 코드는 오류 없이 통과한다. 나중에 누군가 `Shape` 에 삼각형을 추가하고 `case` 를 빠뜨리면 컴파일 오류가 난다.

```ts
// Shape에 { kind: "triangle"; base: number; height: number } 를 추가한 뒤
// error TS2322: Type '{ kind: "triangle"; base: number; height: number; }' is not assignable to type 'never'.
```

체크리스트의 마지막 칸에 "여기에 남은 항목이 있으면 안 됨"이라고 적어 둔 것과 같다. 새 항목이 생겼는데 처리하지 않으면 그 칸에서 걸린다.

### 할당 규칙
`never` 에는 `never` 말고는 어떤 타입의 값도 넣을 수 없다. `any` 도 넣을 수 없다. 앞의 `default` 예시가 통과한 것은 그 자리의 `shape` 가 이미 `never` 였기 때문이다.
반대로 `never` 값은 어떤 타입에도 넣을 수 있다. 실제로 그런 값이 만들어질 일이 없으니 어디에 넣어도 문제가 생기지 않기 때문이다.

```ts
const y: never = 1;
// error TS2322: Type 'number' is not assignable to type 'never'.

const x: number = fail("error"); // 오류 없음 (실행하면 fail이 예외를 던진다)
```

<br/>

## any, unknown, never 비교
| 특성 | `any` | `unknown` | `never` |
| --- | --- | --- | --- |
| 뜻 | 어떤 값이든, 검사 없음 | 어떤 값이든, 확인 전엔 못 씀 | 어떤 값도 될 수 없음 |
| 이 타입에 넣기 | 무엇이든 | 무엇이든 | `never` 말고는 넣을 수 없음(`any` 도 안 됨) |
| 이 타입을 다른 곳에 넣기 | `never` 를 뺀 어디에든(검사 없음) | `any`, `unknown` 에만 | 어디에든 |
| 메서드 바로 쓰기 | 됨(검사 없음) | 안 됨, 타입 가드 뒤에 됨 | 쓸 일이 없음 |
| 쓰는 곳 | 타입을 아직 정하지 못한 코드 | 타입을 모르는 바깥 값 | 반환하지 않는 함수, 모든 경우 처리 검사 |
| 권장 여부 | 되도록 피한다 | 모르는 값은 이것으로 받는다 | 위 두 자리에 쓴다 |

`any` 는 타입 검사를 포기하는 쪽이고, `unknown` 과 `never` 는 타입 검사 안에서 각각 가장 넓은 끝과 가장 좁은 끝을 맡는다.

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| any | 어떤 것이든 | 무엇이든 받고 검사하지 않는 타입 |
| unknown | 알려지지 않은, 미지의 | 무엇이든 받지만 확인한 뒤에만 쓸 수 있는 타입 |
| never | 결코 ~않다 | 어떤 값도 될 수 없는 타입 |
| 유니온 타입 (Union Type) | Union: 결합, 합침 | 여러 타입 중 하나라는 뜻의 타입 |
| 타입 좁히기 (Narrowing) | Narrow: 좁히다 | 조건을 지날 때마다 가능한 타입을 줄여 가는 것 |
| 타입 가드 (Type Guard) | Guard: 지키다, 경비원 | 조건문으로 검사해 통과한 값만 그 타입으로 다루게 하는 것 |

<br/>

## 더 볼 것 (TODO)
- `void` 와 `never` 의 차이

<br/>

[TypeScript 목차](../README.md)
