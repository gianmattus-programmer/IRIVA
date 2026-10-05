#!/bin/sh
set -eu
rm -rf dist
mkdir -p dist/assets
cp index.html proyecto.html styles.css styles-base.css styles-team-contact.css styles-responsive.css styles-desktop.css script.js project-viewer.css project-viewer.js dist/
python3 - <<'PY'
import base64, glob
parts=[]
for path in sorted(glob.glob('.site-payload/part-*.b64')):
    with open(path, 'r', encoding='utf-8') as f:
        parts.append(''.join(f.read().split()))
data=''.join(parts)
with open('/tmp/iriva-assets.zip','wb') as out:
    out.write(base64.b64decode(data))
PY
unzip -q /tmp/iriva-assets.zip -d dist/assets
