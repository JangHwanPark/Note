class Student {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

// 인스턴스 생성
const firstStudent = new Student('Kim', 'Lee');
console.log(firstStudent);