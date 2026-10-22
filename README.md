# VIDA

Protótipo mobile-first de check-in emocional: o usuário registra como está, recebe uma reflexão e uma prática do dia, segue planos de alguns dias e acompanha sua jornada.

> Espaço de autocuidado e reflexão. Não substitui acompanhamento profissional. Em sofrimento intenso, ligue 188 (CVV).

## Documentação
| Arquivo | Conteúdo |
|---|---|
| `specs/PRD.md` | O que o produto faz e para quem |
| `specs/RULES.md` | Regras com IDs (R1–R7, S1–S7, C1–C3, P1–P3), citadas em testes e commits |
| `specs/ARCHITECTURE.md` | Camadas, modelo de dados e API |
| `specs/SECURITY.md` | Segurança em camadas |
| `specs/TECH_STACK.md` | Tecnologias e por que foram escolhidas |
| `specs/DECISIONS_LOG.md` | Decisões consolidadas (D1, D2…) |
| `CHANGELOG.md` / `ROADMAP.md` | O que mudou em cada versão / ideias para depois |

## Como rodar localmente
Pré-requisitos: Node 24+, Docker Desktop.

```bash
cp .env.example .env          # preencha POSTGRES_PASSWORD, DATABASE_URL e SESSION_SECRET
npm install
docker compose up -d db       # Postgres 16 + pgvector em container
npm run dev                   # http://localhost:3000
```

Gerar um `SESSION_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`.

## Verificações (obrigatórias antes de cada commit)
| Comando | O que faz |
|---|---|
| `npm run lint` | Procura problemas de qualidade e padrões errados no código (ESLint) |
| `npm run typecheck` | Confere se os tipos do TypeScript batem, sem rodar o app |
| `npm test` | Testes automáticos de unidade/integração (Vitest) |
| `npm run test:e2e` | Fluxo real no navegador, em tela de celular (Playwright) |

## Problemas comuns
**Porta 5432 ocupada** (`ports are not available ... 5432`): já existe outro Postgres na máquina, por exemplo um instalado direto no Windows. O banco do VIDA continua rodando no Docker; só a porta exposta no computador muda. No `.env`, defina `POSTGRES_PORT=5433` e use `localhost:5433` na `DATABASE_URL`.

**`failed to connect to the docker API`**: o Docker Desktop não está aberto. Abra-o e espere ficar pronto.

## Fluxo de trabalho
Cada etapa é feita numa branch (`feat/*`, `fix/*`, `chore/*`, `docs/*`), com commits pequenos no padrão Conventional Commits. Com as verificações verdes, a branch é unida à `main` (merge). Cada versão entregue recebe uma tag SemVer e uma entrada no `CHANGELOG.md`.
