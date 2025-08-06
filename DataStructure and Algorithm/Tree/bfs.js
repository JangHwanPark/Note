// 핵심 원리 : 동일레벨 우선탐색
// BFS 는 레벨 순서대로 노드를 탐색함
// 현재 노드의 모든 형제노드는 방문하고 그다음 레벨의 노드들을 방문하는 방식
// 너비우선이라는 특성때문에 큐를 사용하여 구현해야함
function bfs(root) {
  if (!root) return [];
  
  const result = [];
  const queue =  [root];
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode) {
      result.push(currentNode.value);
      
      for (const child of currentNode.children) {
        queue.push(child);
      }
    }
  }
  
  return result;
}