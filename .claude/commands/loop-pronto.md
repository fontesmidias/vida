---
description: Roda o loop "pronto" (loops/pronto-loop.md) até o check-pronto marcar 12/12 — leva o VIDA à entrega do desafio
argument-hint: "[opcional: item a priorizar nesta execução; se vazio, segue a ordem do loop]"
---

Execute o loop especificado em `C:/Users/cery0/projetos/vida/loops/pronto-loop.md`. Leia esse documento primeiro e siga os passos da volta exatamente. Leia também `loops/pronto-estado.md` e continue da volta registrada.

Resumo: a cada volta, rode `bash scripts/check-pronto.sh` e cole a saída inteira na conversa; ataque o primeiro item em FALHA na ordem de prioridade (obrigatório antes de extra); faça UMA mudança com testes verdes; atualize `loops/pronto-estado.md`. Itens 7, 10 e 11 só passam com veredito APROVADO do revisor em subagente de contexto limpo, usando a rubrica congelada `loops/rubrica-entrega.md`. Não edite o check nem a rubrica. Peça aprovação antes de criar DNS, site no Nginx e stack no Portainer.

Parada: sucesso só com `PRONTO: 12/12` na saída colada; sem-progresso após 2 voltas sem item novo OK; bloqueado quando depender do responsável; esgotado em 40 voltas ou 24/10 às 18h. Erro ou teto estourado NUNCA é sucesso.

Prioridade informada (se houver):
$ARGUMENTS
