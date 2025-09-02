## 배열 (자료구조)

## 인덱스 참조

## Count 배열(배열내 빈도수 세기)

## 탐색

## Min/Max
### 최대값 구하기
최대값은 변수(maxVal)를 사용하여 지금까지 구한 값보다 현재 값(el)이 더 큰 경우 최대값을 갱신하는 방식으로 찾는다.
만약 모든 원소가 음수인데 maxVal을 0으로 초기화하면, 갱신이 한 번도 일어나지 않아 예상과 다르게 0이 최대값으로 나올 수 있다.

이를 방지하는 방법
- maxVal = Number.MIN_SAFE_INTEGER (정수에서 안전하게 가장 작은 값으로 초기화)
- 배열의 첫 번째 원소로 초기화한 뒤, 두 번째 원소부터 비교 시작

자바스크립트에서는 Infinity(양의 무한대), -Infinity(음의 무한대)를 제공한다.<br/>
Math.max()와 비교해서 사용할 때, maxVal = -Infinity로 초기화하면 어떤 값과 비교하더라도 첫 번째 값에서 무조건 갱신된다.
```js
const fs = require("fs");
const n = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);

// 방법 1: 첫 번째 원소로 초기화
let maxVal = n[0];
n.forEach((el, idx) => {
    if (n[idx] > maxVal) {
        maxVal = n[idx];
    }
});

console.log("최대값(첫 원소 초기화):", maxVal);

// 방법 2: -Infinity로 초기화
let maxVal2 = -Infinity;
n.forEach(el => {
    if (el > maxVal2) {
        maxVal2 = el;
    }
});
console.log("최대값(-Infinity 초기화):", maxVal2);
```
<br/>

#### 요약
- 배열 순회하면서 if (el > maxVal)일 때 maxVal을 갱신한다.
- -Infinity (무조건 첫 값에서 갱신됨 → 안전)
- Number.MIN_SAFE_INTEGER (자바스크립트에서 표현 가능한 가장 작은 안전 정수)
- 배열 첫 번째 값 (실전에서 자주 쓰는 방식)

<br/>

### 최솟값 구하기
최솟값은 변수(minVal)를 사용하여 지금까지 구한 값보다 현재 값(el)이 더 작은 경우 최솟값을 갱신하는 방식으로 찾는다.
만약 모든 원소가 양수인데 minVal을 0으로 초기화하면, 갱신이 한 번도 일어나지 않아 예상과 다르게 0이 최솟값으로 나올 수 있다.

이를 방지하는 방법
- minVal = Number.MAX_SAFE_INTEGER (정수에서 안전하게 가장 큰 값으로 초기화)
- 또는 배열의 첫 번째 원소로 초기화한 뒤, 두 번째 원소부터 비교 시작

자바스크립트에서는 Infinity(양의 무한대), -Infinity(음의 무한대)를 제공한다.
minVal = Infinity로 초기화하면 어떤 값과 비교하더라도 첫 번째 값에서 무조건 갱신된다.
```js
const fs = require("fs");
const n = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);

// 방법 1: 첫 번째 원소로 초기화
let minVal = n[0];
n.forEach(el => {
    if (el < minVal) {
        minVal = el;
    }
});
console.log("최솟값(첫 원소 초기화):", minVal);

// 방법 2: Infinity로 초기화
let minVal2 = Infinity;
n.forEach(el => {
    if (el < minVal2) {
        minVal2 = el;
    }
});
console.log("최솟값(Infinity 초기화):", minVal2);
```
<br/>

#### 요약
- 배열 순회하면서 if (el < minVal)일 때 minVal을 갱신한다.
- Infinity (무조건 첫 값에서 갱신됨 → 안전)
- Number.MAX_SAFE_INTEGER (자바스크립트에서 표현 가능한 가장 큰 안전 정수)
- 배열 첫 번째 값 (실전에서 자주 쓰는 방식)
