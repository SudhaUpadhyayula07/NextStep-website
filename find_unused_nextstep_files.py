from pathlib import Path
import re

root = Path('.')
html_files = sorted(root.glob('*.html'))
refs = {p.name: 0 for p in html_files}
script_refs = {'auth.js': 0, 'profile-popup.js': 0}

for f in html_files:
    content = f.read_text(encoding='utf-8')
    for target in refs:
        if target == f.name:
            continue
        if re.search(r'href=["\'](?:\.\/)?' + re.escape(target) + r'["\']', content):
            refs[target] += 1
    if re.search(r'<script[^>]+src=["\']auth\.js["\']', content):
        script_refs['auth.js'] += 1
    if re.search(r'<script[^>]+src=["\']profile-popup\.js["\']', content):
        script_refs['profile-popup.js'] += 1

print('HTML inbound links:')
for name, count in refs.items():
    print(f'{count:3} {name}')

print('\nScript includes:')
for name, count in script_refs.items():
    print(f'{count:3} {name}')

preserved = {
    'index.html', '4-dashboard.html', '5-career-paths.html', '5-study-paths.html',
    '6-exams.html', '7-colleges.html', '8-scholarships.html', '9-cgai.html',
    'career-path.html', 'assessment.html', 'privacy-policy.html', 'terms-of-service.html',
    'contact-support.html'
}

unused = [name for name, count in refs.items() if count == 0 and name not in preserved]
print('\nPotential unused HTML:')
for name in unused:
    print(name)
