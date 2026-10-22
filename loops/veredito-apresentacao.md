# Veredito: docs/apresentacao.html (rubrica B)

Data: 2026-10-22. Revisor independente, contexto limpo; avaliado só contra a seção B de `loops/rubrica-entrega.md`, o PDF do desafio e o repositório.

## B1. Para o avaliador: APROVADO
- Abre com o botão "Abrir a demo" → `https://vida.fontesmidias.com.br` e "sem cadastro, no celular ou em modo celular".
- Seção "O fluxo principal em 6 passos" segue os 6 passos do PDF (03 Fluxo): entrar como demonstração → check-in "Com ansiedade" → Hoje com reflexão/prática → plano, Dia 1, "Concluir dia" → Jornada com check-in e "1 de 5" → recarregar e os dados continuam.

## B2. Cobre o essencial: APROVADO
- Sigla VIDA (Ver, Inspirar, Desacelerar, Avançar) explicada como o fluxo; arquitetura com diagrama SVG (Navegador → Cloudflare → Nginx → App em camadas → Postgres) e tabela de stack; modelo de dados (7 tabelas); segurança e operação (tabela por camada + pendências); as 7 respostas em `<details>` com link para `../DECISOES.md`.

## B3. Consistente com o repositório: REPROVADO
Conferido e consistente:
- 7 tabelas `users, moods, checkins, daily_contents, plans, plan_days, plan_day_completions` (`@@map` em `prisma/schema.prisma`); todas as relações `onDelete: Restrict` ("nenhuma exclusão em cascata"); `@@unique([planId, dayNumber])` e `@@unique([userId, planDayId])` (R4).
- Limites `session 20/min`, `write 30/min`, 429 (`src/lib/rate-limit.ts`).
- `127.0.0.1:8097:3000`, rede `interna`, banco sem `ports`, `restart: unless-stopped`, `pgvector/pgvector:pg16` (`deploy/stack.yml`); `USER node` e HEALTHCHECK em `/api/health/ready`, que faz `SELECT 1` (Dockerfile, `app/api/health/ready/route.ts`).
- Nginx: `allow` só faixas do Cloudflare + `deny all`, CSP, HSTS, X-Frame-Options (`deploy/nginx/vida.conf`); TLS Full strict (D23).
- Versões Next 15, Prisma 6, Zod, iron-session, Tailwind, Vitest, Playwright (`package.json`); gitleaks e E2E Chromium+WebKit no CI; projetos Pixel 7 / iPhone 13 e `E2E_BASE_URL` para a demo (`playwright.config.ts`, `scripts/check-pronto.sh`).
- Deploy com portão de CI e backup pré-deploy (`scripts/deploy.sh`); backup diário e prova de restauração (`docs/OPERACAO.md`); unhealthy sem reinício automático, reinício automático no ROADMAP (consistente com DECISOES §4).
- Pendências do ROADMAP: rate limit no Nginx, usuário do banco sem privilégio de dono, cópia externa dos backups: todas presentes.
- Decisões D1, D4, D6, D17, D19, faixa D1–D24; regras R1–R7, S2, S4, S5, S6 conferem com `specs/`.
- Rótulos: "Entrar como demonstração" (`src/ui/EnterButton.tsx`), "Fazer check-in" e "Começar" (`app/(app)/hoje/page.tsx`), "Com ansiedade", "Sem ânimo", "Respirar com calma" (5 dias) e "Respiração 4-6" (`prisma/seed-data.ts`), "Concluir dia", abas Hoje/Planos/Jornada, "Apoio", "Voltar", "Apagar meus dados", botões `min-height: 58px` (`app/globals.css`), "X de Y" na Jornada.

Divergência encontrada:
- Resposta 7 do resumo: "Fora: conta real, texto livre, chat, Kiwify, streaks, música (com o motivo no ROADMAP)". O `ROADMAP.md` não tem item sobre streaks/sequências (só "Modo guiado (dias sequenciais bloqueados)", que é outra coisa); o motivo de não haver streaks está em D8/R6 (`specs/DECISIONS_LOG.md`, `specs/RULES.md`), como o próprio `DECISOES.md` §7 diz. A página aponta para a fonte errada.

## B4. Legível em celular e tela grande; claro e escuro: APROVADO
- CSS: tokens em `:root`, bloco `@media (prefers-color-scheme: dark)` com `:root:not([data-theme="light"])` e `:root[data-theme="dark"]`; `body` com fundo explícito; `.wrap` com `max-width: 46rem`, gutter de 20px e `overflow-x: clip`; diagrama e tabelas com rolagem interna (`overflow-x: auto`).
- Playwright (Pixel 7/Chromium, iPhone 13/WebKit, 1280px/Chromium; claro e escuro): após `window.scrollTo(500,0)`, `scrollX = 0` e `scrollWidth = clientWidth` (412, 390, 1280) em todos os 6 casos; nenhum elemento fora do diagrama/tabelas ultrapassa a viewport. Cores: claro `#1f2a27` sobre `#f6f5f1`, escuro `#e7eeea` sobre `#121816`; botão com contraste adequado nos dois.
- Capturas em `test-results/apresentacao-*.png`.
- Observação (não bloqueia): no celular a tabela de modelo de dados passa 42px da caixa (390 vs 348) por causa do `nowrap` em `plan_day_completions`, então a coluna "Regra" aparece cortada até deslizar a tabela; o diagrama exige deslizar (min-width 620px). Os dois rolam dentro da própria caixa, sem rolagem lateral da página.

## B5. Honesto e no tema: APROVADO
- Selo "conteúdo de demonstração" no topo e no rodapé (C2); "Não substitui acompanhamento profissional"; sem promessa de diagnóstico, terapia ou cura (C1).
- As pendências estão declaradas ("Pendências registradas, sem esconder").
- Recomendação (não bloqueia): o resumo da resposta 6 ("IA no servidor…; Kiwify: webhook com assinatura validada…") está no presente, sem marcar que é plano; a resposta 7 diz que Chat e Kiwify ficaram de fora, mas um "faria"/"plano:" evita a leitura de que já existe.

## Correções necessárias
1. Resposta 7: tirar streaks de "(com o motivo no ROADMAP)" ou citar a fonte certa (ex.: "streaks (D8)").
2. (Recomendado) Resposta 6: marcar como plano futuro (ex.: "Como faria: …").

VEREDITO: REPROVADO
