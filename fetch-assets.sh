#!/usr/bin/env bash
# Télécharge les ressources graphiques depuis Poly Haven (toutes en CC0, aucun compte requis)
# et les modules complémentaires de three.js depuis GitHub (MIT).
# Rien de tout cela n'est versionné : voir .gitignore. Relancer le script suffit à tout retrouver.
set -e
cd "$(dirname "$0")"
UA="Mozilla/5.0 (X11; Linux x86_64)"
API=https://api.polyhaven.com
mkdir -p assets/ciel assets/sol assets/modeles vendor/addons

pick() { # slug  type  carte  format  resolution  destination
  local url out
  url=$(curl -s -A "$UA" "$API/files/$1" | python3 -c "
import json,sys
print(json.load(sys.stdin)['$3']['$5']['$4']['url'])" 2>/dev/null || true)
  [ -z "$url" ] && { echo "  ✗ $1 / $3"; return; }
  out="$6/$(basename "$url")"
  [ -f "$out" ] && { echo "  = $(basename "$out")"; return; }
  curl -s -A "$UA" -o "$out" "$url"
  echo "  ↓ $(basename "$out") ($(du -h "$out" | cut -f1))"
}

echo "— Ciels (HDRI 2k, CC0) —"
for s in kloofendal_48d_partly_cloudy_puresky kloofendal_43d_clear_puresky qwantani_afternoon_puresky; do
  pick "$s" hdris hdri hdr 2k assets/ciel
done

echo "— Sols (PBR 2k, CC0) —"
for t in aerial_grass_rock brown_mud_dry; do
  for m in Diffuse nor_gl arm; do pick "$t" textures "$m" jpg 2k assets/sol; done
done

echo "— Modules three.js r169 (MIT) —"
B=https://raw.githubusercontent.com/mrdoob/three.js/r169/examples/jsm
for m in loaders/RGBELoader loaders/GLTFLoader csm/CSM csm/CSMFrustum csm/CSMShader \
         postprocessing/EffectComposer postprocessing/Pass postprocessing/RenderPass \
         postprocessing/ShaderPass postprocessing/OutputPass postprocessing/UnrealBloomPass \
         postprocessing/SSAOPass postprocessing/MaskPass shaders/CopyShader \
         shaders/LuminosityHighPassShader shaders/FXAAShader shaders/SSAOShader \
         shaders/OutputShader math/SimplexNoise utils/BufferGeometryUtils; do
  f="vendor/addons/$(basename $m).js"
  [ -f "$f" ] && { echo "  = $(basename $f)"; continue; }
  curl -sf -A "$UA" -o "$f" "$B/$m.js" && echo "  ↓ $(basename $f)" || echo "  ✗ $m"
done

# Les modules s'importent par chemin relatif ; comme ils sont tous à plat dans
# vendor/addons, on réécrit « ../shaders/X.js » en « ./X.js ».
python3 - <<'PYEOF'
import os,re
D="vendor/addons"
for f in os.listdir(D):
    p=os.path.join(D,f); s=open(p,encoding='utf-8').read()
    t=re.sub(r"(from\s+['\"])\.{1,2}/(?:[\w.\-]+/)*([\w.\-]+\.js)(['\"])", r"\1./\2\3", s)
    if t!=s: open(p,'w',encoding='utf-8').write(t)
PYEOF

echo
echo "assets : $(du -sh assets | cut -f1) · vendor/addons : $(du -sh vendor/addons | cut -f1)"
