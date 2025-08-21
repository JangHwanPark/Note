// 입력
// N - 전체 스테이지 수 (숫자)
// stages - 스테이지 번호 (배열)

// 문제 분석
// 스테이지별 실패율을 구해야함
// N 번째 스테이지에서 사용자가 도전했다면 N/stages[i]로 계산
// 최종적으로는 내림차순으로 배열을 반환해야함
// N번째 스테이지의 인원이 실패율이 높다면 배열 앞에 존재해야함
function solution(N, stages) {
  const a = new Array(N + 2).fill(0);
  for (const s of stages) {
    a[s] += 1;
  }
  
  const fails = {};
  let cnt = stages.length;
  
  for (let i = 1; i <= N; i++) {
    if (a[i] === 0) {
      fails[i] = 0;
      continue;
    }
    
    fails[i] = a[i] / cnt;
    cnt -= a[i];
  }
  
  const result = Object.entries(fails).sort((a, b) => b[1] - a[1]);
  return result.map(v => Number(v[0]));
}

const N = 5;
const stages = [2,1,2,6,2,4,3,3];