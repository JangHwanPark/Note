function solution(answers) {
  const ptns = [
    [1,2,3,4,5],
    [2,1,2,3,2,4,2,5],
    [3,3,1,1,2,2,4,4,5,5]
  ];
  
  const scores = [0,0,0];
  
  for (const [i, answer] of answers.entries()) {
    for (const [j, ptn] of ptns.entries()) {
      if (answer === ptn[i % ptn.length]) {
        scores[j] += 1;
      }
    }
  }
  
  const maxScore = Math.max(...scores);
  const highestScores = [];
  
  for (let i = 0; i <scores.length; i++) {
    if (scores[i] === maxScore) {
      highestScores.push(i + 1);
    }
  }
  
  return highestScores;
}

const ans = [1, 2, 3, 4, 5]
const ans2 = [1,3,2,4,2];