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
