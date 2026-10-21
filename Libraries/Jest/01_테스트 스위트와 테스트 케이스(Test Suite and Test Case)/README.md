## 테스트 스위트와 테스트 케이스란 ?
- 테스트 케이스(Test Case)는 하나의 동작을 확인하는 테스트 한 개다
- 테스트 스위트(Test Suite)는 관련된 테스트 케이스를 묶은 그룹이다
- Jest에서는 `describe`로 스위트를, `test` 또는 `it`으로 케이스를 만든다

case의 사전적 의미는 사례, 경우다. 확인하고 싶은 경우 하나를 테스트 하나로 쓴다는 뜻에서 테스트 케이스가 됐다. suite의 사전적 의미는 한 벌, 한 세트다. 정장 한 벌처럼 함께 다니는 것들을 묶어 부르는 말이라, 같은 대상을 확인하는 테스트 케이스 묶음을 테스트 스위트라고 부른다.

<br/>

## 왜 묶을까
테스트가 수십 개로 늘어나면 어느 테스트가 무엇을 확인하는지 찾기 어려워진다. 확인하는 대상(함수, 컴포넌트, 기능)별로 `describe`로 묶어 두면 실행 결과도 그 구조대로 나와서, 실패했을 때 어느 기능이 깨졌는지 바로 보인다.

같은 스위트 안의 테스트끼리는 `beforeEach` 같은 준비 코드를 함께 쓸 수도 있다.

<br/>

## 기본 사용법
```js
describe("테스트 스위트", () => {
  it("테스트 케이스", () => {
    expect(1 + 2).toBe(3);
  });

  it("테스트 케이스 문자열", () => {
    const string = "Hello" + " Jest";
    expect(string).toBe("Hello Jest");
  });
});
```

`describe`와 `it`의 첫 번째 인수는 실행 결과에 표시될 이름이고, 두 번째 인수는 실제로 실행할 함수다. 케이스 이름은 무엇을 확인하는지가 드러나게 쓴다.

`test`와 `it`은 이름만 다르고 동작은 같다. `it`은 "it should ..."처럼 문장으로 읽히게 하려고 만든 별칭이다.

<br/>

## 스위트 중첩
`describe` 안에 `describe`를 다시 넣어 더 잘게 나눌 수 있다.

```js
describe("계산기", () => {
  describe("더하기", () => {
    test("1 + 2는 3이다", () => {
      expect(1 + 2).toBe(3);
    });

    it("음수를 더할 수 있다", () => {
      expect(-1 + -2).toBe(-3);
    });
  });

  describe("문자열", () => {
    it("문자열을 이어 붙인다", () => {
      expect("Hello" + " Jest").toBe("Hello Jest");
    });
  });
});
```

`npx jest --verbose`로 실행하면 묶은 구조 그대로 결과가 나온다. 아래는 Jest 29, Windows 터미널에서 실행한 결과에서 Snapshots, Time 줄을 뺀 것이다.

```text
PASS ./suite.test.js
  계산기
    더하기
      √ 1 + 2는 3이다 (5 ms)
      √ 음수를 더할 수 있다 (2 ms)
    문자열
      √ 문자열을 이어 붙인다 (5 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

`describe`를 세 개 썼는데 결과 요약의 Test Suites는 1이다. Jest는 결과를 집계할 때 테스트 파일 하나를 스위트 하나로 센다. `describe`는 그 파일 안에서 케이스를 묶는 단위다.
