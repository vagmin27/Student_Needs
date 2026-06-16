const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, 'src');
const targets = ['pages', 'components', 'layouts', 'styles'];

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

const allFiles = [];
targets.forEach(t => {
  allFiles.push(...getFiles(path.join(baseDir, t)));
});

// Also include src root files
fs.readdirSync(baseDir).forEach(file => {
  const filePath = path.join(baseDir, file);
  const stat = fs.statSync(filePath);
  if (!stat.isDirectory() && ['.jsx', '.js', '.css'].includes(path.extname(file))) {
    allFiles.push(filePath);
  }
});

const report = [];

allFiles.forEach(file => {
  const relPath = path.relative(__dirname, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];

  // Check fonts
  if (content.includes('font-serif') || content.includes('font-mono') || content.includes('font-mont') || content.includes('Georgia') || content.includes('Libre Baskerville')) {
    issues.push('Font family override/non-Inter font stack');
  }

  // Check border radius
  if (content.includes('rounded-') && !content.includes('rounded-full') && !content.includes('rounded-none') && !content.includes('rounded-[var(')) {
    issues.push('Hardcoded border-radius (e.g. rounded-lg, rounded-md, rounded-xl) instead of var(--radius-*)');
  }

  // Check hardcoded colors / borders
  if (content.includes('border-gray-') || content.includes('bg-gray-') || content.includes('text-gray-') || content.includes('bg-white') || content.includes('text-black')) {
    if (!relPath.includes('src/components/ui/button.jsx') && !relPath.includes('src/components/ui/input.jsx') && !relPath.includes('src/components/ui/card.jsx')) {
      issues.push('Hardcoded Tailwind gray/white color classes (e.g. bg-white, border-gray-200)');
    }
  }

  // Check inline color styles
  if (content.includes('backgroundColor:') || content.includes('borderColor:') || content.includes('color: "#') || content.includes('color: \'#')) {
    issues.push('Inline CSS color styling');
  }

  // Check shadow classes
  if (content.includes('shadow-sm') || content.includes('shadow-md') || content.includes('shadow-lg') || content.includes('shadow-xl') || content.includes('shadow-2xl')) {
    if (!relPath.includes('src/components/ui/') && !relPath.includes('src/components/dashboard/shared/Primitives.jsx')) {
      issues.push('Hardcoded shadow utility classes instead of design variables');
    }
  }

  if (issues.length > 0) {
    report.push({
      file: relPath,
      issues
    });
  } else {
    report.push({
      file: relPath,
      issues: [],
      status: 'No modification required (standardized or logic-only)'
    });
  }
});

fs.writeFileSync('audit_report.json', JSON.stringify(report, null, 2), 'utf8');
console.log(`Audited ${allFiles.length} files. Found ${report.filter(r => r.issues.length > 0).length} files with design system mismatches.`);
