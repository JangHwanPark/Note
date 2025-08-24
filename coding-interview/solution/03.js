// 정수 배열 numbers가 주어집니다. numbers에서
// 서로 다른 인덱스에 있는 두 개의 수를 뽑아
// 더해서 만들 수 있는 모든 수를 배열에오름차순으로 담아
// return 하도록 solution 함수를 완성해주세요.

function solution(numbers) {
  const result = [];
  
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      result.push(numbers[i] + numbers[j]);
    }
  }
  return [...new Set(result)].sort((a, b) => a - b);
}

const numbers = [2,1,3,4,1];
console.log(solution(numbers))
const test = [...numbers, [1,2,3,4,5], 5,4,3,2,1]
console.log(test)