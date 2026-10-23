# Roteiro do vídeo (até 5 minutos)

Gravação: tela do celular (ou DevTools em modo Pixel 7) + editor/terminal. Ritmo calmo; cada bloco tem o que **dizer** e o que **mostrar**.

| Tempo | Bloco | Mostrar na tela | Dizer (resumo) |
|---|---|---|---|
| 0:00–0:25 | Abertura | Entrada de https://vida.fontesmidias.com.br, com a sigla V·I·D·A | "O VIDA é um protótipo de check-in emocional. A sigla é o próprio fluxo: Ver como você está, Inspirar, Desacelerar e Avançar. É demonstração: sem cadastro, com dados guardados de verdade num Postgres." |
| 0:25–1:15 | Ver e Inspirar | Escolha **Avaliação 1**, digite a senha `vida2026` → **Entrar** → **Fazer check-in** → **Com ansiedade** → tela **Hoje** | "Um toque registra: não há nada para digitar, o que evita erro e não coleta texto sensível. O Hoje muda conforme o estado: para ansiedade, uma reflexão curta e uma respiração 4-6." |
| 1:15–1:50 | Desacelerar | **Começar** → círculo de respiração por 2 ou 3 ciclos → **Encerrar** | "A prática é guiada: o círculo cresce em 4 segundos e diminui em 6. A ideia é levar a pessoa para fora da tela, para o próprio corpo." |
| 1:50–2:30 | Avançar | **Planos** → **Respirar com calma** → **Dia 1** → **Concluir dia** → **Jornada** | "Qualquer dia pode ser feito em qualquer ordem; o primeiro em aberto aparece como próximo. O progresso só soma, sem sequência que zera. Na Jornada estão o check-in e a conclusão." |
| 2:30–2:45 | Persistência | Recarregar a página na Jornada | "Recarreguei e nada sumiu: está no banco, não no navegador." |
| 2:45–4:15 | **Decisão técnica: de quem é o "dia"?** | `src/services/checkins.ts` (`resolveTimezone`, `localDateFor`) e `tests/unit/today.test.ts` (caso São Paulo × Tóquio) | Ver o texto abaixo. |
| 4:15–4:45 | Qualidade e segurança | Terminal com `bash scripts/check-pronto.sh` e o CI verde no GitHub | "Cada item da entrega é provado por comando: testes, E2E em Chrome e Safari contra a demo pública, rate limit, backup restaurado. O Nginx só aceita o Cloudflare, e o botão Apoio leva ao CVV." |
| 4:45–5:00 | Fechamento | Jornada com **Começar do zero** e **Apagar meus dados** | "Dá para recomeçar a jornada sem apagar nada, e a pessoa pode apagar tudo o que é dela. As respostas às perguntas do desafio estão no DECISOES.md." |

## Texto do bloco de decisão (2:45–4:15)
**O problema:** "hoje" depende de onde a pessoa está. Se eu guardasse só a data do servidor, um check-in às 22h em São Paulo cairia no dia seguinte, porque o servidor usa UTC.

**O que fiz (R1, D5):** o **instante** vem sempre do relógio do servidor, e o **fuso** vem do dispositivo, pelo `Intl` do navegador, sem pedir localização. O servidor valida o fuso (só nomes IANA; inválido cai em São Paulo) e calcula a data local do check-in. A tela Hoje usa o fuso **atual** do dispositivo, então viagem funciona: o mesmo instante, 02:30 UTC de 22/10, é dia 21 em São Paulo e dia 22 em Tóquio. É exatamente o teste que mostro aqui.

**A alternativa descartada:** usar a hora do próprio celular. Ela pode estar errada ou ser ajustada à mão, criando check-ins em dias que não aconteceram. O fuso, por outro lado, o aparelho corrige sozinho quando a pessoa viaja. E pedir geolocalização seria coletar um dado sensível sem necessidade.

**Por que importa:** o conteúdo do dia e o histórico ficam coerentes com a vida da pessoa, e cada check-in guarda o fuso em que foi feito, então a Jornada mostra a hora que ela viveu ("08:15 · horário de Lisboa").
