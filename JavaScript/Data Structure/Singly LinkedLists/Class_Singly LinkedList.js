// 시간 복잡도
// insertion - O(1)
// removal - O(1) or O(N)
// searching - O(N)
// access - O(N)

// 삽입 삭제의 경우 배열보다 성능이 좋음
// 삽입 삭제, 임의 접근이 없는경우 단방향 리스트가 좋음

// 배열은 내장된 인덱스가 존재하지만 단방향 리스트는 인덱스가 존재하지 않음
// Why? -

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
  
  // shift 메소드는 아무런 인자를 받지 않음
  shift() {
    // 1. 리스트에 노드가 없을경우 (비어있는 경우) undefined 를 반환
    if (!this.head) return undefined;
    // 2. head 의 next 값을 변수에 저장 (this.head 와 같도록)
    let currentHead = this.head;
    // 3. head 를 현재 head 의 다음 노드를 가리키도록 이동
    this.head = currentHead.next;
    // 4. 길이를 1만큼 감소
    this.length--;
    // tail 을 null 로 만들고 싶다면 조건 추가
    if (this.length === 0) {
      this.tail = null;
    }
    return currentHead;
  }
  
  // unshift 는 추가하려는 값을 인자로 받음
  unshift(val) {
    // 1. 새로운 노드 생성
    let newNode = new Node(val);
    // 2. 헤드가 없다면 헤드와 테일 모두 새로운 노드를 가리키도록 함
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
    return this;
  }
  
  // 인덱스를 인자로 받음
  get(index) {
    // 인덱스가 유효한지 확인해야함
    // 인덱스가 유효하지 않을경우 (음수거나 리스트 길이보다 클경우)
    // null 을 반환해야함
    if (index < 0 || index >= this.length) {
      return null;
    }
    
    let counter = 0;
    let current = this.head;
    
    while (counter !== index) {
      current = current.next;
      counter++;
    }
    return current;
  }
  
  // set 은 인덱스와 업데이트할 값 두개를 인자로 받음
  set(index, val) {
    let foundNode = this.get(index);
    if (foundNode) {
      foundNode.val = val;
      return true;
    }
    return false;
  }
  
  insert(index, val) {
    if (index < 0 || index > this.length) {
      return false;
    }
    
    // 인덱스가 길이와 같은경우
    // !! : 불리언으로 반환
    if (index === this.length) {
      return !!this.push(val);
    }
    
    // 인덱스가 0 일경우
    if (index === 0) {
      return !!this.unshift(val);
    }
    
    let newNode = new Node(val);
    let prev = this.get(index - 1);
    let temp = prev.next;
    prev.next = newNode;
    newNode.next = temp;
    this.length++;
    return true;
  }
  
  // remove
  // 엣지 케이스
  // 인덱스 값이 0보다 작거나, 리스트 길이보다 클 경우 undefined 를 반환한다.
  // 인덱스가 0일 경우 shift 메소드를 사용한다.
  // 그게 아니라면 get 메소드를 사용한다.
  remove(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    
    if (index === 0) {
      return this.shift();
    }
    
    if (index === this.length - 1) {
      return this.pop();
    }
    
    let previousNode = this.get(index - 1);
    let removedNode = previousNode.next;
    previousNode.next = removedNode.next;
    this.length--;
    return removedNode;
  }
  
  // print - 효율과 무관하게 reverse 에서 어떤 일이 발생하는지
  // 확인하기 위한 용도
  print() {
    let arr = [];
    let current = this.head;
    
    while (current) {
      arr.push(current.val);
      current = current.next;
    }
    console.log(arr);
  }
  
  // reverse
  // 헤드를 테일로 설정해야함.
  // 값을 덮어쓰지말고 임시 저장할 변수가 필요함
  reverse() {
    let node = this.head; // 상태 추적을 위한 변수
    this.head = this.tail;
    this.tail = node;
    
    let next;
    let prev = null;
    for (let i = 0; i < this.length; i++) {
      next = node.next;
      node.next = prev;
      prev = node;
      node = next;
    }
    
    return this;
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
firstSinglyLinkedList.pop();

firstSinglyLinkedList.shift();
console.log(firstSinglyLinkedList);

firstSinglyLinkedList.unshift(35);
console.log(firstSinglyLinkedList);

console.log(firstSinglyLinkedList.get(1));