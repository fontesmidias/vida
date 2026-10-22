# Veredito: docs/ROTEIRO_VIDEO.md

Data: 2026-10-22
Rubrica: `loops/rubrica-entrega.md`, seção C (congelada em 2026-10-22).

## C1. Cabe em até 5 minutos, com marcações de tempo: APROVADO
- A tabela tem 8 blocos contínuos: 0:00–0:25, 0:25–1:15, 1:15–1:50, 1:50–2:30, 2:30–2:45, 2:45–4:15, 4:15–4:45 e 4:45–5:00. Não há buracos nem sobreposições, e o total fecha em exatamente 5:00.
- O bloco da decisão técnica repete a marcação ("Texto do bloco de decisão (2:45–4:15)"), em linha com a tabela.

## C2. Mostra o fluxo principal completo e explica uma decisão técnica com profundidade: APROVADO
Os 6 passos do PDF ("03 Fluxo que precisa funcionar de ponta a ponta") aparecem no roteiro:
1. Entrar como demo: "Toque em **Entrar como demonstração**" (rótulo em `src/ui/EnterButton.tsx`).
2. Fazer o check-in: "**Fazer check-in** → **Com ansiedade**" (`app/(app)/hoje/page.tsx`; "Com ansiedade" é o rótulo do slug `ansioso` em `prisma/seed-data.ts:13`).
3. Hoje com conteúdo coerente: "tela **Hoje** … para ansiedade, uma reflexão curta e uma respiração 4-6" (a respiração usa `IN_MS = 4000` e `OUT_MS = 6000` em `src/ui/practices.tsx`; o botão "Começar" está em `app/(app)/hoje/page.tsx:80` e "Encerrar" em `src/ui/practices.tsx`).
4. Plano e primeiro dia: "**Planos** → **Respirar com calma** → **Dia 1** → **Concluir dia**" (o plano está em `prisma/seed-data.ts:83`, o rótulo "Dia N" em `app/(app)/planos/[slug]/page.tsx:43` e "Concluir dia" em `app/(app)/planos/[slug]/dia/[n]/page.tsx`).
5. Minha Jornada: "→ **Jornada** … Na Jornada estão o check-in e a conclusão" (`app/(app)/jornada/page.tsx`).
6. Recarregar a página: "Recarregar a página na Jornada … está no banco, não no navegador."

Há **uma** decisão técnica, explicada com profundidade: de quem é o "dia" (R1, D5).
- **O porquê:** "o **instante** vem sempre do relógio do servidor, e o **fuso** vem do dispositivo, pelo `Intl` … O servidor valida o fuso (só nomes IANA; inválido cai em São Paulo)". Bate com `specs/RULES.md` R1 e com a linha D5 de `specs/DECISIONS_LOG.md`.
- **A alternativa descartada:** "usar a hora do próprio celular. Ela pode estar errada ou ser ajustada à mão … pedir geolocalização seria coletar um dado sensível sem necessidade". Isso corresponde ao "Por quê" de R1.
- **Confere com o código:** `src/services/checkins.ts` tem `resolveTimezone` (regex IANA, com volta para `America/Sao_Paulo`) e `localDateFor`. Em `tests/unit/today.test.ts:24`, `new Date("2026-10-22T02:30:00Z") // 21/10 em São Paulo, 22/10 em Tóquio`, e em `:35`, o caso "em Tóquio já é 22/10 (viagem)". Isso bate com a frase "02:30 UTC de 22/10, é dia 21 em São Paulo e dia 22 em Tóquio".
- **Hora com o fuso de cada check-in:** o formato "horário de …" existe em `src/ui/time-format.ts`.

## C3. Diz o que mostrar na tela em cada trecho: APROVADO
- Cada linha da tabela preenche a coluna "Mostrar na tela": a entrada do site, a sequência de botões, o círculo de respiração, a recarga da página, os arquivos `src/services/checkins.ts` e `tests/unit/today.test.ts`, o terminal com `bash scripts/check-pronto.sh` (o arquivo existe) e o CI, e o botão **Apagar meus dados** (`src/ui/DeleteData.tsx`).
- Os rótulos citados existem no código. "Apoio" e o link para o CVV estão em `src/ui/AppFrame.tsx`.

## Correções necessárias
Nenhuma.

Observação, que não reprova: o PDF chama a tela de "Minha Jornada", e o roteiro diz "Jornada", que é o rótulo da navegação (`src/ui/navigation.ts`). O sentido é o mesmo.

VEREDITO: APROVADO
