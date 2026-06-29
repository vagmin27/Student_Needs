import os
import re

workspace_dir = r"c:\Users\Dell\Desktop\StudentNeeds\Frontend\src"

replacements = [
    # Button
    (re.compile(r'from\s+["\']@/components/Referrals/ui/button(\.jsx)?["\']'), 'from "@/components/ui/button.jsx"'),
    (re.compile(r'from\s+["\']\.\./\.\./ui/button(\.jsx)?["\']'), 'from "@/components/ui/button.jsx"'),
    # Input
    (re.compile(r'from\s+["\']@/components/Referrals/ui/input(\.jsx)?["\']'), 'from "@/components/ui/input.jsx"'),
    # Label
    (re.compile(r'from\s+["\']@/components/Referrals/ui/label(\.jsx)?["\']'), 'from "@/components/ui/label.jsx"'),
    # Card
    (re.compile(r'from\s+["\']@/components/Referrals/ui/card(\.jsx)?["\']'), 'from "@/components/ui/card.jsx"'),
    # Badge
    (re.compile(r'from\s+["\']@/components/Referrals/ui/badge(\.jsx)?["\']'), 'from "@/components/ui/badge.jsx"'),
    # Alert
    (re.compile(r'from\s+["\']@/components/Referrals/ui/alert(\.jsx)?["\']'), 'from "@/components/ui/alert.jsx"'),
    # Textarea
    (re.compile(r'from\s+["\']@/components/Referrals/ui/textarea(\.jsx)?["\']'), 'from "@/components/ui/textarea.jsx"'),
    # Tooltip
    (re.compile(r'from\s+["\']@/components/Referrals/ui/tooltip(\.jsx)?["\']'), 'from "@/components/ui/tooltip.jsx"'),
    # toast / toaster / sonner
    (re.compile(r'from\s+["\']@/components/Referrals/ui/toaster(\.jsx)?["\']'), 'from "@/components/ui/toaster.jsx"'),
    (re.compile(r'from\s+["\']@/components/Referrals/ui/sonner(\.jsx)?["\']'), 'from "@/components/ui/sonner.jsx"'),
    (re.compile(r'from\s+["\']@/components/Referrals/ui/use-toast(\.js)?["\']'), 'from "@/hooks/use-toast.js"'),
    (re.compile(r'from\s+["\']\.\./ui/toast(\.jsx)?["\']'), 'from "@/components/ui/toast.jsx"'),
    (re.compile(r'from\s+["\']\.\./\.\./\.\./components/ui/button["\']'), 'from "@/components/ui/button.jsx"'),
]

# Walk workspace and replace
count = 0
for root, dirs, files in os.walk(workspace_dir):
    # Skip standard node modules or dot folders
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    
    for file in files:
        if file.endswith(('.jsx', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, repl in replacements:
                new_content = pattern.sub(repl, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Migrated imports in: {filepath}")
                count += 1

print(f"Total files updated: {count}")
