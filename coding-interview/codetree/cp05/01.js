// 정수를 입력받아서 배수 출력하기
const fs = require("fs");
const input = fs.readFileSync(0, 'utf8').trim();
const num = Number(input);

let res = "";
for (let i = num; i <= 100; i += num) {
  res += i + " ";
}
console.log(res);

// 문제점
// 문제는 5개만 출력해야하는데 위 방식은
// 100 이하 N의 배수를 모두 출력한다

// 출력해야할거
// N * 1, N * 2, N * 3, N * 4, N * 5
// 만약 i <= 100 이라 식을 정하면
// N이 7이면 7,14,28,35...98까지 쭉 출력된다.

// 시작값 i = num : 첫 번째 배수 (N * 1)
// 루프당 + num : 다음 배수 (N * 2 ...)
// 종료조건 : 5번째 배수까지만
// i <= num * 5는 마지막 배수가 N×5이기 때문에 나온 조건식
for (let i = num; i <= num * 5; i += num) {
  res += i + " ";
}

// 좀 더 직관적인 방법
// 직관적으로는 횟수를 기준으로 쓰는 게 깔끔
for (let k = 1; k <= 5; k++) {
  console.log(num * k);
}