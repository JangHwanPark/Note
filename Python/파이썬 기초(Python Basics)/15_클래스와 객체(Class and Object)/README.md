## 클래스와 객체란 ?
- 클래스(Class)는 데이터와 그 데이터를 다루는 함수를 하나로 묶어 정의한 설계도
- 객체(Object)는 그 설계도로 실제로 만들어 낸 것이다. 클래스 하나로 객체를 여러 개 만들 수 있다
- 파이썬은 `class` 로 클래스를 정의하고, `클래스이름()` 으로 객체를 만든다

<br/>

## 왜 필요할까
게임 캐릭터를 만든다고 하자. 10장의 딕셔너리와 11장의 함수만으로도 만들 수 있다.

```python
hero = {"name": "kim", "hp": 100}

def attack(character, damage):
    character["hp"] -= damage
```

캐릭터가 하나일 때는 문제없다. 하지만 캐릭터 종류가 늘고 기능이 많아지면 문제가 생긴다. 캐릭터 딕셔너리에 어떤 키가 꼭 있어야 하는지 정해진 곳이 없어서 `"hp"` 를 `"HP"` 로 잘못 쓴 캐릭터가 생겨도 실행해 보기 전에는 모른다. `attack` 같은 함수가 파일 여기저기 흩어져 있으면 캐릭터를 다루는 기능이 무엇무엇인지 한눈에 볼 수도 없다.
클래스는 캐릭터에게 필요한 데이터(이름, 체력)와 캐릭터가 할 수 있는 동작(공격받기, 회복하기)을 한곳에 묶어 정의한다. 이렇게 데이터와 동작을 묶은 객체를 중심으로 프로그램을 짜는 방식을 객체 지향 프로그래밍(Object-Oriented Programming, OOP)이라 한다.

<br/>

## 핵심 용어
### 클래스 (Class)
사전적 의미는 부류, 종류. 공통된 성질을 가진 것들의 무리다.
공학적으로는 같은 종류의 객체들이 공통으로 가질 데이터와 동작을 정의한 설계도를 말한다. 붕어빵 틀과 같다. 틀 자체는 먹을 수 없지만, 틀이 있으면 같은 모양의 붕어빵을 얼마든지 찍어 낼 수 있다.

### 객체 (Object)
사전적 의미는 대상, 물건. 생각이나 행동이 향하는 구체적인 것이다.
공학적으로는 데이터와 그 데이터를 다루는 동작을 함께 가진 하나의 값을 말한다. 틀로 찍어 낸 붕어빵 하나하나가 객체다. 같은 틀에서 나왔어도 팥 붕어빵과 슈크림 붕어빵처럼 안에 든 값은 각자 다를 수 있다.

### 인스턴스 (Instance)
사전적 의미는 사례, 실례. 일반적인 개념이 실제로 나타난 하나의 예다.
공학적으로는 특정 클래스로 만들어진 객체를 말한다. 객체와 거의 같은 뜻인데, 어느 클래스에서 나왔는지를 강조할 때 쓴다. "hero는 객체다", "hero는 Character 클래스의 인스턴스다"처럼 쓴다.

### 이미 쓰고 있던 객체
파이썬에서는 모든 값이 객체다. 3장에서 `type("hi")` 가 `<class 'str'>` 을 돌려준 것은 `"hi"` 가 `str` 클래스의 인스턴스라는 뜻이다. 4장의 `"hi".upper()` 처럼 값 뒤에 점을 찍고 부른 메서드는 그 클래스에 정의된 동작이다. 이 장에서는 이런 클래스를 직접 만든다.

<br/>

## 클래스 정의와 객체 생성
```python
class Character:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def take_damage(self, damage):
        self.hp -= damage

    def is_alive(self):
        return self.hp > 0


hero = Character("kim", 100)
enemy = Character("slime", 30)

hero.take_damage(20)
print(hero.hp)          # 80
print(enemy.hp)         # 30 (다른 객체는 영향을 받지 않는다)
print(hero.is_alive())  # True
```

클래스 이름은 단어 첫 글자를 대문자로 쓰는 파스칼 케이스(PascalCase)가 관례다(`Character`, `BankAccount`). 변수와 함수의 스네이크 케이스와 구분된다.

### 속성 (Attribute)
attribute는 속성, 특성이라는 뜻이다. 객체가 가진 데이터를 말한다. 위 예시의 `name`, `hp` 가 속성이다. `객체.속성` 으로 읽고 바꾼다.

### 메서드 (Method)
method는 방법, 방식이라는 뜻이다. 클래스 안에 정의한 함수로, 객체가 할 수 있는 동작을 말한다. 위 예시의 `take_damage`, `is_alive` 가 메서드다. `객체.메서드()` 로 부른다.

<br/>

## `__init__` 과 self
### `__init__`
13장의 `__init__.py` 처럼 init은 initialize(초기화하다)의 줄임말이다. 객체가 만들어질 때 자동으로 한 번 실행되는 메서드로, 객체가 처음 가져야 할 속성을 정한다. 이런 메서드를 생성자(Constructor)라 부르기도 한다. 붕어빵을 찍어 낼 때 속을 채워 넣는 단계와 같다.
`Character("kim", 100)` 을 실행하면 파이썬이 빈 객체를 만들고, `__init__` 을 불러 `"kim"` 과 `100` 을 넘긴 뒤, 완성된 객체를 돌려준다.
이름 앞뒤에 밑줄 두 개가 붙은 메서드는 파이썬이 정해진 때에 자동으로 부르는 특별한 메서드다. double underscore를 줄여 던더(dunder) 메서드라고도 부른다.

### self
self는 자기 자신이라는 뜻이다. 메서드를 부른 객체 자신을 가리킨다.
클래스는 설계도 하나인데 객체는 여러 개다. `take_damage` 메서드는 클래스에 하나만 정의되어 있으므로, 지금 체력을 깎아야 할 대상이 `hero` 인지 `enemy` 인지 알려 줘야 한다. 그 대상이 `self` 로 들어온다.

```python
hero.take_damage(20)
Character.take_damage(hero, 20)   # 위와 같은 동작
```

`hero.take_damage(20)` 은 파이썬이 내부적으로 `Character.take_damage(hero, 20)` 으로 바꿔 실행하는 것과 같다. 점 앞의 객체가 첫 번째 인자 `self` 로 자동으로 들어간다. 그래서 메서드를 정의할 때는 첫 번째 매개변수로 `self` 를 꼭 쓰고, 부를 때는 넘기지 않는다.
`self.hp = hp` 는 넘겨받은 값 `hp` 를 이 객체의 속성 `hp` 에 저장하라는 뜻이다. `self.` 없이 `hp = hp` 라고 쓰면 11장의 지역 변수가 되어 메서드가 끝날 때 사라진다.

<br/>

## 클래스 속성과 인스턴스 속성
`self.속성` 으로 만든 속성은 객체마다 따로 가진다(인스턴스 속성). 클래스 안, 메서드 바깥에 만든 변수는 모든 객체가 함께 쓴다(클래스 속성).

```python
class Character:
    max_level = 99            # 클래스 속성: 모든 캐릭터 공통

    def __init__(self, name):
        self.name = name      # 인스턴스 속성: 캐릭터마다 다름


a = Character("kim")
b = Character("lee")
print(a.max_level, b.max_level)   # 99 99
print(Character.max_level)        # 99
```

클래스 속성에 리스트처럼 바꿀 수 있는 값을 두면, 한 객체에서 바꾼 내용이 모든 객체에 보인다. 객체마다 따로 가져야 하는 리스트나 딕셔너리는 `__init__` 안에서 `self.` 로 만든다.

```python
class Bag:
    items = []                # 모든 Bag이 같은 리스트를 함께 쓴다

a = Bag()
b = Bag()
a.items.append("칼")
print(b.items)                # ['칼'] (b에 넣은 적이 없는데 보인다)
```

<br/>

## 특별한 메서드
### `__str__`
객체를 `print()` 하면 기본으로는 `<__main__.Character object at 0x...>` 처럼 클래스 이름과 메모리 주소만 나온다. `__str__` 을 정의하면 `print()` 나 `str()` 이 이 메서드가 돌려준 문자열을 쓴다.

```python
class Character:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def __str__(self):
        return f"{self.name} (HP {self.hp})"


print(Character("kim", 100))   # kim (HP 100)
```

### 그 밖의 특별한 메서드
연산자와 내장 함수도 내부적으로는 특별한 메서드를 부른다. `len(x)` 는 `x.__len__()`, `a == b` 는 `a.__eq__(b)`, `a + b` 는 `a.__add__(b)` 를 부른다. 그래서 내가 만든 클래스에 이 메서드들을 정의하면 `len()`, `==`, `+` 를 쓸 수 있게 된다. 문자열과 리스트에서 `+` 가 다르게 동작했던 것도 각 클래스가 `__add__` 를 다르게 정의했기 때문이다.

```python
class Team:
    def __init__(self, members):
        self.members = members

    def __len__(self):
        return len(self.members)


print(len(Team(["kim", "lee"])))   # 2
```

<br/>

## 상속 (Inheritance)
### 정의
사전적 의미는 물려받음. 부모의 재산이나 지위를 자식이 이어받는 것이다.
공학적으로는 이미 있는 클래스의 속성과 메서드를 물려받아 새 클래스를 만드는 것을 말한다. 물려주는 쪽을 부모 클래스(Parent Class), 물려받는 쪽을 자식 클래스(Child Class)라 한다.

### 왜 필요할까
전사와 마법사 클래스를 따로 만들면 이름, 체력, 피해 받기처럼 모든 캐릭터에 공통인 코드를 양쪽에 똑같이 써야 한다. 공통 부분을 부모 클래스 하나에 두고 자식 클래스는 다른 부분만 쓰면, 공통 동작을 고칠 때 부모 한 곳만 고치면 된다.

### 기본 형태
클래스 이름 뒤 괄호에 부모 클래스를 적는다.

```python
class Character:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def take_damage(self, damage):
        self.hp -= damage

    def attack(self):
        return f"{self.name}의 기본 공격"


class Mage(Character):
    def __init__(self, name, hp, mp):
        super().__init__(name, hp)   # 부모의 __init__으로 name, hp를 설정
        self.mp = mp                 # 마법사에게만 있는 속성

    def attack(self):                # 부모의 메서드를 다시 정의
        self.mp -= 10
        return f"{self.name}의 파이어볼"


m = Mage("lee", 80, 50)
m.take_damage(30)        # 부모에게 물려받은 메서드
print(m.hp)              # 50
print(m.attack())        # lee의 파이어볼
print(m.mp)              # 40
```

### super()
super는 위의, 상위의라는 뜻이다. 부모 클래스를 가리킨다. 자식 클래스에서 `__init__` 을 새로 정의하면 부모의 `__init__` 은 자동으로 실행되지 않으므로, `super().__init__()` 으로 직접 불러 부모가 하던 초기화를 맡긴다. 빠뜨리면 `name`, `hp` 속성이 만들어지지 않는다.

### 오버라이딩 (Overriding)
override는 우선하다, 덮어쓰다라는 뜻이다. 부모에게 물려받은 메서드를 자식 클래스에서 같은 이름으로 다시 정의하는 것을 말한다. 위 예시에서 `Mage` 의 `attack` 이 부모의 `attack` 을 덮어썼다. 메서드를 부르면 자식 클래스에 있는지 먼저 찾고, 없으면 부모 클래스에서 찾는다.

### isinstance()
객체가 어떤 클래스의 인스턴스인지 확인한다. 자식 클래스의 인스턴스는 부모 클래스의 인스턴스이기도 하다. 마법사는 캐릭터의 한 종류이기 때문이다.

```python
isinstance(m, Mage)        # True
isinstance(m, Character)   # True
isinstance(m, str)         # False
```

<br/>

## 사용자 정의 예외
12장의 `ValueError`, `KeyError` 같은 예외도 모두 클래스이고, `Exception` 클래스를 상속해 만들어져 있다. 그래서 `Exception` 을 상속하면 내 프로그램에 맞는 예외를 직접 만들 수 있다. 예외 이름만으로 무슨 문제인지 드러나고, 그 예외만 골라 잡을 수 있다.

```python
class NotEnoughMPError(Exception):
    pass


def cast(mage):
    if mage.mp < 10:
        raise NotEnoughMPError(f"{mage.name}의 MP가 부족합니다")
    return mage.attack()


try:
    cast(Mage("lee", 80, 5))
except NotEnoughMPError as e:
    print(e)   # lee의 MP가 부족합니다
```

예외 클래스 이름은 `Error` 로 끝나게 짓는 것이 관례다.

<br/>

## 캡슐화 (Encapsulation)
### 정의
사전적 의미로 capsule은 약을 담는 작은 껍질이다. 안의 내용물을 껍질로 감싸 보호한다.
공학적으로는 객체의 데이터를 바깥에서 직접 건드리지 못하게 감추고, 정해진 메서드로만 다루게 하는 것을 말한다. 은행 계좌의 잔액을 아무나 직접 바꾸지 못하고 입금, 출금 창구를 거쳐야 하는 것과 같다. 창구에서 출금액이 잔액보다 큰지 검사할 수 있으므로 잘못된 값이 들어가는 것을 막는다.

### 파이썬의 방식
다른 언어는 `private` 같은 키워드로 바깥 접근을 문법으로 막지만, 파이썬에는 그런 키워드가 없다. 대신 이름 앞의 밑줄로 표시하는 관례를 쓴다.
- `_balance` 처럼 밑줄 하나로 시작하는 이름은 클래스 안에서만 쓰려는 것이니 바깥에서 건드리지 말라는 약속이다. 문법적으로 막지는 않는다
- `__balance` 처럼 밑줄 두 개로 시작하면 파이썬이 이름을 `_클래스이름__balance` 로 바꿔 저장한다(네임 맹글링, Name Mangling). 바깥에서 `__balance` 로는 접근할 수 없게 되지만, 바뀐 이름을 알면 접근할 수 있으므로 완전히 숨기는 것은 아니다

```python
class Account:
    def __init__(self, balance):
        self._balance = balance

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("잔액이 부족합니다")
        self._balance -= amount

    def get_balance(self):
        return self._balance
```

보통은 밑줄 하나 관례로 충분하다. 메서드처럼 쓰지 않고 속성처럼 읽으면서 검사도 하고 싶을 때 쓰는 `@property` 는 데코레이터를 배운 뒤 별도 문서로 정리한다.

<br/>

[목차](..) | [이전: 파일 입출력](../14_파일%20입출력(File%20Input%20and%20Output))
