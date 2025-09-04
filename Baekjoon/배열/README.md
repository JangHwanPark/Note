## 배열 (자료구조)
- 메모리에 연속적으로 데이터가 저장된 자료구조.
- 모든 프로그래밍 언어에서 기본 제공.
- 스택, 큐, 덱 같은 자료구조를 구현할 때 기본 단위로 사용됨.

<br/>

## 인덱스 참조
배열은 0부터 시작해서 length - 1까지 접근 가능.

```js
let arr = ['a','b','c']; 
// length = 3
// 접근 가능: arr[0], arr[1], arr[2]
```
arr[3] → 범위 초과 (undefined 반환)

인덱스 0 → 1번째 문자(요소)

인덱스 1 → 2번째 문자(요소)

따라서 문제에서 "짝수 번째"라고 하면 인덱스는 홀수가 된다.
- i % 2 === 0 → 인덱스 기준 짝수 → 사람 기준 홀수 번째
- i % 2 === 1 → 인덱스 기준 홀수 → 사람 기준 짝수 번째

사람 기준으로 짝수번째 문자 뽑기
```js
const str = "hello";
let res = "";

// 사람 기준 짝수 → 인덱스 홀수
for (let i = 1; i < str.length; i += 2) {
  res += str[i];
}
console.log(res); // "el"
```

짝수 번째 문자 역순 출력
```js
const str = "hello";
let res = "";

// 마지막 인덱스가 짝수냐 홀수냐에 따라 시작점 결정
let start = (str.length % 2 === 0) ? str.length - 1 : str.length - 2;

for (let i = start; i >= 1; i -= 2) {
  res += str[i];
}
console.log(res); // "le"
```

### 인덱스 범위 초과 (Index out of range)
배열/문자열은 항상 0번 인덱스부터 시작해서 length - 1까지 접근 가능하다.

인덱스가 length 이상이면 범위를 벗어난 것이며, 자바스크립트는 오류 대신 undefined를 반환한다.
(C 같은 언어에서는 segmentation fault 발생)

```js
let arr = ['a', 'b', 'c']; 
// length = 3
// 접근 가능한 인덱스: 0, 1, 2

console.log(arr[0]); // 'a'
console.log(arr[1]); // 'b'
console.log(arr[2]); // 'c'

console.log(arr[3]); // undefined (범위 밖)
```

#### 원리
길이가 n인 배열 arr는 메모리에 0번부터 n-1번까지 슬롯을 차지한다.

인덱스 i를 넣으면 내부적으로 `메모리 주소 = 시작 주소 + (i × 타입 크기)`로 계산해서 해당 위치 데이터를 가져온다.

따라서 유효한 i 범위는 0 ≤ i ≤ n-1. 만약 i >= n이면 실제로는 존재하지 않는 메모리 주소를 가리키는 꼴 → JS는 undefined, C 계열은 런타임 에러/쓰레기 값.

#### 방지 방법
**기본 원칙**
```js
for (let i = 0; i < arr.length; i++) {
  // arr[i] 안전
}
```

**한 칸 뒤(i+1) 접근 (i+1 ≤ n-1 → i ≤ n-2)**
```js
for (let i = 0; i < arr.length - 1; i++) {
  console.log(arr[i], arr[i+1]); // 안전
}
```

**두 칸 뒤(i+2) 접근 (i+2 ≤ n-1 → i ≤ n-3)**
```js
for (let i = 0; i < arr.length - 2; i++) {
  console.log(arr[i], arr[i+1], arr[i+2]); // 안전
}
```

**앞 원소(i-1) 접근 (최소 i = 1부터 시작해야 안전)**
```js
for (let i = 1; i < arr.length; i++) {
  console.log(arr[i-1], arr[i]); // 안전
}
```

<br/>

## Count 배열(배열 카운팅 - 배열내 빈도수 세기, 내가 맨날 헷갈려하는거)
Count 배열은 “값의 등장 횟수”를 저장하는 배열이다.

원래 배열의 값들을 인덱스로 매핑해서, 그 값이 몇 번 나왔는지 저장한다.

예: count[x] = k → 원래 배열에서 값 x가 k번 등장했다는 뜻.

### 왜 필요한가?
배열에서 특정 값이 몇 번 나왔는지 빠르게 알고 싶을 때.

중복 체크, 최빈값 찾기, 조건에 맞는 개수 세기 등 많이 쓰이는 기본기 패턴.

시간 복잡도: O(N) (배열 한 번만 순회).

### 방법

문제에서 값의 범위(예: 1~10)가 정해져 있으면, 그 크기만큼 카운트 배열을 만든다.

모든 값을 0으로 초기화한다.

원래 배열을 순회하면서, 각 값에 해당하는 인덱스에 +1을 한다.

최종적으로 count[i]를 보면 값 i가 몇 번 등장했는지 알 수 있다.

### 예시 (JavaScript)
```js
[3, 1, 4, 5, 7, 9, 6]
```
입력 예시가 이고 범위가 1~10 사이라고 하면
- 길이 11짜리 배열(count)을 준비 (0으로 초기화). 
- 각 원소가 나오면 count[값]++. 
- 마지막에 count[i]가 0이면 한 번도 안 나온 것, 1이면 한 번 나온 것.

구현
```js
const arr = [3, 1, 4, 5, 7, 9, 6];
const count = new Array(11).fill(0); // 인덱스 0~10, 0으로 초기화

for (let num of arr) {
  count[num]++; // 해당 숫자 등장 횟수 +1
}

console.log(count);
```

출력
```text
[0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0]
```
count[1] = 1 → 1이 한 번 나옴

count[2] = 0 → 2는 안 나옴

count[3] = 1 → 3이 한 번 나옴

count[9] = 1 → 9가 한 번 나옴


### 활용 패턴

출석 체크 문제: 특정 번호가 빠졌는지 확인

중복 원소 검사: count[x] > 1이면 중복

최빈값 찾기: count 배열에서 최댓값 찾기

범위 제한이 있는 경우 빠르게 처리: 예, 점수(0100), 요일(17)

<br/>

## 탐색

<br/>

## 배열 거꾸로 탐색
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
