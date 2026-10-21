## 스텝퍼란 ?
- 회원가입처럼 여러 단계로 나뉜 입력을 한 단계씩 안내하는 UI 컴포넌트
- 지금 몇 번째 단계인지 보여 주는 표시, 단계마다 바뀌는 내용, 이전과 다음 버튼으로 이루어진다
- React에서는 현재 단계 번호 하나를 상태로 두고, 화면의 세 부분이 모두 이 번호를 보고 그려진다

### 스텝퍼 (Stepper)
Step의 사전적 의미는 걸음, 계단의 한 단이다. Stepper는 한 걸음씩 나아가게 하는 것이라는 뜻이 된다.
UI에서는 긴 작업을 몇 개의 단계로 끊고, 사용자가 한 단계씩 앞뒤로 오가게 하는 컴포넌트를 말한다. 계단 옆에 붙은 층 표시판처럼 지금 몇 번째 단에 서 있고 몇 단이 남았는지를 알려 준다.

<br/>

## 왜 필요할까
입력할 항목이 많은 폼을 한 화면에 모두 늘어놓으면 사용자는 어디까지 했고 얼마나 남았는지 알기 어렵다. 단계로 나누면 한 번에 볼 항목이 줄고, 진행 표시 덕분에 끝이 어디인지 보인다.

<br/>

## 어떻게 동작할까
상태는 현재 단계 번호 `currentStep` 하나뿐이다. 나머지는 모두 이 값에서 계산한다.

- 단계 표시: `currentStep` 은 0부터 세고 화면에는 1을 더해 1, 2, 3으로 보여 준다. 각 단계의 배열 번호가 `currentStep` 이하이면 지나온 단계로 보고 색을 칠한다
- 단계별 내용: 단계 정보를 배열로 두고 `steps[currentStep]` 의 내용을 보여 준다
- 버튼: `currentStep` 이 첫 단계이면 이전 버튼을, 마지막 단계이면 다음 버튼을 비활성화한다

버튼을 누르면 `currentStep` 만 바꾸고, 화면을 다시 그리는 일은 React가 한다.

<br/>

## 구현
`className` 의 클래스는 Tailwind CSS 클래스다.

```tsx
import { useState } from "react";

const steps = [
  { title: "기본 정보", content: "기본 정보를 입력하세요." },
  { title: "추가 정보", content: "추가 정보를 입력하세요." },
  { title: "확인", content: "확인 후 제출하세요." },
];

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const nextStep = () => {
    if (!isLast) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (!isFirst) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 단계 표시 */}
      <ol className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <li
            key={step.title}
            aria-current={index === currentStep ? "step" : undefined}
            className="relative flex-1 text-center"
          >
            <div
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 ${
                index <= currentStep ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-gray-100 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <p className="mt-2 text-sm">{step.title}</p>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-1 ${
                  index < currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      {/* 단계별 내용 */}
      <div className="p-4 border rounded-md shadow-md bg-white">
        <p>{steps[currentStep].content}</p>
      </div>

      {/* 이전, 다음 버튼 */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          disabled={isFirst}
          className="px-4 py-2 rounded bg-gray-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          이전
        </button>
        <button
          onClick={nextStep}
          disabled={isLast}
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          다음
        </button>
      </div>
    </div>
  );
}
```

React 19, TypeScript 5.6 `strict` 에서 타입 검사를 통과했고, jsdom에서 렌더링해 처음에는 이전 버튼이 비활성화되고, 다음을 두 번 누르면 세 번째 내용이 보이면서 다음 버튼이 비활성화되는 것을 확인했다.

### 단계 표시
`steps` 배열을 `map` 으로 돌며 단계마다 동그라미 번호와 제목을 그린다. 지나온 단계와 현재 단계(`index <= currentStep`)는 파란색으로 칠하고, 단계 사이의 가로선은 `absolute` 로 띄워 이미 지나간 구간(`index < currentStep`)만 파랗게 만든다.

단계 목록은 순서가 있으므로 `ol` 로 감싸고, 현재 단계에는 `aria-current="step"` 을 붙여 화면 낭독기(Screen Reader)도 지금 단계를 알 수 있게 했다.

### 단계별 내용
처음 버전은 `currentStep === 0 && ...` 처럼 단계마다 조건을 하나씩 적었다. 단계가 늘어날 때마다 조건도 늘어나므로, 단계 정보를 `steps` 배열에 제목과 내용으로 함께 두고 `steps[currentStep].content` 로 꺼내도록 바꿨다. 단계를 추가할 때 배열에 한 줄만 더하면 된다.

실제 폼이라면 `content` 자리에 단계별 입력 컴포넌트를 넣는다.

### 이전, 다음 버튼
첫 단계에서 이전으로, 마지막 단계에서 다음으로 가면 배열 밖 번호가 된다. 그래서 버튼을 `disabled` 로 막고, 함수 안에서도 한 번 더 확인한다. 비활성 버튼의 회색 스타일은 Tailwind의 `disabled:` 변형으로 줬다.

<br/>

## 더 볼 것 (TODO)
- 단계마다 입력값을 검사하고, 통과해야 다음으로 넘어가게 하기
- 단계별 입력값을 부모에서 한곳에 모아 마지막에 제출하기
