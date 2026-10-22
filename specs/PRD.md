# PRD — VIDA (protótipo)

> Protótipo de avaliação técnica. Todo conteúdo é fictício e identificado como demonstração.

## Visão
**VIDA = Ver · Inspirar · Desacelerar · Avançar** (D18). Cada letra é uma etapa do app: **V**er como você está (check-in), **I**nspirar (reflexão), **D**esacelerar (prática guiada), **A**vançar (planos e jornada).

App mobile-first de acompanhamento diário: a pessoa registra como está se sentindo, recebe uma reflexão e uma prática curta coerentes com esse estado, segue planos temáticos e enxerga a própria jornada.

## Persona
Adulto que quer um momento breve de autocuidado no celular, sem compromisso de tempo longo. Usa o app de pé, no transporte, entre tarefas: precisa de telas curtas, legíveis e de toque fácil.

## Jobs to be done
1. "Quero dizer como estou em poucos segundos."
2. "Quero receber algo útil e curto para o meu momento."
3. "Quero seguir um caminho guiado, um dia por vez."
4. "Quero ver que estou avançando."

## Fluxo principal (critério de aceite ponta a ponta)
1. Abrir o app → entrar como usuário de demonstração.
2. Fazer check-in → escolher um estado (ex.: ansioso) → salvar.
3. Ver **Hoje** → reflexão e prática coerentes com o check-in.
4. Abrir um plano → concluir o Dia 1.
5. Abrir **Minha Jornada** → ver o check-in e a conclusão registrados.
6. Recarregar a página → os dados continuam lá (persistidos no Postgres).

## Telas
| Tela | Mínimo |
|---|---|
| Entrada | Proposta do produto + aviso de cuidado (C3) + botão "Entrar como demonstração" |
| Check-in | Escolha de estado emocional; salva estado e data no backend |
| Hoje | Reflexão + prática do dia; varia conforme o último check-in do dia |
| Planos | ≥ 2 planos seedados; detalhe do plano; concluir Dia 1 |
| Minha Jornada | Check-ins recentes + progresso dos planos |

## Critérios de sucesso
- Fluxo principal funcionando na URL pública e coberto por teste E2E.
- Recarregar a página não perde dados.
- Usável em largura de 360 px.
- Estados de carregamento, sucesso e erro com mensagens compreensíveis.

## Não objetivos (deliberadamente fora)
- Pagamentos, assinatura, integração Kiwify.
- App nativo, notificações push, painel admin, comunidade, vídeos, lives.
- Chat com IA (nem mockado).
- Autenticação com e-mail/senha (usuário de demonstração anônimo basta; ver SECURITY.md).
- Texto livre/diário no check-in (evita coletar dado sensível sem necessidade).
- Animações elaboradas.

## Riscos
| Risco | Mitigação |
|---|---|
| Linguagem soar como terapia/diagnóstico | Regra C1; revisão de todos os textos |
| VPS indisponível durante a avaliação | Healthcheck + restart automático; execução local com `docker compose up` documentada |
| Perda de dados em atualização | Migrations versionadas, volume nomeado, backup antes de migrar |
