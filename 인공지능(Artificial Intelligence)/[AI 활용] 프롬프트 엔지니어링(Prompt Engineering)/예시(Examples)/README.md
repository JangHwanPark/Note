## 좋은 프롬프트 예시란 ?
- [프롬프트 엔지니어링](../README.md) 문서에서 본 기법을 실제 프롬프트로 옮긴 예시 모음
- 예시마다 공식 문서에 나온 원문 예시(피할 예, 고친 예)를 먼저 두고, 같은 원리를 개발 작업에 적용한 예를 이어 붙였다
- 원문은 Anthropic의 [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) 문서(참고 자료 1)에서 가져왔다. 2026-10-21에 확인한 내용이다. 이 문서가 기법 전체를 담은 기준 문서라는 안내는 개요 문서(참고 자료 2)에 있고, 예시가 더 많은 실습 자료로는 참고 자료 3이 있다

### 좋은 프롬프트의 기준
Anthropic 문서는 기준을 한 문장으로 준다. 작업을 잘 모르는 동료에게 프롬프트를 보여 주고 그대로 해 보라고 했을 때, 동료가 헷갈린다면 모델도 헷갈린다는 것이다(참고 자료 1, Golden rule). 모델을 똑똑하지만 우리 팀의 규칙과 사정을 모르는 신입 사원으로 생각하라고도 한다.
아래 예시들은 모두 이 기준을 염두에 두고 썼다.

<br/>

## 1. 분명하고 구체적으로 쓰기
### 원문 예시
문서는 대시보드를 만들어 달라는 요청을 예로 든다(참고 자료 1, Be clear and direct).

```text
피할 예
Create an analytics dashboard

고친 예
Create an analytics dashboard. Include as many relevant features and interactions as possible.
Go beyond the basics to create a fully-featured implementation.
```

기본 이상의 결과를 원하면, 모델이 짐작하기를 바라지 말고 그렇게 해 달라고 직접 말하라는 것이 요점이다.

### 적용 예
```text
피할 예
로그인 페이지 만들어 줘.

고친 예
Next.js App Router로 로그인 페이지를 만들어 줘.
- 이메일, 비밀번호 입력과 로그인 버튼
- 입력이 비었거나 형식이 틀리면 입력창 아래에 오류 문구를 보여 줄 것
- 로그인 중에는 버튼을 비활성화하고 로딩 표시
- 스타일은 Tailwind CSS, 접근성을 위해 label을 꼭 연결할 것
```

단계의 순서가 중요하거나 하나도 빠지면 안 될 때는 번호나 글머리표로 나눠 적으라는 것도 같은 절의 조언이다(참고 자료 1).

<br/>

## 2. 이유를 함께 말하기
### 원문 예시
문서는 규칙만 던지지 말고 왜 그래야 하는지를 함께 알려 주라고 한다(참고 자료 1, Add context to improve performance).

```text
피할 예
NEVER use ellipses

고친 예
Your response will be read aloud by a text-to-speech engine, so never use ellipses
since the text-to-speech engine will not know how to pronounce them.
```

고친 예에는 말줄임표를 쓰지 말라는 규칙에, 음성 변환 엔진이 읽지 못한다는 이유가 붙어 있다. 문서는 모델이 이 설명을 바탕으로 비슷한 경우까지 스스로 넓혀 판단한다고 설명한다.

### 적용 예
```text
피할 예
커밋 메시지에 마크다운 쓰지 마.

고친 예
커밋 메시지는 터미널의 git log로 읽히므로, 표나 ## 같은 마크다운 장식 없이 plain text 한 줄로 써 줘.
```

이유를 함께 주면, 규칙에 일일이 적지 않은 굵게 표시나 코드 블록 같은 장식도 같은 이유로 피해 달라는 뜻까지 전할 수 있다.

<br/>

## 3. 하지 말 것보다 할 것을 말하기
### 원문 예시
출력 형식을 정할 때는 금지보다 원하는 모습을 말하는 편이 낫다고 한다(참고 자료 1, Control the format of responses).

```text
피할 예
Do not use markdown in your response

고친 예
Your response should be composed of smoothly flowing prose paragraphs.
```

같은 절에서, 프롬프트 자체의 형식이 답의 형식에 영향을 준다고도 말한다. 답에 마크다운이 너무 많으면 프롬프트에서 마크다운을 줄여 보라는 것이다.

### 적용 예
```text
피할 예
너무 길게 쓰지 마.

고친 예
세 문장 이내로, 결론을 첫 문장에 써 줘.
```

<br/>

## 4. 예시 주기, 퓨샷 (Few-shot)
### 원문 조언
퓨샷의 뜻은 [프롬프트 엔지니어링](../README.md) 문서에 있다. 문서는 예시가 출력의 형식, 말투, 구조를 이끄는 가장 믿을 만한 방법 가운데 하나라고 한다(참고 자료 1, Use examples effectively). 예시는 아래 세 가지를 갖추라고 한다.

- 실제 쓰임과 닮을 것(Relevant)
- 경계 상황(Edge Case)을 포함하고 서로 충분히 다를 것(Diverse). 비슷한 예시만 주면 모델이 의도하지 않은 패턴까지 따라 한다
- `<example>` 태그로 감싸 지시와 구분할 것(Structured)

개수는 3~5개를 권한다.

### 적용 예
```text
아래 예시처럼 버그 리포트를 한 줄 제목으로 요약해 줘.

<examples>
<example>
리포트: 결제 버튼을 두 번 누르면 결제가 두 번 됩니다.
제목: 결제 버튼 중복 클릭 시 이중 결제
</example>
<example>
리포트: 다크 모드에서 안내 문구가 배경과 같은 색이라 안 보여요.
제목: 다크 모드 안내 문구 색 대비 부족
</example>
<example>
리포트: 아무 문제 없는데 그냥 느린 것 같아요.
제목: 체감 속도 저하 (재현 조건 확인 필요)
</example>
</examples>

리포트: 프로필 사진을 바꾸면 새로고침 전까지 예전 사진이 보여요.
제목:
```

세 번째 예시는 정보가 부족한 경계 상황이다. 이런 예시를 넣어 두면, 정보가 모자랄 때 지어내지 말고 확인 필요라고 쓰라는 것까지 보여 줄 수 있다.

<br/>

## 5. 구조 나누기
### 원문 조언
지시, 배경, 예시, 입력이 섞인 프롬프트는 종류마다 다른 태그(`<instructions>`, `<context>`, `<input>` 등)로 감싸면 잘못 읽을 일이 줄어든다(참고 자료 1, Structure prompts with XML tags). 태그 이름은 일관되고 내용을 드러내게 짓고, 내용에 위아래가 있으면 태그를 중첩하라고 한다.

### 적용 예
```text
<context>
사내 디자인 시스템의 Button 컴포넌트다. variant는 primary, secondary 두 가지만 있다.
</context>

<instructions>
아래 코드에 ghost variant를 추가해 줘. 기존 variant의 동작은 바꾸지 말 것.
</instructions>

<input>
...Button.tsx 코드...
</input>
```

<br/>

## 6. 긴 자료는 위에, 질문은 아래에
### 원문 조언
2만 토큰이 넘는 긴 자료를 다룰 때는 문서를 프롬프트 위쪽에 두고, 질문과 지시는 맨 아래에 두라고 한다(참고 자료 1, Long context prompting). 문서는 테스트에서 질문을 끝에 두었을 때 답의 질이 최대 30%까지 좋아졌고, 여러 문서를 함께 넣는 복잡한 입력에서 특히 그랬다고 적고 있다.
여러 문서를 넣을 때는 문서마다 `<document>` 로 감싸고 출처를 `<source>` 에 적는 구조를 예로 든다. 아래는 문서 예시의 앞부분이다.

```text
<documents>
  <document index="1">
    <source>annual_report_2023.pdf</source>
    <document_content>
      {{ANNUAL_REPORT}}
    </document_content>
  </document>
</documents>
```

### 적용 예
```text
<documents>
  <document index="1">
    <source>api-spec.md</source>
    <document_content>...API 명세...</document_content>
  </document>
  <document index="2">
    <source>error-log.txt</source>
    <document_content>...에러 로그...</document_content>
  </document>
</documents>

위 명세와 로그를 보고, 로그의 401 오류가 명세의 어느 인증 규칙을 어긴 것인지 찾아 줘.
```

<br/>

## 7. 해 달라는 것인지, 제안해 달라는 것인지
### 원문 예시
문서는 파일 수정 같은 도구를 쓸 수 있는 환경에서, 최신 모델이 지시를 정확히 따르도록 학습되어 "제안해 줄 수 있어?"라고 물으면 실제로 고치지 않고 제안만 할 때가 있다고 한다(참고 자료 1, Tool usage).

```text
피할 예 (제안만 한다)
Can you suggest some changes to improve this function?

고친 예 (실제로 고친다)
Change this function to improve its performance.
```

### 적용 예
제안만 받고 싶을 때도 마찬가지로 분명하게 말한다.

```text
코드는 고치지 말고, 이 함수의 성능 문제를 세 가지만 찾아 이유와 함께 알려 줘.
```

<br/>

## 8. 역할 주기
### 원문 예시
시스템 프롬프트(System Prompt)는 대화 전체에 앞서 모델에게 주는 기본 지시다. 시스템 프롬프트에 역할을 주면 동작과 말투가 그 쓰임에 맞춰지고, 한 문장만으로도 차이가 난다고 한다(참고 자료 1, Give Claude a role). 문서의 예는 아래 한 줄이다.

```text
You are a helpful coding assistant specializing in Python.
```

### 적용 예
```text
너는 신입 개발자에게 SQL을 가르치는 멘토다. 질문을 받으면 정답 쿼리를 바로 주지 말고, 힌트 두 개로 스스로 풀게 유도한다.
```

역할 한 줄에 목적과 하지 않을 일을 붙이면, 역할이 말투뿐 아니라 판단 기준까지 정해 준다.

<br/>

## 기법 요약
| 기법 | 한 줄 요약 | 원문 절 |
| --- | --- | --- |
| 분명하고 구체적으로 쓰기 | 원하는 결과와 조건을 직접 적는다 | Be clear and direct |
| 이유를 함께 말하기 | 규칙에 왜 필요한지를 붙인다 | Add context to improve performance |
| 하지 말 것보다 할 것 말하기 | 금지 대신 원하는 모습을 적는다 | Control the format of responses |
| 예시 주기 | 서로 다른 예시 3~5개를 태그로 감싼다 | Use examples effectively |
| 구조 나누기 | 지시, 배경, 입력을 다른 태그에 넣는다 | Structure prompts with XML tags |
| 긴 자료는 위, 질문은 아래 | 자료는 위, 질문은 아래 | Long context prompting |
| 해 달라는지 제안해 달라는지 | 고쳐 달라는지 제안해 달라는지 적는다 | Tool usage |
| 역할 주기 | 시스템 프롬프트에 역할과 목적을 적는다 | Give Claude a role |

<br/>

## 참고 자료
1. Anthropic, [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), 공식 문서, 2026-10-21 확인
2. Anthropic, [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview), 공식 문서, 2026-10-21 확인
3. Anthropic, [Prompt engineering interactive tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial), GitHub. 예시가 많은 실습 자료지만 Claude 3 모델 기준이라, 최신 모델과 다른 부분은 참고 자료 1을 따르라고 안내한다(참고 자료 2)
