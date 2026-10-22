# Rubrica de entrega (CONGELADA)

> Usada pelo revisor independente do loop `pronto` (`loops/pronto-loop.md`). Congelada em 2026-10-22.
> O loop **não pode** alterar este arquivo; mudanças só com aprovação explícita do responsável.

## Como o revisor trabalha
- Roda em subagente com **contexto limpo**: recebe só esta rubrica, o PDF do desafio (`doc/escopo-desafio/`) e o arquivo avaliado. Não recebe o histórico de quem escreveu.
- Avalia critério a critério, com evidência (trecho citado). Um critério reprovado reprova o documento.
- Grava o veredito em `loops/veredito-<documento>.md`, terminando com a linha exata `VEREDITO: APROVADO` ou `VEREDITO: REPROVADO`, e a lista de motivos.

## A. `DECISOES.md` (as 7 perguntas técnicas obrigatórias do desafio)
1. **Completo:** as 7 perguntas aparecem como títulos `## 1.` a `## 7.`, com o texto da pergunta do PDF.
2. **Responde o que foi perguntado:** cada parte da pergunta tem resposta (ex.: a 4 cobre deploy, observar erros **e** recuperar serviço; a 6 cobre IA **e** Kiwify/webhooks **e** controle de acesso; a 7 cobre o que ficou de fora **e** onde usou IA).
3. **Ancorado no projeto:** cada resposta cita algo verificável do repositório (arquivo, regra R/S/C/U, decisão D, comando ou teste). Nada genérico que serviria para qualquer projeto.
4. **Objetivo:** respostas diretas; o PDF diz "respostas objetivas bastam". Sem enchimento nem marketing.
5. **Honesto:** não afirma nada que o projeto não faz; o que é plano futuro está marcado como futuro (ROADMAP).
6. **Tom (C1, C4):** não promete diagnóstico, terapia ou cura; linguagem neutra em gênero quando possível.
7. **Transparência sobre IA (exigência do PDF):** diz quais ferramentas de IA foram usadas, em quais etapas, e o que foi revisado, modificado ou validado pessoalmente.

## B. Documento de apresentação (`docs/apresentacao.html`, publicado como página)
1. **Para o avaliador:** abre com o link da demo pública e um roteiro curto do fluxo principal (os 6 passos do PDF).
2. **Cobre o essencial:** proposta do produto (sigla VIDA), arquitetura com diagrama, modelo de dados, segurança, operação, e as 7 respostas (resumidas, com link para o `DECISOES.md`).
3. **Consistente com o repositório:** nenhum número, rota, tabela ou decisão diverge do código e das specs.
4. **Legível em celular e em tela grande; claro e escuro.**
5. **Honesto e no tema:** conteúdo marcado como demonstração (C2); nada fora do escopo do desafio apresentado como feito.

## C. `docs/ROTEIRO_VIDEO.md`
1. Cabe em **até 5 minutos**, com marcações de tempo.
2. Mostra o fluxo principal completo e explica **uma** decisão técnica com profundidade (o porquê e a alternativa descartada).
3. Diz o que mostrar na tela em cada trecho.
