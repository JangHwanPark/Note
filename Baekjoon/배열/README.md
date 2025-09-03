## 배열 (자료구조)

## 인덱스 참조

## Count 배열(배열내 빈도수 세기)

<br/>

## 배열 카운팅
보통 배열에 있는 값들이 몇 번 나왔는지 세는 것

```js
[3, 1, 4, 5, 7, 9, 6]
```
입력 예시가 이고 범위가 1~10 사이라고 하면
- 길이 11짜리 배열(count)을 준비 (0으로 초기화). 
- 각 원소가 나오면 count[값]++. 
- 마지막에 count[i]가 0이면 한 번도 안 나온 것, 1이면 한 번 나온 것.

## 예시 (JavaScript)
```js
const arr = [3, 1, 4, 5, 7, 9, 6];
const count = new Array(11).fill(0); // 인덱스 0~10, 0으로 초기화

for (let num of arr) {
  count[num]++; // 해당 숫자 등장 횟수 +1
}

console.log(count);
/*
출력:
[0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0]
*/
```
예를 들어 count[1] = 1 (1이 한 번 나옴), count[2] = 0 (2는 안 나옴), count[3] = 1, count[7] = 1 …

<br/>

## 탐색

<br/>

**## 배열 거꾸로 탐색
N 개의 숫자를 입력받아 거꾸로 출력하는 방법
```text
// 입력
1 2 4 2 5 7 8 5 8 3
3 8 5 8 7 5 2 4 2 1
```
- for 루프를 거꾸로 돌려서 출력하면 됨

```js
let arr = fs.readFileSync(0).toString().trim().split(" ");

let str = "";
for (let i = 9; i >= 0; i--) {
    str += arr[i] + " ";
}

console.log(str);
```

- JS 내장함수인 reverse() 함수를 사용해도 됨
```js
let arr = [1, 2, 3, 4, 5];
arr.reverse();

let str = "";
for (let i = 0; i < 5; i++) {
    str1 += arr[i] + " ";
}

>> 5 4 3 2 1
```
**

<br/>

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

#### 요약
- 배열 순회하면서 if (el < minVal)일 때 minVal을 갱신한다.
- Infinity (무조건 첫 값에서 갱신됨 → 안전)
- Number.MAX_SAFE_INTEGER (자바스크립트에서 표현 가능한 가장 큰 안전 정수)
- 배열 첫 번째 값 (실전에서 자주 쓰는 방식)
