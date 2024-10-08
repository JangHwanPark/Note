### 트랜지션 (Transition)

---
트랜지션은 어떤 속성이 변경될 때마다 즉시 발생하지 않고 일정 시간에 걸쳐서 부드럽게 일어나도록 하는 속성이다.

보통 hover, active 같이 사용자 상호작용시 사용된다.

### <br>트랜스폼 (Transform)

---
트랜스폼은 요소의 크기, 위치, 회전 등을 변경할 수 있는 속성이다.  
트랜스폼 자체는 애니메이션이 아니지만 트랜지션과 키프레임 애니메이션과 함께 자주 사용된다.

- `rotate(deg)`: 요소를 지정된 각도(degree)만큼 회전시킨다.
- `scale(x, y)`: 요소의 크기를 확대 또는 축소한다. (`scale(1.5)` 또는 `scale(1.5, 2)`)
- `translate(x, y)`: 요소를 지정된 거리만큼 이동시킨다. (px, %, em 등의 단위 사용)
- `skew(x, y)`: 요소를 지정된 각도만큼 기울인다. (deg 단위 사용)

### <br>키 프레임 (Keyframes)

---
키프레임 애니메이션은 애니메이션의 시작과 끝, 그리고 중간 상태를 정의할 수 있다. 이로 인해 좀 더 복잡하고 정교한 애니메이션을 만들 수 있다.

#### 키프레임 주요 속성
- `@keyframes`: 애니메이션의 각 단계를 정의한다.
- `animation-name`: 적용할 애니메이션 이름을 지정한다.
- `animation-duration`: 애니메이션이 진행되는 시간을 지정한다.
- `animation-timing-function`: 애니메이션의 속도 곡선을 지정한다.
- `animation-delay`: 애니메이션이 시작되기 전 대기시간을 지정한다.
- `animation-iteration-count`: 애니메이션 반복횟수를 지정한다.
- `animation-direction`: 애니메이션 진행 방향을 지정한다. (normal, reverse, alternate, alternate-reverse)
- `animation-fill-mode`: 애니메이션이 끝난 후 상태를 지정한다. (none, forwards, backwards, both)

### <br> 트랜지션과 애니메이션에 사용할 수 있는 타이밍 함수

---

타이밍 함수는 트랜지션과 키프레임 애니메이션 등에서 사용할 수 있으며 애니메이션의 속도 변화 패턴을 제어한다.

- `ease`: 시작과 끝 부분이 느리고 중간 부분이 빠르다. (기본값)
- `linear`: 시작부터 끝까지 일정한 속도로 진행된다.
- `ease-in`: 천천히 시작해서 점점 빨라진다.
- `ease-out`: 빠르게 시작해서 점점 느려진다.
- `ease-in-out`: 천천히 시작해서 중간에 빨라지고 다시 천천히 끝난다.
- `cubic-bezier()`: 사용자가 속도 곡선을 정의 할 수 있다.
- `infinite`: 애니메이션의 반복 횟수를 지정할 때 사용되는 값으로 애니메이션을 무한하게 반복한다.