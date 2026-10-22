## 조인이란 ?
- 두 테이블의 행을 조건에 맞춰 이어 붙여 하나의 결과로 조회하는 SQL 문법
- 어느 쪽 행을 남기느냐에 따라 INNER, LEFT, RIGHT, FULL 조인으로 나뉜다
- 종류를 적지 않고 `JOIN` 만 쓰면 `INNER JOIN` 으로 동작한다

### 조인 (Join)
사전적 의미는 잇다, 결합하다이다.
데이터베이스에서는 따로 저장한 테이블을 공통 열(예: 사용자 ID)로 다시 이어 붙이는 일을 말한다. 테이블을 나눠 저장하는 이유는 같은 정보를 여러 곳에 중복해 두지 않기 위해서인데, 조회할 때는 다시 합쳐 봐야 하므로 조인이 필요하다.

출석부와 성적표를 학번으로 맞대어 한 장으로 보는 것과 같다. 어느 쪽 명단을 기준으로 남길지에 따라 빠지는 사람이 달라진다.

<br/>

## 예시 데이터
아래 결과는 Node.js 22.13.0의 내장 `node:sqlite`(SQLite 3.47.2)에서 실행한 값이다. `User` 는 PostgreSQL 같은 DB에서 예약어라 테이블 이름을 `users` 로 썼다.

```sql
create table users (uid int, uname text);
create table orders (oid int, uid int);

insert into users values (1, 'kim'), (2, 'lee'), (3, 'park');
insert into orders values (10, 1), (11, 1), (12, 2), (13, 4);
```

park(3)은 주문이 없고, 주문 13은 없는 사용자(4)를 가리킨다. 이 두 행이 조인 종류마다 어떻게 다뤄지는지가 차이의 핵심이다.

SQL은 `ORDER BY` 가 없으면 결과 행의 순서를 보장하지 않는다. 아래 예시는 결과를 비교하기 쉽게 모두 `ORDER BY` 를 붙여 실행했다.

<br/>

## INNER JOIN
두 테이블 모두에서 조건이 맞는 행만 남긴다.

```sql
select u.uid, u.uname, o.oid
from users as u
inner join orders as o on u.uid = o.uid
order by u.uid, o.oid;
```

```text
uid | uname | oid
1   | kim   | 10
1   | kim   | 11
2   | lee   | 12
```

kim은 주문이 두 개라 두 행으로 나온다. 주문 없는 park와 사용자 없는 주문 13은 빠진다. `inner` 를 빼고 `join` 만 써도 같은 결과가 나왔다.

<br/>

## LEFT JOIN
왼쪽 테이블의 행은 모두 남기고, 오른쪽에 맞는 행이 없으면 오른쪽 열을 NULL로 채운다.

```sql
select u.uid, o.oid
from users as u
left join orders as o on u.uid = o.uid
order by u.uid, o.oid;
```

```text
uid | oid
1   | 10
1   | 11
2   | 12
3   | NULL
```

이 성질을 이용하면 주문이 한 번도 없는 사용자를 찾을 수 있다.

```sql
select u.uid, u.uname
from users as u
left join orders as o on u.uid = o.uid
where o.oid is null;
-- 3 | park
```

<br/>

## RIGHT JOIN
LEFT JOIN과 반대로 오른쪽 테이블의 행을 모두 남긴다. 테이블 순서를 바꾼 LEFT JOIN과 결과가 같아서, 읽기 쉽게 LEFT JOIN으로 통일해 쓰는 경우가 많다.

```sql
select u.uid, o.oid
from users as u
right join orders as o on u.uid = o.uid
order by o.oid;
```

```text
uid  | oid
1    | 10
1    | 11
2    | 12
NULL | 13
```

SQLite는 3.39.0(2022-06-25)부터 RIGHT JOIN과 FULL OUTER JOIN을 지원한다([릴리스 노트](https://www.sqlite.org/releaselog/3_39_0.html)). 위 결과는 3.47.2 기준이다.

<br/>

## FULL OUTER JOIN
양쪽 테이블의 행을 모두 남기고, 짝이 없는 쪽은 NULL로 채운다.

```sql
select u.uid, o.oid
from users as u
full join orders as o on u.uid = o.uid
order by u.uid is null, u.uid, o.oid;
```

```text
uid  | oid
1    | 10
1    | 11
2    | 12
3    | NULL
NULL | 13
```

MySQL은 FULL OUTER JOIN 문법이 없어서 LEFT JOIN 결과에 RIGHT JOIN에서만 나오는 행을 붙여 같은 결과를 만든다(MySQL에서는 실행하지 않았다). 이때 `UNION` 은 중복 행을 지우므로, 원래 같은 값이 두 번 나와야 하는 행까지 사라질 수 있다. 그래서 `UNION ALL` 로 붙이고 오른쪽에서는 짝이 없는 행만 고른다.

```sql
select u.uid, o.oid from users as u left join orders as o on u.uid = o.uid
union all
select u.uid, o.oid from users as u right join orders as o on u.uid = o.uid
where u.uid is null;
```

이 쿼리를 SQLite 3.47.2에서 실행하면 위 FULL JOIN과 같은 다섯 행이 나왔다.

<br/>

## 네 조인 비교
| 조인 | 남기는 행 | 예시에서 park(주문 없음) | 예시에서 주문 13(사용자 없음) |
| --- | --- | --- | --- |
| INNER | 양쪽 모두 맞는 행 | 빠짐 | 빠짐 |
| LEFT | 왼쪽 전부 | 주문 열이 NULL로 남음 | 빠짐 |
| RIGHT | 오른쪽 전부 | 빠짐 | 사용자 열이 NULL로 남음 |
| FULL | 양쪽 전부 | 주문 열이 NULL로 남음 | 사용자 열이 NULL로 남음 |

<br/>

## 더 볼 것 (TODO)
- 조인 조건을 `ON` 에 둘 때와 `WHERE` 에 둘 때 LEFT JOIN 결과가 달라지는 경우
- CROSS JOIN과 SELF JOIN
- 조인과 인덱스
