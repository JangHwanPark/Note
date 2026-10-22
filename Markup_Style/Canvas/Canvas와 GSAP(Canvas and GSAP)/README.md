## Canvas와 GSAP은 무엇이 다를까
- Canvas는 그림을 그릴 바탕이고, GSAP(GreenSock Animation Platform)은 값을 시간에 따라 바꿔 주는 애니메이션 라이브러리다. 같은 층의 도구가 아니라서 둘 중 하나를 고르는 관계가 아니다
- 실제로 고르는 것은 화면을 HTML/SVG 요소로 만들지, `<canvas>` 에 직접 그릴지다. 브라우저가 요소들을 나무 구조로 들고 있는 것을 DOM(Document Object Model)이라 하므로, 이 노트에서는 앞쪽을 DOM 방식이라 부른다. GSAP은 두 경우 모두에 쓸 수 있다
- UI, 텍스트, 스크롤 연출처럼 요소 수가 적고 각 요소가 의미를 가지면 DOM과 GSAP, 파티클이나 게임처럼 많은 것을 매 프레임 그려야 하면 Canvas가 어울린다

### 캔버스 (Canvas)
사전적 의미는 화폭, 유화를 그리는 천이다.
웹에서는 `<canvas>` 요소를 말한다. 자바스크립트로 그 위에 점, 선, 도형을 픽셀로 그린다. 그린 결과는 픽셀로만 남고, 브라우저는 무엇을 그렸는지 기억하지 않는다.

DOM으로 만든 화면은 자석 칠판에 붙인 자석과 같다. 자석 하나를 옮기면 나머지는 그대로 있다. Canvas는 분필로 그린 칠판이다. 하나를 옮기려면 지우고 전부 다시 그려야 한다.

<br/>

## 렌더링 방식의 차이
DOM으로 만들면 요소를 두고 CSS 속성이나 SVG 속성만 바꾼다. 다시 그리는 일은 브라우저가 맡는다. Canvas는 매 프레임 지우고 직접 다시 그려야 한다.

DOM 요소는 각자 클릭 이벤트, 접근성 정보, 텍스트 선택을 그대로 가진다. Canvas에는 픽셀만 남아서, 클릭한 위치에 무엇이 있는지 직접 계산해야 하고 화면 낭독기(Screen Reader)도 그림의 내용을 읽지 못한다.

요소가 수천 개가 되면 DOM은 레이아웃과 스타일 계산이 부담이 된다. Canvas는 개수가 늘어도 같은 그리기 코드를 반복할 뿐이라 파티클처럼 많은 것을 다루기 좋다.

스크롤 연동은 둘 다 ScrollTrigger로 할 수 있다. Canvas라면 ScrollTrigger로 일반 객체의 값을 바꾸고, 그 값으로 다시 그린다.

3D는 DOM 쪽이면 GSAP이 CSS 3D 변형(`rotationX`, `z` 등)을 다룬다. Canvas 쪽이면 `getContext("webgl")` 로 WebGL을 쓰거나, WebGL 위에 만든 Three.js 같은 라이브러리를 쓴다.

Canvas 2D가 GPU로 가속되는지는 브라우저와 환경에 따라 다르다(확인 필요). GPU를 직접 쓰는 그리기는 WebGL 컨텍스트다.

GSAP에는 3D 전용 플러그인이 없다. gsap 3.15.0 패키지의 타입 정의에서 3D 관련 항목은 CSS 변형 속성(`rotationX`, `force3D` 등)뿐이었다. Canvas 라이브러리용으로는 PixiPlugin, EaselPlugin이 들어 있다.

<br/>

## GSAP이 어울리는 경우
GSAP은 HTML, CSS, SVG 요소를 움직일 때 가장 많이 쓴다.

- 버튼, 메뉴, 텍스트, 카드 같은 UI 인터랙션
- 스크롤 위치에 맞춰 애니메이션을 재생하는 GSAP 플러그인 ScrollTrigger를 쓰는 스크롤 연출
- 로고처럼 SVG로 만든 그림의 움직임
- `stagger`, `timeline` 으로 여러 요소의 순서를 맞추는 움직임

GSAP 기본 메서드는 [GSAP 메서드](../../../Libraries/GSAP/01_GSAP%20메서드(GSAP%20Methods)/README.md), ScrollTrigger는 [ScrollTrigger 기본](../../../Libraries/GSAP/09_ScrollTrigger%20기본(ScrollTrigger%20Basics)/README.md)에 정리했다.

<br/>

## Canvas가 어울리는 경우
Canvas는 그려야 할 것이 많고, 하나하나가 HTML 요소일 필요가 없을 때 쓴다.

- 수백에서 수천 개의 점이 움직이는 파티클, 게임 화면
- 차트, 그래프, 지도 같은 데이터 시각화
- 공 튀기기, 중력처럼 매 프레임 위치를 계산하는 물리 시뮬레이션
- WebGL을 쓰는 3D 그래픽

### 파티클 예제
점 100개가 움직이다가 벽에 닿으면 튕겨 나온다. 매 프레임 배경을 칠해 지우고, 점의 위치를 옮긴 뒤 다시 그린다.

```tsx
import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; radius: number; dx: number; dy: number };

function step(p: Particle, width: number, height: number) {
  p.x += p.dx;
  p.y += p.dy;
  // 벽을 넘었고 아직 벽 쪽으로 가고 있을 때만 방향을 뒤집는다
  if ((p.x - p.radius < 0 && p.dx < 0) || (p.x + p.radius > width && p.dx > 0)) p.dx *= -1;
  if ((p.y - p.radius < 0 && p.dy < 0) || (p.y + p.radius > height && p.dy > 0)) p.dy *= -1;
}

export default function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = Array.from({ length: 100 }, () => {
      const radius = Math.random() * 5 + 2;
      return {
        x: radius + Math.random() * (canvas.width - radius * 2),
        y: radius + Math.random() * (canvas.height - radius * 2),
        radius,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      };
    });

    let frameId = 0;
    function animate() {
      ctx!.fillStyle = "#111";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "white";
      particles.forEach((p) => {
        step(p, canvas!.width, canvas!.height);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      });
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
}
```

`requestAnimationFrame` 은 브라우저가 다음 화면을 그리기 직전에 함수를 한 번 불러 준다. 그래서 `animate` 가 끝에서 자신을 다시 예약하면 화면이 바뀔 때마다 한 번씩 그리는 반복이 된다.

이 예제에서 신경 쓴 점은 세 가지다.

- 벽에서 튕기기. 위치만 계속 더하면 점이 화면 밖으로 나가 돌아오지 않는다. 반사 없이 1000프레임을 돌려 보니 100개 중 5개만 화면 안에 남았다(무작위라 실행마다 다르다). 방향을 뒤집는 조건에 "아직 벽 쪽으로 가고 있을 때"를 넣은 것은, 벽에 걸친 채 시작한 점이 매 프레임 방향만 바꾸며 벽에 붙어 떨리는 것을 막기 위해서다.
- 배경 칠하기. `clearRect` 로 지우면 캔버스가 투명해져 흰 페이지에서는 흰 점이 보이지 않는다. 어두운 색으로 칠해 지우는 쪽으로 바꿨다.
- 정리. 반복을 멈추는 코드가 없으면 컴포넌트가 사라진 뒤에도 그리기가 계속된다. 정리 없이 실행해 보니 언마운트 뒤 500ms 동안 16프레임을 더 그렸고, StrictMode에서는 반복이 겹쳐 프레임 수가 늘었다. 이 프레임 수는 jsdom이 흉내 낸 `requestAnimationFrame` 기준이고, 실제 브라우저에서는 화면 주사율에 따라 달라진다. `cancelAnimationFrame` 으로 멈추게 한 뒤에는 언마운트 뒤 그리기가 0번이었다.

<br/>

## GSAP과 Canvas 함께 쓰기
GSAP은 DOM 요소뿐 아니라 일반 자바스크립트 객체의 숫자 값도 바꿀 수 있다. 그래서 점의 좌표를 담은 객체를 GSAP에 넘기고, 값이 바뀔 때마다 Canvas에 다시 그리면 된다. 이징이나 timeline 같은 GSAP 기능을 Canvas 그림에도 그대로 쓸 수 있다.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function GSAPCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: 50 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 5,
    }));

    function draw() {
      ctx!.fillStyle = "#111";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "white";
      particles.forEach((p) => {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    draw();
    gsap.to(particles, {
      // 함수로 넘겨야 입자마다 랜덤 값이 새로 계산된다
      x: () => `+=${Math.random() * 200 - 100}`,
      y: () => `+=${Math.random() * 200 - 100}`,
      duration: 2,
      ease: "power2.out",
      onUpdate: draw, // 값이 바뀐 프레임에만 다시 그린다
    });
  });

  return <canvas ref={canvasRef} width={500} height={500} />;
}
```

가운데 모여 있던 점 50개가 2초 동안 각자 다른 방향으로 흩어진다. `+=` 는 지금 값에서 더한다는 GSAP의 상대값 표기다.

다시 그리는 시점은 `onUpdate` 에 맡겼다. GSAP이 값을 바꾼 프레임에만 `draw` 가 불리므로, 트윈이 끝나면 그리기도 멈춘다. 따로 `requestAnimationFrame` 반복을 돌리면 움직임이 끝난 뒤에도 같은 그림을 계속 다시 그리게 된다. 또 `useGSAP` 안에서 만든 트윈은 컴포넌트가 사라질 때 함께 정리된다. 이유는 [ref와 className](../../../Libraries/GSAP/06_ref와%20className(Ref%20and%20className)/README.md)에서 다뤘다.

실행해 보니 2초 뒤 점 50개의 마지막 위치가 모두 달랐고, 모두 시작점에서 가로세로 100px 안에 있었다. 트윈이 끝난 뒤 300ms 동안 다시 그린 횟수는 0번이었다. 그리기 횟수는 jsdom 기준이라 실제 브라우저에서는 화면 주사율에 따라 다르다.

<br/>

## 정리
- HTML/SVG 요소로 만들 수 있는 UI, 텍스트, 스크롤 연출은 DOM과 GSAP으로 만든다
- 많은 것을 매 프레임 그려야 하는 파티클, 시각화, 게임은 Canvas에 그린다
- Canvas 그림도 좌표를 일반 객체에 담으면 GSAP으로 움직일 수 있다

<br/>

## 확인한 환경
두 예제는 React 19.2, @types/react 19.3.0, TypeScript 5.6.3 strict, gsap 3.15.0, @gsap/react 2.1.2로 타입 검사했다. 동작은 Node.js 22.13.0과 jsdom 25에서 Canvas 그리기 함수를 흉내 낸 객체로 바꿔 확인했다. jsdom은 실제로 그림을 그리지 않으므로 화면에 보이는 모습은 브라우저 확인 필요다.

<br/>

## 더 볼 것 (TODO)
- Canvas에서 클릭한 점 찾기(히트 테스트)
- 고해상도 화면에서 Canvas가 흐리게 보이는 문제와 `devicePixelRatio`
- ScrollTrigger로 Canvas 이미지 시퀀스 넘기기
