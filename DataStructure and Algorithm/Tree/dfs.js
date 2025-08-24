class Node {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(node) {
    this.children.push(node);
  }
}

function dfsRecursive(root) {
  const result = [];
  
  function traverse(node) {
    result.push(node.value);
    
    for (const child of node.children) {
      traverse(child);
    }
  }
  
  if (root) {
    traverse(root);
  }
  
  return result;
}

function dfsStack(root) {
  if (!root) return [];
  
  const result = [];
  // 스택 초기화
  const stack = [root];
  
  while (stack.length > 0) {
    // 스택 가장 위 노드를 꺼냄
    const currentNode = stack.pop();
    // 노드 방문 (값 저장)
    result.push(currentNode.value);
    // 자식 노드를 스택에 추가 (역순으로 추가해야 순서대로 꺼내짐)
    for (let i = currentNode.children.length - 1; i >= 0; i--) {
      stack.push(currentNode.children[i]);
    }
  }
  
  return result;
}

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

// 실행 결과 출력
console.log("DFS (재귀) 탐색 결과:", dfsRecursive(root));
// 예상 출력: [ 'A', 'B', 'E', 'F', 'C', 'D', 'G' ]

console.log("DFS (스택) 탐색 결과:", dfsStack(root));
// 예상 출력: [ 'A', 'B', 'E', 'F', 'C', 'D', 'G' ]