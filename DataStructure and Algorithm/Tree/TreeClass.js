class Node {
  constructor(value) {
    // 클래스 생성시 파라미터의 값이 value 에 들어감
    this.value = value;
    // children : 자식노드를 저장하는 공간
    // 새로운 노드는 어떤 자식도 없으며 추후 자식이 생길 수 있기에 빈배열로 초기화
    
    // 빈 배열로 초기화 하지 않을 경우 this.children 이 undefined 상태가 됨
    // addChild 메서드에서 this.children.push()를 호출할때 undefined 에
    // push 메서드를 호출하며 런타임에러가 발생함
    this.children = [];
  }
  
  addChild(node) {
    this.children.push(node);
  }
}

const root = new Node('root');
const nodeA = new Node('nodeA');
const nodeB = new Node('nodeB');
const nodeC = new Node('nodeC');

// root.addChild(nodeA, nodeB);
root.addChild(nodeA);
root.addChild(nodeB);
nodeB.addChild(nodeC);
console.log(root);