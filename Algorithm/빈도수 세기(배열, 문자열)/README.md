## 문자열의 빈도수 세기

문자열에서 각 문자가 몇 번 등장하는지 세는 방법.

주로 객체(Object) 또는 Map을 사용하여 구현한다.

### Object
#### 아이디어
1. 문자열을 한 글자씩 순회하며 key를 문자로, value를 빈도로 저장한다.
2. 없으면 1로 초기화, 있으면 기존 값에 +1.

#### 알고리즘
- 문자열 길이가 n일 때 → O(n)
- 각 접근은 O(1) (해시 테이블 기반)
- 공간은 등장한 문자 종류 수(k)에 비례 → O(k)

#### 장단점
- 장점: 문법이 단순, 가볍다.
- 단점: key는 문자열/숫자로만 제한, 삽입 순서 보장 불명확.
```js
function charFrequency(str) {
  const freq = {};
  for (const c of str) {
    freq[c] = (freq[c] || 0) + 1;
  }
  return freq;
}

console.log(charFrequency("banana")); 
// { b: 1, a: 3, n: 2 }
```

### Map
#### 아이디어
1. Map은 key로 모든 타입을 허용한다. (string, number, object, function 등)
2. 삽입 순서를 보장하기 때문에, 결과를 순회할 때 순서가 필요하다면 Map을 쓰는 게 좋다.
3. 각 문자를 key로 하고 빈도수를 value로 누적한다.

#### 알고리즘
- 문자열 길이 n → O(n)
- 접근/삽입은 평균 O(1)
- 공간 복잡도 O(k)

#### 장단점
- 장점: key 타입 제약 없음, 순서 보장, size 속성으로 길이 확인 가능.
- 단점: 문법이 약간 장황하다, JSON 직렬화 불편.
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

<br/>

## 배열로 빈도수 세기
배열 안의 값이 몇 번 나왔는지 세는 방법.

배열 요소가 숫자, 문자열 등 어떤 값이든 동일하게 처리 가능하다.

### Array 객체 사용(Array, new Array + fill())
#### 아이디어
1. 값이 정수일 때, 값 자체를 인덱스로 사용하여 등장 횟수를 카운트한다.
2. 최대값을 찾아 배열을 만들고, 인덱스 위치에 빈도를 저장.

#### 알고리즘
- 배열 길이 n + 최대값 탐색 O(n) → 전체 O(n)
- 공간 복잡도 O(max)

#### 장단점
- 장점: 접근이 O(1), 정수 범위가 작을 때 매우 효율적.
- 단점: 값의 범위가 크면 메모리 낭비 심함. (예: 최대값 1,000,000 → 배열 크기도 1,000,001)
```js
function arrayFrequency(arr) {
  const max = Math.max(...arr);             // 최대값 찾기
  const freq = new Array(max + 1).fill(0);  // 0으로 초기화된 배열 생성

  for (const num of arr) {
    freq[num]++; // 값 자체를 인덱스로 사용
  }
  return freq;
}

console.log(arrayFrequency([1, 2, 2, 3, 3, 3]));
// [0, 1, 2, 3] → 인덱스가 값, 요소가 등장 횟수
// 0: 없음, 1: 1번, 2: 2번, 3: 3번
```

### Object
#### 아이디어
1. 배열의 각 요소를 key로 하고, 배열을 순회하면서 등장 횟수를 값으로 저장한다.
2. 값이 존재하지 않으면 1로 초기화, 있으면 +1 한다.

#### 알고리즘
- 길이 n 배열 순회 O(n)
- 공간 복잡도 O(k) (k = 서로 다른 값 수)

#### 장단점
- 장점: 범용적, 구현이 단순하다.
- 단점: key는 문자열/숫자로 제한, 순서 보장 불확실.
```js
function arrayFrequency(arr) {
  const freq = {};
  for (const el of arr) {
    freq[el] = (freq[el] || 0) + 1;
  }
  return freq;
}

console.log(arrayFrequency([1, 2, 2, 3, 3, 3]));
// { '1': 1, '2': 2, '3': 3 }
```

### Map 사용
#### 아이디어
1. Object보다 더 다양한 타입을 key로 쓸 수 있고, 삽입 순서를 보장한다.
2. 빈도수가 큰 경우나 key의 타입이 복잡할 때 유리하다.

#### 알고리즘
- 배열 길이 n → O(n)
- 공간 복잡도 O(k)

#### 장단점
- 장점: 순서 보장, 다양한 타입 지원.
- 단점: Object에 비해 문법이 장황.
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

<br/>

## Set을 활용한 경우
Set은 중복 없는 값의 집합이라서 빈도수를 직접 세는 데는 못 쓴다.

하지만 중복 제거나 서로 다른 값의 개수를 세는 데 유용하다.
```js
const arr = [1, 2, 2, 3, 3, 3];
const unique = new Set(arr);
console.log(unique.size); // 3
console.log([...unique]); // [1, 2, 3]
```
