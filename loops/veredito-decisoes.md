# Veredito: DECISOES.md

Data: 2026-10-23
Revisor: subagente independente, contexto limpo. Rubrica: `loops/rubrica-entrega.md`, seção A. Perguntas conferidas no PDF do desafio ("Perguntas técnicas obrigatórias", "Transparência sobre IA", "Identidade").

## A1. Completo: APROVADO
Os títulos `## 1.` a `## 7.` existem e reproduzem o texto das perguntas do PDF (ex.: "## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?").

## A2. Responde o que foi perguntado: APROVADO
- 1: motivo da stack (D1, D2) e a comunicação em 4 camadas.
- 2: as tabelas, mais usuários diferentes, check-ins e evolução nos planos.
- 3: o que já existe e 5 mudanças para dados reais (LGPD).
- 4: deploy, observar erros e recuperar, cada um com seu item.
- 6: IA, webhooks Kiwify e controle de acesso (`entitlements` no servidor).
- 7: o que ficou de fora com o motivo, mais o uso de IA.

## A3. Ancorado no projeto: APROVADO
Cada resposta cita arquivos e IDs que existem e conferem:
- `src/ui/api.ts`, `deploy/stack.yml`, `deploy/nginx/vida.conf`, `scripts/deploy.sh`, `scripts/check-pronto.sh`.
- `tests/integration/journey.test.ts`, `tests/unit/today.test.ts` (caso Tóquio/São Paulo) e o E2E "S2: uma pessoa não vê os dados de outra" em `tests/e2e/fluxo-principal.spec.ts:158`.
- Regras R1–R8, S2/S4/S6/S8 e decisões D4, D6, D19, D23, D24, D26 e D27.

## A4. Objetivo: APROVADO
As respostas são diretas, em listas curtas e tabela, sem marketing.

## A5. Honesto: REPROVADO
Conferi no código e nas specs as afirmações sobre comportamento, e todas têm respaldo:
- **Banco:** 8 tabelas e os índices `(user_id, created_at desc)`, `(user_id, local_date)` e o único `(user_id, plan_day_id, cycle)` (schema e migration `20261023073401_contas_e_ciclos`).
- **Idempotência e exclusão:** `createMany(skipDuplicates)` em `src/repositories/plans.ts:42`. A exclusão roda numa transação e mantém a conta (`src/repositories/delete-data.ts`).
- **Senha e login:** scrypt com `timingSafeEqual` (`src/lib/password.ts`). A mensagem de erro de login é a mesma para conta inexistente e senha errada. O cookie é `httpOnly`, `sameSite=lax` e `secure`.
- **Borda e container:** Nginx com allowlist do Cloudflare, `deny all`, CSP, HSTS e X-Frame-Options. `/api/health/ready` é bloqueado no Nginx. O container usa `USER node`.
- **Stack:** porta `127.0.0.1:8097`, `restart: unless-stopped`, logs 10m×3, `depends_on service_healthy`, volume `vida_pgdata`.
- **Deploy:** `deploy.sh` faz gate de CI, backup, `git archive` e Portainer. Na subida, o entrypoint roda `migrate deploy` e o seed.
- **Backup:** diário com `gunzip -t` e retenção de 14 dias. A restauração é provada no item 8 do `check-pronto.sh`.
- **CI:** Chromium e WebKit (Pixel 7 e iPhone 13) e gitleaks com `fetch-depth: 0`.
- **Futuro:** a imagem pgvector existe sem migration que habilite a extensão. O que é plano futuro está marcado e consta do `ROADMAP.md`.

Há porém uma afirmação falsa sobre o repositório, na linha 3: "Regras citadas por ID (R1–R7, S1–S7, C1–C4, U1–U13) ... decisões (D1–D24) em `specs/DECISIONS_LOG.md`".
- `specs/RULES.md` tem R8 e S8, e o log vai até D28.
- O próprio documento cita R8, S8, D26 e D27, fora das faixas que anuncia.

Ponto menor: na pergunta 3, item 3, o "(ROADMAP)" vem logo depois de "Criptografia em repouso", mas o `ROADMAP.md` só registra a cópia externa dos backups, não a criptografia em repouso.

## A6. Tom (C1, C4): APROVADO
- Nenhuma promessa de diagnóstico, terapia ou cura. A IA aparece com a C1 como guardrail e com o aviso "não é aconselhamento profissional".
- O texto usa formas neutras: "pessoa responsável", "a pessoa", "pessoas reais". "Usuários" aparece só no eco do texto do PDF; `avaliador1`–`avaliador3` são identificadores.

## A7. Transparência sobre IA: APROVADO
- **Ferramentas:** "Claude Code (modelo Claude Opus), no VS Code".
- **Etapas:** specs, código e testes, protótipo visual, infraestrutura e documentação.
- **Revisão pessoal:** a pessoa responsável definiu escopo e regras, testou o protótipo e pediu mudanças, e aprovou cada decisão e cada ação na infraestrutura.

## Correções necessárias
1. Linha 3: atualizar as faixas para R1–R8, S1–S8 e D1–D28, ou retirar as faixas e deixar só a indicação dos arquivos.
2. Pergunta 3, item 3: deixar claro que só a cópia externa dos backups está no ROADMAP, ou registrar a criptografia em repouso no `ROADMAP.md`.

VEREDITO: REPROVADO
