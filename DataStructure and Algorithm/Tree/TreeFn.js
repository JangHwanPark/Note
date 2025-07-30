function Node(value) {
  return {
    value: value,
    children: []
  }
}

const root = Node('root');
const nodeA = Node('nodeA');
const nodeB = Node('nodeB');
const nodeC = Node('nodeC');

root.children.push(nodeA, nodeB);
nodeB.children.push(nodeC);
console.log(root);