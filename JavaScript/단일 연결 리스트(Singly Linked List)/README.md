## 단일 연결 리스트란 ?
- 값을 담은 노드(Node)들이 다음 노드에 대한 참조(Reference) `next` 로 한 줄로 이어진 자료구조. 참조는 값 자체가 아니라 그 값이 있는 곳을 가리키는 정보다
- 첫 노드(`head`)에서 출발해 `next` 를 따라가야만 뒤의 노드에 닿는다. 참조가 다음 쪽 한 방향으로만 있어서 단일(단방향) 연결 리스트라고 한다
- 맨 앞에 넣고 빼는 일은 빠르지만, n번째 값을 찾으려면 앞에서부터 세어 가야 한다
- 구현 코드는 같은 폴더의 [SinglyLinkedList.js](./SinglyLinkedList.js)다

### 연결 리스트 (Linked List)
link의 사전적 의미는 사슬의 고리, 연결이다. list는 목록이다.
자료구조에서는 고리처럼 서로 이어진 노드들로 만든 목록을 말한다. 값을 붙여 놓는 것으로 순서를 정하는 대신, 각 노드가 다음 노드의 참조를 들고 있어서 순서가 이어진다.

### 노드 (Node)
사전적 의미는 마디, 매듭이다.
자료구조에서는 값 하나와 다른 노드로 가는 연결을 함께 담은 단위를 말한다. 여기서는 값 `val` 과 다음 노드를 가리키는 `next` 를 갖는다.

보물찾기 쪽지와 같다. 쪽지마다 내용(값)과 다음 쪽지가 숨겨진 곳(`next`)이 적혀 있다. 세 번째 쪽지를 보려면 첫 쪽지부터 차례로 따라가야 하고, 맨 앞에 새 쪽지를 끼우려면 새 쪽지에 원래 첫 쪽지의 위치만 적으면 된다.

<br/>

## 왜 인덱스가 없을까
자료구조로서의 배열(C 언어의 배열처럼)은 값이 메모리에 순서대로 붙어 있어서, 시작 위치에 번호만큼 더하면 바로 n번째 값의 자리를 알 수 있다. 자바스크립트 배열이 메모리에 실제로 어떻게 놓이는지는 엔진마다 다르지만(확인 필요), 번호로 바로 꺼낼 수 있다는 점은 같다. 연결 리스트의 노드는 각자 따로 만들어진 객체이고, 어디 있는지는 앞 노드의 `next` 만 안다. 그래서 번호로 바로 갈 방법이 없고, `head` 에서 `next` 를 n번 따라가야 한다.

<br/>

## 구조
```js
class Node {
  constructor(val) {
    this.val = val;
    this.next = null; // 처음에는 다음 노드가 없다
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;  // 첫 노드
    this.tail = null;  // 마지막 노드
    this.length = 0;
  }
}
```

`tail` 을 따로 들고 있는 이유는 맨 뒤에 넣을 때 끝까지 따라가지 않고 바로 붙이기 위해서다.

<br/>

## 연산과 시간 복잡도
| 메서드 | 하는 일 | 시간 복잡도 |
| --- | --- | --- |
| `push(val)` | 맨 뒤에 추가 | O(1), `tail` 에 바로 붙인다 |
| `pop()` | 맨 뒤를 꺼냄 | O(N), 새 `tail` 이 될 바로 앞 노드를 찾으려고 처음부터 따라간다 |
| `shift()` | 맨 앞을 꺼냄 | O(1) |
| `unshift(val)` | 맨 앞에 추가 | O(1) |
| `get(index)` | n번째 노드 찾기 | O(N) |
| `set(index, val)` | n번째 값 바꾸기 | O(N), `get` 을 쓴다 |
| `insert(index, val)` | n번째 자리에 넣기 | O(N), 바로 앞 노드를 `get` 으로 찾는다 |
| `remove(index)` | n번째 노드 빼기 | O(N), 바로 앞 노드를 `get` 으로 찾는다 |
| `reverse()` | 순서 뒤집기 | O(N) |

배열보다 삽입과 삭제가 빠르다고들 하지만, 그건 맨 앞에서 넣고 뺄 때 이야기다. 배열은 맨 앞에 넣으면 뒤의 값을 모두 한 칸씩 밀어야 해서 O(N)이고, 연결 리스트는 `head` 만 바꾸면 되어 O(1)이다. 중간 자리에 넣고 빼는 일은 연결 리스트도 그 자리까지 따라가야 하므로 O(N)이다. 그래서 맨 앞에서 자주 넣고 빼고, n번째 값을 바로 꺼낼 일이 없을 때 단일 연결 리스트가 어울린다.

### pop이 앞 노드를 찾는 이유
`next` 가 다음 쪽만 가리켜서 `tail` 에서 뒤로 한 칸 갈 수 없다. 마지막 노드를 떼어 내면 그 앞 노드가 새 `tail` 이 되어야 하는데, 그 노드를 찾으려면 `head` 부터 `current`, `previous` 두 변수로 함께 따라가야 한다. 노드가 하나뿐이면 꺼낸 뒤 `head` 와 `tail` 을 모두 `null` 로 되돌린다.

### insert와 remove
`insert` 는 0번째면 `unshift`, 맨 끝이면 `push` 를 쓰고, 나머지는 바로 앞 노드를 찾아 `next` 를 바꿔 끼운다.

```js
const prev = this.get(index - 1);
const temp = prev.next;
prev.next = newNode;  // 앞 노드가 새 노드를 가리키고
newNode.next = temp;  // 새 노드가 원래 다음 노드를 가리킨다
```

`remove` 도 같은 방식으로 앞 노드의 `next` 를 빼낼 노드의 다음 노드로 바꿔, 빼낼 노드를 건너뛰게 한다.

### reverse
`head` 와 `tail` 을 먼저 맞바꾼 뒤, 노드를 하나씩 지나가며 `next` 가 가리키는 방향을 뒤집는다. 다음 노드를 잃어버리지 않도록 `next` 를 바꾸기 전에 `next` 에 미리 담아 둔다.

```js
let node = this.head;
this.head = this.tail;
this.tail = node;

let next;
let prev = null;
for (let i = 0; i < this.length; i++) {
  next = node.next;  // 다음 노드를 먼저 기억해 두고
  node.next = prev;  // 참조를 앞 노드 쪽으로 돌린 뒤
  prev = node;       // 한 칸씩 앞으로 간다
  node = next;
}
```

`[1, 2, 3, 4]` 를 뒤집으면 `[4, 3, 2, 1]` 이 되고, 새 `tail` 인 1의 `next` 는 `null` 이 된다.

<br/>

## 구현 코드에서 발견한 버그: unshift
`SinglyLinkedList.js` 의 `unshift` 는 리스트를 고리 모양으로 망가뜨린다.

```js
unshift(val) {
  let newNode = new Node(val);
  if (!this.head) {
    this.head = newNode;
    this.tail = this.head;
  } else {
    newNode.next = this.head;
    this.head = newNode;
  }
  newNode.next = this.head; // 문제: 이 시점의 this.head는 이미 newNode다
  this.head = newNode;
  this.length++;
  return this;
}
```

`if`/`else` 안에서 이미 `head` 를 새 노드로 바꿨는데, 그 아래 두 줄이 한 번 더 실행된다. 이때 `this.head` 는 새 노드 자신이라 `newNode.next = newNode` 가 된다. 새 노드가 자기 자신을 가리키게 되고, 원래 이어져 있던 노드들은 끊어진다.

실행해 보면 `[1, 2]` 에 `unshift(0)` 을 한 뒤 `head` 부터 따라가면 0만 끝없이 나온다. `length` 는 3인데 1과 2에는 닿을 수 없다. 빈 리스트에 `unshift(9)` 를 해도 9가 자기 자신을 가리킨다. 파일 아래쪽 예시도 `unshift(35)` 뒤 `get(1)` 이 값이 `'SinglyLinkedList'` 인 노드가 아니라 값이 35인 노드를 돌려준다. `get` 은 값이 아니라 노드를 돌려주므로 값은 `.val` 로 읽는다.

`if`/`else` 아래의 두 줄을 지우면 된다.

```js
unshift(val) {
  const newNode = new Node(val);
  if (!this.head) {
    this.head = newNode;
    this.tail = this.head;
  } else {
    newNode.next = this.head;
    this.head = newNode;
  }
  this.length++;
  return this;
}
```

고친 뒤에는 `[1, 2]` 에 `unshift(0)` 을 하면 `[0, 1, 2]` 가 되고, 파일 예시의 `get(1).val` 도 `'SinglyLinkedList'` 가 된다. `insert(0, val)` 은 `unshift` 를 쓰므로 이 버그가 그대로 이어진다. 원래 파일에서 `['a', 'b']` 에 `insert(0, 'z')` 를 하면 `head` 가 자기 자신을 가리켰다.

### 덧붙여 볼 점: shift가 꺼낸 노드
`shift` 가 돌려주는 노드는 `next` 가 여전히 다음 노드를 가리킨다. 리스트 동작에는 문제가 없지만, 꺼낸 노드를 받아 쓰는 쪽에서 `next` 를 따라가면 리스트 안으로 다시 들어갈 수 있다. 꺼낸 노드를 리스트와 완전히 떼어 놓으려면 돌려주기 전에 `currentHead.next = null` 을 넣는다. `pop` 은 마지막 노드라 `next` 가 이미 `null` 이다.

`push`, `pop`, `shift`, `get`, `set`, `remove`, `reverse` 와 0번째가 아닌 자리의 `insert` 는 Node.js v22.13.0에서 원래 파일 그대로 실행해 기대한 결과가 나오는 것을 확인했다. `unshift` 와 `insert(0, val)` 은 위 버그 때문에 원래 파일로는 결과가 틀렸다.

<br/>

## 더 볼 것 (TODO)
- 이중 연결 리스트(Doubly Linked List)로 pop을 O(1)로 만들기
- 연결 리스트로 스택과 큐 만들기
