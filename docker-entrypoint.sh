#!/bin/sh
# Subida do container: migrations pendentes → conteúdo de demonstração → servidor.
# migrate deploy só aplica o que falta, em ordem, e nunca edita o que já foi aplicado.
# O seed é idempotente e nunca toca em dados de usuário (R7).
set -e
prisma migrate deploy --schema prisma/schema.prisma
node seed-dist/seed.js
exec node server.js
