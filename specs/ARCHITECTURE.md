# Arquitetura

## Stack
Next.js + TypeScript + Tailwind · Zod · iron-session · Prisma + Postgres 16 (pgvector) · Vitest + Playwright · Docker Compose atrás do Nginx · GitHub Actions. Justificativas em `TECH_STACK.md`.

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
| `moods` | id, slug (único), label, emoji, family, sort_order, active | Catálogo de estados (seed). Novo estado = novo registro, sem mudar código nem esquema |
| `checkins` | id, user_id → users, mood_id → moods, created_at (UTC), timezone (IANA), local_date | Append-only (R7). Índices (user_id, created_at desc) e (user_id, local_date) |
| `daily_contents` | id, family (único), reflection_title, reflection_body, practice_title, practice_body, practice_minutes | Seed; uma família por grupo de estados + `NEUTRO` (R3) |
| `plans` | id, slug (único), title, description | Seed (≥ 2) |
| `plan_days` | id, plan_id → plans, day_number, title, body | Único (plan_id, day_number) |
| `plan_day_completions` | id, user_id → users, plan_day_id → plan_days, completed_at | Único (user_id, plan_day_id) garante R4 |

O progresso (R6) é calculado, não armazenado: evita dado duplicado e inconsistente.

## API
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Público, mínimo: `{status:"ok"}` (S7) |
| GET | `/api/health/ready` | Só rede interna: verifica o banco (healthcheck do Docker) |
| POST | `/api/session/demo` | Cria usuário demo e sessão (ou reutiliza a existente) |
| DELETE | `/api/session` | Encerra a sessão |
| GET | `/api/moods` | Catálogo de estados ativos |
| POST | `/api/checkins` | Cria check-in `{moodSlug, timezone}` (R1) |
| GET | `/api/checkins?cursor=` | 10 por página, mais recentes primeiro (R7) |
| GET | `/api/today?tz=` | Conteúdo do dia conforme R2/R3 |
| GET | `/api/plans` | Lista planos com progresso do usuário |
| GET | `/api/plans/[slug]` | Detalhe com dias e status |
| POST | `/api/plans/[slug]/days/[day]/complete` | Conclui dia (R4/R5) |

## Erros da API
Todas as rotas (exceto health) exigem sessão. Respostas de erro têm o formato `{"error": "<mensagem amigável>"}`:

| Status | Quando |
|---|---|
| 400 | Corpo fora do esquema, JSON inválido ou estado inexistente |
| 401 | Sem sessão, ou a pessoa da sessão não existe mais |
| 403 | `Origin` de outro site em escrita (CSRF) |
| 404 | Plano ou dia inexistente |
| 500 | Erro interno; detalhe só no log (S5) |

## Tempo (R1)
O servidor grava `created_at` (UTC) e calcula `local_date` com `Intl.DateTimeFormat` no fuso informado. Exemplo real: às 01:05 UTC de 22/10, um check-in com `America/Sao_Paulo` fica em 21/10 e um com `Asia/Tokyo` em 22/10. Só nomes IANA são aceitos; offsets como `+03:00` caem no padrão. Implementação: `src/services/checkins.ts`.

## Migrations e preservação de dados
- Cada mudança de esquema gera uma migration SQL versionada em `prisma/migrations/` (`prisma migrate dev`).
- Em produção, o container roda `prisma migrate deploy` ao subir: aplica só as pendentes, em ordem, registradas em `_prisma_migrations`.
- Migrations aplicadas nunca são editadas; correções viram nova migration. Mudanças destrutivas seguem *expand → migrar dados → contract*.
- Os dados ficam em volume Docker nomeado; antes de migrar em produção roda `pg_dump`.
