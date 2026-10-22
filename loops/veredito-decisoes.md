# Veredito: `DECISOES.md`

- **Data:** 2026-10-22
- **Rubrica:** `loops/rubrica-entrega.md`, seção A (congelada)
- **Fonte das perguntas:** `doc/escopo-desafio/CLAVIS VIA Desafio Candidatos.pdf`, seção "Perguntas técnicas obrigatórias" e quadro "Transparência sobre IA e recursos externos"

## Critérios

### A1. Completo: APROVADO
Os 7 títulos `## 1.` a `## 7.` reproduzem o texto do PDF, por exemplo "## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?" e "## 7. Decisões: o que você deliberadamente deixou de fora e por quê? Onde usou IA no desenvolvimento?". Conferi os 7 com o PDF e o texto é o mesmo.

### A2. Responde o que foi perguntado: APROVADO
- 1: o porquê da stack ("Uma linguagem e um deploy...", D1/D2) e a comunicação em 4 camadas.
- 2: as tabelas e os itens "Usuários diferentes", "Check-ins" e "Evolução nos planos".
- 3: o que já está aplicado e uma lista numerada do que mudaria para usuários reais.
- 4: os itens **Deploy**, **Observar erros** e **Recuperar**.
- 5: três prioridades numeradas.
- 6: **IA**, **Assinatura via Kiwify** (webhook com validação e idempotência) e **Controle de acesso no servidor** (`entitlements`).
- 7: **Deixado de fora** e **Uso de IA**.

### A3. Ancorado no projeto: APROVADO
Cada resposta cita algo que dá para verificar. Conferi:
- `src/ui/api.ts` existe e trata 401, falta de conexão e carregamento.
- Rotas `app/api/**` usam `isSameOrigin`, `safeParse` (Zod) e o rate limit.
- `src/services` não importa `next/*`.
- `prisma/schema.prisma` tem as 7 tabelas, os índices `(userId, createdAt desc)` e `(userId, localDate)`, os únicos `(planId, dayNumber)` e `(userId, planDayId)`, e `onDelete: Restrict`.
- `tests/unit/today.test.ts` tem o caso São Paulo 21/10 / Tóquio 22/10.
- O E2E "S2: uma pessoa não vê os dados de outra" está em `tests/e2e/fluxo-principal.spec.ts`.
- `createMany({ skipDuplicates: true })` está em `src/repositories/plans.ts`, e a `$transaction` em `src/repositories/delete-data.ts`.
- `deploy/stack.yml` tem banco sem `ports`, `127.0.0.1:8097`, `unless-stopped`, logs 10m×3, `service_healthy` e `vida_pgdata`.
- `deploy/nginx/vida.conf` tem allow dos IPs do Cloudflare + `deny all`, CSP, HSTS, X-Frame-Options e `/api/health/ready` com `deny all`.
- O Dockerfile tem `USER node`, e o `docker-entrypoint.sh` roda `migrate deploy` + seed idempotente (`prisma/seed.ts` com upsert).
- `scripts/deploy.sh` tem o portão de CI, backup pré-deploy, `git archive` e `IMAGE_TAG`.
- `deploy/backup/vida-backup.sh` tem `gunzip -t` e retenção de 14 dias.
- `scripts/check-pronto.sh`, item 8, faz o `restore_check`.
- `.github/workflows/ci.yml` roda lint, tipos, unit, E2E chromium/webkit com Postgres e gitleaks com `fetch-depth: 0`.

### A4. Objetivo: APROVADO
As respostas são curtas, em tópicos e tabela, sem enchimento. A frase de fecho do item 7 ("O que garante a qualidade não depende da IA") é a mais opinativa, mas vem com evidência concreta (testes, CI, placar, revisor).

### A5. Honesto: REPROVADO
1. **Afirmação sem respaldo sobre o ROADMAP (pergunta 7).** O texto diz: "**Deixado de fora** (registrado com o motivo em `ROADMAP.md`, regra P1...)". Três dos itens listados **não estão** no `ROADMAP.md`:
   - "app nativo": não há entrada no ROADMAP.
   - "Sequências de dias (streaks)": o ROADMAP só tem "Modo guiado (dias sequenciais bloqueados)". Streaks estão apenas em D8/R6.
   - "Rate limit também no Nginx": está só como **pendente** em `specs/SECURITY.md` (camada 1), sem linha no ROADMAP.
2. **Afirmação imprecisa sobre pgvector (pergunta 6).** O texto diz: "A pgvector já está no Postgres para RAG". A imagem `pgvector/pgvector:pg16` (`deploy/stack.yml`, CI) traz a extensão, mas nenhuma migration em `prisma/migrations/` roda `CREATE EXTENSION vector`, e o schema não a usa. A extensão está disponível, mas não está habilitada.

Os demais pontos conferidos batem com o repositório: deploy, backup, restauração, CI, Nginx, sessão, exclusão (D19) e os itens marcados como ROADMAP (conta real, consentimento, exportação, backup externo, usuário do banco, observabilidade).

### A6. Tom (C1, C4): REPROVADO
- C1 passa: não há promessa de diagnóstico, terapia ou cura. A pergunta 6 reforça a regra ("sem diagnóstico, terapia ou cura", "não é aconselhamento profissional").
- C4 falha onde a forma neutra era possível e simples:
  - "**O responsável** definiu escopo e regras de produto..." e "a partir das decisões **do responsável**" (pergunta 7). C4 pede "a pessoa" em vez de flexões.
  - "Para **usuários reais**, mudaria:" (pergunta 3, corpo do texto). No título da pergunta 3, o termo é citação do PDF e pode ficar como está.

### A7. Transparência sobre IA: APROVADO
O texto informa:
- **Ferramenta:** "Claude Code (modelo Claude Opus), no VS Code".
- **Etapas:** specs, código e testes, protótipo visual, infraestrutura (Docker, Nginx, DNS, SSL via API do Cloudflare) e documentação.
- **O que foi decidido e validado pessoalmente:** escopo e regras de produto (C4, D18, D16, D15, D17), teste do protótipo e pedidos de mudança de experiência, e aprovação de cada decisão e de cada ação na infraestrutura.

O conteúdo é coerente com `README.md` (linhas 135–136) e com o CHANGELOG ("Revisão de UX após teste do protótipo").

## Correções necessárias
1. **Pergunta 7:** fazer a frase "registrado com o motivo em `ROADMAP.md`" ser verdadeira para todos os itens listados. Há dois caminhos:
   - incluir no `ROADMAP.md` linhas para "app nativo" e "rate limit no Nginx", e remeter streaks a D8/R6;
   - ou reescrever a introdução para citar a fonte de cada item: ROADMAP, D7/D8, `specs/SECURITY.md` (pendente) ou "fora do escopo do PDF".
2. **Pergunta 6:** trocar "A pgvector já está no Postgres" por algo exato, por exemplo: "a imagem do Postgres (`pgvector/pgvector:pg16`) já traz a extensão pgvector; habilitá-la é uma migration (`CREATE EXTENSION vector`)".
3. **Pergunta 7 (C4):** trocar "O responsável" e "do responsável" por formas neutras, como "A pessoa responsável pelo projeto" ou "quem desenvolveu".
4. **Pergunta 3 (C4):** trocar "Para usuários reais, mudaria:" por uma forma neutra, como "Com pessoas reais usando o app, mudaria:".

VEREDITO: REPROVADO
