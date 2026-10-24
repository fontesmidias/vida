# VIDA · Ver, Inspirar, Desacelerar, Avançar

Protótipo mobile-first de check-in emocional, feito para o desafio técnico CLAVIS VIA. A pessoa faz um check-in, recebe uma reflexão e uma prática coerentes com o estado, conclui o dia de um plano e vê tudo na própria jornada, com os dados salvos em Postgres.

> Espaço de autocuidado. Não substitui acompanhamento profissional. O botão **Apoio**, em todas as telas, leva ao CVV (188).

## Demo
**https://vida.fontesmidias.com.br**: abra no celular (ou no navegador em modo celular).

**Acesso:** a senha da conta de avaliação vai junto com as instruções de entrega; ela não aparece no app nem neste repositório. Se a conta já tiver registros, a Entrada oferece **Continuar de onde parou** ou **Começar do zero** (recomeçar não apaga nada).

**Roteiro** (o fluxo do desafio; o app guia cada passo com um botão "Próximo passo"):
1. Digite a senha → **Entrar**.
2. **Fazer check-in** → toque em **Com ansiedade** (um toque registra).
3. **Hoje** mostra a reflexão e a prática para ansiedade. Opcional: **Começar** abre a respiração guiada.
4. **Ver planos** → **Respirar com calma** → **Dia 1** → **Concluir dia**.
5. **Ver minha jornada**: o check-in e o "1 de 5" do plano estão lá.
6. Atualize a página: os dados continuam.

## Como rodar
Pré-requisitos: Node 24+ e Docker.

```bash
cp .env.example .env          # preencha POSTGRES_PASSWORD, DATABASE_URL, SESSION_SECRET e DEMO_PASSWORD
npm install
docker compose up -d db       # Postgres 16 em container
npx prisma migrate dev        # cria as tabelas (aplica as migrations)
npm run db:seed               # estados, conteúdos, planos e a conta de avaliação
npm run dev                   # http://localhost:3000 → entre com a DEMO_PASSWORD do seu .env
```

Testes: `npm run lint && npm run typecheck && npm test` (unidade + integração com o banco) e `npm run test:e2e` (fluxo completo no navegador, em tela de Pixel 7 e iPhone 13; na primeira vez, `npx playwright install chromium webkit`).

## Stack
Next.js 15 (App Router) + TypeScript · Postgres 16 + Prisma 6 · Zod (validação) · iron-session (sessão em cookie criptografado) · Vitest + Playwright · Docker na VPS, atrás de Nginx e Cloudflare · GitHub Actions (CI). O porquê de cada escolha: [`specs/TECH_STACK.md`](specs/TECH_STACK.md).

## Estrutura
```
app/(app)/            telas: hoje, check-in, pratica, planos, planos/[slug]/dia/[n], jornada
app/page.tsx          Entrada
app/api/**/route.ts   API REST: sessão, validação, limite de requisições, erros
src/services/         regras de negócio (R1–R8), sem dependência do Next
src/repositories/     acesso ao banco via Prisma, sempre filtrando pelo userId da sessão
src/ui/               componentes, ícones, práticas guiadas, cliente da API
prisma/               schema, migrations e seed (conteúdo de demonstração)
tests/                unit/, integration/ (Postgres) e e2e/ (Playwright)
deploy/ scripts/      stack do Docker, site do Nginx, deploy, backup
specs/                regras com IDs (R1, S2…), arquitetura, segurança, UX, decisões
```
Dependências em uma direção: `app → services → repositories → Prisma` ([`specs/ARCHITECTURE.md`](specs/ARCHITECTURE.md)).

## Variáveis de ambiente
Modelo sem segredos: [`.env.example`](.env.example). O `.env` real fica fora do Git, e o CI bloqueia segredos com gitleaks.

| Variável | Para quê |
|---|---|
| `DATABASE_URL` | Conexão do Prisma com o Postgres |
| `SESSION_SECRET` | Criptografa o cookie de sessão (mínimo 32 caracteres, validado na subida) |
| `DEMO_PASSWORD` | Senha da conta de avaliação, gravada pelo seed como hash (mínimo 8 caracteres) |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Banco local do `docker compose` |
| `SESSION_COOKIE_SECURE` (opcional) | `false` só para testar o build de produção em `http://localhost` |

As variáveis de deploy (VPS, Portainer, Cloudflare) ficam em [`.env.deploy.example`](.env.deploy.example); o app nunca as lê.

## Banco de dados (migrações)
- Esquema em [`prisma/schema.prisma`](prisma/schema.prisma); cada mudança vira uma migration versionada em `prisma/migrations/` (`npx prisma migrate dev --name <nome>`). Migration aplicada nunca é editada.
- Em produção, o container roda `prisma migrate deploy` (só as pendentes) e o seed ao subir.
- O seed ([`prisma/seed-data.ts`](prisma/seed-data.ts)) é idempotente: atualiza conteúdo e contas sem tocar em check-ins nem conclusões.
- Tabelas: `users`, `moods`, `checkins`, `daily_contents`, `plans`, `plan_days`, `plan_day_completions`, `journey_resets` (detalhes em [`DECISOES.md`](DECISOES.md), pergunta 2).

## O que é demonstração (mockado) e o que é real
| Real | Mockado / fictício |
|---|---|
| Check-ins e conclusões gravados no Postgres por uma API própria | Textos de reflexão, práticas e planos (marcados como **Demonstração** no app) |
| Login com senha em hash scrypt; cada consulta filtra pelo `userId` da sessão | Uma única conta de avaliação, sem cadastro nem e-mail |
| Regras de data por fuso, conclusão sem duplicar, limite de requisições, exclusão dos próprios dados | Não há IA, pagamento nem notificação |

## Uso de IA
- **Ferramenta:** Claude Code (Claude Opus), no VS Code. Boilerplate inicial: `create-next-app`.
- **Onde ajudou:** specs a partir das minhas decisões; código da API, telas e testes (teste primeiro, citando a regra); protótipo visual para validar a experiência; Docker, Nginx e Cloudflare; documentação.
- **O que decidi, revisei ou validei pessoalmente:** escopo e prioridades; regras de produto (linguagem neutra, sigla VIDA, apoio ao CVV, ícones próprios, práticas guiadas, fluxo guiado); testes no celular e pedidos de mudança de UX; aprovação de cada decisão e de cada ação na infraestrutura.
- **Garantias que não dependem da IA:** testes de unidade, integração e E2E em dois navegadores, CI com gitleaks e revisão dos documentos.

## Mais
[`DECISOES.md`](DECISOES.md) (as 7 perguntas) · [`docs/apresentacao.html`](docs/apresentacao.html) (visão geral para a conversa técnica) · [`docs/ROTEIRO_VIDEO.md`](docs/ROTEIRO_VIDEO.md) (vídeo de 5 min) · [`docs/OPERACAO.md`](docs/OPERACAO.md) (deploy, logs, backup) · [`specs/`](specs/) (regras e decisões D1–D31) · [`CHANGELOG.md`](CHANGELOG.md) · [`ROADMAP.md`](ROADMAP.md)
