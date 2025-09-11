## Array.prototype.sort([compareFunction])
배열의 원소를 오름차순으로 정렬하며, 배열 내 요소를 문자열로 취급하여 오름차순으로 정렬해준다.

배열의 원소를 **정렬된 배열**로 반환한다. 단, 복사본이 아닌 **원본 배열을 직접 수정**한다.

### 기본 동작
- 매개변수 `compareFunction`이 없을 경우
- 배열 요소를 **문자열(String)으로 변환한 뒤**, 유니코드 코드 포인트 순으로 정렬한다.
```js
let arr = [10, 2, 1, 4];
arr.sort();
console.log(arr); // [ 1, 10, 2, 4 ]
```
<img width="689" height="309" alt="image" src="https://github.com/user-attachments/assets/e1e4a7c7-77b9-4e77-a2d1-a7f1ac6bae59" />

원래라면 `[1, 2, 4, 10]`이 출력되어야하지만 다른결과가 출력된다. 이는 사전순으로 정렬되었기 때문이다.

JS에서는 compare function을 통해 의도대로 정렬을 진행할 수 있다.

<br/>

## compareFunction
compareFunction은 두 원소 a, b를 입력받아 음수 / 0 / 양수를 반환하며, 그 값에 따라 정렬 순서가 정해진다.

비교 함수는 단순히 부호(음/양/0)를 알려주는 역할이고, 나머지 정렬 로직은 자바스크립트 엔진(V8)이 맡아서 한다.

- 반환값 < 0 → a가 b보다 앞에 온다.
- 반환값 > 0 → b가 a보다 앞에 온다.
- 반환값 = 0 → 순서를 바꾸지 않는다.
```js
function cmp(prev, cur) {
    if (prev > cur) return 1;        // prev가 크면 cur이 앞으로 감
    else if (prev < cur) return -1;  // prev가 작으면 prev가 앞으로 유지
    return 0;  // 같으면 그대로
}

let arr = [10, 2, 1, 4];
arr.sort(cmp);
console.log(arr); // [ 1, 2, 4, 10 ]
```
sort는 두 값을 비교한 결과(음수, 양수, 0)에 따라 두 원소의 위치를 바꾸거나 유지한다.

```js
function cmp(prev, cur) {
    return prev - cur;
}
```
prev - cur라는 단순한 수학 연산으로 위의 if문 로직과 동일한 효과를 낼 수 있다.
- prev < cur → 음수 반환 → prev가 앞으로 유지됨
- prev > cur → 양수 반환 → cur이 앞으로 이동
- prev === cur → 0 반환 → 순서 유지

<br/>

## 콜백 화살표 함수로 축약 가능
```js
arr.sort((a, b) => a - b);  // 오름차순
arr.sort((a, b) => b - a);  // 내림차순
```
