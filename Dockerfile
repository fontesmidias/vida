# Imagem de produção do VIDA (D24: construída na VPS a partir do commit exato da main).
# Três estágios: dependências → build → execução mínima, sem ferramentas de build nem código-fonte.

FROM node:24-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS build
COPY . .
RUN npx prisma generate \
  && npm run build \
  # Seed compilado para JS: roda na subida sem precisar de tsx na imagem final
  && npx tsc prisma/seed.ts prisma/seed-data.ts --outDir seed-dist --module commonjs --target es2022 \
     --esModuleInterop --skipLibCheck --moduleResolution node

FROM node:24-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/* \
  && npm install -g prisma@6.19.3 --no-audit --no-fund
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/seed-dist ./seed-dist
COPY --chown=node:node docker-entrypoint.sh ./
# S1: o processo não roda como root dentro do container
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
