const numbers = [1, 2, 3, 4, 5];

const users = [
  { id: 1, name: "Alice", age: 25, isActive: true, role: "admin" },
  { id: 2, name: "Bob", age: 30, isActive: false, role: "user" },
  { id: 3, name: "Charlie", age: 22, isActive: true, role: "user" },
  { id: 4, name: "David", age: 35, isActive: false, role: "moderator" },
  { id: 5, name: "Eve", age: 28, isActive: true, role: "user" },
];

console.log(numbers.reduce((acc, number) => acc + number, 0));