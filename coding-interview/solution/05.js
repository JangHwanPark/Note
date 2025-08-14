function solution(arr1, arr2) {
  const r1 = arr1.length;
  const c1 = arr1[0].length;
  const c2 = arr2[0].length;
  const result = [];
  
  for (let i = 0; i< r1; i++) {
    result.push(new Array(c2).fill(0));
  }
  
  for (let i = 0; i < r1; i++) {
    for (let j = 0; j < c2; j++) {
      for (let k = 0; k < c1; k++) {
        result[i][j] += arr1[i][k] * arr2[k][j];
      }
    }
  }
  
  return result;
}

const arr1 = [[1,4],[3,2],[4,1]];
const arr2 = [[3,3], [3,3]];
const result = solution(arr1, arr2);
console.log(result);