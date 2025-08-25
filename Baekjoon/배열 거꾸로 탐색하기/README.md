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
