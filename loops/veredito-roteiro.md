# Veredito — docs/ROTEIRO_VIDEO.md

Data: 2026-10-23
Rubrica: `loops/rubrica-entrega.md`, seção C (congelada). Avaliação feita do zero, sem consultar vereditos anteriores.

## C1. Cabe em até 5 minutos, com marcações de tempo — APROVADO
- Tabela com 8 blocos contíguos e sem sobreposição: 0:00–0:25, 0:25–1:15, 1:15–1:50, 1:50–2:30, 2:30–2:45, 2:45–4:15, 4:15–4:45, 4:45–5:00. Total = 5:00, dentro do limite do PDF ("vídeo de até 5 minutos").
- Título do documento: "Roteiro do vídeo (até 5 minutos)".

## C2. Fluxo principal completo e uma decisão técnica com profundidade — APROVADO
Os 6 passos do "Fluxo que precisa funcionar de ponta a ponta" (PDF, seção 03) aparecem em ordem:
1. Entrar como demo: "Escolha **Avaliação 1**, digite a senha `vida2026` → **Entrar**" (confere com `prisma/seed-data.ts:111` `DEMO_PASSWORD = "vida2026"`, `:114` displayName "Avaliação 1"; botão "Entrar" em `src/ui/DemoLogin.tsx:118`).
2. Check-in: "**Fazer check-in** → **Com ansiedade**" (`app/(app)/hoje/page.tsx:56`; label em `prisma/seed-data.ts:13`; um toque salva e redireciona, `app/(app)/check-in/page.tsx:26,65`).
3. Hoje com prática coerente: "para ansiedade, uma reflexão curta e uma respiração 4-6" (`prisma/seed-data.ts:37` "Respiração 4-6"; `src/ui/practices.tsx:25-26` IN_MS 4000 / OUT_MS 6000; botões "Começar" e "Encerrar" existem).
4. Plano, primeiro dia: "**Planos** → **Respirar com calma** → **Dia 1** → **Concluir dia**" (`prisma/seed-data.ts:83`; `app/(app)/planos/[slug]/dia/[n]/page.tsx:73`).
5. Jornada: "Na Jornada estão o check-in e a conclusão" (`app/(app)/jornada/page.tsx`).
6. Atualizar: bloco "Persistência — Recarregar a página na Jornada".

Uma única decisão técnica, com profundidade:
- Problema: "hoje" depende do fuso; o servidor usa UTC.
- O porquê / o que fez: instante do servidor, fuso IANA do dispositivo via `Intl`, validado, fallback São Paulo — confere com `specs/RULES.md` R1 e `specs/DECISIONS_LOG.md` D5 ("Relógio do cliente não é confiável") e com `src/services/checkins.ts` (`resolveTimezone`, `localDateFor`, `DEFAULT_TIMEZONE = "America/Sao_Paulo"`).
- Exemplo verificável: "02:30 UTC de 22/10 é dia 21 em São Paulo e dia 22 em Tóquio" = `tests/unit/today.test.ts:24` (`2026-10-22T02:30:00Z`) e `:35` ("em Tóquio já é 22/10 (viagem)").
- Alternativa descartada explícita: "usar a hora do próprio celular… pode estar errada ou ser ajustada à mão" e geolocalização (dado sensível sem necessidade).
- Consequência: Jornada mostra "· horário de Lisboa" — confere com `src/ui/time-format.ts:45`.

## C3. Diz o que mostrar na tela em cada trecho — APROVADO
- Todas as 8 linhas têm a coluna "Mostrar na tela" preenchida com telas, botões ou arquivos concretos.
- Itens citados existem: `src/services/checkins.ts`, `tests/unit/today.test.ts`, `scripts/check-pronto.sh` (cobre E2E local e público em Chrome/WebKit, rate limit e backup restaurado em banco temporário, linhas 67-113); "Começar do zero" e "Apagar meus dados" estão na Jornada (`app/(app)/jornada/page.tsx:113,117`); botão "Apoio" e CVV em `src/ui/AppFrame.tsx:88,104`.

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
