## 인터랙션 패턴이란 ?
- 사용자의 스크롤, 클릭, 마우스 움직임에 화면이 반응하는 방식 가운데, 여러 웹사이트에서 되풀이해 쓰이는 형태
- 이름이 붙은 패턴을 알아 두면 디자인 시안을 보고 어떤 기능으로 만들지 빨리 정할 수 있다
- 이 장은 GSAP 자체가 아니라 GSAP으로 만들게 될 결과물의 목록이다. 패턴마다 GSAP의 어떤 기능을 쓰는지, GSAP 없이 CSS로 되는지를 함께 적었다

### 인터랙션 (Interaction)
사전적 의미는 상호 작용. 둘 이상이 서로 영향을 주고받는 것이다.
웹에서는 사용자가 무언가를 하면 화면이 그에 맞춰 반응하고, 그 반응을 보고 사용자가 다음 행동을 정하는 주고받음을 말한다. 한쪽에서만 움직이는 애니메이션과 달리 사용자의 입력이 출발점이다.

### 패턴 (Pattern)
사전적 의미는 되풀이되는 일정한 형태나 양식.
공학적으로는 자주 마주치는 문제에 대해 이미 검증된 해결 모양을 말한다. 옷 만들 때 쓰는 본처럼, 처음부터 고안하지 않고 본을 대고 상황에 맞게 고쳐 쓴다.

<br/>

## 스크롤 기반 패턴
스크롤 위치나 방향에 맞춰 화면이 바뀌는 패턴이다. GSAP에서는 대부분 ScrollTrigger 플러그인으로 만든다.

| 패턴 | 설명 | 만드는 방법 |
| --- | --- | --- |
| 패럴랙스 스크롤링 (Parallax Scrolling) | 배경과 전경이 서로 다른 속도로 움직여 깊이감을 준다 | ScrollTrigger의 `scrub` (13장) |
| 가로 스크롤 (Horizontal Scrolling) | 세로로 스크롤하면 내용이 가로로 지나간다 | ScrollTrigger의 `pin` 과 `scrub` (11장) |
| 스크롤 스냅 (Scroll Snapping) | 스크롤을 멈추면 가까운 섹션 시작점에 맞춰 선다 | CSS만으로 된다. 스크롤 컨테이너에 `scroll-snap-type`, 자식에 `scroll-snap-align` |
| 스크롤 진행 막대 (Scroll Progress Bar) | 페이지를 얼마나 읽었는지 막대로 보여 준다 | ScrollTrigger의 `scrub` 또는 `onUpdate` |
| 등장 효과 (Reveal on Scroll) | 요소가 화면에 들어올 때 나타난다 | ScrollTrigger (10장), IntersectionObserver로도 된다 |
| 고정 요소 (Sticky Elements) | 스크롤해도 요소가 한자리에 붙어 있다 | CSS `position: sticky` 로 된다 |
| 구간 고정 (Pin-to-Panel) | 정해진 구간 동안만 고정됐다가 풀린다 | ScrollTrigger의 `pin` (12장) |
| 스크롤 타임라인 (Scroll-based Timeline) | 스크롤이 진행되는 만큼 여러 애니메이션이 차례로 재생된다 | `gsap.timeline()` 에 ScrollTrigger의 `scrub` |

<br/>

## 애니메이션 패턴
| 패턴 | 설명 | 만드는 방법 |
| --- | --- | --- |
| 모핑 (Morphing) | 한 모양이 다른 모양으로 부드럽게 바뀐다 | SVG 경로를 바꾸는 GSAP의 MorphSVG 플러그인 |
| 로티 (Lottie) | 디자인 도구에서 만든 벡터 애니메이션을 그대로 재생한다 | GSAP이 아니라 별도 라이브러리(lottie-web) |
| 마이크로 인터랙션 (Micro-interactions) | 버튼을 누르거나 올렸을 때 작은 움직임으로 반응을 알려 준다 | `gsap.to()` 또는 CSS transition |
| 스플래시 화면 (Splash Screen) | 사이트에 처음 들어올 때 보여 주는 인트로 | `gsap.timeline()` |
| 페이지 전환 (Page Transition) | 페이지가 바뀔 때 이어지는 듯한 효과 | 프레임워크의 라우팅과 함께 써야 한다. Next.js 쪽은 [페이지 전환 애니메이션](../../../NextJS/페이지%20전환%20애니메이션(Page%20Transition)/README.md) |

<br/>

## 내비게이션 패턴
| 패턴 | 설명 | 만드는 방법 |
| --- | --- | --- |
| 고정 메뉴 (Sticky Navigation) | 스크롤해도 메뉴가 위에 남는다. 아래로 내리면 숨고 위로 올리면 나타나게 하기도 한다 | 숨김과 나타남은 3장의 헤더 예시 |
| 햄버거 메뉴 애니메이션 (Hamburger Menu Animation) | 세 줄 아이콘이 X로 바뀐다 | 선마다 `rotation`, `y` 를 바꾸는 `gsap.timeline()` |
| 화면 밖 메뉴 (Off-canvas Navigation) | 화면 바깥에 있던 메뉴가 밀려 들어온다 | `xPercent` 를 바꾸는 `gsap.to()` |
| 메가 메뉴 (Mega Menu) | 마우스를 올리면 큰 드롭다운이 펼쳐진다 | 펼침 효과에 `gsap.to()` |

<br/>

## 레이아웃 패턴
움직임보다 화면 배치에 가까운 패턴이다. 애니메이션은 등장 효과 정도로 곁들인다.

| 패턴 | 설명 |
| --- | --- |
| 카드 레이아웃 (Card-based Layout) | 정보를 카드 단위로 나눠 보여 준다 |
| 비대칭 레이아웃 (Asymmetrical Layout) | 반듯한 격자를 일부러 벗어난 배치 |
| 분할 스크롤 (Split Scrolling) | 화면을 나눠 각 부분이 따로 스크롤된다 |
| 큰 글씨 (Hero Typography) | 첫 화면에 아주 큰 글자를 둬 인상을 준다 |
| 글래스모피즘 (Glassmorphism) | 뒤가 흐리게 비치는 반투명 유리 느낌. CSS `backdrop-filter` 로 만든다 |

<br/>

## 로딩과 상태 표시 패턴
| 패턴 | 설명 |
| --- | --- |
| 스켈레톤 화면 (Skeleton Screen) | 내용이 오기 전에 윤곽만 먼저 보여 준다 |
| 무한 스크롤 (Infinite Scrolling) | 아래 끝에 닿으면 내용을 더 불러와 붙인다 |
| 제자리 전환 | 페이지를 옮기지 않고 지금 화면에서 내용만 바꾼다 |
| 토스트 알림 (Toast Notifications) | 잠깐 나타났다 사라지는 알림 |

<br/>

## 마우스와 손으로 조작하는 패턴
| 패턴 | 설명 | 만드는 방법 |
| --- | --- | --- |
| 커서 효과 (Cursor Interaction) | 마우스 커서를 따라다니는 모양을 만든다 | `mousemove` 에서 `gsap.quickTo()` 로 위치를 따라가게 한다 |
| 글자 강조 (Text Highlighting) | 스크롤이나 마우스에 맞춰 글자가 강조된다 | ScrollTrigger의 `scrub` |
| 3D 기울기 (3D Effects) | 마우스 위치에 따라 카드가 기울어진다 | `rotationX`, `rotationY` 와 부모의 `perspective` |
| 끌어서 옮기기 (Drag Interaction) | 요소를 끌어서 움직인다 | GSAP의 Draggable 플러그인 |
| 입체 디자인 (Volumetric Design) | 깊이감과 3D 느낌을 주는 디자인 | 3D 변형, WebGL |

gsap 3.15.0 npm 패키지에 MorphSVGPlugin, Draggable, SplitText 파일이 들어 있고 `gsap.quickTo` 가 함수로 있는 것까지 확인했다. 패키지 README에는 예전 유료 회원 전용 플러그인까지 모두 무료이고 상업적으로도 쓸 수 있다고 적혀 있다. GitHub의 GSAP 3.13.0 릴리스 노트에 같은 문장("GSAP is now 100% FREE including ALL of the bonus plugins")이 있어, 3.13.0부터 무료로 바뀐 것으로 확인했다. 패턴별 동작은 이 장에서 실행해 보지 않았다.

<br/>

[목차](../README.md) | [다음 장: GSAP 메서드](../01_GSAP%20메서드(GSAP%20Methods)/README.md)
