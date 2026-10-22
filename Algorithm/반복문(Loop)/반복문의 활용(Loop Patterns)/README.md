## 반복문으로 자주 푸는 패턴
- 반복문은 값을 하나씩 보기 때문에, 전체에 대한 답(개수, 합, 곱, 존재 여부)을 내려면 반복 바깥에 결과를 쌓아 둘 변수가 필요하다
- 패턴마다 그 변수의 시작값과 반복을 멈추는 시점이 다르다
- 아래 예시는 `a` 부터 `b` 까지의 정수, 또는 배열 `arr` 을 대상으로 한다

### 누적 변수 (Accumulator)
accumulate의 사전적 의미는 모으다, 쌓다. 반복이 한 번 돌 때마다 결과를 조금씩 쌓아 가는 변수를 말한다.
저금통과 같다. 하나씩 넣다 보면 마지막에 전체 금액이 남는다. 처음에 저금통이 비어 있어야(시작값) 마지막 금액이 맞다.

<br/>

## 개수 세기
조건을 만족하는 원소가 몇 개인지 센다. 시작값은 0이고, 조건을 만족할 때마다 1씩 더한다.

```js
const a = 1, b = 10;
let cnt = 0;
for (let i = a; i <= b; i++) {
  if (i % 2 === 0) cnt++;
}
console.log(cnt); // 5 (2, 4, 6, 8, 10)
```

<br/>

## 조건을 만족하는 값의 합
더할지 말지를 조건으로 정하고 `sum` 에 쌓는다. 시작값은 0이다.

```js
const a = 1, b = 10;
let sum = 0;
for (let i = a; i <= b; i++) {
  if (i % 3 === 0) sum += i;
}
console.log(sum); // 18 (3 + 6 + 9)
```

<br/>

## 곱 구하기
곱은 시작값이 1이다. 0으로 시작하면 무엇을 곱해도 0이 된다. 팩토리얼, 조합 계산, 배수의 곱에 쓴다.

```js
const n = 5;
let prod = 1;
for (let i = 1; i <= n; i++) {
  prod *= i;
}
console.log(prod); // 120 (5!)
```

곱은 금방 커진다. 19!부터는 `Number.MAX_SAFE_INTEGER` 를 넘는다. 그래도 19!부터 22!까지는 정확하게 나온다. 2를 인수로 많이 가지고 있어서, 2의 거듭제곱을 뺀 나머지 부분(홀수 부분)이 53비트 안에 들어가기 때문이다. 22!의 홀수 부분은 51비트, 23!은 56비트라서 23!부터 BigInt로 계산한 값과 달라졌다(Node.js v22.13.0). 큰 곱은 BigInt로 계산하거나 문제에서 주는 수로 나눈 나머지를 그때그때 구한다.

<br/>

## 끝을 모르는 반복과 break
입력이 몇 개인지 모르거나 특정 값이 나올 때까지 돌아야 하면, `while (true)` 로 돌리고 멈추는 시점은 `break` 로 정한다.

```js
const input = [3, 7, 2, 0, 9];
let i = 0;
let sum = 0;
while (true) {
  const x = input[i++];
  if (x === 0) break; // 0이 나오면 입력 끝
  sum += x;
}
console.log(sum); // 12 (3 + 7 + 2)
```

종료 조건이 반복문 머리가 아니라 본문 안에 있으므로, `break` 에 반드시 닿는지 확인한다. 위 예시에서 입력에 0이 없으면 배열 끝을 넘어 `undefined` 를 읽으며 끝나지 않는다.

<br/>

## 하나라도 만족하는지
조건을 만족하는 원소가 하나라도 있으면 답이 정해지므로, 찾는 순간 멈춘다.

```js
const arr = [4, 7, 1, 9, 3];
const target = 9;
let found = false;
for (const x of arr) {
  if (x === target) {
    found = true;
    break;
  }
}
console.log(found); // true
```

배열 메서드로는 `arr.some((x) => x === target)` 이 같은 일을 한다.

<br/>

## 모두 만족하는지
모든 원소가 조건을 만족해야 하므로, 하나라도 어긋나는 순간 답은 `false` 로 정해지고 멈춘다.

```js
const arr = [2, 4, 7, 8];
let allEven = true;
for (const x of arr) {
  if (x % 2 !== 0) {
    allEven = false;
    break;
  }
}
console.log(allEven); // false (7에서 멈춘다)
```

배열 메서드로는 `arr.every((x) => x % 2 === 0)` 이 같은 일을 한다. "하나라도"는 시작값이 `false`, "모두"는 시작값이 `true` 라는 점이 서로 반대다.

<br/>

## 확인한 환경
- 예시 출력은 Node.js v22.13.0에서 실행한 값이다

<br/>

## 더 볼 것 (TODO)
- 이중 반복문과 바깥 반복문까지 한 번에 빠져나오는 레이블(label) break
