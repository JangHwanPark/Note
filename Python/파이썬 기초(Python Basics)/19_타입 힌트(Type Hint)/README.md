## 타입 힌트란 ?
- 타입 힌트(Type Hint)는 변수, 매개변수, 반환값에 어떤 자료형이 오는지 코드에 적어 두는 표기다
- 파이썬은 실행할 때 타입 힌트를 검사하지 않는다. 힌트와 다른 값이 들어와도 그대로 실행된다
- 대신 mypy 같은 검사 도구와 편집기가 힌트를 읽고, 실행하기 전에 잘못된 부분을 알려 준다

<br/>

## 왜 필요할까
2장에서 파이썬은 변수를 만들 때 자료형을 적지 않는 동적 타이핑 언어라고 했다. 짧은 코드에서는 편하지만, 코드가 길어지면 이 변수에 무엇이 들어 있는지, 이 함수에 무엇을 넘겨야 하는지를 코드만 보고 알기 어렵다.

```python
def add(a, b):
    return a + b

add(1, 2)       # 3
add("a", "b")   # 'ab'
```

`add` 를 만든 사람은 숫자를 더하려 했지만, 문자열을 넘겨도 오류 없이 `'ab'` 가 나온다. 이런 실수는 실행해서 이상한 결과를 보기 전까지 드러나지 않는다. 타입 힌트는 만든 사람의 의도를 코드에 남겨서, 읽는 사람과 도구가 실행 전에 알 수 있게 한다.

<br/>

## 힌트 (Hint)
### 정의
사전적 의미는 암시, 귀띔. 답을 직접 정해 주지 않고 넌지시 알려 주는 것이다.
공학적으로는 자료형을 강제하지 않고 알려 주기만 하는 표기라는 뜻이다. 이름에 힌트가 붙은 이유가 여기에 있다. 도로의 제한 속도 표지판과 같다. 표지판이 있다고 차가 그 속도를 넘지 못하는 것은 아니다. 다만 내비게이션(검사 도구)은 출발하기 전에 경로의 표지판을 읽고, 계획한 속도를 넘는 구간을 미리 알려 준다.

### 힌트는 강제되지 않는다
아래 코드는 `str` 을 받겠다고 적었지만, 숫자를 넘겨도 실행된다.

```python
def greet(name: str) -> str:
    return f"hi, {name}"

greet(3)   # 'hi, 3'
```

파이썬은 힌트를 함수의 `__annotations__` 속성에 저장만 해 둔다. annotation은 주해, 덧붙인 설명이라는 뜻이다. 1장의 주석(`#`)은 파이썬이 아예 읽지 않지만, annotation은 파이썬이 읽어서 저장해 둔다는 점이 다르다.

```python
greet.__annotations__   # {'name': <class 'str'>, 'return': <class 'str'>}
```

<br/>

## 기본 문법
### 변수
변수 이름 뒤에 콜론과 자료형을 쓴다.

```python
age: int = 20
name: str = "kim"
```

### 함수의 매개변수와 반환값
매개변수 이름 뒤에 콜론과 자료형을, 괄호 뒤에 `->` 와 반환값의 자료형을 쓴다. 기본값이 있는 매개변수는 자료형 뒤에 `= 기본값` 을 쓴다.

```python
def greet(name: str, times: int = 1) -> str:
    return f"hi, {name} " * times
```

11장에서 `return` 이 없는 함수는 `None` 을 돌려준다고 했다. 돌려줄 값이 없는 함수는 `-> None` 으로 적는다.

```python
def log(message: str) -> None:
    print(message)
```

### 클래스
15장에서 만든 클래스도 자료형으로 쓸 수 있다. 15장에서 본 것처럼 `int`, `str` 도 클래스이므로 쓰는 방식이 같다.

```python
class User:
    def __init__(self, name: str) -> None:
        self.name = name


def welcome(user: User) -> str:
    return f"welcome, {user.name}"
```

`self` 에는 보통 힌트를 적지 않는다. 그 클래스의 인스턴스라는 것이 정해져 있어서 검사 도구가 알아서 판단한다.

<br/>

## 검사 도구 mypy
### 설치와 실행
힌트를 실제로 검사하려면 도구가 필요하다. 대표적인 것이 mypy다. 13장의 `pip` 로 설치하고, 파일 이름을 넘겨 실행한다.

```bash
pip install mypy
mypy app.py
```

mypy는 코드를 실행하지 않고 읽기만 해서 검사한다.

### 무엇을 잡아낼까
아래 `app.py` 를 검사해 보자.

```python
def add(a: int, b: int) -> int:
    return a + b

add("a", "b")

age: int = 20
age = "스무 살"

def greet(name: str) -> str:
    return 10
```

mypy를 실행하면 아래처럼 나온다. 아래는 mypy 2.4.0에서 실행한 결과다.

```
app.py:4: error: Argument 1 to "add" has incompatible type "str"; expected "int"  [arg-type]
app.py:4: error: Argument 2 to "add" has incompatible type "str"; expected "int"  [arg-type]
app.py:7: error: Incompatible types in assignment (expression has type "str", variable has type "int")  [assignment]
app.py:10: error: Incompatible return value type (got "int", expected "str")  [return-value]
Found 4 errors in 1 file (checked 1 source file)
```

몇 번째 줄에서 무엇이 어긋났는지 알려 준다. 4줄의 두 오류는 `int` 자리에 `str` 을 넘겼다는 뜻으로, 인자마다 하나씩 나왔다. 7줄은 `int` 변수에 `str` 을 넣었다는 뜻이다. 10줄은 `str` 을 돌려준다고 해 놓고 `int` 를 돌려줬다는 뜻이다.
2장의 `age = "스무 살"` 은 파이썬에서는 문제없이 실행된다. 하지만 mypy는 적어 둔 힌트나 처음 넣은 값을 보고 `age` 를 `int` 변수로 판단하고, 다른 자료형을 넣으면 알려 준다.

### 편집기의 도움
PyCharm, 그리고 Python 확장을 설치한 VS Code 같은 편집기도 힌트를 읽는다. `user.` 까지 치면 `User` 클래스의 속성을 목록으로 보여 주고, 설정에 따라 힌트가 맞지 않는 곳에 밑줄을 긋는다. mypy를 따로 돌리지 않아도 코드를 쓰는 동안 실수를 알 수 있다.

<br/>

## 묶음 자료형
리스트, 딕셔너리처럼 값을 담는 자료형은 대괄호 안에 담기는 값의 자료형을 함께 쓴다.

```python
scores: list[int] = [90, 85]          # int를 담는 리스트
ages: dict[str, int] = {"kim": 20}    # 키는 str, 값은 int인 딕셔너리
point: tuple[int, int] = (3, 4)       # int 두 개로 이루어진 튜플
tags: set[str] = {"python"}           # str을 담는 집합
```

`list[int]` 처럼 내장 자료형에 대괄호를 바로 쓰는 방식은 Python 3.9부터 된다. 그 전에는 `from typing import List` 로 가져와 `List[int]` 로 썼고, 오래된 코드에서는 지금도 이 표기를 볼 수 있다. typing은 타입 힌트에 쓰는 도구를 모아 둔 표준 라이브러리 모듈이다.

<br/>

## 여러 자료형 중 하나
### | 로 잇기
값이 여러 자료형 중 하나일 수 있으면 `|` 로 잇는다. 10장에서 집합의 합집합에 쓴 기호와 같고, 힌트 안에서는 또는이라는 뜻이다. Python 3.10부터 쓸 수 있다.

```python
def to_int(value: int | str) -> int:
    return int(value)
```

### None일 수 있는 값
가장 자주 쓰는 경우는 값이 없을 때 `None` 을 돌려주는 함수다. 도서관 검색 결과와 같다. 책이 있으면 서가 번호가 나오고, 없으면 없다고 나온다. 결과를 받은 쪽은 번호가 나왔는지 먼저 확인해야 책을 찾으러 갈 수 있다.

```python
def find(names: list[str], target: str) -> int | None:
    if target in names:
        return names.index(target)
    return None
```

반환값을 `int | None` 으로 적어 두면 mypy는 쓰는 쪽에서 `None` 을 확인했는지도 본다.

```python
idx = find(["kim", "lee"], "lee")
idx + 1                 # error: Unsupported operand types for + ("None" and "int")

if idx is not None:
    idx + 1             # 통과
```

`find()` 가 `None` 을 돌려주는 경우를 잊고 바로 더하면, 실행 중에 `TypeError` 가 날 수 있는 코드다. 힌트 덕분에 실행 전에 알 수 있다.
3장과 16장에서 `None` 은 `is` 로 확인한다고 했다. `is not` 은 그 반대로, 같은 객체가 아닌지를 본다. 5장의 `in` 과 `not in` 의 관계와 같다. `idx is not None` 으로 확인한 블록 안에서는 mypy가 `idx` 를 `int` 로 보고 통과시킨다.
Python 3.10 전에는 `from typing import Optional` 로 가져와 `Optional[int]` 로 썼다. optional은 있어도 되고 없어도 되는이라는 뜻이다.

<br/>

## 무엇이든 올 수 있는 값 (Any)
any는 어떤 것이든이라는 뜻이다. 힌트에서는 어떤 자료형이든 올 수 있다는 표시로 `typing` 의 `Any` 를 쓴다. `Any` 로 적은 값은 mypy가 검사하지 않는다. 힌트를 아예 적지 않은 것과 거의 같으므로, 정말 무엇이든 받는 곳에만 쓴다.

```python
from typing import Any

def show(value: Any) -> None:
    print(value)
```

<br/>

## 앞 장의 내용에 힌트 붙이기
### 제너레이터
17장의 제너레이터 함수는 이터레이터를 돌려주므로 `Iterator` 로 적는다. 대괄호 안에는 꺼내 주는 값의 자료형을 쓴다.
`collections.abc` 는 이터레이터처럼 여러 자료형이 공통으로 가진 성질을 모아 둔 표준 라이브러리 모듈이다. `typing` 에도 `Iterator` 가 있지만 Python 3.9부터는 `collections.abc` 쪽을 쓰도록 권한다.

```python
from collections.abc import Iterator

def countdown(start: int) -> Iterator[int]:
    current = start
    while current > 0:
        yield current
        current -= 1


for n in countdown(3):
    n.upper()   # error: "int" has no attribute "upper"
```

`n` 이 `int` 라는 것을 mypy가 알기 때문에, 문자열 메서드를 부르는 실수를 잡아낸다.

<br/>

## 어디까지 적을까
타입 힌트는 선택이다. 적지 않아도 파이썬은 똑같이 실행되고, 일부에만 적어도 된다. 보통은 아래 기준으로 적는다.

- 함수의 매개변수와 반환값에는 적는다. 함수를 쓰는 사람이 가장 궁금해하는 정보다
- `age = 20` 처럼 대입하는 값으로 자료형이 분명한 변수에는 적지 않는다. 검사 도구도 값을 보고 자료형을 알아낸다(타입 추론, Type Inference)
- 빈 리스트 `[]` 처럼 값만 보고 무엇을 담을지 알 수 없을 때는 `names: list[str] = []` 처럼 적는다

<br/>

[목차](..) | [이전: 데코레이터](../18_데코레이터(Decorator))
