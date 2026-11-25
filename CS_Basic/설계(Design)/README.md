## 설계란 ?
- 무엇을 만들기 전에 그것이 어떤 부분으로 이루어지고, 부분끼리 어떻게 맞물리는지 미리 정해 두는 일이다
- 정하는 활동(과정)과 그 결과로 남는 도면이나 문서(결과물)를 모두 설계라고 부른다
- 집을 짓기 전에 방 배치와 문 위치를 도면에 그려 두는 일과 같다. 그리는 일도, 그려진 도면도 설계라고 부른다
- 이 노트는 설계라는 단어의 어원에서 시작해, 공학 표준과 교과서가 설계를 어떻게 정의하는지, 그렇게 말하는 근거가 무엇인지까지 정리한다

<br/>

## 단어의 뜻
설계는 한자어 설계(設計)와 영어 design 두 갈래에서 뜻을 모은다. 두 단어가 강조하는 쪽이 달라서 함께 보면 설계가 무엇을 하는 일인지 잘 드러난다.

### 설계 (設計)
사전적 의미는 "계획을 세움. 또는 그 계획"이다(표준국어대사전 설계02 「1」). 건축이나 기계처럼 도면으로 나타내는 뜻풀이가 「2」로 더 있는 것으로 보이지만, 이번에 사전 화면에서 「2」의 문장은 확인하지 못했다(확인 필요).

한자를 나누어 보면 뜻이 더 분명하다.

- 設(베풀 설)은 무언가를 세우다, 차려 놓다라는 뜻이다
- 計(셀 계)는 수를 세다, 헤아리다라는 뜻이고, 여기서 꾀하다, 계획이라는 뜻이 나왔다. 계획(計劃), 계산(計算), 계략(計略)이 같은 글자를 쓴다

그래서 설계는 헤아린 것을 세워 둔다, 곧 셈을 미리 해서 틀을 잡아 둔다는 뜻으로 읽힌다(글자를 이렇게 풀어 읽는 것은 내 해석이다). 중국어 設計에는 디자인하다라는 뜻 말고도 계략을 꾸미다(to plot against someone)라는 뜻이 있다(Wiktionary 設計). 미리 짜 둔다는 점에서 두 뜻이 이어진다고 볼 수 있다(내 해석이다).

### 디자인 (Design)
영어 design의 어원은 라틴어 dēsignō다. dē-(아래로, 완전히)와 signō(표시하다)가 합쳐진 말이고, signō는 signum(표시, 기호)에서 왔다. 영어 sign(기호, 표지판)과 같은 뿌리다. Wiktionary 표기로는 라틴어 dēsignō에서 고대 프랑스어 designer, 중세 영어 designen을 거쳐 지금의 design이 되었다(Wiktionary design).

라틴어 dēsignō의 뜻은 아래처럼 넓다(Wiktionary dēsignō).

- 표시하다, 윤곽을 그리다(to mark, to trace out, to outline)
- 가리키다, 지정하다(to indicate, to designate)
- 고르다, 임명하다(to choose, to appoint)
- 정리하다, 계획하다(to order, to plan)

같은 어원에서 나온 영어 designate(지정하다)는 지금도 정해서 표시한다는 뜻을 그대로 갖고 있다.

### 두 단어가 만나는 곳
설계(設計)는 머릿속에서 미리 헤아리는 쪽을, design은 그 결과를 바깥에 표시해 보이는 쪽을 강조한다. 둘을 합치면 설계는 만들기 전에 미리 헤아려 정하고, 그것을 남이 볼 수 있게 그려 두는 일이 된다. 이 두 면이 아래 공학적 정의의 과정과 결과물에 그대로 이어진다(두 어원을 이렇게 맞대어 읽는 것은 내 해석이다).

한국어에서 design을 옮길 때 건축, 기계, 소프트웨어 쪽은 주로 설계라고 하고, 옷이나 화면의 모양을 다룰 때는 디자인이라고 소리 나는 대로 쓰는 경우가 많다. 같은 영어 단어가 헤아림을 강조하면 설계로, 보이는 모양을 강조하면 디자인으로 옮겨지는 셈이다(사전이 아니라 쓰임새를 보고 정리한 내 해석이다).

<br/>

## 공학에서 말하는 설계
### 표준의 정의
소프트웨어 공학 지식 체계(SWEBOK, Software Engineering Body of Knowledge)는 IEEE 컴퓨터 학회가 소프트웨어 공학의 기본 지식을 정리한 문서다. 그 3판(2014)의 소프트웨어 설계 장은 첫머리에서 용어 표준 ISO/IEC/IEEE 24765:2010을 출처로 들어 설계를 두 가지로 정의한다. 이 정의가 IEEE의 옛 용어 표준(IEEE Std 610.12-1990)에서 처음 나왔다는 설명이 여러 자료에 있지만, 610.12 원문은 확인하지 못했다(확인 필요).

- 시스템이나 구성 요소의 아키텍처, 구성 요소, 인터페이스, 그 밖의 특성을 정의하는 과정 ("the process of defining the architecture, components, interfaces, and other characteristics of a system or component")
- 그 과정의 결과 ("the result of [that] process")

아키텍처(Architecture)는 전체를 어떤 덩어리로 나누고 어떻게 배치하는지를, 인터페이스(Interface)는 덩어리끼리 만나는 지점을 말한다. 둘 다 아래에서 다시 나온다.

ISO/IEC/IEEE 24765:2010은 이 두 뜻을 1번과 2번으로 두고, 소프트웨어에 맞춘 뜻을 몇 가지 더 붙였다(시스템 공학 지식 체계 SEBoK의 Design 용어 항목이 옮긴 목록). 그중 하나는 설계를 요구사항 분석을 코딩, 디버깅과 잇는 활동("activity that links requirements analysis to coding and debugging")이라고 정의한다.

어원에서 본 두 면이 여기에 그대로 나타난다. 미리 헤아려 정하는 일이 과정이고, 그것을 표시해 둔 것이 결과다.

### 설계는 문제 해결이다
SWEBOK 3판은 일반적인 의미에서 설계를 "문제 해결의 한 형태(a form of problem solving)"로 볼 수 있다고 쓴다. 그리고 설계를 이해하는 데 도움이 되는 개념으로 목표, 제약, 대안, 표현, 해법(goals, constraints, alternatives, representations, and solutions)을 든다.

설계를 문제 해결로 보는 관점은 SWEBOK보다 훨씬 앞서 허버트 사이먼(Herbert Simon)이 넓게 펼쳤다. 사이먼은 『인공물의 과학(The Sciences of the Artificial)』(1969년 초판)에서 엔지니어만 설계하는 것이 아니라고 하며 이렇게 썼다.

> Everyone designs who devises courses of action aimed at changing existing situations into preferred ones.

지금의 상황을 더 바라는 상황으로 바꾸려고 행동 방침을 짜는 사람은 누구나 설계를 한다는 뜻이다. 이 문장은 여러 2차 자료에서 같은 문장으로 인용되지만, 원서의 쪽수는 직접 확인하지 못했다.

<br/>

## 왜 설계가 필요한가
### 고치는 비용이 뒤로 갈수록 커진다
이미 지은 것을 뜯어고치는 것보다 도면 단계에서 고치는 것이 싸다. 집을 지어 놓고 방 위치를 바꾸려면 벽을 허물어야 하지만, 도면에서는 선 몇 개를 다시 그리면 된다. 소프트웨어도 같다. 코드를 다 쓴 뒤에 부분 사이의 연결 방식을 바꾸면 그 연결을 쓰는 모든 곳을 고쳐야 한다. 이 절의 설명은 집 도면 예로 든 직관적인 정리다. 뒤로 갈수록 고치는 비용이 몇 배로 커진다는 수치 주장(흔히 Boehm, 1981을 근거로 든다)은 확인하지 못했고 반론도 있다고 알려져 있어 쓰지 않았다(확인 필요).

### 여러 사람이 같은 그림을 보고 일할 수 있다
설계의 결과물은 남이 볼 수 있게 표시해 둔 것이다(design의 어원이 표시하다였다). 그래서 만드는 사람이 여럿이어도 같은 도면을 기준으로 각자 맡은 부분을 만들 수 있다. 부분끼리 만나는 지점, 곧 인터페이스를 미리 정해 두었기 때문에 따로 만든 것을 나중에 맞출 수 있다. 이 절도 출처가 아니라 설계의 정의에서 이끌어 낸 내 정리다.

### 요구사항과 구현 사이에 다리가 필요하다
이런 기능이 필요하다는 요구사항에서 바로 코드로 가면 빈 곳이 많다. 어떤 부분으로 나눌지, 부분끼리 무엇을 주고받을지를 정하지 않은 채 쓰기 시작하기 때문이다. 앞의 표준 정의처럼 설계는 요구사항 분석을 코딩으로 잇는 활동이다. SWEBOK 3판도 설계를 요구사항 분석과 구현(construction) 사이에 들어가는 활동으로 설명한다("two activities that fit between software requirements analysis and software construction").

<br/>

## 설계는 어떻게 진행되나
SWEBOK 3판은 소프트웨어 설계를 두 활동으로 나눈다.

### 아키텍처 설계 (Architectural Design)
상위 설계(high-level design)라고도 한다. 소프트웨어를 어떤 구성 요소로 나누고, 그 요소들을 어떻게 배치하고 연결할지 정한다. 집으로 치면 방을 몇 개 두고 어느 방과 어느 방을 문으로 이을지 정하는 단계다.

### 상세 설계 (Detailed Design)
나눈 구성 요소 하나하나가 어떻게 동작해야 하는지를, 그대로 만들 수 있을 만큼 자세히 정한다. 집으로 치면 방마다 콘센트 위치와 창문 크기를 정하는 단계다. 함수 하나를 어떻게 나누고 무엇을 주고받게 할지는 [함수 설계 원리](../함수%20설계%20원리(Function%20Design%20Principles))에서 다룬다.

### 한 번에 끝나지 않는다
설계는 위에서 아래로 한 번 내려가고 끝나는 일이 아니다. 앞서 본 목표, 제약, 대안이라는 말처럼, 목표와 제약을 놓고 대안을 여러 개 떠올린 뒤 그중 하나를 고르고, 그 결과를 도면이나 문서로 표현한다. 고르다 보면 앞서 정한 것을 다시 바꿔야 할 때도 있다. 이 과정을 정해진 순서로 묘사한 것은 내 정리이고, 실제 진행 방식은 개발 방법론마다 다르다.

<br/>

## 근거 정리
이 노트의 주장과 근거를 짝지으면 아래와 같다.

| 주장 | 근거 | 확인 정도 |
|------|------|-----------|
| 설계(設計)는 계획을 세움, 그 계획 | 표준국어대사전 설계02 「1」 | 사전 검색 화면에서 직접 확인. 「2」는 확인하지 못함 |
| 중국어 設計에는 계략을 꾸미다라는 뜻도 있다 | Wiktionary 設計 | 직접 확인 |
| design은 라틴어 dēsignō(dē- + signō, 표시하다)에서 왔다 | Wiktionary design, dēsignō | 직접 확인. Etymonline은 접속이 막혀 읽지 못함 |
| 설계는 과정이자 그 결과다 | ISO/IEC/IEEE 24765:2010을 인용한 SWEBOK 3판 2장과 SEBoK | 표준 원문은 읽지 못하고 인용한 문서로 확인. IEEE 610.12-1990이 처음 출처라는 점은 확인 필요 |
| 설계는 문제 해결의 한 형태다 | SWEBOK 3판 2장 1.1절 | 직접 확인 |
| 누구나 설계를 한다 | 허버트 사이먼, 『인공물의 과학』 | 2차 자료의 인용으로 확인. 원서 쪽수는 확인하지 못함 |
| 설계는 요구사항 분석과 구현 사이에 있다 | SWEBOK 3판 2장 서론, ISO/IEC/IEEE 24765:2010 | SWEBOK은 직접 확인, 24765는 SEBoK으로 확인 |
| 아키텍처 설계와 상세 설계 두 활동 | SWEBOK 3판 2장 서론 | 직접 확인 |
| 도면 단계에서 고치는 것이 싸다, 같은 도면으로 나눠 일한다 | 없음 | 내 정리. 비용 배율 수치는 쓰지 않음 |
| 한자 풀이, 두 어원을 맞대어 읽은 부분, 설계와 디자인이라는 번역어 구분 | 없음 | 내 해석 |

<br/>

## 참고 자료
- 국립국어원, 표준국어대사전, 설계02 (2026-11-04 확인). 검색 결과 화면의 「1」 뜻풀이만 읽었다
- Wiktionary, [設計](https://en.wiktionary.org/wiki/%E8%A8%AD%E8%A8%88) (2026-11-04 확인)
- Wiktionary, [design](https://en.wiktionary.org/wiki/design) Etymology 절 (2026-11-04 확인)
- Wiktionary, [dēsignō](https://en.wiktionary.org/wiki/designo) (2026-11-04 확인)
- IEEE Computer Society, [SWEBOK Guide V3.0, Chapter 2: Software Design](https://swebokwiki.org/Chapter_2:_Software_Design) (2026-11-04 확인). 서론과 1.1, 1.2절, 참고 문헌 [1]을 읽었다. [1]인 ISO/IEC/IEEE 24765:2010 원문과 IEEE Std 610.12-1990 원문은 읽지 못했다
- SEBoK, [Design (glossary)](https://sebokwiki.org/wiki/Design_(glossary)) (2026-11-04 확인). ISO/IEC/IEEE 24765 원문은 읽지 못했다
- Herbert A. Simon, The Sciences of the Artificial, MIT Press, 1969 (3판 1996). 원서는 읽지 못했고 인용 문장은 [Encyclopedia.com의 소개 글](https://www.encyclopedia.com/education/applied-and-social-sciences-magazines/herbert-simon-helping-professionals-find-themselves) 등 여러 2차 자료에서 확인했다

<br/>

## 더 볼 것 (TODO)
- 요구사항(Requirements)이란 무엇이고 설계와 어떻게 나뉘는가
- 아키텍처(Architecture)와 설계의 차이
- 모듈화와 정보 은닉: 파나스(David Parnas)의 1972년 논문 「On the Criteria To Be Used in Decomposing Systems into Modules」
- 결합도(Coupling)와 응집도(Cohesion)
- 사악한 문제(Wicked Problem): 정답이 정해져 있지 않은 문제와 설계의 한계
- 프론트엔드에서의 설계(컴포넌트 설계, 화면 설계)는 별도 문서로 정리
