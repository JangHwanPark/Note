## 콜백헬
콜백헬이란, 비동기 작업을 콜백 함수로만 처리하다 보니 콜백이 중첩되고 코드가 오른쪽으로 계속 밀려나서 가독성이 떨어지는 현상을 말한다.

흔히 피라미드 of Doom(파멸의 피라미드)라고도 부른다.

### 왜 생기는가?
자바스크립트는 비동기 작업(예: 파일 읽기, 네트워크 요청)을 즉시 반환하고, 결과는 나중에 콜백을 통해 전달한다.
여러 비동기 작업을 순차적으로 실행하려면, 앞선 작업이 끝난 뒤 다음 작업을 콜백 안에서 호출해야 한다.
이 과정이 반복되면서 콜백이 중첩되고 코드가 들여쓰기 지옥처럼 깊어진다.

### 콜백헬의 문제점
- 가독성 저하: 들여쓰기가 깊어져 코드 흐름 파악이 어려움.
- 에러 처리 중복: 매 단계마다 에러를 직접 확인해야 함.
- 유지보수 어려움: 새로운 로직을 추가하거나 순서를 바꾸기 힘듦.
- 다중 호출 위험: if 같은 조건에서 callback()을 여러 번 호출하면 중복 실행 버그 발생.
- 제어권 역전(Inversion of Control): 콜백이 외부에서 언제/몇 번 실행될지 보장하기 어려움.

```js
function doTask(name, seconds, callback) {
  setTimeout(() => {
    console.log(`${name} 완료`);
    callback();
  }, seconds * 1000);
}

// 실행
doTask("작업1", 1, () => {
  doTask("작업2", 1, () => {
    doTask("작업3", 1, () => {
      console.log("모든 작업 완료!");
    });
  });
});
```
<br/>

## 프로미스 (Promise)
프로미스는 비동기 연산의 최종 완료 또는 실패 상태를 나타내는 객체다. 

자바스크립트 초창기에는 비동기 처리를 콜백(callback) 으로만 했는데, 콜백이 중첩될수록 코드가 들여쓰기 지옥처럼 깊어지고 에러 처리도 번거로워지는 콜백헬(Callback Hell) 문제가 발생했다. 프로미스는 이런 콜백헬을 방지하고 가독성과 에러 처리 일관성을 개선하기 위해 도입된 개념이다.

프로미스는 new Promise(...) 구문으로 생성하며, resolve와 reject를 인자로 받는 실행 함수(executor function)를 생성자의 인자로 전달한다.
- Executor Function (실행 함수) : new Promise(executor) 안에 들어가는 함수. 여기서 resolve/reject를 호출해야 한다.
- resolve (이행) : 작업이 성공했을 때 호출하는 함수 → 프로미스가 Fulfilled 상태가 됨.
- reject (거부): 작업이 실패했을 때 호출하는 함수 → 프로미스가 Rejected 상태가 됨.

**사용 예제**
```js
function promise(argument) {
  return new Promise((resolve, reject) => 비동기 작업);
}

promise(data)
.then(필요한 작업을 수행)
.catch(에러 처리)
.finally(최종적으로 무조건 호출)
```

```js
function doTaskP(name, seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} 완료`);
      resolve();
    }, seconds * 1000);
  });
}

// 실행
doTaskP("작업1", 1)
  .then(() => doTaskP("작업2", 1))
  .then(() => doTaskP("작업3", 1))
  .then(() => console.log("모든 작업 완료!"))
  .catch(console.error);
```

### 프로미스 상태
#### 대기 (Pending)
아직 결과(성공/실패)가 정해지지 않은 상태. (쉽게 말해 기다리는 중)

예를들어 서버에 요청을 보냈는데 아직 응답을 못 받은 경우.
```js
// 아직 resolve나 reject가 호출되지 않아 Pending 상태
const promise = new Promise(() => {}); 
```

#### 이행 (Fulfilled)
비동기 작업이 성공적으로 끝나서 결과 값을 반환한 상태. (쉽게 말해 성공, 완료)

예를들어 서버에서 데이터를 잘 받아왔을 때.
```js
const promise = Promise.resolve("성공!");
// 이미 Fulfilled 상태로, then으로 결과를 받을 수 있음
promise.then(result => console.log(result)); // 성공!
```

#### 거부 (Rejected)
비동기 작업이 실패해서 에러(이유)를 반환한 상태. (쉽게 말해 실패)

예를 들어 서버에 데이터 요청을 보냈으나 네트워크 에러로 실패했을 때.
```js
const promise = Promise.reject("에러 발생!");
// 이미 Rejected 상태
promise.catch(error => console.error(error)); // 에러 발생!
```
<br/>

## 프로미스 체이닝 (Promise Chaining)
프로미스는 then() 메서드를 사용해 연속적인 비동기 작업을 순차적으로 실행할 수 있다. 이를 체이닝(Chaining) 이라고 한다.

### 체이닝 원리
#### then은 항상 새로운 프로미스를 반환한다.
then 안에서 반환한 값은 자동으로 Promise.resolve(값) 으로 감싸져서 다음 then에 전달된다.

#### return 값에 따라 다음 흐름이 달라진다.
- 일반 값 반환 → 다음 then에 값이 그대로 전달됨.
- 프로미스 반환 → 그 프로미스가 resolve될 때까지 기다린 뒤 다음 then 실행.
- 에러 발생(throw / reject) → 바로 .catch()로 전달됨.

#### catch도 체이닝에 참여한다.
- catch에서 값을 반환하면 다시 정상 흐름으로 복귀해 다음 then 실행 가능.
- catch에서 에러를 다시 throw 하면 그 뒤의 catch로 전달됨.

#### finally는 결과와 무관하게 실행된다.
값을 전달하지 않고, 단순히 마무리용(cleanup)으로 쓰인다.

**기본 구조**
```js
작업()
  .then(결과1 => 다음작업(결과1))
  .then(결과2 => 또다른작업(결과2))
  .then(결과3 => console.log("최종:", 결과3))
  .catch(err => console.error("에러:", err))
  .finally(() => console.log("항상 실행됨"));
```

```js
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

// 실행 (체이닝)
getUserP(1)
  .then(user => getPostsP(user.id))       // 프로미스 반환 → 다음 then에서 결과 받음
  .then(posts => getCommentsP(posts[0]))  // 또 다른 비동기 함수 체이닝
  .then(comments => console.log("결과:", comments))
  .catch(err => console.error("에러:", err))
  .finally(() => console.log("완료"));
```

<details> <summary>실행 예시</summary>

### 정상 실행
```js
{ id: 1, name: "홍길동" }
→ ["게시글1", "게시글2"]
→ ["댓글A", "댓글B"]
```

### 사용자 아이디가 없을때
```js
getUserP(null) // reject 발생
```
```text
에러 발생: 유효하지 않은 사용자 ID
```

### 게시글이 없을때
```js
getUserP(1)
  .then(user => getPostsP(user.id))
  .then(() => getCommentsP(null)) // 강제로 실패
```
```text
에러 발생: 댓글을 불러올 수 없습니다 (post 없음)
```

</details>

<br/>

## 프로미스 병렬 처리
프로미스는 여러 개의 비동기 작업을 동시에 실행하고, 그 결과를 한꺼번에 다룰 수 있다.
이를 통해 불필요하게 순차 실행을 기다릴 필요 없이, 병렬로 처리하여 성능을 높일 수 있다.

### Promise.all([...])
모든 프로미스가 성공해야 결과 배열을 반환.

하나라도 실패하면 즉시 Rejected 상태가 됨.
```js
const p1 = Promise.resolve("A 완료");
const p2 = Promise.resolve("B 완료");

Promise.all([p1, p2])
  .then(results => console.log(results)) // ["A 완료", "B 완료"]
  .catch(err => console.error("실패:", err));
```

### Promise.allSettled([...])
성공/실패와 상관없이 모든 프로미스가 끝날 때까지 기다린 뒤 결과 배열 반환.
```js
const p1 = Promise.resolve("성공");
const p2 = Promise.reject("실패");

Promise.allSettled([p1, p2])
  .then(results => console.log(results));
// [
//   { status: "fulfilled", value: "성공" },
//   { status: "rejected", reason: "실패" }
// ]
```

### Promise.race([...])
가장 먼저 끝난 프로미스의 결과(성공/실패)에 따라 결정됨.
```js
const p1 = new Promise(res => setTimeout(() => res("1초"), 1000));
const p2 = new Promise(res => setTimeout(() => res("0.5초"), 500));

Promise.race([p1, p2])
  .then(result => console.log(result)); // "0.5초"
```

### Promise.any([...])
가장 먼저 성공한 프로미스의 결과를 반환.

전부 실패하면 AggregateError 발생.
```js
const p1 = Promise.reject("실패1");
const p2 = new Promise(res => setTimeout(() => res("성공2"), 500));

Promise.any([p1, p2])
  .then(result => console.log(result)) // "성공2"
  .catch(err => console.error(err));
```

<br/>

## 프로미스 함수 (정적 메서드)
### Promise.resolve(value)
즉시 성공

### Promise.reject(err)
즉시 실패

### Promise.all([...])
모두 성공해야 이행 (하나 실패 → 거부)

### Promise.allSettled([...])
성공/실패 상관없이 전체 결과 배열

### Promise.race([...])
가장 먼저 끝난 결과 반환

### Promise.any([...])
가장 먼저 성공한 결과 반환 (전부 실패 → AggregateError)
