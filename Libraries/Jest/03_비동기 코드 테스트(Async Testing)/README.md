## 비동기 테스트란 ?
- 타이머, 네트워크 요청처럼 결과가 나중에 오는 코드를 테스트하는 방법
- Jest는 기본적으로 테스트 함수가 끝나면 테스트도 끝났다고 본다
- 그래서 결과가 올 때까지 기다리라고 Jest에 알려 줘야 한다

### 비동기 (Asynchronous)
비동기(Asynchronous)는 a(아님), syn(함께), chronos(시간)가 합쳐진 말로, 같은 시간에 맞춰 일어나지 않는다는 뜻이다. 코드에서는 함수를 호출한 때와 결과가 오는 때가 다르다는 의미로 쓴다.

택배를 시키고 바로 상자를 열어 보는 것과 같다. 주문(호출)은 끝났지만 물건(결과)은 아직 오지 않았다. 테스트도 물건이 올 때까지 기다렸다가 열어 봐야 한다.

<br/>

## 왜 따로 다뤄야 할까
비동기 코드를 동기 코드처럼 테스트하면 틀린 값을 기대해도 통과한다. 아래 `fetchData`는 100ms 뒤 콜백에 `peanut butter`를 넘기는 함수다.

```javascript
it('done 없이 콜백 테스트', () => {
  fetchData(data => {
    expect(data).toBe('jelly'); // 실제 값은 'peanut butter'
  });
});
```

테스트 함수는 `fetchData`를 호출만 하고 바로 끝난다. Jest는 이 시점에 테스트가 끝났다고 보고, 100ms 뒤에 콜백 안의 `expect`가 실행되는 것은 그 테스트가 끝난 다음이다.

Jest 30.5.2에서 직접 돌려 보면 결과가 경우에 따라 다르다.

- 같은 파일에서 아직 다른 테스트가 실행 중일 때 늦은 `expect` 가 터지면, 이미 끝난 이 테스트가 뒤늦게 실패로 바뀐다. 이 테스트 뒤에 바로 끝나는 테스트 B와 300ms를 기다리는 테스트 C를 두고 돌려 보면, 에러가 터지는 순간 실행 중인 것은 C인데 실패로 표시되는 것은 이 테스트였고 B와 C는 통과했다
- 이 테스트가 파일의 마지막 테스트라면 결과는 `PASS` 로 나온다. 그런데 결과 요약이 찍힌 뒤 `JestAssertionError` 가 처리되지 않은 에러로 출력되고, 프로세스가 종료 코드 1로 끝난다

두 경우 모두 다른 테스트의 실행 시간에 따라 결과가 달라지고, 마지막 경우는 화면에는 통과로 보이는데 종료 코드를 보는 CI에서는 실패로 잡힌다. 실패 원인을 찾기 어렵다.

아래 세 가지 방법은 모두 결과가 올 때까지 기다리라고 Jest에 알려 주는 방법이다.

<br/>

## 콜백을 사용한 테스트
테스트 함수가 `done`이라는 인수를 받으면, Jest는 `done()`이 호출될 때까지 테스트를 끝내지 않고 기다린다. 끝까지 호출되지 않으면 기본 5초 뒤 타임아웃으로 실패한다.

```javascript
it('콜백 함수를 사용한 테스트', done => {
  function fetchData(callback) {
    setTimeout(() => {
      callback('peanut butter');
    }, 100);
  }

  fetchData(data => {
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  });
});
```

`expect`가 실패하면 그 줄에서 에러가 던져져 `done()`까지 가지 못한다. Jest 30.5.2에서 `try/catch` 없이 실행해 보면 실패 이유(Expected, Received)는 나오지만, `done()` 을 기다리느라 5초를 더 보낸 뒤 `` Exceeded timeout of 5000 ms for a test while waiting for `done()` to be called. `` 실패가 하나 더 붙는다. `try/catch`로 감싸 `done(error)`로 넘기면 기다리지 않고 바로 실패 이유만 나온다.

<br/>

## 프로미스를 사용한 테스트
테스트 함수에서 Promise를 `return`하면 Jest는 그 Promise가 끝날 때까지 기다린다. Promise가 reject되면 테스트는 실패한다.

```javascript
it('Promise 를 사용한 테스트', () => {
  function fetchData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('peanut butter');
      }, 100);
    });
  }

  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

`return`을 빠뜨리면 Jest는 Promise를 기다리지 않는다. Jest 30.5.2에서 `return` 을 빼고 `'jelly'` 를 기대하게 바꿔 돌려 보면 앞의 done 없는 콜백 테스트와 똑같이 움직였다. 뒤에 다른 테스트가 실행 중이면 이 테스트가 뒤늦게 실패로 바뀌고, 파일의 마지막 테스트면 `PASS` 로 나온 뒤 처리되지 않은 `JestAssertionError` 가 찍히고 종료 코드 1로 끝났다. 가장 자주 하는 실수다.

`.resolves`, `.rejects`를 쓰면 `then` 없이 Promise의 결과를 바로 검증할 수 있다. 이때도 `return`이나 `await`는 필요하다. 아래 예제의 `fetchData`는 위 예제와 같은 함수를 파일 최상단에 선언해 두었다고 가정한다.

```javascript
it('resolves', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```

<br/>

## async / await 을 사용한 테스트
테스트 함수를 `async`로 만들면 테스트 함수 자체가 Promise를 돌려주므로 Jest가 알아서 기다린다. 코드가 동기 코드처럼 읽혀서 가장 많이 쓴다.

```javascript
it('async/await를 사용한 테스트', async () => {
  function fetchData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('peanut butter');
      }, 100);
    });
  }

  const data = await fetchData();
  expect(data).toBe('peanut butter');
});
```

<br/>

## 실패하는 경우 테스트하기
에러가 나야 정상인 경우는 `.rejects`로 검증한다. 아래 예제의 `failPromise`는 100ms 뒤 `new Error('network error')`로 reject되는 Promise를 돌려주는 함수이고, 파일 최상단에 선언해 두었다고 가정한다.

```javascript
it('rejects', async () => {
  await expect(failPromise()).rejects.toThrow('network error');
});
```

`try/catch`로 쓸 때는 `expect.assertions(1)`을 함께 쓴다. Promise가 실수로 resolve되면 `catch` 블록이 실행되지 않아 `expect`가 한 번도 불리지 않는데, `expect.assertions(1)`이 있으면 검증이 한 번도 실행되지 않았다는 이유로 테스트가 실패한다.

```javascript
it('try/catch', async () => {
  expect.assertions(1);
  try {
    await failPromise();
  } catch (e) {
    expect(e.message).toBe('network error');
  }
});
```

`expect.assertions(1)` 이 없을 때 이 테스트에 resolve되는 Promise를 넣으면 아무 검증 없이 통과한다. 있을 때는 Jest 30.5.2에서 아래처럼 실패한다.

```text
expect.assertions(1)

Expected one assertion to be called but received zero assertion calls.
```

위 예시는 모두 Jest 30.5.2에서 실행했다.

<br/>

[목차](../README.md) | 이전 장: [매처](../02_매처(Matchers)/README.md) | 다음 장: [모의 함수](../04_모의%20함수(Mock%20Function)/README.md)
