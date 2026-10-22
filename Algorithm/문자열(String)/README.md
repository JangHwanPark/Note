## 문자 찾기
문자열 안에서 특정 문자가 어디에 있는지 찾는다.

### 아이디어
1. indexOf() → 해당 문자의 첫 번째 인덱스 반환. 없으면 -1.
2. lastIndexOf() → 마지막 인덱스 반환.
3. includes() → 존재 여부만 true/false.
4. filter 응용 → 전체에서 특정 문자의 모든 등장 위치를 찾아낼 때 사용 가능.
```js
const str = "hello world";
console.log(str.indexOf("o"));     // 4
console.log(str.lastIndexOf("o")); // 7
console.log(str.includes("world")); // true
```
### filter 활용하여 찾기
```js
const str = "hello world";

// 특정 문자 'o'만 뽑기
const result = str.split("").filter(ch => ch === "o");
console.log(result); // ["o", "o"]
console.log(result.length); // 2개
```

### 문자 위치 찾기 (인덱스 필요할 경우)
```js
const str = "hello world";

const positions = str
  .split("")
  .map((ch, idx) => (ch === "o" ? idx : -1))
  .filter(idx => idx !== -1);

console.log(positions); // [4, 7]
```

<br/>

## 문자 수정
- 문자열은 불변(immutable) 이므로 직접 수정 불가.
- 배열로 변환 후 수정하거나, 부분 문자열을 이어 붙여서 새 문자열 생성.
```js
let str = "hello";
let arr = str.split("");
arr[0] = "H";
str = arr.join("");
console.log(str); // "Hello"
```
```js
let str2 = "hello";
str2 = str2.slice(0, 1) + "a" + str2.slice(2);
console.log(str2); // "hallo"
```

<br/>

## 문자 삭제
특정 문자를 제거하고 싶을 때는 filtering 또는 replace 사용.
```js
let str = "hello world";

// replace (첫 번째만)
console.log(str.replace("l", "")); // "helo world"

// 정규식 + g (전체)
console.log(str.replace(/l/g, "")); // "heo word"

// filter 활용
console.log(str.split("").filter(ch => ch !== "l").join(""));
// "heo word"
```

<br/>

## 문자열 밀기
문자열을 왼쪽/오른쪽으로 한 칸씩 당기는 것과 유사하다.
→ substring/slice 조합으로 회전(rotate) 구현 가능.
```js
let str = "abcdef";

// 왼쪽으로 한 칸 밀기
let left = str.slice(1) + str[0];
console.log(left); // "bcdefa"

// 오른쪽으로 한 칸 밀기
let right = str[str.length - 1] + str.slice(0, -1);
console.log(right); // "fabcde"
```

<br/>

## 문자열 비교
문자열을 사전 순(lexicographical)으로 비교하거나, 특정 조건에 따라 비교한다.
```js
console.log("apple" < "banana"); // true
console.log("cat" === "cat");    // true
console.log("Zoo".toLowerCase() === "zoo"); // true
```
