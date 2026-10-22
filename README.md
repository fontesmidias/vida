# VIDA

Protótipo mobile-first de check-in emocional: a pessoa registra como está, recebe uma reflexão e uma prática do dia, segue planos de alguns dias e acompanha sua jornada.

> Espaço de autocuidado e reflexão. Não substitui acompanhamento profissional. Em sofrimento intenso, ligue 188 (CVV).

## Documentação
| Arquivo | Conteúdo |
|---|---|
| `specs/PRD.md` | O que o produto faz e para quem |
| `specs/RULES.md` | Regras com IDs (R1–R7, S1–S7, C1–C3, P1–P3), citadas em testes e commits |
| `specs/ARCHITECTURE.md` | Camadas, modelo de dados e API |
| `specs/SECURITY.md` | Segurança em camadas |
| `specs/UI_UX_SPEC.md` | Telas, estados, transições e tratamento de erros na interface (U1–U7) |
| `specs/TECH_STACK.md` | Tecnologias e por que foram escolhidas |
| `specs/DECISIONS_LOG.md` | Decisões consolidadas (D1, D2…) |
| `CHANGELOG.md` / `ROADMAP.md` | O que mudou em cada versão / ideias para depois |

## Como rodar localmente
Pré-requisitos: Node 24+, Docker Desktop.

```bash
cp .env.example .env          # preencha POSTGRES_PASSWORD, DATABASE_URL e SESSION_SECRET
npm install
docker compose up -d db       # Postgres 16 + pgvector em container
npx prisma migrate dev        # cria as tabelas (aplica as migrations)
npm run db:seed               # estados, conteúdos e planos de demonstração
npm run dev                   # http://localhost:3000
```

Gerar um `SESSION_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`.

## Deploy
Demo: **https://vida.fontesmidias.com.br**. Um comando publica o commit atual da `main`:

```bash
bash scripts/deploy.sh
```

O que ele faz, em ordem: recusa se a árvore tiver mudanças, se o HEAD não for a `origin/main` ou se o CI desse commit não estiver verde → faz backup do banco de produção → constrói a imagem na VPS a partir do `git archive` do commit (D24) → cria ou atualiza a stack `vida` no Portainer → espera o healthcheck (que consulta o banco) ficar saudável. Na subida, o container aplica as migrations pendentes e o seed idempotente.

Caminho de uma requisição: Cloudflare (proxy, SSL full strict só neste host, D22/D23) → Nginx da VPS (`deploy/nginx/vida.conf`: só aceita IPs do Cloudflare, cabeçalhos de segurança, bloqueia `/api/health/ready`) → app em `127.0.0.1:8097` → Postgres só na rede interna da stack (`deploy/stack.yml`).

As credenciais de deploy (VPS, Portainer, Cloudflare) ficam em `.env.deploy`, separado do `.env` do app: o app nunca as carrega. O modelo com o passo a passo de cada chave está em `.env.deploy.example`. Os segredos de produção do app ficam só nas variáveis da stack no Portainer.

## Banco de dados
- O esquema fica em `prisma/schema.prisma`; cada mudança gera uma migration em `prisma/migrations/` (`npx prisma migrate dev --name <nome>`). Migrations já aplicadas nunca são editadas.
- O conteúdo de demonstração fica em `prisma/seed-data.ts`, coberto por testes (D11, R3, C1, C2). O seed é idempotente: pode rodar de novo sem duplicar e nunca toca em dados de usuário.
- Migration que **apaga dados** (ex.: remover coluna): o `migrate dev` pede confirmação interativa. Em terminal não interativo, gere o SQL, revise e aplique:
  ```bash
  docker compose exec db psql -U vida -d vida -c "create database vida_shadow;"
  mkdir prisma/migrations/<AAAAMMDDHHMMSS>_<nome>
  npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma     --shadow-database-url "postgresql://vida:<senha>@localhost:5433/vida_shadow" --script > prisma/migrations/<pasta>/migration.sql
  npx prisma migrate deploy && npx prisma generate
  docker compose exec db psql -U vida -d vida -c "drop database vida_shadow;"
  ```
- Inspecionar o banco: `npx prisma studio` ou `docker compose exec db psql -U vida -d vida`.

## Verificações (obrigatórias antes de cada commit)
| Comando | O que faz |
|---|---|
| `npm run lint` | Procura problemas de qualidade e padrões errados no código (ESLint) |
| `npm run typecheck` | Confere se os tipos do TypeScript batem, sem rodar o app |
| `npm test` | Testes automáticos de unidade/integração (Vitest) |
| `npm run test:e2e` | Fluxo real no navegador, em tela de celular (Playwright) |

## Testes ponta a ponta (E2E)
- Primeira vez: `npx playwright install chromium webkit`.
- `npm run test:e2e` gera o build de produção, sobe o app e roda o fluxo do desafio em dois celulares: **Pixel 7 (Chrome)** e **iPhone 13 (Safari/WebKit)**. Capturas de cada tela ficam em `test-results/telas/`.
- No VS Code, a extensão **Playwright Test for VS Code** mostra os testes na aba *Testing* (ícone de frasco): dá para rodar um teste só, ver o navegador abrindo e depurar passo a passo.
- O E2E usa o build de produção, não o `npm run dev`: o modo dev compila cada tela na primeira visita e estoura o tempo dos testes.
- O E2E define `SESSION_COOKIE_SECURE=false` porque o Safari não guarda cookie `secure` em `http://localhost`. Em produção (HTTPS) o padrão continua `secure`.
- No Windows, o WebKit de teste desenha as fontes mais finas que um iPhone real; o peso é aplicado (medido), é só a renderização.

## Problemas comuns
**Porta 5432 ocupada** (`ports are not available ... 5432`): já existe outro Postgres na máquina, por exemplo um instalado direto no Windows. O banco do VIDA continua rodando no Docker; só a porta exposta no computador muda. No `.env`, defina `POSTGRES_PORT=5433` e use `localhost:5433` na `DATABASE_URL`.

**`failed to connect to the docker API`**: o Docker Desktop não está aberto. Abra-o e espere ficar pronto.

## Fluxo de trabalho
Cada etapa é feita numa branch (`feat/*`, `fix/*`, `chore/*`, `docs/*`), com commits pequenos no padrão Conventional Commits. Com as verificações verdes, a branch é unida à `main` (merge). Cada versão entregue recebe uma tag SemVer e uma entrada no `CHANGELOG.md`.
