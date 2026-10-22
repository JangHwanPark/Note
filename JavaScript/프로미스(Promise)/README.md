## 프로미스란 ?
- 프로미스(Promise)는 비동기 작업이 나중에 성공할지 실패할지, 그 최종 결과를 담는 객체다
- 결과가 정해지기 전에도 프로미스 객체를 먼저 돌려받고, `then`, `catch`, `finally` 로 결과가 나왔을 때 할 일을 이어 붙인다
- ES2015에 표준으로 들어왔고, 콜백을 겹겹이 중첩하던 비동기 코드(콜백 헬)를 순서대로 읽히게 바꿔 준다

### 프로미스 (Promise)
사전적 의미는 약속이다. 지금 당장은 아니지만 나중에 무언가를 해 주겠다는 말이다.
프로그래밍에서는 지금은 값이 없지만 나중에 결과(성공한 값 또는 실패한 이유)를 꼭 알려 주겠다는 약속을 객체로 만든 것이다.

음식점의 진동벨과 같다. 주문하면 음식 대신 진동벨을 먼저 받고, 음식이 준비되면(성공) 또는 재료가 떨어지면(실패) 벨이 울려 결과를 알려 준다. 벨을 받은 손님은 그동안 다른 일을 할 수 있다.

<br/>

## 왜 필요할까: 콜백 헬
프로미스가 없을 때는 비동기 작업이 끝난 뒤 할 일을 콜백 함수로 넘겼다. 여러 비동기 작업을 순서대로 하려면 앞 작업이 끝난 뒤 다음 작업을 콜백 안에서 불러야 한다. 이것이 반복되면 콜백이 중첩되고 코드가 오른쪽으로 계속 밀려난다. 이것을 콜백 헬(Callback Hell), 또는 모양을 따서 파멸의 피라미드(Pyramid of Doom)라고 부른다.

```javascript
function doTask(name, seconds, callback) {
  setTimeout(() => {
    console.log(`${name} 완료`);
    callback();
  }, seconds * 1000);
}

doTask("작업1", 1, () => {
  doTask("작업2", 1, () => {
    doTask("작업3", 1, () => {
      console.log("모든 작업 완료!");
    });
  });
});
```

콜백 헬이 문제가 되는 이유는 아래와 같다.

- 들여쓰기가 깊어져 흐름을 따라가기 어렵다.
- 단계마다 에러를 직접 확인하고 넘겨야 해서 에러 처리 코드가 반복된다.
- 단계를 추가하거나 순서를 바꾸려면 중첩을 통째로 고쳐야 한다.
- 조건문 실수로 `callback()` 을 두 번 부르면 다음 단계가 두 번 실행된다.
- 내 콜백을 언제, 몇 번 부를지를 남의 함수가 정한다. 이것을 제어권 역전(Inversion of Control)이라고 한다.

같은 일을 프로미스로 쓰면 단계가 위에서 아래로 나란히 놓인다. 에러 처리도 끝의 `catch` 하나로 모인다.

```javascript
function doTaskP(name, seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} 완료`);
      resolve();
    }, seconds * 1000);
  });
}

doTaskP("작업1", 1)
  .then(() => doTaskP("작업2", 1))
  .then(() => doTaskP("작업3", 1))
  .then(() => console.log("모든 작업 완료!"))
  .catch(console.error);
```

두 코드 모두 1초 간격으로 작업1, 작업2, 작업3 완료가 찍히고 약 3초 뒤에 모든 작업 완료가 찍힌다.

<br/>

## 프로미스 만들기
`new Promise(...)` 에 실행 함수(executor function)를 넘겨 만든다. 실행 함수는 프로미스를 만드는 순간 바로 실행되고, `resolve` 와 `reject` 두 함수를 인자로 받는다. 이 안에서 둘 중 하나를 불러 결과를 정한다.

작업이 성공하면 `resolve(값)` 을 부른다. 프로미스가 그 값으로 이행(Fulfilled) 상태가 된다. 실패하면 `reject(이유)` 를 부른다. 프로미스가 거부(Rejected) 상태가 된다.

`resolve` 에 다른 프로미스를 넘기면 그 프로미스의 결과를 그대로 따른다. 거부된 프로미스를 넘기면 `resolve` 를 불렀는데도 거부된다. 같은 이유로 `Promise.resolve(p)` 에 프로미스 `p` 를 넘기면 새로 감싸지 않고 `p` 자신을 돌려준다.

```javascript
const inner = Promise.reject(new Error("안쪽 실패"));
new Promise((resolve) => resolve(inner))
  .catch((e) => console.log(e.message)); // 안쪽 실패

const p = Promise.resolve(1);
console.log(Promise.resolve(p) === p); // true
```

아래는 모양만 보여 주는 뼈대 코드라 그대로 실행되지는 않는다.

```javascript
function work(input) {
  return new Promise((resolve, reject) => {
    // 비동기 작업을 하고 성공하면 resolve(결과), 실패하면 reject(에러)
  });
}

work(data)
  .then((result) => { /* 성공했을 때 */ })
  .catch((error) => { /* 실패했을 때 */ })
  .finally(() => { /* 성공, 실패와 상관없이 마지막에 */ });
```

<br/>

## 프로미스의 세 가지 상태
프로미스는 대기에서 시작해 이행이나 거부 중 하나로 한 번만 바뀐다. 한 번 정해진 결과는 다시 바뀌지 않는다. 이행이나 거부로 정해진 상태를 묶어 처리됨(Settled)이라고 한다.

### 대기 (Pending)
아직 결과가 정해지지 않은 상태다. 서버에 요청을 보냈는데 아직 응답을 받지 못한 경우가 여기에 해당한다.

```javascript
const pending = new Promise(() => {}); // resolve, reject를 부르지 않는다
console.log(pending); // Promise { <pending> }
```

### 이행 (Fulfilled)
작업이 성공해 결과 값을 가진 상태다. `Promise.resolve(값)` 은 처음부터 이행 상태인 프로미스를 만든다.

```javascript
const fulfilled = Promise.resolve("성공!");
fulfilled.then((result) => console.log(result)); // 성공!
```

### 거부 (Rejected)
작업이 실패해 실패 이유를 가진 상태다. `Promise.reject(이유)` 는 처음부터 거부 상태인 프로미스를 만든다.

```javascript
const rejected = Promise.reject("에러 발생!");
rejected.catch((error) => console.error(error)); // 에러 발생!
```

실패 이유에는 문자열보다 `new Error("...")` 를 넘기는 편이 좋다. Error 객체는 어디서 실패했는지 알려 주는 스택 정보를 함께 담는다.

<br/>

## 프로미스 체이닝 (Promise Chaining)
`then` 을 이어 붙여 비동기 작업을 순서대로 실행하는 방식이다. chain의 사전적 의미는 사슬이다. 고리가 하나씩 이어진 사슬처럼 앞 단계의 결과가 다음 단계로 넘어간다.

### 체이닝이 동작하는 원리
`then` 은 호출될 때마다 새 프로미스를 돌려준다. 그래서 그 뒤에 또 `then` 을 붙일 수 있다.

```javascript
const p = Promise.resolve(1);
const q = p.then((v) => v + 1);
console.log(p === q); // false (then은 새 프로미스를 돌려준다)
q.then(console.log);  // 2
```

`then` 안에서 무엇을 돌려주느냐에 따라 다음 단계가 달라진다.

- 일반 값을 돌려주면 그 값이 다음 `then` 으로 넘어간다.
- 프로미스를 돌려주면 그 프로미스가 끝날 때까지 기다렸다가 그 결과가 다음 `then` 으로 넘어간다.
- 에러를 던지거나 거부된 프로미스를 돌려주면 그 사이의 `then` 은 건너뛰고 가장 가까운 `catch` 로 간다.

`catch` 와 `finally` 도 체인의 한 고리다.

- `catch` 에서 값을 돌려주면 다시 정상 흐름으로 돌아와 다음 `then` 이 실행된다. `catch` 에서 다시 에러를 던지면 그 뒤의 `catch` 로 넘어간다.
- `finally` 의 콜백은 인자를 받지 않고, 결과와 상관없이 실행된다. 앞 단계의 결과는 `finally` 를 그대로 통과해 다음 단계로 넘어간다. 로딩 표시 끄기 같은 마무리에 쓴다. 단, `finally` 안에서 에러를 던지거나 거부된 프로미스를 돌려주면 앞 결과 대신 그 에러가 다음 단계로 넘어간다.

```javascript
Promise.reject(new Error("x"))
  .catch(() => "복구")
  .then((v) => console.log("catch 뒤:", v)); // catch 뒤: 복구

Promise.resolve(42)
  .finally(() => "무시됨")
  .then((v) => console.log("finally 뒤:", v)); // finally 뒤: 42

Promise.resolve(42)
  .finally(() => { throw new Error("finally 에러"); })
  .catch((e) => console.log(e.message)); // finally 에러
```

### 예시: 사용자, 게시글, 댓글 순서대로 불러오기
```javascript
function getUserP(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id) reject(new Error("유효하지 않은 사용자 ID"));
      else resolve({ id, name: "홍길동" });
    }, 500);
  });
}

function getPostsP(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userId) reject(new Error("게시글을 불러올 수 없습니다 (userId 없음)"));
      else resolve(["게시글1", "게시글2"]);
    }, 500);
  });
}

function getCommentsP(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!post) reject(new Error("댓글을 불러올 수 없습니다 (post 없음)"));
      else resolve(["댓글A", "댓글B"]);
    }, 500);
  });
}

getUserP(1)
  .then((user) => getPostsP(user.id))      // 프로미스를 돌려주면 끝날 때까지 기다린다
  .then((posts) => getCommentsP(posts[0])) // 앞 단계의 결과(posts)를 받아 다음 요청
  .then((comments) => console.log("결과:", comments))
  .catch((err) => console.error("에러:", err.message))
  .finally(() => console.log("완료"));
```

<details> <summary>실행 결과</summary>

### 정상 실행
```text
결과: [ '댓글A', '댓글B' ]
완료
```

### 사용자 아이디가 없을 때
`getUserP(null)` 로 시작하면 첫 단계에서 거부되어 뒤의 `then` 은 모두 건너뛰고 `catch` 로 간다.

```text
에러: 유효하지 않은 사용자 ID
완료
```

### 댓글 단계에서 실패할 때
```javascript
getUserP(1)
  .then((user) => getPostsP(user.id))
  .then(() => getCommentsP(null)) // 일부러 실패
  .catch((err) => console.error("에러:", err.message));
```

```text
에러: 댓글을 불러올 수 없습니다 (post 없음)
```

</details>

<br/>

## 여러 프로미스 함께 다루기
서로 기다릴 필요가 없는 작업은 한꺼번에 시작하고 결과만 모아 받으면 빠르다. 위의 `doTaskP` 세 개를 체이닝으로 이으면 약 3초가 걸리지만, `Promise.all` 로 함께 시작하면 약 1초에 끝났다.

```javascript
const start = Date.now();
Promise.all([doTaskP("작업1", 1), doTaskP("작업2", 1), doTaskP("작업3", 1)])
  .then(() => console.log("모든 작업 완료!", ((Date.now() - start) / 1000).toFixed(1) + "초"));
// 작업1 완료
// 작업2 완료
// 작업3 완료
// 모든 작업 완료! 1.0초
```

세 작업은 `Promise.all` 을 부르기 전, `doTaskP` 를 호출하는 순간 이미 시작된다. `Promise.all` 은 작업을 실행하는 함수가 아니라 이미 시작된 프로미스들의 결과를 모아 기다리는 함수다.

| 메서드 | 언제 끝나나 | 결과 | 들어온 판 |
| --- | --- | --- | --- |
| `Promise.all` | 모두 성공하거나 하나라도 실패하면 | 성공 값 배열, 또는 첫 실패 이유 | ES2015 |
| `Promise.allSettled` | 모두 처리되면 | 각각의 상태와 값(이유)을 담은 배열 | ES2020 |
| `Promise.race` | 하나라도 처리되면 | 가장 먼저 처리된 것의 결과(성공이든 실패든) | ES2015 |
| `Promise.any` | 하나라도 성공하거나 모두 실패하면 | 첫 성공 값, 모두 실패면 AggregateError | ES2021 |

### Promise.all
모두 성공하면 결과를 넣은 순서대로 배열로 돌려준다. 하나라도 실패하면 나머지를 기다리지 않고 바로 거부된다. 다만 나머지 작업이 취소되는 것은 아니다. 이미 시작된 작업은 계속 진행되고, 그 결과만 버려진다.

```javascript
const p1 = Promise.resolve("A 완료");
const p2 = Promise.resolve("B 완료");

Promise.all([p1, p2])
  .then((results) => console.log(results)) // [ 'A 완료', 'B 완료' ]
  .catch((err) => console.error("실패:", err));
```

### Promise.allSettled
성공, 실패와 상관없이 모두 끝날 때까지 기다린 뒤 각각의 결과를 돌려준다. 일부가 실패해도 나머지 결과를 써야 할 때 쓴다.

```javascript
const p1 = Promise.resolve("성공");
const p2 = Promise.reject("실패");

Promise.allSettled([p1, p2])
  .then((results) => console.log(results));
// [
//   { status: 'fulfilled', value: '성공' },
//   { status: 'rejected', reason: '실패' }
// ]
```

### Promise.race
가장 먼저 처리된 프로미스의 결과를 따른다. 먼저 끝난 것이 실패라면 결과도 실패다. 요청에 제한 시간을 걸 때 자주 쓴다.

```javascript
const p1 = new Promise((res) => setTimeout(() => res("1초"), 1000));
const p2 = new Promise((res) => setTimeout(() => res("0.5초"), 500));

Promise.race([p1, p2])
  .then((result) => console.log(result)); // 0.5초
```

### Promise.any
가장 먼저 성공한 프로미스의 결과를 돌려준다. 실패는 건너뛰고, 모두 실패하면 `AggregateError` 로 거부된다. 이때 메시지는 V8 엔진 기준 `All promises were rejected` 이고, 각 실패 이유는 `errors` 배열에 담긴다.

```javascript
const p1 = Promise.reject("실패1");
const p2 = new Promise((res) => setTimeout(() => res("성공2"), 500));

Promise.any([p1, p2])
  .then((result) => console.log(result)) // 성공2
  .catch((err) => console.error(err));
```

<br/>

## 한눈에 보는 용어
| 용어 | 사전적 의미 | 쉽게 말하면 |
| --- | --- | --- |
| 프로미스 (Promise) | 약속 | 나중에 결과를 알려 주겠다는 객체 |
| 이행 (Fulfilled) | 약속을 지킴 | 성공해서 값이 정해진 상태 |
| 거부 (Rejected) | 받아들이지 않음 | 실패해서 이유가 정해진 상태 |
| 체이닝 (Chaining) | 사슬로 잇기 | `then` 을 이어 붙여 순서대로 실행 |

예시의 출력은 Node.js 22.13.0(V8 엔진)에서 실행한 결과다. 들어온 판(ES2015, ES2020, ES2021)은 각 메서드가 ECMAScript 명세에 들어간 해다.

<br/>

## 더 볼 것 (TODO)
- `async`/`await`: 프로미스를 동기 코드처럼 쓰는 문법과 `try`/`catch`
- 처리되지 않은 거부(unhandled rejection)가 브라우저와 Node.js에서 어떻게 다뤄지는지
- `then` 콜백이 마이크로태스크로 실행되는 순서 ([콜스택과 실행 순서](../콜스택과%20실행%20순서(Call%20Stack)) 노트와 이어짐)
