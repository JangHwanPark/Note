# HTTP 메서드별 API 테스트 체크리스트
Postman 기준으로 메서드별 검증 포인트와 예시 코드를 정리한 노트다.

예시는 [Restful-booking](https://restful-booker.herokuapp.com/) API의 booking 리소스를 기준으로 작성했다.

## GET (조회)
목적은 데이터를 올바르게 반환하는지 확인하는 것이다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태코드 200 | `pm.response.to.have.status(200)` |
| 응답 시간 | `pm.expect(pm.response.responseTime).to.be.below(500)` |
| Content-Type | `pm.expect(contentType).to.include("application/json")` |
| 스키마 검증 | `pm.response.to.have.jsonSchema({...})` |
| 필드 존재 여부 | `pm.expect(json).to.have.property("id")` |
| 배열 응답이면 길이 확인 | `pm.expect(json).to.be.an("array").that.is.not.empty` |
| 환경변수 저장 | `pm.environment.set("bookingId", json[0].bookingid)` |

## POST (생성)

목적은 리소스가 올바르게 생성됐는지 확인하는 것이다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태코드 201 (또는 200) | `pm.response.to.have.status(201)` |
| 생성된 ID 반환 확인 | `pm.expect(json).to.have.property("bookingid")` |
| 반환 ID의 타입 확인 | `pm.expect(json.bookingid).to.be.a("number")` |
| 요청값이 응답에 반영됐는지 | `pm.expect(json.booking.firstname).to.eql("Jim")` |
| 환경변수 저장 (후속 요청용) | `pm.environment.set("bookingId", json.bookingid)` |

## PUT (전체 수정)

목적은 리소스 전체가 교체됐는지 확인하는 것이다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태코드 200 | `pm.response.to.have.status(200)` |
| 수정한 모든 필드가 반영됐는지 | `pm.expect(json.firstname).to.eql("Updated")` |
| 보내지 않은 필드가 null/기본값인지 | `pm.expect(json.additionalneeds).to.be.undefined` |
| 스키마 검증 (전체 필드 required) | `pm.response.to.have.jsonSchema({...})` |

## PATCH (부분 수정)

목적은 수정한 필드만 바뀌고 나머지는 유지됐는지 확인하는 것이다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태코드 200 | `pm.response.to.have.status(200)` |
| 수정한 필드만 변경됐는지 | `pm.expect(json.firstname).to.eql("NewName")` |
| 수정하지 않은 필드는 그대로인지 | `pm.expect(json.lastname).to.eql("기존값")` |

PUT과 PATCH의 핵심 차이는 검증 관점에 있다.

PUT은 전체 교체이므로 안 보낸 필드가 사라지는지를 확인하고, PATCH는 보낸 필드만 바뀌고 나머지는 유지되는지를 확인한다.

## DELETE (삭제)

목적은 리소스가 실제로 삭제됐는지 확인하는 것이다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태코드 200 또는 204 | `pm.response.to.have.status(204)` |
| 응답 바디가 비어있는지 (204면) | `pm.expect(pm.response.text()).to.be.empty` |
| 삭제 후 GET 요청 시 404 반환 | 별도 요청으로 분리해서 확인 |

상태코드 204는 바디가 없으므로 `pm.response.json()`을 호출하면 에러가 난다.

바디 검증이 필요하면 `pm.response.text()`로 확인한다.

## 공통 - 에러 케이스 (모든 메서드)

| 케이스 | 상태코드 | 확인 포인트 |
| --- | --- | --- |
| 필수 필드 누락 | 400 | 에러 메시지 포함 여부 |
| 잘못된 타입/형식 | 400 | 에러 메시지 포함 여부 |
| 존재하지 않는 ID | 404 | 상태코드 404 |
| 인증 없음 | 401 | 상태코드 401 |
| 권한 없음 | 403 | 상태코드 403 |

```js
// 에러 케이스 공통 패턴
pm.test("Status 400", () => {
    pm.response.to.have.status(400);
});
pm.test("에러 메시지 포함", () => {
    const text = pm.response.text();
    pm.expect(text).to.not.be.empty;
});
```
