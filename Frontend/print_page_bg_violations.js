const fs = require('fs');
const results = JSON.parse(fs.readFileSync('c:\\Users\\Dell\\.gemini\antigravity-ide\\scratch\\bg_without_dark_results.json', 'utf8'));

const filtered = results.filter(r => r.file.includes('src\\pages') || r.file.includes('src/pages'));

console.log(`Found ${filtered.length} background instances in pages without dark mode override:`);
filtered.forEach(f => {
  console.log(`${f.file}:${f.line} -> Found "${f.bgClass}" in "${f.snippet}"`);
});
