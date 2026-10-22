# Veredito do revisor: DECISOES.md

Data: 2026-10-22
Rubrica: `loops/rubrica-entrega.md`, seção A (congelada). Avaliado do zero, sem consultar vereditos anteriores.
Fonte das perguntas: `doc/escopo-desafio/CLAVIS VIA Desafio Candidatos.pdf` ("Perguntas técnicas obrigatórias" e "Transparência sobre IA e recursos externos").

## A1. Completo: APROVADO
Os títulos `## 1.` a `## 7.` existem e reproduzem literalmente o texto do PDF (ex.: "## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?"; "## 6. Integrações: como adicionaria IA com segurança e, futuramente, acesso por assinatura/Kiwify (webhooks e controle de acesso)?").

## A2. Responde o que foi perguntado: APROVADO
- 1: por que a stack (D1, D2, "uma linguagem e um deploy"; "dados são relacionais") e como as camadas se comunicam (telas → API → services → repositories → Postgres; caminho em produção).
- 2: tabelas (tabela de 7), usuários diferentes, check-ins e evolução nos planos, cada um com um item próprio.
- 3: o que já existe e "Com pessoas reais usando o app, mudaria:" (5 itens).
- 4: "Deploy", "Observar erros" e "Recuperar", cada um com um item.
- 5: exatamente 3 prioridades numeradas.
- 6: IA (service no servidor, minimização, guardrails, transparência), Kiwify/webhooks (validação, idempotência, fila) e controle de acesso (`entitlements` no servidor, conciliação).
- 7: "Deixado de fora" com motivo por item e "Uso de IA".

## A3. Ancorado no projeto: APROVADO
Todas as respostas citam artefatos verificáveis, conferidos no repositório: `src/ui/api.ts` (trata offline e 401), `app/api/**/route.ts` com `isSameOrigin`, `src/services/` sem `next/*` (grep vazio), `prisma/schema.prisma` (7 modelos, índices `(userId, createdAt desc)`, `(userId, localDate)`, únicos `(planId, dayNumber)` e `(userId, planDayId)`, `onDelete: Restrict`), `createMany(... skipDuplicates: true)` em `src/repositories/plans.ts`, `tests/unit/today.test.ts` (São Paulo 21/10 x Tóquio 22/10), E2E "S2: uma pessoa não vê os dados de outra" em `tests/e2e/fluxo-principal.spec.ts`, `deploy/stack.yml`, `deploy/nginx/vida.conf`, `scripts/deploy.sh`, `scripts/check-pronto.sh` (item 8), `docs/OPERACAO.md`, `.github/workflows/ci.yml`, D1–D24 e R/S/C/U existentes.

## A4. Objetivo: APROVADO
Respostas em listas curtas e diretas, sem marketing. Única frase próxima de enchimento ("Saber se as práticas guiadas ajudam é o que orienta o produto") é justificativa da prioridade 3, aceitável.

## A5. Honesto: REPROVADO
Quase tudo confere (backup diário 03:15 UTC com `gunzip -t` e retenção de 14 dias em `deploy/backup/`; restauração em banco temporário `restore_check` no item 8; deploy recusa sem CI verde, faz backup, `git archive`, `IMAGE_TAG`; migrations + seed idempotente no `docker-entrypoint.sh`; `USER node`; logs `json-file` 10m x 3; `vida_pgdata`; `127.0.0.1:8097`; banco sem `ports`; `/api/health/ready` com `deny all` no Nginx; CSP/HSTS/X-Frame-Options; pgvector na imagem e ausente das migrations; cookie `httpOnly`/`sameSite=lax`/`secure`; exclusão em `$transaction`; itens futuros todos presentes no `ROADMAP.md`; pendências marcadas em `specs/SECURITY.md`).

Afirmação sem respaldo, na pergunta 4 ("Recuperar"):
> "`restart: unless-stopped` + healthcheck reiniciam sozinhos"

A stack é criada como Compose standalone (`scripts/deploy.sh`: `POST /api/stacks/create/standalone/string`), não Swarm. Em Docker standalone o `HEALTHCHECK` (Dockerfile) só marca o container como `unhealthy`; ele **não** reinicia o container. O `restart: unless-stopped` reinicia apenas quando o processo termina. Não há autoheal nem outro mecanismo no repositório. Logo, um app travado mas vivo (ex.: banco inacessível, `/api/health/ready` falhando) fica `unhealthy` e não volta sozinho. A frase atribui ao projeto um comportamento que ele não tem. (A mesma frase aparece em `docs/OPERACAO.md`, item "App fora do ar"; fora do escopo desta avaliação, mas deve ser corrigida junto.)

Observação menor (não decisiva): "E2E em Chrome e Safari" (pergunta 4) é, na verdade, Playwright com Chromium emulando Pixel 7 e WebKit emulando iPhone 13 (`playwright.config.ts`, `ci.yml`). Mais preciso: "E2E em Chromium e WebKit (perfis de Android e iPhone)".

## A6. Tom (C1, C4): APROVADO
Não promete diagnóstico, terapia ou cura; a pergunta 6 reforça "sem diagnóstico, terapia ou cura" e "não é aconselhamento profissional". Linguagem neutra: "pessoa visitante", "pessoa responsável pelo projeto", "a pessoa vê só mensagem amigável". Os títulos usam o texto literal do PDF ("você", "usuários"), aceito pela regra.

## A7. Transparência sobre IA: APROVADO
Ferramenta: "Claude Code (modelo Claude Opus), no VS Code". Etapas: specs, código e testes, protótipo visual, infraestrutura (Docker, Nginx, DNS, SSL via API do Cloudflare), documentação. Revisado/validado pessoalmente: definiu escopo e regras (C4, D18, D16, D15, D17), testou o protótipo, pediu mudanças, aprovou cada decisão e ação na infraestrutura; garantias independentes (testes, CI com gitleaks, `check-pronto.sh`, revisor em `loops/`).

## Correções necessárias
1. Pergunta 4, "Recuperar": trocar "`restart: unless-stopped` + healthcheck reiniciam sozinhos" por algo fiel, ex.: "`restart: unless-stopped` reinicia o container se o processo cair; o healthcheck (Dockerfile, consulta `/api/health/ready`) marca o app como `unhealthy` em `docker ps`, mas no Docker standalone não reinicia sozinho: nesse caso, `docker restart vida-app-1` (`docs/OPERACAO.md`)". Opcionalmente, registrar reinício automático por healthcheck (autoheal) no `ROADMAP.md`. Corrigir a mesma frase em `docs/OPERACAO.md`.
2. (Recomendado) Pergunta 4, CI: "E2E em Chromium e WebKit (perfis Pixel 7 e iPhone 13)" em vez de "Chrome e Safari".

VEREDITO: REPROVADO
