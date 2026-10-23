# Decisões técnicas: as 7 perguntas do desafio

Respostas objetivas, cada uma apontando onde a decisão está no repositório. Regras citadas por ID (R1–R7, S1–S7, C1–C4, U1–U13) estão em `specs/RULES.md` e `specs/UI_UX_SPEC.md`; decisões (D1–D24) em `specs/DECISIONS_LOG.md`. Demo: https://vida.fontesmidias.com.br

## 1. Arquitetura: por que escolheu essa stack e como front-end, backend e banco se comunicam?
**Next.js (App Router) + TypeScript monolítico em camadas, Postgres 16 via Prisma** (D1, D2; justificativas e alternativas em `specs/TECH_STACK.md`). Uma linguagem e um deploy para tela e API, sem a infraestrutura dobrada de front e back separados; Postgres porque os dados são relacionais (pessoa → check-ins, planos → dias → conclusões).

Comunicação:
1. **Telas** (`app/(app)/*`, componentes React no navegador) chamam a **API REST** em `/api/*` com `fetch`, por um cliente único (`src/ui/api.ts`) que trata carregando, erro, sem conexão e sessão expirada da mesma forma (U5).
2. **Rotas** (`app/api/**/route.ts`) cuidam só de HTTP: sessão (S2), validação Zod (S5), limite de requisições (S6), Origin em escrita, e traduzem erros em status.
3. **Services** (`src/services/`) têm as regras R1–R7 e não importam nada de `next/*`, então poderiam virar um back-end separado sem reescrita.
4. **Repositories** (`src/repositories/`) falam com o Postgres via Prisma, sempre recebendo o `userId` explícito.

Em produção: Cloudflare → Nginx da VPS → container do app (`127.0.0.1:8097`) → Postgres numa rede interna da stack, sem porta exposta (`deploy/stack.yml`, `deploy/nginx/vida.conf`).

## 2. Modelagem: quais entidades/tabelas criou? Como representaria diferentes usuários, check-ins e evolução nos planos?
Oito tabelas (`prisma/schema.prisma`, migrations em `prisma/migrations/`):

| Tabela | Papel |
|---|---|
| `users` | Contas de demonstração (`username`, senha em hash scrypt, D26/S8) e o ciclo atual da jornada (`current_cycle`, R8); toda consulta de dados pessoais filtra por este id (S2) |
| `moods` | Catálogo de estados (8, em 4 famílias, D11). Novo estado = nova linha, sem migration (D6) |
| `checkins` | Pessoa + estado + instante do servidor (`created_at`, UTC) + fuso IANA do dispositivo + `local_date` calculada (R1). Índices `(user_id, created_at desc)` e `(user_id, local_date)` |
| `daily_contents` | Reflexão e prática por família, mais a neutra (R3), com o tipo de prática guiada (D17) |
| `plans` / `plan_days` | Planos de demonstração e seus dias; `(plan_id, day_number)` único |
| `plan_day_completions` | Conclusão de um dia por uma pessoa, no ciclo; `(user_id, plan_day_id, cycle)` único |
| `journey_resets` | Registro de cada "Começar do zero": conta, ciclo anterior, instante (R8, D27) |

- **Usuários diferentes:** três contas de demonstração para avaliação (`avaliador1`–`avaliador3`) e três reservadas aos testes automáticos (D26). O login põe na sessão o id da conta; o `userId` vem só do cookie criptografado (S4), nunca do corpo ou da URL. O E2E "S2: uma pessoa não vê os dados de outra" prova com duas contas reais.
- **Ciclos da jornada:** cada check-in e conclusão guarda o ciclo em que foi feito. "Começar do zero" só avança `users.current_cycle` e grava o pedido em `journey_resets`; as telas mostram o ciclo atual e nada é alterado nem apagado (R8, D27; provado contra o Postgres em `tests/integration/journey.test.ts`).
- **Check-ins:** append-only (R7), vários por dia; "Hoje" usa o mais recente cuja `local_date` é hoje no fuso **atual** do dispositivo (R2), o que trata viagens: o mesmo instante é 21/10 em São Paulo e 22/10 em Tóquio (`tests/unit/today.test.ts`).
- **Evolução nos planos:** progresso é calculado a partir das conclusões, nunca armazenado (R6), em qualquer ordem, com o primeiro dia aberto como "próximo sugerido" (R5). Concluir de novo não duplica: o índice único somado a `createMany(skipDuplicates)` garante a idempotência mesmo com toques simultâneos (R4).
- **Relações com `Restrict`**: nada é apagado em cascata. A única exclusão é a pedida pela própria pessoa (D19, pergunta 3); recomeçar não apaga (R8).

## 3. Segurança: o que mudaria para armazenar dados emocionais de usuários reais com privacidade e conformidade à LGPD?
Dado emocional é **dado pessoal sensível** (saúde, art. 11 da LGPD). O protótipo já aplica (`specs/SECURITY.md`):
- **Minimização:** sem texto livre no check-in (D4), sem localização (o fuso vem do relógio do dispositivo, R1).
- **Isolamento e acesso:** `userId` só da sessão (S2); cookie `httpOnly`, `sameSite=lax`, `secure`, criptografado (S4); senhas em hash scrypt com comparação em tempo constante, erro de login que não revela se a conta existe e tentativas limitadas por IP (S8, S6).
- **Defesa em camadas (S1):** Cloudflare na frente; o Nginx só aceita IPs do Cloudflare (acesso direto ao IP da VPS → 403); HTTPS também entre Cloudflare e origem (D23); cabeçalhos CSP, HSTS e X-Frame-Options; validação Zod e Origin em escrita; rate limit (S6); banco sem porta exposta; container sem root; gitleaks no CI.
- **Direito de exclusão:** "Apagar meus dados" (D19) remove os check-ins, conclusões e recomeços da conta numa transação; como as contas de demonstração são compartilhadas, a conta em si fica, sem dados (D27). "Começar do zero" é outra coisa: recomeça sem apagar (R8).

Com pessoas reais usando o app, mudaria:
1. **Conta pessoal** com cadastro (e-mail com link mágico ou senha forte escolhida pela pessoa + 2FA) no lugar das contas compartilhadas de demonstração, cuja senha é pública de propósito (D26; `ROADMAP.md`).
2. **Consentimento específico e destacado** para dado de saúde, com finalidade clara, registrado com data e versão do texto, revogável.
3. **Criptografia em repouso** (disco/volume e backups cifrados) e cópia de backup fora da VPS (ROADMAP).
4. **Exportação dos dados** (portabilidade) ao lado da exclusão; política de retenção com expurgo automático.
5. **Usuário do banco só com as permissões do app**, separado do dono das migrations (hoje pendente, ver `specs/SECURITY.md`); registro de acesso a dados pessoais; DPO e relatório de impacto (RIPD).

## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?
Detalhes em `docs/OPERACAO.md`.
- **Deploy:** `bash scripts/deploy.sh` recusa se o CI do commit não estiver verde, faz backup do banco, constrói a imagem na VPS a partir do `git archive` do commit (D24) e atualiza a stack no Portainer. Na subida, o container aplica só as migrations pendentes e o seed idempotente. Voltar versão = trocar `IMAGE_TAG` na stack (as imagens anteriores ficam na VPS).
- **CI** (`.github/workflows/ci.yml`): lint, tipos, testes de unidade, E2E em Chromium e WebKit (perfis Pixel 7 e iPhone 13) com Postgres, gitleaks no histórico inteiro.
- **Observar erros:** erros internos vão para o log do container com o contexto da rota (`docker logs vida-app-1`), com rotação 10 MB × 3; a pessoa vê só mensagem amigável (S5). `/api/health` público e mínimo; `/api/health/ready` (consulta o banco) só interno (S7). `scripts/check-pronto.sh` testa a demo pública de ponta a ponta. Próximo passo: Sentry e alerta de uptime (ROADMAP).
- **Recuperar:** `restart: unless-stopped` reinicia o container se o processo cair; o healthcheck marca `unhealthy` (visível em `docker ps` e no Portainer), mas no Docker standalone não reinicia sozinho, então nesse caso é `docker restart vida-app-1` (reinício automático por healthcheck está no ROADMAP); o app espera o banco ficar saudável; os dados ficam no volume `vida_pgdata`. Backup diário com integridade conferida e retenção de 14 dias, e a **restauração é provada** a cada verificação de entrega: o backup mais recente é restaurado num banco temporário e conferido (`check-pronto.sh`, item 8). Procedimento de restauração passo a passo no `docs/OPERACAO.md`.

## 5. Evolução: quais seriam suas 3 prioridades para transformar este teste em uma primeira versão utilizável por clientes?
1. **Conta e consentimento:** conta pessoal com cadastro no lugar das contas compartilhadas, consentimento LGPD para dado de saúde, exportação dos dados e o restante da pergunta 3. Sem isso, não é possível ter clientes de verdade.
2. **Conteúdo e administração:** um painel para a equipe criar estados, reflexões, práticas e planos (hoje vêm do seed), com revisão de tom (C1). O modelo já suporta isso sem migration (D6).
3. **Operação confiável e medida:** observabilidade (Sentry, uptime, métricas de uso agregadas e anônimas), backup cifrado fora da VPS e lembretes opcionais de check-in. Saber se as práticas guiadas ajudam é o que orienta o produto.

## 6. Integrações: como adicionaria IA com segurança e, futuramente, acesso por assinatura/Kiwify (webhooks e controle de acesso)?
**IA** (ex.: reflexão personalizada ou conversa de apoio):
- Atrás de um service próprio no servidor; a chave da API nunca vai ao navegador (S3). A imagem do Postgres já traz a extensão pgvector (disponível, ainda não habilitada por migration) para RAG sobre o conteúdo curado.
- **Minimização:** enviar só o necessário (estado e família, nunca nome ou histórico completo), sem dados para treino do provedor, com opt-in explícito.
- **Guardrails:** prompt de sistema com as regras C1 (sem diagnóstico, terapia ou cura) e C4; filtros de entrada e saída; detecção de sinais de crise que mostram o Apoio/CVV em vez de responder; limite de uso por pessoa (S6).
- **Transparência:** marcar na tela o que é gerado por IA e que não é aconselhamento profissional; registrar e avaliar respostas com rubrica fixa antes de liberar.

**Assinatura via Kiwify:**
- Endpoint `POST /api/webhooks/kiwify` que **valida a assinatura/token** de cada evento antes de qualquer efeito, é **idempotente** (id do evento com índice único, o mesmo padrão do R4) e responde rápido, processando em fila.
- Tabela `subscriptions` (pessoa, plano, status, validade, id externo) atualizada pelos eventos de compra, renovação, cancelamento e reembolso.
- **Controle de acesso no servidor:** um service `entitlements` decide o que a pessoa pode acessar (ex.: planos premium), aplicado nas rotas da API; a interface só esconde, nunca é a barreira. Conciliação diária com a API da Kiwify para não depender só de webhooks.

## 7. Decisões: o que você deliberadamente deixou de fora e por quê? Onde usou IA no desenvolvimento?
**Deixado de fora** (regra P1: obrigatório primeiro; cada item tem o motivo registrado na fonte indicada):
- Cadastro e conta pessoal: o desafio aceita usuário demo; usamos contas de demonstração com senha (D26; `ROADMAP.md`). A proteção para dados reais está na pergunta 3.
- Texto livre no check-in (D4): dado sensível sem necessidade.
- Chat com IA, Kiwify, notificações, painel admin, app nativo: fora do escopo obrigatório do desafio (`ROADMAP.md`).
- Sequências de dias (streaks) e dias bloqueados em ordem: geram sensação de perda e atrito (decisões D7 e D8, regras R5 e R6; o modo em ordem fica no `ROADMAP.md` como opção futura por plano).
- Música ambiente nas práticas: ficou para depois, sempre desligada por padrão (`ROADMAP.md`).
- Rate limit também no Nginx: depende de mudar configuração global da VPS compartilhada; hoje a borda é o Cloudflare e o limite está na aplicação (`specs/SECURITY.md`, `ROADMAP.md`).

**Uso de IA:** Claude Code (modelo Claude Opus), no VS Code. Ajudou a redigir as specs a partir das decisões da pessoa responsável pelo projeto, a escrever código e testes (teste antes, citando a regra), a montar um protótipo visual navegável para validar a experiência antes do código, a configurar a infraestrutura (Docker, Nginx, DNS e regra de SSL pela API do Cloudflare) e a escrever a documentação. A pessoa responsável definiu escopo e regras de produto (linguagem neutra C4, sigla VIDA D18, apoio discreto ao CVV D16, ícones próprios D15, práticas guiadas D17), testou o protótipo e pediu as mudanças de experiência, e aprovou cada decisão e cada ação na infraestrutura. O que garante a qualidade não depende da IA: testes de unidade e E2E em dois navegadores, CI com gitleaks, o placar `check-pronto.sh` e um revisor independente com rubrica fixa para estes documentos (`loops/`).
