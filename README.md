# VIDA · Ver, Inspirar, Desacelerar, Avançar

Protótipo mobile-first de check-in emocional, feito para o desafio técnico CLAVIS VIA. A pessoa **vê** como está (check-in), recebe algo para **inspirar** (reflexão), **desacelera** com uma prática guiada curta e **avança** em planos de poucos dias, acompanhando a própria jornada.

> Espaço de autocuidado e reflexão. Não substitui acompanhamento profissional. O botão **Apoio**, em todas as telas, leva ao CVV (Centro de Valorização da Vida, 188).

## Demo
**https://vida.fontesmidias.com.br**: abra no celular (ou no navegador em modo celular). Não há cadastro: o botão "Entrar como demonstração" cria uma pessoa visitante, isolada das demais.

Roteiro do fluxo principal (o mesmo do desafio, coberto por teste E2E):
1. Toque em **Entrar como demonstração**.
2. Toque em **Fazer check-in** e escolha **Com ansiedade** (um toque registra).
3. Em **Hoje**, veja a reflexão e a prática coerentes com o estado; toque em **Começar** para a respiração guiada.
4. Na aba **Planos**, abra **Respirar com calma** e conclua o **Dia 1**.
5. Na aba **Jornada**, veja o check-in e o progresso do plano.
6. Recarregue a página: os dados continuam lá (Postgres).

Respostas às perguntas técnicas do desafio: [`DECISOES.md`](DECISOES.md). Visão geral para a conversa técnica (abre no navegador, claro e escuro): [`docs/apresentacao.html`](docs/apresentacao.html). Roteiro do vídeo: [`docs/ROTEIRO_VIDEO.md`](docs/ROTEIRO_VIDEO.md).

## O que é demonstração
| Real | Demonstração / fictício |
|---|---|
| Persistência em Postgres (check-ins, conclusões, sessões) com API própria | Textos de reflexão, práticas e planos (identificados como demonstração, C2) |
| Isolamento por pessoa: o `userId` vem só da sessão no servidor (S2) | A pessoa é anônima ("Visitante"): sem e-mail nem senha (D3) |
| Regras de tempo por fuso, idempotência, paginação, rate limit: todas testadas | Nenhum chat ou IA no app; nada é simulado no back-end |

## Stack
Next.js 15 (App Router) + TypeScript + Tailwind · Zod · iron-session · Prisma 6 + Postgres 16 (pgvector) · Vitest + Playwright · Docker na VPS atrás de Nginx e Cloudflare · GitHub Actions. O porquê de cada escolha e a alternativa descartada estão em [`specs/TECH_STACK.md`](specs/TECH_STACK.md).

## Estrutura
```
app/(app)/            telas internas: hoje, check-in, pratica, planos, planos/[slug]/dia/[n], jornada
app/page.tsx          Entrada
app/api/**/route.ts   HTTP: sessão, validação Zod, rate limit, mapeamento de erros
src/services/         regras de negócio (R1–R7), sem dependência de Next
src/repositories/     acesso a dados via Prisma, sempre com userId explícito
src/validation/       esquemas Zod da entrada
src/lib/              sessão, ambiente, http, rate limit
src/ui/               componentes, ícones próprios, práticas guiadas, cliente da API
prisma/               schema, migrations versionadas, seed de demonstração
tests/unit/           Vitest (regras, validação, formatação)
tests/e2e/            Playwright (fluxo principal em Chrome Android e Safari iPhone)
deploy/               stack do Portainer e site do Nginx
scripts/              deploy.sh e check-pronto.sh
specs/                PRD, regras, arquitetura, segurança, UX, stack e decisões
```
Regra de dependência: `app → services → repositories → Prisma`. Detalhes em [`specs/ARCHITECTURE.md`](specs/ARCHITECTURE.md).

## Como rodar
Pré-requisitos: Node 24+, Docker Desktop.

```bash
cp .env.example .env          # preencha POSTGRES_PASSWORD, DATABASE_URL e SESSION_SECRET
npm install
docker compose up -d db       # Postgres 16 + pgvector em container
npx prisma migrate dev        # cria as tabelas (aplica as migrations)
npm run db:seed               # estados, conteúdos e planos de demonstração
npm run dev                   # http://localhost:3000
```

## Variáveis de ambiente
Modelos sem segredos: [`.env.example`](.env.example) (app) e [`.env.deploy.example`](.env.deploy.example) (deploy). Os arquivos reais ficam fora do Git e o CI bloqueia segredos com gitleaks (S3).

| Variável | Onde | Para quê |
|---|---|---|
| `DATABASE_URL` | app | Conexão do Prisma com o Postgres |
| `SESSION_SECRET` | app | Criptografa o cookie de sessão; mínimo de 32 caracteres, validado na subida (S4). Gerar: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| `SESSION_COOKIE_SECURE` | app (opcional) | Padrão: `secure` em produção. `false` só para testar o build de produção em `http://localhost` |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | docker compose local | Banco local (`POSTGRES_PORT` se a 5432 estiver ocupada) |
| `VPS_*`, `PORTAINER_*`, `CLOUDFLARE_*`, `APP_DOMAIN` | `.env.deploy` | Só para deploy; o app nunca as carrega. Passo a passo de cada chave no modelo |

Em produção, `POSTGRES_PASSWORD` e `SESSION_SECRET` são gerados no primeiro deploy e vivem só nas variáveis da stack no Portainer.

## Banco de dados
- O esquema fica em `prisma/schema.prisma`; cada mudança gera uma migration em `prisma/migrations/` (`npx prisma migrate dev --name <nome>`). Migrations já aplicadas nunca são editadas. Em produção, o container roda `prisma migrate deploy` ao subir (só aplica as pendentes).
- O conteúdo de demonstração fica em `prisma/seed-data.ts`, coberto por testes (D11, R3, C1, C2). O seed é idempotente: pode rodar de novo sem duplicar e nunca toca em dados de usuário.
- Migration que **apaga dados** (ex.: remover coluna): o `migrate dev` pede confirmação interativa. Em terminal não interativo, gere o SQL, revise e aplique:
  ```bash
  docker compose exec db psql -U vida -d vida -c "create database vida_shadow;"
  mkdir prisma/migrations/<AAAAMMDDHHMMSS>_<nome>
  npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma \
    --shadow-database-url "postgresql://vida:<senha>@localhost:5433/vida_shadow" --script > prisma/migrations/<pasta>/migration.sql
  npx prisma migrate deploy && npx prisma generate
  docker compose exec db psql -U vida -d vida -c "drop database vida_shadow;"
  ```
- Inspecionar o banco: `npx prisma studio` ou `docker compose exec db psql -U vida -d vida`.

## Testes e verificações
Obrigatórias antes de cada commit e repetidas no CI (GitHub Actions) a cada push:

| Comando | O que faz |
|---|---|
| `npm run lint` | Procura problemas de qualidade e padrões errados no código (ESLint) |
| `npm run typecheck` | Confere se os tipos do TypeScript batem, sem rodar o app |
| `npm test` | Testes de unidade (Vitest); cada teste cita a regra que protege (R1, S6…) |
| `npm run test:e2e` | Fluxo real no navegador, em tela de celular (Playwright) |

- Primeira vez no E2E: `npx playwright install chromium webkit`.
- `npm run test:e2e` gera o build de produção, sobe o app e roda o fluxo em **Pixel 7 (Chrome)** e **iPhone 13 (Safari/WebKit)**. Capturas em `test-results/telas/`.
- Contra a demo pública: `E2E_BASE_URL=https://vida.fontesmidias.com.br npx playwright test`.
- No VS Code, a extensão **Playwright Test for VS Code** mostra os testes na aba *Testing*: rodar um teste só, ver o navegador, depurar passo a passo.
- O E2E usa o build de produção, não o `npm run dev`: o modo dev compila cada tela na primeira visita e estoura o tempo dos testes.
- Com pouca memória livre na máquina, use `--workers=1` (o Docker Desktop pode derrubar o banco).
- No Windows, o WebKit de teste desenha as fontes mais finas que um iPhone real; o peso é aplicado (medido), é só a renderização.
- `bash scripts/check-pronto.sh` mostra o placar de entrega (12 itens, cada um provado por comando).

## Deploy
Um comando publica o commit atual da `main`:

```bash
bash scripts/deploy.sh
```

O que ele faz, em ordem: recusa se a árvore tiver mudanças, se o HEAD não for a `origin/main` ou se o CI desse commit não estiver verde → faz backup do banco de produção → constrói a imagem na VPS a partir do `git archive` do commit (D24) → cria ou atualiza a stack `vida` no Portainer → espera o healthcheck (que consulta o banco) ficar saudável. Na subida, o container aplica as migrations pendentes e o seed idempotente.

Caminho de uma requisição: Cloudflare (proxy, SSL full strict só neste host, D22/D23) → Nginx da VPS (`deploy/nginx/vida.conf`: só aceita IPs do Cloudflare, cabeçalhos de segurança, bloqueia `/api/health/ready`) → app em `127.0.0.1:8097` → Postgres só na rede interna da stack (`deploy/stack.yml`).

## Documentação
| Arquivo | Conteúdo |
|---|---|
| [`DECISOES.md`](DECISOES.md) | As 7 perguntas técnicas do desafio |
| [`docs/apresentacao.html`](docs/apresentacao.html) | Apresentação do projeto: roteiro, arquitetura, dados, segurança e as 7 respostas em resumo |
| [`docs/ROTEIRO_VIDEO.md`](docs/ROTEIRO_VIDEO.md) | Roteiro do vídeo de até 5 minutos |
| `specs/PRD.md` | O que o produto faz e para quem |
| `specs/RULES.md` | Regras com IDs (R1–R7, S1–S7, C1–C4, P1–P3), citadas em testes e commits |
| `specs/ARCHITECTURE.md` | Camadas, modelo de dados, API e erros |
| `specs/SECURITY.md` | Segurança em camadas, da borda ao banco |
| `specs/UI_UX_SPEC.md` | Princípios de interface (U1–U13), telas, estados e tratamento de erros |
| `specs/TECH_STACK.md` | Tecnologias e por que foram escolhidas |
| `specs/DECISIONS_LOG.md` | Decisões consolidadas (D1–D24) |
| `docs/OPERACAO.md` | Operação: logs, recuperação, backup e restauração |
| `CHANGELOG.md` / `ROADMAP.md` | O que mudou em cada versão / ideias para depois, com o motivo |
| `loops/` | Como a entrega foi conduzida: meta, check, estado e rubrica do revisor |

## Uso de IA
- **Ferramenta:** Claude Code (modelo Claude Opus), no VS Code, conduzido pela pessoa responsável pelo projeto. Boilerplate inicial: `create-next-app`.
- **Onde ajudou:** redação das specs a partir das decisões da pessoa responsável; código da API, telas e testes (sempre teste antes, citando a regra); protótipo visual navegável usado para validar a experiência antes do código; infraestrutura (Dockerfile, stack, site do Nginx, DNS e regra de SSL pela API do Cloudflare); documentação.
- **O que a pessoa responsável decidiu, revisou ou validou pessoalmente:** escopo e prioridades; as regras de produto (linguagem neutra em gênero C4, significado da sigla D18, apoio discreto ao CVV D16, ícones próprios no lugar de emojis D15, práticas guiadas D17); testou o protótipo e pediu as mudanças de UX (menos texto, "Voltar" sempre visível, verbos nas ações, área segura no celular, celebração ao concluir um plano); aprovou cada decisão registrada e cada ação na infraestrutura (DNS, Nginx, stack, permissões dos tokens com menor privilégio).
- **Garantias que não dependem da IA:** testes de unidade e E2E em dois navegadores, CI com gitleaks, o placar `check-pronto.sh` e um revisor independente (com rubrica fixa) para os documentos de entrega.

## Problemas comuns
**Porta 5432 ocupada** (`ports are not available ... 5432`): já existe outro Postgres na máquina, por exemplo um instalado direto no Windows. O banco do VIDA continua rodando no Docker; só a porta exposta no computador muda. No `.env`, defina `POSTGRES_PORT=5433` e use `localhost:5433` na `DATABASE_URL`.

**`failed to connect to the docker API`**: o Docker Desktop não está aberto. Abra-o e espere ficar pronto.

## Fluxo de trabalho
Cada etapa é feita numa branch (`feat/*`, `fix/*`, `chore/*`, `docs/*`), com commits pequenos no padrão Conventional Commits. Com as verificações verdes, a branch é unida à `main` (merge). Cada versão entregue recebe uma tag SemVer e uma entrada no `CHANGELOG.md`.
