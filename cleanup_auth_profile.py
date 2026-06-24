from pathlib import Path
import re

root = Path('.')
html_files = sorted(root.glob('*.html'))

patterns = [
    re.compile(r'<script\s+src=["\']auth\.js["\']\s*>\s*</script>\s*', re.I),
    re.compile(r'<script\s+src=["\']profile-popup\.js["\']\s*>\s*</script>\s*', re.I),
    re.compile(r'<script>\s*NextStepAuth\.requireLogin\(\);\s*</script>\s*', re.I),
    re.compile(r'<(?:button|div)[^>]*\sid=["\']profileHeaderButton["\'][^>]*>[\s\S]*?</(?:button|div)>\s*', re.I),
    re.compile(r'<div[^>]*class=["\']flex items-center gap-6(?: ml-8)?["\'][\s\S]*?id=["\']profileHeaderAvatar["\'][\s\S]*?(?:</button>)?\s*</div>\s*', re.I),
    re.compile(r'<div[^>]*id=["\']profileHeaderAvatar["\'][\s\S]*?</div>\s*', re.I),
    re.compile(r'<div[^>]*id=["\']profileModalOverlay["\'][\s\S]*?</div>\s*', re.I),
    re.compile(r'document\.getElementById\(["\']profileHeaderButton["\']\)[\s\S]*?;\s*\n', re.I),
    re.compile(r'document\.getElementById\(["\']profileHeaderAvatar["\']\)[\s\S]*?;\s*\n', re.I),
    re.compile(r'document\.getElementById\(["\']user-profile-name["\']\)[\s\S]*?;\s*\n', re.I),
]

empty_flex = re.compile(r'<div class="flex items-center gap-6(?: ml-8)?">\s*</div>\s*', re.I)

updated_files = []
for html_file in html_files:
    text = html_file.read_text(encoding='utf-8')
    new_text = text
    for pat in patterns:
        new_text = pat.sub('', new_text)
    new_text = empty_flex.sub('', new_text)
    if new_text != text:
        html_file.write_text(new_text, encoding='utf-8')
        updated_files.append(html_file.name)

print('Updated HTML files:', updated_files)
