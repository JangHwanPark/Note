## 해시 (Hash)
해시는 데이터를 `key`를 기준으로 저장하고 찾는 방식이다.  
배열은 `index`번호로 접근하지만 해시는 `key`이름으로 접근한다.

배열(좌석 번호): `arr[i]` -> `arr[0]`처럼 위치로 찾음

해시(이름표): `counter[keyName]` -> `counter["keyName"]`처럼 이름으로 찾음

## 해시는 검색이 빠르다.
해시를 쓰는 이유는 빠른 검색이다.

배열에서 `value`를 찾으려면 앞에서부터 하나씩 봐야한다.
```js
const target = "value";
const array = ["value1", "value2", "value3", "value4", "value"];
```

```text
i = 0 -> array[0] === target = false
i = 1 -> array[1] === target = false
i = 2 -> array[2] === target = false
i = 3 -> array[3] === target = false
i = 4 -> array[4] === target = true

etc -> array[target] = undefined
```

<br/>

해시는 `key`를 이용해서 바로 찾을수 있다.
```js
const hash = {
    data1: "value data1",
    data2: "value data2",
    data3: "value data3",
    data4: "value data4",
}
```
```text
hash["data1"] -> value data1
hash.data1 -> value data1

hash[data1] -> error
```

<br/>

대괄호 접근은 변수에 키이름이 있을때 사용함  
변수를 점표기로 접근하면 `undefined`출력됨

`객체.키`: 키 이름을 그대로 사용  
`객체[변수]`: 변수 안에 들어있는 값을 키로 사용
```js
let hashKey = "data1"
const hash = {
    data1: "value data1",
    data2: "value data2",
    data3: "value data3",
    data4: "value data4",
}

hash[hashKey] // value data1
hash.hashKey // undefined
```

## 해시 테이블 (Hash Table)

## 해시 함수 (Hash Fn)