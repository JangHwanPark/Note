## 모의 함수란 ?
- 진짜 함수 대신 넣어 두고, 몇 번 어떤 인수로 불렸는지와 무엇을 돌려줬는지를 기록하는 함수
- Jest에서는 `jest.fn()` 으로 만든다
- 기록을 보고 `toHaveBeenCalled()`, `toHaveBeenCalledWith()` 같은 매처로 호출을 검증한다

### 모의 (Mock)
mock의 사전적 의미는 흉내 내다, 가짜의다. 모의고사처럼 진짜를 흉내 낸 것을 말한다.
테스트에서는 진짜 함수 자리에 넣는 가짜 함수를 말한다. 겉모습은 함수라서 똑같이 부를 수 있지만, 실제 일을 하는 대신 불린 기록을 남기고 정해 둔 값을 돌려준다.

연극 리허설에서 상대 배우 대신 대사를 받아 주는 대역과 같다. 대역은 진짜 연기를 하지 않지만, 주인공이 언제 어떤 대사를 던졌는지는 정확히 기억한다.

<br/>

## 왜 필요할까
테스트하려는 함수가 다른 함수를 부르는 경우가 많다. 버튼을 누르면 `onClick` 을 부르는 컴포넌트, 결과를 콜백으로 넘기는 함수가 그렇다. 이때 확인하고 싶은 것은 결과 값이 아니라 그 함수를 제대로 불렀는지다.

진짜 함수를 넘기면 불렸는지 확인하려고 함수 안에 기록용 코드를 따로 넣어야 하고, 진짜 함수가 네트워크 요청이나 결제처럼 테스트에서 실행하면 안 되는 일을 할 수도 있다. 모의 함수를 넘기면 실제 일은 하지 않으면서 호출 기록만 남는다.

<br/>

## 호출 확인하기
- `toHaveBeenCalled()` 는 한 번이라도 불렸는지 확인한다
- `toHaveBeenCalledTimes(n)` 은 정확히 n번 불렸는지 확인한다
- `toHaveBeenCalledWith(...)` 는 그 인수로 불린 적이 한 번이라도 있는지 확인한다
- `toHaveBeenLastCalledWith(...)`, `toHaveBeenNthCalledWith(n, ...)` 는 마지막 호출, n번째 호출의 인수를 확인한다

```javascript
it("모의 함수 호출 확인", () => {
  const myMock = jest.fn();

  myMock("first call");
  myMock("second call", "second arg");
  myMock("third call");

  expect(myMock).toHaveBeenCalled();
  expect(myMock).toHaveBeenCalledTimes(3);

  expect(myMock).toHaveBeenCalledWith("first call");
  expect(myMock).toHaveBeenCalledWith("second call", "second arg");
  expect(myMock).toHaveBeenLastCalledWith("third call");
  expect(myMock).toHaveBeenNthCalledWith(2, "second call", "second arg");
});
```

`toHaveBeenCalledWith` 는 몇 번째 호출이었는지를 보지 않는다. 세 번 중 어느 한 번이라도 그 인수로 불렸으면 통과한다. 한 호출 안의 인수는 순서까지 맞아야 한다. 몇 번째 호출인지까지 확인하려면 `toHaveBeenNthCalledWith` 를 쓴다.

불린 적 없는 인수로 확인하면 Jest 30.5.2에서 아래처럼 실패한다. 실제로 어떤 인수로 몇 번 불렸는지 함께 보여 준다.

```javascript
it("불린 적 없는 인수", () => {
  const m = jest.fn();
  m("a");
  expect(m).toHaveBeenCalledWith("b");
});
```

```text
expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "b"
Received: "a"

Number of calls: 1
```

<br/>

## 기록 직접 보기
모의 함수는 기록을 `mock` 속성에 담아 둔다. `mock.calls` 는 호출마다 받은 인수 배열이고, `mock.results` 는 호출마다 돌려준 값이다.

```javascript
const myMock = jest.fn();
myMock("first call");
myMock("second call", "second arg");

console.log(myMock.mock.calls);
// [ [ 'first call' ], [ 'second call', 'second arg' ] ]
```

<br/>

## 돌려줄 값 정하기
`jest.fn()` 에 함수를 넘기면 그 함수가 실제로 실행되고, 호출 기록도 남는다. 값만 정해 두려면 `mockReturnValue()` 를 쓴다.

```javascript
const add = jest.fn((a, b) => a + b);
add(1, 2);                // 3
add.mock.results;         // [ { type: 'return', value: 3 } ]

const getAnswer = jest.fn().mockReturnValue(42);
getAnswer();              // 42
```

아무것도 정하지 않은 `jest.fn()` 은 `undefined` 를 돌려준다.

위 예시는 모두 Jest 30.5.2에서 실행했다.

<br/>

[목차](../README.md) | 이전 장: [비동기 코드 테스트](../03_비동기%20코드%20테스트(Async%20Testing)/README.md) | 다음 장: [Jest 오류 모음](../05_Jest%20오류%20모음(Jest%20Errors)/README.md)
