#!/bin/sh
# Subida do container: migrations pendentes → conteúdo de demonstração → servidor.
# migrate deploy só aplica o que falta, em ordem, e nunca edita o que já foi aplicado.
# O seed é idempotente: conteúdo e contas de demonstração; nunca toca em check-ins, conclusões nem ciclos (R7, R8).
set -e
prisma migrate deploy --schema prisma/schema.prisma
node seed-dist/prisma/seed.js
exec node server.js
