## 해시 테이블 (Hash Table)이란 ?
- key와 value를 짝지어 저장하고, key로 value를 바로 찾는 자료구조
- 내부는 배열이고, key를 배열 인덱스로 바꾸는 데 [해시 함수](../해시%20함수%28Hash%20Fn%29/README.md)를 쓴다
- 평균적으로 저장, 조회, 삭제가 모두 O(1)이다

hash는 원래 고기와 감자를 잘게 다져 섞은 요리, 또는 잘게 다진다는 뜻이다. 입력값을 잘게 다지고 섞어서 전혀 다른 모양의 숫자로 만든다는 의미가 해시 함수로 이어졌고, 그 숫자를 칸 번호로 쓰는 표라서 해시 테이블이다.

신발장 번호를 정하는 규칙과 비슷하다. "이름 글자 수를 더한 값의 끝자리"처럼 이름으로 칸 번호를 계산하는 규칙을 정해 두면, 신발장을 처음부터 훑지 않고 계산한 칸으로 바로 간다.

<br/>

## 왜 필요할까
배열에서 값을 찾으려면 앞에서부터 하나씩 비교해야 해서 O(n)이 걸린다. 인덱스를 알면 `arr[3]`처럼 바로 꺼낼 수 있지만, 우리가 아는 것은 보통 인덱스가 아니라 "apple" 같은 이름이다.

해시 테이블은 이름(key)을 인덱스로 바꾸는 방법을 정해 둬서, 이름만 알아도 배열처럼 바로 꺼낼 수 있게 한다.

<br/>

## 동작
해시 테이블은 버킷(Bucket)이라고 부르는 칸들로 이루어진 배열이다.

1. 저장할 때 key를 해시 함수에 넣어 숫자를 얻는다.
2. 그 숫자를 배열 크기로 나눈 나머지를 인덱스로 쓴다.
3. 그 인덱스의 버킷에 key와 value를 함께 넣는다.
4. 찾을 때도 같은 key로 같은 계산을 하면 같은 인덱스가 나오므로 그 버킷만 보면 된다.

<br/>

## 충돌 (Collision)
서로 다른 key가 같은 인덱스로 계산되는 것을 충돌이라고 한다. 버킷 수는 정해져 있고 key는 무한히 많으니 충돌은 피할 수 없다. 그래서 충돌이 났을 때 어떻게 할지를 정해 둔다.

### 체이닝 (Chaining)
한 버킷에 여러 쌍을 리스트로 이어 붙인다. 찾을 때는 해당 버킷의 리스트만 훑는다.

### 개방 주소법 (Open Addressing)
자리가 차 있으면 다음 빈 버킷을 찾아 거기 넣는다. 가장 단순한 방식은 한 칸씩 옆으로 가 보는 선형 탐사(Linear Probing)다.

<br/>

## 직접 만들어 보기
체이닝 방식으로 만든 작은 해시 테이블이다.

```js
class HashTable {
  constructor(size = 8) {
    this.buckets = Array.from({ length: size }, () => []);
  }

  hash(key) {
    let h = 0;
    for (const ch of key) {
      h = (h * 31 + ch.charCodeAt(0)) % this.buckets.length;
    }
    return h;
  }

  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const pair = bucket.find(([k]) => k === key);
    if (pair) pair[1] = value;      // 같은 key가 있으면 값만 바꾼다
    else bucket.push([key, value]); // 없으면 버킷 끝에 붙인다
  }

  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const pair = bucket.find(([k]) => k === key);
    return pair ? pair[1] : undefined;
  }
}

const table = new HashTable();
table.set('apple', 1000);
table.set('banana', 2000);
table.set('apple', 1500);

console.log(table.get('apple'));  // 1500
console.log(table.get('banana')); // 2000
console.log(table.get('grape'));  // undefined
```

<br/>

## 시간 복잡도
key가 버킷에 고르게 퍼져 있으면 버킷마다 쌍이 몇 개 없어서 평균 O(1)이다. 반대로 해시 함수가 나빠서 모든 key가 한 버킷에 몰리면 그 버킷을 다 훑어야 해서 O(n)이 된다.

그래서 실제 구현은 저장된 개수가 버킷 수에 비해 많아지면 배열을 더 크게 만들고 모든 쌍을 다시 배치한다(리해싱, Rehashing).

<br/>

## 자바스크립트에서 쓰기
코테에서는 직접 만들 일 없이 `Object`나 `Map`을 쓴다. 둘 다 key로 value를 바로 찾는 용도다.

```js
const counter = new Map();
for (const word of ['a', 'b', 'a']) {
  counter.set(word, (counter.get(word) ?? 0) + 1);
}
console.log(counter.get('a')); // 2
console.log(counter.size);     // 2
```

`Map`은 문자열이 아닌 값도 key로 쓸 수 있고 `size`로 개수를 바로 알 수 있어서, 빈도수 세기처럼 key를 계속 추가하는 문제에 더 편하다.
