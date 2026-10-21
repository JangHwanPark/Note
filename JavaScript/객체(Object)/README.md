## 객체 접근법
### 점 표기법
간단하고 가독성이 좋으며 키 이름이 무조건 리터럴 문자열이어야 한다.
또한 키 이름에 공백이나 특수문자가 있다면 사용할 수 없다.
```js
const object = {
  a: "a",
  b: "b"
}

console.log(object.a)
console.log(object.b)
```

### 대괄호 표기
키를 변수로 사용할 수 있으며 키 이름에 공백이나 특수문자가 있어도 사용할 수 있다.
```js
const object = {
  a: "a",
  b: "b"
}

const key = "a";
console.log(object[key])
```
