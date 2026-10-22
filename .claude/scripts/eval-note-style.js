// 사용법: node .claude/scripts/eval-note-style.js [훅 파일]
// 문체 훅을 채점하는 작은 평가. 입력마다 훅이 막아야 하는지(expected)를 적어 두고 실제 결과와 비교한다.
// 훅 파일을 주지 않으면 .claude/hooks/check-note-style.js를 쓴다. 훅을 고친 사본을 넘기면 고치기 전후를 비교할 수 있다.
const { execFileSync } = require('child_process');
const path = require('path');
const HOOK = process.argv[2] || path.join(__dirname, '..', 'hooks', 'check-note-style.js');
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
let pass = 0;
cases.forEach((c, i) => {
  const input = JSON.stringify({ tool_input: { file_path: 'C:/tmp/note/README.md', content: c.text } });
  const out = execFileSync('node', [HOOK], { input }).toString();
  const blocked = out.includes('"decision":"block"');
  const ok = blocked === c.expected;
  if (ok) pass++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  case ${i + 1}  expected=${c.expected} got=${blocked}`);
});
console.log(`${pass}/${cases.length} passed`);
process.exitCode = pass === cases.length ? 0 : 1;
