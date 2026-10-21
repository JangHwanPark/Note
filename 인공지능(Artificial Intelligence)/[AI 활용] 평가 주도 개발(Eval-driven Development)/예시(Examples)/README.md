## 평가 주도 개발 예시란 ?
- [평가 주도 개발](../README.md) 문서에서 본 순서(성공 기준, 평가 문제 묶음, 채점 방법, 바꿀 때마다 다시 돌리기)를 실제로 어떻게 하는지 보여 주는 예시 모음
- 단계마다 원문에 나온 예를 먼저 옮기고 적용 예를 이어 붙였다. 이 노트 레포에서 실제로 만들어 돌려 본 것은 그렇다고 밝혔고, 나머지는 설명을 위해 만든 예다
- 원문은 Anthropic 공식 문서 [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)(참고 자료 1), Braintrust의 [Eval-driven development](https://www.braintrust.dev/articles/eval-driven-development)(참고 자료 2), LLM 평가자 논문(참고 자료 3)에서 가져왔다. 2026-10-21에 확인한 내용이다

### 좋은 평가의 기준
Anthropic 문서는 평가를 설계할 때 세 가지를 지키라고 한다(참고 자료 1).

- 작업에 맞출 것: 실제로 들어올 입력의 분포를 닮게 만들고, 경계 상황을 빠뜨리지 않는다
- 되도록 자동으로 채점할 것: 객관식, 문자열 일치, 코드 채점, LLM 채점처럼 자동으로 채점할 수 있는 형태로 문제를 만든다
- 질보다 양: 사람이 손으로 채점한 질 높은 문제 몇 개보다, 신호가 조금 약해도 자동으로 채점하는 문제 여러 개가 낫다

<br/>

## 1. 성공 기준 쓰기
### 원문 예
문서는 좋은 성공 기준이 구체적이고(Specific), 측정할 수 있고(Measurable), 이룰 수 있고(Achievable), 쓰임에 맞아야(Relevant) 한다고 한다(참고 자료 1). 감정 분석 모델의 예는 아래와 같다.

```text
나쁜 기준
모델이 감정을 잘 분류해야 한다

좋은 기준
감정 분석 모델은 다양한 트위터 글 10,000개로 이루어진 따로 떼어 둔 시험 세트에서
F1 점수 0.85 이상을 내야 한다. 이는 현재 기준보다 5% 나아진 값이다.
```

좋은 기준의 각 부분이 네 성질에 대응한다. F1 0.85는 측정할 수 있고 구체적이며, 다양한 트위터 글은 쓰임에 맞고, 현재보다 5% 나아진 값은 이룰 수 있는 목표다. F1 점수는 정밀도(precision)와 재현율(recall)의 조화 평균이다. 정밀도는 모델이 긍정이라고 고른 것 가운데 실제로 긍정인 비율, 재현율은 실제 긍정 가운데 모델이 찾아낸 비율이다.

### 적용 예
```text
나쁜 기준
노트 문체 검사 훅이 잘 동작해야 한다

좋은 기준
문체 검사 훅은 맡은 네 규칙(이모지, 금지어, 콜론 줄바꿈, 코드 스팬 뒤 대시)에 걸리는 문장은 막고,
제목 줄 끝의 콜론, 화살표 기호, 코드 블록 안의 콜론처럼 허용하는 경우는 막지 않아야 한다. 아래 평가 문제 8개를 모두 통과해야 하고, 훅을 고칠 때마다 다시 돌린다.
```

<br/>

## 2. 평가 문제 묶음과 채점 방법 고르기
### 원문 예
문서는 성공 기준마다 평가 문제와 채점 방법을 짝지은 예를 든다(참고 자료 1).

| 기준 | 평가 방식 | 채점 방법 | 평가 문제 묶음 |
| --- | --- | --- | --- |
| 작업 충실도 (감정 분석) | 정답과 정확히 일치 | 코드로 문자열 비교 | 사람이 감정을 표시한 트윗 1,000개 |
| 일관성 (FAQ 봇) | 코사인 유사도 | 문장 임베딩(SBERT) | 표현만 바꾼 질문 몇 개씩으로 된 묶음 50개 |
| 관련성과 일관된 흐름 (요약) | ROUGE-L | 참고 요약과 겹치는 가장 긴 부분 수열 | 참고 요약이 있는 기사 200개 |
| 말투 (고객 상담) | LLM 채점 | LLM이 리커트 척도(Likert scale) 1~5점으로 매김 | 목표 말투가 정해진 고객 문의 100개 |
| 개인 정보 보호 (의료 챗봇) | LLM 채점, 예 또는 아니오 | 답에 개인 건강 정보가 있는지 LLM이 판단 | 일부에 개인 건강 정보가 든 가상의 환자 질문 500개 |

SBERT(Sentence-BERT)는 문장을 숫자 벡터(임베딩)로 바꾸는 모델이고, 코사인 유사도는 두 벡터의 방향이 얼마나 같은지 잰 값이다. ROUGE-L은 참고 요약과의 최장 공통 부분 수열(Longest Common Subsequence)로 겹침을 잰다.
가장 단순한 정확히 일치 채점은 모델 출력의 앞뒤 공백을 지우고 둘 다 소문자로 바꾼 뒤 정답과 같은지 본다. 문서의 코드는 아래와 같다.

```python
def evaluate_exact_match(model_output, correct_answer):
    return model_output.strip().lower() == correct_answer.lower()
```

채점 방법은 세 가지로 나눈다. 고를 때는 가장 빠르고, 믿을 만하고, 늘리기 쉬운 방법을 고르라고 한다(참고 자료 1).

- 코드 채점: 가장 빠르고 믿을 만하고 크게 늘리기 쉽지만, 규칙으로 정하기 어려운 판단에는 섬세함이 모자란다
- 사람 채점: 가장 유연하고 질이 높지만 느리고 비싸다. 되도록 피한다
- LLM 채점: 빠르고 유연하며 복잡한 판단에도 쓸 수 있다. 먼저 믿을 만한지 시험한 뒤 늘린다

### 이 레포의 예
이 레포의 문체 검사 훅(`.claude/hooks/check-note-style.js`)은 정답이 분명한 일이라 코드 채점이 맞다. 훅이 막아야 하는지 아닌지를 정답으로 적은 문제 8개를 만들었다. 이모지는 코드 블록 안에서도 훅에 걸리고 금지어는 문서에 쓰지 않기로 해서, 둘 다 유니코드 이스케이프로 적었다. 8번의 ``` 은 백틱이다.

```javascript
const cases = [
  { text: '변수는 값에 붙인 이름표다.', expected: false },
  { text: '좋은 예시다 \u{1F600}', expected: true },
  { text: '긴 문서를 \uCCAD\uD06C로 나눈다.', expected: true },
  { text: '`open()` - 파일을 연다', expected: true },
  { text: '자주 쓰는 메서드는 다음과 같다:', expected: true },
  { text: '## 목차:', expected: false },
  { text: '왼쪽 ↔ 오른쪽', expected: false },
  { text: '\x60\x60\x60\nlabel:\n\x60\x60\x60', expected: false },
];
```

평범한 문장(1번), 막아야 할 문장(2~5번), 막으면 안 되는 경계 상황(6~8번)을 섞었다. 6~8번이 원문이 말한 경계 상황이다. 그중 7번의 화살표 기호는 훅이 실제로 잘못 막았던 경우다.

<br/>

## 3. 바꿀 때마다 다시 돌리기
### 원문 예
Braintrust 글은 실험마다 평가 문제 묶음의 버전, 프롬프트 버전, 모델 설정, 채점 설정을 함께 기록하고, 어느 문제의 점수가 얼마나 떨어졌는지 나란히 비교해 보여 준다고 한다(참고 자료 2). 글이 든 예시 수치는 아래와 같다.

- 프롬프트를 바꿨더니 정확도가 3% 오르고 완성도가 1% 내려서, 팀은 전체로는 나아졌다고 판단했다
- 모델을 바꿨더니 말투 점수가 0.85에서 0.72로 떨어졌고, 프롬프트를 고쳐 정확도를 해치지 않고 0.88로 되돌렸다

한 번에 한 점수만 보지 않고, 여러 기준의 점수를 함께 보고 판단한다는 것이 요점이다.

### 이 레포의 예
위 8문제를 Node.js 22.13.0에서 지금의 훅에 돌린 결과다.

```text
PASS  case 1  expected=false got=false
PASS  case 2  expected=true got=true
PASS  case 3  expected=true got=true
PASS  case 4  expected=true got=true
PASS  case 5  expected=true got=true
PASS  case 6  expected=false got=false
PASS  case 7  expected=false got=false
PASS  case 8  expected=false got=false
8/8 passed
```

1~5번은 그대로 통과해서 6~8번만 옮긴다. 이번에는 훅을 고쳤다고 치고, 이모지 판정을 그림 문자 전체(`/\p{Extended_Pictographic}/u`)로 넓힌 사본에 같은 평가를 돌렸다.

```text
PASS  case 6  expected=false got=false
FAIL  case 7  expected=false got=true
PASS  case 8  expected=false got=false
7/8 passed
```

`↔` 같은 화살표도 그림 문자 범위에 들어 있어서, 판정을 넓히면 7번을 잘못 막는다. 한 번 겪은 실수를 평가 문제로 남겨 두면, 같은 실수로 되돌아가는 회귀(regression)가 생겼을 때 다시 돌리기만 해도 바로 잡힌다. 이 훅은 실제로 이 문제를 겪은 뒤, 그림 문자로 보이는 것만 잡도록 판정을 좁혀 둔 상태다([하네스 엔지니어링 예시](../../%5BAI%20활용%5D%20하네스%20엔지니어링(Harness%20Engineering)/예시(Examples)/README.md) 3절).

<br/>

## 4. LLM에게 채점 맡기기
### 원문 예
정답 하나로 채점하기 어려운 결과는 LLM에게 채점을 맡긴다. 문서는 LLM 채점의 요령을 세 가지 든다(참고 자료 1).

- 자세하고 분명한 채점 기준표(rubric)를 줄 것. 예를 들면 "답은 첫 문장에 항상 'Acme Inc.'를 언급해야 한다. 그렇지 않으면 자동으로 오답이다"처럼 쓴다
- 결과를 실증적이고 구체적으로 내게 할 것. '정답'이나 '오답'만 내게 하거나 1~5점으로 매기게 한다. 순수하게 서술로만 된 평가는 빠르게, 많이 판단하기 어렵다
- 이유를 먼저 따져 보게 할 것. 생각(thinking)을 켠 채점 모델을 쓰면 점수를 내기 전에 이유를 따져 보게 되어, 복잡한 판단일수록 채점 성능이 오른다

문서의 채점 프롬프트는 아래와 같다.

```text
Grade this answer based on the rubric:
<rubric>{rubric}</rubric>
<answer>{answer}</answer>
Output 'correct' or 'incorrect' in <result> tags.
```

LLM 평가자 논문은 GPT-4 같은 강한 LLM 평가자가 사람의 선호와 80% 넘게 일치해, 사람끼리 일치하는 수준과 비슷했다고 보고한다. 동시에 LLM 평가자에게 위치 편향(position bias), 장황함 편향(verbosity bias), 자기 강화 편향(self-enhancement bias)이 있다고 짚는다(참고 자료 3). 답이 놓인 순서, 답의 길이, 자기가 쓴 답인지에 따라 점수가 기우는 경향이다.

### 이 레포의 예
이 레포의 `note-reviewer` 에이전트는 채점 기준표가 정해진 LLM 평가자에 가깝다. CLAUDE.md와 글쓰기 가이드가 기준표 역할을 한다. 다만 점수가 아니라 지적 목록을 돌려주고, 같은 문제 묶음에 반복해 돌리지는 않아서 평가 주도 개발의 평가라기보다 한 번의 검토다. 고친 뒤 다시 평가받지 않는 점은 [워크플로와 에이전트 예시](../../%5BAI%20활용%5D%20워크플로와%20에이전트(Workflow%20and%20Agent)/예시(Examples)/README.md) 5절에서 본 것과 같다.
리뷰 에이전트도 틀린 적이 있다([하네스 엔지니어링 예시](../../%5BAI%20활용%5D%20하네스%20엔지니어링(Harness%20Engineering)/예시(Examples)/README.md) 5절). 상위 문서에서 말한, 채점하는 LLM도 틀리므로 사람이 일부를 다시 봐야 한다는 점에 해당한다.

<br/>

## 5. CI에 붙이기
### 원문 예
Braintrust 글은 GitHub Action으로 PR(Pull Request)마다 평가를 돌리고, 지표가 기준 아래로 떨어지면 변경을 막는 흐름을 소개한다(참고 자료 2). 말투가 5% 오르는 대신 정확도가 2% 내려가는 변경은 통과시키고, 정확도가 더 크게 떨어지면 배포를 막는 식으로 기준을 정하는 예를 든다.

### 적용 예
위 훅 평가를 CI(Continuous Integration, 지속적 통합)에 붙인다면, 평가 문제가 하나라도 실패하면 0이 아닌 종료 코드로 끝나게 하고, 그 결과로 머지를 막는다. 아래는 설명을 위해 만든 GitHub Actions 설정이다. 이 레포에는 아직 CI가 없고, 평가 스크립트도 레포 밖에서 만들어 돌렸을 뿐 커밋하지 않았다. 아래 경로는 커밋한다고 치고 적은 것이다.

```yaml
name: hook-eval
on: pull_request
jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node evals/hook-eval.js .claude/hooks/check-note-style.js
```

이 설정이 실패를 알아차리려면 평가 스크립트가 실패했을 때 `process.exit(1)` 로 끝나도록 한 줄을 더해야 한다.

<br/>

## 단계 요약
| 단계 | 한 줄 요약 | 적용 예 |
| --- | --- | --- |
| 성공 기준 | 구체적이고, 측정할 수 있고, 이룰 수 있고, 쓰임에 맞게 | 훅 평가 기준 (만든 예) |
| 평가 문제와 채점 | 경계 상황을 섞고, 되도록 코드로 채점 | 이 레포의 훅 평가 8문제 |
| 다시 돌리기 | 바꿀 때마다 같은 평가, 여러 점수를 함께 | 판정을 넓힌 사본에서 7번 실패 (이 레포에서 실행) |
| LLM 채점 | 기준표, 구체적인 출력, 이유 먼저 | 이 레포의 note-reviewer (한 번의 검토) |
| CI에 붙이기 | 점수가 떨어지면 머지를 막기 | GitHub Actions 설정 (만든 예) |

<br/>

## 참고 자료
1. Anthropic, [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests), 공식 문서, 2026-10-21 확인
2. Braintrust, [Eval-driven development](https://www.braintrust.dev/articles/eval-driven-development), 2026-10-21 확인
3. Zheng 외, [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685), arXiv, 2023, 2026-10-21 확인
