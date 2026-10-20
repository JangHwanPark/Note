## 비동기 테스트란 ?
- 타이머, 네트워크 요청처럼 결과가 나중에 오는 코드를 테스트하는 방법
- Jest는 기본적으로 테스트 함수가 끝나면 테스트도 끝났다고 본다
- 그래서 결과가 올 때까지 기다리라고 Jest에 알려 줘야 한다

비동기(Asynchronous)는 a(아님), syn(함께), chronos(시간)가 합쳐진 말로, 같은 시간에 맞춰 일어나지 않는다는 뜻이다. 코드에서는 함수를 호출한 때와 결과가 오는 때가 다르다는 의미로 쓴다.

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

테스트 함수는 `fetchData`를 호출만 하고 바로 끝난다. Jest는 이 시점에 테스트를 통과로 처리하고, 100ms 뒤에 콜백 안의 `expect`가 실행될 때는 이미 결과가 정해진 뒤다.

Jest 29에서 직접 돌려 보면 이 테스트는 통과로 표시된다. 같은 파일에 다음 테스트가 있으면 늦게 터진 실패가 엉뚱하게 다음 테스트의 실패로 표시되고, 파일의 마지막 테스트라면 아무 실패 없이 그냥 통과한다. 어느 쪽이든 실패 원인을 찾기 어렵다.

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

`expect`가 실패하면 그 줄에서 에러가 던져져 `done()`까지 가지 못한다. `try/catch`로 감싸 `done(error)`로 넘기면 실패 이유(Expected, Received)가 그대로 결과에 나온다.

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

`return`을 빠뜨리면 앞의 done 없는 콜백 테스트와 똑같이 기다리지 않고 통과한다. 가장 자주 하는 실수다.

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
it('async /await 를 사용한 테스트', async () => {
  async function fetchData() {
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
