## 해시란 ?
- 데이터를 위치 번호(인덱스)가 아니라 이름(key)으로 저장하고 찾는 방식
- key를 [해시 함수](./해시%20함수(Hash%20Function)/README.md)로 숫자로 바꾼 뒤, 그 숫자를 자리 번호로 써서 [해시 테이블](./해시%20테이블(Hash%20Table)/README.md)에 넣는다
- 코딩 테스트에서는 직접 만들지 않고 자바스크립트의 객체(Object)와 `Map` 으로 쓴다. `Map` 은 V8 같은 엔진이 해시 테이블로 구현하고, 객체도 사실상 key로 바로 찾는 용도로 쓴다(객체의 엔진 내부 구조는 확인 필요)

### 해시 (Hash)
사전적 의미는 잘게 다지다, 뒤섞다이다. 고기와 감자를 다져 섞은 요리 이름이기도 하다.
공학적으로는 입력을 잘게 다지고 섞어 정해진 범위의 숫자로 바꾸는 일, 그리고 그 숫자로 데이터를 찾는 방식을 말한다.

배열이 번호 붙은 사물함이라면 해시는 이름으로 사물함 번호를 계산하는 규칙이다. 배열은 "3번 사물함"처럼 번호를 알아야 열 수 있지만, 해시는 "김철수"라는 이름을 규칙에 넣어 번호를 계산한 뒤 그 칸을 바로 연다.

<br/>

## 왜 필요할까
배열에서 어떤 값을 찾으려면 앞에서부터 하나씩 비교해야 한다. 원소가 n개면 최악의 경우 n번 비교한다(O(n)).

```js
const target = "value";
const array = ["value1", "value2", "value3", "value4", "value"];
```

```text
i = 0 -> array[0] === target -> false
i = 1 -> array[1] === target -> false
i = 2 -> array[2] === target -> false
i = 3 -> array[3] === target -> false
i = 4 -> array[4] === target -> true
```

해시는 key로 자리를 바로 계산하므로 몇 개가 들어 있든 평균 O(1)에 찾는다.

```js
const hash = {
  data1: "value data1",
  data2: "value data2",
};

console.log(hash["data1"]); // value data1
console.log(hash.data1);    // value data1
```

값을 찾는 일을 반복하는 문제(빈도수 세기, 두 수의 합, 방문 여부 기록)에서 O(n²) 풀이를 O(n)으로 줄이는 데 쓴다.

<br/>

## 자바스크립트에서 쓰는 해시
객체는 `obj.key` 와 `obj[변수]` 두 가지로 꺼낸다. 변수에 담긴 key로 꺼내려면 대괄호를 써야 하고, 점 표기법에 변수를 쓰면 그 변수 이름 자체를 key로 찾아 `undefined` 가 나온다.

```js
const hashKey = "data1";
const hash = { data1: "value data1" };

console.log(hash[hashKey]); // value data1
console.log(hash.hashKey);  // undefined
```

두 표기법의 차이는 [객체 속성에 접근하는 두 방법](../../JavaScript/객체(Object)/README.md)에 자세히 정리했다. 객체와 `Map` 중 무엇을 쓸지는 [빈도수 세기](../빈도수%20세기(Frequency%20Counter)/README.md)에 비교해 두었다.

<br/>

## 하위 문서
- [해시 테이블 (Hash Table)](./해시%20테이블(Hash%20Table)/README.md) : key를 인덱스로 바꿔 저장하는 구조, 충돌과 체이닝, 직접 만든 해시 테이블
- [해시 함수 (Hash Function)](./해시%20함수(Hash%20Function)/README.md) : 좋은 해시 함수의 조건, 글자 코드를 더하는 방식과 자리마다 곱하는 방식의 차이

<br/>

## 확인한 환경
예시 출력은 Node.js v22.13.0에서 실행한 결과다.
