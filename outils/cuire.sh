#!/usr/bin/env bash
# Cuit les animations de assets/anim/ en une texture de matrices d'os.
# Passe par Chromium sans fenêtre : c'est FBXLoader/GLTFLoader de three.js
# qui lit les fichiers, et il n'existe qu'en JavaScript.
set -e
cd "$(dirname "$0")/.."
PORT=${PORT:-8080}
CHROME=${CHROME:-/snap/bin/chromium}
SORTIE=/tmp/legio-cuisson.html

curl -sf -o /dev/null "http://127.0.0.1:$PORT/bataille.html" \
  || { echo "Lance d'abord ./serve.sh $PORT"; exit 1; }

CLIPS=$(ls assets/anim/*.fbx 2>/dev/null | xargs -r -n1 basename | paste -sd, -)
echo "socle : ${BASE:-Xbot.glb}"
[ -n "$CLIPS" ] && echo "clips : $CLIPS"

timeout 600 "$CHROME" --headless=new --no-sandbox --disable-dev-shm-usage \
  --use-angle=swiftshader --enable-unsafe-swiftshader --virtual-time-budget=120000 \
  --dump-dom "http://127.0.0.1:$PORT/outils/cuire.html?base=${BASE:-Xbot.glb}&clips=$CLIPS" \
  2>/dev/null > "$SORTIE"

python3 - "$SORTIE" <<'PYEOF'
import sys,re,io,html,base64,os
s=io.open(sys.argv[1],encoding='utf-8').read()
log=re.search(r'<pre id="log">(.*?)</pre>',s,re.S)
print(html.unescape(log.group(1)) if log else '(pas de journal)')
def champ(i):
    m=re.search(r'<div id="%s"[^>]*>(.*?)</div>'%i,s,re.S)
    return html.unescape(m.group(1)).strip() if m else ''
j,b=champ('json'),champ('bin')
if not j or not b: sys.exit('✗ cuisson incomplète')
os.makedirs('assets/anim',exist_ok=True)
io.open('assets/anim/squelette.json','w',encoding='utf-8').write(j)
open('assets/anim/poses.bin','wb').write(base64.b64decode(b))
print('→ assets/anim/squelette.json (%d o) · assets/anim/poses.bin (%d o)'
      % (len(j), os.path.getsize('assets/anim/poses.bin')))
PYEOF
