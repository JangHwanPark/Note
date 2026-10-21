## 🎨 GSAP Ease 종류 및 사용법 정리

### 🔥 Power 계열 (가장 자주 사용)
| Ease | 설명 |
|------|------|
| `power1.out` | 빠르게 시작하고 점점 느려짐 (기본적인 감속 효과) |
| `power1.in` | 천천히 시작하고 빠르게 종료됨 |
| `power1.inOut` | 양쪽에서 서서히 변화하는 균형 잡힌 움직임 |
| `power2.out` | `power1`보다 조금 더 강한 감속 효과 |
| `power3.out` | 감속 효과가 더 강함 |
| `power4.out` | 초반에 빠르게 진행하고 끝에서 완전히 느려짐 |

---

### 🎯 Elastic 계열 (탄성 효과)
| Ease | 설명 |
|------|------|
| `elastic.out(1, 0.3)` | 끝에서 튕기는 효과 (스프링처럼) |
| `elastic.in(1, 0.3)` | 시작할 때 튕기면서 등장 |
| `elastic.inOut(1, 0.3)` | 양쪽에서 탄성 효과가 적용됨 |

---

### 🏀 Bounce 계열 (바운스 효과)
| Ease | 설명 |
|------|------|
| `bounce.out` | 바닥에 닿을 때 튕기는 효과 |
| `bounce.in` | 튕기면서 시작하는 효과 |
| `bounce.inOut` | 시작과 끝에서 튕김 |

---

### ⏪ Back 계열 (뒤로 당겼다가 앞으로 튕김)
| Ease | 설명 |
|------|------|
| `back.out(1.7)` | 살짝 뒤로 당겼다가 앞으로 감 |
| `back.in(1.7)` | 앞으로 가기 전에 살짝 뒤로 움직임 |
| `back.inOut(1.7)` | 앞뒤로 살짝 당겨지는 효과 |

---

## 🛠 최적의 Ease 선택 가이드
| 사용 목적 | 추천 Ease |
|-----------|------------|
| 기본적인 부드러운 감속 | `power1.out`, `power2.out` |
| 강한 감속 효과 | `power3.out`, `power4.out` |
| 탄성 효과 (튀기는 느낌) | `elastic.out(1, 0.3)` |
| 공 튀기듯이 바운스 효과 | `bounce.out` |
| 뒤로 당겼다가 앞으로 튀어나옴 | `back.out(1.7)` |

---

## 🎬 Ease를 활용한 애니메이션 예제

### 1️⃣ 기본적인 부드러운 감속 (`power1.out`)
```js
gsap.to(".box", {
  x: 300,
  duration: 2,
  ease: "power1.out",
});
```
➡ 빠르게 시작하고 점점 느려짐 (기본 애니메이션 효과)

---

### 2️⃣ 공이 튕기는 애니메이션 (`bounce.out`)
```js
gsap.to(".box", {
  y: 300,
  duration: 2,
  ease: "bounce.out",
});
```
➡ 바닥에서 튕기는 공처럼 보이는 효과

---

### 3️⃣ 탄성 효과 (`elastic.out`)
```js
gsap.to(".box", {
  x: 300,
  duration: 2,
  ease: "elastic.out(1, 0.3)",
});
```
➡ 목표 위치에서 스프링처럼 튕김

---

### 4️⃣ 뒤로 당겼다가 앞으로 나오는 효과 (`back.out`)
```js
gsap.to(".box", {
  x: 300,
  duration: 2,
  ease: "back.out(1.7)",
});
```
➡ 목표 지점에 도달하기 전에 살짝 뒤로 당겼다가 앞으로 튕겨서 나옴