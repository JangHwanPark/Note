function solution(arr) {
  const uniqueArray = [...new Set(arr)];
  console.log(uniqueArray);
  uniqueArray.sort((a, b) => a - b);
  return uniqueArray;
}

const arr = [2, 3, 2, 3, 1, 4, 5, 1];
console.log(solution(arr));