## 프로그래스 바란 ?
- 업로드, 설치, 단계 진행처럼 시간이 걸리는 작업이 얼마나 진행됐는지 막대나 원으로 보여 주는 UI 요소
- 진행률(0~100) 하나를 받아, 막대는 너비로, 원은 테두리 선의 길이로 바꿔 그린다
- 화면 낭독기(Screen Reader)도 진행률을 읽을 수 있도록 접근성 속성을 함께 단다

### 프로그래스 바 (Progress Bar)
Progress의 사전적 의미는 앞으로 나아감, 진행이다. Bar는 막대다.
UI에서는 작업이 앞으로 나아간 정도를 막대의 채워진 길이로 보여 주는 요소를 말한다. 온도계의 빨간 기둥처럼, 숫자를 읽지 않아도 얼마나 찼는지 기둥 길이로 한눈에 보이게 한다.

<br/>

## 왜 필요할까
오래 걸리는 작업 중에 화면에 아무 변화가 없으면 사용자는 멈췄는지 기다려야 하는지 알 수 없다. 진행률을 보여 주면 작업이 살아 있다는 것과 얼마나 남았는지를 함께 알릴 수 있다.

<br/>

## 기본 막대
바깥 막대는 회색 배경이고, 안쪽 막대의 `width` 를 진행률 퍼센트로 준다. 진행률이 바뀌면 React가 `width` 를 새 값으로 바꾸고, `transition` 이 그 사이를 부드럽게 채운다. `className` 의 클래스는 Tailwind CSS 클래스이고, `transition-all duration-300` 이 0.3초 전환을 준다. `label` 은 무엇의 진행률인지 알리는 이름이고, 아래 접근성 속성에서 설명한다.

```tsx
type ProgressBarProps = {
  progress: number;
  label: string; // 무엇의 진행률인지. 화면 낭독기가 읽는 이름
};

export const ProgressBar = ({ progress, label }: ProgressBarProps) => {
  const value = Math.min(Math.max(progress, 0), 100); // 0보다 작거나 100보다 큰 값은 끝으로 맞춘다

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      className="w-full bg-gray-300 rounded-full h-4"
    >
      <div
        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
```

### 접근성 속성
`div` 로 만든 막대는 화면 낭독기에게 그냥 빈 상자다. MDN의 progressbar 역할 문서에 따르면 아래 속성을 붙여야 진행 막대로 읽힌다.

- `role="progressbar"`: 이 요소가 진행 막대라고 알린다
- `aria-valuenow`: 현재 값. 진행률을 알 수 없는 상태라면 넣지 않는다
- `aria-valuemin`, `aria-valuemax`: 최솟값과 최댓값. 넣지 않으면 0과 100으로 보므로 0~100을 쓸 때는 생략해도 된다
- `aria-label` 또는 `aria-labelledby`: 무엇의 진행률인지 알리는 이름. 반드시 있어야 한다

MDN은 이런 속성을 직접 붙이기보다 HTML의 `<progress max="100" value="23">` 를 먼저 쓰라고 권한다. 기본 요소는 역할과 값이 이미 들어 있기 때문이다. 다만 `<progress>` 는 브라우저마다 모양을 바꾸는 방법이 달라서, 디자인을 자유롭게 하려고 `div` 로 만들 때 위 속성을 붙인다.

<br/>

## 상태로 진행률 바꾸기
진행률을 컴포넌트 안의 상태로 두고, 1초마다 10%씩 올리는 예시다. 실제로는 업로드 진행 이벤트 같은 곳에서 진행률을 받아 상태를 바꾼다.

```tsx
import { useEffect, useState } from "react";

export const AutoProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return; // 다 차면 타이머를 더 만들지 않는다

    const timer = setTimeout(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 1000);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full max-w-md mx-auto">
      <ProgressBar progress={progress} label="예시 작업 진행률" />
      <p className="text-center mt-2">{progress}%</p>
    </div>
  );
};
```

처음 코드는 `setInterval` 을 한 번 걸어 두고 값이 100이 되면 100을 계속 다시 넣었다. 화면은 같지만 다 찬 뒤에도 타이머가 매초 돌았다. 지금 코드는 진행률이 바뀔 때마다 타이머를 하나 걸고, 100에 닿으면 더 걸지 않는다. 정리 함수(cleanup function), 즉 `useEffect` 가 돌려주는 함수의 `clearTimeout` 은 컴포넌트가 사라질 때 남은 타이머를 지운다.

jsdom에서 렌더링해 3.5초 뒤 30%, 10.5초 뒤 100%가 되고 12.5초 뒤에도 100%에 머무는 것을 확인했다.

<br/>

## 원형 프로그래스 바
SVG 원의 테두리 선을 진행률만큼만 보이게 해서 만든다.

- `strokeDasharray` 는 테두리를 선과 빈칸이 번갈아 나오는 점선으로 만든다. 값으로 원 둘레를 주면 둘레만큼의 선, 둘레만큼의 빈칸이 반복되므로 처음에는 선 하나가 원 전체를 덮는다
- `strokeDashoffset` 은 이 점선 무늬를 얼마나 밀어 낼지다. 둘레 전체만큼 밀면 원 위에 빈칸만 남아 선이 안 보이고, 0이면 선이 원 전체를 덮는다
- 그래서 남은 비율만큼 밀면 된다. `offset = 둘레 - (진행률 / 100) × 둘레`

```tsx
export const CircularProgress = ({ progress }: { progress: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 원 둘레
  const value = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (value / 100) * circumference; // 남은 만큼 선을 밀어 숨긴다

  return (
    <svg className="w-24 h-24" viewBox="0 0 120 120" role="progressbar" aria-label="진행률" aria-valuenow={value}>
      <circle className="text-gray-300" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
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
        transform="rotate(-90 60 60)"
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold">
        {value}%
      </text>
    </svg>
  );
};
```

jsdom에서 렌더링해 계산된 값을 확인했다. 둘레는 `314.1592653589793` 이다.

```text
0%   → offset 314.1592653589793 (선이 안 보임)
25%  → offset 235.61944901923448
50%  → offset 157.07963267948966
100% → offset 0 (선이 다 보임)
```

SVG 원의 테두리는 원의 오른쪽 끝(3시 방향)에서 시작한다. 12시에서 시작하게 하려고 `transform="rotate(-90 60 60)"` 로 원의 중심(60, 60)을 기준으로 90도 돌렸다. 처음 코드에는 이 회전이 없어 3시 방향에서 채워졌다. 이 시작 위치는 SVG 명세 기준 지식이고, 이 노트에서 브라우저 화면으로 직접 확인하지는 않았다.

<br/>

## 세 가지 비교

| 유형 | 진행률이 바뀌는 곳 | 화면에 반영하는 방법 |
| --- | --- | --- |
| 기본 막대 | 부모가 넘겨준 `progress` props | 안쪽 막대의 `width` |
| 상태로 진행률 바꾸기 | 컴포넌트 안의 `useState` | 기본 막대에 그대로 넘김 |
| 원형 | 부모가 넘겨준 `progress` props (0~100으로 맞춤) | 원 테두리의 `strokeDashoffset` |

막대가 차오르는 움직임을 GSAP으로 직접 제어하는 방법은 [GSAP 프로그래스 바 애니메이션](../../../Libraries/GSAP/프로그래스%20바%20애니메이션(Progress%20Bar%20Animation).md)에 정리했다.

<br/>

## 더 볼 것 (TODO)
- 진행률을 알 수 없는 작업의 표시(indeterminate)
- 실제 파일 업로드 진행률과 연결하기
