// PostToolUse(Edit|Write): .md에 이번에 쓴 내용에서 노트 문체 규칙 위반을 찾아 Claude에게 되돌려준다.
// 긴 대시는 전역 훅(no-em-dash.js)이 잡으므로 여기서는 보지 않는다.
let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const ti = input.tool_input || {};
  const file = (ti.file_path || '').replace(/\\/g, '/');
  // 규칙을 설명하는 .claude 아래 문서는 금지어를 직접 언급하므로 제외한다.
  if (!/\.md$/i.test(file) || file.includes('/.claude/')) process.exit(0);

  const written = [ti.content, ti.new_string].filter(Boolean).join('\n');
  const problems = [];
  const add = (rule, line) => problems.push(`  [${rule}] ${line.trim().slice(0, 100)}`);

  // ↔ 같은 화살표 기호는 통과시키고, 그림 문자로 표시되는 것만 잡는다.
  const emoji = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;
  let inFence = false;
  for (const line of written.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (emoji.test(line)) add('이모지', line);
    if (inFence) continue;

    // 코드 블록 밖에서만 보는 규칙
    if (/청크|\bchunks?\b/i.test(line)) add('청크 금지', line);
    if (/`[^`\n]+`\s+[-–]\s/.test(line)) add('코드 스팬 뒤 대시', line);
    const t = line.trim();
    if (/[:：]$/.test(t) && !/^(#|\||>)/.test(t) && !/https?:\S*$/.test(t)) add('콜론 줄바꿈', line);
  }

  if (problems.length === 0) process.exit(0);
  console.log(
    JSON.stringify({
      decision: 'block',
      reason: `${ti.file_path}에 노트 문체 규칙 위반이 있다. .claude/docs/writing-guide.md 기준으로 고칠 것:\n${problems.slice(0, 8).join('\n')}`,
    }),
  );
  process.exit(0);
});
