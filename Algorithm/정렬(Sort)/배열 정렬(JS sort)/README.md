## sort()로 코딩 테스트 정렬하기
- 자바스크립트 배열의 `sort()` 로 숫자, 문자열, 객체 배열을 원하는 순서로 정렬하는 방법
- 비교 함수(compareFn)를 넘기지 않으면 숫자도 문자열로 바꿔 비교해서 `[10, 2, 1, 4]` 가 `[1, 10, 2, 4]` 가 된다
- `sort()` 는 원본 배열을 바꾸고 그 배열을 그대로 돌려준다. 원본을 남기려면 ES2023에 들어온 `toSorted()` (Node.js 20 이상)를 쓰고, 그보다 낮은 채점 환경이면 `[...arr].sort()` 처럼 복사한 뒤 정렬한다

기본 정렬 순서, 원본이 바뀌는 문제, `toSorted()` 는 [JavaScript 배열 노트의 sort 부분](../../../JavaScript/배열(Array)/README.md)에 정리했다. 이 노트는 코딩 테스트에서 자주 쓰는 비교 함수 패턴을 모은다.

<br/>

## 기본 정렬이 숫자를 틀리게 정렬하는 이유
```js
const arr = [10, 2, 1, 4];
arr.sort();
console.log(arr); // [ 1, 10, 2, 4 ]
```
<img width="689" height="309" alt="image" src="https://github.com/user-attachments/assets/e1e4a7c7-77b9-4e77-a2d1-a7f1ac6bae59" />

비교 함수가 없으면 원소를 문자열로 바꾼 뒤 UTF-16 코드 단위 순서로 비교한다. 문자열 "10" 과 "2" 는 첫 글자 "1" 과 "2" 를 먼저 비교하므로 "10" 이 앞에 온다. 사전 순서와 비슷하지만 같지는 않다. 대문자 코드가 소문자보다 작아서 `['b', 'B', 'a', 'A'].sort()` 는 `[ 'A', 'B', 'a', 'b' ]` 가 된다.

<br/>

## 비교 함수
비교 함수는 원소 두 개 a, b를 받아 숫자 하나를 돌려준다. 정렬 알고리즘 자체는 자바스크립트 엔진이 맡고, 비교 함수는 둘 중 무엇이 앞인지만 알려 준다.

- 음수를 돌려주면 a가 b보다 앞에 온다
- 양수를 돌려주면 b가 a보다 앞에 온다
- 0을 돌려주면 둘의 원래 순서를 유지한다(ES2019부터 `sort` 가 안정 정렬로 정해졌다)

```js
function cmp(prev, cur) {
  if (prev > cur) return 1;   // prev가 크면 cur이 앞으로 간다
  if (prev < cur) return -1;  // prev가 작으면 prev가 앞에 남는다
  return 0;                   // 같으면 그대로 둔다
}

const arr = [10, 2, 1, 4];
arr.sort(cmp);
console.log(arr); // [ 1, 2, 4, 10 ]
```

숫자라면 `prev - cur` 한 줄로 같은 결과를 낸다. prev가 작으면 음수, 크면 양수, 같으면 0이 나오기 때문이다.

```js
arr.sort((a, b) => a - b); // 오름차순 [ 1, 2, 4, 10 ]
arr.sort((a, b) => b - a); // 내림차순 [ 10, 4, 2, 1 ]
```

### 참과 거짓을 돌려주면 안 된다
`(a, b) => a > b` 처럼 불리언을 돌려주면 정렬되지 않는다. `true` 는 1, `false` 는 0으로 바뀌어서 "a가 앞"을 뜻하는 음수가 한 번도 나오지 않기 때문이다.

```js
console.log([3, 1, 2, 5, 4].sort((a, b) => a > b)); // [ 3, 1, 2, 5, 4 ]
```

<br/>

## 객체 배열 정렬하기
객체를 정렬할 때는 어느 속성을 기준으로 비교할지 비교 함수 안에서 정한다.

```js
const students = [
  { name: 'lee',  height: 167, weight: 40.1 },
  { name: 'kim',  height: 149, weight: 32.9 },
  { name: 'park', height: 161, weight: 53.1 },
  { name: 'choi', height: 183, weight: 70.3 },
  { name: 'jung', height: 155, weight: 45.7 },
];
```

### 숫자 속성으로 정렬하기
```js
students.sort((a, b) => b.height - a.height); // 키 큰 순: choi, lee, park, jung, kim
students.sort((a, b) => a.height - b.height); // 키 작은 순: kim, jung, park, lee, choi
```

### 문자열 속성으로 정렬하기
문자열은 빼기를 할 수 없으므로 크기를 비교해 -1, 1, 0을 직접 돌려준다.

```js
function byNameAsc(a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
}

function byNameDesc(a, b) {
  return byNameAsc(b, a); // 순서를 뒤집어 넘기면 내림차순이 된다
}

students.sort(byNameAsc);  // choi, jung, kim, lee, park
students.sort(byNameDesc); // park, lee, kim, jung, choi
```

한 줄로 줄이면 아래와 같다. 비교 결과인 불리언을 빼면 `true` 는 1, `false` 는 0으로 바뀌어 -1, 0, 1 중 하나가 나온다.

```js
students.sort((a, b) => (a.name > b.name) - (a.name < b.name));
```

한글이나 대소문자가 섞인 이름을 사람이 읽는 순서로 정렬하려면 `localeCompare` 를 쓴다. 위 예시에서는 `students.sort((a, b) => a.name.localeCompare(b.name))` 도 같은 결과(choi, jung, kim, lee, park)가 나왔다.

### 기준이 여러 개일 때
앞 기준이 같을 때만 다음 기준을 비교한다. `||` 는 앞 값이 0이면 뒤 값을 쓰므로 이 흐름을 짧게 쓸 수 있다.

```js
// 키 큰 순, 키가 같으면 이름 순
students.sort((a, b) => b.height - a.height || a.name.localeCompare(b.name));
```

위 배열에 키가 park과 같은 `{ name: 'ahn', height: 161 }` 을 넣고 실행하면 choi, lee, ahn, park, jung, kim 순으로 나온다. 키 161인 두 사람은 이름 순으로 ahn이 앞에 온다.

<br/>

## 확인한 환경
예시 출력은 Node.js v22.13.0에서 실행한 결과다.

<br/>

## 더 볼 것 (TODO)
- `localeCompare` 의 옵션(대소문자 무시, 숫자 섞인 문자열 자연 정렬)
