## 배열이란 ?
- 여러 값을 순서대로 한 줄로 늘어놓고, 몇 번째인지(인덱스)로 바로 꺼내 쓰는 자료구조
- 거의 모든 프로그래밍 언어가 기본으로 제공하고, 스택, 큐, 덱 같은 자료구조를 만들 때도 바탕이 된다
- 코딩 테스트에서는 인덱스 범위, 최댓값과 최솟값, 탐색이 자주 나온다

### 배열 (Array)
사전적 의미는 배열하다, 가지런히 늘어놓다. 군대가 줄을 맞춰 선 모양을 가리키던 말이다.
자료구조로서의 배열은 값을 줄 세워 두고 앞에서부터 0, 1, 2 번호를 붙인다. 번호만 알면 몇 번째 값이든 처음부터 세지 않고 바로 꺼낼 수 있다.

번호가 붙은 사물함과 같다. 7번 사물함을 열려고 1번부터 차례로 열어 볼 필요가 없다.

<br/>

## 인덱스는 0부터 시작한다
길이가 n인 배열은 `0` 부터 `n - 1` 까지 접근할 수 있다.

```js
const arr = ["a", "b", "c"]; // length = 3
arr[0]; // 'a'
arr[2]; // 'c'
arr[3]; // undefined (범위 밖)
```

인덱스 0이 사람 기준으로 1번째다. 그래서 문제에서 "짝수 번째"라고 하면 인덱스는 홀수가 된다.

- `i % 2 === 0` 은 인덱스로는 짝수, 사람 기준으로는 홀수 번째다
- `i % 2 === 1` 은 인덱스로는 홀수, 사람 기준으로는 짝수 번째다

사람 기준으로 짝수 번째 문자만 뽑으려면 인덱스 1부터 2씩 건너뛴다.

```js
const str = "hello";
let res = "";
for (let i = 1; i < str.length; i += 2) {
  res += str[i];
}
console.log(res); // "el"
```

같은 문자들을 거꾸로 뽑으려면 시작점을 정해야 한다. 마지막 인덱스(`length - 1`)가 홀수면 거기서, 짝수면 한 칸 앞에서 시작한다.

```js
const str = "hello";
let res = "";
const start = str.length % 2 === 0 ? str.length - 1 : str.length - 2;
for (let i = start; i >= 1; i -= 2) {
  res += str[i];
}
console.log(res); // "le"
```

<br/>

## 인덱스 범위 초과 (Index out of range)
인덱스가 `length` 이상이거나 음수이면 배열 밖이다. 자바스크립트는 이때 오류를 내지 않고 `undefined` 를 돌려준다. C 같은 언어는 배열 밖 메모리를 읽어 쓰레기 값이 나오거나 프로그램이 죽을 수 있다.

### 왜 범위가 0부터 n - 1일까
자료구조로서의 배열(C의 배열 같은)은 값을 메모리에 빈틈없이 이어 붙여 저장한다. 그래서 i번째 값의 위치를 `시작 주소 + i × 값 하나의 크기` 로 바로 계산한다. i가 0이면 첫 값, n - 1이면 마지막 값이고, n 이상이면 배열이 차지하지 않은 자리를 가리키게 된다.
자바스크립트의 배열은 객체라서 엔진이 내부 저장 방식을 알아서 정한다. 메모리에 그대로 붙어 있다고 보장되지는 않지만, 번호로 바로 꺼낸다는 성질과 0부터 n - 1까지라는 범위는 같다.

### 반복문 범위로 막기
옆 칸을 함께 볼 때는 반복 범위를 그만큼 줄인다.

```js
// arr[i] 만 볼 때
for (let i = 0; i < arr.length; i++) {}

// arr[i + 1] 까지 볼 때: i + 1 <= n - 1 이므로 i <= n - 2
for (let i = 0; i < arr.length - 1; i++) {}

// arr[i + 2] 까지 볼 때: i <= n - 3
for (let i = 0; i < arr.length - 2; i++) {}

// arr[i - 1] 을 볼 때: i는 1부터
for (let i = 1; i < arr.length; i++) {}
```

<br/>

## 빈도수 세기 (Count 배열)
값이 몇 번 나왔는지 세는 Count 배열은 내가 자주 헷갈려서 [빈도수 세기](../빈도수%20세기(Frequency%20Counter)/README.md)에 따로 정리했다.

<br/>

## 탐색
배열에서 원하는 값을 찾을 때는 앞에서부터 하나씩 비교하는 선형 탐색(Linear Search)을 쓴다. 최악의 경우 원소를 전부 봐야 하므로 시간 복잡도는 O(n)이다. O(n)은 원소 개수 n이 두 배가 되면 걸리는 시간도 대략 두 배가 된다는 뜻이다.

```js
const arr = [4, 7, 1, 9, 3];
const target = 9;

let idx = -1;
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    idx = i;
    break; // 찾았으면 나머지는 볼 필요가 없다
  }
}
console.log(idx); // 3
```

JS 내장 메서드도 앞에서부터 차례로 찾는다.

```js
arr.indexOf(9);                // 3 (없으면 -1)
arr.includes(9);               // true
arr.find((el) => el > 5);      // 7 (조건을 만족하는 첫 값, 없으면 undefined)
arr.findIndex((el) => el > 5); // 1 (조건을 만족하는 첫 인덱스, 없으면 -1)
```

정렬된 배열이라면 탐색 범위를 절반씩 줄이는 이분 탐색(Binary Search)으로 O(log n)에 찾을 수 있다.

<br/>

## 거꾸로 출력하기
숫자 10개를 입력받아 거꾸로 출력하는 문제다.

```text
// 입력
1 2 4 2 5 7 8 5 8 3
// 출력
3 8 5 8 7 5 2 4 2 1
```

반복문을 마지막 인덱스부터 거꾸로 돌린다.

```js
const fs = require("fs");
const arr = fs.readFileSync(0, "utf8").trim().split(" ");

const res = [];
for (let i = arr.length - 1; i >= 0; i--) {
  res.push(arr[i]);
}
console.log(res.join(" ")); // 3 8 5 8 7 5 2 4 2 1
```

내장 메서드 `reverse()` 를 써도 된다. `reverse()` 는 새 배열을 만들지 않고 원래 배열의 순서를 뒤집는다.

```js
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr.join(" ")); // 5 4 3 2 1
```

<br/>

## 최댓값과 최솟값
### 최댓값 구하기
변수(`maxVal`)에 지금까지 본 가장 큰 값을 두고, 현재 값이 더 크면 바꾼다.
이때 `maxVal` 을 0으로 시작하면 안 된다. 모든 원소가 음수면 한 번도 바뀌지 않아 답이 0으로 나온다. `[-3, -1, -7]` 에서 0으로 시작하면 결과가 0이지만 실제 최댓값은 -1이다.

시작값은 아래 셋 중 하나로 둔다.

- 배열의 첫 번째 원소로 시작하고 두 번째 원소부터 비교한다. 실전에서 가장 많이 쓴다
- `-Infinity` 로 시작한다. 어떤 수와 비교해도 첫 값에서 반드시 바뀐다
- `Number.MIN_SAFE_INTEGER`(-9007199254740991)로 시작한다. 여기서부터 `Number.MAX_SAFE_INTEGER` 까지의 정수는 모두 빠짐없이 정확하게 표현된다는 뜻에서 안전(safe)이라 부르는 범위의 아래 끝이다

```js
const fs = require("fs");
const n = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);

// 방법 1: 첫 번째 원소로 시작
let maxVal = n[0];
for (const el of n) {
  if (el > maxVal) maxVal = el;
}

// 방법 2: -Infinity로 시작
let maxVal2 = -Infinity;
for (const el of n) {
  if (el > maxVal2) maxVal2 = el;
}
```

### 최솟값 구하기
최솟값은 반대로 현재 값이 더 작으면 바꾼다. 0으로 시작하면 모든 원소가 양수일 때 답이 0으로 나오는 같은 문제가 생기므로, 첫 번째 원소나 `Infinity`, `Number.MAX_SAFE_INTEGER` 로 시작한다.

```js
let minVal = Infinity;
for (const el of n) {
  if (el < minVal) minVal = el;
}
```

`Math.max(...n)`, `Math.min(...n)` 으로 한 줄에 구할 수도 있다. 다만 스프레드는 원소를 전부 함수 인수로 넘기므로 원소가 많으면 오류가 난다. Node.js v22.13.0에서 원소 12만 5천 개는 됐고 13만 개에서는 `RangeError: Maximum call stack size exceeded` 가 났다(한도는 엔진과 환경마다 다르다). 입력이 클 수 있으면 반복문을 쓴다.

<br/>

## 확인한 환경
- 예시 출력은 Node.js v22.13.0에서 실행한 값이다

<br/>

## 더 볼 것 (TODO)
- 이분 탐색 구현과 경계 처리
- 2차원 배열 만들기와 순회
