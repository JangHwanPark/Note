class Node {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(node) {
    this.children.push(node);
  }
}

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

// 트리 생성
const root = new Node('A');
const nodeB = new Node('B');
const nodeC = new Node('C');
const nodeD = new Node('D');
const nodeE = new Node('E');
const nodeF = new Node('F');
const nodeG = new Node('G');

root.addChild(nodeB);
root.addChild(nodeC);
root.addChild(nodeD);
nodeB.addChild(nodeE);
nodeB.addChild(nodeF);
nodeD.addChild(nodeG);

console.log("BFS 탐색 결과:", bfs(root));


// 미로 최단 거리 찾기
// BFS의 가장 대표적인 활용법입니다. 시작점에서 도착점까지
// 가는 가장 짧은 경로를 찾아야 할 때 사용합니다.

// BFS는 시작점에서 가까운 노드부터 탐색하기 때문에,
// 가장 먼저 도착점에 도달하는 경로가 최단 경로가 됩니다.

// 로직 패턴
// 1. 큐에 [노드, 거리] 또는 {노드, 거리}를 함께 저장합니다.
// 2. visited 배열 또는 Set을 사용하여 방문한 노드를 기록하고,
// 큐에 넣기 전에 방문 여부를 확인합니다.
// 3. 큐에서 노드를 꺼낼 때마다, 다음 노드까지의 거리를 현재 거리 + 1로
// 업데이트하여 큐에 다시 넣습니다.
// 4. 도착점에 도달하면 그때의 거리를 반환하고 탐색을 종료합니다.
function findShortestPath(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  const queue = [{
    x: start[0],
    y: start[1],
    dist: 0
  }]
  const visited = new Set();
  visited.add(`${start[0]}, ${start[1]}`);
  
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  
  while (queue.length > 0) {
    const {x, y} = queue.shift();
    
    if (x === end[0] && y === end[1]) {
      return dist;
    }
    
    for (const [dx, dy] of directions) {
      const newX = x +dx;
      const newY = y +dy;
      
      const posKey = `${newX}, ${newY}`;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && maze[newX][newY] === 0 && !visited.has(posKey)) {
        visited.add(posKey);
        queue.push({
          x: newX,
          y: newY,
          dist: dist + 1
        })
      }
    }
    
    return -1
  }
}


// 레벨 순서 (Level Order)
// BFS의 기본 원리를 가장 잘 활용하는 패턴입니다.
// 트리의 노드를 레벨(층)별로 묶어서 처리해야 할 때 사용합니다.

// 로직 패턴
// while 루프가 시작될 때 현재 큐의 크기(queue.length)를 먼저 저장합니다.
// 이 크기만큼 for 루프를 돌면서 한 레벨의 노드들만 처리합니다.
// for 루프 안에서 노드를 꺼내고, 그 노드의 자식들을 큐에 넣습니다.
// for 루프가 끝나면 한 레벨의 탐색이 완료된 것이므로, 결과를 최종 배열에 추가합니다.
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue =  [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const currentNode = queue.shift();
      currentLevel.push(currentNode.value);
      
      if (currentLevel.left) {
        queue.push(currentNode.left);
      }
      
      if (currentLevel.right) {
        queue.push(currentNode.right);
      }
    }
    
    result.push(currentLevel);
  }
  
  return result;
}


// 연결 요소 (Connected Components)
// 그래프에서 연결된 노드들의 묶음(컴포넌트)을 찾아야 할 때 사용합니다.
// 모든 노드를 순회하며, 아직 방문하지 않은 노드를 찾으면
// BFS를 시작하여 하나의 컴포넌트를 모두 탐색합니다.

// 로직 패턴
// 모든 노드의 방문 여부를 추적할 visited 배열/객체/Set을 선언합니다.

// 1. 모든 노드를 순회하는 for 루프를 만듭니다.
// 2. for 루프 안에서, 현재 노드가 visited에 없는 노드라면,
// 새로운 컴포넌트를 찾은 것입니다.
// 3. 새로운 컴포넌트의 시작점으로 BFS를 실행하여, 연결된 모든 노드를
// visited에 추가하고 컴포넌트 목록에 저장합니다.
// 4. for 루프가 끝나면 모든 컴포넌트가 찾아집니다.
function findConnectedComponents(graph) {
  const visited = new Set();
  const components = [];
  
  for (const node in graph) {
    if (!visited.has(node)) {
      const component = [];
      const queue = [node];
      visited.add(node);
      
      while (queue.length > 0) {
        const current = queue.shift();
        component.push(current);
        
        for (const neighbor of graph[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      
      components.push(component);
    }
  }
  
  return components;
}