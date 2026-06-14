const fs = require('fs');


const files = [
  'src/pages/UnifiedDashboard.jsx',
  'src/pages/Tutorials/TutorialDashboard.jsx',
  'src/pages/Attendance/StudentDashboard.jsx',
  'src/pages/Expenses/Home.jsx',
  'src/pages/Referrals/StudentDashboard.jsx',
  'src/components/profile/StudentProfileView.jsx',
  'src/pages/ChatPage.jsx',
  'src/pages/Marketing/Home.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add gap-4 to space-y wrappers that don't have gaps and have space-y-8
  content = content.replace(/className="(space-y-\d+[^"]*)"/g, (match, p1) => {
    // If it's a major wrapper but lacks flex/grid maybe it doesn't need gap, it has space-y
    return match;
  });

  // Find grids without gap
  content = content.replace(/className="([^"]*\bgrid\b[^"]*)"/g, (match, p1) => {
    if (!p1.includes('gap-')) {
      changed = true;
      return `className="${p1} gap-4"`;
    }
    return match;
  });

  // Find flex-col or flex that wraps cards. It's tricky to just inject gap into EVERY flex.
  // We can look for `flex flex-col` missing gap
  content = content.replace(/className="([^"]*\bflex flex-col\b[^"]*)"/g, (match, p1) => {
    if (!p1.includes('gap-') && !p1.includes('space-y-')) {
      changed = true;
      return `className="${p1} gap-4"`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated grids/flex-cols in ${file}`);
  }
});
