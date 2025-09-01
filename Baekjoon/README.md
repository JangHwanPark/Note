## 잡지식
### 1. fs.readFileSync(0, "utf8")
- `fs`는 Node.js의 파일 시스템 모듈
- `readFileSync(경로, 인코딩)`은 파일을 동기적으로 읽음
- 0은 표준입력(stdin)을 가리키며 utf8은 텍스트로 읽겠다는 의미

### 2. .trim()
- 입력 마지막에 보통`\n`이 붙는데 이걸 지워줌

### 3. .split(" ")
- 문자열을 공백`" "`기준으로 잘라서 배열로 만듦

### 4. .map(Number)
- 배열에 저장된 요소(입력받은건 문자열로 저장됨)를 정수로 바꿈

<br/>

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

<br/>

## 한줄 입력
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(" ");
const a = Number(input[0]);
const b = Number(input[1]);
```

### 숫자로 한줄 입력받기
```text
6 2 4 5 4 1
```
```js
const fs = require("fs");
const n = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);
```
```js
const fs = require("fs")
let [a, b] = fs.readFileSync(0).toString().trim().split(" ").map(Number)
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
```
- split("\n") 으로 줄 단위 분리.

<br/>

## 한 줄에 여러 개(or 공백으로 구분), 여러 줄 입력
```text
5
10 20 30 40 50
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

const n = Number(input[0]); // 5
const arr = input[1].split(" ").map(Number); // [10, 20, 30, 40, 50]
```
- \n으로 줄 자르고, 각 줄은 다시 " "로 쪼갬.

<br/>

```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);
```

<br/>

## 안전하게 n개만 받기
```text
6
3 1 4 5 6 2
```
```js
const fs = require("fs");
const tokens = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);

const n = tokens[0];            // 첫 줄의 N
const arr = tokens.slice(1, 1 + n); // N개만 잘라서 배열로
```

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
```
- 이때는 첫 줄에 N이 주어지는 게 아니라, 그냥 문제 설명에 "항상 10개"라고 쓰여 있는 거라서 직접 arr.length가 10인 걸 전제로 처리****

<br/>

## 줄 단위로 주어지는 복합 입력
```text
Y 38
N 36
Y 40
...
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

// 각 줄을 공백 단위로 다시 나눔
for (let i = 0; i < input.length; i++) {
    const [ch, num] = input[i].split(" ");
    console.log(ch, Number(num));
}
```
- split("\n") → 입력을 줄 단위로 배열에 저장. (["Y 38", "N 36", "Y 40"])
- 각 줄을 split(" ") → 문자와 숫자를 분리. ("Y 38" → ["Y", "38"])
- 문자(ch)는 그대로 두고 숫자(num)는 Number(num)으로 변환.
