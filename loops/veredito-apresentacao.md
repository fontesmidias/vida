# Veredito: docs/apresentacao.html

Data: 2026-10-22
Rubrica: `loops/rubrica-entrega.md`, seção B. Revisor independente, sem leitura de vereditos anteriores.

## B1. Para o avaliador — APROVADO
- Abre com o botão "Abrir a demo" → `https://vida.fontesmidias.com.br` e "sem cadastro".
- Seção "O fluxo principal em 6 passos" corresponde aos 6 passos do PDF (entrar como demo → check-in "ansioso" → Hoje com reflexão/prática → plano e Dia 1 → Jornada → recarregar). Os rótulos citados existem no código: "Entrar como demonstração" (`src/ui/EnterButton.tsx:32`), "Fazer check-in" (`app/(app)/hoje/page.tsx:56`), "Com ansiedade" (`prisma/seed-data.ts:13`), "Começar" (`hoje/page.tsx:80`), "Respiração 4-6" (`seed-data.ts:37`), "Planos"/"Jornada" (`src/ui/navigation.ts`), "Respirar com calma" com 5 dias, "Concluir dia", "1 de 5". O E2E `tests/e2e/fluxo-principal.spec.ts` segue exatamente essa sequência, em Pixel 7 e iPhone 13 (`playwright.config.ts`).

## B2. Cobre o essencial — APROVADO
Proposta e sigla VIDA (Ver · Inspirar · Desacelerar · Avançar, D18); arquitetura com diagrama SVG e tabela de stack; modelo de dados (7 tabelas); segurança e operação em camadas; as 7 perguntas resumidas em `<details>` com link para `../DECISOES.md`.

## B3. Consistente com o repositório — REPROVADO
Conferido e consistente: 7 tabelas e `onDelete: Restrict` em todas as relações (`prisma/schema.prisma`); únicos `(planId, dayNumber)` e `(userId, planDayId)`; limites 20/min sessão e 30/min escrita com 429 (`src/lib/rate-limit.ts`); `127.0.0.1:8097`, Postgres sem `ports` e `pgvector/pgvector:pg16` (`deploy/stack.yml`); `deny all` + allow do Cloudflare, CSP, HSTS, X-Frame-Options (`deploy/nginx/vida.conf`); Next.js 15, Prisma 6, iron-session, Zod, Tailwind (`package.json`); `USER node` e HEALTHCHECK em `/api/health/ready` com `SELECT 1` (`Dockerfile`, `app/api/health/ready/route.ts`); backup pré-deploy (`scripts/deploy.sh:32`); Origin em escrita (`src/lib/http.ts`); D1–D24, R1–R7, S2/S4/S5/S6; pendências (rate limit no Nginx, papel do banco, backup externo) presentes no `ROADMAP.md`; 8 estados em 4 famílias (D11); exemplo de fuso (02:30 UTC de 22/10 = 21 em São Paulo, 22 em Tóquio) correto.

Divergência:
- Resumo da pergunta 4 (linha 242): "healthcheck que **reinicia sozinho**". O `DECISOES.md` atual diz o contrário: "o healthcheck marca `unhealthy` ... mas no Docker standalone não reinicia sozinho ... (reinício automático por healthcheck está no ROADMAP)". A stack é Compose (container `vida-app-1`, `restart: unless-stopped`), que não reinicia container `unhealthy`. A página afirma um comportamento que o projeto não tem.

## B4. Legível em celular e tela grande; claro e escuro — REPROVADO
- CSS correto em temas: tokens no `:root`, bloco `prefers-color-scheme: dark` com `:root:not([data-theme="light"])` e `:root[data-theme="dark"]`, `body` com fundo explícito. Contraste (WCAG) ok nos dois esquemas: texto/fundo 13,6 e 15,3; muted/fundo 5,7 e 8,2; botão 5,3 e 9,0; on-soft/soft 6,7 e 8,7; accent/soft 4,6 e 6,5.
- 1280px, claro e escuro: `scrollWidth` 1280 = `clientWidth` 1280, sem rolagem horizontal.
- **Pixel 7 (412px), claro e escuro: rolagem horizontal da página.** `scrollWidth` 432 vs. 412; `innerWidth` 432, `visualViewport.width` 412, e um gesto horizontal desloca a vista em 20px (`visualViewport.pageLeft` = 20). Causa: `.hero::before { right: -40px; width: 220px }` ultrapassa o padding de 20px da `.wrap`; ocultando o pseudo-elemento, `scrollWidth` volta a 412. Tabelas e diagrama rolam só dentro dos próprios contêineres (`overflow-x: auto`), o que é aceitável.
- Capturas: `test-results/apresentacao-{pixel7,1280}-{light,dark}.png`.

## B5. Honesto e no tema — APROVADO
Selo "conteúdo de demonstração" na abertura e no rodapé (C2); aviso "Não substitui acompanhamento profissional" e CVV 188 (C1). O botão Apoio está em todas as telas (o `Header` com `SupportButton` é usado também na entrada). IA, Kiwify e RAG aparecem só como plano futuro (pergunta 6, "pgvector disponível para RAG futuro"); as pendências estão declaradas. Ressalva: o "reinicia sozinho" do B3 também é uma afirmação de algo que o projeto não faz. Fica reprovado em B3, não aqui.

## Correções necessárias
1. Linha 242 (resumo da pergunta 4): trocar "healthcheck que reinicia sozinho" por algo fiel ao `DECISOES.md`, por exemplo "`restart: unless-stopped` reinicia se o processo cair; healthcheck consulta o banco e marca `unhealthy`".
2. Eliminar a rolagem horizontal no celular: conter o `.hero::before` (ex.: `overflow-x: clip` no `body` ou na `.wrap`, ou `right: 0`/largura menor) e confirmar `scrollWidth == clientWidth` no Pixel 7.
3. Observação fora deste documento: `docs/OPERACAO.md` (linhas 10 e 24) repete "o Docker reinicia o app se falhar" / "o healthcheck já reinicia sozinho", o que contradiz o `DECISOES.md` corrigido.

VEREDITO: REPROVADO
