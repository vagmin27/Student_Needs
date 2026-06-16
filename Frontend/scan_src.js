const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, 'src');
const targets = ['pages', 'components', 'layouts', 'styles', 'features', 'widgets', 'hooks', 'shared'];

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      const ext = path.extname(file);
      if (['.jsx', '.js', '.css'].includes(ext)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const inventory = {};
let totalCount = 0;
targets.forEach(t => {
  const targetPath = path.join(baseDir, t);
  const files = getFiles(targetPath);
  inventory[t] = files.map(f => path.relative(__dirname, f).replace(/\\/g, '/'));
  totalCount += files.length;
});

// Also check top-level files in src
const srcFiles = fs.readdirSync(baseDir).filter(file => {
  const filePath = path.join(baseDir, file);
  const stat = fs.statSync(filePath);
  return !stat.isDirectory() && ['.jsx', '.js', '.css'].includes(path.extname(file));
});
inventory['src_root'] = srcFiles.map(f => 'src/' + f);
totalCount += srcFiles.length;

console.log(JSON.stringify({ totalCount, inventory }, null, 2));
