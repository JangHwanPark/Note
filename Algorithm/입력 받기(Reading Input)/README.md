## 코딩 테스트에서 입력은 어떻게 받을까
- 백준 같은 채점 사이트는 문제의 입력을 표준 입력(stdin)으로 넣어 주고, 출력은 표준 출력(stdout)으로 받는다
- Node.js에서는 `fs.readFileSync(0, "utf8")` 로 표준 입력 전체를 한 번에 문자열로 읽은 뒤, 줄(`\n`)과 공백으로 잘라 쓴다
- 이 노트는 입력 형태별로 자르는 방법과, 로컬(Windows)과 채점 서버(Linux)의 차이를 정리한다
- 나는 백준은 입출력이 간단한 C++로, 그 밖에 JS를 지원하는 곳은 JS로 푼다

### 표준 입력 (Standard Input)
standard는 표준, input은 입력이다. 프로그램이 따로 파일을 열지 않아도 기본으로 연결되어 있는 입력 통로를 말한다.
키보드로 친 글자, 파이프(`|`)로 넘긴 다른 프로그램의 출력, 채점 서버가 넣어 주는 테스트 데이터가 모두 이 통로로 들어온다. 운영체제는 이 통로에 0번이라는 번호(파일 디스크립터, File Descriptor)를 붙여 둔다. 그래서 `readFileSync(0)` 의 0이 표준 입력을 뜻한다.

<br/>

## 기본 템플릿
```js
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(/\r?\n/);
```

각 부분이 하는 일은 아래와 같다.

- `fs` 는 Node.js의 파일 시스템 모듈이다
- `readFileSync(0, "utf8")` 은 표준 입력을 끝까지 읽어 문자열로 돌려준다. 인코딩을 주지 않으면 Buffer가 돌아오므로 `.toString()` 을 한 번 더 불러야 한다
- `trim()` 은 입력 끝에 붙는 줄바꿈과 앞뒤 공백을 지운다
- `split(/\r?\n/)` 은 줄 단위로 잘라 배열로 만든다

### `/dev/stdin` 과 `0` 의 차이
백준 템플릿으로 자주 보이는 `fs.readFileSync("/dev/stdin")` 은 리눅스의 표준 입력 파일 경로를 쓴다. 채점 서버(리눅스)에서는 되지만 Windows에는 이 경로가 없다. Windows에서 입력을 파이프로 넘겨 실행해 보면 `ENOENT` 오류가 난다. `0` 은 두 운영체제에서 모두 표준 입력을 가리키므로 `readFileSync(0, "utf8")` 을 쓰면 로컬과 서버에서 같은 코드를 쓸 수 있다.

### 줄바꿈 `\r\n` 문제
Windows에서 만든 입력 파일은 줄 끝이 `\r\n` 이다. `split("\n")` 으로 자르면 각 줄 끝에 `\r` 이 남는다.

```js
// 입력: "ab\r\ncd\r\n"
const lines = fs.readFileSync(0, "utf8").trim().split("\n");
console.log(lines);          // [ 'ab\r', 'cd' ]
console.log(lines[0] === "ab"); // false
```

`Number("3\r")` 는 앞뒤 공백을 무시해 3이 되므로 숫자만 다룰 때는 티가 안 난다. 문자열을 비교하는 문제에서 갑자기 틀리는 이유가 이것이다. `split(/\r?\n/)` 으로 자르면 `\r` 이 있든 없든 같은 결과가 나온다.

로컬에서 `input.txt` 로 테스트할 때는 아래처럼 읽는다.

```js
const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split(/\r?\n/);
```

<br/>

## 입력 형태별로 자르기
### 한 줄에 공백으로 구분된 숫자
```text
6 2 4 5 4 1
```
```js
const nums = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);
// [ 6, 2, 4, 5, 4, 1 ]
```
`.map(Number)` 는 잘라 낸 문자열 하나하나를 숫자로 바꾼다. 입력은 항상 문자열로 들어오기 때문이다.

### 공백이 두 칸 이상일 수 있을 때
`split(" ")` 은 공백 한 칸을 기준으로 자르므로, 공백이 두 칸이면 사이에 빈 문자열이 생기고 `Number("")` 는 0이 된다.

```js
"6  2 4".split(" ").map(Number);   // [ 6, 0, 2, 4 ]
"6  2 4".split(/\s+/).map(Number); // [ 6, 2, 4 ]
```

`/\s+/` 는 공백, 탭, 줄바꿈이 하나 이상 이어진 곳을 한 번에 자른다. 입력이 깔끔하다고 보장되지 않으면 이쪽이 안전하다.

### 첫 줄에 n과 m, 둘째 줄에 숫자 n개
```text
10 3
1 2 3 4 5 3 7 8 3 10
```
```js
const input = fs.readFileSync(0, "utf8").trim().split(/\r?\n/);
const [n, m] = input[0].split(" ").map(Number); // 10, 3
const arr = input[1].split(" ").map(Number);    // [ 1, 2, 3, ..., 10 ]
```

### 첫 줄에 n, 다음 줄부터 한 줄에 하나씩
```text
5
1
2
3
4
5
```
```js
const input = fs.readFileSync(0, "utf8").trim().split(/\r?\n/);
const n = Number(input[0]);
const arr = input.slice(1).map(Number); // [ 1, 2, 3, 4, 5 ]
```

구조 분해로 `const [n, ...arr] = input;` 처럼 쓸 수도 있다. 이때 `n` 과 `arr` 의 원소는 아직 문자열(`"5"`, `["1", "2", ...]`)이므로 숫자로 바꾸는 것을 잊지 않는다.

### n개만 정확히 받기
```text
6
3 1 4 5 6 2
```
```js
const tokens = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
const n = tokens[0];
const arr = tokens.slice(1, 1 + n); // [ 3, 1, 4, 5, 6, 2 ]
```

줄 구분 없이 모든 값을 한 줄로 펼친 뒤 필요한 개수만 자르는 방법이다. 줄이 어떻게 나뉘어 들어오든 상관없고, 뒤에 값이 더 붙어 있어도 n개만 가져온다.

### 개수가 문제에 정해져 있을 때
문제에 "정수 10개가 주어진다"처럼 개수가 적혀 있고 첫 줄에 n이 없으면, 줄을 전부 읽어 그대로 쓴다.

```js
const arr = fs.readFileSync(0, "utf8").trim().split(/\r?\n/).map(Number);
```

### 한 줄에 문자와 숫자가 섞여 있을 때
```text
Y 38
N 36
Y 40
```
```js
const input = fs.readFileSync(0, "utf8").trim().split(/\r?\n/);
for (const line of input) {
  const [ch, num] = line.split(" ");
  console.log(ch, Number(num)); // Y 38, N 36, Y 40
}
```

줄 단위로 자른 다음 각 줄을 다시 공백으로 자르고, 숫자로 쓸 값만 `Number()` 로 바꾼다.

### 첫 줄과 나머지 줄의 형식이 다를 때
```text
aba 2
1 1 2
2 a c
```
```js
const input = fs.readFileSync(0, "utf8").trim().split(/\r?\n/);
const [s, q] = input[0].split(" ");                   // "aba", "2"
const queries = input.slice(1).map((line) => line.split(" "));
// [ [ '1', '1', '2' ], [ '2', 'a', 'c' ] ]
```

첫 줄은 문자열 S와 질의 개수 Q이고, 그 뒤 Q줄이 질의다. 질의마다 숫자와 문자가 섞여 있어서 일단 문자열 배열로 두고, 쓰는 자리에서 필요한 값만 숫자로 바꾼다.

<br/>

## C++와 JS 대응표
### 입출력
| 기능 | C++ | JavaScript (Node.js) |
| --- | --- | --- |
| 표준 입력 | `cin >> a >> b;` | `fs.readFileSync(0, "utf8")` 로 전체를 읽어 자른다 |
| 한 줄 입력 | `getline(cin, s);` | `input[0]` |
| 공백 구분 정수 | `cin >> a >> b;` | `const [a, b] = input[0].split(" ").map(Number);` |
| 출력 | `cout << a << "\n";` | `console.log(a);` |
| 여러 줄 출력 | 반복문에서 `cout` | `console.log(arr.join("\n"));` |

JS에서 줄마다 `console.log()` 를 부르면 출력이 많을 때 느려진다. 결과를 배열에 모았다가 `join("\n")` 으로 한 번에 출력한다.

### 변수와 자료형
| 기능 | C++ | JavaScript |
| --- | --- | --- |
| 정수 | `int x = 10;` | `let x = 10;` |
| 큰 정수 | `long long y = 1e12;` | `let y = 1_000_000_000_000n;` (BigInt) |
| 실수 | `double pi = 3.14;` | `let pi = 3.14;` |
| 문자열 | `string s = "hi";` | `let s = "hi";` |
| 상수 | `const int MOD = 1e9 + 7;` | `const MOD = 1e9 + 7;` |

JS의 숫자는 모두 64비트 부동 소수점이라 `Number.MAX_SAFE_INTEGER`(9007199254740991, 2⁵³ - 1)를 넘으면 모든 정수를 빠짐없이 표현할 수 없어서, 일부 정수는 가까운 다른 값으로 바뀐다. 그보다 큰 값을 다루면 BigInt(`n` 접미사)를 쓴다.

### 배열과 벡터
| 기능 | C++ (`vector`) | JavaScript |
| --- | --- | --- |
| 선언 | `vector<int> v;` | `const arr = [];` |
| 크기 n, 0으로 초기화 | `vector<int> v(n, 0);` | `const arr = Array(n).fill(0);` |
| 2차원 n x m | `vector<vector<int>> g(n, vector<int>(m, 0));` | `const g = Array.from({ length: n }, () => Array(m).fill(0));` |
| 뒤에 추가 | `v.push_back(x);` | `arr.push(x);` |
| 뒤에서 제거 | `v.pop_back();` | `arr.pop();` |
| 길이 | `v.size()` | `arr.length` |
| 오름차순 정렬 | `sort(v.begin(), v.end());` | `arr.sort((a, b) => a - b);` |
| 뒤집기 | `reverse(v.begin(), v.end());` | `arr.reverse();` |

C++의 `sort`, `reverse` 는 `<algorithm>` 헤더에 있다.

JS의 `sort()` 는 비교 함수 없이 쓰면 원소를 문자열로 바꿔 정렬한다. `[10, 9, 1].sort()` 는 `[1, 10, 9]` 가 되므로 숫자는 항상 `(a, b) => a - b` 를 넘긴다.

JS에서 2차원 배열을 `Array(n).fill([])` 로 만들면 모든 행이 같은 배열 하나를 가리킨다. 한 행을 바꾸면 전부 바뀌므로 `Array.from` 으로 행마다 새 배열을 만든다.

<br/>

## 확인한 환경
- Node.js v22.13.0, Windows 11에서 입력을 파이프로 넘겨 위 예시를 실행했다
- `/dev/stdin` 이 리눅스 채점 서버에서 동작하는 것은 직접 확인하지 않았다(확인 필요)

<br/>

## 더 볼 것 (TODO)
- 입력이 아주 클 때 `readline` 모듈로 한 줄씩 읽는 방법과 속도 비교
- 출력이 많을 때 `process.stdout.write` 로 한 번에 쓰기
