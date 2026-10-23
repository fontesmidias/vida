# Veredito: docs/apresentacao.html (rubrica B)

Data: 2026-10-23
Revisor: subagente independente, contexto limpo (rubrica B + PDF do desafio + repositório).

## B1. Para o avaliador: APROVADO
- Abre com o botão "Abrir a demo" (`https://vida.fontesmidias.com.br`), as contas `avaliador1`–`avaliador3` e a senha `vida2026`.
- Seção "O fluxo principal em 6 passos" segue os 6 passos do PDF (entrar como demo, check-in "Com ansiedade", Hoje, plano e Dia 1, Jornada, recarregar a página).

## B2. Cobre o essencial: APROVADO
- Sigla VIDA (Ver, Inspirar, Desacelerar, Avançar), arquitetura com diagrama SVG e tabela de stack, modelo de dados (tabela com 8 tabelas), segurança e operação (tabela por camada), as 7 perguntas resumidas em `<details>` e link `../DECISOES.md`.

## B3. Consistente com o repositório: REPROVADO
Conferido e consistente: 8 tabelas e `onDelete: Restrict` (prisma/schema.prisma); `@@unique([userId, planDayId, cycle])` (R4 no ciclo); `journey_resets` (R8/D27); limites 30/min no login e 60/min nas escritas com 429 (src/lib/rate-limit.ts); contas e senha `vida2026` (prisma/seed-data.ts); `127.0.0.1:8097`, Postgres `pgvector/pgvector:pg16` sem `ports`, logs 10 MB × 3 (deploy/stack.yml); allowlist do Cloudflare, CSP, HSTS, X-Frame-Options (deploy/nginx/vida.conf); `USER node` e HEALTHCHECK (Dockerfile); Next 15.5, Prisma 6, Zod, iron-session, Tailwind 4 (package.json); scrypt (src/lib/password.ts); Origin em escrita (src/lib/http.ts); Pixel 7 e iPhone 13 (playwright.config.ts); E2E contra a demo via `E2E_BASE_URL` (scripts/check-pronto.sh); pendências no ROADMAP.md (rate limit no Nginx, papel do banco, cópia externa de backup, autoheal); rótulos "Entrar", "Continuar de onde parou", "Começar do zero", "Fazer check-in", "Com ansiedade", "Sem ânimo", "Concluir dia", "Respirar com calma" (5 dias), "Apagar meus dados", "Apoio" com 188; respiração 4 s / 6 s (src/ui/practices.tsx); botões de 58 px (app/globals.css); exemplo de fuso (02:30 UTC de 22/10 = 21/10 em São Paulo, 22/10 em Tóquio) correto; resumos das 7 respostas batem com DECISOES.md e docs/OPERACAO.md.

Divergências:
1. Rodapé: "decisões (D1–D24) no repositório". `specs/DECISIONS_LOG.md` vai até D28 (D25–D28 ativas, incluindo D26 e D27, que a própria apresentação descreve: contas de demonstração e "Começar do zero").
2. Diagrama: caixa "services/ · R1–R7". `specs/RULES.md` tem R8 ("Começar do zero sem apagar"), implementada em `src/services/accounts.ts` e citada pela própria apresentação na tabela de dados. (O mesmo "R1–R7" desatualizado aparece em specs/ARCHITECTURE.md e README.md, mas a fonte das regras é RULES.md.)

## B4. Legível em celular e tela grande, claro e escuro: APROVADO
- CSS: tokens em `:root`, escuro em `@media (prefers-color-scheme: dark)` com `:root:not([data-theme="light"])` e em `:root[data-theme="dark"]`; `body` com fundo explícito; tabelas e diagrama com `overflow-x: auto` na própria caixa; fonte externa só do Google Fonts.
- Playwright (detalhes abertos, `window.scrollTo(500,0)`): Pixel 7 (Chromium) 412 px, iPhone 13 (WebKit) 390 px e 1280 px, claro e escuro: `scrollX = 0` e `scrollWidth = innerWidth` em todos; nenhum elemento fora das caixas roláveis passa da largura; fundo e texto trocam corretamente (claro rgb(246,245,241)/rgb(31,42,39); escuro rgb(18,24,22)/rgb(231,238,234)).
- Capturas: `test-results/apresentacao-{pixel7,iphone13,desk1280}-{light,dark}.png`.

## B5. Honesto e no tema: APROVADO
- Selo "conteúdo de demonstração" na abertura e no rodapé (C2); "Não substitui acompanhamento profissional" (C1).
- Futuro marcado como futuro: pergunta 6 começa com "Plano (nada disso está no protótipo)"; pgvector "disponível para RAG futuro"; API "consumível por app nativo no futuro"; pergunta 5 como prioridades; "Pendências registradas, sem esconder" com ROADMAP; reinício automático por healthcheck "está no ROADMAP". Nada fora do escopo apresentado como feito.

## Correções necessárias
1. Rodapé: trocar "D1–D24" pela faixa real (D1–D28) ou remover a faixa.
2. Diagrama: trocar "services/ · R1–R7" por "R1–R8" (ou só "regras R*").

VEREDITO: REPROVADO
