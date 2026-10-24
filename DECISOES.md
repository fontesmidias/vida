# Decisões técnicas: as 7 perguntas do desafio

Respostas curtas; cada uma aponta onde está no repositório. IDs (R1, S2, D5…) estão em `specs/RULES.md` e `specs/DECISIONS_LOG.md`.

## 1. Arquitetura: por que escolheu essa stack e como front-end, backend e banco se comunicam?
- **Next.js + TypeScript num único projeto, Postgres via Prisma** (D1, D2). Uma linguagem e um deploy para telas e API; Postgres porque os dados são relacionais (pessoa → check-ins; plano → dias → conclusões).
- **Comunicação:** telas React chamam a API REST `/api/*` por um cliente único (`src/ui/api.ts`) → as rotas (`app/api/**`) validam sessão e entrada (Zod) → os services (`src/services/`) aplicam as regras → os repositories (`src/repositories/`) consultam o Postgres. Services não importam nada do Next, então dá para separar o back-end depois sem reescrever.
- **Em produção:** Cloudflare → Nginx → container do app → Postgres numa rede interna, sem porta exposta (`deploy/stack.yml`).

## 2. Modelagem: quais entidades/tabelas criou? Como representaria diferentes usuários, check-ins e evolução nos planos?
Oito tabelas (`prisma/schema.prisma`):

| Tabela | Papel |
|---|---|
| `users` | Conta (usuário, senha em hash) e ciclo atual da jornada |
| `moods` | Estados emocionais em 4 famílias; novo estado = nova linha, sem migration (D6) |
| `checkins` | Pessoa + estado + instante do servidor + fuso do aparelho + data local (R1) |
| `daily_contents` | Reflexão e prática por família de estado (R3) |
| `plans`, `plan_days` | Planos e seus dias |
| `plan_day_completions` | Dia concluído por uma pessoa; único por pessoa + dia + ciclo (R4) |
| `journey_resets` | Registro de cada "Começar do zero" (R8) |

- **Usuários diferentes:** todo dado pessoal tem `user_id`, e o `userId` vem só da sessão no servidor, nunca do corpo ou da URL (S2). Um E2E prova que uma conta não vê os dados de outra.
- **Check-ins:** só acrescentados, nunca editados (R7); vários por dia; o "dia" é calculado no fuso do aparelho (R1, R2).
- **Evolução nos planos:** o progresso é contado a partir das conclusões, não guardado (R6); dias em qualquer ordem, com o primeiro em aberto sugerido (R5); concluir de novo não duplica (índice único, R4).

## 3. Segurança: o que mudaria para armazenar dados emocionais de usuários reais com privacidade e conformidade à LGPD?
Dado emocional é dado sensível de saúde (LGPD, art. 11). **Já existe no protótipo:** check-in sem texto livre (D4); isolamento por `userId` da sessão (S2); cookie criptografado e `httpOnly` (S4); senha em hash scrypt e limite de tentativas (S8, S6); HTTPS até a origem, Nginx aceitando só o Cloudflare (D22, D23); "Apagar meus dados" (D19).

**Para pessoas reais, mudaria:**
1. **Contas individuais:** cadastro com e-mail verificado ou link mágico, 2FA opcional, sessões revogáveis. Cada conta só acessa os próprios registros (o filtro S2 já está em todas as consultas); no banco, Row Level Security como segunda barreira.
2. **Consentimento** específico para dado de saúde, com finalidade, data e versão do texto, revogável.
3. **Criptografia em repouso** (volume e backups) e backup cifrado fora da VPS.
4. **Direitos do titular:** exportação dos dados além da exclusão; prazo de retenção com expurgo automático.
5. **Acesso mínimo:** usuário do banco só com as permissões do app, log de acesso a dados pessoais, encarregado (DPO) e relatório de impacto (RIPD).

## 4. Operação: como faria deploy, observaria erros e recuperaria um serviço que parou?
- **Deploy:** `bash scripts/deploy.sh` recusa commit sem CI verde, faz backup do banco, constrói a imagem na VPS e atualiza a stack; o container aplica as migrations pendentes ao subir. Voltar versão = trocar `IMAGE_TAG` na stack.
- **Observar:** erros vão para o log do container com a rota (`docker logs vida-app-1`); a pessoa vê só mensagem amigável (S5). `/api/health` é público; `/api/health/ready` (testa o banco) é só interno (S7). Próximo passo: Sentry e alerta de uptime (`ROADMAP.md`).
- **Recuperar:** `restart: unless-stopped` reinicia o processo; dados no volume `vida_pgdata`; backup diário com retenção de 14 dias e restauração já testada em banco temporário (`docs/OPERACAO.md`).

## 5. Evolução: quais seriam suas 3 prioridades para transformar este teste em uma primeira versão utilizável por clientes?
1. **Conta pessoal e LGPD:** os itens 1 a 4 da pergunta 3. Sem isso não há cliente real.
2. **Conteúdo gerenciável:** painel para a equipe criar estados, reflexões e planos com revisão de tom (C1); o modelo já aceita isso sem migration (D6).
3. **Operação medida:** Sentry, uptime, métricas anônimas de uso e backup fora da VPS, para saber se as práticas ajudam e reagir a falhas.

## 6. Integrações: como adicionaria IA com segurança e, futuramente, acesso por assinatura/Kiwify (webhooks e controle de acesso)?
**IA:**
- Chamada só no servidor, num service próprio; a chave nunca vai ao navegador (S3).
- Envia o mínimo (estado e família, nunca nome ou histórico), com opt-in e sem uso para treino.
- Regras C1 no prompt, filtros de entrada e saída, e sinais de crise levam ao Apoio/CVV em vez de resposta automática.
- Resposta marcada como gerada por IA e "não é aconselhamento profissional"; limite de uso por pessoa (S6).

**Kiwify:**
- `POST /api/webhooks/kiwify` valida o token de cada evento, é idempotente (id do evento com índice único, como no R4) e processa em fila.
- Tabela `subscriptions` (pessoa, plano, status, validade, id externo) atualizada por compra, renovação, cancelamento e reembolso.
- **Controle de acesso no servidor:** um service `entitlements` decide o que cada pessoa pode abrir, aplicado nas rotas da API; a tela só esconde. Conciliação diária com a API da Kiwify.

## 7. Decisões: o que você deliberadamente deixou de fora e por quê? Onde usou IA no desenvolvimento?
**Fora, de propósito** (detalhes em `ROADMAP.md`):
- Cadastro e contas individuais: o desafio aceita um usuário demo; há uma conta de avaliação com senha (D29), e a pergunta 3 diz como seria com pessoas reais.
- Texto livre no check-in: dado sensível sem necessidade (D4).
- IA, Kiwify, notificações, painel admin, app nativo: fora do escopo obrigatório.
- Sequências de dias (streaks) e dias bloqueados: geram sensação de perda (D7, D8).

**Uso de IA:** Claude Code (Claude Opus), no VS Code, em specs, código, testes, infraestrutura e documentação. Eu defini escopo e regras de produto, testei no celular, pedi as mudanças de experiência e aprovei cada decisão e cada ação na infraestrutura. A qualidade é garantida por testes de unidade, integração e E2E em dois navegadores, CI com gitleaks e revisão dos documentos.
