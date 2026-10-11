#!/usr/bin/env bash
# Publie le jeu sur GitHub Pages : https://ayedtahar.github.io/legio/
# La branche gh-pages ne porte que ce que le navigateur lit : les pages assemblées,
# three.js, les ciels, les sols et les poses cuites. Les modèles .glb, qui ne servent
# qu'à la cuisson, n'y vont pas. Elle est réécrite à chaque publication (un seul commit),
# pour ne pas empiler trente mégaoctets de textures à chaque fois.
set -e
cd "$(dirname "$0")"
./build.sh

for f in assets/anim/poses.bin assets/anim/squelette.json; do
  [ -f "$f" ] || { echo "✗ $f manque : ./fetch-assets.sh, puis ./serve.sh et ./outils/cuire.sh"; exit 1; }
done
[ -n "$(ls -A assets/ciel 2>/dev/null)" ] && [ -n "$(ls -A assets/sol 2>/dev/null)" ] \
  || { echo "✗ ciels ou sols manquants : ./fetch-assets.sh"; exit 1; }

ORIGINE=$(git remote get-url origin)
VERSION=$(git rev-parse --short HEAD)
D=$(mktemp -d); trap 'rm -rf "$D"' EXIT

cp index.html bataille.html acies.js LICENSE "$D/"
cp -r vendor "$D/"
mkdir -p "$D/assets/anim"
cp -r assets/ciel assets/sol "$D/assets/"
cp assets/anim/poses.bin assets/anim/squelette.json "$D/assets/anim/"
touch "$D/.nojekyll"

cd "$D"
git init -q -b gh-pages
git add -A
git commit -q -m "Publication de $VERSION"
git push -q --force "$ORIGINE" gh-pages
echo "publié ($VERSION, $(du -sh --exclude=.git . | cut -f1)) : https://ayedtahar.github.io/legio/"
