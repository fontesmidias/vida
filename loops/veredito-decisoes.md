# Veredito: DECISOES.md

Data: 2026-10-22
Rubrica: `loops/rubrica-entrega.md`, seção A. Avaliado do zero, sem consultar vereditos anteriores.

## A1. Completo: APROVADO
Os títulos `## 1.` a `## 7.` reproduzem literalmente as perguntas do PDF ("Perguntas técnicas obrigatórias"), por exemplo `## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?` e `## 7. Decisões: o que você deliberadamente deixou de fora e por quê? Onde usou IA no desenvolvimento?`.

## A2. Responde o que foi perguntado: APROVADO
- 1: o porquê da stack (D1, D2) e a comunicação em camadas (telas, rotas, services, repositories, produção).
- 2: tabelas, mais as três subperguntas (usuários diferentes, check-ins, evolução nos planos).
- 3: o que já existe e uma lista numerada do que "mudaria" para dados reais.
- 4: tem deploy, observação de erros e recuperação, cada um como item próprio.
- 5: três prioridades numeradas.
- 6: IA com segurança, Kiwify/webhooks e controle de acesso (`entitlements` no servidor).
- 7: o que ficou de fora com o motivo, e "Uso de IA".

## A3. Ancorado no projeto: APROVADO
Toda resposta aponta para coisas verificáveis: `src/ui/api.ts`, `app/api/**/route.ts`, `src/services/`, `src/repositories/`, `deploy/stack.yml`, `deploy/nginx/vida.conf`, `prisma/schema.prisma`, `tests/unit/today.test.ts`, o E2E "S2: uma pessoa não vê os dados de outra", `scripts/deploy.sh`, `.github/workflows/ci.yml`, `docs/OPERACAO.md`, `scripts/check-pronto.sh` item 8, `ROADMAP.md`, além das regras R/S/C/U e das decisões D. As partes de futuro (3, 5, 6) também se apoiam no projeto: padrão do R4 para a idempotência, pgvector na imagem, D6, ROADMAP.

## A4. Objetivo: APROVADO
As respostas são diretas, em tabela ou listas curtas. Não há enchimento nem marketing. O texto é denso, mas cada frase traz um fato ou uma referência.

## A5. Honesto: APROVADO
Conferi no repositório:
- **Rotas:** `app/api/*` existe. Os services não importam `next/*` (grep vazio).
- **Tabelas:** são 7 em `prisma/schema.prisma`, com os índices `(userId, createdAt desc)` e `(userId, localDate)` e os únicos `(planId, dayNumber)` e `(userId, planDayId)`. As relações usam `onDelete: Restrict`.
- **Idempotência:** `createMany(... skipDuplicates: true)` em `src/repositories/plans.ts`.
- **Exclusão (D19):** a exclusão acontece numa `$transaction` que apaga conclusões, check-ins e a pessoa (`src/repositories/delete-data.ts`).
- **Testes citados:** `today.test.ts` cobre São Paulo 21/10 e Tóquio 22/10. O E2E S2 com duas sessões está em `tests/e2e/fluxo-principal.spec.ts:140`.
- **Nginx:** só aceita as faixas do Cloudflare e tem `deny all` (403). Traz HSTS, X-Frame-Options e CSP, e `/api/health/ready` tem `deny all`.
- **Stack (`deploy/stack.yml`):** o banco não tem `ports`, o app está em `127.0.0.1:8097`, `restart: unless-stopped`, `depends_on: service_healthy`, log json-file 10m×3 e volume `vida_pgdata`. A imagem `pgvector/pgvector:pg16` não tem nenhuma migration que habilite vector, como o texto diz.
- **Dockerfile:** `USER node`. O HEALTHCHECK consulta `/api/health/ready`.
- **Recuperação:** o texto diz certo que o healthcheck só marca `unhealthy` e não reinicia no Docker standalone, e que o reinício automático está no ROADMAP.
- **Subida do container:** `docker-entrypoint.sh` roda `prisma migrate deploy` e depois o seed.
- **`scripts/deploy.sh`:** recusa CI não verde, faz backup antes do deploy, constrói via `git archive` e atualiza a stack pelo Portainer com `IMAGE_TAG`.
- **CI:** lint, tipos, unit, E2E chromium+webkit e gitleaks com `fetch-depth: 0`. Os perfis do Playwright são Pixel 7 e iPhone 13.
- **`docs/OPERACAO.md`:** backup diário, retenção de 14 dias e restauração em banco temporário no item 8 do `check-pronto.sh`.
- **Logs:** os erros saem com contexto (`src/lib/http.ts`: `console.error(\`[${context}]\`)`).
- **Itens "pendentes"/futuros:** usuário do banco com permissão mínima, rate limit no Nginx, backup externo, Sentry/uptime, conta real, consentimento, exportação, IA e Kiwify estão marcados como pendentes ou ROADMAP, e todos aparecem em `ROADMAP.md` e em `specs/SECURITY.md`.

Não encontrei afirmação sem respaldo.

## A6. Tom (C1, C4): APROVADO
Nada promete diagnóstico, terapia ou cura. A pergunta 6 reforça C1 nos guardrails e o aviso de "não é aconselhamento profissional". A linguagem é neutra: "pessoa visitante", "pessoa responsável pelo projeto", "a pessoa". As únicas formas no masculino ("usuários reais", "diferentes usuários") são citação literal das perguntas do PDF, o que é aceito.

## A7. Transparência sobre IA: APROVADO
- **Ferramenta:** "Claude Code (modelo Claude Opus), no VS Code".
- **Etapas:** specs, código e testes, protótipo visual, infraestrutura (Docker, Nginx, DNS/SSL Cloudflare) e documentação.
- **O que a pessoa fez:** definiu escopo e regras (C4, D18, D16, D15, D17), testou o protótipo, pediu mudanças e aprovou cada decisão e cada ação na infraestrutura.
- **Validação:** testes, CI com gitleaks, `check-pronto.sh` e revisor com rubrica (`loops/`).

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
