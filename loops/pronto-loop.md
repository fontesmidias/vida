---
nome: pronto
categoria: Entrega (deploy + qualidade + documentação)
gatilho: manual
base-teorica: Loop Library (gatilho + meta + verificação + parada); autocorreção sem feedback externo estagna (2310.01798); juiz-LLM separado do gerador e com rubrica fixa reduz reward hacking (2306.05685); livro "Engenharia de Software com Agentes Inteligentes" (Sandeco), cap. 6 (SDD/TDD, check determinístico)
---

# Loop "pronto": levar o VIDA da v0.2.0 à entrega

## Descrição
Leva o projeto VIDA do estado atual até a entrega do desafio CLAVIS VIA: demo pública na VPS, CI, rate limit, backup, exclusão de dados (LGPD), README, DECISOES.md, roteiro do vídeo, documento de apresentação e tag final. Uma mudança por volta, sempre provada pelo check.

## Use quando
Quiser avançar a entrega de forma autônoma e verificável, a partir de qualquer ponto: o estado vive no disco e o check diz o que falta.

## Meta
`bash scripts/check-pronto.sh` imprime `PRONTO: 12/12` no commit atual da `main`. Verificável? **Sim** para 9 itens (comandos). Os itens 7, 10 e 11 dependem de juízo e foram endurecidos: só contam com veredito `APROVADO` de um revisor independente (ver Verificação).

Ordem de prioridade (P1 do projeto: obrigatório primeiro): itens 1–7 e 12 são o mínimo exigido pelo PDF; 8–11 são os extras escolhidos pelo responsável e **só** entram depois que 1–7 estiverem OK.

## Verificação (o check que manda)
A cada volta, RODE o check e COLE a saída inteira na conversa: é a evidência que a parada lê.
- **Check:** `bash scripts/check-pronto.sh` (completo, com E2E). Durante a volta, pode-se usar `--rapido` para iterar, mas a volta só fecha com o check completo.
- **Juízo endurecido (itens 7, 10, 11):** rubrica congelada em `loops/rubrica-entrega.md`; revisor em **subagente com contexto limpo** (recebe só a rubrica, o PDF do desafio e o documento, nunca o histórico de quem escreveu); veredito gravado em `loops/veredito-<doc>.md`, terminando em `VEREDITO: APROVADO|REPROVADO`. O check só aceita veredito commitado e posterior à última versão do documento.
- **Pronto =** a última linha do check é `PRONTO: 12/12`.
- **Congelados:** o loop **não pode** editar `scripts/check-pronto.sh`, `loops/rubrica-entrega.md` nem afrouxar testes existentes. Se o check estiver errado, o estado é **bloqueado** e o responsável decide.

## Passos da volta
1. Leia `loops/pronto-estado.md` e rode o check: essa é a linha de base da volta (cole a saída).
2. Escolha o **primeiro item em FALHA na ordem de prioridade** (obrigatório antes de extra; dependências antes: CI e deploy antes de health; health antes de E2E público e rate limit público).
3. Faça **UMA** mudança para esse item, no fluxo do projeto (`CLAUDE.md`): spec → teste citando a regra → ver falhar → implementar → verde; branch `feat|fix|chore|docs/*`, commits Conventional.
   - Antes do merge de deploy, rate limit ou exclusão de dados: skill `security-review`. Antes de qualquer merge: skill `code-review`.
   - Documento de apresentação: skills `artifact-design` + `artifact-diagramming`.
   - Itens 7, 10, 11: escreva o documento, depois dispare o revisor (subagente, contexto limpo) e commite o veredito.
   - Decisões de processo: consulte os livros do Sandeco (`doc/sandeco/`, busca direcionada) e cite o capítulo.
4. Rode `npm run lint && npm run typecheck && npm test` e, se a mudança toca telas ou fluxo, `npm run test:e2e`.
5. Só faça merge na `main` se nada regrediu; senão reverta a branch.
6. Rode o check completo e cole a saída.
7. Atualize `loops/pronto-estado.md` (volta, placar, o que mudou, commit, bloqueios) e documente o que for conhecimento novo (README, specs, DECISIONS_LOG, CHANGELOG).

## Estados de parada
- **sucesso:** a saída colada do check termina em `PRONTO: 12/12`.
- **sem-progresso:** 2 voltas seguidas sem nenhum item novo passar para OK. Pare e relate o que travou.
- **bloqueado:** credencial falha; ação que exige aprovação (ver Guardrails); mudança que contraria `specs/RULES.md` ou decisão registrada; o check parece errado; algo só o responsável pode fazer (ex.: compartilhar a página de apresentação).
- **esgotado:** 40 voltas, ou 2026-10-24 às 18h (horário de Brasília).
(Erro ou teto estourado NUNCA é sucesso.)

## Guardrails
- **Teto:** 40 voltas ou 24/10 às 18h, o que vier primeiro.
- **Aprovação humana antes de** (uma vez por categoria, mostrando o plano exato): criar o DNS `vida` no Cloudflare; criar o site `vida` no Nginx da VPS, emitir o certificado e recarregar; criar a stack `vida` no Portainer; mudar `specs/RULES.md` ou decisão registrada. Depois de aprovado, **atualizar** algo do próprio VIDA fica liberado.
- **Nunca:** tocar em site, stack, DNS ou container que não seja do VIDA; ativar firewall ou mudar o Nginx global; force push; editar migration aplicada; expor segredo em log, commit ou conversa; recarregar o Nginx sem `nginx -t` passar.
- **Sempre:** backup do banco de produção antes de aplicar migration nova lá.

## Memória / estado
`loops/pronto-estado.md` (versionado): volta atual, último placar, histórico (volta → item → mudança → commit → resultado), bloqueios abertos, vereditos do revisor. Credenciais em `.env.deploy` (fora do Git). Padrão da VPS: memória `vps-infra`.

## Por que funciona
- **Check externo:** o placar vem de comandos, não da opinião do agente (autocorreção sem feedback externo estagna).
- **Check e rubrica congelados:** quem faz o trabalho não pode mudar a régua (evita reward hacking).
- **Juiz separado e sem o contexto de quem escreveu:** quebra a simetria que leva o juiz a concordar com o gerador.
- **Uma mudança por volta, pior primeiro, com linha de base:** cada ganho é atribuível e reversível.
- **Estado no disco:** sobrevive a resumo de contexto e troca de sessão.
- **Aprovação antes do externo/irreversível:** a VPS é compartilhada com outros sites em produção.

## Como acionar
Comando (recomendado): `/goal /loop-pronto`

Ou a condição explícita:
> /goal Use o loop pronto (loops/pronto-loop.md). Continue até a saída de `bash scripts/check-pronto.sh`, colada na conversa, terminar em `PRONTO: 12/12`. Restrições: não editar o check nem a rubrica; pedir aprovação antes de criar DNS, site no Nginx e stack no Portainer; nunca tocar no que não é do VIDA. Pare e me chame se ficar bloqueado, após 2 voltas sem progresso, após 40 voltas ou em 24/10 às 18h.

Se o contexto ficar pesado, o padrão Ralph funciona igual: cada sessão nova lê este documento e `loops/pronto-estado.md` e continua da volta registrada.

## Métrica de saúde
Custo por item aceito = tokens gastos / nº de itens que passaram a OK no check. Volta que gasta sem mover o placar acende o alerta de sem-progresso.
