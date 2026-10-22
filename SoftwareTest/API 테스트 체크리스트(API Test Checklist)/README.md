## 이 체크리스트의 기준
- HTTP 메서드마다 API 응답에서 무엇을 확인할지와 Postman 테스트 스크립트 예시를 모은 노트다
- 기대하는 상태 코드와 동작은 HTTP 표준 문서인 RFC 9110을 기준으로 적었다. 메서드와 상태 코드의 뜻은 [HTTP 메서드와 상태 코드](../../CS_Basic/WEB/HTTP%20메서드와%20상태%20코드(HTTP%20Methods%20and%20Status%20Codes)/README.md) 노트에 정리했다
- 예시는 연습용 API인 [Restful-booker](https://restful-booker.herokuapp.com/)의 booking 리소스를 기준으로 썼다. 이 API는 표준과 다르게 동작하는 곳이 있어서, 2026-10-22에 curl로 직접 호출해 본 결과를 함께 적었다
- `pm.` 으로 시작하는 코드는 Postman의 Tests 탭에서 도는 스크립트다. Postman에서 직접 실행해 보지는 않았다

### 표준과 실제 API가 다를 때
체크리스트의 기대값은 표준을 따르지만, 실제 API가 다르게 동작하면 그것이 버그인지 그 API의 약속(명세)인지 먼저 확인한다. 명세에 적혀 있으면 명세를 기준으로 테스트하고, 명세에도 없으면 결함으로 보고한다. 아래에서 Restful-booker가 표준과 다른 곳을 짚어 두었다.

<br/>

## GET (조회)
목적은 데이터를 올바르게 돌려주는지 확인하는 것이다. GET은 안전한(safe) 메서드라 서버의 상태를 바꾸지 않아야 하므로, 같은 요청을 여러 번 보내도 데이터가 바뀌지 않는지도 확인할 수 있다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태 코드 200 | `pm.response.to.have.status(200)` |
| 응답 시간 | `pm.expect(pm.response.responseTime).to.be.below(500)` |
| Content-Type | `pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json")` |
| 스키마 검증 | `pm.response.to.have.jsonSchema({...})` |
| 필드 존재 여부 | `pm.expect(json[0]).to.have.property("bookingid")` |
| 배열이면 비어 있지 않은지 | `pm.expect(json).to.be.an("array").that.is.not.empty` |
| 후속 요청용 값 저장 | `pm.environment.set("bookingId", json[0].bookingid)` |

Restful-booker의 목록 조회(`GET /booking`)는 `[{"bookingid":1},{"bookingid":2},...]` 처럼 `bookingid` 만 담긴 배열을 돌려준다. 그래서 필드 이름도 `id` 가 아니라 `bookingid` 로 확인한다.

<br/>

## POST (생성)
목적은 리소스가 올바르게 만들어졌는지 확인하는 것이다. RFC 9110에서 201(Created)은 새 리소스가 만들어졌다는 뜻이다. 만들어진 리소스는 `Location` 헤더로 알려 주고, 이 헤더가 없으면 요청한 주소(target URI)가 그 리소스를 가리킨다고 본다. 그래서 `Location` 헤더는 필수가 아니지만, 명세에 있다면 함께 확인한다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태 코드 201(명세에 따라 200) | `pm.response.to.have.status(201)` |
| 생성된 ID 반환 | `pm.expect(json).to.have.property("bookingid")` |
| ID 타입 | `pm.expect(json.bookingid).to.be.a("number")` |
| 요청값이 응답에 반영됐는지 | `pm.expect(json.booking.firstname).to.eql("Jim")` |
| 후속 요청용 값 저장 | `pm.environment.set("bookingId", json.bookingid)` |

POST는 멱등(idempotent)하지 않다. 같은 요청을 두 번 보내면 리소스가 두 개 생길 수 있으므로, 중복 생성을 막아야 하는 API라면 같은 요청을 다시 보냈을 때의 동작도 확인한다.

Restful-booker는 생성에 성공해도 201이 아니라 200을 돌려줬다.

<br/>

## PUT (전체 수정)
목적은 리소스 전체가 보낸 내용으로 바뀌었는지 확인하는 것이다. RFC 9110은 PUT을 대상 리소스의 상태를 보낸 표현으로 만들거나 교체하라는 요청으로 정의한다. 이미 있던 리소스를 바꿨으면 200 또는 204, 새로 만들었으면 201을 보내야 한다. PUT은 멱등이라 같은 요청을 여러 번 보내도 결과가 같아야 한다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태 코드 200(또는 204) | `pm.response.to.have.status(200)` |
| 보낸 필드가 모두 반영됐는지 | `pm.expect(json.firstname).to.eql("Updated")` |
| 보내지 않은 필드가 남아 있지 않은지 | `pm.expect(json.additionalneeds).to.be.undefined` |
| 필수 필드가 빠지면 400 | `pm.response.to.have.status(400)` |

Restful-booker에서 `additionalneeds` 를 빼고 PUT을 보냈더니 200이 오면서 기존 값 `"Breakfast"` 가 그대로 남았다. 전체 교체라는 표준의 뜻과 다르게, 빠진 선택 필드는 유지하는 동작이다. 필수 필드인 `lastname` 을 빼고 보내면 400(Bad Request)이 왔다.

<br/>

## PATCH (부분 수정)
목적은 보낸 필드만 바뀌고 나머지는 그대로인지 확인하는 것이다. PATCH는 RFC 5789에 정의된 메서드이고, 멱등이 보장되지 않는다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태 코드 200 | `pm.response.to.have.status(200)` |
| 보낸 필드만 바뀌었는지 | `pm.expect(json.firstname).to.eql("NewName")` |
| 보내지 않은 필드는 그대로인지 | `pm.expect(json.lastname).to.eql("Brown")` |

PUT과 PATCH의 차이는 검증하는 관점에 있다. PUT은 전체 교체이므로 보내지 않은 필드가 사라지는지를 보고, PATCH는 보낸 필드만 바뀌고 나머지는 유지되는지를 본다.

<br/>

## DELETE (삭제)
목적은 리소스가 실제로 지워졌는지 확인하는 것이다. RFC 9110은 삭제에 성공하면 아래 셋 중 하나를 보내라고 한다(SHOULD).

- 202(Accepted). 삭제를 받아들였지만 아직 끝나지 않았다.
- 204(No Content). 삭제했고 더 보낼 내용이 없다.
- 200(OK). 삭제했고 결과를 설명하는 본문이 있다.

| 체크 항목 | 예시 코드 |
| --- | --- |
| 상태 코드 204(또는 200, 202) | `pm.response.to.have.status(204)` |
| 204면 본문이 비어 있는지 | `pm.expect(pm.response.text()).to.be.empty` |
| 삭제 후 GET이 404인지 | 별도 요청으로 나눠 확인 |
| 같은 DELETE를 다시 보냈을 때 | 상태는 404 등으로 달라도 리소스가 없는 결과는 같다(멱등) |

204는 본문이 없으므로 `pm.response.json()` 을 부르면 JSON 파싱 오류가 난다. 본문을 확인해야 하면 `pm.response.text()` 로 읽는다.

Restful-booker는 삭제에 성공하면 201(Created)과 본문 `Created` 를 돌려줬다. 표준에서 201은 새 리소스를 만들었다는 뜻이라 삭제 응답과 맞지 않는다. 삭제 뒤 같은 ID로 GET하면 404(Not Found)가 왔다.

<br/>

## 공통 에러 케이스
| 케이스 | 기대 상태 코드 | 확인할 것 |
| --- | --- | --- |
| 필수 필드 누락, 잘못된 형식 | 400 | 무엇이 잘못됐는지 알려 주는 에러 메시지 |
| 형식은 맞지만 처리할 수 없는 내용 | 422 | 400과 구분해서 쓰는 API인지 명세 확인 |
| 존재하지 않는 ID | 404 | 상태 코드 |
| 인증 정보가 없거나 틀림 | 401 | `WWW-Authenticate` 헤더 |
| 인증은 됐지만 권한이 없음 | 403 | 상태 코드 |
| 현재 상태와 충돌(중복 생성 등) | 409 | 충돌 원인을 알려 주는 메시지 |
| 조건부 요청 실패(`If-Match` 불일치) | 412 | 낙관적 잠금을 쓰는 API에서만 |

401과 403의 차이는 인증 여부다. RFC 9110에서 401은 유효한 인증 정보가 없다는 뜻이고 `WWW-Authenticate` 헤더를 반드시 보내야 한다. 403은 요청을 이해했지만 거부한다는 뜻이다. 422(Unprocessable Content)는 요청 형식과 문법은 맞는데 내용을 처리할 수 없을 때 쓴다. 409(Conflict)는 리소스의 현재 상태와 충돌할 때, 412(Precondition Failed)는 요청 헤더에 건 조건이 서버에서 거짓으로 판정됐을 때 쓴다.

Restful-booker에서 확인한 에러 응답은 표준과 다른 곳이 있었다.

- 토큰 없이 PUT을 보내면 401이 아니라 403(Forbidden)이 왔다.
- 필수 필드를 뺀 POST는 400이 아니라 500(Internal Server Error)이 왔다. 입력 검증이 서버 오류로 새는 것이라, 실제 서비스였다면 결함으로 보고할 응답이다.

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

<br/>

## 참고 자료
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) (9.2 안전한 메서드와 멱등 메서드, 9.3 메서드 정의, 15장 상태 코드)
- [RFC 5789: PATCH Method for HTTP](https://www.rfc-editor.org/rfc/rfc5789)
- [Postman: Write scripts to test API response data](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)

<br/>

## 더 볼 것 (TODO)
- 멱등성 키(Idempotency-Key)로 POST 중복 생성 막기와 그 테스트
- 페이지네이션, 정렬, 필터 쿼리의 검증 포인트
- Postman 컬렉션을 Newman으로 CI에서 돌리기
