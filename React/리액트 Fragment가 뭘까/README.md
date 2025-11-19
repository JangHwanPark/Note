<React.Fragment>를 쓰는 것과 <> (단축 문법)를 쓰는 것의 가장 큰 차이점은 key 속성을 전달할 수 있는지 여부

key 속성 사용 여부
<React.Fragment key={...}>...</React.Fragment> (명시적 구문)
key 속성 전달 가능: 배열을 map() 등으로 순회하며 여러 Fragment를 렌더링할 때, 각 Fragment에 고유한 key를 지정해야 할 경우 이 명시적인 구문을 사용
React가 리스트의 항목을 효율적으로 식별하고 업데이트하는 데 필요

<>...</> (단축 구문)
key 속성 전달 불가: 이 단축 구문은 key를 포함한 어떠한 속성도 허용하지 않습니다.

두 구문 모두 DOM에 불필요한 추가 노드(<div> 등)를 생성하지 않고 여러 JSX 엘리먼트(자식)를 그룹화하기 위해 사용됩니다. 이는 유효하지 않은 HTML 구조(예: <table> 안에 <div> 없이 바로 <td>를 넣어야 하는 경우)를 피하거나, DOM 구조를 깔끔하게 유지하여 성능 및 스타일 관련 문제를 방지하는 데 도움을 줍니다.

map 함수 내에서 Fragment에 key를 추가하는 방법을 보여주는 영상입니다. React: Fragment에 Key를 추가하는 방법을 참고하시면 이 차이점을 더 잘 이해할 수 있습니다.
https://youtu.be/PlFu8_r1FTM?si=xzSLNDhLyoHfPJvk