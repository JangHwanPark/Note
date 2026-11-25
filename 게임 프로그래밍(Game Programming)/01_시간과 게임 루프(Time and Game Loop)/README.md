## 게임 속 시간이란 ?
- 게임은 화면 한 장(프레임)을 그리는 일을 1초에 수십 번 되풀이하며 돌아간다. 이 되풀이 구조가 게임 루프이고, 그 안에서 시간을 어떻게 재고 나눠 쓰느냐가 이 장의 주제다
- 컴퓨터마다 1초에 그릴 수 있는 프레임 수가 다르다. 그래도 게임 속 시간은 누구에게나 같게 흘러야 하고, 물리는 매번 같은 결과를 내야 하고, 화면은 찢어지거나 끊기지 않아야 한다. 이 장의 일곱 기법은 이 세 요구 가운데 하나 이상을 맞추려고 나왔다
- 게임 루프, 델타 타임, 고정 타임스텝, 누산기와 상태 보간, 틱 레이트, 타임 스케일, 수직 동기화와 프레임 페이싱을 이 순서로 정리한다. 앞의 네 기법은 앞 기법의 한계를 뒤 기법이 메우는 순서이고, 뒤의 세 기법은 같은 틀을 서버, 배속, 화면 출력 쪽에서 본다

### 프레임 (Frame)
사전적 의미는 틀, 액자다. 영화에서는 필름의 한 칸, 곧 정지한 그림 한 장을 프레임이라고 불렀다.
게임에서도 화면에 한 번 그려 내는 그림 한 장을 프레임이라고 한다. 1초에 그리는 프레임 수가 프레임 레이트(FPS, Frames Per Second)이고, 한 프레임을 그리는 데 걸린 시간이 프레임 시간(frame time)이다. 60fps면 한 프레임에 약 16.7ms(1000 ÷ 60), 144fps면 약 6.9ms(1000 ÷ 144)를 쓸 수 있다.

<br/>

## 게임 루프 (Game Loop)
### 정의
루프(loop)의 사전적 의미는 고리, 고리 모양으로 돌아오는 길이다. 프로그래밍에서는 같은 코드를 되풀이해 실행하는 반복문을 말한다.

로버트 나이스트롬(Robert Nystrom)의 『Game Programming Patterns』는 게임 루프 패턴의 목적을 게임 시간의 흐름을 사용자 입력과 프로세서 속도에서 떼어 내는 것이라고 쓴다("Decouple the progression of game time from user input and processor speed"). 게임 루프는 게임을 하는 동안 쉬지 않고 돌며, 한 바퀴마다 세 가지 일을 한다.

1. 입력 처리(processInput) : 키보드, 마우스, 패드 입력을 읽는다
2. 갱신(update) : 게임 상태를 한 걸음 진행한다. 나이스트롬은 여기서 AI와 물리를 돌린다고 쓴다
3. 그리기(render) : 지금 상태를 화면에 그린다

```text
while (게임이 끝나지 않았다) {
    processInput();
    update();
    render();
}
```

### 왜 이런 구조일까
보통의 프로그램, 예를 들어 문서 편집기는 사용자가 무언가를 누를 때까지 기다린다. 나이스트롬은 이런 이벤트 루프가 입력을 기다리며 멈춰 있는(blocks) 반면, 게임 루프는 입력을 처리하되 기다리지는 않는다고 대비한다("it processes user input, but doesn't wait for it"). 플레이어가 아무것도 누르지 않아도 적은 움직이고 시간은 흘러야 하기 때문이다.

영사기와 비슷하다. 관객이 무엇을 하든 영사기는 필름을 한 칸씩 넘기며 계속 비춘다. 다만 게임은 다음 칸의 그림을 미리 찍어 둔 것이 아니라, 매번 입력을 보고 새로 계산해서 그린다.

<br/>

## 델타 타임 (Delta Time)
### 정의
델타(Δ)는 그리스 문자로, 수학과 과학에서 변화량, 곧 두 값의 차이를 나타내는 기호로 쓴다. 델타 타임은 시간의 차이, 곧 지난 프레임에서 지금 프레임까지 흐른 시간이다. Unity 문서도 Time.deltaTime을 지난 프레임 이후 흐른 시간이라고 설명한다.

### 왜 필요할까
프레임마다 정해진 거리만큼 움직이게 짜면, 프레임을 많이 그리는 컴퓨터에서 캐릭터가 더 빨리 달린다. 델타 타임을 곱하면 프레임 수와 상관없이 1초에 같은 거리를 간다.

```python
def run(fps, use_delta):
    x = 0.0
    dt = 1 / fps
    for _ in range(fps):          # 1초 = fps 프레임
        if use_delta:
            x += 300 * dt         # 초당 300px
        else:
            x += 5                # 프레임당 5px
    return round(x, 6)

for fps in (60, 144):
    print(fps, "fps", "프레임당 5px:", run(fps, False), "/ 델타 타임:", run(fps, True))
# 60 fps 프레임당 5px: 300.0 / 델타 타임: 300.0
# 144 fps 프레임당 5px: 720.0 / 델타 타임: 300.0
```

프레임당 5px로 짜면 60fps에서 300px, 144fps에서 720px를 가서 두 배 넘게 빨라진다. 초당 300px에 델타 타임을 곱하면 둘 다 300px다.

### 한계
델타 타임만으로는 부족한 곳이 있다. 한 프레임이 갑자기 아주 길어지면(예를 들어 로딩으로 1초가 멈추면) 그 1초를 한 번에 곱해 캐릭터가 순간 이동하듯 튄다. 그래서 Unity는 델타 타임에 상한을 둔다. Time.maximumDeltaTime이 델타 타임을 제한하고, 기본값이 1/3초(0.3333333)라고 쓴다(Unity 6000.6 문서 기준).

더 큰 문제는 물리다. 이것이 다음 기법인 고정 타임스텝이 나온 이유다.

<br/>

## 고정 타임스텝 (Fixed Timestep)
### 정의
타임스텝(timestep)은 시뮬레이션이 한 번에 시간을 얼마만큼 앞으로 보내는지, 곧 한 걸음의 크기다. 고정 타임스텝은 이 걸음의 크기를 프레임과 상관없이 늘 같게(예: 1/60초) 두는 방식이다.

### 왜 필요할까
글렌 피들러(Glenn Fiedler)는 2004년 글 「Fix Your Timestep!」에서 프레임마다 다른 델타 타임을 물리에 그대로 넣으면 시뮬레이션의 움직임이 넣은 델타 타임에 따라 달라진다고 지적한다("depends on the delta time you pass in"). 작게는 손맛이 미묘하게 달라지고, 크게는 스프링 시뮬레이션이 무한대로 튀거나, 빠른 물체가 벽을 뚫거나, 플레이어가 바닥으로 떨어진다고 쓴다.

물리 계산은 연속으로 흐르는 시간을 작은 걸음으로 잘라 더해 가는 근사다. 그래서 걸음 크기가 다르면 같은 1초라도 결과가 달라진다. 중력으로 1초 동안 떨어지는 거리를, 속도를 먼저 바꾸고 그 속도로 위치를 옮기는 단순한 방식(반암시적 오일러 적분, semi-implicit Euler)으로 계산해 보면 아래와 같다.

```python
def fall(dt, seconds=1.0):
    y, v, g = 0.0, 0.0, 9.8
    for _ in range(round(seconds / dt)):
        v += g * dt
        y += v * dt
    return round(y, 4)

for fps in (30, 60, 144):
    print(f"dt=1/{fps}: 1초 뒤 낙하 거리 {fall(1/fps)} m")
print("정답(1/2 g t^2):", 0.5 * 9.8)
# dt=1/30: 1초 뒤 낙하 거리 5.0633 m
# dt=1/60: 1초 뒤 낙하 거리 4.9817 m
# dt=1/144: 1초 뒤 낙하 거리 4.934 m
# 정답(1/2 g t^2): 4.9
```

같은 1초인데 30fps 컴퓨터에서는 5.06m, 144fps 컴퓨터에서는 4.93m 떨어진다. 점프 높이나 탄도가 컴퓨터마다 달라진다는 뜻이다. 걸음 크기를 1/60초로 고정하면 걸음 크기 차이 때문에 결과가 갈리는 일은 없어진다. 다만 다른 기기에서도 비트 하나까지 같은 결과가 나오게 하는 결정론은 부동소수점 연산 차이까지 따져야 하는 별도 주제다(목차의 TODO).

나이스트롬도 가변 타임스텝이 결정론적(deterministic)이지 않아, 곧 같은 입력을 넣어도 매번 같은 결과가 나온다는 보장이 없고 불안정하다고 하며("non-deterministic and unstable"), 물리와 AI가 더 단순하고 안정되도록 고정 타임스텝을 쓴다고 쓴다. Unity의 Time.fixedDeltaTime도 물리와 고정 갱신을 하는 간격이다. 기본값은 0.02초(초당 50번)로, Unity 문서(6000.6)의 timeScale 예시 코드 주석에 적혀 있다.

구불구불한 길을 자로 재는 것과 같다. 1m 자로 재는 사람과 30cm 자로 재는 사람은 다른 값을 얻는다. 모두 같은 1m 자를 쓰기로 정하면, 실제 길이와 조금 다르더라도 누가 재든 같은 값이 나온다.

<br/>

## 누산기와 상태 보간 (Accumulator and State Interpolation)
### 누산기 (Accumulator)
누산(累算)은 쌓아 가며 더한다는 뜻이다. accumulate도 모으다, 쌓다라는 영어 단어다. 공학에서는 값을 계속 더해 쌓아 두는 변수를 누산기라고 한다.

고정 타임스텝에는 문제가 하나 남는다. 프레임 시간은 들쭉날쭉한데 물리는 1/60초씩만 돌아야 한다. 피들러는 이것을 그리기 쪽이 시간을 만들어 내고 시뮬레이션이 그 시간을 dt 크기 조각으로 먹는다고 표현한다("the renderer produces time and the simulation consumes it in discrete dt sized steps"). 다 먹지 못하고 남은 시간은 버리지 않고 누산기 변수에 담아 다음 프레임으로 넘긴다.

```python
DT = 1 / 60
frame_times = [0.016, 0.034, 0.008, 0.050]   # 실제로 걸린 프레임 시간(초)
acc = 0.0
for i, frame in enumerate(frame_times, 1):
    acc += frame
    steps = 0
    while acc >= DT:
        acc -= DT          # 여기서 physics_step(DT) 를 부른다
        steps += 1
    alpha = acc / DT       # 그릴 때 이전 상태와 현재 상태를 섞는 비율
    print(f"프레임 {i}: {frame*1000:.0f}ms 흐름 -> 물리 {steps}번, alpha={alpha:.2f}")
# 프레임 1: 16ms 흐름 -> 물리 0번, alpha=0.96
# 프레임 2: 34ms 흐름 -> 물리 3번, alpha=0.00
# 프레임 3: 8ms 흐름 -> 물리 0번, alpha=0.48
# 프레임 4: 50ms 흐름 -> 물리 3번, alpha=0.48
```

첫 프레임은 16ms라 1/60초(약 16.7ms)에 조금 모자라 물리를 한 번도 돌리지 않고 남겨 둔다. 둘째 프레임에서 남은 16ms와 새 34ms가 합쳐져 50ms가 되자 물리를 세 번 돌린다. 프레임마다 물리 횟수는 0번, 3번처럼 달라도, 물리가 쓰는 걸음 크기는 늘 1/60초다.

동전 저금통과 같다. 매일 들어오는 잔돈은 제각각이지만, 정해 둔 금액이 모일 때마다 그만큼씩만 꺼내 쓰고 나머지는 통에 남겨 둔다.

### 죽음의 소용돌이 (Spiral of Death)
누산기에는 함정이 있다. 물리 한 번 계산이 1/60초보다 오래 걸리는 컴퓨터라면, 밀린 시간을 따라잡으려고 물리를 더 돌릴수록 프레임이 더 길어지고, 그래서 더 많이 밀린다. 피들러는 이것을 물리 시뮬레이션이 요구받은 걸음을 따라가지 못할 때 생기는 일이라고 하며 죽음의 소용돌이라고 부른다. 그의 예시 코드는 프레임 시간을 0.25초로 잘라 누산기에 넣는다. Unity도 Time.maximumDeltaTime이 두 프레임 사이에 물리가 계산하는 시간의 한계로도 쓰인다고 쓴다. 따라잡기를 어느 선에서 포기하고 게임을 잠깐 느리게 만드는 쪽을 고르는 것이다(내 정리다).

### 상태 보간 (State Interpolation)
보간(補間)은 사이를 메운다는 뜻이다. 알려진 두 값 사이의 값을 추정해 채워 넣는 일이다.

물리는 1/60초 간격으로만 위치를 계산하는데, 화면은 그 사이 어느 순간에 그려진다. 계산된 위치를 그대로 그리면 프레임마다 물리 횟수가 0번, 3번으로 달라져 움직임이 미묘하게 끊겨 보인다. 피들러는 이를 물리 시뮬레이션이 화면에서 살짝 더듬거리는(stuttering) 현상이라고 쓴다.

그래서 누산기에 남은 시간을 dt로 나눈 비율(alpha)로, 직전 물리 상태와 지금 물리 상태를 섞어 그린다. 위 코드의 alpha가 이 값이다. 아래 `lerp`는 두 값 사이를 비율대로 잇는 선형 보간(linear interpolation)의 줄임말이다.

```python
def lerp(prev, curr, alpha):
    return prev + (curr - prev) * alpha

prev, curr = 100.0, 105.0    # 물리 한 번에 5px 움직였다
for alpha in (0.0, 0.25, 0.5, 1.0):
    print(f"alpha={alpha}: 그릴 위치 {lerp(prev, curr, alpha)}")
# alpha=0.0: 그릴 위치 100.0
# alpha=0.25: 그릴 위치 101.25
# alpha=0.5: 그릴 위치 102.5
# alpha=1.0: 그릴 위치 105.0
```

이렇게 하면 화면에 그려지는 위치는 실제 물리보다 최대 한 걸음 늦지만, 매 프레임 고르게 움직여 보인다. 늦어지는 만큼의 지연과 부드러움을 맞바꾸는 셈이다(이 득실 정리는 내 해석이다).

나이스트롬의 책은 같은 문제를 조금 다르게 푼다. 두 상태를 섞는 대신, 남은 비율만큼 속도를 곱해 앞으로 내다본 위치를 그린다. 이것을 외삽(extrapolation)이라고 한다. 지연은 없는 대신(내 정리다), 책도 이 추측이 가끔 틀린다고 쓴다. 피들러의 방식은 이미 계산된 두 상태 사이를 메우는 보간이고, 나이스트롬의 방식은 앞을 추측하는 외삽이라는 점이 다르다.

<br/>

## 틱 레이트 (Tick Rate)
### 정의
틱(tick)의 사전적 의미는 시계의 째깍 소리다. 서버가 게임 상황을 한 번 계산하는 주기를 틱이라 하고, 1초에 몇 번 계산하는지를 틱 레이트라고 한다. 개념과 네트워크 쪽 이야기는 [클라이언트-서버 구조 게임 관점](../../CS_Basic/클라이언트-서버%20구조%20게임%20관점(Game)/README.md)의 틱 절에서 다뤘다.

### 게임 루프 쪽에서 보면
서버의 틱은 앞에서 본 고정 타임스텝을 서버에서 돌리는 것으로 볼 수 있다. 서버는 화면을 그리지 않으니 그리기 단계가 없고, 정해진 간격마다 입력을 모아 상태를 갱신하고 결과를 보낸다(이 대응은 내 정리다). 틱 레이트에서 한 틱에 쓸 수 있는 시간을 계산하면 아래와 같다.

| 틱 레이트 | 한 틱의 간격 |
|----------|------------|
| 30틱 | 1000 ÷ 30 ≈ 33.3ms |
| 64틱 | 1000 ÷ 64 = 15.625ms |
| 128틱 | 1000 ÷ 128 = 7.8125ms |

틱 레이트가 높을수록 서버가 더 자주, 더 최근 정보로 판정하지만 한 틱에 쓸 수 있는 시간이 줄어든다. 라이엇 게임즈(Riot Games)는 2020년 글 「VALORANT's 128-Tick Servers」에서 128틱을 고른 이유를 설명한다. 모퉁이를 돌아 튀어나오는 쪽이 자리를 지키던 쪽보다 먼저 보게 되는 이점을 피커스 어드밴티지(Peeker's Advantage)라고 하는데, 이것을 줄여 자리를 지키던 쪽에 반응할 시간을 주려는 것이다. 128틱이면 한 틱(글에서는 프레임이라고 부른다)을 7.8125ms 안에 처리해야 한다. 라이엇은 CPU 코어 하나에 게임 세 판 이상을 돌려야 했으므로 7.8125ms를 3으로 나눠 약 2.6ms를 얻고, 다시 운영체제와 다른 소프트웨어 몫으로 10%를 남겨 한 틱의 목표 예산을 2.34ms로 잡았다고 쓴다.

클라이언트의 프레임 레이트와 서버의 틱 레이트는 따로 간다. 144fps로 그리는 클라이언트도 서버의 판정은 틱 간격으로 받는다. 그 사이를 메우는 방법은 위 CS_Basic 노트의 보간과 예측에서 다뤘다. 그 노트의 보간은 서버에서 온 두 상태 사이를 메우는 것으로, 이 장의 상태 보간(물리 두 걸음 사이를 메우는 것)과 생각은 같지만 메우는 대상이 다르다.

<br/>

## 타임 스케일 (Time Scale)
### 정의
스케일(scale)의 사전적 의미는 눈금, 축척이다. 지도의 축척이 실제 거리를 얼마로 줄여 그렸는지 나타내듯, 타임 스케일은 실제 시간을 게임 시간으로 몇 배로 바꿀지 나타내는 배율이다. 1이면 실제와 같고, 0.5면 절반 속도(슬로 모션), 0이면 멈춤(일시정지)이다.

```python
real_dt = 1 / 60
for scale in (1.0, 0.5, 0.0):
    x = 0.0
    for _ in range(60):                 # 실제 1초
        x += 300 * real_dt * scale      # 초당 300px
    print(f"time scale {scale}: 실제 1초 동안 {round(x, 6)}px")
# time scale 1.0: 실제 1초 동안 300.0px
# time scale 0.5: 실제 1초 동안 150.0px
# time scale 0.0: 실제 1초 동안 0.0px
```

### 왜 델타 타임 위에서만 쓸 수 있을까
타임 스케일은 델타 타임에 배율을 곱하는 방식이다. 그래서 움직임을 모두 델타 타임으로 계산해 둔 게임이어야 제대로 작동한다. 프레임당 5px처럼 짠 코드는 배율을 바꿔도 그대로 움직인다. Unity 문서도 timeScale을 0으로 두면 모든 함수가 프레임 레이트와 상관없이 짜여 있을 때 일시정지처럼 동작한다고 조건을 붙인다.

### Unity에서 일어나는 일
- timeScale이 0이어도 Update는 계속 불리지만, Time.time은 늘지 않고 Time.deltaTime은 0이 된다
- timeScale이 0이면 FixedUpdate는 불리지 않는다
- timeScale만 바꾸고 fixedDeltaTime을 그대로 두면, 물리 계산 간격은 게임 시간 기준으로는 그대로이고 실제 시간 기준으로는 바뀐다. 문서는 보통의 슬로 모션에서는 이쪽을 원한다고 쓰고, 실제 시간 기준으로 물리 간격을 유지하고 싶으면 fixedDeltaTime에도 timeScale을 곱하라고 안내한다

Update가 계속 불린다는 점이 중요하다. 일시정지 중에도 메뉴를 움직이고 입력을 받을 수 있는 이유로 볼 수 있다(내 정리다).

<br/>

## 수직 동기화와 프레임 페이싱 (V-Sync and Frame Pacing)
### 화면 찢어짐 (Screen Tearing)
모니터는 게임과 상관없이 자기 속도(예: 60Hz면 1초에 60번)로 화면을 위에서 아래로 새로 그린다. 그런데 게임이 그 도중에 새 프레임을 넘겨주면, 화면 위쪽은 이전 프레임, 아래쪽은 새 프레임이 보여 가로로 어긋난 줄이 생긴다. Android 문서는 이것을 디스플레이 하드웨어가 갱신 도중에 새 프레임으로 바꿀 때 생기는 시각적 결함, 곧 찢어짐(tearing)이라고 설명한다.

### 수직 동기화 (V-Sync, Vertical Synchronization)
모니터가 한 화면을 위에서 아래로 다 그리고 다시 맨 위로 돌아가기 전까지의 짧은 틈을 수직 공백(vertical blank)이라고 한다. 수직이라는 말은 화면을 세로 방향으로 끝까지 다 그린 순간이라는 데서 붙었다. 수직 동기화는 새 프레임을 이 틈에 맞춰 넘겨, 한 화면 안에 두 프레임이 섞이지 않게 하는 방식이다.

Microsoft의 DXGI 문서는 프레임을 화면에 내보내는 함수(Present)의 SyncInterval 값을 이렇게 설명한다. 0이면 동기화 없이 바로 내보내고, 1에서 4면 n번째 수직 공백 뒤에 맞춰 내보낸다. 이 설명은 예전 방식인 비트 블록 전송(bitblt) 모델 기준이고, 요즘 쓰는 플립 모델은 동작이 조금 다르다.

수직 동기화의 대가는 기다림이다. 정해진 시각에만 출발하는 기차와 같아서, 1분 늦은 승객도 다음 열차까지 기다려야 한다. 60Hz 모니터에서 한 프레임이 16.7ms를 조금만 넘겨도, 그 프레임은 다음 수직 공백까지 기다리고 화면에는 이전 프레임이 한 번 더(약 16.7ms) 남는다. 기다리는 만큼 입력에서 화면까지의 지연도 늘 수 있다(이 설명은 수직 공백에 맞춰 내보낸다는 정의에서 이끌어 낸 내 정리다).

### 프레임 페이싱 (Frame Pacing)
페이싱(pacing)은 걸음 속도를 고르게 맞추는 일이다. 마라톤의 페이스메이커가 일정한 속도를 끌어 주듯이 말이다. Android 문서는 프레임 페이싱을 게임의 로직과 그리기 루프를 운영체제의 디스플레이 시스템, 디스플레이 하드웨어와 맞추는 일이라고 정의한다.

평균 프레임 레이트가 맞아도 프레임이 고르게 나오지 않으면 끊겨 보인다. Android 문서의 예는 30fps 게임을 60Hz 기기에서 돌리는 경우다. 문서는 게임의 그리기 루프가 반복된 프레임이 화면에 16ms 더 남아 있다는 것을 알지 못해서, 프레임이 49ms, 16ms, 33ms처럼 들쭉날쭉하게 보인다고 설명한다. 문서는 짧은 프레임 뒤에 긴 프레임이 오면 플레이어는 이를 끊김으로 느낀다고 쓴다.

그래서 프레임 페이싱의 목표는 높은 프레임 레이트보다 고른 프레임 간격이다. 60Hz 화면에서 안정적으로 60fps를 못 낸다면, 들쭉날쭉한 45fps보다 고른 30fps가 더 부드럽게 느껴질 수 있다(Android 문서의 예에서 이끌어 낸 내 정리다).

<br/>

## 일곱 기법을 한 루프에 놓으면
지금까지의 기법을 한 루프에 놓으면 대략 아래 모양이 된다. 피들러의 글과 나이스트롬의 책에 나온 구조를 이 장의 용어로 합친 것이다.

```text
previous = 현재 시각
accumulator = 0
while (게임이 끝나지 않았다) {
    now = 현재 시각
    frameTime = min(now - previous, 0.25)    // 너무 긴 프레임은 자른다 (죽음의 소용돌이 방지)
    previous = now
    accumulator += frameTime * timeScale     // 타임 스케일

    processInput()
    while (accumulator >= DT) {              // 고정 타임스텝, 누산기
        prevState = currState
        currState = physicsStep(currState, DT)
        accumulator -= DT
    }
    alpha = accumulator / DT
    render(lerp(prevState, currState, alpha))  // 상태 보간
    present()                                  // 수직 동기화와 프레임 페이싱은 여기서
}
```

이 의사 코드는 흐름을 보여 주려는 것이고 실행하지는 않았다. 실제 엔진은 순서와 세부가 다르고, 타임 스케일을 어디에 곱하는지도 엔진마다 다르다.

<br/>

## 정리
| 기법 | 해결하는 문제 | 핵심 |
|------|-------------|------|
| 게임 루프 | 입력이 없어도 게임이 흘러가야 한다 | 입력 처리, 갱신, 그리기를 기다리지 않고 되풀이 |
| 델타 타임 | 컴퓨터마다 속도가 달라진다 | 지난 프레임 이후 흐른 시간을 곱한다 |
| 고정 타임스텝 | 물리 결과가 컴퓨터마다 달라진다 | 물리는 늘 같은 걸음(예: 1/60초)으로 |
| 누산기와 상태 보간 | 들쭉날쭉한 프레임과 고정 걸음을 맞추고, 끊김을 없앤다 | 남은 시간을 모으고, 남은 비율로 두 상태를 섞어 그린다 |
| 틱 레이트 | 서버가 얼마나 자주 판정할지 | 서버의 고정 타임스텝. 높을수록 정확하지만 한 틱 예산이 준다 |
| 타임 스케일 | 슬로 모션, 일시정지 | 델타 타임에 배율을 곱한다 |
| 수직 동기화, 프레임 페이싱 | 화면 찢어짐과 끊김 | 수직 공백에 맞춰 내보내고, 프레임 간격을 고르게 |

<br/>

## 근거 정리
| 주장 | 근거 | 확인 정도 |
|------|------|-----------|
| 게임 루프의 목적, 세 단계, 이벤트 루프와의 차이, 가변 타임스텝의 단점, 외삽 렌더링 | Nystrom, Game Programming Patterns, Game Loop 장 | 직접 확인 |
| 가변 델타 타임이 물리에 주는 문제, 누산기, 죽음의 소용돌이, 0.25초 제한, alpha 보간 | Fiedler, Fix Your Timestep! (2004) | 직접 확인 |
| deltaTime의 뜻, maximumDeltaTime 기본값 1/3초와 물리 한계, fixedDeltaTime 기본 0.02초, timeScale 0일 때의 동작 | Unity 문서 (Time 스크립트 레퍼런스, 시간과 프레임 레이트 관리 매뉴얼, Unity 6000.6) | 직접 확인. fixedDeltaTime 기본값은 timeScale 페이지 예시 코드 주석에서 확인 |
| 128틱을 고른 이유, 7.8125ms를 코어당 세 판으로 나누고 10%를 남긴 2.34ms 예산 | Riot Games, VALORANT's 128-Tick Servers (2020) | 직접 확인 |
| 찢어짐의 정의, 프레임 페이싱의 정의, 49/16/33ms 예, 끊김 | Android 개발자 문서, Frame Pacing | 직접 확인 |
| SyncInterval 0과 1~4의 뜻, bitblt 모델과 플립 모델의 차이 | Microsoft Learn, IDXGISwapChain::Present, Variable refresh rate displays | 직접 확인 |
| 코드 예시의 출력 | 파이썬으로 직접 실행 | 실행해서 확인 |
| 서버 틱을 고정 타임스텝으로 보는 대응, 보간의 지연과 부드러움 득실, 외삽에 지연이 없다는 점, 따라잡기를 포기하는 선택, 일시정지 중 메뉴가 움직이는 이유, 수직 동기화의 대기와 지연, 고른 30fps가 더 부드러울 수 있다 | 위 자료의 정의에서 이끔 | 내 정리 |
| 틱 레이트 표의 간격 | 1000 ÷ 틱 레이트 계산 | 계산 |

<br/>

## 참고 자료
- Robert Nystrom, [Game Programming Patterns, Game Loop](https://gameprogrammingpatterns.com/game-loop.html) (2026-11-25 확인)
- Glenn Fiedler, [Fix Your Timestep!](https://gafferongames.com/post/fix_your_timestep/), 2004-06-10 (2026-11-25 확인)
- Unity 문서 (Unity 6000.6, 2026-11-25 확인)
  - [Time.deltaTime](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/time/deltatime)
  - [Time.fixedDeltaTime](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/time/fixeddeltatime)
  - [Time.timeScale](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/time/timescale)
  - [Managing time and frame rate](https://docs.unity.com/en-us/engine/current/manual/scripting/managing-time-and-frame-rate)와 하위 페이지 Fixed updates, Handling variation in time
- Brent Randall, [VALORANT's 128-Tick Servers](https://www.riotgames.com/en/news/valorants-128-tick-servers), Riot Games, 2020-08-31 (2026-11-25 확인)
- Android Developers, [Frame Pacing](https://developer.android.com/games/sdk/frame-pacing) (2026-11-25 확인)
- Microsoft Learn, [IDXGISwapChain::Present](https://learn.microsoft.com/en-us/windows/win32/api/dxgi/nf-dxgi-idxgiswapchain-present) (2026-11-25 확인). 가변 주사율은 목차 TODO로 미뤘고, 관련 문서 [Variable refresh rate displays](https://learn.microsoft.com/en-us/windows/win32/direct3ddxgi/variable-refresh-rate-displays)는 그때 쓴다
- 읽지 못한 자료: Valve Developer Wiki의 Source Multiplayer Networking(접근 거부), Vulkan 명세의 VkPresentModeKHR(접근 거부)

<br/>

[목차](../README.md)
