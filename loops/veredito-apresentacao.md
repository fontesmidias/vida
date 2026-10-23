# Veredito: docs/apresentacao.html

Data: 2026-10-23
Revisor: subagente independente, contexto limpo, rubrica `loops/rubrica-entrega.md` seção B (e "Como o revisor trabalha"). Fontes: PDF do desafio (6 passos do fluxo, 7 perguntas), repositório na `main` (23f480a).

## B1. Para o avaliador: APROVADO
- Abre com o botão "Abrir a demo" (`https://vida.fontesmidias.com.br`), as contas `avaliador1`–`avaliador3` e a senha `vida2026`, logo no primeiro bloco.
- "O fluxo principal em 6 passos" cobre os 6 passos do PDF: entrar → check-in "Com ansiedade" → Hoje coerente → plano "Respirar com calma", dia 1, "Concluir dia" → Jornada "1 de 5" → recarregar.

## B2. Cobre o essencial: APROVADO
- Sigla VIDA (Ver · Inspirar · Desacelerar · Avançar, D18) e proposta.
- Arquitetura com diagrama SVG (Navegador → Cloudflare → Nginx → app em camadas → Postgres) e tabela de stack.
- Modelo de dados (tabela das 8 tabelas), segurança e operação (tabela "Camadas independentes", com linha "Operação" e pendências).
- As 7 respostas em `<details>` com o mesmo tema das 7 perguntas do PDF e link `../DECISOES.md`.

## B3. Consistente com o repositório: APROVADO
Cada frase verificável foi conferida:
- **Contas e senha:** `avaliador1`–`3` e `DEMO_PASSWORD = "vida2026"` (`prisma/seed-data.ts`). Rótulos "Com ansiedade", "Sem ânimo", 8 estados em 4 famílias (seed, D11). Plano "Respirar com calma" com dia 1 "Perceber a respiração" e 5 dias, daí "1 de 5" (seed; `app/(app)/jornada/page.tsx`). Na tela do plano aparecem o número do dia e o título, o que confere com "dia 1 · Perceber a respiração".
- **Rótulos de tela:** "Entrar", "Continuar de onde parou", "Começar do zero" (`src/ui/DemoLogin.tsx`); "Fazer check-in" e "Começar" → `/pratica` (`app/(app)/hoje/page.tsx`); prática "Respiração 4-6" da família agitado (seed); "Concluir dia"; "Voltar" no cabeçalho (`src/ui/AppFrame.tsx`); botão Apoio no cabeçalho de todas as telas, inclusive a Entrada e a prática (`Header` em `AppFrame.tsx` e `app/page.tsx`).
- **E2E:** os 6 passos estão em `tests/e2e/fluxo-principal.spec.ts`. `playwright.config.ts` usa Pixel 7 (Chromium) e iPhone 13 (WebKit) e aceita `E2E_BASE_URL`. A suíte roda no CI (`.github/workflows/ci.yml`) e contra a demo (`scripts/check-pronto.sh`).
- **Princípios de UX:** zero digitação com exceção da senha, D28 (U1 em `specs/UI_UX_SPEC.md`, D28 no log); botões de 58 px (`.btn { min-height: 58px }`, `app/globals.css`); Voltar visível (U9); verbo em toda ação (U13); área segura (U12); práticas um passo por vez (D17); sem streaks (D8).
- **Modelo de dados:** as 8 tabelas são `users`, `moods`, `checkins`, `daily_contents`, `plans`, `plan_days`, `plan_day_completions` e `journey_resets` (`@@map` em `prisma/schema.prisma`). Todas as FKs são `ON DELETE RESTRICT` nas 3 migrations: nenhuma exclusão em cascata. Também conferem: `(plan_id, day_number)` único; `(user_id, plan_day_id, cycle)` único (R4); `current_cycle`; `password_hash`; `timezone` e `local_date`; `practice_kind` (D17). O exemplo de fuso está certo: 02:30 UTC de 22/10 é 23:30 de 21/10 em São Paulo e 11:30 de 22/10 em Tóquio.
- **Segurança:** login 30/min e escritas 60/min, com resposta 429 (`src/lib/rate-limit.ts` aplicado em `app/api/session/demo` e nas 4 rotas de escrita); scrypt (`src/lib/password.ts`); Origin/CSRF (`specs/SECURITY.md`); iron-session sem tabela (S4). No Nginx: `allow` só para faixas do Cloudflare + `deny all` (403); CSP, HSTS e X-Frame-Options (`deploy/nginx/vida.conf`). TLS strict (D23). O banco não publica `ports`, o app fica em `127.0.0.1:8097` e a imagem é `pgvector/pgvector:pg16` (`deploy/stack.yml`). `USER node` e healthcheck em `/api/health/ready` com `SELECT 1` (`Dockerfile`, rota). gitleaks no CI (histórico inteiro).
- **Operação:** `scripts/deploy.sh` recusa commit sem CI `success` e faz backup pré-deploy. Backup diário com restauração provada no item 8 do check (`docs/OPERACAO.md`). Logs com rotação 10 MB × 3 (`stack.yml`). "Unhealthy" exige reinício manual, e o automático está no ROADMAP.
- **Pendências:** Nginx `limit_req`, usuário do banco sem privilégio de dono e cópia externa de backups são linhas do `ROADMAP.md`.
- **Stack:** Next 15.5, Prisma 6, Zod, iron-session, Tailwind 4, Vitest e Playwright (`package.json`). As decisões vão de D1 a D28 (`specs/DECISIONS_LOG.md`).
- **7 resumos contra `DECISOES.md`:** todos condizem com o texto completo, sem afirmar nada a mais. Q4 condiz com `docs/OPERACAO.md`. Q7 cita o ROADMAP para conta real, chat, Kiwify e música, mais D4, D7 e D8.
- Observação, sem divergência: os nomes das famílias na legenda ("Agitação", "Baixa energia", "Peso", "Serenidade") são substantivações neutras (C4) das famílias `agitado`, `baixa_energia`, `pesado` e `sereno` (D11). Não são rótulos de tela, e a página não os apresenta como rótulos de tela.

## B4. Legível em celular e tela grande, claro e escuro: APROVADO
- **CSS:** tokens em `:root`. O escuro vale em `prefers-color-scheme: dark` (com a guarda `:root:not([data-theme="light"])`) e em `[data-theme="dark"]`. `body` tem fundo explícito. A coluna tem `max-width: 46rem`. O `.wrap` usa `overflow-x: clip` e margens com `env(safe-area-inset-*)`. Tabelas e diagrama rolam dentro da própria caixa (`overflow-x: auto`).
- **Playwright** em Pixel 7 (Chromium), iPhone 13 (WebKit) e 1280px (Chromium), claro e escuro. Depois de `window.scrollTo(500,0)`, `window.scrollX = 0` nos 6 casos, e `scrollWidth` é igual a `clientWidth` (412/412, 390/390, 1280/1280). Nenhum elemento fora das caixas roláveis passa da viewport.
- **Fundo e texto:** claro `rgb(246,245,241)`/`rgb(31,42,39)`, escuro `rgb(18,24,22)`/`rgb(231,238,234)`.
- **Celular:** o diagrama (652px) e a tabela de dados (423px) rolam dentro da caixa, o que a rubrica aceita.
- **Capturas** em `test-results/apresentacao-*.png`: topo do celular no escuro, seção de dados no claro e arquitetura em 1280px no escuro, todas legíveis e sem sobreposição.

## B5. Honesto e no tema: APROVADO
- **Demonstração (C2):** o selo "conteúdo de demonstração" aparece no topo, e o rodapé diz "protótipo para avaliação técnica · conteúdo de demonstração". A página tem o aviso de cuidado (C1/C3) e não promete diagnóstico.
- **Plano futuro marcado como plano:**
  - "pgvector disponível para RAG futuro";
  - "API consumível por app nativo no futuro";
  - Q3 "Para dados reais: …";
  - Q5 como prioridades;
  - Q6 "Plano (nada disso está no protótipo)";
  - Q4 "automático está no ROADMAP";
  - "Pendências registradas, sem esconder … (`ROADMAP.md`)".
- Nada fora do escopo do desafio aparece como feito: chat, Kiwify e música estão como "Fora" na Q7.

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
