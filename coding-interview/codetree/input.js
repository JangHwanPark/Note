// 한줄에 정수 하나 입력받기
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();  // "/dev/stdin" 대신 0 가능
const num = Number(input);

// 한줄에 여러 정수 입력받기
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);

// 첫 줄에 N, 그 다음 줄에 데이터 (가장 자주 나오는 패턴)
const fs = require("fs");
const [n, arr] = fs.readFileSync(0, "utf8").trim().split("\n");
const N = Number(n);
const numbers = arr.split(" ").map(Number);