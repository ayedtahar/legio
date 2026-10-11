#!/usr/bin/env bash
# bataille.html charge ses textures et son ciel par le réseau : ouvert en
# file://, le navigateur les refuse. On sert donc le dossier en http://.
cd "$(dirname "$0")"
PORT=${1:-8080}
echo "  carrière : http://localhost:$PORT/index.html"
echo "  bataille : http://localhost:$PORT/bataille.html"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
