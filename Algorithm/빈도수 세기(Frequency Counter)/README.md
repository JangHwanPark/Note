## 빈도수 세기란 ?
- 배열이나 문자열에서 각 값이 몇 번 나오는지 세어 두는 풀이 기법
- 값을 key로, 나온 횟수를 value로 저장한다. 담는 그릇으로 객체(Object), `Map`, 카운트 배열(Count Array)을 쓴다
- 한 번 세어 두면 "이 값이 몇 번 나왔나"를 O(1)에 답할 수 있어서 중복 검사, 최빈값, 애너그램 같은 문제의 기본기가 된다

### 빈도 (Frequency)
사전적 의미는 같은 일이 되풀이되는 정도, 횟수다.
알고리즘에서는 어떤 값이 자료 안에 몇 번 들어 있는지를 말한다. 빈도수 세기는 이 횟수를 표로 만들어 두는 일이다.

투표 개표와 같다. 표를 한 장씩 넘기면서 후보 이름 옆에 바를 정(正) 자를 하나씩 긋는다. 다 넘기고 나면 누가 몇 표인지 집계표만 보고 바로 안다.

<br/>

## 왜 필요할까
"배열 안에 3이 몇 번 나오나"를 물을 때마다 배열을 처음부터 훑으면 한 번 묻는 데 O(n)이 든다. 값이 n개이고 값마다 이렇게 물으면 O(n²)이 된다.

먼저 배열을 한 번만 훑으며 횟수를 표에 적어 두면(O(n)), 그 뒤로는 표에서 꺼내기만 하면 된다. 카운트 배열은 인덱스로 바로 꺼내므로 O(1)이다. `Map` 은 명세가 원소 수보다 느리게 늘어나는 접근 시간을 요구하고, V8 같은 엔진은 [해시 테이블](../해시(Hash)/해시%20테이블(Hash%20Table)/README.md)로 구현한다. 객체도 코딩 테스트에서는 사실상 O(1)로 보고 쓴다(엔진 내부 구조는 확인 필요).

<br/>

## 문자열의 빈도수 세기
문자열을 한 글자씩 돌면서, 처음 나온 글자는 1로 두고 이미 있는 글자는 1을 더한다. 문자열 길이가 n이면 시간은 O(n), 공간은 서로 다른 글자 수 k에 비례하는 O(k)다.

### 객체로 세기
```js
function charFrequency(str) {
  const freq = {};
  for (const c of str) {
    freq[c] = (freq[c] || 0) + 1; // 없으면 undefined라 0으로 바꿔 더한다
  }
  return freq;
}

console.log(charFrequency("banana"));
// { b: 1, a: 3, n: 2 }
```

### Map으로 세기
```js
function charFrequency(str) {
  const freq = new Map();
  for (const c of str) {
    freq.set(c, (freq.get(c) || 0) + 1);
  }
  return freq;
}

console.log(charFrequency("banana"));
// Map(3) { 'b' => 1, 'a' => 3, 'n' => 2 }
```

### 객체와 Map 중 무엇을 쓸까
둘 다 key로 값을 바로 꺼내지만 key를 다루는 방식이 다르다.

객체는 key를 문자열로 바꿔 저장한다(심볼은 예외). 그래서 숫자 `1` 과 문자열 `'1'` 이 같은 key가 된다.

```js
const obj = {};
for (const el of [1, '1']) obj[el] = (obj[el] || 0) + 1;
console.log(obj); // { '1': 2 }

const map = new Map();
for (const el of [1, '1']) map.set(el, (map.get(el) || 0) + 1);
console.log(map); // Map(2) { 1 => 1, '1' => 1 }
```

순서도 다르다. `Map` 은 넣은 순서대로 꺼내진다. 객체는 정수처럼 생긴 key를 오름차순으로 먼저 두고, 나머지 문자열 key를 넣은 순서대로 둔다.

```js
const o = {};
o['b'] = 1; o[10] = 1; o['a'] = 1; o[2] = 1;
console.log(Object.keys(o)); // [ '2', '10', 'b', 'a' ]
```

빈 객체 `{}` 는 `constructor`, `toString` 같은 속성을 물려받는다는 함정도 있다. 단어 빈도를 셀 때 이런 단어가 나오면 물려받은 함수에 1을 더해 엉뚱한 값이 된다.

```js
const freq = {};
for (const w of 'the constructor of toString'.split(' ')) {
  freq[w] = (freq[w] || 0) + 1;
}
console.log(freq.constructor); // 'function Object() { [native code] }1'
```

`Object.create(null)` 로 만든 객체는 물려받는 속성이 없어서 `constructor: 1` 로 바르게 센다. `Map` 도 이 문제가 없다.

숫자와 문자열을 구분해야 하거나, 처음 나온 순서가 중요하거나, 임의의 단어를 key로 쓰면 `Map`, 글자처럼 key가 뻔하고 결과를 JSON으로 바로 출력하고 싶으면 객체를 쓴다. `JSON.stringify(map)` 은 `{}` 가 되므로 `Object.fromEntries(map)` 으로 바꿔서 넘긴다.

<br/>

## 배열의 빈도수 세기
배열도 문자열과 같은 방법으로 센다. 값이 작은 정수라면 카운트 배열을 쓸 수 있다는 점만 다르다.

### 객체와 Map으로 세기
```js
function arrayFrequency(arr) {
  const freq = new Map();
  for (const el of arr) {
    freq.set(el, (freq.get(el) || 0) + 1);
  }
  return freq;
}

console.log(arrayFrequency([1, 2, 2, 3, 3, 3]));
// Map(3) { 1 => 1, 2 => 2, 3 => 3 }
```

객체로 세면 결과는 `{ '1': 1, '2': 2, '3': 3 }` 이다. key가 문자열이 된 것을 볼 수 있다.

### 카운트 배열로 세기
값 자체를 배열의 인덱스로 쓰는 방법이다. 내가 자주 헷갈리는 부분이라 따로 적어 둔다.

`count[x] = k` 는 원래 배열에서 값 x가 k번 나왔다는 뜻이다. 원래 배열의 값이 count 배열에서는 인덱스(자리 번호)가 된다.

1. 문제에서 값의 범위(예: 1~10)를 확인한다.
2. 가장 큰 값 + 1 길이의 배열을 만들고 0으로 채운다. 값 10을 인덱스 10에 넣으려면 길이가 11이어야 한다.
3. 원래 배열을 돌면서 `count[값]++` 한다.

```js
const arr = [3, 1, 4, 5, 7, 9, 6];
const count = new Array(11).fill(0); // 인덱스 0~10

for (const num of arr) {
  count[num]++;
}

console.log(count);
// [
//   0, 1, 0, 1, 1,
//   1, 1, 1, 0, 1,
//   0
// ]
```

`count[1]`, `count[7]`, `count[9]` 는 1이라 한 번씩 나왔고, `count[2]`, `count[8]` 은 0이라 나오지 않았다.

해시를 거치지 않고 인덱스로 바로 접근하므로 빠르다. 대신 배열 길이가 값의 최댓값에 따라 정해져서, 값이 1,000,000까지 나오면 원소가 몇 개 없어도 길이 1,000,001 배열을 만들어야 한다. 값의 범위가 작게 정해진 문제(점수 0~100, 요일 1~7)에 쓴다. 음수나 소수가 나오면 인덱스로 쓸 수 없으므로 객체나 `Map` 을 쓴다.

최댓값을 모를 때 `Math.max(...arr)` 로 구하기도 하는데, 원소가 많으면 오류가 난다. 이유와 실행 결과는 [배열](../배열(Array)/README.md) 노트에 정리했다. 원소가 많을 수 있으면 `reduce` 로 구한다.

```js
const max = arr.reduce((m, x) => (x > m ? x : m), -Infinity);
```

### 카운트 배열을 쓰는 문제
- 출석 체크: `count[번호] === 0` 이면 빠진 번호다
- 중복 검사: `count[x] > 1` 이면 x가 중복이다
- 최빈값: count 배열에서 가장 큰 값의 인덱스를 찾는다

<br/>

## 센 결과를 배열 메서드로 다루기
`Map` 으로 센 뒤에는 `keys()`, `values()`, `entries()` 를 배열로 펼쳐서 `filter`, `some`, `reduce` 같은 배열 메서드를 쓸 수 있다.

```js
const temp = new Map([['3', 3], ['5', 1]]);

const keys = [...temp.keys()];       // [ '3', '5' ]
const values = [...temp.values()];   // [ 3, 1 ]
const entries = [...temp.entries()]; // [ [ '3', 3 ], [ '5', 1 ] ]
```

최빈값은 entries를 돌면서 가장 큰 횟수를 찾으면 된다.

```js
const freq = arrayFrequency([3, 1, 3, 2, 1, 3]);
let mode = null;
let maxCount = 0;
for (const [value, cnt] of freq) {
  if (cnt > maxCount) {
    mode = value;
    maxCount = cnt;
  }
}
console.log(mode, maxCount); // 3 3
```

<br/>

## Set으로 서로 다른 값 세기
`Set` 은 같은 값을 한 번만 담는 집합이라 횟수는 세지 못한다. 대신 서로 다른 값이 몇 개인지, 중복을 뺀 목록이 무엇인지 알 때 쓴다.

```js
const unique = new Set([1, 2, 2, 3, 3, 3]);
console.log(unique.size); // 3
console.log([...unique]); // [ 1, 2, 3 ]
```

<br/>

## 한눈에 보는 비교
| 그릇 | key | 꺼내는 순서 | 어울리는 경우 |
| --- | --- | --- | --- |
| 객체 | 문자열로 바뀐다 | 정수 key 오름차순 뒤 넣은 순서 | 문자열의 글자 세기, 결과를 JSON으로 출력 |
| `Map` | 값 그대로(숫자, 객체도 가능) | 넣은 순서 | 숫자와 문자열을 구분해야 할 때, 처음 나온 순서가 중요할 때 |
| 카운트 배열 | 0 이상의 정수 인덱스 | 인덱스 순서 | 값의 범위가 작은 정수일 때 |
| `Set` | 값 그대로 | 넣은 순서 | 횟수 없이 서로 다른 값만 필요할 때 |

<br/>

## 확인한 환경
예시 출력은 Node.js v22.13.0에서 실행한 결과다.

<br/>

## 더 볼 것 (TODO)
- 애너그램 판별: 두 문자열의 빈도수 표가 같은지 비교하기
- 투 포인터와 슬라이딩 윈도우에서 구간의 빈도수를 늘리고 줄이며 유지하기
