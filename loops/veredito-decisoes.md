# Veredito: DECISOES.md

Data: 2026-10-23
Revisor independente, contexto limpo. Rubrica: `loops/rubrica-entrega.md`, seção A. Perguntas conferidas no PDF do desafio (páginas 3 a 5: escopo, "Transparência sobre IA", "Perguntas técnicas obrigatórias").

## A1. Completo: APROVADO
Os títulos `## 1.` a `## 7.` reproduzem o texto das 7 perguntas do PDF, por exemplo `## 2. Modelagem: quais entidades/tabelas criou? Como representaria diferentes usuários, check-ins e evolução nos planos?` e `## 7. Decisões: o que você deliberadamente deixou de fora e por quê? Onde usou IA no desenvolvimento?`. Nenhuma pergunta omitida.

## A2. Responde o que foi perguntado: APROVADO
- 1: stack (D1, D2) e comunicação tela, API, services, repositories e banco, mais o caminho em produção.
- 2: tabela com as 8 entidades; usuários diferentes (`user_id`, S2), check-ins (R1, R2, R7) e evolução nos planos (R4, R5, R6), cada um em tópico próprio.
- 3: "Já existe no protótipo" e "Para pessoas reais, mudaria" com 5 itens (conta, consentimento, criptografia, direitos do titular, acesso mínimo).
- 4: três tópicos: **Deploy**, **Observar** e **Recuperar**.
- 5: exatamente 3 prioridades numeradas.
- 6: **IA** (servidor, minimização, guardrails C1, transparência, limite) e **Kiwify** (webhook idempotente, `subscriptions`) e **controle de acesso** (`entitlements` no servidor, conciliação).
- 7: "Fora, de propósito" com motivos e "Uso de IA".

## A3. Ancorado no projeto: APROVADO
Cada pergunta cita itens verificáveis: `src/ui/api.ts`, `app/api/**`, `src/services/`, `src/repositories/`, `deploy/stack.yml`, `prisma/schema.prisma`, `scripts/deploy.sh`, `docs/OPERACAO.md`, `ROADMAP.md`, `docker logs vida-app-1`, IDs R1 a R8, S2 a S8, D1 a D29. Nada genérico: até a pergunta 6, que é futura, se ancora em S3, S6, R4, C1 e D6.

## A4. Objetivo: APROVADO
Tópicos curtos e uma tabela; sem marketing nem enchimento. A abertura diz "Respostas curtas; cada uma aponta onde está no repositório". O tamanho acompanha o número de partes de cada pergunta.

## A5. Honesto: APROVADO
Afirmações conferidas no repositório:
- 8 tabelas com os nomes citados (`@@map` em `prisma/schema.prisma`); único `(user_id, plan_day_id, cycle)` (R4); `journey_resets`; `onDelete: Restrict`.
- Regras: R1 a R8, S1 a S8 e C1 a C4 existem em `specs/RULES.md`, com o conteúdo descrito (S4 cookie `httpOnly`, S5 erros amigáveis, S6 limites, S7 health, S8 scrypt e `timingSafeEqual` em `src/lib/password.ts`).
- Services e repositories sem import de `next/*` (grep vazio).
- `scripts/deploy.sh`: recusa sem CI verde (`Deploy recusado.`), backup pré-deploy, build na VPS, `IMAGE_TAG` na stack; `docker-entrypoint.sh` roda `prisma migrate deploy`; reverter por `IMAGE_TAG` consta em `docs/OPERACAO.md`.
- `deploy/stack.yml`: banco sem `ports`, `restart: unless-stopped`, volume `vida_pgdata`, app só em `127.0.0.1:8097`.
- `docs/OPERACAO.md`: retenção de 14 dias, restauração testada em banco temporário (`check-pronto.sh` item 8), `/api/health/ready` interno, logs com a rota (S5).
- E2E "S2: uma pessoa não vê os dados de outra" em `tests/e2e/fluxo-principal.spec.ts`; `DeleteData.tsx` ("Apagar meus dados"); gitleaks no CI; Playwright com Pixel 7 e iPhone 13.
- Plano futuro está marcado como tal ("Para pessoas reais, mudaria", "Próximo passo: Sentry e alerta de uptime", pergunta 6 toda em tom prospectivo) e consta em `ROADMAP.md` (conta pessoal e 2FA, consentimento, criptografia, backup externo, Sentry, IA/RAG, Kiwify). A conta única de avaliação com senha (D29) corresponde ao registrado.
Nenhuma afirmação sem respaldo encontrada.

## A6. Tom (C1, C4): APROVADO
Sem promessa de diagnóstico, terapia ou cura; a pergunta 6 reforça C1 e "não é aconselhamento profissional". Linguagem neutra ("a pessoa", "pessoas reais", "pessoa responsável"). Os usos de "usuário" são termos técnicos ("usuário do banco") ou citação do PDF.

## A7. Transparência sobre IA: APROVADO
"Claude Code (Claude Opus), no VS Code, em specs, código, testes, infraestrutura e documentação." Validação pessoal: "Eu defini escopo e regras de produto, testei no celular, pedi as mudanças de experiência e aprovei cada decisão e cada ação na infraestrutura", mais garantias independentes (testes, E2E em dois navegadores, CI com gitleaks, revisão dos documentos). Coerente com a seção de IA do `README.md`.

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
