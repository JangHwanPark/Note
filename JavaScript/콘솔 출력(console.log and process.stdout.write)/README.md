## console.log()
자동 개행: 출력 후 줄바꿈 \n이 자동으로 붙음

자동 구분자: 여러 인자를 찍으면 공백으로 구분

객체 출력 지원: 객체/배열을 구조화해서 보기 좋게 출력

주 용도: 디버깅, 로그 출력
```js
console.log(1, 2, 3); // 1 2 3\n
console.log({a:1, b:2}); // { a: 1, b: 2 }
```
<br/>

## process.stdout.write()
개행 없음: 문자열을 그대로 출력 (줄바꿈 필요하면 \n 직접 붙여야 함)

저수준 출력: Node.js 표준 출력 스트림에 직접 기록

빠름: 많은 데이터 출력 시 console.log보다 약간 효율적

주 용도: 출력 형식 제어(코딩 테스트, 줄바꿈 없는 출력)
```js
process.stdout.write("1");
process.stdout.write("2");
// 결과: 12   (줄바꿈 없음)
```
