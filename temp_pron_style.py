# -*- coding: utf-8 -*-
"""Wrap [한글발음] patterns in <span class="pron"> and inject CSS for readability."""
import re

path = r'D:\0. 클로드\GitHub Pages\public\posts\toeic-part3-4.html'
with open(path, 'rb') as f:
    raw = f.read()
bom = raw.startswith(b'\xef\xbb\xbf')
h = raw.decode('utf-8-sig')

# 1) Wrap [한글] patterns (Korean only inside brackets) into <span class="pron">
# Skip if already wrapped
if '<span class="pron">' not in h:
    h = re.sub(
        r'\[([가-힣][가-힣\s/]*)\]',
        r'<span class="pron">[\1]</span>',
        h
    )

# 2) Inject CSS for .pron once
PRON_CSS = '''
        /* Pronunciation tag for vocabulary words */
        .pron {
            color: #8a9bb0; font-size: 0.78em; font-weight: 400;
            margin-left: 3px; letter-spacing: -0.01em;
        }
'''
if '.pron {' not in h:
    h = h.replace('</style>', PRON_CSS + '\n    </style>', 1)

with open(path, 'wb') as f:
    if bom: f.write(b'\xef\xbb\xbf')
    f.write(h.encode('utf-8'))
print('part3-4 pron wrapped + CSS injected')
print('span count:', h.count('<span class="pron">'))
