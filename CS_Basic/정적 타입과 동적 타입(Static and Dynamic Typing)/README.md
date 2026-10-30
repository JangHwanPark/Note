## 타입이란 ?
- 타입(Type)은 값이 어떤 종류인지, 그래서 그 값으로 어떤 연산을 할 수 있는지를 정한 것이다
- 언어마다 그 규칙을 언제 검사하는지(실행 전인지 실행 중인지), 타입을 사람이 적는지 컴파일러가 알아내는지, 다른 타입끼리 연산할 때 알아서 바꿔 주는지가 다르다
- 이 노트는 그 세 가지 차이인 정적 타입과 동적 타입, 타입 추론, 강한 타입과 약한 타입을 차례로 보고, 둘을 섞은 점진적 타입과 각 방식의 장단점으로 마무리한다

[변수 노트의 타입](../변수(Variable)/README.md#타입-type)에서 타입은 메모리의 비트를 어떻게 읽을지 정하는 약속이라고 했고, [바인딩 시점](../변수(Variable)/README.md#바인딩-시점)에서 이름과 타입이 실행 전에 묶이면 정적 타입 언어, 실행 중에 묶이면 동적 타입 언어라고 짧게 적었다. 이 노트는 그 이야기를 이어 간다.

<br/>

## 단어의 뜻
### 타입 (Type)
사전적 의미는 유형, 종류다. 같은 성질을 가진 것들의 묶음을 말한다.

공학적으로는 값의 집합과 그 값에 허용되는 연산을 묶은 것이다. 변수 노트에서는 비트를 어떻게 읽을지의 쪽에서 봤고, 이 노트에서는 그 값에 허용되는 연산의 쪽에서 본다. 정수 타입은 정수 값들의 모임이고, 더하기와 곱하기를 할 수 있다. 문자열 타입은 글자 묶음의 모임이고, 이어 붙이기와 대문자로 바꾸기를 할 수 있다. 값의 타입을 알면 그 값에 무엇을 해도 되는지가 정해진다.

### 정적과 동적 (Static, Dynamic)
static의 사전적 의미는 멈춰 있는, 변하지 않는이고, dynamic은 움직이는, 변하는이다.

프로그래밍 언어에서는 이 둘이 시점을 가리키는 말로 굳었다. 정적은 프로그램을 실행하지 않고 코드만 보고 알 수 있는 것, 즉 실행 전을 뜻한다. 동적은 프로그램이 실제로 움직이는 동안, 즉 실행 중을 뜻한다. 정적 타입과 동적 타입도 타입 검사를 실행 전에 하느냐, 실행 중에 하느냐로 나뉜다.

<br/>

## 왜 타입을 검사할까
### 타입 오류 (Type Error)
값에 허용되지 않은 연산을 하려는 것을 타입 오류라고 한다. 숫자 20에 1을 더하는 것은 되지만, 글자 `"20"` 에 숫자 1을 더하라는 것은 무엇을 원하는지 분명하지 않다. 글자를 이어 붙이라는 것인지, 글자를 숫자로 읽어 더하라는 것인지 정해져 있지 않다.

### 검사하지 않으면 생기는 일
변수 노트에서 본 것처럼 메모리에는 비트만 있고, 그것이 숫자인지 글자인지 표시가 없다. 아무도 검사하지 않으면 글자를 담은 비트를 숫자로 읽어 계산하는 일이 생기고, 결과는 오류 메시지 없이 엉뚱한 값이 된다. 틀린 것보다 틀렸다는 사실을 모르는 것이 더 위험하다.

타입 검사(Type Checking)는 연산을 하기 전에 값의 타입이 그 연산에 맞는지 확인하는 일이다. 전원 플러그와 콘센트의 모양과 같다. 모양이 맞지 않으면 아예 꽂히지 않아서, 전압이 다른 기기를 잘못 연결하는 사고를 막는다.

남는 문제는 이 확인을 언제 하느냐다.

<br/>

## 타입 검사는 언제 할까
### 정적 타입 (Static Typing)
프로그램을 실행하기 전에 타입을 검사하는 방식이다. 보통 컴파일러(Compiler)가 코드를 기계가 실행할 형태로 바꾸는 단계에서 검사한다. 변수, 매개변수, 반환값 같은 이름마다 타입이 정해져 있고, 컴파일러는 코드의 모든 줄을 읽으며 이름에 맞지 않는 값이 들어가는 곳을 찾는다. 자바, C, C#, 러스트 등이 이 방식이다.

책을 인쇄하기 전에 원고 전체를 교정하는 것과 같다. 독자가 어느 페이지를 펼칠지와 상관없이 모든 페이지를 미리 본다.

아래 자바 코드는 `int` 를 받는 메서드에 문자열 `"20"` 을 넘긴다. 그 줄은 실행 인자가 있을 때만 도는 `if` 안에 있다.

```java
public class Age {
    static int nextYear(int age) {
        return age + 1;
    }

    public static void main(String[] args) {
        System.out.println("start");
        System.out.println(nextYear(20));
        if (args.length > 0) {
            System.out.println(nextYear("20"));
        }
    }
}
```

`javac Age.java` 로 컴파일하면 아래처럼 나온다.

```
Age.java:10: error: incompatible types: String cannot be converted to int
            System.out.println(nextYear("20"));
                                        ^
Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output
1 error
```

컴파일이 실패해 실행할 결과물인 클래스 파일(`.class`)이 만들어지지 않는다. 그래서 문제없는 앞부분의 `start` 도 한 번도 출력되지 않는다. 실제로는 거의 돌지 않을 `if` 안의 코드인데도 컴파일러는 미리 막는다.

### 동적 타입 (Dynamic Typing)
실행 중에, 연산을 하는 그 순간에 타입을 검사하는 방식이다. 이름에는 타입이 없고 값이 자기 타입을 가지고 다닌다. 변수 노트에서 이름과 타입이 실행 중에 묶인다고 한 것은, 이름이 그때 가리키는 값의 타입을 따라간다는 뜻이다. 같은 이름에 숫자를 넣었다가 문자열을 넣을 수 있다. 파이썬, 자바스크립트, 루비 등이 이 방식이다. 동적 타이핑이라고도 부른다(파이썬 2장, 19장의 표현).

```python
x = 10
print(type(x))   # <class 'int'>
x = "ten"
print(type(x))   # <class 'str'>
```

```js
let x = 10;
console.log(typeof x);   // number
x = "ten";
console.log(typeof x);   // string
```

교정 없이 책을 내고, 독자가 그 페이지를 읽을 때 오타를 발견하는 것과 같다. 아무도 펼치지 않은 페이지의 오타는 끝까지 드러나지 않는다.

위 자바 코드와 같은 실수를 파이썬으로 해 본다.

```python
def next_year(age):
    return age + 1

print("시작")
print(next_year(20))
print(next_year("20"))
print("끝")
```

```
시작
21
Traceback (most recent call last):
  File "...\age.py", line 6, in <module>
    print(next_year("20"))
          ~~~~~~~~~^^^^^^
  File "...\age.py", line 2, in next_year
    return age + 1
           ~~~~^~~
TypeError: can only concatenate str (not "int") to str
```

파일 경로는 줄여 적었다. 자바와 달리 앞의 두 줄은 정상으로 실행되고, `"20" + 1` 을 계산하려는 순간에야 `TypeError` 가 난다. 그 뒤의 `끝` 은 출력되지 않는다. 트레이스백의 `~` 와 `^` 표시는 Python 3.11부터 나온다.

잘못된 줄이 실행되지 않으면 오류도 나지 않는다.

```python
def next_year(age):
    return age + 1

def greet(is_birthday):
    if is_birthday:
        return next_year("20")
    return "평소와 같은 날"

print(greet(False))   # 평소와 같은 날
```

`next_year("20")` 은 분명 틀린 코드지만 `is_birthday` 가 거짓이라 그 줄까지 가지 않았다. 생일인 사용자가 처음 들어오는 날에야 오류가 드러난다. 동적 타입 언어에서 테스트가 중요한 이유가 여기 있다.

### 정적 타입 언어도 실행 중에 검사한다
정적과 동적은 칼로 자르듯 나뉘지 않는다. 정적 타입 언어도 실행 전에 확인할 수 없는 부분은 실행 중에 검사한다. 아래 자바 코드는 `Object` 로 담아 둔 문자열을 `Integer` 로 바꾸라고 한다. 컴파일러는 `value` 에 실제로 무엇이 들었는지 실행 전에는 모르므로 이 코드를 통과시킨다.

```java
public class Cast {
    public static void main(String[] args) {
        Object value = "hello";
        Integer number = (Integer) value;
        System.out.println(number + 1);
    }
}
```

```
Exception in thread "main" java.lang.ClassCastException: class java.lang.String cannot be cast to class java.lang.Integer (java.lang.String and java.lang.Integer are in module java.base of loader 'bootstrap')
	at Cast.main(Cast.java:4)
```

검사는 실행 중 4번째 줄에서 일어났다. 그래서 정적 타입 언어라는 말은 실행 전에 대부분의 타입 검사를 한다는 뜻으로 읽는 것이 정확하다.

<br/>

## 타입 추론 (Type Inference)
### 정의
추론의 사전적 의미는 미루어 생각함이다. 이미 아는 것을 근거로 모르는 것을 알아내는 일이다.

공학적으로는 코드에 타입을 적지 않아도 컴파일러가 주변 코드를 근거로 타입을 알아내는 것을 말한다. 택배 상자에 품목을 적지 않고 보냈는데, 접수 직원이 송장에 적힌 내용물 칸을 보고 품목 라벨을 대신 붙여 주는 것과 같다. 붙이는 사람이 바뀌었을 뿐, 발송 전에 라벨이 붙는다는 사실은 같다.

### 추론은 동적 타입이 아니다
타입을 적지 않는다는 점이 동적 타입과 닮아 보여서 자주 헷갈린다. 하지만 타입 추론은 정적 타입 언어의 기능이다. 컴파일할 때 타입이 정해지고, 한 번 정해지면 실행 중에 바뀌지 않는다. 타입을 쓰는 수고만 덜어 줄 뿐, 검사는 그대로 실행 전에 한다.

### 어떻게 동작할까 (지역 추론)
가장 흔한 방식은 변수를 만들 때 넣는 초기값을 보고 정하는 것이다. 이렇게 한 줄이나 한 식 주변만 보고 타입을 정하는 것을 지역 타입 추론(Local Type Inference)이라고 한다.

자바는 지역 변수에 타입 대신 `var` 를 쓸 수 있다(Java 10부터, JEP 286). 자바 언어 명세(JLS 14.4.1)는 `var` 로 만든 변수의 타입을 초기값 식을 따로 떼어 놓고 계산한 타입으로 정한다고 적고 있다.

```java
import java.util.ArrayList;

public class VarOk {
    public static void main(String[] args) {
        var count = 10;
        var price = 2.5;
        var names = new ArrayList<String>();
        names.add("kim");
        System.out.println(((Object) count).getClass().getSimpleName());   // Integer
        System.out.println(((Object) price).getClass().getSimpleName());   // Double
        System.out.println(names.get(0).toUpperCase());                    // KIM
    }
}
```

`count` 는 `int`, `price` 는 `double`, `names` 는 `ArrayList<String>` 으로 정해졌다. `int` 같은 기본 타입은 클래스 이름을 바로 볼 수 없어서 `Object` 로 감싸 확인했다. 그래서 출력은 감싼 클래스 이름인 `Integer`, `Double` 이다. `names.get(0)` 이 `String` 이라는 것도 컴파일러가 알기 때문에 `toUpperCase()` 를 부를 수 있다.

정해진 뒤에는 다른 타입을 넣을 수 없다. 처음부터 타입을 적은 것과 똑같이 검사한다.

```java
var count = 10;
var names = new ArrayList<String>();
count = "ten";
names.add(3);
var empty;
```

```
Var.java:8: error: incompatible types: String cannot be converted to int
        count = "ten";
                ^
Var.java:9: error: incompatible types: int cannot be converted to String
        names.add(3);
                  ^
Var.java:10: error: cannot infer type for local variable empty
        var empty;
            ^
  (cannot use 'var' on variable without initializer)
```

(위 출력은 `main` 메서드 안에 이 다섯 줄을 넣고 컴파일한 결과에서 오류 부분만 옮겼다. 줄 번호는 그 파일 기준이다.)

마지막 `var empty;` 처럼 초기값이 없으면 근거가 없으니 추론할 수 없다. JLS 14.4는 `var` 에 초기값이 없거나 초기값이 배열 초기화식(`{1, 2}` 같은 것)이면 컴파일 오류라고 정하고, 14.4.1은 초기값이 `null` 이거나 람다식이면 오류라고 정한다. 둘 다 초기값만 보고는 타입을 하나로 정할 수 없는 경우다. 파이썬 19장에서 빈 리스트 `[]` 에는 `names: list[str] = []` 처럼 힌트를 적으라고 한 것도 같은 이유다.

### 변수 밖으로 넓힌 추론
타입스크립트(TypeScript) 핸드북의 Type Inference 문서는 변수와 멤버를 초기화할 때, 매개변수의 기본값을 정할 때, 함수의 반환 타입을 정할 때 추론이 일어난다고 설명한다. 아래 코드는 반환 타입을 적지 않았지만 `age + 1` 이 숫자라서 반환 타입이 `number` 로 정해진다.

```ts
let count = 10;
count = "ten";

function nextYear(age: number) {
  return age + 1;
}

const next = nextYear(20);
next.toUpperCase();
```

TypeScript 5.9.3에서 `tsc --noEmit --strict infer.ts` 로 검사한 결과다.

```
infer.ts(2,1): error TS2322: Type 'string' is not assignable to type 'number'.
infer.ts(9,6): error TS2339: Property 'toUpperCase' does not exist on type 'number'.
```

`count` 는 처음 넣은 `10` 을 보고 `number` 가 되었고, `next` 는 함수의 추론된 반환 타입을 따라 `number` 가 되었다. 같은 문서는 반대 방향의 추론도 설명한다. 식이 놓인 자리의 타입을 보고 식의 타입을 정하는 것으로, 문맥 타입 지정(Contextual Typing)이라고 부른다. 예를 들어 함수를 넘겨받는 자리에 화살표 함수를 쓰면, 그 자리가 요구하는 함수 타입을 보고 매개변수 타입을 정한다. 타입스크립트의 추론은 [제네릭 노트](../../TypeScript/제네릭(Generics)/README.md)에서도 짧게 다뤘다.

### 프로그램 전체를 보는 추론 (힌들리-밀너)
지역 추론은 초기값처럼 바로 옆의 근거만 본다. 그래서 자바와 타입스크립트에서도 함수 매개변수 타입은 대부분 사람이 적어야 한다.

이보다 넓게, 함수가 매개변수를 어떻게 쓰는지까지 모아 프로그램 전체의 타입을 풀어내는 방식이 있다. 대표가 힌들리-밀너(Hindley-Milner) 타입 체계다. J. Roger Hindley가 처음 기술하고 Robin Milner가 다시 발견해 둘의 이름이 붙었고, ML 언어에서 처음 구현되었다. 타입을 하나도 적지 않아도 가장 일반적인 타입을 찾아낼 수 있다고 알려져 있다. 동작 원리는 이 노트의 범위를 넘으므로 TODO로 미룬다.

<br/>

## 강한 타입과 약한 타입
### 먼저 짚을 점
강한 타입(Strong Typing)과 약한 타입(Weak Typing)은 자주 쓰이지만 뜻이 하나로 정해진 말이 아니다. 위키백과 Type system 문서(3.5절)는 언어를 강한 타입이나 약한 타입이라고 부르는 것은 일상적인 표현이고, 이 말들이 무엇을 뜻하는지에 대해 널리 받아들여진 정의가 없다고 적고 있다.

그래서 같은 언어를 두고도 사람마다 판정이 다르다. 어떤 사람은 다른 타입끼리 알아서 바꿔 주는지를 기준으로 삼고, 어떤 사람은 메모리를 다른 타입으로 읽는 것을 막는지를, 어떤 사람은 타입 검사를 실행 전에 하는지를 기준으로 삼는다. 마지막 기준은 사실 정적과 동적의 차이를 다른 이름으로 부른 것이다.

이 노트에서는 가장 흔히 쓰이는 기준 하나인 암묵적 변환으로만 설명한다. 다만 이것은 여러 쓰임 가운데 하나일 뿐이다. 어떤 언어가 강한 타입이라는 말을 들으면 무엇을 기준으로 한 말인지 먼저 확인하는 편이 낫다.

### 암묵적 변환 (Implicit Conversion)
암묵의 사전적 의미는 말없이 뜻을 나타냄이다. 공학적으로 암묵적 변환은 코드에 변환하라고 적지 않았는데 언어가 알아서 값의 타입을 바꿔 연산하는 것을 말한다. 강제 변환(Type Coercion)이라고도 부른다. 반대로 `int("20")` 처럼 코드에 직접 적는 변환은 명시적 변환(Explicit Conversion)이다.

암묵적 변환을 많이 하는 언어를 약한 타입, 거의 하지 않고 오류를 내는 언어를 강한 타입이라고 부르는 것이 이 기준이다. 계산대에서 달러를 내밀면 직원이 알아서 환율을 적용해 받아 주는 가게와, 원화만 받으니 환전해 오라고 돌려보내는 가게의 차이와 같다. 앞의 가게는 편하지만, 어떤 환율을 썼는지 모른 채 계산이 끝난다.

### 같은 연산, 다른 결과
같은 식을 자바스크립트, 파이썬, 자바에서 계산해 봤다. 자바의 오류는 컴파일 오류다.

| 식 | 자바스크립트 | 파이썬 | 자바 |
|---|---|---|---|
| `"1" + 1` | `'11'` (문자열로 바꿔 이어 붙임) | `TypeError` | `"11"` (문자열로 바꿔 이어 붙임) |
| `"3" * 2` | `6` (숫자로 바꿔 곱함) | `'33'` (문자열 반복) | 컴파일 오류 |
| `1 + true` | `2` (`true` 를 1로 바꿈) | `1 + True` 는 `2` | 컴파일 오류 |
| `1 + 2.5` | `3.5` | `3.5` | `3.5` |

자바스크립트에서 `"abc" * 2` 는 오류 없이 `NaN` 이 나온다. 숫자로 바꿀 수 없는 글자를 숫자로 바꾸려다 숫자가 아님(Not a Number)이라는 값이 되었다. 오류가 나지 않으니 이 값이 계산을 따라 계속 흘러간다.

각 결과는 언어 명세에 적힌 규칙대로다.

- 자바스크립트는 ECMAScript 명세 13.15.3절의 규칙에 따라 `+` 의 양쪽 중 하나라도 문자열이면 둘 다 문자열로 바꿔 이어 붙이고, 아니면 둘 다 숫자로 바꿔 계산한다. `*` 에는 문자열 쪽 규칙이 없어서 바로 숫자로 바꾼다
- 파이썬은 언어 레퍼런스 6.7절에서 `+` 의 양쪽이 둘 다 숫자이거나 둘 다 같은 종류의 시퀀스여야 한다고 정한다. 그래서 `"1" + 1` 은 오류다. `*` 는 정수와 시퀀스를 받으면 반복으로 정해져 있어서 `"3" * 2` 는 `'33'` 이 된다
- 자바는 JLS 15.18.1절에서 `+` 의 한쪽만 `String` 이면 다른 쪽을 문자열로 바꾼다고 정한다. 하지만 `*` 에는 그런 규칙이 없어서 `"3" * 2` 는 `bad operand types for binary operator '*'` 라는 컴파일 오류가 난다

### 하나의 줄 위에 놓이지 않는다
표를 보면 강하다, 약하다를 한 줄로 세우기 어렵다는 것이 드러난다.

파이썬은 동적 타입이지만 `"1" + 1` 을 거부한다. 자바는 정적 타입이지만 `"1" + 1` 을 받아 준다. 파이썬도 `1 + True` 는 `2` 로 계산한다. 파이썬 공식 문서는 `bool` 이 `int` 의 하위 타입이라고 적고 있어서, 엄밀히는 변환이라기보다 `True` 가 원래 정수 1로 취급되는 것이다. 정수와 실수를 더하면 정수를 실수로 바꾸는 것은 자바와 파이썬 모두 한다(파이썬은 언어 레퍼런스 6.1절). 자바스크립트는 숫자 타입이 number 하나라서(BigInt 제외) 처음부터 바꿀 것이 없다.

정리하면 정적과 동적은 검사 시점의 축이고, 암묵적 변환을 얼마나 하느냐는 그와 다른 축이다. 그리고 그 축 위에서도 언어는 연산마다 다르게 행동한다. 강한 타입, 약한 타입이라는 이름표가 이 차이를 다 담지 못하는 이유다.

<br/>

## 점진적 타입 (Gradual Typing)
### 정의
점진의 사전적 의미는 조금씩 차례로 나아감이다. 공학적으로 점진적 타입은 프로그램의 일부에만 타입을 적고, 적은 곳은 정적으로 검사하고 적지 않은 곳은 동적으로 두는 방식이다. 파이썬 타입 힌트의 이론을 설명한 PEP 483은 점진적 타입이 프로그램의 일부에만 타입을 적을 수 있게 해 정적 타입과 동적 타입의 장점을 함께 쓰려는 것이라고 설명한다.

집 전체를 한 번에 고치지 않고 방 하나씩 리모델링하는 것과 같다. 고친 방은 새 규격을 따르고, 아직 안 고친 방도 그대로 살 수 있다.

### 어떻게 이어 붙일까
점진적 타입 언어에서 타입을 검사하는 도구를 타입 검사기(Type Checker)라고 한다. 타입스크립트의 tsc, 파이썬의 mypy가 그렇다.

적은 곳과 적지 않은 곳이 만나는 자리에는 무엇이든 될 수 있는 특별한 타입이 있다. 파이썬에서는 `Any`, 타입스크립트에서는 `any` 라고 부른다. PEP 483은 `Any` 가 모든 타입과 호환되고(consistent), 모든 타입이 `Any` 와 호환된다고 정한다. 그래서 검사기는 `Any` 가 오가는 자리를 따지지 않고 통과시킨다.

이 통로는 편하지만 구멍이기도 하다. 아래 타입스크립트 코드는 `number` 를 받는 함수에 `any` 로 적은 문자열을 넘긴다.

```ts
function nextYear(age: number) {
  return age + 1;
}

const fromOldCode: any = "20";
console.log(nextYear(fromOldCode));
```

`tsc --strict` 는 오류 없이 통과하고, 만들어진 자바스크립트를 Node.js로 실행하면 `201` 이 나온다. `"20" + 1` 이 자바스크립트 규칙대로 이어 붙여졌다. `any` 대신 `nextYear("20")` 처럼 문자열을 바로 넘기면 `error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.` 로 잡힌다. 타입스크립트의 `any` 는 [any와 never 타입 노트](../../TypeScript/any와%20never%20타입(any%20and%20never%20Types)/README.md)에서 자세히 다뤘다.

### 두 언어의 방식
- 타입스크립트는 자바스크립트에 타입을 더한 언어다. 컴파일러가 타입을 검사한 뒤 타입을 지운 자바스크립트를 만들고, 실제로 실행되는 것은 그 자바스크립트다. 위 출력 `201` 도 타입이 지워진 뒤 자바스크립트 규칙대로 계산된 결과다
- 파이썬 타입 힌트는 PEP 484로 표준 문법이 정해졌다. PEP 484의 요약은 힌트가 실행 중에 읽을 수는 있지만 실행 중에 타입 검사는 하지 않는다고 적고, 목표가 아닌 것(Non-goals)에서는 파이썬이 앞으로도 동적 타입 언어로 남는다고 적는다. 검사는 mypy 같은 별도 도구가 실행 전에 한다. 자세한 문법과 mypy 결과는 [파이썬 19장 타입 힌트](../../Python/19_타입%20힌트(Type%20Hint)/README.md)에서 다뤘다

자바스크립트와 파이썬 모두 타입 없이 쓰인 코드가 이미 많았고, 그 코드를 한 번에 버리지 않고 조금씩 타입을 붙여 가려고 이 방식을 택했다.

<br/>

## 장단점
### 정적 타입
타입 오류를 실행 전에, 그것도 잘 실행되지 않는 분기까지 포함해 찾는다. 이름마다 타입이 정해져 있으니 편집기가 자동 완성을 보여 주고, 이름을 바꾸는 리팩터링도 도구가 안전하게 해 준다. 함수의 타입이 곧 설명서 역할을 해서 코드가 커질수록 이점이 커진다.

대신 타입을 적는 코드가 늘고, 타입을 맞추려고 형변환이나 추가 선언을 써야 할 때가 있다. 실제로는 문제없이 돌 코드라도 컴파일러가 실행 전에 안전하다고 확인할 수 없으면 거부한다. 타입 추론은 이 중 적는 수고를 줄여 주는 장치다.

### 동적 타입
타입을 적지 않으니 짧게 빨리 쓸 수 있고, 같은 함수가 여러 타입의 값을 받는 코드를 자연스럽게 쓸 수 있다. 짧은 스크립트나 실험적인 코드에 잘 맞는다.

대신 타입 오류가 실행해 봐야 드러나고, 실행되지 않은 분기의 오류는 남아 있다. 이 빈자리를 테스트로 메워야 한다. 코드만 보고 변수에 무엇이 들었는지 알기 어려워 큰 코드에서 읽기가 힘들어진다.

### 점진적 타입
기존 동적 타입 코드를 버리지 않고 중요한 곳부터 타입을 붙일 수 있다. 붙인 만큼은 정적 타입의 이점을 얻는다.

대신 `Any` 를 거쳐 들어온 값은 검사되지 않아서, 타입을 적었다고 안전하다고 믿으면 위의 `201` 같은 결과를 만난다. 타입스크립트와 파이썬은 실행할 때 타입 정보를 쓰지 않으므로, 검사기가 통과시킨 것이 실행 중에도 맞다는 보장이 없다.

### 암묵적 변환
변환을 많이 해 주면 짧은 코드로 원하는 결과를 얻기 쉽다. 문자열과 숫자를 이어 붙여 메시지를 만드는 일처럼 흔한 경우에 편하다.

대신 의도하지 않은 변환이 오류 없이 일어난다. `"abc" * 2` 가 `NaN` 이 되는 것처럼 틀린 값이 조용히 계산을 따라 흘러가, 문제가 생긴 곳과 드러난 곳이 멀어진다.

### 한눈에 비교

| | 정적 타입 | 동적 타입 | 점진적 타입 |
|---|---|---|---|
| 타입 오류를 찾는 때 | 실행 전 | 실행 중 그 연산을 할 때 | 타입을 적은 곳은 실행 전, 나머지는 실행 중 |
| 검사에 쓰는 타입은 어디에 붙나 | 이름(변수, 매개변수) | 값 | 적은 곳은 이름, 나머지는 값 |
| 타입을 적는 수고 | 많다(추론으로 줄일 수 있다) | 없다 | 적고 싶은 만큼 |
| 실행되지 않은 분기의 오류 | 찾는다 | 못 찾는다 | 타입을 적은 곳만 찾는다 |
| 예 | 자바, C#, 러스트 | 파이썬, 자바스크립트, 루비 | 타입스크립트, 타입 힌트를 쓴 파이썬 |

<br/>

## 참고 자료
이 노트의 예시는 Windows 11에서 2026-10-29에 Java 17.0.12, Python 3.13.14, Node.js v24.22.1, TypeScript 5.9.3으로 실행했다.

아래는 이 노트를 쓰며 2026-10-29에 직접 읽은 자료다.

- The Java Language Specification, Java SE 17 Edition, 14.4절 Local Variable Declarations(`var` 를 쓸 수 없는 경우 목록), 14.4.1절 Local Variable Declarators and Types, 15.18.1절 String Concatenation Operator +
- JEP 286 Local-Variable Type Inference(Release 항목)
- ECMAScript Language Specification(tc39.es/ecma262, 작성 시점의 최신 초안), 13.15.3절 ApplyStringOrNumericBinaryOperator. 초안이라 절 번호는 바뀔 수 있다
- Python 3.13 언어 레퍼런스 6장 Expressions의 6.1절 Arithmetic conversions, 6.7절 Binary arithmetic operations
- Python 3.13 표준 라이브러리 문서 Built-in Types의 Numeric Types 절과 Boolean Type 절(`bool` 이 `int` 의 하위 타입이라는 문장)
- PEP 483 The Theory of Type Hints, Summary of gradual typing 절
- PEP 484 Type Hints, Abstract와 Non-goals 절
- TypeScript Handbook, Type Inference 문서(Best common type, Contextual Typing 포함)
- 위키백과(영어) Type system 문서 3.5절 Strong and weak type systems, 5.6절 Gradual typing
- 위키백과(영어) Hindley-Milner type system 문서의 도입부

<br/>

## 더 볼 것 (TODO)
- 힌들리-밀너 타입 추론의 동작 원리(단일화 Unification), ML과 하스켈의 추론
- 구조적 타입(Structural Typing)과 명목적 타입(Nominal Typing): 이름이 같아야 같은 타입인지, 모양이 같으면 같은 타입인지
- 제네릭(Generics)과 매개변수 다형성(Parametric Polymorphism)을 언어 일반의 관점에서
- 타입 안전성(Type Safety)과 건전성(Soundness): 검사기를 통과한 프로그램이 실제로 타입 오류를 내지 않는다는 보장
- 덕 타이핑(Duck Typing)과 동적 타입 언어의 다형성
- 정적 타입 정보가 컴파일러 최적화와 실행 속도에 주는 영향(확인 필요)
- 타입을 적은 곳과 적지 않은 곳의 경계에 실행 중 검사를 넣는 점진적 타입 구현(확인 필요)
- 메모리를 다른 타입으로 읽는 타입 퍼닝(Type Punning)과 약한 타입의 다른 쓰임
