- 백준은 c++로 (입출력이 귀찮음)
- 그외 JS 지원하는곳은 JS로

## 백준 Node.js 입력 템플릿


<br/>

## C++, JS 입출력
| 기능       | C++                          | JavaScript (Node.js)                                                                                   |
|----------|------------------------------|--------------------------------------------------------------------------------------------------------|
| 표준 입력    | `cin >> a >> b;`             | `const fs = require('fs'); const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');` |
| 한 줄 입력   | `string s; getline(cin, s);` | `const line = input[0];`                                                                               |
| 공백 구분 정수 | `cin >> a >> b;`             | `const [a, b] = input[0].split(' ').map(Number);`                                                      |
| 출력       | `cout << a << "\n";`         | `console.log(a);`                                                                                      |
| 여러 줄 출력  | 루프에서 `cout`                  | `console.log(arr.join('\n'));`                                                                         |

## C++, JS 변수 선언 / 자료형
| 기능     | C++                          | JavaScript                          |
|---------|------------------------------|------------------------------------|
| 정수     | `int x = 10;`               | `let x = 10;`                     |
| 큰 정수  | `long long y = 1e12;`       | `let y = 1_000_000_000_000n;` (BigInt) |
| 실수     | `double pi = 3.14;`         | `let pi = 3.14;`                  |
| 문자열   | `string s = "hi";`          | `let s = "hi";`                   |
| 상수     | `const int MOD = 1e9+7;`    | `const MOD = 1e9+7;`              |


## C++, JS 배열/벡터
| 기능            | C++ (`vector`)                                 | JavaScript                                                    |
|---------------|------------------------------------------------|---------------------------------------------------------------|
| 선언            | `vector<int> v;`                               | `const arr = [];`                                             |
| 크기 n, 0으로 초기화 | `vector<int> v(n, 0);`                         | `const arr = Array(n).fill(0);`                               |
| 2차원 n x m     | `vector<vector<int>> g(n, vector<int>(m, 0));` | `const g = Array.from({ length: n }, () => Array(m).fill(0));` |
| 뒤에 추가         | `v.push_back(x);`                              | `arr.push(x);`                                                |
| 뒤에서 제거        | `v.pop_back();`                                | `arr.pop();`                                                  |
| 길이            | `v.size()`                                     | `arr.length`                                                  |
| 오름차순 정렬       | `sort(v.begin(), v.end());`                    | `arr.sort((a, b) => a - b);`                                  |
| 뒤집기           | `reverse(v.begin(), v.end());`                 | `arr.reverse();`                                              |

C++의 `sort`, `reverse`는 `<algorithm>` 헤더에 있다.

JS의 `sort()`는 비교 함수 없이 쓰면 원소를 문자열로 바꿔 정렬한다. `[10, 9, 1].sort()`는 `[1, 10, 9]`가 되므로 숫자는 항상 `(a, b) => a - b`를 넘긴다.

JS에서 2차원 배열을 `Array(n).fill([])`로 만들면 모든 행이 같은 배열 하나를 가리킨다. 한 행을 바꾸면 전부 바뀌므로 `Array.from`으로 행마다 새 배열을 만든다.

<br/>

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

### 백준 Node.js 입력 템플릿
```js
// 백준 JS 입력 템플릿
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');
const [n, m] = input[0].split(' ').map(Number);
```

<br/>

## 하나의 값을 입력받을 때
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(" ");
const a = Number(input[0]);
const b = Number(input[1]);
```

### 공백으로 구분된 숫자로 한줄 입력받기
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

## 2줄 입력 문제 (첫 줄에 n과 m이 주어지고, 두 번째 줄에 n개의 숫자가 주어짐)
```text
10 3
1 2 3 4 5 3 7 8 3 10
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

// 첫 줄 처리
let [n, m] = input[0].split(" ").map(Number);

// 두 번째 줄 처리
let arr = input[1].split(" ").map(Number);
```

<br/>

## 첫 번째 줄에 자연수 n을 입력받고, 그 다음줄부터 n개의 줄에 걸쳐 한 줄에 하나의 값을 입력받을 때
```js
const fs = require("fs");
const [n, ...arr] = fs.readFileSync(0, "utf8").trim().split("\n");
```

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
- 이때는 첫 줄에 N이 주어지는 게 아니라, 그냥 문제 설명에 "항상 10개"라고 쓰여 있는 거라서 직접 arr.length가 10인 걸 전제로 처리

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

<br/>

## 까다로운 입력방법
```text
aba 2
1 1 2
2 a c
```
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

const [s, q] = input[0].split(" ");
const queries = input.slice(1).map(line => line.split(" "));
```
첫 줄: 문자열 S 와 정수 Q

"aba" / "2"

이후 Q줄: 질의
