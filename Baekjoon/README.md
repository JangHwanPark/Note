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