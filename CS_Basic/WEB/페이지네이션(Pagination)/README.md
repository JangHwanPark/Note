## 페이지네이션이란 ?
- 페이지네이션(Pagination)은 긴 목록을 한 쪽씩 나눠 주고받는 방법이다. 클라이언트는 첫 쪽을 받고, 필요하면 다음 쪽을 다시 요청한다
- 다음 쪽이 어디서 시작하는지 정하는 방법은 크게 둘이다. 앞에서 몇 개를 건너뛸지 숫자로 정하는 오프셋(Offset) 방식과, 마지막으로 받은 항목 다음부터 달라고 하는 커서(Cursor) 방식이다
- 두 방식은 목록이 중간에 바뀔 때, 목록 뒷부분의 깊은 쪽을 요청할 때, 정렬 기준에 같은 값이 여러 개 있을 때 서로 다르게 움직인다. 이 노트는 그 차이를 다룬다

두 방식의 기본 모양과 GitHub의 Link 헤더는 [REST API 설계 원칙](../REST%20API%20설계%20원칙(REST%20API%20Design%20Principles)/README.md#페이지네이션-pagination) 노트에서 짧게 봤다. 그 노트는 글 번호를 그대로 커서로 쓰는 단순한 예에서 멈추고, 커서 값을 무엇으로 만드는지와 정렬 기준이 여러 개일 때를 남겨 두었다. 이 노트는 거기서 이어, 데이터베이스(SQLite)로 실제 쿼리를 돌려 보며 더 깊게 본다. 쪽 번호 버튼 같은 화면 이야기는 [React의 페이지네이션 컴포넌트](../../../React/UI%20컴포넌트%20만들기(Building%20UI%20Components)/페이지네이션(Pagination)/README.md) 노트에서 다룬다.

### 페이지네이션 (Pagination)
Page는 책의 쪽이고, Pagination은 쪽 번호를 매기는 일이다.
공학적으로는 결과 목록을 쪽 단위로 끊어 주고받는 것을 말한다. 십만 건을 한 번에 보내면 서버는 다 읽어야 하고 클라이언트는 다 받아야 화면을 그린다. 쪽으로 끊으면 한 번에 오가는 양이 일정해진다.

### 오프셋 (Offset)
사전적 의미는 기준점에서 떨어진 거리다.
페이지네이션에서는 목록 맨 앞에서 몇 개를 건너뛸지를 말한다. `offset=40&limit=20` 은 앞의 40개를 건너뛰고 41번째부터 20개를 달라는 뜻이다. 쪽 번호로 요청하는 `page=3&per_page=20` 도 서버 안에서는 (3 - 1) x 20 = 40개를 건너뛰는 것이라 같은 오프셋 방식이다.

### 커서 (Cursor)와 키셋 (Keyset)
Cursor의 사전적 의미는 위치를 가리키는 표시다. 화면에서 글자를 쓸 자리를 알려 주는 깜빡이는 막대도 커서다.
페이지네이션에서 커서는 지금까지 어디까지 받았는지를 가리키는 값이다. 다음 요청에 이 값을 돌려보내면 서버는 그 다음부터 준다. 데이터베이스에서 결과를 한 행씩 꺼내는 커서(Python sqlite3의 Cursor 객체 등)와는 다른 것이다.

Keyset은 키(Key)의 묶음(Set)이다. 여기서 키는 정렬에 쓰는 열의 값이다. 키셋 방식은 마지막으로 받은 행의 정렬 키 묶음을 기억해 두었다가, 정렬 순서상 그보다 뒤에 오는 행만 고르는 방식이다. 커서 방식이라고 하면 보통 이 키셋 방식을 서버 안에서 쓰고, 정렬 키를 클라이언트에 건넬 때 한 덩어리의 커서 문자열로 감싸 준다. 이 노트에서는 쿼리를 말할 때 키셋, 주고받는 값을 말할 때 커서라고 쓴다.

<br/>

## 줄 서기로 이해하기
번호표를 뽑고 차례대로 줄을 서는 식당에서 잠깐 자리를 비운다고 해 보자. 원래 자리를 앞에서 20번째로 기억하면, 그 사이 앞쪽에 몇 사람이 들어오거나 빠져나가면 20번째는 다른 사람의 자리가 된다. 이것이 오프셋 방식이다. 원래 자리를 내 앞 사람의 번호표 37번으로 기억하면, 37번보다 큰 번호 중 가장 작은 사람 앞에 서면 된다. 앞에서 사람이 늘든 줄든, 37번이 줄을 떠났든 돌아갈 자리는 그대로다. 사람이 아니라 번호라는 값을 기억했기 때문이다. 이것이 커서 방식이다. [REST API 설계 원칙](../REST%20API%20설계%20원칙(REST%20API%20Design%20Principles)/README.md#페이지네이션-pagination) 노트의 책갈피 비유와 같은 생각인데, 여기서는 책갈피가 종이가 아니라 번호라는 점이 중요하다.

줄을 번호표가 아니라 도착한 시각(분 단위) 순서로 선다면 같은 시각에 온 사람이 여럿일 수 있다. 그러면 12시 3분에 온 사람 다음이라는 말로는 그중 누구 다음인지 알 수 없다. 그래서 12시 3분에 온 사람 중 번호표 37번 다음처럼 겹치지 않는 값을 하나 더 붙인다. 뒤에서 볼 정렬 기준 끝에 고유 키를 붙이는 일이 이것이다.

<br/>

## 두 방식은 어떻게 동작할까
### 오프셋 방식의 쿼리
SQL은 데이터베이스에 원하는 데이터를 묻는 언어다. 아래 쿼리에서 ORDER BY는 정렬 순서, LIMIT은 가져올 개수, OFFSET은 건너뛸 개수를 정하고, 다음 절의 WHERE는 고를 조건을 정한다. 오프셋 방식을 SQL로 쓰면 정렬한 뒤 앞의 몇 행을 건너뛰고 몇 행을 고른다.

```sql
SELECT * FROM posts
 ORDER BY id DESC
 LIMIT 3 OFFSET 3;   -- 최신 글부터 3개씩 볼 때의 2쪽
```

SQLite 문서는 OFFSET이 있으면 결과의 앞 M행을 빼고 그 다음 N행을 돌려준다고 설명한다(SELECT 문서 5절). 서버는 쪽 번호만 알면 되므로 만들기 쉽고, 클라이언트는 5쪽에서 바로 9쪽으로 건너뛸 수 있다. 전체 개수를 함께 세면 마지막 쪽이 몇 쪽인지도 알려 줄 수 있다.

### 키셋 방식의 쿼리
마지막으로 받은 행의 정렬 키를 조건으로 넣는다. 1쪽의 마지막 글이 6번이었다면 2쪽은 아래처럼 고른다.

```sql
SELECT * FROM posts
 WHERE id < 6        -- 1쪽 마지막 글보다 뒤(오래된 것)
 ORDER BY id DESC
 LIMIT 3;
```

몇 개를 건너뛸지가 아니라 어떤 값보다 뒤인지로 시작점을 정한다. 그래서 몇 쪽째인지는 서버도 모른다. 이전 쪽의 마지막 행을 알아야 다음 쪽을 만들 수 있으므로, 1쪽에서 바로 9쪽으로 건너뛰는 일은 할 수 없다. 대부분 다음 쪽, 이전 쪽만 오가는 화면(무한 스크롤, 더 보기 버튼)이나 전체를 차례로 읽어 가는 프로그램에서 쓴다.

### 무엇을 얻고 무엇을 잃나
오프셋 방식은 원하는 쪽으로 바로 가고 전체 쪽 수를 보여 주기 쉽다. 그 대신 목록이 바뀌면 쪽 경계가 밀려 같은 항목을 두 번 보거나 건너뛰고, 깊은 쪽일수록 느려진다.

커서 방식은 목록이 바뀌어도 이미 본 항목 다음부터 정확히 이어지고, 정렬에 맞는 인덱스가 있으면 깊은 쪽도 앞쪽과 비슷한 속도로 읽는다. 그 대신 특정 쪽으로 건너뛸 수 없고, 정렬 기준이 바뀌면 커서도 새로 만들어야 하며, 정렬 기준이 여러 개면 조건을 짜는 데 손이 더 간다. 아래 세 절에서 이 차이를 하나씩 실행해 본다.

<br/>

## 목록이 중간에 바뀔 때: 중복과 빠짐
### 왜 생길까
오프셋은 몇 번째인지를 기억한다. 1쪽을 받은 뒤 목록 앞쪽에 항목이 하나 늘면, 그 뒤의 모든 항목이 한 칸씩 뒤로 밀린다. 2쪽은 여전히 4번째부터 시작하므로, 1쪽 마지막에 있던 항목이 밀려 내려와 2쪽 첫 줄에 다시 나온다. 반대로 앞쪽 항목이 하나 지워지면 모두 한 칸씩 당겨 올라오고, 2쪽 첫 줄이었어야 할 항목이 1쪽 범위로 올라가 아무 쪽에도 나오지 않는다.

키셋은 어디까지 봤는지를 값으로 기억한다. 앞쪽에 무엇이 늘거나 줄어도 `id < 6` 이라는 조건이 가리키는 범위는 바뀌지 않는다.

### 실행해 보기
글 8개를 최신순(id 큰 순)으로 3개씩 본다. 1쪽을 받은 뒤 새 글이 올라오는 경우, 1쪽의 글 하나가 지워지는 경우, 커서로 쓴 글 자체가 지워지는 경우를 나눠 실행했다.

```python
# drift.py: 목록이 바뀔 때 오프셋 방식과 커서 방식 비교
import sqlite3

def setup():
    db = sqlite3.connect(':memory:')
    db.execute('CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT)')
    db.executemany('INSERT INTO posts (id, title) VALUES (?, ?)',
                   [(i, f'글{i}') for i in range(1, 9)])  # 글1 ~ 글8
    return db

def by_offset(db, offset, limit=3):
    rows = db.execute('SELECT id FROM posts ORDER BY id DESC LIMIT ? OFFSET ?',
                      (limit, offset)).fetchall()
    return [r[0] for r in rows]

def by_cursor(db, after, limit=3):
    if after is None:
        rows = db.execute('SELECT id FROM posts ORDER BY id DESC LIMIT ?', (limit,))
    else:
        rows = db.execute('SELECT id FROM posts WHERE id < ? ORDER BY id DESC LIMIT ?',
                          (after, limit))
    return [r[0] for r in rows.fetchall()]

print('[새 글이 올라올 때]')
db = setup()
p1 = by_offset(db, 0)
db.execute("INSERT INTO posts (id, title) VALUES (9, '글9')")
p2 = by_offset(db, 3)
print('오프셋 1쪽', p1, '2쪽', p2)

db = setup()
p1 = by_cursor(db, None)
db.execute("INSERT INTO posts (id, title) VALUES (9, '글9')")
p2 = by_cursor(db, p1[-1])
print('커서   1쪽', p1, '2쪽', p2)

print('[1쪽의 글이 지워질 때]')
db = setup()
p1 = by_offset(db, 0)
db.execute('DELETE FROM posts WHERE id = 7')
p2 = by_offset(db, 3)
print('오프셋 1쪽', p1, '2쪽', p2)

db = setup()
p1 = by_cursor(db, None)
db.execute('DELETE FROM posts WHERE id = 7')
p2 = by_cursor(db, p1[-1])
print('커서   1쪽', p1, '2쪽', p2)

print('[커서로 쓴 글 자체가 지워질 때]')
db = setup()
p1 = by_cursor(db, None)
db.execute('DELETE FROM posts WHERE id = 6')
p2 = by_cursor(db, p1[-1])
print('커서   1쪽', p1, '2쪽', p2)
```

Python 3.13.14(SQLite 3.50.4)에서 실행한 결과다.

```text
[새 글이 올라올 때]
오프셋 1쪽 [8, 7, 6] 2쪽 [6, 5, 4]
커서   1쪽 [8, 7, 6] 2쪽 [5, 4, 3]
[1쪽의 글이 지워질 때]
오프셋 1쪽 [8, 7, 6] 2쪽 [4, 3, 2]
커서   1쪽 [8, 7, 6] 2쪽 [5, 4, 3]
[커서로 쓴 글 자체가 지워질 때]
커서   1쪽 [8, 7, 6] 2쪽 [5, 4, 3]
```

새 글 9가 올라오자 오프셋 방식의 2쪽은 6을 또 보여 줬다. 1쪽의 7이 지워지자 이번에는 5가 1쪽 범위로 올라가 2쪽에서 빠졌다. 사용자는 5를 한 번도 보지 못한다. 커서 방식은 두 경우 모두 6 다음인 5부터 이어졌다. 커서로 쓴 6이 지워져도 조건은 `id < 6` 이라는 값 비교라서 그대로 동작한다. 커서가 가리키는 행이 남아 있을 필요가 없다는 점이 키셋 방식의 장점이다.

새로 올라온 9는 커서 방식에서도 보이지 않는다. 이미 지나온 앞쪽에 생긴 항목이기 때문이다. 새 항목을 보려면 처음부터 다시 받거나, 반대 방향(9가 있는 쪽)으로 따로 요청해야 한다.

<br/>

## 깊은 쪽에서 오프셋이 느려지는 이유
### 건너뛴 행도 읽어야 한다
OFFSET은 건너뛸 행을 읽지 않고 넘어가는 기능이 아니다. SQLite 문서는 `LIMIT x OFFSET y` 를 실제로는 `LIMIT x+y` 로 계산한 뒤 앞의 y개를 버리는 것이라고 설명하고, 그래서 OFFSET은 오프셋 값에 비례하는 시간이 든다고 한다(행 값 문서 3.1절). PostgreSQL 문서도 OFFSET으로 건너뛴 행도 서버 안에서 계산해야 하므로 큰 OFFSET은 비효율적일 수 있다고 쓴다(7.6절). 줄 서기로 치면, 앞에서 9만 번째 사람을 찾으려면 앞사람부터 9만 명을 세어 나가야 하는 셈이다.

키셋 방식은 정렬 순서와 같은 인덱스(Index)가 있으면 그 인덱스에서 커서 값의 위치를 바로 찾아 거기서부터 몇 행만 읽는다. 인덱스는 책 뒤의 찾아보기처럼 값 순서대로 정리해 둔 목록이라 처음부터 셀 필요가 없다. SQLite 문서도 적절한 인덱스가 있다는 전제에서 키셋 방식이 OFFSET보다 훨씬 효율적이라고 쓴다(행 값 문서 3.1절). 인덱스가 정렬 기준과 맞지 않으면 키셋 방식도 전체를 훑어 정렬해야 하므로 이 이점이 사라진다. 인덱스의 내부 구조는 TODO로 남긴다.

### 실행 계획과 일의 양 보기
글 10만 개에 (created_at, id) 인덱스를 만들고, 최신순 10개씩 보는 쿼리를 두 방식으로 실행했다. 실행 계획(Query Plan)은 데이터베이스가 쿼리를 어떤 순서와 방법으로 처리할지 세운 계획이다. 먼저 EXPLAIN QUERY PLAN으로 이 계획을 출력해 SQLite가 인덱스를 어떻게 쓰는지 보고, 이어서 쿼리 하나를 처리하며 거친 작은 단계의 수를 셌다. SQLite는 SQL을 작은 명령들로 바꿔 차례로 실행하는데, Python에서 `set_progress_handler(함수, 1)` 을 걸면 명령을 하나 실행할 때마다 함수가 불린다. 이 횟수를 일의 양으로 본다.

```python
# deep.py: 깊은 쪽에서 오프셋 방식이 일을 얼마나 더 하는지
import sqlite3

db = sqlite3.connect(':memory:')
db.execute('CREATE TABLE posts (id INTEGER PRIMARY KEY, created_at INTEGER, title TEXT)')
db.execute('CREATE INDEX idx_posts_created ON posts (created_at, id)')
db.executemany('INSERT INTO posts VALUES (?, ?, ?)',
               [(i, 1_000_000 + i, f'글{i}') for i in range(1, 100_001)])

OFFSET_SQL = 'SELECT id FROM posts ORDER BY created_at DESC, id DESC LIMIT 10 OFFSET ?'
CURSOR_SQL = ('SELECT id FROM posts WHERE (created_at, id) < (?, ?) '
              'ORDER BY created_at DESC, id DESC LIMIT 10')

for sql, args in [(OFFSET_SQL, (90_000,)), (CURSOR_SQL, (1_010_001, 10_001))]:
    for row in db.execute('EXPLAIN QUERY PLAN ' + sql, args):
        print(row[3])

# 가상 머신 명령을 하나 실행할 때마다 호출되는 진행 콜백으로 일의 양을 센다
steps = 0
def tick():
    global steps
    steps += 1
    return 0
db.set_progress_handler(tick, 1)

def run(sql, args):
    global steps
    steps = 0
    rows = [r[0] for r in db.execute(sql, args).fetchall()]
    return rows, steps

print('[같은 쪽을 두 방식으로]')
for offset in [0, 1_000, 10_000, 90_000]:
    rows, s = run(OFFSET_SQL, (offset,))
    print(f'오프셋 {offset:>6}: 첫 행 {rows[0]:>6}, 명령 {s:>8}')
for after_id in [100_001, 99_001, 90_001, 10_001]:
    # 앞 쪽 마지막 행의 정렬 키 (created_at, id) 를 커서로 쓴다
    rows, s = run(CURSOR_SQL, (1_000_000 + after_id, after_id))
    print(f'커서   id<{after_id:>6}: 첫 행 {rows[0]:>6}, 명령 {s:>8}')
```

Python 3.13.14(SQLite 3.50.4), Windows 11에서 실행한 결과다. 세 번 실행해 같은 출력이 나왔다.

```text
SCAN posts USING COVERING INDEX idx_posts_created
SEARCH posts USING COVERING INDEX idx_posts_created (created_at<?)
[같은 쪽을 두 방식으로]
오프셋      0: 첫 행 100000, 명령       60
오프셋   1000: 첫 행  99000, 명령     2060
오프셋  10000: 첫 행  90000, 명령    20060
오프셋  90000: 첫 행  10000, 명령   180060
커서   id<100001: 첫 행 100000, 명령      105
커서   id< 99001: 첫 행  99000, 명령      113
커서   id< 90001: 첫 행  90000, 명령      113
커서   id< 10001: 첫 행  10000, 명령      113
```

실행 계획부터 보자. 두 쿼리 모두 같은 인덱스를 쓰지만 오프셋 쿼리는 SCAN, 키셋 쿼리는 SEARCH다. SQLite 문서는 SCAN을 표 전체를 훑는 것(인덱스가 정한 순서로 모든 행을 도는 경우 포함), SEARCH를 표의 행 일부만 들르는 것이라고 설명한다(EXPLAIN QUERY PLAN 문서 1.1절). 여기서 SEARCH 뒤의 `(created_at<?)` 는 이 조건으로 인덱스 안의 시작 위치를 찾았다는 표시다. COVERING INDEX는 필요한 열(id)이 인덱스 안에 다 있어서 표 본체까지 가지 않았다는 표시인데, 이 노트에서는 깊게 다루지 않는다. 같은 문서는 이 출력 형식이 SQLite 버전에 따라 바뀔 수 있다고 적고 있다.

명령 수를 보면 차이가 숫자로 드러난다. 첫 행을 보면 두 방식이 같은 쪽을 읽었다는 것을 알 수 있다. 오프셋 방식은 건너뛰는 행이 1,000개 늘 때마다 명령이 2,000개씩 늘었다. 9만 개를 건너뛴 쪽은 첫 쪽보다 3천 배 많은 일을 했다. 키셋 방식은 맨 앞 쪽이 105개, 나머지는 9만 번째 근처에서 시작해도 113개로 거의 같았다. 앞의 몇 쪽은 두 방식 차이가 거의 없고, 뒤로 갈수록 벌어진다.

이 명령 수는 SQLite 3.50.4에서 센 값이고 다른 버전에서는 다를 수 있다. SQLite 문서는 진행 콜백 사이의 명령 수를 대략적인 값이라고 적고 있어서, 정확한 명령 개수라기보다 일의 양을 비교하는 지표로 봐야 한다. 실제 걸린 시간은 재지 않았다.

<br/>

## 정렬 기준이 여러 개일 때
### 동점이 있으면 키셋 조건이 행을 빠뜨린다
앞의 예는 id처럼 겹치지 않는 값 하나로 정렬했다. 실제 목록은 가격순, 작성 시각순처럼 같은 값이 여러 개 나올 수 있는 열로 정렬하는 일이 많다. 이때 정렬 열 하나만 커서로 쓰면 문제가 생긴다. 1쪽이 가격 500인 상품에서 끝났다면 2쪽 조건은 `price > 500` 이 되는데, 아직 보지 않은 가격 500짜리 상품이 남아 있었다면 그 상품은 영영 나오지 않는다. 줄 서기 비유에서 같은 시각에 온 사람이 여럿인 상황이다.

### 고유 키를 끝에 붙인다
해결은 정렬 기준 끝에 겹치지 않는 열(보통 기본 키 id)을 하나 더 붙이는 것이다. 이 열을 동점을 깨는 열이라는 뜻으로 타이브레이커(Tiebreaker)라고 부른다. Tie는 동점, Break는 깨다라는 뜻이다. `ORDER BY price, id` 로 정렬하면 모든 행의 순서가 하나로 정해지고, 커서에는 마지막 행의 (가격, id)를 함께 담는다.

이 일은 오프셋 방식에도 필요하다. SQLite 문서는 ORDER BY가 없으면 행이 돌아오는 순서는 정해져 있지 않다고 하고(SELECT 문서 4절), PostgreSQL 문서는 LIMIT을 쓸 때는 결과를 하나의 순서로 고정하는 ORDER BY를 쓰라고 한다. 그렇지 않으면 LIMIT과 OFFSET 값에 따라 실행 계획이 달라져 쪽마다 일관되지 않은 결과가 나올 수 있다고 쓴다(7.6절). 동점끼리의 순서가 쪽마다 바뀌면 오프셋 방식도 같은 행을 두 번 보거나 빠뜨릴 수 있다.

### 키셋 조건 쓰기
(가격, id) 두 열로 정렬했을 때 마지막 행 (500, 2)보다 뒤라는 조건은 두 가지로 쓸 수 있다. 하나는 행 값(Row Value) 비교다. SQLite 문서는 두 행 값을 왼쪽 값부터 차례로 비교한다고 설명한다(행 값 문서 2.1절). 사전에서 첫 글자가 같으면 둘째 글자를 보는 것과 같은 순서다. SQLite는 3.15.0부터 행 값을 지원한다(행 값 문서 4절).

```sql
WHERE (price, id) > (500, 2)
```

다른 하나는 같은 뜻을 풀어 쓴 모양이다. 행 값 비교를 지원하지 않는 데이터베이스에서도 쓸 수 있다.

```sql
WHERE price > 500 OR (price = 500 AND id > 2)
```

정렬 방향이 섞이면 풀어 쓴 모양을 써야 한다. 비싼 순(price DESC)으로 보되 같은 가격은 id 작은 순(id ASC)으로 보는 경우, 가격은 더 작아야 뒤이고 id는 더 커야 뒤다. 행 값 비교는 모든 열을 같은 방향으로 비교하므로 이 조건을 그대로는 나타낼 수 없다.

```sql
WHERE price < 1000 OR (price = 1000 AND id > 4)
```

### 실행해 보기
상품 6개를 2개씩 본다. 가격 500인 상품이 셋, 1000인 상품이 둘이다.

```python
# ties.py: 정렬 기준에 동점이 있을 때
import sqlite3

db = sqlite3.connect(':memory:')
db.execute('CREATE TABLE goods (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
db.executemany('INSERT INTO goods VALUES (?, ?, ?)', [
    (1, '연필', 500), (2, '지우개', 500), (3, '자', 500),
    (4, '공책', 1000), (5, '풀', 1000), (6, '가위', 2000),
])

def show(rows):
    return [f'{name}({price})' for _, name, price in rows]

# 1) 가격만 커서로 쓰면 동점인 상품이 빠진다
p1 = db.execute('SELECT id, name, price FROM goods ORDER BY price, id LIMIT 2').fetchall()
last = p1[-1]
p2 = db.execute('SELECT id, name, price FROM goods WHERE price > ? ORDER BY price, id LIMIT 2',
                (last[2],)).fetchall()
print('가격만     1쪽', show(p1), '2쪽', show(p2))

# 2) (가격, id) 를 함께 커서로 쓰면 빠지지 않는다
p2 = db.execute('SELECT id, name, price FROM goods WHERE (price, id) > (?, ?) '
                'ORDER BY price, id LIMIT 2', (last[2], last[0])).fetchall()
print('가격+id    1쪽', show(p1), '2쪽', show(p2))

# 3) 같은 조건을 풀어 쓴 모양 (행 값 비교를 못 쓸 때, 방향이 섞일 때)
p2 = db.execute('SELECT id, name, price FROM goods '
                'WHERE price > ? OR (price = ? AND id > ?) '
                'ORDER BY price, id LIMIT 2', (last[2], last[2], last[0])).fetchall()
print('풀어 쓴 모양 2쪽', show(p2))

# 4) 가격은 비싼 순, 같은 가격은 id 작은 순 (방향이 섞인 경우)
q1 = db.execute('SELECT id, name, price FROM goods ORDER BY price DESC, id ASC LIMIT 2').fetchall()
l = q1[-1]
q2 = db.execute('SELECT id, name, price FROM goods '
                'WHERE price < ? OR (price = ? AND id > ?) '
                'ORDER BY price DESC, id ASC LIMIT 2', (l[2], l[2], l[0])).fetchall()
print('비싼 순    1쪽', show(q1), '2쪽', show(q2))
```

Python 3.13.14(SQLite 3.50.4)에서 실행한 결과다.

```text
가격만     1쪽 ['연필(500)', '지우개(500)'] 2쪽 ['공책(1000)', '풀(1000)']
가격+id    1쪽 ['연필(500)', '지우개(500)'] 2쪽 ['자(500)', '공책(1000)']
풀어 쓴 모양 2쪽 ['자(500)', '공책(1000)']
비싼 순    1쪽 ['가위(2000)', '공책(1000)'] 2쪽 ['풀(1000)', '연필(500)']
```

가격만 커서로 쓰자 가격 500인 자가 사라졌다. (가격, id)를 함께 쓰면 자부터 이어지고, 풀어 쓴 조건도 같은 결과를 냈다. 방향이 섞인 마지막 경우도 공책(1000, id 4) 다음인 풀(1000, id 5)부터 이어졌다.

정렬 열에 NULL이 있으면 이 조건들이 그대로 통하지 않는다. SQLite 문서는 행 값 비교에서 NULL을 모르는 값으로 보고, 결과가 참일 수도 거짓일 수도 있으면 비교 결과를 NULL로 둔다고 설명한다(행 값 문서 2.1절). WHERE 조건이 NULL이면 그 행은 고르지 않으므로 NULL이 든 행이 빠질 수 있다. 데이터베이스마다 NULL을 정렬 순서의 어디에 두는지도 다르다. NULL이 섞인 정렬 열을 커서로 다루는 방법은 TODO로 남긴다.

<br/>

## 커서 값 만들기
### 무엇을 담을까
키셋 조건에 넣을 값, 곧 마지막 행의 정렬 키 전부를 담는다. 앞 절의 가격순이라면 (가격, id) 두 값이다. 정렬 열 하나만 담으면 앞에서 본 동점 문제가 그대로 생기므로, 타이브레이커까지 빠짐없이 넣는다.

정렬 키 대신 마지막 항목의 ID만 커서로 주는 API도 있다. Stripe API는 목록을 최신순으로 주고, `starting_after` 에 이전 쪽 마지막 객체의 ID를 넣으면 그 다음 쪽을 준다고 설명한다. 서버가 그 ID로 정렬 위치를 어떻게 찾는지는 문서에 나와 있지 않다. 정렬 키를 직접 담은 커서와 달리, 그 ID의 객체가 지워졌을 때 어떻게 되는지도 확인하지 못했다(확인 필요).

### 한 덩어리 문자열로 감싼다
정렬 키를 `?price=500&id=2` 처럼 따로 노출하지 않고, 하나의 문자열로 묶어 넘기는 경우가 많다. 흔한 모양은 JSON으로 만든 뒤, 주소에 그대로 넣을 수 있도록 URL에 안전한 Base64로 바꾸는 것이다. Base64는 이름 그대로 64개의 글자(영문 대소문자, 숫자, 기호 두 개)를 기수(base)로 삼아 바이트를 적는 방식인데, URL용 변형은 주소에서 의미가 있는 `+` 와 `/` 대신 `-` 와 `_` 를 쓴다. 길이를 맞추려고 끝에 붙는 `=` 는 쿼리스트링에서 이름과 값을 가르는 기호와 겹치므로 떼어 냈다. 주소에 넣을 때 어떤 글자를 바꿔야 하는지는 [퍼센트 인코딩](../퍼센트%20인코딩(Percent-Encoding)/README.md) 노트에 정리했다.

```python
# cursor_token.py: 마지막 행의 정렬 키를 커서 문자열로 만들고 되돌리기
import base64
import json

def encode_cursor(price, id_):
    raw = json.dumps({'price': price, 'id': id_}, separators=(',', ':'))
    return base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')

def decode_cursor(token):
    padded = token + '=' * (-len(token) % 4)
    return json.loads(base64.urlsafe_b64decode(padded))

token = encode_cursor(500, 2)
print(token)
print(decode_cursor(token))
print(f'GET /goods?limit=2&after={token}')
```

Python 3.13.14에서 실행한 결과다.

```text
eyJwcmljZSI6NTAwLCJpZCI6Mn0
{'price': 500, 'id': 2}
GET /goods?limit=2&after=eyJwcmljZSI6NTAwLCJpZCI6Mn0
```

### 왜 속을 감출까
한 덩어리로 감싸는 이유는 클라이언트가 커서의 속을 보고 의지하지 않게 하려는 것이다. 클라이언트는 받은 커서를 다음 요청에 그대로 돌려주기만 하면 된다. 그래야 서버가 나중에 정렬 키를 바꾸거나 커서 안에 다른 정보를 넣어도 클라이언트가 깨지지 않는다.

Google의 API 설계 지침 AIP-158은 페이지 토큰(이 노트의 커서)이 URL에 안전하면서 속을 알 수 없어야 하고, 사용자가 풀어 읽을 수 없어야 한다고 쓴다. 풀 수 있으면 사용자가 풀어 쓰게 된다는 이유를 들고, Base64로 바꾸기만 하는 것은 충분히 감춘 것이 아니라고 덧붙인다. 위의 예도 Base64를 되돌리면 바로 `{"price":500,"id":2}` 가 보인다. 그래서 실제 서비스에서는 커서를 암호화해 속을 감추거나, 서명을 붙여 클라이언트가 값을 고쳐 보내면 서버가 알아채게 만들기도 한다. 이 구현은 TODO로 남긴다.

### 커서는 처음 요청의 조건에 묶인다
커서는 특정 정렬과 필터 아래에서의 위치다. 가격순 목록에서 받은 커서를 최신순 목록에 쓰면 엉뚱한 위치가 된다. AIP-158은 다음 쪽을 요청할 때 토큰 외의 다른 매개변수는 토큰을 받았던 요청과 같아야 한다고 쓴다. 다만 쪽 크기(page_size)는 예외로, 바꿔 보내면 서비스가 새 크기를 따라야 한다고 한다. 같은 지침은 페이지 토큰을 내부 데이터베이스에 저장해 두는 API라면 토큰을 보낸 뒤 적당한 시간이 지나 만료시킬 수 있다고 하고(MAY), 기준으로 3일 정도를 든다.

### 끝을 알리는 법
마지막 쪽에 닿았다는 것도 알려야 한다. AIP-158은 목록 끝에 닿으면 다음 쪽 토큰을 비워 두라고 한다. Stripe는 응답의 `has_more` 로 뒤에 항목이 더 있는지 알린다. 서버가 이것을 알아내는 흔한 방법은 limit보다 한 행 더 읽어 보는 것이다. 3개를 줄 때 4개를 읽어서 4번째가 있으면 다음 쪽이 있다고 알리고, 4번째 행은 버린다. 전체 개수를 세는 COUNT보다 훨씬 적게 읽는다.

<br/>

## 다음 쪽 주소 알려 주기: Link 헤더
### 링크 (Link)
Link의 사전적 의미는 사슬의 고리, 연결이다.
RFC 8288은 링크를 두 자원 사이의 종류가 있는 연결로 정의하고, 링크가 출발점(link context), 관계 종류(link relation type), 도착점(link target)으로 이루어지고, 필요하면 대상 속성(target attributes)을 덧붙인다고 쓴다(2절). 페이지네이션에 대면, 지금 받은 쪽이 출발점, 다음 쪽이라는 관계가 관계 종류, 다음 쪽 주소가 도착점이다.

### 헤더 모양
RFC 8288은 이 링크를 HTTP의 Link 헤더에 `<주소>; rel="관계"` 모양으로 싣는 문법을 정한다(3절). 관계 이름은 IANA(인터넷 번호와 이름을 관리하는 기관)의 링크 관계 목록에 등록해 함께 쓴다(2.1.1절). 이 목록에는 next(다음), prev(이전), first(처음), last(마지막)가 등록되어 있다(2026년 10월 확인). 커서 방식이라면 다음 쪽 주소 안에 커서를 넣어 주면 된다.

```http
Link: </goods?limit=2&after=eyJwcmljZSI6NTAwLCJpZCI6Mn0>; rel="next"
```

위는 앞 절의 커서로 만든 예시이고, 실제 서버에 보내 확인한 응답은 아니다. 클라이언트는 주소를 직접 조립하지 않고 `rel="next"` 인 주소를 따라가기만 하면 된다. 서버가 커서 모양이나 매개변수 이름을 바꿔도 클라이언트 코드는 그대로다.

GitHub REST API는 Link 헤더(문서 표기는 소문자 link)에 prev, next, first, last 주소를 담고, 엔드포인트에 따라 page, before/after, since 매개변수 중 하나로 쪽을 나눈다고 설명한다. 또 마지막 쪽 주소를 계산할 수 없으면 last 링크를 넣지 않는다고 쓴다(2026년 10월 확인). 앞에서 본 것처럼 커서 방식은 이전 쪽을 거쳐야 다음 쪽 위치가 정해지므로 마지막 쪽 주소를 미리 만들기 어렵다. 다만 GitHub가 어떤 엔드포인트에서 last를 빼는지는 문서에 나와 있지 않아 확인 필요로 둔다.

<br/>

## 어느 방식을 고를까
쪽 번호를 눌러 원하는 쪽으로 바로 가야 하고, 목록이 자주 바뀌지 않으며, 사람들이 앞쪽 몇 쪽만 주로 보는 목록이라면 오프셋 방식으로 충분하다. 게시판 관리 화면이나 검색 결과처럼 대부분 앞쪽에서 끝나는 목록이 여기에 든다.

새 항목이 계속 올라오는 피드, 더 보기나 무한 스크롤로 끝까지 내려가는 목록, 프로그램이 전체를 차례로 읽어 가는 동기화 작업이라면 커서 방식이 맞다. 중복과 빠짐이 없고, 정렬에 맞는 인덱스가 있으면 깊은 쪽도 느려지지 않는다.

어느 쪽이든 정렬 기준 끝에 고유 키를 붙여 순서를 하나로 고정하는 일은 같다.

<br/>

## 참고 자료
- SQLite, [The SELECT statement](https://www.sqlite.org/lang_select.html) 4절(The ORDER BY clause), 5절(The LIMIT clause)
- SQLite, [Row Values](https://www.sqlite.org/rowvalue.html) 2.1절(Row Value Comparisons), 3.1절(Scrolling Window Queries), 4절(Backwards Compatibility)
- SQLite, [Query Progress Callbacks](https://www.sqlite.org/c3ref/progress_handler.html)
- SQLite, [EXPLAIN QUERY PLAN](https://www.sqlite.org/eqp.html) 1절, 1.1절(Table and Index Scans)
- Python 3.13 문서, [sqlite3](https://docs.python.org/3.13/library/sqlite3.html) Connection.set_progress_handler
- PostgreSQL 18 문서, [7.6. LIMIT and OFFSET](https://www.postgresql.org/docs/18/queries-limit.html)
- RFC 8288, [Web Linking](https://www.rfc-editor.org/rfc/rfc8288.html) 2절(Links), 2.1.1절(Registered Relation Types), 3절(Link Serialisation in HTTP Headers)
- IANA, [Link Relations](https://www.iana.org/assignments/link-relations/link-relations.xhtml) next, prev, first, last 항목 (2026년 10월 확인)
- Google AIP-158, [Pagination](https://google.aip.dev/158) (2026년 10월 확인)
- Stripe API Reference, [Pagination](https://docs.stripe.com/api/pagination) (2026년 10월 확인)
- GitHub Docs, [Using pagination in the REST API](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api) (2026년 10월 확인)

<br/>

## 더 볼 것 (TODO)
- 커서 방식에서 이전 쪽으로 가기 (조건과 정렬 방향을 뒤집어 읽은 뒤 다시 뒤집기)
- 커서 위조 막기 (서명, 암호화)와 만료 처리
- NULL이 섞인 정렬 열을 커서로 다루기 (NULLS FIRST, NULLS LAST)
- 인덱스의 내부 구조 (B-트리)와 커버링 인덱스, 정렬 기준에 맞는 인덱스 고르기
- 전체 개수 세기(COUNT)의 비용과 근사치로 보여 주기
- 다른 데이터베이스(PostgreSQL, MySQL)에서 같은 쿼리의 실행 계획 비교, 실제 걸린 시간 측정
- 쪽 번호 UI와 무한 스크롤에서 커서를 다루는 법 (프론트엔드 관점)
