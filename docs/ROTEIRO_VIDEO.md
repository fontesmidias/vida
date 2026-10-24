# Roteiro do vídeo (até 5 minutos)

Gravação: tela do celular (ou DevTools em modo Pixel 7) + editor. Ritmo calmo; cada bloco diz o que **mostrar** e o que **dizer**. Antes de gravar: `bash scripts/reset-demo.sh` (conta limpa) e a senha à mão; o campo de senha é mascarado, então ela não aparece no vídeo.

| Tempo | Bloco | Mostrar na tela | Dizer (resumo) |
|---|---|---|---|
| 0:00–0:20 | Abertura | Entrada de https://vida.fontesmidias.com.br | "O VIDA é um protótipo de check-in emocional. A sigla é o próprio fluxo: Ver como você está, Inspirar, Desacelerar e Avançar. O conteúdo é de demonstração; os dados ficam salvos de verdade num Postgres." |
| 0:20–0:50 | 1 · Entrar e 2 · Check-in | Digitar a senha → **Entrar** → **Fazer check-in** → **Com ansiedade** | "Uma conta de avaliação, com senha guardada como hash. No check-in, um toque registra: nada para digitar, e nenhum texto sensível coletado." |
| 0:50–1:30 | 3 · Hoje | Tela **Hoje** (selo "Demonstração") → **Começar** → 2 ciclos de respiração → **Encerrar** | "O Hoje muda conforme o estado: para ansiedade, uma reflexão curta e uma respiração 4-6, guiada pelo círculo." |
| 1:30–2:05 | 4 · Plano | **Próximo passo: Ver planos** → **Respirar com calma** → **Dia 1** → **Concluir dia** | "O app conduz cada etapa com um botão de próximo passo. Os dias podem ser feitos em qualquer ordem; concluir de novo não duplica." |
| 2:05–2:30 | 5 · Jornada e 6 · Recarregar | **Ver minha jornada** → mostrar check-in e "1 de 5" → recarregar a página | "Aqui estão o check-in e a conclusão. Recarreguei e nada sumiu: está no banco, não no navegador." |
| 2:30–4:10 | **Decisão técnica: de quem é o "dia"?** | `src/services/checkins.ts` (`resolveTimezone`, `localDateFor`) e `tests/unit/today.test.ts` (São Paulo × Tóquio) | Texto abaixo. |
| 4:10–4:45 | Qualidade | CI verde no GitHub; `tests/e2e/fluxo-principal.spec.ts` | "Esse mesmo fluxo roda como teste automático em Chrome e Safari a cada push na main e em cada PR. O userId vem só da sessão, e um teste prova que uma conta não vê os dados de outra." |
| 4:45–5:00 | Fechamento | Jornada: **Começar do zero** e **Apagar meus dados** | "Dá para recomeçar sem apagar nada, e apagar tudo o que é seu. As 7 respostas técnicas estão no DECISOES.md." |

## Texto do bloco de decisão (2:30–4:10)
**O problema:** "hoje" depende de onde a pessoa está. O servidor trabalha em UTC: um check-in às 22h em São Paulo já é dia seguinte para ele.

**O que fiz (R1, D5):** o **instante** vem do relógio do servidor; o **fuso** vem do aparelho, pelo `Intl` do navegador, sem pedir localização. O servidor valida o fuso (só nomes IANA; inválido vira São Paulo) e calcula a data local. O Hoje usa o fuso **atual** do aparelho, então viagem funciona: 02:30 UTC de 22/10 é dia 21 em São Paulo e dia 22 em Tóquio. É o teste que mostro aqui.

**Alternativa descartada:** usar a hora do celular. Ela pode estar errada ou ser mudada à mão, criando check-ins em dias que não existiram. O fuso, o aparelho corrige sozinho; e geolocalização seria coletar dado sensível sem necessidade.

**Por que importa:** o conteúdo do dia e o histórico ficam coerentes com a vida da pessoa.
