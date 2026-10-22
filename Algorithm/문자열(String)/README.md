## 문자열 문제에서 자주 하는 일
- 코딩 테스트의 문자열 문제는 대부분 찾기, 바꾸기, 지우기, 밀기(회전), 비교 중 하나이거나 그 조합이다
- 자바스크립트 문자열은 한 번 만들면 바꿀 수 없다(불변, immutable). 그래서 "바꾼다"는 것은 항상 새 문자열을 만든다는 뜻이다
- 이 노트는 이 다섯 가지를 메서드와 함께 정리한다

### 불변 (Immutable)
사전적 의미는 변하지 않음이다. 문자열의 한 글자를 `str[0] = "H"` 처럼 바꾸려 해도 원래 문자열은 그대로 남는다. 일반 스크립트에서는 아무 일 없이 무시되고, strict mode에서는 `TypeError: Cannot assign to read only property '0' of string 'hello'` 가 난다. 바꾼 결과가 필요하면 새 문자열을 만들어 변수에 다시 넣는다.

인쇄된 책과 같다. 오타를 고치려면 그 쪽에 덧칠하는 게 아니라 고친 판을 새로 찍는다.

<br/>

## 문자 찾기
문자열 안에서 특정 문자가 어디에 있는지 찾는다.

- `indexOf()` 는 처음 나오는 인덱스를 돌려준다. 없으면 -1이다
- `lastIndexOf()` 는 마지막으로 나오는 인덱스를 돌려준다
- `includes()` 는 있는지 없는지만 `true`/`false` 로 알려 준다

```js
const str = "hello world";
console.log(str.indexOf("o"));      // 4
console.log(str.lastIndexOf("o"));  // 7
console.log(str.includes("world")); // true
```

### 모든 위치와 개수 찾기
메서드는 한 위치만 돌려주므로, 모든 위치가 필요하면 배열로 나눠 걸러 낸다.

```js
const str = "hello world";

// 'o'가 몇 개인지
const count = str.split("").filter((ch) => ch === "o").length;
console.log(count); // 2

// 'o'가 나오는 모든 인덱스
const positions = str
  .split("")
  .map((ch, idx) => (ch === "o" ? idx : -1))
  .filter((idx) => idx !== -1);
console.log(positions); // [ 4, 7 ]
```

<br/>

## 문자 바꾸기
불변이라 직접 고칠 수 없으므로 두 가지 방법 중 하나를 쓴다. 배열로 바꿔 고친 뒤 다시 합치거나, 앞뒤를 잘라 새 글자를 끼워 이어 붙인다.

```js
let str = "hello";
const arr = str.split("");
arr[0] = "H";
str = arr.join("");
console.log(str); // "Hello"

let str2 = "hello";
str2 = str2.slice(0, 1) + "a" + str2.slice(2);
console.log(str2); // "hallo"
```

여러 글자를 고칠 때는 배열 방식이, 한 자리만 고칠 때는 `slice` 방식이 간단하다.

<br/>

## 문자 지우기
특정 문자를 지울 때는 `replace` 나 걸러 내기를 쓴다.

```js
const str = "hello world";

str.replace("l", "");                          // "helo world" (첫 번째만)
str.replace(/l/g, "");                         // "heo word" (정규식 g 플래그로 전부)
str.replaceAll("l", "");                       // "heo word" (ES2021부터)
str.split("").filter((ch) => ch !== "l").join(""); // "heo word"
```

`replace` 에 문자열을 넘기면 처음 하나만 바뀐다는 점을 자주 놓친다. 전부 바꾸려면 정규식에 `g` 를 붙이거나 `replaceAll` 을 쓴다.

<br/>

## 문자열 밀기 (회전)
문자열을 왼쪽이나 오른쪽으로 한 칸씩 돌린다. 맨 앞(또는 맨 뒤) 글자를 떼어 반대쪽에 붙이면 된다.

```js
const str = "abcdef";

const left = str.slice(1) + str[0];
console.log(left); // "bcdefa"

const right = str[str.length - 1] + str.slice(0, -1);
console.log(right); // "fabcde"
```

`slice(0, -1)` 의 -1은 뒤에서 첫 번째 위치를 뜻해서, 마지막 글자 바로 앞까지 자른다.

<br/>

## 문자열 비교
`<`, `>` 로 비교하면 앞 글자부터 차례로 UTF-16 코드 단위 값을 비교한다. 사전 순서와 비슷하지만 똑같지는 않다.

```js
console.log("apple" < "banana"); // true
console.log("Zoo" < "apple");    // true (대문자가 소문자보다 앞)
console.log("10" < "9");         // true (숫자가 아니라 글자 '1'과 '9'를 비교)
console.log("Zoo".toLowerCase() === "zoo"); // true
```

대소문자를 무시하려면 비교 전에 `toLowerCase()` 로 맞춘다. 숫자로 이루어진 문자열을 크기로 비교하려면 `Number()` 로 바꾼 뒤 비교한다. 사람이 읽는 사전 순서가 필요하면 `"a".localeCompare("b")` 를 쓴다(앞이면 음수, 같으면 0, 뒤면 양수).

<br/>

## 확인한 환경
- 예시 출력은 Node.js v22.13.0에서 실행한 값이다

<br/>

## 더 볼 것 (TODO)
- 팰린드롬(회문) 판별
- 문자열 뒤집기와 이모지처럼 코드 단위가 두 개인 글자
