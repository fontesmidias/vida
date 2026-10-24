# Veredito: docs/apresentacao.html

Data: 2026-10-23
Revisor: subagente independente, contexto limpo, rubrica `loops/rubrica-entrega.md` seção B (e "Como o revisor trabalha"). Fontes: PDF do desafio (6 passos do fluxo, 7 perguntas), repositório na branch `feat/fluxo-guiado`, com D29 e D30 em vigor.

## B1. Para o avaliador: APROVADO
- Abre com o botão "Abrir a demo" (`https://vida.fontesmidias.com.br`), com a nota "conta de avaliação · senha enviada com as instruções de entrega" (linhas 115-116), coerente com D29 (senha fora da tela e do código).
- "O fluxo principal em 6 passos" (linhas 120-132) cobre os 6 passos do PDF: entrar, check-in "Com ansiedade", Hoje, plano e "Concluir dia", Jornada, recarregar.

## B2. Cobre o essencial: APROVADO
- Sigla VIDA e proposta (linhas 104-113), arquitetura com diagrama SVG e tabela de stack (linhas 147-196), modelo de dados (198-216), segurança e operação (218-234), 7 respostas em resumo com link `../DECISOES.md` (236-249).

## B3. Consistente com o repositório: APROVADO
- Reavaliado após as correções. Linha 252 agora diz "decisões (D1–D30)", igual ao `specs/DECISIONS_LOG.md` e ao `README.md` (linha 85). Linha 144 diz "botões de 48 a 56 px", compatível com `app/globals.css` (52 px em `.btn`, 56 px em `.nav-btn`).
- Mantidos conferidos: 8 tabelas (`prisma/schema.prisma`), conta única `avaliador` com senha só por `DEMO_PASSWORD` e fora da tela (D29), D28, "Próximo passo" e selo "Demonstração" (D30), limites 30/min e 60/min (`src/lib/rate-limit.ts`, aplicados em `app/api/session/demo` e nas 4 rotas de escrita), rótulos de tela e pendências do `ROADMAP.md`.
- Decisões citadas no HTML (D1, D4, D17, D19, D28, D30) existem no log. Nenhuma divergência restante.

## B4. Legível em celular e tela grande, claro e escuro: APROVADO
- Tokens em `:root`, escuro por `prefers-color-scheme` com guarda `:root:not([data-theme="light"])` e por `[data-theme="dark"]`; `body` com fundo explícito; coluna de 46rem; `overflow-x: clip` no `.wrap`; diagrama e tabelas rolam dentro da própria caixa; `viewport` e `safe-area` presentes (linhas 5, 33-35). Nenhuma mudança nesta revisão que afete o layout.

## B5. Honesto e no tema: APROVADO
- Selo "conteúdo de demonstração" (linha 105) e rodapé (252). Plano futuro marcado como plano (pgvector, app nativo, Q3, Q5, Q6 "nada disso está no protótipo", reinício automático no ROADMAP). Chat, Kiwify e música aparecem como "Fora" na Q7.

## Correções necessárias
Nenhuma.

VEREDITO: APROVADO
