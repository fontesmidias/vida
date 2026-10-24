#!/usr/bin/env bash
# Deploy do VIDA na VPS (D24). Uso: bash scripts/deploy.sh
# Portões: árvore limpa, HEAD igual à origin/main e CI verde nesse commit. Nada é publicado sem isso.
# Passos: backup do banco (se a stack existe) → imagem construída na VPS a partir do git archive
# → stack criada ou atualizada pelo Portainer → espera o app ficar saudável.
# Nenhum segredo é impresso.
set -euo pipefail
cd "$(dirname "$0")/.."

envd() { grep -E "^$1=" .env.deploy | head -1 | cut -d= -f2- | tr -d '\r'; }
KEY=$(envd VPS_SSH_KEY_PATH | tr '\\' '/')
SSH=(ssh -i "$KEY" -p "$(envd VPS_SSH_PORT)" -o BatchMode=yes -o ConnectTimeout=15 "$(envd VPS_SSH_USER)@$(envd VPS_HOST)")
PU=$(envd PORTAINER_URL); PT=$(envd PORTAINER_API_TOKEN); PE=$(envd PORTAINER_ENDPOINT_ID)
STACK=vida

# 1. Portões
[ -z "$(git status --porcelain)" ] || { echo "Árvore com mudanças não commitadas."; exit 1; }
git fetch -q origin main
SHA=$(git rev-parse HEAD); TAG=${SHA:0:7}
[ "$SHA" = "$(git rev-parse origin/main)" ] || { echo "HEAD não é a origin/main."; exit 1; }
CI=$(gh run list --branch main --limit 10 --json headSha,conclusion --jq "[.[]|select(.headSha==\"$SHA\")][0].conclusion")
[ "$CI" = "success" ] || { echo "CI do commit $TAG: ${CI:-sem execução}. Deploy recusado."; exit 1; }
echo "== deploy $TAG (CI verde)"

STACK_ID=$(curl -s -H "X-API-Key: $PT" "$PU/api/stacks" | python -c "
import sys,json
s=[x for x in json.load(sys.stdin) if x['Name']=='$STACK' and x['EndpointId']==$PE]
print(s[0]['Id'] if s else '')")

# 2. Backup antes de qualquer mudança no banco de produção (guardrail do loop)
if [ -n "$STACK_ID" ]; then
  "${SSH[@]}" "umask 077 && mkdir -p /var/backups/vida && docker exec vida-db-1 pg_dump -U vida vida | gzip > /var/backups/vida/pre-deploy-$TAG.sql.gz && gunzip -t /var/backups/vida/pre-deploy-$TAG.sql.gz"
  echo "backup pré-deploy: /var/backups/vida/pre-deploy-$TAG.sql.gz"
fi

# 3. Imagem construída na VPS a partir do commit exato
git archive --format=tar HEAD | "${SSH[@]}" "docker build -q -t vida-app:$TAG -" >/dev/null
echo "imagem vida-app:$TAG construída na VPS"

# 4. Stack: cria na primeira vez (segredos gerados aqui e guardados só no Portainer) ou atualiza a versão
# D29: a senha da conta de avaliação vem do .env.deploy e vai só para as variáveis da stack
DEMO_PW=$(envd DEMO_PASSWORD)
[ ${#DEMO_PW} -ge 8 ] || { echo "Defina DEMO_PASSWORD (mínimo 8 caracteres) no .env.deploy."; exit 1; }
DEMO_PASSWORD="$DEMO_PW" python - "$PU" "$PT" "$PE" "$STACK" "$TAG" "${STACK_ID:-}" <<'PY'
import json, os, secrets, sys, urllib.request
pu, pt, pe, name, tag, sid = sys.argv[1:7]
demo_pw = os.environ["DEMO_PASSWORD"]
content = open("deploy/stack.yml", encoding="utf-8").read()

def call(method, path, body=None):
    req = urllib.request.Request(pu + path, method=method, headers={"X-API-Key": pt, "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read() or b"{}")

if sid:
    env = [e for e in call("GET", f"/api/stacks/{sid}")["Env"] if e["name"] not in ("IMAGE_TAG", "DEMO_PASSWORD")]
    env += [{"name": "IMAGE_TAG", "value": tag}, {"name": "DEMO_PASSWORD", "value": demo_pw}]
    call("PUT", f"/api/stacks/{sid}?endpointId={pe}", {"stackFileContent": content, "env": env, "prune": True, "pullImage": False})
    print(f"stack {name} atualizada para {tag}")
else:
    env = [
        {"name": "POSTGRES_PASSWORD", "value": secrets.token_hex(24)},
        {"name": "SESSION_SECRET", "value": secrets.token_urlsafe(48)},
        {"name": "IMAGE_TAG", "value": tag},
        {"name": "DEMO_PASSWORD", "value": demo_pw},
    ]
    call("POST", f"/api/stacks/create/standalone/string?endpointId={pe}", {"name": name, "stackFileContent": content, "env": env})
    print(f"stack {name} criada com {tag} (segredos gerados e guardados só no Portainer)")
PY

# 5. Espera ficar saudável (o healthcheck da imagem consulta /api/health/ready, que verifica o banco)
for i in $(seq 1 40); do
  st=$("${SSH[@]}" "docker inspect -f '{{.State.Health.Status}}' vida-app-1 2>/dev/null" || true)
  [ "$st" = healthy ] && { echo "app saudável: $("${SSH[@]}" 'curl -s 127.0.0.1:8097/api/health')"; exit 0; }
  sleep 5
done
echo "app não ficou saudável a tempo. Últimos logs:"; "${SSH[@]}" "docker logs --tail 30 vida-app-1"; exit 1
