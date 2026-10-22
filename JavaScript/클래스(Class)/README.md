## 클래스란 ?
- 같은 모양의 객체를 여러 개 만들기 위한 설계도
- ES2015에서 `class` 문법이 들어왔다. 그전에는 생성자 함수와 프로토타입으로 같은 일을 했다
- 객체가 가질 값은 `constructor` 에서 정하고, 객체가 할 동작은 메서드로 적는다. 클래스 자체에 붙는 기능은 `static` 으로 적는다
- 예시 코드는 같은 폴더의 [classExam01.js](./classExam01.js)다

### 클래스 (Class)
사전적 의미는 부류, 종류, 등급이다. 같은 성질을 가진 것들의 묶음을 말한다.
프로그래밍에서는 같은 종류의 객체가 공통으로 가질 값과 동작을 정해 둔 틀을 말한다. 이 틀로 만든 객체 하나하나를 인스턴스(Instance)라고 한다. 인스턴스의 사전적 의미는 사례, 실례로, 일반적인 틀이 실제로 나타난 하나의 예다.

붕어빵 틀과 같다. 틀(클래스)은 하나지만 거기서 찍어 낸 붕어빵(인스턴스)은 여러 개이고, 속에 든 팥이나 슈크림(값)은 하나하나 다를 수 있다.

<br/>

## 왜 필요할까
학생 정보를 객체 리터럴로 여러 개 만들면 같은 속성과 함수를 매번 다시 적어야 한다. 학생이 늘수록 코드가 반복되고, 함수 하나를 고치려면 모든 객체를 고쳐야 한다. 클래스로 틀을 한 번 정해 두면 `new` 로 몇 개든 같은 모양의 객체를 만들 수 있고, 메서드는 한 곳에만 있으면 된다.

<br/>

## 어떻게 동작할까
```js
class Student {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.score = [];
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  addScore(score) {
    this.score.push(score);
    return this.score;
  }

  static EnrollStudents() {
    return "Enroll Students ~ !";
  }
}

const firstStudent = new Student('Kim', 'Lee');
console.log(firstStudent.fullName());   // Kim Lee
console.log(firstStudent.addScore(1));  // [ 1 ]
console.log(firstStudent.addScore(2));  // [ 1, 2 ]
console.log(firstStudent);              // Student { firstName: 'Kim', lastName: 'Lee', score: [ 1, 2 ] }
console.log(Student.EnrollStudents());  // Enroll Students ~ !
```

### constructor
`new Student('Kim', 'Lee')` 를 실행하면 빈 객체가 하나 만들어지고, `constructor` 가 그 객체를 `this` 로 받아 실행된다. 여기서 `this.firstName = firstName` 처럼 넣은 값이 인스턴스마다 따로 갖는 값이 된다. `score` 도 인스턴스마다 새 배열이라, 한 학생에게 점수를 넣어도 다른 학생의 배열은 그대로다.

### 메서드
`fullName`, `addScore` 처럼 클래스 안에 적은 함수는 인스턴스가 함께 쓰는 동작이다. 인스턴스마다 복사되지 않고 `Student.prototype` 에 한 번만 있다. 프로토타입(Prototype)의 사전적 의미는 원형, 본보기다. 자바스크립트에서는 객체가 자기에게 없는 속성을 찾으러 가는 원형 객체를 말하고, 클래스로 만든 인스턴스는 `클래스이름.prototype` 을 원형으로 삼는다. 인스턴스에서 `firstStudent.fullName()` 으로 부르면 그 안의 `this` 가 `firstStudent` 를 가리킨다.

```js
Object.getOwnPropertyNames(Student.prototype); // [ 'constructor', 'fullName', 'addScore' ]
```

두 학생을 만들어 비교하면 `fullName` 은 같은 함수를 가리킨다.

```js
const a = new Student('Kim', 'Lee');
const b = new Student('Park', 'Choi');
a.fullName === b.fullName;                  // true
a.fullName === Student.prototype.fullName;  // true
```

앞의 `getOwnPropertyNames` 결과에 `EnrollStudents` 가 없는 것처럼 `static` 메서드는 프로토타입에 들어가지 않는다.

### static
`static` 이 붙은 메서드는 인스턴스가 아니라 클래스 자체에 붙는다. 그래서 `Student.EnrollStudents()` 로 부르고, `firstStudent.EnrollStudents` 는 `undefined` 다. 특정 학생과 상관없는 기능(학생 등록 안내, 여러 학생을 다루는 도구 함수 등)을 둘 때 쓴다.

### 클래스도 함수다
`typeof Student` 는 `'function'` 이다. 클래스는 생성자 함수를 더 읽기 쉽게 쓰는 문법이라고 볼 수 있다. 다만 일반 함수와 달리 `new` 없이 부르면 오류가 난다.

```js
Student('Kim', 'Lee'); // TypeError: Class constructor Student cannot be invoked without 'new'
```

예시는 모두 Node.js v22.13.0에서 실행한 결과다.

<br/>

## 더 볼 것 (TODO)
- `extends` 와 `super` 로 상속하기
- `#` 으로 시작하는 비공개 필드와 getter, setter
- 프로토타입 체인이 실제로 어떻게 이어지는지
