#!/usr/bin/env bash
# Assemble les sources.
#   index.html    — la carrière, autonome, ouvrable par double-clic
#   bataille.html — la bataille 3D, qui lit ses ressources par le réseau
#                   et demande donc un serveur local (voir serve.sh)
set -e
cd "$(dirname "$0")"

{
  echo '<title>Legio X Equestris</title>'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1">'
  echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap">'
  echo '<style>'; cat src2/style.css; echo '</style>'
  echo '<div id="app"></div>'
  echo '<script>'
  for f in src2/icons.js src2/data-core.js src2/data-phases-1.js src2/data-phases-2.js src2/data-phases-3.js src2/data-communs.js src2/app.js; do
    echo "/* ===== $f ===== */"; cat "$f"; echo
  done
  echo '</script>'
} > index.html
echo "index.html    : $(wc -c < index.html) octets, $(wc -l < index.html) lignes"

# ---- Acies ----
# three.js et ses modules restent des modules ES, chargés par le navigateur.
# Le jeu, lui, reste un seul script classique à portée globale : il s'appuie
# sur des fonctions partagées entre fichiers, et on ne réécrit pas ça ici.
{
  for f in noyau ressources monde soldats sim son jeu; do
    echo "/* ===== src3d/$f.js ===== */"; cat "src3d/$f.js"; echo
  done
} > acies.js
echo "acies.js      : $(wc -c < acies.js) octets, $(wc -l < acies.js) lignes"

cat > bataille.html <<'HTML'
<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Legio — Acies</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>__CSS__</style></head><body>
__CORPS__
<script type="importmap">
{ "imports": { "three": "./vendor/three.module.min.js", "three/addons/": "./vendor/addons/" } }
</script>
<script type="module">
/* three.js r169 — MIT, voir vendor/three.LICENSE */
import * as THREE from 'three';
import { RGBELoader }      from 'three/addons/RGBELoader.js';
import { GLTFLoader }      from 'three/addons/GLTFLoader.js';
import { CSM }             from 'three/addons/CSM.js';
import { EffectComposer }  from 'three/addons/EffectComposer.js';
import { RenderPass }      from 'three/addons/RenderPass.js';
import { ShaderPass }      from 'three/addons/ShaderPass.js';
import { OutputPass }      from 'three/addons/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/UnrealBloomPass.js';
import { SSAOPass }        from 'three/addons/SSAOPass.js';
import { FXAAShader }      from 'three/addons/FXAAShader.js';
Object.assign(window,{ THREE, RGBELoader, GLTFLoader, CSM, EffectComposer, RenderPass,
                       ShaderPass, OutputPass, UnrealBloomPass, SSAOPass, FXAAShader });
const s=document.createElement('script'); s.src='./acies.js'; document.body.appendChild(s);
</script>
</body></html>
HTML

python3 - <<'PY'
import io
h=io.open('bataille.html',encoding='utf-8').read()
h=h.replace('__CSS__', io.open('src3d/acies.css',encoding='utf-8').read())
h=h.replace('__CORPS__', io.open('src3d/acies.html',encoding='utf-8').read())
io.open('bataille.html','w',encoding='utf-8').write(h)
PY
echo "bataille.html : $(wc -c < bataille.html) octets"

if [ ! -d assets/ciel ] || [ -z "$(ls -A assets/ciel 2>/dev/null)" ]; then
  echo
  echo "⚠ Les ressources graphiques manquent. Lance ./fetch-assets.sh"
fi
