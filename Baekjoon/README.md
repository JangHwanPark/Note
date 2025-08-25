## 웹스톰 사용하여 테스트 (정규식 사용)
### 로컬(WebStorm, input.txt 테스트용)
```js
const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split(/\r?\n/);
```

### 백준 제출용 (Linux 서버 환경)
```js
const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");
```
또는
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");
```

## 한줄 입력
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(" ");
const a = Number(input[0]);
const b = Number(input[1]);

console.log(a + b);
```
- split(" ") 으로 공백 단위 분리.

<br/>

## 여러 줄 입력 (줄 단위)
```text
5
1
2
3
4
5
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

const n = Number(input[0]);           // 첫 번째 줄
const arr = input.slice(1).map(Number); // 나머지 줄들

console.log(n, arr);
```
- split("\n") 으로 줄 단위 분리.

<br/>

## 한 줄에 여러 개, 여러 줄 입력
```text
5
10 20 30 40 50
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

const n = Number(input[0]); // 5
const arr = input[1].split(" ").map(Number); // [10, 20, 30, 40, 50]

console.log(n, arr);
```
- \n으로 줄 자르고, 각 줄은 다시 " "로 쪼갬.

<br/>

## N이 문제에서 "고정"되어 있음 (예: 항상 10개 입력)
```text
3
5
7
9
11
13
15
17
19
21
23
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

// 문제에서 항상 10개 입력이라면 그냥 전부 읽으면 됨
const arr = input.map(Number);

console.log(arr);
```
- 이때는 첫 줄에 N이 주어지는 게 아니라, 그냥 문제 설명에 "항상 10개"라고 쓰여 있는 거라서 직접 arr.length가 10인 걸 전제로 처리****
