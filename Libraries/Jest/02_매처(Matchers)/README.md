## 매처란 ?
- 기대한 값(expected value)과 실제 값(actual value)을 비교하는 함수
- `expect(실제 값)` 뒤에 점으로 이어 `expect(2 + 2).toBe(4)` 처럼 쓴다
- 비교가 맞으면 아무 일도 없고, 틀리면 에러를 던져 그 테스트를 실패로 만든다

### 매처 (Matcher)
match의 사전적 의미는 어울리다, 일치하다이다. matcher는 일치하는지 맞춰 보는 것이라는 뜻이다.
Jest에서는 실제 값이 기대한 조건과 맞는지 확인하는 함수를 말한다. `expect` 는 실제 값을 받아 매처를 부를 수 있는 객체를 돌려주고, 매처가 그 값을 기대한 값과 비교한다.

자물쇠와 열쇠를 맞춰 보는 것과 같다. 열쇠(실제 값)가 자물쇠(기대한 값)에 맞으면 그냥 넘어가고, 맞지 않으면 그 자리에서 멈춘다.

<br/>

## 왜 매처가 여러 개일까
값이 같다는 말에도 여러 뜻이 있다. 숫자 4는 4와 같지만, 내용이 같은 두 객체가 같은 객체인지는 무엇을 비교하느냐에 따라 답이 다르다. 계산 결과가 0.3에 아주 가까운 소수인지, 배열에 특정 값이 들어 있는지도 각각 다른 질문이다. 매처마다 하나의 질문을 맡아서, 테스트에 어떤 매처를 썼는지만 봐도 무엇을 확인하는지 드러난다.

틀렸을 때 나오는 메시지도 매처마다 다르다. 알맞은 매처를 쓰면 실패 메시지만 보고 무엇이 어떻게 다른지 알 수 있다.

<br/>

## 기본 매처
- `toBe()` 는 `Object.is` 로 비교한다. 숫자, 문자열 같은 원시 값은 값이 같으면 통과하고, 객체와 배열은 같은 객체를 가리킬 때만 통과한다
- `toEqual()` 은 객체와 배열의 속성을 하나씩 비교한다. 내용이 같으면 서로 다른 객체여도 통과한다
- `toBeNull()`, `toBeUndefined()` 는 값이 각각 `null`, `undefined` 인지 확인한다
- `toBeTruthy()`, `toBeFalsy()` 는 `if` 에 넣었을 때 참으로 취급되는 값인지, 거짓으로 취급되는 값인지 확인한다

```javascript
it("기본 매처", () => {
  expect(2 + 2).toBe(4);
  expect({ a: 1 }).toEqual({ a: 1 });
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();
});
```

### toBe와 toEqual의 차이
객체를 `toBe` 로 비교하면 내용이 같아도 실패한다. Jest 30.5.2의 실패 메시지는 아래와 같다.

```javascript
it("toBe 객체 실패", () => {
  expect({ a: 1 }).toBe({ a: 1 });
});
```

```text
expect(received).toBe(expected) // Object.is equality

If it should pass with deep equality, replace "toBe" with "toStrictEqual"

Expected: {"a": 1}
Received: serializes to the same string
```

`serializes to the same string` 은 문자열로 찍어 보면 똑같지만 다른 객체라는 뜻이다. 메시지가 알려 주는 대로 내용을 비교하려면 `toEqual` 이나 `toStrictEqual` 을 쓴다.

`toStrictEqual` 은 `toEqual` 보다 엄격하다. 값이 `undefined` 인 속성도 있는 것으로 보고 비교한다. 이 밖에 `[, 1]` 처럼 빈 칸이 있는 배열과 `[undefined, 1]` 을 다르게 보고, 클래스로 만든 객체와 같은 내용의 객체 리터럴도 다르게 본다. Jest 30.5.2에서 두 경우 모두 `toEqual` 은 통과하고 `toStrictEqual` 은 실패했다.

```javascript
it("toEqual과 toStrictEqual", () => {
  expect({ a: 1, b: undefined }).toEqual({ a: 1 });       // 통과
  expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 }); // 실패
});
```

```text
expect(received).toStrictEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "a": 1,
+   "b": undefined,
  }
```

`-` 줄은 기대한 값에만 있는 것, `+` 줄은 실제 값에만 있는 것이다. 실제 값에 `b: undefined` 가 더 있어서 실패했다.

<br/>

## 숫자 매처
- `toBeGreaterThan()`, `toBeGreaterThanOrEqual()` 은 크다, 크거나 같다
- `toBeLessThan()`, `toBeLessThanOrEqual()` 은 작다, 작거나 같다
- `toBeCloseTo()` 는 소수를 비교할 때 아주 작은 차이를 무시한다. 두 번째 인수(자릿수)를 주지 않으면 2자리로 보고, 차이가 0.005보다 작을 때 통과한다

```javascript
it("숫자 매처", () => {
  expect(10).toBeGreaterThan(5);
  expect(10).toBeGreaterThanOrEqual(10);
  expect(5).toBeLessThan(10);
  expect(5).toBeLessThanOrEqual(5);
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});
```

소수 계산 결과를 `toBe` 로 비교하면 부동 소수점 오차 때문에 실패한다.

```text
expect(received).toBe(expected) // Object.is equality

Expected: 0.3
Received: 0.30000000000000004
```

`toBeCloseTo` 의 기준은 차이 0.005다. `expect(1.004).toBeCloseTo(1)` 은 통과하고 `expect(1.006).toBeCloseTo(1)` 은 아래처럼 실패한다.

```text
Expected precision:    2
Expected difference: < 0.005
Received difference:   0.006000000000000005
```

오차가 생기는 이유는 [부동 소수점](../../../JavaScript/부동%20소수점(Floating%20Point)/README.md) 노트에 정리했다.

<br/>

## 문자열 매처
`toMatch()` 는 문자열이 정규식이나 부분 문자열과 맞는지 확인한다.

```javascript
it("문자열 매처", () => {
  expect("Hello Jest").toMatch(/Jest/);
  expect("Hello Jest").toMatch("Jest");
});
```

<br/>

## 배열과 반복 가능한 객체 매처
- `toContain()` 은 배열이나 `Set` 같은 반복 가능한 객체에 그 항목이 들어 있는지 `===` 로 확인한다
- `toContainEqual()` 은 항목을 `toEqual` 처럼 내용으로 비교한다. 객체가 든 배열에 쓴다

```javascript
it("배열 매처", () => {
  expect([1, 2, 3]).toContain(2);
  expect(new Set([1, 2, 3])).toContain(3);
  expect([{ a: 1 }]).toContainEqual({ a: 1 });
});
```

<br/>

## 예외 매처
`toThrow()` 는 함수가 에러를 던지는지 확인한다. 함수를 직접 부르지 않고 감싼 함수를 넘겨야 한다. `expect(fn())` 처럼 바로 부르면 `expect` 에 닿기 전에 에러가 터져 테스트가 그냥 실패한다.

```javascript
it("예외 매처", () => {
  expect(() => {
    throw new Error("boom");
  }).toThrow("boom");
});
```

<br/>

## 반대로 확인하기
매처 앞에 `.not` 을 붙이면 조건이 반대가 된다.

```javascript
it("not", () => {
  expect(1).not.toBe(2);
});
```

위 예시는 모두 Jest 30.5.2에서 실행해 통과와 실패 메시지를 확인했다.

<br/>

[목차](../README.md) | 이전 장: [테스트 스위트와 테스트 케이스](../01_테스트%20스위트와%20테스트%20케이스(Test%20Suite%20and%20Test%20Case)/README.md) | 다음 장: [비동기 코드 테스트](../03_비동기%20코드%20테스트(Async%20Testing)/README.md)
