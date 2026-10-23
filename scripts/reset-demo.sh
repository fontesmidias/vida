#!/usr/bin/env bash
# Deixa a conta de avaliação limpa para uma nova rodada (R8/D27, D29): entra na conta e aciona
# "Começar do zero" pela própria API do app. Nada é apagado; cada recomeço fica em journey_resets.
# Uso: bash scripts/reset-demo.sh            (demo pública, APP_DOMAIN do .env.deploy)
#      bash scripts/reset-demo.sh http://localhost:3000
set -euo pipefail
cd "$(dirname "$0")/.."

BASE=${1:-https://$(grep -E '^APP_DOMAIN=' .env.deploy | cut -d= -f2- | tr -d '\r')}
# Senha da demo pública no .env.deploy; local, no .env (D29)
ENVF=$([ $# -gt 0 ] && echo .env || echo .env.deploy)
PASSWORD=$(grep -E '^DEMO_PASSWORD=' "$ENVF" | cut -d= -f2- | tr -d '\r')
JAR=$(mktemp)
trap 'rm -f "$JAR"' EXIT

for conta in avaliador; do
  : > "$JAR"
  login=$(curl -s -c "$JAR" -b "$JAR" -X POST "$BASE/api/session/demo" \
    -H "content-type: application/json" -d "{\"username\":\"$conta\",\"password\":\"$PASSWORD\"}")
  echo "$login" | grep -q '"displayName"' || { echo "$conta: falha no login → $login"; exit 1; }
  if echo "$login" | grep -q '"hasProgress":true'; then
    ciclo=$(curl -s -c "$JAR" -b "$JAR" -X POST "$BASE/api/me/reset")
    echo "$conta: recomeçada $ciclo"
  else
    echo "$conta: já estava limpa"
  fi
done
