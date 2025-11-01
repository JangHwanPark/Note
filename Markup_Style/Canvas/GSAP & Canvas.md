## Canvas vs GSAP: 디자인에서 보통 어떻게 사용될까?
GSAP은 UI 애니메이션과 SVG/HTML 요소를 다룰 때 많이 사용되고,
Canvas는 복잡한 그래픽, 데이터 시각화, 게임 같은 경우에 많이 쓰임.

## GSAP과 Canvas는 어떤 차이가 있을까?
GSAP (GreenSock Animation Platform)	Canvas (<canvas> API)
렌더링 방식	DOM & CSS 애니메이션 (HTML, SVG)	픽셀 단위 렌더링 (2D 그래픽)
사용 용도	UI 애니메이션, 버튼 효과, 텍스트 애니메이션, 스크롤 애니메이션	복잡한 그래픽, 데이터 시각화, 게임, 물리 엔진
퍼포먼스	DOM 조작이 많아지면 느려질 수 있음	GPU 가속 활용 가능 (고성능)
설정 난이도	간단하고 직관적 (gsap.to(), timeline)	직접 코딩해야 해서 난이도가 높음
스크롤 연동	ScrollTrigger 지원 (강력함)	직접 스크롤 이벤트 처리해야 함
3D 지원	GSAP 3D 플러그인 or Three.js와 연동	WebGL 기반의 Three.js 필요
2️⃣ 어떤 경우에 GSAP을 사용할까?
GSAP은 HTML, CSS, SVG 애니메이션을 최적화하는 강력한 라이브러리야.
✅ UI 인터랙션 (버튼, 메뉴, 텍스트, 카드 등)
✅ 스크롤 애니메이션 (ScrollTrigger 활용)
✅ SVG 기반 애니메이션 (로고 애니메이션 등)
✅ stagger, timeline을 활용한 자연스러운 동작

🔥 GSAP 예제 (텍스트 애니메이션)
tsx
복사
편집
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GSAPAnimation() {
const textRef = useRef<HTMLHeadingElement>(null);

useEffect(() => {
gsap.fromTo(
textRef.current,
{ opacity: 0, y: 50 },
{ opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
);
}, []);

return <h1 ref={textRef} className="text-4xl font-bold">Hello, GSAP!</h1>;
}
✅ 설명:

opacity: 0 → 1, y: 50 → 0으로 자연스럽게 올라오는 애니메이션
power2.out을 사용하여 부드럽게 감속
🔥 GSAP ScrollTrigger 예제 (스크롤 애니메이션)
tsx
복사
편집
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
const boxRef = useRef<HTMLDivElement>(null);

useEffect(() => {
gsap.fromTo(
boxRef.current,
{ opacity: 0, y: 100 },
{
opacity: 1,
y: 0,
duration: 1.5,
ease: "power2.out",
scrollTrigger: {
trigger: boxRef.current,
start: "top 80%",
end: "top 30%",
scrub: true,
},
}
);
}, []);

return <div ref={boxRef} className="w-20 h-20 bg-blue-500 mx-auto my-40" />;
}
✅ 설명:

scrollTrigger를 사용하여 스크롤 시 박스가 나타나는 애니메이션
scrub: true → 스크롤 속도에 따라 애니메이션 조정됨
3️⃣ 어떤 경우에 Canvas를 사용할까?
Canvas는 픽셀 단위로 직접 그리기 때문에, UI 요소보다는 고성능 그래픽 애니메이션에 적합함.
✅ 수천 개의 요소를 한 번에 애니메이션 (파티클, 게임)
✅ 데이터 시각화 (차트, 그래프, 맵)
✅ 물리 시뮬레이션 (공 튀기기, 중력 적용)
✅ WebGL 기반 3D 그래픽 (Three.js와 조합 가능)

🔥 Canvas 애니메이션 예제 (파티클 효과)
tsx
복사
편집
import { useEffect, useRef } from "react";

export default function CanvasAnimation() {
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext("2d");
if (!ctx) return;

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 5 + 2,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    animate();
}, []);

return <canvas ref={canvasRef} width={500} height={500} />;
}
✅ 설명:

100개의 공을 무작위로 생성 후 이동시키는 애니메이션
requestAnimationFrame()을 사용하여 부드러운 애니메이션 실행
4️⃣ GSAP + Canvas 조합 가능할까?
🔥 가능함!
GSAP의 gsap.to()를 사용하여 Canvas의 속성을 애니메이션화하면 강력한 인터랙션 구현 가능.

🔥 GSAP + Canvas 애니메이션 예제
tsx
복사
편집
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GSAPCanvas() {
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    draw();

    gsap.to(particles, {
      x: `+=${Math.random() * 200 - 100}`,
      y: `+=${Math.random() * 200 - 100}`,
      duration: 2,
      ease: "power2.out",
    });
}, []);

return <canvas ref={canvasRef} width={500} height={500} />;
}
✅ 설명:

gsap.to()를 사용하여 Canvas 입자(Particle)를 움직이도록 설정
GSAP의 ease를 활용하여 자연스럽게 이동
🎯 결론
GSAP을 사용할 경우
✅ UI 애니메이션, 스크롤 애니메이션, SVG 인터랙션
✅ 빠른 개발 & 손쉬운 유지보수

Canvas를 사용할 경우
✅ 복잡한 그래픽 애니메이션 (파티클, 데이터 시각화, 게임)
✅ GPU 가속을 활용한 고성능 렌더링

GSAP + Canvas 조합
✅ GSAP을 활용하여 Canvas 애니메이션을 쉽게 조작 가능
✅ UI와 그래픽 요소를 함께 활용할 때 강력한 조합

🚀 디자인 요소에 따라 GSAP과 Canvas를 적절히 활용하는 것이 중요!