# Veredito — docs/ROTEIRO_VIDEO.md

Data: 2026-10-23
Rubrica: `loops/rubrica-entrega.md`, seção C (congelada). Avaliação feita do zero, por revisor independente, contra o PDF do desafio (págs. 3 e 5) e o repositório.

## C1. Cabe em até 5 minutos, com marcações de tempo — APROVADO
- A tabela tem 8 blocos contíguos, sem sobreposição: 0:00–0:20, 0:20–0:50, 0:50–1:30, 1:30–2:05, 2:05–2:30, 2:30–4:10, 4:10–4:45, 4:45–5:00. O total é 5:00, dentro do limite do PDF (pág. 5, item 5: "vídeo de até 5 minutos").
- O título já declara "Roteiro do vídeo (até 5 minutos)".
- O texto falado cabe nos blocos, em ritmo calmo. O bloco da decisão tem cerca de 170 palavras para 100 s. O fechamento (15 s) é o mais apertado, mas viável.

## C2. Fluxo principal completo e uma decisão técnica com profundidade — APROVADO
Os 6 passos do "Fluxo que precisa funcionar de ponta a ponta" (PDF, pág. 3) aparecem em ordem, e cada elemento citado existe no código:
1. Entrar: "Digitar a senha → **Entrar**". O campo de senha mascarado e o botão "Entrar" estão em `src/ui/DemoLogin.tsx` (`type="password"`, "Entrar"). A conta única de avaliação é `demoAccount` em `prisma/seed-data.ts:112`.
2. Check-in: "**Fazer check-in** → **Com ansiedade**". "Fazer check-in" está em `app/(app)/hoje/page.tsx:56`; o rótulo "Com ansiedade" está em `prisma/seed-data.ts:13`. O E2E clica nos dois.
3. Hoje coerente: a reflexão "Nem tudo precisa ser resolvido agora." e a "Respiração 4-6" são da família "agitado" (`seed-data.ts:34-37`). O selo "Demonstração" é o `DemoTag` na tela Hoje (`src/ui/feedback.tsx:92`). O botão "Começar" está em `hoje/page.tsx:82`, e "Encerrar" em `src/ui/practices.tsx:57`. A respiração é 4 s de entrada e 6 s de saída (`IN_MS`/`OUT_MS`), então "2 ciclos" é uma escolha de quem grava, e "Encerrar" fica disponível durante a prática.
4. Plano: "Próximo passo: **Ver planos**" (`NextStep`, `feedback.tsx:80`, e `hoje/page.tsx:87`) → "Respirar com calma" (`seed-data.ts:83`) → "Dia 1" → "Concluir dia" (`planos/[slug]/dia/[n]/page.tsx:73`). A afirmação "qualquer ordem" e "não duplica" tem teste em `tests/unit/plans.test.ts:48,55`.
5. Jornada: "Ver minha jornada" (`dia/[n]/page.tsx:77,100`). O "1 de 5" é gerado em `app/(app)/jornada/page.tsx:80` e conferido no E2E.
6. Recarregar: o E2E faz `page.reload()` e confere "Com ansiedade" e "1 de 5" (`tests/e2e/fluxo-principal.spec.ts`, passo 6).

A decisão técnica é uma só ("de quem é o dia?") e tem profundidade:
- Problema: o servidor trabalha em UTC.
- Solução: instante do servidor, fuso IANA do aparelho via `Intl`, validado, com São Paulo como padrão. Em `src/services/checkins.ts` estão `resolveTimezone` (linha 8) e `localDateFor` (linha 19).
- Exemplo verificável: "02:30 UTC de 22/10 é dia 21 em São Paulo e dia 22 em Tóquio" é igual a `tests/unit/today.test.ts:24` (`2026-10-22T02:30:00Z`) e `:35` ("em Tóquio já é 22/10").
- Alternativa descartada e explicada: usar a hora do celular (pode estar errada ou ser alterada) e usar geolocalização (dado sensível sem necessidade).
- Por que importa: histórico e conteúdo coerentes com a vida da pessoa.

## C3. Diz o que mostrar na tela em cada trecho — APROVADO
- As 8 linhas têm a coluna "Mostrar na tela" preenchida com telas, botões ou arquivos concretos, e todos existem.
- Fechamento: "Começar do zero" e "Apagar meus dados" estão na Jornada (`StartOverButton` e `DeleteDataButton`, `jornada/page.tsx:121,125`).
- `scripts/reset-demo.sh` existe e faz o que o roteiro diz: entra na conta `avaliador` e aciona "Começar do zero" pela API, lendo a senha do `.env.deploy`.
- `tests/e2e/fluxo-principal.spec.ts` existe e cobre o fluxo. O teste "S2: uma pessoa não vê os dados de outra" sustenta a afirmação sobre isolamento. Os projetos são Pixel 7 (Chrome) e iPhone 13 (Safari/WebKit), em `playwright.config.ts`.

## Observações já corrigidas
- Linha 13 agora diz "a cada push na main e em cada PR", o que confere com `.github/workflows/ci.yml` (push na `main`, pull requests e disparo manual).
- Linha 21 agora diz "O fuso, o aparelho corrige sozinho;", e a frase ficou completa.

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
