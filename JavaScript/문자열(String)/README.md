## 문자열 자르기란 ?
- 문자열의 일부만 꺼내 새 문자열로 만드는 일
- 자바스크립트는 `substring()` 과 `slice()` 를 주로 쓴다. `substring()` 은 시작 인덱스부터 끝 인덱스 바로 앞까지를 잘라 새 문자열로 돌려주는 메서드다
- 원래 문자열은 바뀌지 않는다

sub는 아래, 부분이라는 뜻이고 string은 끈, 줄이라는 뜻이다. 글자를 끈처럼 이어 놓은 것이 문자열이고, 그 끈의 일부분을 잘라 낸 것이 substring(부분 문자열)이다.

이메일에서 아이디만 꺼내거나, 긴 제목을 앞의 몇 글자만 보여 줄 때처럼 문자열의 일부만 필요할 때 쓴다.

```js
const email = 'kim@example.com';
console.log(email.substring(0, email.indexOf('@'))); // kim
```

<br/>

## String.prototype.substring
첫 번째 인수로 받은 인덱스의 문자부터 두 번째 인수로 받은 인덱스의 바로 앞 문자까지 잘라 새 문자열로 돌려준다. 자바스크립트의 문자열은 한 번 만들면 바꿀 수 없는(불변, immutable) 값이라서, 자르는 메서드는 모두 원래 문자열을 고치지 않고 새 문자열을 만들어 돌려준다.

```js
const str = 'Hello World';

console.log(str.substring(0, 5)); // Hello
console.log(str.substring(6));    // World (두 번째 인수를 생략하면 끝까지)
console.log(str);                 // Hello World
```

### 인수를 다루는 규칙
첫 번째 인수는 두 번째 인수보다 작은 것이 정상이다. 첫 번째 인수가 더 크면 두 인수를 서로 바꿔서 처리한다.

- 인수가 음수이거나 NaN이면 0으로 취급한다.
- 인수가 문자열 길이보다 크면 문자열 길이로 취급한다.

```js
const str = 'Hello World';

console.log(str.substring(5, 0));   // Hello (두 인수를 바꿔 substring(0, 5)로 처리)
console.log(str.substring(-3, 5));  // Hello (-3을 0으로 취급)
console.log(str.substring(NaN, 5)); // Hello (NaN을 0으로 취급)
console.log(str.substring(6, 100)); // World (100을 길이 11로 취급)
```

<br/>

## slice와 차이
`slice()` 도 같은 방식으로 문자열을 자르지만 음수 인수를 다루는 방법이 다르다. `substring()` 은 음수를 0으로 바꾸고, `slice()` 는 음수를 뒤에서부터 센 위치로 본다.

```js
const str = 'Hello World';

console.log(str.slice(-5));         // World (뒤에서 5글자)
console.log(str.substring(-5));     // Hello World (-5를 0으로 취급해 처음부터 끝까지)

console.log(str.slice(5, 0));       // (빈 문자열, 인수를 바꾸지 않는다)
console.log(str.substring(5, 0));   // Hello
```

뒤에서부터 자를 일이 있으면 `slice()` 가 편하다. 두 메서드의 차이가 헷갈리면 `slice()` 하나만 쓰는 편이 실수가 적다.

<br/>

## 참고 자료
- [MDN: String.prototype.substring()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/substring)
- [MDN: String.prototype.slice()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/slice)
- 예시는 Node.js v22.13.0에서 실행해 결과를 확인했다

<br/>

## 더 볼 것 (TODO)
- 자주 쓰는 문자열 메서드: `split`, `includes`, `padStart`, `replaceAll`, `trim`
- 템플릿 리터럴
- 코드 단위와 글자(코드 포인트)의 차이, `length` 가 글자 수와 다를 때 ([이터레이션](../이터레이션(Iteration)) 노트에 일부 정리)
