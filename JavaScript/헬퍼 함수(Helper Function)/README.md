## 헬퍼 함수 (Helper Function)
큰 로직(메인 작업) 안에서 특정한 역할만 분리해서 도와주는 작은 함수

`도우미 함수`라고도 부르며, 함수 안에서 반복되거나 복잡한 연산을 따로 빼낼 때 자주 사용.

<br/>

### 왜 쓰는가?
가독성 ↑ : 메인 함수는 큰 흐름만 담당 → 읽기 쉬워짐.

재사용성 ↑ : 비슷한 작업을 여러 군데서 호출 가능.

테스트/디버깅 편리 : 잘게 나눠진 부분만 따로 실행해서 확인 가능.

유지보수 용이 : 특정 로직 수정이 필요할 때, 헬퍼 함수만 고치면 됨.

<br/>

### 특징
보통 작고 단일한 역할만 담당 (SRP: 단일 책임 원칙과도 연결).

메인 함수 안에서만 쓰이는 경우도 있고, 범용적으로 쓸 수도 있음.

이름을 잘 지어주면 의도 파악이 훨씬 쉬워짐.

<br/>

### 예시
#### 1. 메인 함수 안에 전부 몰아넣은 경우
조건이 많아지면 복잡해지고 읽기 힘듦.
```js
function countOnjeon(a, b) {
  let cnt = 0;
  for (let i = a; i <= b; i++) {
    if (i % 2 === 0) continue;               // 조건1
    if (i % 10 === 5) continue;              // 조건2
    if (i % 3 === 0 && i % 9 !== 0) continue;// 조건3
    cnt++;
  }
  return cnt;
}
```

#### 2. 헬퍼 함수로 분리한 경우
메인 로직은 “isOnjeon으로 걸러서 세라” 딱 한 줄만 보이면 됨.

가독성, 재사용성 둘 다 좋아짐.
```js
// 헬퍼 함수: 숫자가 온전수인지 판별
function isOnjeon(n) {
  if (n % 2 === 0) return false;
  if (n % 10 === 5) return false;
  if (n % 3 === 0 && n % 9 !== 0) return false;
  return true;
}

// 메인 함수: 개수 세기
function countOnjeon(a, b) {
  let cnt = 0;
  for (let i = a; i <= b; i++) {
    if (isOnjeon(i)) cnt++;
  }
  return cnt;
}
```
