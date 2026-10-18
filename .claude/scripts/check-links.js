// 사용법: node .claude/scripts/check-links.js <폴더>
// 폴더 안 .md 파일의 상대 경로 링크가 실제 파일이나 폴더를 가리키는지 확인한다. 괄호가 든 경로도 처리한다.
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || '.';

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.md')) yield p;
  }
}

// [텍스트](대상) 에서 대상을 괄호 짝을 맞춰 꺼낸다.
function* links(text) {
  let i = 0;
  while ((i = text.indexOf('](', i)) !== -1) {
    let j = i + 2;
    let depth = 1;
    while (j < text.length && depth > 0) {
      if (text[j] === '(') depth++;
      else if (text[j] === ')') depth--;
      j++;
    }
    yield text.slice(i + 2, j - 1);
    i = j;
  }
}

let count = 0;
let broken = 0;
for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const link of links(text)) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    count++;
    const target = path.resolve(path.dirname(file), decodeURIComponent(link.split('#')[0]));
    if (!fs.existsSync(target)) {
      broken++;
      console.log(`깨진 링크: ${file} -> ${link}`);
    }
  }
}
console.log(`상대 링크 ${count}개 중 깨진 링크 ${broken}개`);
process.exit(broken ? 1 : 0);
