#!/usr/bin/env bash
# Assemble les sources en un index.html autonome.
set -e
cd "$(dirname "$0")"
OUT=index.html
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
} > "$OUT"
echo "index.html : $(wc -c < $OUT) octets, $(wc -l < $OUT) lignes"

# Acies : la bataille en temps réel, Three.js embarqué
node -e '
const fs=require("fs");
let t=fs.readFileSync("vendor/three.module.min.js","utf8");
const i=t.lastIndexOf("export{"), j=t.indexOf("}",i);
const map=t.slice(i+7,j).split(",").map(p=>{ const [a,b]=p.trim().split(" as "); return (b||a)+":"+a; }).join(",");
t="const THREE=(()=>{"+t.slice(0,i)+t.slice(j+1).replace(/^;/,"")+";return {"+map+"};})();";
const js=["noyau","monde","soldats","sim","son","jeu"].map(f=>"/* ===== src3d/"+f+".js ===== */\n"+fs.readFileSync("src3d/"+f+".js","utf8")).join("\n");
const out=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Legio — Acies</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${fs.readFileSync("src3d/acies.css","utf8")}</style></head><body>
${fs.readFileSync("src3d/acies.html","utf8")}
<script>/* three.js r169 — MIT, voir vendor/three.LICENSE */\n${t}\n</script>
<script>\n${js}\n</script></body></html>`;
fs.writeFileSync("bataille.html",out);
console.log("bataille.html : "+out.length+" octets");
'
