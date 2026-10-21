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

// 인스턴스 생성
const firstStudent = new Student('Kim', 'Lee');
console.log(firstStudent.fullName());
console.log(firstStudent.addScore(1));
console.log(firstStudent.addScore(2));
console.log(firstStudent);
console.log(Student.EnrollStudents());