# Veredito: DECISOES.md

Data: 2026-10-23
Revisor: subagente independente, contexto limpo. Usou só a rubrica congelada (`loops/rubrica-entrega.md`, seção A), o PDF do desafio e o repositório. Os vereditos anteriores não foram lidos.

## A1. Completo: APROVADO
Os títulos `## 1.` a `## 7.` reproduzem o texto das 7 "Perguntas técnicas obrigatórias" do PDF (ex.: "## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?"; "## 7. Decisões: o que você deliberadamente deixou de fora e por quê? Onde usou IA no desenvolvimento?").

## A2. Responde o que foi perguntado: APROVADO
- 1: por que a stack (D1, D2, TECH_STACK) **e** como as camadas se comunicam (lista de 4 passos e cadeia de produção).
- 2: as tabelas (8, em tabela), mais usuários, check-ins e evolução nos planos em tópicos separados.
- 3: o que já existe e o que mudaria com dados reais (5 itens).
- 4: deploy, observar erros **e** recuperar, cada um com seu tópico.
- 5: exatamente 3 prioridades.
- 6: IA (service no servidor, minimização, guardrails, transparência), **e** Kiwify/webhooks (validação, idempotência, fila), **e** controle de acesso (`entitlements` no servidor, conciliação).
- 7: o que ficou de fora, com o motivo, **e** onde usou IA.

## A3. Ancorado no projeto: APROVADO
Cada resposta cita algo verificável, e foi conferido:
- 1: `src/ui/api.ts`, `app/(app)/*`, `app/api/**/route.ts`, `src/services/` (nenhum import de `next/*`), `src/repositories/`, `deploy/stack.yml` (`127.0.0.1:8097:3000`, rede `interna`, banco sem `ports`), `deploy/nginx/vida.conf`.
- 2: `prisma/schema.prisma` (8 `@@map`: users, moods, checkins, daily_contents, plans, plan_days, plan_day_completions, journey_resets; `@@unique([planId, dayNumber])`, `@@unique([userId, planDayId, cycle])`, índices `(userId, createdAt desc)` e `(userId, localDate)`, todas as relações `onDelete: Restrict`), `createMany(... skipDuplicates: true)` em `src/repositories/plans.ts`, `tests/integration/journey.test.ts`, `tests/unit/today.test.ts` (America/Sao_Paulo e Asia/Tokyo), E2E `test("S2: uma pessoa não vê os dados de outra")` em `tests/e2e/fluxo-principal.spec.ts`.
- 3: `specs/SECURITY.md`, `src/lib/password.ts` (scryptSync + timingSafeEqual), `src/lib/session-options.ts` (httpOnly, sameSite lax, secure), iron-session em `src/lib/session.ts`, `InvalidCredentialsError` com a mesma mensagem para conta inexistente e senha errada, `src/lib/rate-limit.ts` (login 30/min por IP), `allow` das faixas do Cloudflare + `deny all` e CSP/HSTS/X-Frame-Options no Nginx, `USER node` no Dockerfile, transação de `src/repositories/delete-data.ts`.
- 4: `scripts/deploy.sh` (CI verde por `gh run list`, `pg_dump` antes, `git archive` → `docker build` na VPS, `IMAGE_TAG` no Portainer), `docker-entrypoint.sh` (`prisma migrate deploy` + seed), `.github/workflows/ci.yml` (lint, typecheck, test, playwright chromium+webkit, Postgres, gitleaks com `fetch-depth: 0`), `playwright.config.ts` (Pixel 7, iPhone 13), `console.error([contexto])` em `src/lib/http.ts`, log 10m × 3 na stack, HEALTHCHECK em `/api/health/ready`, `location = /api/health/ready` no Nginx, `scripts/check-pronto.sh` (item 4 E2E público, item 8 backup + restauração), `docs/OPERACAO.md` (retenção de 14 dias, restauração passo a passo).
- 5: D6 e os itens do ROADMAP. 6: S3, S6, R4, imagem `pgvector/pgvector:pg16`. 7: D4, D7, D8, D26, R5, R6, ROADMAP, SECURITY, `loops/`.

## A4. Objetivo: APROVADO
Respostas em tópicos curtos ou em tabela, com o porquê em uma frase e o local no repositório. Sem marketing nem adjetivos de venda. A resposta 4 é a mais longa, mas cada frase traz um fato operacional.

## A5. Honesto: APROVADO
Afirmações conferidas, sem divergência:
- Faixas de IDs: R1–R8, S1–S8 e C1–C4 existem em `specs/RULES.md`; U1–U13 em `specs/UI_UX_SPEC.md`; D1–D28 em `specs/DECISIONS_LOG.md`. Os IDs citados existem e têm o sentido atribuído (D4 sem texto livre, D6 estados em tabela, D7/D8 ordem livre e sem streaks, D11 8 estados em 4 famílias, D15–D19, D23 SSL Full strict só no host, D24 imagem na VPS, D26 contas, D27 ciclos e conta mantida após D19).
- "Apagar meus dados": `DELETE /api/me` apaga conclusões, check-ins e `journey_resets` numa `$transaction` e mantém a conta (volta ao ciclo 1), como diz o texto e a D27.
- "Começar do zero" só avança `current_cycle` e grava `journey_resets` (`src/repositories/accounts.ts`, `newCycle`), sem apagar.
- Atribuições ao ROADMAP conferidas uma a uma: conta pessoal + 2FA, criptografia em repouso, cópia externa dos backups, consentimento, exportação, chat com IA + RAG/pgvector, Kiwify, notificações, painel admin, app nativo, modo em ordem por plano, música ambiente desligada por padrão, rate limit no Nginx, reinício automático por healthcheck, Sentry/uptime, usuário do banco com menos permissões. Tudo está em `ROADMAP.md`.
- Limites declarados como limites: healthcheck só marca `unhealthy` no Docker standalone; o usuário do banco ainda é o dono ("hoje pendente", confirmado em SECURITY.md linha 39); pgvector "disponível, ainda não habilitada por migration" (nenhuma migration cita `vector`); rate limit do Nginx pendente.
- As respostas 3 (itens 1 a 5), 5 e 6 estão no condicional ou no futuro ("mudaria", "adicionaria") e não afirmam que isso já existe.
- Uso de IA conferido com `README.md` (seção "Uso de IA") e com o canvas de protótipo citado em `specs/UI_UX_SPEC.md:31`.

## A6. Tom (C1, C4): APROVADO
- C1: nada promete diagnóstico, terapia ou cura. A IA aparece com o guardrail "sem diagnóstico, terapia ou cura", "não é aconselhamento profissional" e encaminhamento ao CVV.
- C4: o texto usa "a pessoa", "pessoa responsável", "a equipe", "titular", "conta". As únicas formas no masculino são citações do PDF ("diferentes usuários", "usuários reais", "usuário demo"), identificadores técnicos (`avaliador1`–`avaliador3`, `userId`) e o termo técnico "usuário do banco" (papel no Postgres).
- Ajuste opcional, que não reprova: o rótulo "**Usuários diferentes:**" (linha 29) inverte a ordem da citação do PDF. Escrever "Diferentes usuários" (literal) ou "Pessoas diferentes" deixaria isso sem dúvida.

## A7. Transparência sobre IA: APROVADO
- Ferramenta: "Claude Code (modelo Claude Opus), no VS Code".
- Etapas: specs, código e testes, protótipo visual, infraestrutura (Docker, Nginx, DNS, SSL pela API do Cloudflare), documentação.
- O que foi feito ou validado pessoalmente: escopo e regras de produto (C4, D18, D16, D15, D17), teste do protótipo com pedidos de mudança, aprovação de cada decisão e de cada ação na infraestrutura. Também cita as salvaguardas que não dependem da IA (testes, CI com gitleaks, `check-pronto.sh`, revisor com rubrica).

## Correções necessárias
Nenhuma que bloqueie. Opcional: trocar "Usuários diferentes" por "Diferentes usuários" ou "Pessoas diferentes" (linha 29).

VEREDITO: APROVADO
