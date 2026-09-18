"""assets/manifest.json 다시 만들기

    python tools/build-assets.py

assets/ 폴더의 파일(예제용 그림 · 데이터)을 모두 찾아 목록을 만든다.
브라우저의 파이썬 실행 환경은 이 목록의 파일을 작업 폴더(/home/pyodide/work)에 복사한다.
검증 도구(tools/validate.js)도 같은 파일을 임시 작업 폴더에 복사해 예제를 실행한다.
('_' 로 시작하는 파일 · 폴더와 manifest.json 은 제외)
"""
import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
out = []
for base, dirs, files in os.walk(ROOT):
    dirs[:] = sorted(d for d in dirs if not d.startswith('_') and not d.startswith('.'))
    for f in sorted(files):
        if f == 'manifest.json' or f.startswith('_') or f.startswith('.'):
            continue
        rel = os.path.relpath(os.path.join(base, f), ROOT).replace('\\', '/')
        out.append(rel)
with open(os.path.join(ROOT, 'manifest.json'), 'w', encoding='utf-8', newline='\n') as fp:
    json.dump(out, fp, ensure_ascii=False, indent=1)
    fp.write('\n')
total = sum(os.path.getsize(os.path.join(ROOT, f)) for f in out)
print('assets: %d files, %.1f KB' % (len(out), total / 1024))
