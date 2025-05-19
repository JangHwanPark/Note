// node는 val, value로 불리는 단일 데이터를 저장
// 호출될 다음 노드들에 대한 참조 정보인 next를 저장

class Node {
  constructor(val) {
    this.val = val;
    // 처음에는 다음 노드가 없기때문에 null 로 초기화
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // 추가할 값을 인자로 받음
  push(val) {
    // this.head = val;
    // this.tail = val;
    // this.length++;
    // 2. 새로운 노드를 생성
    const newNode = new Node(val);
    // 3.
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.length++;
    return this;
  }
  
  pop() {
    // 노드가 없을 경우 undefined 반환
    if (!this.head) return undefined;
    
    // 루프를 돌때 두개의 노드 사용
    // 1. current, 2. previous
    // current 노드는 끝가지 순회함
    // previous 는 새로운 tail 이 될 변수
    let current = this.head;
    let previous = current;
    while (current.next) {
      previous = current;
      current = current.next;
    }
    
    this.tail = previous;
    this.tail.next = null;
    this.length--;
    
    // 노드 내 요소가 없다면 head 와 tail 을 null 로 설정
    if (this.length === 0) {
      this.head = null;
      this.tail = null;
    }
    return current;
  }
  
  // 리스트를 따라가는 방법
  traverse() {
    let current = this.head;
    while (current) {
      console.log(current.val);
      current = current.next;
    }
  }
}

// 노드를 활용한 단방향 리스트 정의
const firstNode = new Node(1);
firstNode.next = new Node(2);
firstNode.next.next = new Node(3);
firstNode.next.next.next = new Node(4);
// console.log(firstNode);

const firstSinglyLinkedList = new SinglyLinkedList();
firstSinglyLinkedList.push("Hello");
firstSinglyLinkedList.push("SinglyLinkedList");
firstSinglyLinkedList.push("World");
firstSinglyLinkedList.push("!");
console.log(firstSinglyLinkedList);
firstSinglyLinkedList.pop();
console.log(firstSinglyLinkedList);

firstSinglyLinkedList.pop();
firstSinglyLinkedList.pop();
console.log(firstSinglyLinkedList);
firstSinglyLinkedList.pop();
console.log(firstSinglyLinkedList);