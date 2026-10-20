## 데코레이터란 ?
- 데코레이터(Decorator)는 함수를 받아서 기능을 덧붙인 새 함수를 돌려주는 함수다
- 원래 함수의 코드를 고치지 않고 실행 전후에 할 일(기록, 시간 재기, 검사 등)을 끼워 넣는다
- 함수 정의 위에 `@이름` 을 붙여 적용한다
- 함수를 값처럼 다루는 성질과 클로저(Closure)를 바탕으로 동작한다

<br/>

## 왜 필요할까
여러 함수에 호출 기록을 남기고 싶다고 하자. 함수마다 시작과 끝에 `print()` 를 넣으면 같은 코드가 여기저기 흩어지고, 기록 방식을 바꿀 때 모든 함수를 고쳐야 한다. 게다가 함수 본래의 일과 기록하는 일이 한데 섞여 읽기도 어렵다.
데코레이터는 덧붙일 일을 한 곳에 따로 써 두고, 필요한 함수에 `@` 한 줄로 붙이게 해 준다. 함수 본문은 자기 일만 하고, 덧붙인 일은 데코레이터 한 곳에서 관리한다.

<br/>

## 함수도 값이다
데코레이터를 이해하려면 먼저 함수를 값처럼 다룰 수 있다는 점을 알아야 한다. 파이썬에서는 함수도 숫자나 문자열처럼 객체다.

### 변수에 담기
16장에서 변수는 객체에 붙은 이름표라고 했다. `def` 로 정의한 함수 이름도 함수 객체에 붙은 이름표다. 그래서 다른 이름표를 하나 더 붙일 수 있다.

```python
def greet(name):
    return f"hi, {name}"

say = greet        # 괄호 없이 쓰면 호출이 아니라 함수 객체 자체
say("kim")         # 'hi, kim'
say is greet       # True
```

`greet()` 는 함수를 호출한 결과이고, `greet` 는 함수 그 자체다. 이 구분이 이 장 전체에서 중요하다.

### 인자로 넘기기
함수를 다른 함수의 인자로 넘길 수도 있다. 11장에서 `sort()` 의 `key` 에 람다를 넘긴 것, 6장에서 `map(int, ...)` 에 `int` 를 넘긴 것이 이 경우다.

```python
def apply(func, value):
    return func(value)

apply(len, "hello")   # 5
apply(print, "hi")    # hi 출력
```

### 함수 안에서 함수를 만들어 돌려주기
함수 안에서 다른 함수를 정의하고, 그 함수를 `return` 으로 돌려줄 수도 있다.

```python
def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
double(5)   # 10
triple(5)   # 15
```

<br/>

## 클로저 (Closure)
### 정의
사전적 의미는 닫음, 폐쇄. close(닫다)에서 왔다.
공학적으로는 바깥 함수의 변수를 붙잡아 둔 채로 만들어진 안쪽 함수를 말한다. 바깥 함수의 변수를 안쪽 함수가 감싸 닫아 두었다는 뜻에서 이런 이름이 붙었다. 도시락을 싸 들고 집을 나선 것과 같다. 집(바깥 함수)을 떠나도 싸 온 반찬(바깥 변수)은 계속 꺼내 먹을 수 있다.

### 동작
위의 `make_multiplier(2)` 는 실행이 끝났다. 11장에서 지역 변수는 함수가 끝나면 사라진다고 했으니 `n` 도 사라져야 한다. 그런데 `double(5)` 는 `n` 이 2라는 것을 기억하고 10을 돌려준다.
안쪽 함수 `multiply` 가 `n` 을 쓰고 있어서, 파이썬이 `n` 을 `multiply` 에 붙여 함께 보관하기 때문이다. `double` 과 `triple` 은 같은 코드로 만든 함수지만 각자 다른 `n` 을 붙잡고 있다.

### nonlocal
안쪽 함수에서 바깥 변수를 읽기만 할 때는 문제가 없다. 하지만 값을 바꾸려고 대입하면, 11장의 전역 변수 때와 똑같이 같은 이름의 새 지역 변수로 취급된다. 그래서 `counter()` 를 호출하면 아직 값이 없는 지역 변수에 1을 더하려 하므로 오류가 난다.

```python
def make_counter():
    count = 0
    def counter():
        count += 1
        return count
    return counter

c = make_counter()
c()   # UnboundLocalError: cannot access local variable 'count' where it is not associated with a value
```

바깥 함수의 변수를 바꾸려면 `nonlocal` 로 선언한다. 전역 변수를 바꿀 때 쓰는 `global` 과 같은 역할을, 바로 바깥 함수의 변수에 대해 한다. 이름도 지역(local)이 아니라는 뜻이다.

```python
def make_counter():
    count = 0
    def counter():
        nonlocal count
        count += 1
        return count
    return counter

c = make_counter()
c()   # 1
c()   # 2
c()   # 3
```

<br/>

## 데코레이터 (Decorator)
### 정의
사전적 의미는 장식하는 사람, 실내 장식가. decorate(꾸미다)에서 왔다.
공학적으로는 함수를 받아서 기능을 덧붙인 새 함수를 돌려주는 함수를 말한다. 원래 함수는 그대로 두고 겉을 꾸민다는 뜻에서 이런 이름이 붙었다. 선물을 포장지로 싸는 것과 같다. 안의 선물은 그대로이고, 받는 사람은 선물보다 포장을 먼저 만난다.

### 직접 감싸 보기
앞에서 본 세 가지(함수를 인자로 받기, 안에서 함수 만들기, 그 함수를 돌려주기)를 합치면 데코레이터가 된다.

```python
def log(func):
    def wrapper():
        print("시작")
        func()
        print("끝")
    return wrapper


def hello():
    print("안녕")

hello = log(hello)
hello()
# 시작
# 안녕
# 끝
```

wrapper는 포장지, 감싸는 것이라는 뜻이다. `log` 는 함수 `func` 를 받아 그것을 감싼 `wrapper` 를 돌려준다. `wrapper` 는 클로저라서 `func` 를 기억하고, 호출되면 앞뒤로 `print()` 를 하고 그 사이에 원래 함수를 부른다. 마지막으로 `hello = log(hello)` 로 `hello` 라는 이름표를 `wrapper` 쪽으로 옮겨 붙인다. 이제 `hello()` 를 부르면 감싼 함수가 실행된다.

### @ 문법
`hello = log(hello)` 처럼 쓰면 함수 이름을 두 번 써야 하고, 정의와 감싸는 코드가 떨어져 있어 놓치기 쉽다. 그래서 파이썬은 함수 정의 바로 위에 `@데코레이터` 를 쓰는 문법을 준다. 아래 코드는 정의한 뒤 `bye = log(bye)` 를 한 것과 사실상 같다.

```python
@log
def bye():
    print("잘 가")

bye()
# 시작
# 잘 가
# 끝
```

`@` 뒤에는 `log()` 가 아니라 `log` 를 쓴다. 호출 결과가 아니라 함수 자체를 데코레이터로 쓰기 때문이다.

<br/>

## 인자와 반환값이 있는 함수 감싸기
### 문제
위의 `wrapper` 는 인자를 받지 않는다. 인자가 있는 함수에 붙이면, 호출할 때 넘긴 인자가 `wrapper` 로 가기 때문에 오류가 난다.

```python
@log
def add(a, b):
    return a + b

add(1, 2)   # TypeError: log.<locals>.wrapper() takes 0 positional arguments but 2 were given
```

`log.<locals>.wrapper` 는 `log` 함수 안에서 만든 `wrapper` 라는 뜻이다. Python 3.13에서 실행한 메시지다.

원래 함수의 반환값도 `wrapper` 가 돌려주지 않아서 사라진다.

### *args, **kwargs로 받아 넘기기
11장의 가변 인자를 쓰면 어떤 인자든 받아서 그대로 원래 함수에 넘길 수 있다. 원래 함수의 결과도 받아서 돌려준다.

```python
def log(func):
    def wrapper(*args, **kwargs):
        print(f"{func.__name__} 호출: {args} {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} 결과: {result}")
        return result
    return wrapper


@log
def add(a, b):
    return a + b

add(1, b=2)
# add 호출: (1,) {'b': 2}
# add 결과: 3
```

정의할 때의 `*args` 는 인자를 튜플로 모으고, 호출할 때의 `func(*args)` 는 반대로 튜플을 풀어서 인자로 넘긴다. `**kwargs` 도 같은 방식으로 딕셔너리를 모으고 푼다. `__name__` 은 13장에서 모듈 이름이 들어 있던 것처럼, 함수에도 자동으로 붙는 함수 이름이다.

<br/>

## functools.wraps
### 문제
데코레이터를 붙이면 이름표가 `wrapper` 로 옮겨 가므로, 함수 이름과 함수 본문 첫 줄에 쓴 설명 문자열(독스트링, Docstring)도 `wrapper` 의 것으로 바뀐다. 독스트링은 4장의 따옴표 세 개 문자열로 쓰고, `help(함수)` 로 볼 수 있다.

```python
add.__name__   # 'wrapper'
```

`__name__` 으로 함수 이름을 찍는 기록에 엉뚱한 이름이 남고, `help()` 로 함수 설명을 볼 때도 원래 설명이 나오지 않는다.

### 해결
표준 라이브러리 `functools` 의 `wraps` 를 `wrapper` 에 붙이면, 원래 함수의 이름과 설명 같은 정보를 `wrapper` 로 옮겨 준다. `wraps(func)` 는 데코레이터를 돌려주는 함수라서 `@functools.wraps(func)` 처럼 괄호를 붙여 쓴다. 왜 괄호가 붙는지는 아래 인자를 받는 데코레이터에서 본다. 데코레이터를 직접 만들 때는 습관처럼 붙인다.

```python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper


@log
def add(a, b):
    """두 수를 더한다"""
    return a + b

add.__name__   # 'add'
add.__doc__    # '두 수를 더한다'
```

`__doc__` 은 독스트링이 들어 있는 속성이다.

<br/>

## 예시: 실행 시간 재기
데코레이터가 자주 쓰이는 예다. 함수마다 시간 재는 코드를 넣지 않고 `@timer` 한 줄로 붙인다. `time.perf_counter()` 는 시간을 재기 위한 시계 값을 초 단위로 돌려주고, 두 값의 차가 걸린 시간이다.

```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__}: {end - start:.2f}초")
        return result
    return wrapper


@timer
def slow():
    time.sleep(0.5)   # 0.5초 쉰다
    return "done"

slow()
# slow: 0.50초
# 'done'
```

걸린 시간은 실행할 때마다 조금씩 다를 수 있다.

<br/>

## 인자를 받는 데코레이터
`@repeat(3)` 처럼 데코레이터에 값을 넘기고 싶을 때는 함수를 한 겹 더 감싼다. 바깥 함수가 값을 받아서 데코레이터를 만들어 돌려주는 구조다.

```python
import functools

def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator


@repeat(3)
def cheer():
    print("화이팅")

cheer()
# 화이팅
# 화이팅
# 화이팅
```

순서대로 보면 이렇다.

1. `repeat(3)` 이 먼저 호출되어 `decorator` 를 돌려준다. 이때 `decorator` 는 `n` 이 3이라는 것을 클로저로 기억한다
2. 돌려받은 `decorator` 가 `@` 의 데코레이터가 되어 `cheer` 를 받고 `wrapper` 를 돌려준다
3. `cheer` 라는 이름표가 `wrapper` 로 옮겨 간다

앞의 `@log` 에서는 괄호를 쓰지 말라고 했는데, 여기서는 `repeat(3)` 을 호출한 결과가 데코레이터이기 때문에 괄호를 쓴다. `@functools.wraps(func)` 에 괄호가 붙는 것도 같은 이유다.

<br/>

## 데코레이터 여러 개 붙이기
데코레이터는 여러 개를 겹쳐 붙일 수 있다. 함수에 가까운 아래쪽부터 감싼다. 포장지를 여러 겹 쌀 때 안쪽 포장부터 싸는 것과 같다.

```python
def bold(func):
    def wrapper():
        return "<b>" + func() + "</b>"
    return wrapper

def italic(func):
    def wrapper():
        return "<i>" + func() + "</i>"
    return wrapper


@bold
@italic
def text():
    return "hi"

text()   # '<b><i>hi</i></b>'
```

`text = bold(italic(text))` 와 같다. `italic` 이 먼저 감싸고, 그 결과를 `bold` 가 다시 감싼다.

<br/>

## 데코레이터는 언제 실행될까
데코레이터 함수 자체는 함수를 호출할 때가 아니라 함수를 정의할 때 한 번 실행된다. `@` 는 정의 직후에 `func = 데코레이터(func)` 를 하는 것과 사실상 같기 때문이다.

```python
def register(func):
    print(f"{func.__name__} 등록")
    return func


@register
def task():
    pass

# task를 한 번도 호출하지 않았는데 "task 등록"이 출력된다
```

그래서 `wrapper` 안에 쓴 코드는 호출할 때마다 실행되고, `wrapper` 바깥(데코레이터 본문)에 쓴 코드는 정의할 때 한 번만 실행된다. 위의 `register` 처럼 감싸지 않고 원래 함수를 그대로 돌려주면서, 함수를 어딘가에 등록하는 일만 하는 데코레이터도 있다.

<br/>

## 미리 만들어진 데코레이터
파이썬에는 미리 만들어진 데코레이터도 있다. 15장에서 미뤄 둔 `@property` 를 비롯해 `@classmethod`, `@staticmethod` 는 import 없이 쓰는 내장 데코레이터로, 클래스의 메서드에 붙인다. 이 장에서 본 원리로 동작하지만 쓰임새가 클래스 설계와 묶여 있어서 별도 문서로 정리한다.
13장의 표준 라이브러리 모듈인 `functools` 에는 `wraps` 외에도, 같은 인자로 다시 부르면 계산하지 않고 저장해 둔 결과를 돌려주는 `@functools.cache` (Python 3.9부터) 같은 데코레이터가 있다.

<br/>

[목차](..) | [이전: 이터레이터와 제너레이터](../17_이터레이터와%20제너레이터(Iterator%20and%20Generator)) | [다음: 타입 힌트](../19_타입%20힌트(Type%20Hint))
