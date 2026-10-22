## 부하테스트(Load Testing)
부하테스트는 시스템에 의도적으로 많은 양의 요청이나 트래픽을 주고 그 상황에서 어떻게 버티는지 확인하는 테스트다.
단순히 부하를 많이 주는게 아니라 예상되는 부하 수준에서 미리 정해둔 기준(SLA/목표치)를 지키는지 확인한다.

기능테스트가 이 기능이 동작하는지를 확인한다면 부하테스트는 기능이 된다는 것을 전제한 뒤 부하가 걸린 상태에서도 기능이 제대로 동작하는지를 확인한다.
그래서 통과기준이 `응답을 받는다`가 아니라 `정해진 시간내 에러 없이 목표한 처리량으로 응답이 온다`가 된다.

| 알아내려는 것 | 구체적 질문 |
| --- | --- |
| 용량(Capacity) | 목표 사용자 수를 감당할 수 있나? |
| 응답성(Responsiveness) | 그때 응답시간이 기준(예: p95 < 500ms) 안에 드나? |
| 안정성(Stability) | 에러율이 허용치(예: < 0.1%) 아래인가? |
| 여유(Headroom) | 한계까지 얼마나 남았나? |

## JMeter
JMeter(제이미터)는 여러 사용자가 동시에 서버에 요청하는 상황을 만들어 API나 웹 서버의 응답 속도와 처리량을 측정하는 도구다.

## JMeter 용어
| 용어 |	의미 |
| --- | --- |
| Test Plan |	전체 테스트 시나리오 |
| Thread Group	|	가상 사용자 수와 실행 횟수 설정 |
| Thread	| 가상 사용자 한 명 |
| Sampler	|	실제 HTTP 요청 |
| Listener |	실행 결과를 보여주는 화면 |
| Assertion	|	응답이 올바른지 검사 |
| Timer	|	요청 사이에 대기시간 추가 |
| Ramp-Up	|	사용자를 몇 초 동안 나누어 실행할지 |
| Throughput	|	초당 또는 분당 처리한 요청 수 |
| Percentile	|	응답시간 분포를 나타내는 백분위 값 |

## JMeter 테스트 구조
JMeter의 테스트는 기본적으로 아래처럼 계층 구조로 구성된다. 가장 단순한 형태는 다음과 같다.
```text
Test Plan
└─ Thread Group
   └─ HTTP Request
```

여기에 헤더 설정, 대기시간, 응답 검증, 결과 확인 요소를 붙이면 실제 테스트에서 쓰는 형태가 된다. 일반적으로는 다음과 같이 구성한다.
```text
Test Plan
└─ Thread Group
   ├─ HTTP Request Defaults
   ├─ Constant Timer
   ├─ GET /api/users
   │  ├─ Response Assertion
   │  └─ Response Assertion
   ├─ POST /api/login
   │  ├─ HTTP Header Manager
   │  ├─ Response Assertion
   │  └─ Response Assertion
   ├─ View Results Tree
   └─ Summary Report
```
