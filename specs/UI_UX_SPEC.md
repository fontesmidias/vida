# UI/UX: telas, estados e transições

> Baseado em PRD (telas e persona), RULES (R1–R7, C1–C4) e SECURITY. Toda tela nova ou mudança de fluxo começa aqui.

## Princípios
| ID | Princípio | Por quê |
|---|---|---|
| U1 | **Zero digitação.** Toda entrada é feita por toque: botões, cartões, listas. Nenhum campo de texto livre no app | A persona usa o celular de pé, entre tarefas. Sem digitar, não há o que digitar errado; também evita coletar dado sensível (D4) |
| U2 | **Uma ação principal por tela**, sempre visível sem rolar em 360 px de largura | Decidir rápido, com o polegar |
| U3 | **Alvos de toque ≥ 48 px** e espaço entre eles | Evita toque errado |
| U4 | **Dados automáticos não são perguntados.** O fuso vem do dispositivo (`Intl...timeZone`), sem pedir permissão nem localização | O dispositivo já está ajustado para a realidade da pessoa (R1) |
| U5 | **Todo pedido ao servidor tem 3 estados visíveis:** carregando, sucesso e erro, com saída clara | Nunca deixar a pessoa sem saber o que aconteceu |
| U6 | **Acessível:** contraste AA, foco visível, rótulos para leitores de tela (o emoji é decorativo e o texto descreve), sem depender só de cor | Inclusão |
| U7 | **Tom acolhedor e neutro em gênero** (C1, C4). Erros nunca culpam a pessoa | Coerência com o propósito do app |

## Navegação
- **Entrada** (`/`): sem sessão. Após entrar, vai para **Hoje**.
- Com sessão, uma **barra inferior fixa** com 4 destinos: **Hoje** (`/hoje`) · **Check-in** (`/check-in`) · **Planos** (`/planos`) · **Jornada** (`/jornada`). O destino atual fica destacado e marcado com `aria-current`.
- Rodapé do CVV (C1) em todas as telas, acima da barra inferior.
- Sem sessão em qualquer tela interna → volta para a Entrada (ver "Erros").

## Telas

### Entrada `/`
- Conteúdo: nome VIDA, proposta em 1 frase, aviso de cuidado (C3), selo "Demonstração" (C2).
- Ação principal: **Entrar como demonstração**.
- Estados: carregando ("Preparando seu espaço…", botão desabilitado) → sucesso: vai para Hoje → erro: mensagem + mesmo botão para tentar de novo.
- Se já existe sessão válida, vai direto para Hoje.

### Check-in `/check-in`
- Pergunta: "Como você está agora?"
- **Grade de 8 cartões** (2 colunas), um por estado do catálogo, com emoji + rótulo ("Com ansiedade"). A ordem vem de `sort_order`.
- **Um toque registra** o check-in. Não existe botão "Salvar" separado: menos passos, sem estado intermediário. Para evitar toque duplo, os cartões ficam desabilitados enquanto o pedido está em andamento.
- Estados: carregando lista (esqueleto dos 8 cartões) → enviando (cartão tocado com indicador) → sucesso: vai para Hoje com a confirmação "Check-in registrado" → erro: mensagem + cartões habilitados de novo.
- Não há data nem hora para escolher: o servidor registra o instante e o dispositivo informa o fuso (R1).

### Hoje `/hoje`
- Com check-in hoje (R2): "Você disse que está **com ansiedade**" + cartão de **reflexão** + cartão de **prática** (com duração: "3 min"). Ação secundária: "Mudou? Faça outro check-in."
- Sem check-in hoje (R3): conteúdo neutro + ação principal **Fazer check-in**.
- Estados: esqueleto → conteúdo → erro com "Tentar de novo".

### Planos `/planos` e `/planos/[slug]`
- Lista: cartões com título, descrição e progresso ("2 de 5 dias concluídos" + indicadores preenchidos, R6).
- Detalhe: lista de dias. Cada dia mostra o status (concluído / não concluído). O primeiro dia não concluído recebe o selo **Próximo sugerido** (R5). Qualquer dia pode ser aberto e concluído.
- Ação no dia: **Concluir dia**. Depois de concluído, o botão vira o estado "Concluído ✓", que não é clicável (R4: tocar de novo não faz nada de diferente).
- Plano completo: mensagem de conquista, nunca de "fim" ou de cobrança.

### Jornada `/jornada`
- Seção **Planos**: progresso de cada plano iniciado (R6).
- Seção **Check-ins**: os 10 mais recentes (R7), com emoji, rótulo, data e hora. Ao final, o botão **Carregar mais** (paginação). Lista vazia → convite ao primeiro check-in.

## Tempo na tela (R1, viagens)
- Cada check-in guarda o fuso em que foi feito. **Data e hora são exibidas no fuso em que o check-in aconteceu**, ou seja, a hora que a pessoa viveu naquele momento.
- Se esse fuso for diferente do fuso atual do dispositivo, mostrar a indicação: "22/10, 08:30 · horário de Tóquio".
- "Hoje" usa sempre o fuso atual do dispositivo (R2). Exemplo: um check-in feito em São Paulo na noite de 21/10 não conta como "hoje" para quem acabou de chegar a Tóquio em 22/10. A pessoa vê o convite para um novo check-in, que reflete o novo dia dela.

## Erros: algoritmo único do cliente
Com U1, a interface não deixa enviar dado errado. Mesmo assim, a API continua validando tudo (S1, S5): ela pode ser chamada fora do app, por bug ou por ataque. A interface trata as respostas assim:

| Situação | O que a pessoa vê | O que o app faz |
|---|---|---|
| Sem internet / tempo esgotado | "Parece que a conexão falhou. Vamos tentar de novo?" | Mantém a tela; botão **Tentar de novo** |
| 401 (sessão terminou) | "Sua sessão terminou. Entre novamente para continuar." | Volta para a Entrada |
| 400 no check-in | "Esse estado não está mais disponível. Atualizamos a lista para você." | Recarrega o catálogo (pode ter mudado, D6) |
| 400 em outra ação | "Não foi possível concluir. Atualizamos a tela." | Recarrega os dados da tela |
| 403 / 429 / 5xx | Mensagem amigável recebida da API | Botão **Tentar de novo**; após 429, espera alguns segundos |

Regras: o app nunca mostra código técnico nem stack trace, nunca culpa a pessoa e sempre oferece uma saída (tentar de novo ou voltar).

## Componentes
`MoodCard` (cartão de estado) · `ContentCard` (reflexão/prática) · `PlanCard` · `DayItem` · `ProgressDots` (indicadores preenchidos) · `BottomNav` · `StateView` (carregando/erro/vazio, padroniza U5) · `CareFooter` (CVV).

## Visual
Mobile-first a partir de 360 px; em telas largas, conteúdo centralizado com largura máxima de ~28 rem. Paleta calma, de baixo contraste entre superfícies e alto contraste no texto; uma cor de destaque para a ação principal. Animações só sutis (transições de estado), conforme os não objetivos do PRD.
