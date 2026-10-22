## 부하 테스트란 ?
- 부하 테스트(Load Testing)는 시스템에 의도적으로 많은 요청이나 트래픽을 주고, 그 상황에서 어떻게 버티는지 확인하는 테스트다
- 부하를 그냥 많이 주는 것이 아니라, 예상되는 부하 수준에서 미리 정해 둔 기준을 지키는지 확인한다. 기준은 서비스 수준 협약(SLA, Service Level Agreement)이나 팀이 정한 목표치다
- JMeter(제이미터)는 여러 사용자가 동시에 요청하는 상황을 만들어 응답 시간과 처리량을 재는 도구다. 이 노트는 JMeter 5.6.3(2026-10 기준 다운로드 페이지의 최신판) 문서를 기준으로 썼다

### 부하 (Load)
사전적 의미는 짐, 또는 기계나 장치에 걸리는 일의 양이다.
소프트웨어에서는 서버가 같은 시간에 처리해야 하는 요청의 양을 말한다. 사용자 수, 초당 요청 수, 요청 하나가 하는 일의 크기가 모두 부하가 된다.

<br/>

## 기능 테스트와 무엇이 다를까
기능 테스트가 이 기능이 동작하는지를 확인한다면, 부하 테스트는 기능이 된다는 것을 전제로 부하가 걸린 상태에서도 제대로 동작하는지를 확인한다. 그래서 통과 기준이 "응답을 받는다"가 아니라 "정해진 시간 안에, 에러 없이, 목표한 처리량으로 응답이 온다"가 된다.

부하 테스트로 알아내려는 것은 보통 아래 네 가지다.

| 알아내려는 것 | 구체적인 질문 |
| --- | --- |
| 용량(Capacity) | 목표 사용자 수를 감당할 수 있나? |
| 응답성(Responsiveness) | 그때 응답 시간이 기준(예: p95 < 500ms) 안에 드나? |
| 안정성(Stability) | 에러율이 허용치(예: 0.1% 미만) 아래인가? |
| 여유(Headroom) | 한계까지 얼마나 남았나? |

p95는 응답 시간을 작은 순서로 늘어놓았을 때 95번째 백분위 값이다. 요청 100개 중 95개가 이 시간 안에 끝났다는 뜻이라, 평균보다 느린 사용자의 체감을 더 잘 보여 준다.

### 부하를 주는 방식에 따른 종류
"부하 테스트"는 넓게는 부하를 주는 테스트 전체를, 좁게는 아래 표의 첫 줄처럼 예상 부하에서 목표치를 확인하는 테스트 하나를 가리킨다. 이 노트의 제목은 넓은 뜻이다. 같은 도구로 부하를 주는 모양만 바꿔 여러 테스트를 하고, 이름과 경계는 조직마다 조금씩 다르게 쓰인다. 기능 테스트와 비기능 테스트의 구분은 [QA 이론 8장 테스트 유형](../QA%20이론(QA%20Theory)/08_테스트%20유형(Test%20Types)/README.md)에 정리했다.

| 종류 | 부하를 주는 방식 | 알아내려는 것 |
| --- | --- | --- |
| 부하 테스트(Load) | 예상되는 평소와 최대 수준 | 목표치를 지키는지 |
| 스트레스 테스트(Stress) | 예상을 넘어 계속 올린다 | 어디서 무너지는지, 무너진 뒤 회복되는지 |
| 스파이크 테스트(Spike) | 짧은 시간에 갑자기 크게 올린다 | 순간 몰림을 버티는지 |
| 내구성 테스트(Soak, Endurance) | 평소 수준을 몇 시간 이상 유지한다 | 메모리 누수처럼 시간이 지나야 드러나는 문제 |

<br/>

## JMeter 용어

| 용어 | 의미 |
| --- | --- |
| Test Plan | 테스트 전체. 아래 요소를 모두 담는 최상위 요소 |
| Thread Group | 가상 사용자 수, 시작 속도(Ramp-Up), 반복 횟수를 정하는 묶음 |
| Thread | 가상 사용자 한 명 |
| Sampler | 서버에 보내는 요청 하나(HTTP Request 등) |
| Listener | 실행 결과를 모아 보여 주거나 파일로 저장하는 요소 |
| Assertion | 응답이 기대한 대로인지 검사하는 요소 |
| Timer | 요청 사이에 대기 시간을 넣는 요소 |
| Ramp-Up | 정한 스레드를 모두 시작하는 데 걸리는 시간 |
| Throughput | 단위 시간당 처리한 요청 수(초, 분, 시간당) |
| Percentile | 응답 시간 분포의 백분위 값. Aggregate Report의 90%, 95%, 99% Line |

### Ramp-Up을 어떻게 읽을까
공식 문서의 설명은 "모든 스레드를 시작하는 데 걸리는 시간"이다. 스레드 10개에 Ramp-Up 100초를 주면 스레드가 앞 스레드보다 10초씩 늦게 시작해서, 100초에 걸쳐 전부 시작된다. 스레드가 1개면 첫 스레드는 바로 시작하므로 Ramp-Up은 사실상 0이다.

한꺼번에 모든 사용자를 들이붓지 않고 천천히 올리면, 응답 시간이 어느 사용자 수에서 나빠지기 시작하는지 볼 수 있다.

### Timer가 필요한 이유
JMeter 스레드는 기본적으로 요청을 쉬지 않고 연달아 보낸다. 실제 사용자는 화면을 읽고 입력하느라 요청 사이에 시간이 있으므로, Timer를 넣지 않으면 실제보다 훨씬 센 부하가 걸린다. 공식 문서도 Thread Group에 Timer를 넣으라고 권하고, Timer는 자기 범위(scope) 안에 있는 각 Sampler 앞에서 대기한다고 설명한다.

<br/>

## JMeter 테스트 구조
JMeter 테스트는 요소를 계층으로 쌓아 만든다. 가장 단순한 형태는 아래와 같다.

```text
Test Plan
└─ Thread Group
   └─ HTTP Request
```

여기에 기본값 설정, 대기 시간, 응답 검증, 결과 확인 요소를 붙이면 실제로 쓰는 형태가 된다.

```text
Test Plan
└─ Thread Group
   ├─ HTTP Request Defaults
   ├─ Constant Timer
   ├─ GET /api/users
   │  └─ Response Assertion
   ├─ POST /api/login
   │  ├─ HTTP Header Manager
   │  └─ Response Assertion
   ├─ View Results Tree
   └─ Summary Report
```

요소가 놓인 위치가 곧 적용 범위다. `HTTP Header Manager` 를 `POST /api/login` 아래에 두면 그 요청에만, Thread Group 바로 아래에 두면 그 그룹의 모든 요청에 적용된다. `Constant Timer` 도 Thread Group 바로 아래에 있으므로 모든 요청 앞에서 기다린다.

### 실제 부하를 줄 때 주의할 점
`View Results Tree` 는 요청과 응답을 하나하나 보여 주는 리스너라 스크립트를 짜며 디버깅할 때 쓴다. 공식 모범 사례(Best Practices)는 부하 테스트 중에는 `View Results Tree` 와 `View Results in Table` 을 쓰지 말고, 리스너를 최소로 줄이고, GUI 대신 CLI 모드로 실행하라고 권한다.

```bash
jmeter -n -t test.jmx -l test.jtl
```

`-n` 은 GUI 없이 실행, `-t` 는 테스트 계획 파일, `-l` 은 결과를 저장할 파일이다. 결과는 파일로 남기고 리포트는 실행이 끝난 뒤 만든다. GUI와 리스너도 JMeter가 돌아가는 컴퓨터의 자원을 쓰므로, 줄이지 않으면 측정하려는 서버보다 부하를 주는 쪽이 먼저 한계에 닿을 수 있다.

<br/>

## 참고 자료
- [Apache JMeter: Building a Test Plan](https://jmeter.apache.org/usermanual/test_plan.html)
- [Apache JMeter: Component Reference (Thread Group)](https://jmeter.apache.org/usermanual/component_reference.html#Thread_Group)
- [Apache JMeter: Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)
- [Apache JMeter: Getting Started (CLI 모드 옵션)](https://jmeter.apache.org/usermanual/get-started.html)

<br/>

## 더 볼 것 (TODO)
- CSV Data Set Config로 사용자마다 다른 입력 데이터 쓰기
- CLI 실행 결과로 HTML 대시보드 리포트 만들기(`-e -o`)
- 목표 처리량을 맞추는 타이머(Constant Throughput Timer)
- k6, Gatling 같은 다른 부하 테스트 도구와 비교
