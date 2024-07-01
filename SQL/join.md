### Join

---
join 문법은 두개의 테이블을 하나로 합쳐서 데이터를 조회하는 문법이다.  
SQL 에서 조인 종류를 명시하지 않고 join 키워드만 사용할 경우 기본값으로 `inner join` 으로 적용된다.

### <br>Inner Join

---
두개의 테이블에서 공통된 부분만 결합하여 반환한다. (조인 조건을 만족하는 컬럼만 반환한다.)

```sql
select 
    u.uid, u.uname, o.oid
from
    User as u
inner join Orders as o on u.uid = o.oid;
```

### <br>Left Join

---
왼쪽 테이블의 모든 행을 반환하고 오른쪽 테이블은 조인 조건을 만족하는 행을 반환한다.

```sql
select 
    u.uid, o.oid
from
    User as u
left join Orders as o on u.uid = o.uid;
```

### <br>Right Join

---
오른쪽 테이블의 모든 행을 반환하고 왼쪽 테이블은 조인조건을 만족하는 행을 반환한다.

```sql
select 
    u.uid, o.oid
from
    User as u
right join Orders as o on u.uid = o.uid;
```

### <br> Full Join

---
양쪽 테이블의 모든행을 반환하며, 일치하지 않는 경우 Null 값을 포함한다.

```sql
select 
    u.uid, o.oid
from
    User as u
full join Orders as o on u.uid = o.oid;
```