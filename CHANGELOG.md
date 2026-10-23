# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-10-23
### Adicionado
- Contas de demonstração (D26, S8): `avaliador1`–`avaliador3` com senha visível na Entrada e no README; senha em hash scrypt, comparação em tempo constante, erro genérico e limite de tentativas por IP. Contas `e2e1`–`e2e3` reservadas aos testes automáticos.
- "Começar do zero" (R8, D27): na Entrada (quando a conta já tem registros) e na Jornada. Abre um novo ciclo da jornada; nada é alterado nem apagado, e cada pedido fica em `journey_resets`. Teste de integração contra o Postgres prova isso.
- `scripts/reset-demo.sh`: deixa as três contas de avaliação limpas antes de uma rodada, pela própria API.

### Alterado
- Fim do visitante anônimo (D3 substituída por D26); sessões antigas sem conta deixam de valer.
- "Apagar meus dados" (D19) mantém a conta compartilhada e volta ao ciclo 1.
- Limites por IP: login 30/min, escritas 60/min (cada teste E2E faz um login).
- CI roda as migrations antes dos testes (há teste de integração com banco).

## [1.0.3] - 2026-10-22
### Corrigido
- E2E local roda um navegador por vez: com pouca memória livre, 4 navegadores em paralelo derrubavam o Docker e estouravam o tempo. O CI continua em paralelo.

## [1.0.2] - 2026-10-22
### Corrigido
- E2E contra a demo pública: espera de até 15 s por verificação (latência da internet até a VPS); local continua com 5 s. As verificações em si não mudaram.

## [1.0.1] - 2026-10-22
### Adicionado
- `docs/CONFORMIDADE.md`: matriz de cada exigência do desafio (obrigatório, fora do escopo, opcional, extras, divergências e pendências) com a prova de cada item.

### Alterado
- D25 substitui D20: o repositório continua privado e os avaliadores recebem acesso por convite.

## [1.0.0] - 2026-10-22
Entrega do desafio: demo pública, CI, segurança em camadas, backup, exclusão de dados e documentação revisada.
### Corrigido
- Painéis (Apoio, apagar dados) e celebração de fim de plano apareciam presos à área da tela, por baixo do conteúdo: a animação de entrada deixava um `transform` ativo. Agora as camadas são renderizadas no `body` e há E2E que mede a cobertura da janela.
- Respostas 204 (sem corpo) eram tratadas como erro pelo cliente da API.

### Adicionado
- `DECISOES.md` (7 perguntas do desafio), `docs/apresentacao.html`, `docs/ROTEIRO_VIDEO.md`, cada um avaliado por revisor independente com rubrica fixa (`loops/`).
- CI no GitHub (`Verificar`): lint, tipos, testes de unidade, E2E com Postgres em Chrome e Safari, gitleaks no histórico inteiro.
- Deploy na VPS: Dockerfile em 3 estágios (usuário sem root, healthcheck no banco), `deploy/stack.yml`, `scripts/deploy.sh` com portão de CI e backup pré-deploy (D24), site no Nginx atrás do Cloudflare (D22/D23). Demo pública em https://vida.fontesmidias.com.br.
- `GET /api/health/ready` (S7), bloqueado fora da VPS.
- Backup diário do banco na VPS (`deploy/backup/`, 03:15 UTC, retenção de 14 dias, integridade conferida) e restauração provada em banco temporário pelo `check-pronto.sh`; manual de operação em `docs/OPERACAO.md`.
- "Apagar meus dados" na Jornada (D19, LGPD): confirmação explícita, exclusão em transação só do userId da sessão, sessão encerrada; `DELETE /api/me`; E2E nos dois navegadores.
- Limite de requisições na aplicação (S6): sessão demo 20/min por IP, escritas 30/min; 429 com `Retry-After` e mensagem acolhedora.

## [0.2.0] - 2026-10-22
### Adicionado
- Telas reais (Entrada, Hoje, Check-in, Prática guiada, Planos, Dia do plano, Jornada) com a identidade do protótipo: tema claro/escuro (preferência em cookie, sem script inline), ícones próprios de estado (D15), sigla VIDA (D18), botão Apoio com CVV por extenso (D16), práticas guiadas (D17), celebração ao concluir plano, "Voltar" sempre visível (U9), área segura e barra que não cobre conteúdo (U12).
- Tratamento único de erros no cliente (U5): sem conexão, 401 volta para a Entrada, 400 no check-in recarrega o catálogo; esqueleto de carregamento em toda navegação.
- E2E do fluxo principal do PRD em Chrome (Pixel 7) e Safari (iPhone 13), incluindo persistência após recarregar, apoio, prática guiada, isolamento sem sessão e verificação de que a barra inferior não cobre conteúdo.
- `SESSION_COOKIE_SECURE` opcional para testar o build de produção em http://localhost.
- `GET /api/today?tz=` (R2, R3): check-in mais recente do dia no fuso atual; sem check-in → conteúdo neutro.
- `GET /api/checkins?cursor=` (R7): 10 por página, cursor opaco por (created_at, id); cursor inválido → 400.
- `GET /api/plans`, `GET /api/plans/[slug]` (R5, R6): progresso, dias com status e próximo sugerido.
- `POST /api/plans/[slug]/days/[day]/complete` (R4): 201 na primeira vez, 200 nas seguintes, sem duplicar (índice único + `skipDuplicates`).

### Alterado
- Migration `conteudo_guiado_sem_emoji`: remove `moods.emoji` (D15) e adiciona `daily_contents.practice_kind` (D17). API de estados e check-in passam a devolver `family` no lugar de `emoji`.
- Seed com reflexões curtas (U8) e tipo de prática guiada por família; testes cobrem D15, D17 e U8.

### Adicionado
- Sigla VIDA definida (D18: Ver · Inspirar · Desacelerar · Avançar) e onde aparece na interface; CVV por extenso; princípios U12 (respiro e área segura em navegadores móveis) e U13 (verbo em toda ação).
- Revisão de UX após teste do protótipo: princípios U8–U11 (menos texto, voltar sempre visível, práticas guiadas, sem emoji); decisões D15–D17; C1 passa a usar botão "Apoio" discreto no lugar do rodapé fixo; música ambiente no ROADMAP.
- `specs/UI_UX_SPEC.md`: princípios (zero digitação, um toque por check-in, acessibilidade), telas com estados, exibição de horário em viagens e algoritmo único de tratamento de erros no cliente.
- Scaffold Next.js 15 + TypeScript + Tailwind, com Vitest e Playwright (viewport mobile).
- `docker-compose.yml` com Postgres 16 + pgvector local e `.env.example`.
- README com setup, verificações e problemas comuns (porta do Postgres configurável via `POSTGRES_PORT`).
- Esquema Prisma com as 7 tabelas da arquitetura e migration inicial; relações com `Restrict` (sem apagar em cascata, R7).
- Regra C4 (D14): linguagem de gênero neutro em todo o projeto; rótulos dos estados e textos do seed ajustados e cobertos por teste.
- Seed idempotente com 8 estados (D11), conteúdos por família + neutro (R3) e 2 planos de demonstração (C2), com testes de tom (C1).
- Sessão de visitante (D3, S4): `POST /api/session/demo` cria ou reutiliza a sessão; `DELETE /api/session` encerra. Cookie `vida_session` criptografado, `httpOnly`, `sameSite=lax`, `secure` em produção, válido por 30 dias.
- Configuração validada na inicialização (`SESSION_SECRET` ≥ 32 caracteres), sem expor valores no erro.
- Verificação de `Origin` em escrita contra CSRF; erros internos com mensagem amigável e detalhe só no log (S5).
- `GET /api/moods`: catálogo de estados ativos (D6), exige sessão.
- `POST /api/checkins` (R1): instante do servidor; data local pelo fuso IANA informado (inválido → `America/Sao_Paulo`). Corpo validado com `strictObject`: recusa `userId` (S2) e texto livre (D4).
- `GET /api/health` público e mínimo (S7); layout `pt-BR` com aviso de cuidado (C3) e rodapé CVV (C1).

## [0.1.0] - 2026-10-21
### Adicionado
- Specs iniciais: PRD, regras com IDs, arquitetura, segurança, stack justificada, registro de decisões.
- Roadmap de ideias fora do escopo.
- Instruções para agentes de código (CLAUDE.md).
