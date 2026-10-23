# Veredito: docs/apresentacao.html (rubrica seção B)

Data: 2026-10-23
Revisor: subagente independente, contexto limpo, rubrica `loops/rubrica-entrega.md` (seção B).

## B1. Para o avaliador: APROVADO
- Abre com o botão "Abrir a demo" (`https://vida.fontesmidias.com.br`), as contas `avaliador1`–`avaliador3` e a senha `vida2026`.
- Logo depois vem "O fluxo principal em 6 passos". Os passos batem com os 6 do PDF (seção 03): entrar, check-in "Com ansiedade", Hoje coerente, plano e Dia 1 concluído, Jornada, recarregar e conferir a persistência.

## B2. Cobre o essencial: APROVADO
- Proposta e sigla: V·I·D·A = Ver, Inspirar, Desacelerar, Avançar (D18).
- Arquitetura: diagrama SVG (Navegador → Cloudflare → Nginx → App Next.js em camadas → Postgres 16) e uma tabela de stack.
- Modelo de dados: tabela com as 8 tabelas.
- Segurança e operação: tabela "Camadas independentes" e as pendências.
- As 7 respostas: resumidas em `<details>` numerados de 1 a 7, com link `../DECISOES.md`.

## B3. Consistente com o repositório: REPROVADO
Conferido e consistente:
- **Banco:** 8 tabelas com `@@map` e `onDelete: Restrict` em todas as FKs. Nenhum `ON DELETE CASCADE` nas migrations (só `ON UPDATE CASCADE`). `@@unique([planId, dayNumber])`, `@@unique([userId, planDayId, cycle])`, `journey_resets` e `current_cycle` existem.
- **Limites:** login 30/min (`session`, usado em `api/session/demo`) e escritas 60/min, com resposta 429 (`src/lib/rate-limit.ts`).
- **Seed:** contas, senha `vida2026`, 8 estados em 4 famílias, "Com ansiedade" e "Sem ânimo", plano "Respirar com calma" com 5 dias e prática `breath` na família agitado (`prisma/seed-data.ts`).
- **Infraestrutura:** `127.0.0.1:8097`, `pgvector/pgvector:pg16` sem `ports`, `restart: unless-stopped` (`deploy/stack.yml`). `USER node` e HEALTHCHECK em `/api/health/ready` com `SELECT 1` (`Dockerfile`). Allowlist do Cloudflare com `deny all`, TLS, CSP, HSTS e X-Frame-Options (`deploy/nginx/vida.conf`).
- **Código e testes:** scrypt (`src/lib/password.ts`); verificação de Origin (`src/lib/http.ts`); Next 15.5, Prisma 6, Zod, iron-session, Tailwind e Vitest (`package.json`); Pixel 7 e iPhone 13 (`playwright.config.ts`); E2E no CI (`.github/workflows/ci.yml`) e contra a demo via `E2E_BASE_URL` (`scripts/check-pronto.sh`).
- **Faixas de IDs:** D1–D28 (`specs/DECISIONS_LOG.md`), R1–R8 (`specs/RULES.md`) e S2, S4, S5, S6, S8 (`specs/SECURITY.md`).
- **Pendências:** as três citadas estão no `ROADMAP.md`.
- **Exemplo de fuso:** 02:30 UTC de 22/10 é 21/10 em São Paulo e 22/10 em Tóquio. Correto.
- **Rótulos:** "Entrar", "Continuar de onde parou", "Começar do zero", "Fazer check-in", "Começar", "Planos", "Concluir dia", "Jornada", "1 de 5", "Voltar", "Apoio" com 188 e "Apagar meus dados" aparecem em `app/` e `src/ui/`. Botões de 58 px confirmados (`app/globals.css`).
- **Resumos das 7 respostas:** batem com `DECISOES.md` e `docs/OPERACAO.md`, inclusive o `unhealthy` com reinício manual e o autoheal no ROADMAP.

Divergência:
- A seção Produto afirma, sem ressalva: "Zero digitação, botões de 58 px…". O código tem um campo de senha digitado (`src/ui/DemoLogin.tsx`, `input type="password"`), e a decisão D28 registra isso como "Exceção a U1 (zero digitação): a senha da conta de demonstração é digitada". A frase contradiz a D28, o código e o passo 1 da própria página ("digite a senha").

## B4. Legível em celular e em tela grande; claro e escuro: APROVADO
- **CSS:** tokens em `:root`, redefinidos em `@media (prefers-color-scheme: dark)` com `:root:not([data-theme="light"])` e em `:root[data-theme="dark"]`. O `body` tem fundo explícito, `.wrap` usa `overflow-x: clip` e as tabelas e o diagrama rolam dentro da própria caixa (`overflow-x: auto`).
- **Playwright** (Pixel 7/Chromium, iPhone 13/WebKit, 1280 px/Chromium; claro e escuro): `window.scrollTo(500,0)` deixou `scrollX = 0` nos 6 casos, com `scrollWidth` igual à viewport (412, 390, 1280). Nenhum elemento sai da tela fora de uma caixa com rolagem. O fundo e o texto mudam corretamente (claro `rgb(246,245,241)`/`rgb(31,42,39)`; escuro `rgb(18,24,22)`/`rgb(231,238,234)`).
- **Rolagem interna no celular:** só o diagrama (652 px em 370) e a tabela de arquitetura (423 px em 370) rolam dentro da caixa, o que é aceitável.
- **Capturas:** `test-results/apresentacao-{pixel7,iphone13,desktop1280}-{light,dark}.png`.

## B5. Honesto e no tema: APROVADO
- **Marcação de demonstração (C2):** o selo diz "conteúdo de demonstração" e o rodapé também.
- **Planos futuros marcados como plano:**
  - "extensão pgvector disponível para RAG futuro";
  - "API consumível por app nativo no futuro";
  - a pergunta 3 separa "Já aplicado" de "Para dados reais";
  - a pergunta 6 começa com "Plano (nada disso está no protótipo)";
  - o reinício automático aparece como "automático está no ROADMAP";
  - as pendências são citadas como pendências, com o ROADMAP.
- **Tom (C1):** não promete diagnóstico nem cura ("Não substitui acompanhamento profissional").

## Correções necessárias
1. Na seção Produto, troque "Zero digitação" por uma frase que traga a exceção da D28. Exemplo: "Zero digitação depois de entrar (a senha da conta de demonstração é a única exceção, D28)".

Recomendação, não bloqueia: no passo 4, "Dia 1" é o nome acessível do link. Na tela aparecem o número "1" e o título "Perceber a respiração". Pode valer citar o título.

VEREDITO: REPROVADO
