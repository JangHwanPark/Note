## 이터레이션이란 ?
- 값이 여러 개 모인 자료를 처음부터 하나씩 차례로 꺼내 보는 일
- 자바스크립트는 이 일을 약속(프로토콜, protocol)으로 정해 두었고, 약속을 지키는 자료를 이터러블(iterable)이라 부른다
- 배열, 문자열, `Map`, `Set` 이 이터러블이고, 이터러블이면 `for...of`, 배열 구조 분해 할당, 배열과 함수 인수의 스프레드 문법을 쓸 수 있다. 객체 구조 분해와 객체 스프레드는 이터레이션과 상관없이 동작한다

### 이터레이션 (Iteration)
사전적 의미는 반복, 되풀이다.
프로그래밍에서는 같은 동작을 되풀이하며 자료의 값을 하나씩 차례로 꺼내는 일을 말한다. 꺼내 주는 쪽을 이터레이터(iterator, 반복자), 꺼낼 수 있는 자료를 이터러블(iterable, 반복 가능한 것)이라 부른다.

번호표 기계와 같다. 버튼(`next()`)을 누를 때마다 다음 번호가 한 장씩 나오고, 번호가 떨어지면 끝났다고 알려 준다.

<br/>

## 왜 필요할까
배열은 인덱스로, `Map` 은 `get()` 으로, 문자열은 글자 위치로 값을 꺼낸다. 자료마다 꺼내는 방법이 다르면 반복하는 코드도 자료마다 따로 써야 한다.

이터레이션 프로토콜은 꺼내는 방법을 하나로 맞춘다. 자료가 무엇이든 "다음 값을 줘"라고 물으면 같은 모양으로 답하게 해 두었기 때문에, `for...of` 하나로 배열도 `Set` 도 문자열도 돌 수 있다.

```js
for (const ch of 'hi') console.log(ch); // h, i 순서로 출력

const [x, y] = new Set([1, 2]);
console.log(x, y); // 1 2

console.log([...new Map([['k', 1]])]); // [ [ 'k', 1 ] ]
```

<br/>

## 어떻게 동작할까
이터러블은 `Symbol.iterator` 라는 이름의 메서드를 가진 객체다. 이 메서드를 부르면 이터레이터가 나오고, 이터레이터는 `next()` 메서드를 가진다. `next()` 는 부를 때마다 `{ value, done }` 모양의 객체를 돌려준다. `done` 이 `true` 가 되면 더 꺼낼 값이 없다는 뜻이다.

```js
const arr = ['a', 'b'];
const it = arr[Symbol.iterator]();

console.log(it.next()); // { value: 'a', done: false }
console.log(it.next()); // { value: 'b', done: false }
console.log(it.next()); // { value: undefined, done: true }
```

`for...of` 는 안에서 이 과정을 대신 해 준다. `Symbol.iterator` 를 불러 이터레이터를 받고, `done` 이 `true` 가 될 때까지 `next()` 를 부르며 `value` 를 변수에 넣는다.

일반 객체에는 `Symbol.iterator` 가 없어서 `for...of` 로 돌 수 없다. 객체의 키나 값을 돌고 싶으면 `Object.keys()`, `Object.values()`, `Object.entries()` 로 배열을 만든 뒤 돈다.

```js
const obj = { a: 1 };

console.log(typeof obj[Symbol.iterator]); // undefined
for (const v of obj) {} // TypeError: obj is not iterable
```

자바스크립트 문자열은 UTF-16 코드 단위(code unit, 16비트 조각)를 이어 놓은 것이고, `length` 는 코드 단위 개수다. 문자열을 `for...of` 로 돌면 코드 단위가 아니라 코드 포인트(code point, 유니코드 문자 번호) 하나씩 나온다. 그래서 코드 단위 두 개로 저장되는 글자도 하나로 꺼낸다.

```js
const s = '𠮷a';
console.log(s.length);      // 3 (𠮷 하나가 코드 단위 2개)
console.log([...s].length); // 2
```

다만 코드 포인트가 언제나 화면에 보이는 한 글자는 아니다. `'e\u0301'` 는 화면에는 é 한 글자로 보이지만 e와 결합 부호(U+0301) 두 코드 포인트라서 `[...'e\u0301'].length` 는 2다. 문자열 메서드는 [문자열](../문자열(String)) 노트에 정리했다.

<br/>

## 직접 만든 이터러블
`Symbol.iterator` 메서드만 붙이면 내가 만든 객체도 `for...of` 와 스프레드로 돌 수 있다. 아래는 `from` 부터 `to` 까지의 수를 차례로 내놓는 객체다.

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

for (const n of range) console.log(n); // 1, 2, 3 순서로 출력
console.log([...range]); // [ 1, 2, 3 ]
```

`next()` 를 직접 쓰는 대신 제너레이터 함수(`function*`)를 쓰면 더 짧아진다. 제너레이터는 `yield` 를 만날 때마다 값을 하나 내놓고 멈추는 함수이고, 부르면 이터레이터를 돌려준다.

```js
const range = {
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};

console.log([...range]); // [ 1, 2, 3 ]
```

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 이터레이션 (Iteration) | 반복 | 값을 하나씩 차례로 꺼내는 일 |
| 이터러블 (Iterable) | 반복할 수 있는 | `Symbol.iterator` 를 가져서 `for...of` 로 돌 수 있는 자료 |
| 이터레이터 (Iterator) | 반복자 | `next()` 로 다음 값을 하나씩 내주는 객체 |
| 제너레이터 (Generator) | 만들어 내는 것 | `yield` 로 값을 하나씩 내놓는 함수, 부르면 이터레이터가 나온다 |

<br/>

## 참고 자료
- [MDN: Iteration protocols](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols)
- 예시는 Node.js v22.13.0에서 실행해 결과를 확인했다

<br/>

## 더 볼 것 (TODO)
- 제너레이터 자세히: `yield`, `next(값)` 로 값 넘기기, `return()`
- 비동기 이터레이션: `Symbol.asyncIterator` 와 `for await...of`
- 이터레이터 헬퍼(`Iterator.prototype.map` 등)
