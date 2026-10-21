# Stepper 컴포넌트
Stepper(스탭퍼) 컴포넌트는 사용자가 다단계 폼을 진행할 때 단계별로 안내하는 UI 컴포넌트입니다.  
일반적으로 현재 진행 단계, 이전/다음 버튼, 단계별 콘텐츠를 포함합니다.

## 컴포넌트 원리
- 현재 단계(state)를 관리하여 어떤 단계가 활성화되었는지 확인한다. 
- 단계 진행/되돌리기 기능을 추가하여 사용자가 앞뒤로 이동할 수 있도록 한다. 
- 단계 표시 UI를 만들어 진행률을 나타낸다. 
- 내용(Content) 관리: 단계별로 다른 UI를 보여준다.

## 컴포넌트 구현
```ts
import { useState } from "react";

const steps = ["Step 1", "Step 2", "Step 3"];

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 스탭 UI */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="relative flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 
                ${index <= currentStep ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-gray-100 text-gray-400"}
              `}
            >
              {index + 1}
            </div>
            <p className="mt-2 text-sm">{step}</p>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-1 ${
                  index < currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* 단계별 내용 */}
      <div className="p-4 border rounded-md shadow-md bg-white">
        {currentStep === 0 && <p>Step 1: 기본 정보를 입력하세요.</p>}
        {currentStep === 1 && <p>Step 2: 추가 정보를 입력하세요.</p>}
        {currentStep === 2 && <p>Step 3: 확인 후 제출하세요.</p>}
      </div>

      {/* 버튼 */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded ${currentStep === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"}`}
        >
          이전
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`px-4 py-2 rounded ${currentStep === steps.length - 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
```
### 현재 단계(state) 관리
- useState를 사용하여 currentStep 상태를 관리한다. 
- nextStep(), prevStep() 함수를 통해 currentStep을 증가/감소한다.

### 단계 UI 표시
- steps 배열을 순회하여 각 단계별 UI를 생성한다. 
- 현재 단계 이하의 스탭은 border-blue-500 bg-blue-500 클래스를 적용하여 강조한다. 
- absolute를 사용하여 진행 상태를 나타내는 가로 선을 추가한다.

### 단계별 콘텐츠 출력
- currentStep 값에 따라 각 단계별 UI를 다르게 표시한다.

### 이전/다음 버튼
- currentStep === 0이면 "이전" 버튼을 비활성화. 
- currentStep === steps.length - 1이면 "다음" 버튼을 비활성화.