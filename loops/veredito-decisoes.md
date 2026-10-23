# Veredito: DECISOES.md

Data: 2026-10-23
Revisor independente, contexto limpo. Rubrica: `loops/rubrica-entrega.md`, seção A. Perguntas conferidas no PDF do desafio ("Perguntas técnicas obrigatórias", "Transparência sobre IA", "Identidade").

## A1. Completo: APROVADO
Os títulos `## 1.` a `## 7.` reproduzem o texto das 7 perguntas do PDF (Arquitetura, Modelagem, Segurança, Operação, Evolução, Integrações, Decisões), sem omissões.

## A2. Responde o que foi perguntado: APROVADO
- 1: por que essa stack (D1, D2, TECH_STACK) e como tela, API e banco se comunicam (4 camadas + caminho em produção).
- 2: tabelas (8, em tabela), pessoas diferentes, check-ins e evolução nos planos, cada um com tópico próprio.
- 3: o que o protótipo já faz e uma lista numerada "Com pessoas reais usando o app, mudaria".
- 4: deploy, observar erros **e** recuperar, em tópicos separados.
- 5: exatamente 3 prioridades.
- 6: IA (service, minimização, guardrails, transparência) **e** Kiwify/webhooks (assinatura, idempotência, fila) **e** controle de acesso (`entitlements` no servidor, conciliação).
- 7: o que ficou de fora com o motivo **e** o uso de IA.

## A3. Ancorado no projeto: APROVADO
Todas as respostas citam arquivos, regras ou testes existentes: `src/ui/api.ts`, `app/api/**/route.ts`, `deploy/stack.yml`, `deploy/nginx/vida.conf`, `prisma/schema.prisma`, `tests/integration/journey.test.ts`, `tests/unit/today.test.ts`, E2E "S2: uma pessoa não vê os dados de outra", `scripts/deploy.sh`, `scripts/check-pronto.sh` (item 8), `.github/workflows/ci.yml`, `docs/OPERACAO.md`, `specs/SECURITY.md`, `ROADMAP.md`, D1–D28, R1–R8, S1–S8, C1–C4, U1–U13. A pergunta 6 (futura) se ancora em S3, S6, R4, C1/C4, pgvector da imagem e no Apoio/CVV.

## A4. Objetivo: APROVADO
Respostas em tópicos curtos e tabela; sem marketing. O tamanho é proporcional à quantidade de partes de cada pergunta.

## A5. Honesto: APROVADO
Conferido no repositório:
- Faixas de IDs: R1–R8 e S1–S8 e C1–C4 existem em `specs/RULES.md`; U1–U13 em `specs/UI_UX_SPEC.md`; D1–D28 em `specs/DECISIONS_LOG.md`.
- Services e repositories não importam `next/*` (grep sem resultados). Rotas usam Zod (`safeParse`), `isSameOrigin` e `tooManyRequests`.
- 8 tabelas, índices `(user_id, created_at desc)` e `(user_id, local_date)`, únicos `(plan_id, day_number)` e `(user_id, plan_day_id, cycle)`, `current_cycle`, `journey_resets`, todas as relações `onDelete: Restrict`: `prisma/schema.prisma`.
- 8 estados, contas `avaliador1`–`avaliador3` e `e2e1`–`e2e3`: `prisma/seed-data.ts`.
- `createMany(skipDuplicates)`: `src/repositories/plans.ts:42`.
- scrypt + `timingSafeEqual`: `src/lib/password.ts`; mensagem única para conta inexistente e senha errada: `src/services/accounts.ts`; limite por IP no login antes de tudo: `app/api/session/demo/route.ts` + `src/lib/rate-limit.ts`.
- Cookie `httpOnly`, `sameSite=lax`, `secure` em produção: `src/lib/session-options.ts`.
- "Apagar meus dados": transação que remove conclusões, check-ins e recomeços e mantém a conta (volta ao ciclo 1): `src/repositories/delete-data.ts`, coerente com D27 (a resposta não repete a frase antiga de R7 sobre remover a pessoa; descreve o comportamento real).
- Teste de integração contra Postgres real (R8): `tests/integration/journey.test.ts`; Tóquio 22/10: `tests/unit/today.test.ts`; E2E S2 com duas contas (`entrar` + `e2e3`).
- Nginx: `deny all` fora das faixas do Cloudflare (403), CSP, HSTS, X-Frame-Options, `/api/health/ready` negado de fora. Banco sem `ports`, app em `127.0.0.1:8097`, logs json-file 10m × 3, `restart: unless-stopped`, `depends_on: service_healthy`, volume `vida_pgdata`, imagem `pgvector/pgvector:pg16` sem migration que habilite a extensão.
- Dockerfile com `USER node` e healthcheck em `/api/health/ready`; `docker-entrypoint.sh` roda `prisma migrate deploy` e seed idempotente.
- `scripts/deploy.sh`: recusa sem CI verde, backup pré-deploy, `git archive` → build na VPS, atualiza stack via Portainer com `IMAGE_TAG`.
- CI: lint, tipos, testes, E2E Chromium + WebKit (Pixel 7, iPhone 13 em `playwright.config.ts`) com Postgres, gitleaks com `fetch-depth: 0`.
- `docs/OPERACAO.md`: backup diário, retenção 14 dias, `docker restart vida-app-1`, restauração passo a passo; `check-pronto.sh` item 8 restaura em banco temporário e item 4 roda E2E contra a URL pública.
- Pendências marcadas como futuras e presentes no `ROADMAP.md`/`SECURITY.md`: conta pessoal + 2FA, consentimento, exportação, criptografia em repouso, cópia externa de backup, usuário do banco separado (pendente em SECURITY.md), rate limit no Nginx, reinício por healthcheck, Sentry/uptime, chat com IA/RAG, Kiwify, notificações, painel admin, app nativo, música, modo em ordem.
- Uso de IA coerente com a seção de transparência do `README.md`.
Nenhuma afirmação sem respaldo encontrada.

## A6. Tom (C1, C4): APROVADO
Nenhuma promessa de diagnóstico, terapia ou cura; a pergunta 6 reforça C1 nos guardrails. Linguagem neutra ("a pessoa", "pessoas reais", "pessoa responsável", "contas de demonstração para avaliação"). Ocorrências de "usuários" estão nas citações literais do PDF; "usuário demo" e "usuário do banco" são termos técnicos; "cliente único" se refere ao cliente HTTP; "clientes" é comum de dois gêneros; "sozinho" se refere ao container.

## A7. Transparência sobre IA: APROVADO
Ferramenta: Claude Code (modelo Claude Opus) no VS Code. Etapas: specs, código e testes, protótipo visual, infraestrutura (Docker, Nginx, DNS, SSL via API do Cloudflare), documentação. Validação pessoal: escopo e regras de produto (C4, D15–D18), teste do protótipo com pedidos de mudança, aprovação de cada decisão e ação de infraestrutura; garantias independentes da IA (testes, CI com gitleaks, `check-pronto.sh`, revisor com rubrica fixa).

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
