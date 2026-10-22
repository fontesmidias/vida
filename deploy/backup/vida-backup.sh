#!/bin/sh
# Backup diário do banco do VIDA (instalado em /usr/local/bin/vida-backup; fonte: deploy/backup/vida-backup.sh).
# Agendado por /etc/cron.d/vida-backup. Gera um dump SQL comprimido, confere a integridade e
# guarda 14 dias. Backups "pre-deploy-*" (feitos pelo scripts/deploy.sh) ficam 30 dias.
set -eu
DIR=/var/backups/vida
ARQ="$DIR/vida-$(date +%Y%m%d-%H%M).sql.gz"
mkdir -p "$DIR"
chmod 700 "$DIR"

# Dump consistente feito de dentro do container (o banco não tem porta exposta)
docker exec vida-db-1 pg_dump -U vida vida | gzip > "$ARQ.tmp"
gunzip -t "$ARQ.tmp"
mv "$ARQ.tmp" "$ARQ"
chmod 600 "$ARQ"

find "$DIR" -name 'vida-*.sql.gz' -mtime +14 -delete
find "$DIR" -name 'pre-deploy-*.sql.gz' -mtime +30 -delete
echo "$(date -Is) ok $(basename "$ARQ") $(du -h "$ARQ" | cut -f1)"
