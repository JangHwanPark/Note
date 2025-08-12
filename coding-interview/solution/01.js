function solution(arr) {
  arr.sort((a, b) => a - b);
  return arr;
}

function solutionUp(arr) {
  arr.sort((a, b) => b - a);
  return arr;
}

const array = [1, 3, 5, 2, -1];
console.log(solution(array));
console.log(solutionUp(array));