#!/usr/bin/env bash
# Check do loop "pronto" (loops/pronto-loop.md). CONGELADO: o loop não pode editar este arquivo.
# Imprime um placar; o loop termina em sucesso só com "PRONTO: 12/12".
# Não imprime segredos. Uso: bash scripts/check-pronto.sh [--rapido]  (--rapido pula os E2E)
set -uo pipefail
cd "$(dirname "$0")/.."

RAPIDO=${1:-}
TOTAL=12
OK=0
envd() { grep -E "^$1=" .env.deploy 2>/dev/null | head -1 | cut -d= -f2- | tr -d '\r'; }
DOMAIN=$(envd APP_DOMAIN)
SSH_KEY=$(envd VPS_SSH_KEY_PATH | tr '\\' '/')
SSH="ssh -i $SSH_KEY -p $(envd VPS_SSH_PORT) -o BatchMode=yes -o ConnectTimeout=15 $(envd VPS_SSH_USER)@$(envd VPS_HOST)"

item() { # item <nome> <comando...>
  local nome=$1; shift
  if out=$("$@" 2>&1); then
    OK=$((OK + 1)); printf '[OK]    %s %s\n' "$nome" "$(echo "$out" | tail -1 | cut -c1-90)"
  else
    printf '[FALHA] %s → %s\n' "$nome" "$(echo "$out" | grep -v '^\s*$' | tail -1 | cut -c1-110)"
  fi
}

veredito_aprovado() { # veredito_aprovado <arquivo avaliado> <arquivo de veredito>
  [ -f "$1" ] || { echo "falta $1"; return 1; }
  [ -f "$2" ] || { echo "sem veredito do revisor ($2)"; return 1; }
  tail -5 "$2" | grep -qx 'VEREDITO: APROVADO' || { echo "revisor reprovou ou não concluiu"; return 1; }
  # o veredito precisa ser posterior à última mudança do documento (commits)
  local doc_t ver_t
  doc_t=$(git log -1 --format=%ct -- "$1"); ver_t=$(git log -1 --format=%ct -- "$2")
  [ -n "$doc_t" ] && [ -n "$ver_t" ] && [ "$ver_t" -ge "$doc_t" ] || { echo "veredito anterior à última versão do documento"; return 1; }
  [ -z "$(git status --porcelain -- "$1" "$2")" ] || { echo "documento ou veredito com mudanças não commitadas"; return 1; }
  echo "aprovado"
}

c_local() {
  npm run -s lint >/dev/null && npm run -s typecheck >/dev/null || { echo "lint/typecheck"; return 1; }
  local u; u=$(npx vitest run 2>&1 | grep -E '^\s+Tests ') || { echo "testes unitários"; return 1; }
  echo "$u" | grep -q failed && { echo "$u"; return 1; }
  if [ "$RAPIDO" != "--rapido" ]; then
    local e; e=$(npx playwright test 2>&1 | grep -E '[0-9]+ (passed|failed)' | tail -2 | tr '\n' ' ')
    echo "$e" | grep -q failed && { echo "e2e: $e"; return 1; }
    echo "$e" | grep -q passed || { echo "e2e não rodou"; return 1; }
  fi
  echo "lint, typecheck,$(echo "$u" | sed 's/ *Tests *//'), e2e local ${e:-pulado}"
}

c_ci() {
  git fetch -q origin main || return 1
  local sha; sha=$(git rev-parse origin/main)
  local r; r=$(gh run list --branch main --limit 10 --json headSha,conclusion,name \
    --jq "[.[] | select(.headSha==\"$sha\")] | map(.conclusion) | join(\",\")") || { echo "gh indisponível"; return 1; }
  [ -n "$r" ] || { echo "nenhum CI para ${sha:0:7}"; return 1; }
  echo "$r" | tr ',' '\n' | grep -vqx success && { echo "CI em ${sha:0:7}: $r"; return 1; }
  grep -rqs gitleaks .github/workflows/ || { echo "CI sem gitleaks"; return 1; }
  echo "CI verde em ${sha:0:7} (inclui gitleaks)"
}

c_health() {
  [ -n "$DOMAIN" ] || { echo "APP_DOMAIN vazio"; return 1; }
  local b; b=$(curl -s --max-time 15 "https://$DOMAIN/api/health") || { echo "sem resposta"; return 1; }
  [ "$b" = '{"status":"ok"}' ] || { echo "resposta: ${b:0:60}"; return 1; }
  echo "https://$DOMAIN/api/health → $b"
}

c_e2e_publico() {
  [ "$RAPIDO" = "--rapido" ] && { echo "pulado (--rapido)"; return 1; }
  grep -q 'process.env.E2E_BASE_URL' playwright.config.ts || { echo "config não aceita E2E_BASE_URL"; return 1; }
  local e; e=$(E2E_BASE_URL="https://$DOMAIN" npx playwright test 2>&1 | grep -E '[0-9]+ (passed|failed)' | tail -2 | tr '\n' ' ')
  echo "$e" | grep -q failed && { echo "$e"; return 1; }
  echo "$e" | grep -q passed || { echo "não rodou"; return 1; }
  echo "contra https://$DOMAIN: $e"
}

c_rate_limit() {
  grep -rqsE '\bS6\b' tests/unit || { echo "sem teste unitário citando S6"; return 1; }
  local codes; codes=$(for i in $(seq 1 40); do curl -s -o /dev/null -w '%{http_code}\n' --max-time 10 -X POST "https://$DOMAIN/api/session/demo"; done | sort | uniq -c | tr '\n' ' ')
  echo "$codes" | grep -q ' 429' || { echo "40 POST seguidos sem 429: $codes"; return 1; }
  echo "40 POST em /api/session/demo → $codes"
}

c_readme() {
  local f=README.md falta=""
  for s in "## Demo" "## Como rodar" "## Stack" "## Estrutura" "## Variáveis de ambiente" "## Banco de dados" "## O que é demonstração" "## Uso de IA"; do
    grep -qF "$s" "$f" || falta="$falta '$s'"
  done
  [ -z "$falta" ] || { echo "faltam seções:$falta"; return 1; }
  grep -qF "https://$DOMAIN" "$f" || { echo "README sem o link da demo"; return 1; }
  echo "8 seções + link da demo"
}

c_decisoes() {
  local f=DECISOES.md
  [ -f "$f" ] || { echo "falta $f"; return 1; }
  for n in 1 2 3 4 5 6 7; do grep -qE "^## $n\. " "$f" || { echo "falta pergunta $n"; return 1; }; done
  veredito_aprovado "$f" loops/veredito-decisoes.md
}

c_backup() {
  local r
  r=$($SSH 'set -e
    f=$(find /var/backups/vida -name "*.sql.gz" -mmin -1560 2>/dev/null | sort | tail -1)
    [ -n "$f" ] || { echo "sem backup das últimas 26h"; exit 1; }
    gunzip -t "$f" || { echo "backup corrompido"; exit 1; }
    crontab -l 2>/dev/null | grep -q vida || [ -n "$(ls /etc/cron.d/*vida* 2>/dev/null)" ] || { echo "backup sem agendamento"; exit 1; }
    db=$(docker ps --format "{{.Names}}" | grep -E "^vida-db" | head -1)
    [ -n "$db" ] || { echo "container do banco do vida não encontrado"; exit 1; }
    docker exec "$db" sh -c "dropdb -U \$POSTGRES_USER --if-exists restore_check && createdb -U \$POSTGRES_USER restore_check"
    gunzip -c "$f" | docker exec -i "$db" sh -c "psql -q -U \$POSTGRES_USER -d restore_check >/dev/null"
    n=$(docker exec "$db" sh -c "psql -tA -U \$POSTGRES_USER -d restore_check -c \"select count(*) from moods\"")
    docker exec "$db" sh -c "dropdb -U \$POSTGRES_USER restore_check"
    [ "$n" -ge 8 ] || { echo "restauração sem dados ($n estados)"; exit 1; }
    echo "$(basename "$f") restaurado em banco temporário: $n estados"') || { echo "$r"; return 1; }
  echo "$r"
}

c_exclusao() {
  grep -rqs 'LGPD' tests/e2e || { echo "sem E2E de exclusão (LGPD)"; return 1; }
  [ "$RAPIDO" = "--rapido" ] && { echo "pulado (--rapido)"; return 1; }
  local e; e=$(npx playwright test -g "LGPD" 2>&1 | grep -E '[0-9]+ (passed|failed)' | tail -2 | tr '\n' ' ')
  echo "$e" | grep -q failed && { echo "$e"; return 1; }
  echo "$e" | grep -q passed || { echo "não rodou"; return 1; }
  echo "E2E LGPD: $e"
}

c_roteiro() { veredito_aprovado docs/ROTEIRO_VIDEO.md loops/veredito-roteiro.md; }

c_apresentacao() {
  # D21 (aprovado pelo responsável): o documento vive só no repositório
  grep -qF 'docs/apresentacao.html' README.md || { echo "README sem link do documento de apresentação"; return 1; }
  veredito_aprovado docs/apresentacao.html loops/veredito-apresentacao.md
}

c_tag() {
  local t; t=$(git describe --tags --exact-match origin/main 2>/dev/null) || { echo "main sem tag"; return 1; }
  [[ "$t" =~ ^v([1-9][0-9]*)\.[0-9]+\.[0-9]+$ ]] || { echo "tag $t (esperado ≥ v1.0.0)"; return 1; }
  grep -q "^## \[${t#v}\]" CHANGELOG.md || { echo "CHANGELOG sem $t"; return 1; }
  grep -q "^## \[Não lançado\]" CHANGELOG.md && { echo "CHANGELOG com itens não lançados"; return 1; }
  git ls-remote --tags origin "$t" | grep -q "$t" || { echo "tag não enviada"; return 1; }
  echo "$t publicada"
}

echo "== check-pronto $(date '+%Y-%m-%d %H:%M') · commit $(git rev-parse --short HEAD)"
item " 1 local (lint/tipos/unit/e2e)  " c_local
item " 2 CI GitHub + gitleaks         " c_ci
item " 3 health público               " c_health
item " 4 E2E contra URL pública       " c_e2e_publico
item " 5 rate limit (S6)              " c_rate_limit
item " 6 README completo              " c_readme
item " 7 DECISOES.md (7 + revisor)    " c_decisoes
item " 8 backup + restauração         " c_backup
item " 9 exclusão de dados (LGPD)     " c_exclusao
item "10 roteiro do vídeo (revisor)   " c_roteiro
item "11 apresentação (revisor)       " c_apresentacao
item "12 tag ≥ v1.0.0 + CHANGELOG     " c_tag
echo "PRONTO: $OK/$TOTAL"
[ "$OK" -eq "$TOTAL" ]
