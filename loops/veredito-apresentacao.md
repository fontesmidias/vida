# Veredito: docs/apresentacao.html

Data: 2026-10-22
Avaliação do zero, apenas pela seção B da rubrica congelada (`loops/rubrica-entrega.md`), sem consultar vereditos anteriores.

## B1. Para o avaliador: APROVADO
- Abre com o botão "Abrir a demo" (`https://vida.fontesmidias.com.br`) e "sem cadastro, no celular ou em modo celular" logo na primeira seção.
- "O fluxo principal em 6 passos" segue os 6 passos do PDF (seção 03): entrar como demonstração → check-in "Com ansiedade" → Hoje com reflexão/prática coerente → plano "Respirar com calma", Dia 1, "Concluir dia" → Jornada com check-in e "1 de 5" → recarregar e ver os dados.

## B2. Cobre o essencial: APROVADO
- Proposta e sigla: lista V·I·D·A (Ver, Inspirar, Desacelerar, Avançar), coerente com D18.
- Arquitetura com diagrama SVG (Navegador → Cloudflare → Nginx → App Next.js [api/, services/, repositories/] → Postgres 16) e tabela de stack.
- Modelo de dados: tabela com as 7 tabelas.
- Segurança e operação: tabela por camada (borda, aplicação, dados, processo, operação).
- As 7 respostas resumidas em `<details>` 1–7, com link `../DECISOES.md`.

## B3. Consistente com o repositório: APROVADO
Conferido item a item:
- Tabelas: `users, moods, checkins, daily_contents, plans, plan_days, plan_day_completions` = 7 em `prisma/schema.prisma`; todas as relações com `onDelete: Restrict` ("nenhuma exclusão em cascata"); `@@unique([planId, dayNumber])` ("dia único por plano"); `@@unique([userId, planDayId])` (R4); `Checkin` com `createdAt`, `timezone`, `localDate`.
- Limites: `src/lib/rate-limit.ts` `session: 20/60s`, `write: 30/60s`, resposta 429 = "sessão 20/min, escritas 30/min (429)".
- `127.0.0.1:8097`, rede `interna` sem `ports` no db, `restart: unless-stopped`, logs 10m×3 em `deploy/stack.yml`; imagem `pgvector/pgvector:pg16` (Postgres 16 + pgvector; "disponível para RAG futuro" coincide com DECISOES.md, pergunta 6).
- Healthcheck do `Dockerfile` chama `/api/health/ready`, que faz `SELECT 1` ("consulta o banco"); `USER node` (container sem root).
- Nginx (`deploy/nginx/vida.conf`): allow só faixas do Cloudflare + `deny all`, CSP, HSTS, X-Frame-Options; TLS full strict (D23).
- Origin em escrita: `src/lib/http.ts` `isSameOrigin` (SECURITY.md, 403).
- Decisões citadas (D1, D4, D6, D7, D8, D17, D19, D1–D24) existem em `specs/DECISIONS_LOG.md` com o sentido usado; regras R1–R7, S2, S4, S5, S6 em `specs/RULES.md` com o sentido usado.
- Pendências "limite também no Nginx, usuário do banco sem privilégio de dono, cópia dos backups fora da VPS (ROADMAP.md)": as três estão no `ROADMAP.md` e as duas primeiras marcadas como pendentes em `specs/SECURITY.md`.
- Pergunta 4: "reiniciar nesse caso é manual; automático está no ROADMAP" coincide com `docs/OPERACAO.md` e com a linha "Reinício automático quando o healthcheck falha" do ROADMAP; backup diário (cron 03:15) e prova de restauração no item 8 do `check-pronto.sh`.
- Pergunta 7: "conta real, chat, Kiwify, música (motivos no ROADMAP)": as quatro linhas existem no ROADMAP; "texto livre (D4)", "streaks e dias em ordem obrigatória (D7, D8)" conferem. Os resumos 1–7 condizem com `DECISOES.md`.
- E2E: `playwright.config.ts` com projetos Pixel 7 (Chromium) e iPhone 13 (WebKit); CI instala `chromium webkit` e roda `npm run test:e2e`; `check-pronto.sh` roda com `E2E_BASE_URL` contra a demo pública.
- Rótulos: "Entrar como demonstração" (`src/ui/EnterButton.tsx`), "Fazer check-in", "Começar" (`app/(app)/hoje/page.tsx`), "Com ansiedade" e "Respirar com calma" (`prisma/seed-data.ts`), "Respiração 4-6", "Concluir dia", "1 de 5" (plano com 5 dias), botões `min-height: 58px` (`app/globals.css`), versões Next 15, Prisma 6, Tailwind 4, iron-session, Zod (`package.json`).
- Observação menor, que não reprova: o clique em "Começar" (passo 3) é coberto por outro teste E2E ("prática guiada…"), não pelo teste "fluxo principal do desafio". Os nomes de família "Agitação/Baixa energia/Peso/Serenidade" são formas neutras dos nomes de D11, sem divergência de fato.

## B4. Legível em celular e tela grande, claro e escuro: APROVADO
- CSS: tokens em `:root`, tema escuro em `@media (prefers-color-scheme: dark)` com `:root:not([data-theme="light"])` e em `:root[data-theme="dark"]`; `body` com fundo explícito; `.wrap` com `overflow-x: clip` e gutter ≥ 20px com safe-area; diagrama e tabelas com `overflow-x: auto` na própria caixa.
- Playwright (Pixel 7/Chromium, iPhone 13/WebKit, 1280px/Chromium × claro/escuro): após `window.scrollTo(500,0)`, `scrollX = 0` nos 6 casos; `scrollWidth == clientWidth` (412, 390, 1280); nenhum elemento fora da tela além do diagrama e das tabelas, que rolam dentro da própria caixa (no celular, o diagrama e a tabela de stack). Fundo/texto: claro `rgb(246,245,241)`/`rgb(31,42,39)`, escuro `rgb(18,24,22)`/`rgb(231,238,234)`.
- Capturas em `test-results/apresentacao-{pixel7,iphone13,desktop1280}-{light,dark}.png`; layout legível nos dois tamanhos.

## B5. Honesto e no tema: APROVADO
- Marcado como demonstração (C2): selo "Desafio técnico CLAVIS VIA · conteúdo de demonstração" e rodapé "conteúdo de demonstração".
- Plano futuro marcado como plano: pergunta 6 começa com "Plano (nada disso está no protótipo)"; "pgvector disponível para RAG futuro"; "API consumível por app nativo no futuro"; pendências declaradas "sem esconder"; reinício automático por healthcheck "no ROADMAP".
- Nada fora do escopo é apresentado como feito. Tom C1: "Não substitui acompanhamento profissional", CVV 188, sem promessa de diagnóstico, terapia ou cura.

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
