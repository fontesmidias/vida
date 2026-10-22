# Operação do VIDA em produção

Demo: https://vida.fontesmidias.com.br · VPS com Docker, stack `vida` no Portainer, Nginx no host, Cloudflare na frente.

## Visão rápida
| Peça | Onde | Como verificar |
|---|---|---|
| App (Next.js) | container `vida-app-1`, `127.0.0.1:8097` | `curl -s https://vida.fontesmidias.com.br/api/health` → `{"status":"ok"}` |
| Banco (Postgres 16) | container `vida-db-1`, só na rede interna da stack; dados no volume `vida_pgdata` | `docker exec vida-db-1 pg_isready -U vida` |
| Healthcheck interno | `/api/health/ready` (consulta o banco); o Docker reinicia o app se falhar; bloqueado por fora | `docker inspect -f '{{.State.Health.Status}}' vida-app-1` |
| Proxy | `/etc/nginx/sites-available/vida` (fonte: `deploy/nginx/vida.conf`) | `nginx -t` |
| Backup | `/usr/local/bin/vida-backup`, diário 03:15 UTC (`/etc/cron.d/vida-backup`) | `tail /var/log/vida-backup.log` |

## Deploy
`bash scripts/deploy.sh` (detalhes no README). Recusa commit sem CI verde, faz backup antes, constrói a imagem na VPS e atualiza a stack. Para voltar a uma versão anterior: no Portainer, stack `vida` → variável `IMAGE_TAG` com o hash anterior (as imagens antigas ficam na VPS como `vida-app:<hash>`) → *Update the stack*.

## Observar erros
- **Logs do app:** `docker logs --tail 100 -f vida-app-1` (também no Portainer). Erros internos são registrados com o contexto da rota (`[checkins]`, `[today]`…), e a pessoa recebe só uma mensagem amigável (S5).
- **Logs do Nginx:** `/var/log/nginx/access.log` e `error.log`.
- **Rotação:** os containers usam `json-file` com 10 MB × 3 arquivos, sem encher o disco.
- **De fora:** `check-pronto.sh` (itens 3 e 4) prova a demo pública de ponta a ponta. Alertas automáticos (Sentry, uptime) estão no ROADMAP.

## Recuperar um serviço que parou
1. **App fora do ar:** `docker ps -a --filter name=vida-` e `docker logs --tail 50 vida-app-1`. O `restart: unless-stopped` e o healthcheck já reiniciam sozinhos. Para forçar: `docker restart vida-app-1`.
2. **Banco fora do ar:** o app espera o banco ficar saudável (`depends_on: service_healthy`). `docker restart vida-db-1` e confira com `pg_isready`.
3. **Nginx:** `nginx -t && systemctl reload nginx`. Nunca recarregar sem o `nginx -t` passar: um erro derrubaria os outros sites da VPS.
4. **VPS reiniciou:** Docker sobe os containers com `unless-stopped`; o volume `vida_pgdata` preserva os dados.

## Backup e restauração
- **Diário:** `vida-backup` faz `pg_dump` de dentro do container, comprime, confere com `gunzip -t` e guarda em `/var/backups/vida` (pasta e arquivos só do root). Retenção: 14 dias (diários) e 30 dias (pré-deploy).
- **Antes de cada deploy:** `scripts/deploy.sh` grava `pre-deploy-<hash>.sql.gz`.
- **Prova de restauração:** o item 8 do `check-pronto.sh` restaura o backup mais recente num banco temporário (`restore_check`), confere que os dados estão lá e apaga o banco temporário. Ele roda a cada verificação de entrega.

### Restaurar em produção (perda de dados)
```bash
docker stop vida-app-1                                   # ninguém escreve durante a restauração
F=/var/backups/vida/vida-AAAAMMDD-HHMM.sql.gz            # escolha o arquivo
docker exec vida-db-1 sh -c 'dropdb -U vida vida && createdb -U vida vida'
gunzip -c "$F" | docker exec -i vida-db-1 psql -q -U vida -d vida
docker start vida-app-1                                  # migrations pendentes rodam na subida
```

Limitação conhecida: os backups ficam na mesma VPS. Cópia externa (outro provedor ou bucket) está no ROADMAP.
