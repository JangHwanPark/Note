## 용어
### 피벗(Pivot)
기준값

### 파티션(Partition)
분할 과정 그 자체

### 파티션 스킴 (Partition Scheme)
데이터를 논리적 또는 물리적으로 나누는 규칙이나 구성 방식
#### Lomuto 파티션
- 피벗을 끝에 둠
- 구현 쉬움
- 성능은 애매
#### Hoare 파티션
- 양쪽에서 포인터 이동 
- 교환하면서 좁힘

### 분할정복(Divide and Conquer)
데이터를 작은 단위로 나눠서 문제를 해결하는 전략
- 나눈다 Divide 
- 각각 처리한다 Conquer 
- 결과를 합친다 Combine

### 재귀(Recursion)
재귀는 함수가 자기 자신을 호출하는 프로그래밍 기법
- 기본 조건(Base Case) : 재귀 호출을 멈추는 조건
- 재귀 호출(Recursive Call) : 함수가 자기 자신을 호출하는 부분
- 재귀 종료(Recursive Termination) : 재귀 호출이 멈추는 시점
퀵정렬은 왼쪽 배열 퀵정렬 오른쪽 배열 퀵정렬