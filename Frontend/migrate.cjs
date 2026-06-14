const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replaceRules = [
    // Backgrounds
    { regex: /(?<!-)bg-white/g, replacement: 'bg-[var(--bg-nav-container)]' },
    { regex: /(?<!-)bg-black/g, replacement: 'bg-[var(--bg-main-page)]' },
    { regex: /(?<!-)bg-gray-\d{2,3}/g, replacement: 'bg-[var(--bg-nav-container)]' }, // Fallback for other bg-gray
    { regex: /hover:bg-gray-\d{2,3}/g, replacement: 'hover:bg-[var(--bg-nav-hover)]' },
    { regex: /hover:bg-white/g, replacement: 'hover:bg-[var(--bg-nav-hover)]' },
    
    // Text
    { regex: /(?<!-)text-black/g, replacement: 'text-[var(--text-primary)]' },
    { regex: /(?<!-)text-white/g, replacement: 'text-[var(--text-primary)]' },
    { regex: /(?<!-)text-gray-\d{2,3}/g, replacement: 'text-[var(--text-secondary)]' },
    { regex: /hover:text-black/g, replacement: 'hover:text-[var(--text-primary)]' },
    { regex: /hover:text-gray-\d{2,3}/g, replacement: 'hover:text-[var(--text-secondary)]' },
    
    // Borders
    { regex: /(?<!-)border-gray-\d{2,3}/g, replacement: 'border-[var(--border-subtle)]' },
    
    // Accents
    { regex: /text-blue-\d{2,3}/g, replacement: 'text-[var(--nav-accent)]' },
    { regex: /active:bg-blue-\d{2,3}/g, replacement: 'active:bg-[var(--nav-accent)]' },
    { regex: /bg-blue-\d{2,3}/g, replacement: 'bg-[var(--nav-accent)]' },
    
    // Hex / RGB
    { regex: /#ffffff/gi, replacement: 'var(--bg-nav-container)' },
    { regex: /#000000/gi, replacement: 'var(--text-primary)' },
];

function processDirectory(directory) {
    let changedFiles = [];
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            changedFiles = changedFiles.concat(processDirectory(fullPath));
        } else if (/\.(jsx?|css)$/.test(file)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;
            
            for (const rule of replaceRules) {
                newContent = newContent.replace(rule.regex, rule.replacement);
            }
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                changedFiles.push(fullPath);
            }
        }
    }
    return changedFiles;
}

const changed = processDirectory(directoryPath);
fs.writeFileSync('migration-results.json', JSON.stringify(changed, null, 2));
console.log(`Updated ${changed.length} files.`);
