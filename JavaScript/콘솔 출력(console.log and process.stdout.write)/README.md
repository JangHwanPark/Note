## 콘솔에 출력하는 두 방법
- 프로그램이 결과나 진행 상황을 터미널(콘솔) 화면에 글자로 내보내는 일
- Node.js에서는 주로 `console.log()` 와 `process.stdout.write()` 를 쓴다
- `console.log()` 는 값을 보기 좋게 바꾸고 줄바꿈까지 붙여 주는 편의 기능이고, `process.stdout.write()` 는 받은 문자열을 그대로 내보내는 저수준 기능이다

### 표준 출력 (Standard Output, stdout)
standard는 표준, output은 내보냄이다.
공학적으로는 프로그램이 결과를 내보내는 기본 통로를 말한다. 따로 정하지 않으면 터미널 화면으로 가고, `node app.js > out.txt` 처럼 파일로 돌리거나 `node app.js | sort` 처럼 다른 프로그램으로 넘길 수도 있다. Node.js에서는 이 통로가 `process.stdout` 스트림(stream, 데이터를 조금씩 흘려보내는 통로)이다.

받아 적는 비서 두 명과 같다. `console.log()` 비서는 들은 말을 보기 좋게 정리하고 한 줄이 끝나면 알아서 줄을 바꾼다. `process.stdout.write()` 비서는 들은 글자를 그대로만 적고 줄도 바꾸지 않는다.

<br/>

## console.log()
받은 값을 문자열로 바꾼 뒤 표준 출력에 쓰고, 끝에 줄바꿈(`\n`)을 붙인다. Node.js 문서에 따르면 인수들은 `util.format()` 으로 하나의 문자열이 된다.

- 인수를 여러 개 넘기면 공백 한 칸으로 이어 붙인다
- 객체와 배열은 구조가 보이게 바꿔 준다. 바깥 객체 아래로 두 단계까지 펼치고, 세 단계째부터의 객체는 `[Object]` 로 줄여 보여 준다(`util.inspect` 의 기본 `depth` 가 2). 아래 예시에서 `a`, `b` 의 값까지는 펼쳐지고 `c` 의 값은 `[Object]` 가 된다

```js
console.log(1, 2, 3);                    // 1 2 3
console.log({ a: 1, b: 2 });             // { a: 1, b: 2 }
console.log({ a: { b: { c: { d: 1 } } } }); // { a: { b: { c: [Object] } } }
```

값을 확인하려고 찍어 보는 디버깅이나 로그를 남길 때 쓴다.

<br/>

## process.stdout.write()
받은 문자열을 그대로 표준 출력에 쓴다. 줄바꿈을 붙이지 않으므로 필요하면 `\n` 을 직접 넣는다.

```js
process.stdout.write('1');
process.stdout.write('2');
process.stdout.write('3\n');
// 결과: 123
```

문자열, Buffer, Uint8Array를 받는다. 숫자를 넘기면 `ERR_INVALID_ARG_TYPE` 코드의 TypeError가 나므로 `String()` 으로 바꿔서 넘긴다.

줄바꿈 없이 이어서 찍거나 출력 형식을 정확히 맞춰야 할 때 쓴다. 코딩 테스트처럼 정해진 형식으로 답을 내야 할 때 자주 쓴다.

<br/>

## 출력이 많을 때
출력 함수를 부를 때마다 표준 출력에 쓰는 비용이 든다. 그래서 줄이 아주 많으면 함수를 줄마다 부르기보다 결과를 배열에 모았다가 `join('\n')` 으로 한 번에 쓰는 편이 훨씬 빠르다.

```js
const out = [];
for (let i = 0; i < 5; i++) out.push(i);
process.stdout.write(out.join('\n') + '\n');
```

20만 줄을 파일로 내보내며 시간을 재 봤다(Node.js v22.13.0, Windows, 두 번 실행).

| 방식 | 걸린 시간 |
| --- | --- |
| 줄마다 `console.log()` | 2359ms, 2977ms |
| 줄마다 `process.stdout.write()` | 1879ms, 1499ms |
| 모아서 `process.stdout.write()` 한 번 | 44ms, 34ms |

줄마다 부르는 두 방식의 차이보다, 한 번에 모아 쓰는 것과의 차이가 훨씬 크다. 측정값은 환경에 따라 달라진다.

<br/>

## 참고 자료
- [Node.js 문서: console.log()](https://nodejs.org/api/console.html#consolelogdata-args)
- [Node.js 문서: process.stdout](https://nodejs.org/api/process.html#processstdout)
- 예시는 Node.js v22.13.0에서 실행해 결과를 확인했다

<br/>

## 더 볼 것 (TODO)
- 표준 입력 읽기: `readline`, `fs.readFileSync(0)` 로 코딩 테스트 입력 받기
- `console.error()` 와 표준 에러(stderr)
- `console.table()`, `console.dir()` 처럼 다른 출력 메서드
