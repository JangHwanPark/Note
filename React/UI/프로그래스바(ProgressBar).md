프로그래스 바(progress bar)는 진행 상태를 시각적으로 나타내는 요소이다.

## 기본 프로그래스 바 (Tailwind)
- progress 값을 width로 사용하여 동적으로 업데이트 
- transition-all duration-300으로 부드러운 애니메이션 추가
```js
const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-4">
      <div
        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
```

## 상태 기반 프로그래스 바 (React useState)
- useState로 프로그래스 값을 관리 
- useEffect에서 setInterval을 사용하여 1초마다 10% 증가 
- transition-all duration-500으로 부드러운 증가 효과
```js
import { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center mt-2">{progress}%</p>
    </div>
  );
};

export default ProgressBar;
```

## 애니메이션 효과 추가 (GSAP)
GSAP를 사용하면 부드러운 애니메이션 효과를 추가할 수 있음.
```js
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration: 0.5,
      ease: "power1.out",
    });
  }, [progress]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full bg-gray-300 rounded-full h-4 relative">
        <div
          ref={barRef}
          className="absolute left-0 top-0 bg-blue-500 h-4 rounded-full"
          style={{ width: "0%" }}
        ></div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setProgress((prev) => (prev < 100 ? prev + 20 : 100))}
      >
        진행
      </button>
    </div>
  );
};

export default ProgressBar;
```

## 원형 프로그래스 바 (Radial Progress)
- SVG와 strokeDasharray를 활용하여 원형 프로그래스 바 구현
- offset 값을 조정하여 진행 상태 반영
```js
const CircularProgress = ({ progress }: { progress: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="w-24 h-24" viewBox="0 0 120 120">
      <circle
        className="text-gray-300"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
      />
      <circle
        className="text-blue-500 transition-all"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-xl font-bold"
      >
        {progress}%
      </text>
    </svg>
  );
};
```

| 유형            | 	설명                     | 코드 적용             |
|---------------|-------------------------|-------------------|
| 기본 프로그래스 바    | 	단순한 진행 바 (width 조절)    | 	✅ Tailwind       |           
| 상태 기반 프로그래스 바 | 	useState로 값 관리, 자동 진행  | 	✅ React useState |     
| GSAP 애니메이션	   | 부드러운 애니메이션 효과	          | ✅ GSAP            |     
| 원형 프로그래스 바	   | SVG와 strokeDasharray 활용 | 	✅ SVG            |                                   