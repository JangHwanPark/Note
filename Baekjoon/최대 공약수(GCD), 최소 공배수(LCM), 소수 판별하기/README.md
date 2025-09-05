## 최대 공약수 (GCD)
두 수를 공통으로 나눌 수 있는 가장 큰 수

큰 수에서 작은 수를 계속 나머지로 깎아가면, 공약수만 남는다.

### 유클리드 호제법 (Euclidean Algorithm)
두 수의 최대공약수(GCD)를 구하는 고전적인 알고리즘

두 수의 최대공약수는, 작은 수와 두 수를 나눈 나머지의 최대공약수와 같다.

gcd(a, b)에서 a > b라고 했을때 a = b * q + r (나눗셈의 몫과 나머지)

그러면 gcd(a, b) = gcd(b, r)

왜냐하면 a와 b의 공약수는 r = a - b*q도 나누고, 반대로 b와 r의 공약수는 a = b*q + r도 나눔.

→ 공약수 집합이 동일.

```js
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const r = a % b;
    a = b; b = r;
  }
  return a;
}
```

<br/>

## 최소 공배수 (LCM)
두 수의 공통 배수 중 가장 작은 수.

lcm(a,b) = |a*b| / gcd(a,b) (둘 중 하나가 0이면 0)

두 수의 곱은 `공약수 * 공배수` 구조라, gcd로 겹친 부분 나눠주면 최소 공배수만 남음.

lcm(6, 8) = (6 * 8) / gcd(6 , 8) = 48 / 2 = 24

큰 수에서 a*b가 overflow 우려 → 먼저 a / gcd(a,b) 하고 나서 * b 권장
```js
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b) * b);
}
```

<br/>

## 소수 판별하기 (O(√n))
n ≥ 2이고, 1과 자기 자신만 약수인 수.

약수는 짝으로 나오므로 √n까지만 검사하면 충분.

**알고리즘**
1. n < 2 → 소수 아님
2. 2 체크 후, 홀수만 3..√n 검사
3. 하나라도 나누어떨어지면 소수 아님

n=49 → √49=7, 7로 나눠떨어짐 → 합성수

<= √n까지 포함해서 검사해야 함(제곱수 잡기).

큰 범위 합/개수는 에라토스테네스의 체 사용.

```js
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
```
