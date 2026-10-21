# Arquitetura

## Stack
| Camada | Escolha |
|---|---|
| Front-end + API | Next.js (App Router) + TypeScript + Tailwind CSS |
| Validação | Zod |
| Sessão | iron-session (cookie criptografado) |
| Dados | Postgres 16 (imagem `pgvector/pgvector:pg16`, pronta para busca vetorial futura) + Prisma ORM |
| Testes | Vitest (unidade/integração) + Playwright (E2E) |
| Infra | Docker Compose na VPS, atrás do Nginx existente (HTTPS via Certbot) |
| CI | GitHub Actions: lint, typecheck, testes, gitleaks |

## Camadas
```
app/(telas)          UI: componentes React, chamam a API via fetch
app/api/**/route.ts  HTTP: sessão (S1/S2), validação Zod (S5), mapeia erros para status
src/services/        Regras de negócio (R1–R7); não conhecem HTTP nem Next
src/repositories/    Acesso a dados via Prisma; sempre recebe userId explícito
prisma/              schema.prisma, migrations versionadas, seed
```
Regra de dependência: `app → services → repositories → Prisma`. Os services não importam nada de `next/*`, o que permite extrair um back-end separado no futuro sem reescrever regras.

## Modelo de dados
| Tabela | Campos principais | Observações |
|---|---|---|
| `users` | id (uuid), display_name, is_demo, created_at | Um registro por visitante anônimo |
| `checkins` | id, user_id → users, mood (enum), created_at | Índice (user_id, created_at desc) |
| `mood_contents` | id, mood (único), reflection_title, reflection_body, practice_title, practice_body, practice_minutes | Seed; inclui conteúdo `NEUTRO` para dias sem check-in |
| `plans` | id, slug (único), title, description | Seed (≥ 2) |
| `plan_days` | id, plan_id → plans, day_number, title, body | Único (plan_id, day_number) |
| `plan_day_completions` | id, user_id → users, plan_day_id → plan_days, completed_at | Único (user_id, plan_day_id) garante R4 |

O progresso (R6) é calculado, não armazenado: evita dado duplicado e inconsistente.

## API
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Público. `{status:"ok", db:"ok"}` |
| POST | `/api/session/demo` | Cria usuário demo e sessão (ou reutiliza a existente) |
| DELETE | `/api/session` | Encerra a sessão |
| POST | `/api/checkins` | Cria check-in `{mood}` |
| GET | `/api/checkins` | Últimos 10 (R7) |
| GET | `/api/today` | Conteúdo do dia conforme R2/R3 |
| GET | `/api/plans` | Lista planos com progresso do usuário |
| GET | `/api/plans/[slug]` | Detalhe com dias e status |
| POST | `/api/plans/[slug]/days/[day]/complete` | Conclui dia (R4/R5) |

## Migrations e preservação de dados
- Cada mudança de esquema gera uma migration SQL versionada em `prisma/migrations/` (`prisma migrate dev`).
- Em produção, o container roda `prisma migrate deploy` ao subir: aplica só as pendentes, em ordem, registradas em `_prisma_migrations`.
- Migrations aplicadas nunca são editadas; correções viram nova migration. Mudanças destrutivas seguem *expand → migrar dados → contract*.
- Os dados ficam em volume Docker nomeado; antes de migrar em produção roda `pg_dump`.
