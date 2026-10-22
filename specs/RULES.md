# Regras (IDs estáveis — citar em testes e commits)

> Uma regra consolidada só muda com decisão explícita registrada em `specs/DECISIONS_LOG.md`.

## Domínio
- **R1 — Check-in e tempo.** O usuário escolhe um estado do catálogo ativo (tabela `moods`). O servidor registra o instante (`created_at`, UTC) e o cliente informa seu **fuso IANA** (ex.: `America/Sao_Paulo`, obtido via `Intl.DateTimeFormat().resolvedOptions().timeZone`, sem pedir localização). O servidor valida o fuso e calcula `local_date` (data do check-in no fuso do usuário). Fuso inválido ou ausente → `America/Sao_Paulo`.
  - Por quê: o relógio do cliente pode estar errado ou ser manipulado (não confiável para o instante), mas só o cliente sabe qual é o "dia" dele. Fuso não exige permissão de geolocalização (minimização de dados).
- **R2 — Check-in do dia.** Vários check-ins por dia são permitidos. "Hoje" considera o check-in mais recente cujo `local_date` é a data atual **no fuso informado pelo usuário na requisição**.
- **R3 — Conteúdo do dia.** Cada estado pertence a uma família de conteúdo; Hoje mostra a reflexão e a prática da família do estado de R2. Sem check-in no dia → conteúdo neutro + convite ao check-in.
- **R4 — Conclusão idempotente.** Concluir um dia de plano já concluído não duplica registro nem gera erro.
- **R5 — Ordem livre, próximo sugerido.** Qualquer dia de um plano pode ser concluído em qualquer ordem. A interface destaca o primeiro dia não concluído como "próximo sugerido".
- **R6 — Progresso cumulativo e positivo.** O progresso é apresentado como conquista ("3 de 7 dias concluídos" + indicadores preenchidos), nunca como falta. Progresso nunca regride; não existem sequências (streaks) que zeram por ausência.
- **R7 — Histórico preservado.** Check-ins e conclusões são registros *append-only*: a aplicação nunca os altera nem apaga. Minha Jornada exibe os 10 mais recentes e permite carregar mais (paginação). Exclusão só por solicitação do titular (LGPD; ver ROADMAP).

## Segurança (detalhes em `specs/SECURITY.md`)
- **S1 — Defesa em camadas.** Proteções independentes em borda (Nginx), aplicação, dados e infraestrutura; a falha de uma não abre as outras. Princípio de bloqueio por padrão: só passa o que é explicitamente permitido.
- **S2 — Isolamento.** O `userId` vem somente da sessão no servidor, nunca do corpo, da query ou da URL. Toda consulta a dados de usuário filtra por esse `userId`.
- **S3 — Segredos.** Nenhum segredo no repositório. Variáveis documentadas em `.env.example`; o CI bloqueia segredos com gitleaks.
- **S4 — Sessão.** Cookie criptografado e assinado (iron-session), `httpOnly`, `sameSite=lax`, `secure` em produção, contendo apenas o `userId`. `SESSION_SECRET` com ≥ 32 caracteres, validado na inicialização.
- **S5 — Entrada e erros.** Toda entrada é validada por esquema (Zod) antes de chegar às regras; o que não bate com o esquema é rejeitado (400). Erros internos retornam mensagem genérica e amigável; detalhes vão só para o log do servidor.
- **S6 — Limites de uso.** Rate limit por IP na borda e na aplicação (mais restrito em escrita e na criação de sessão demo); limite de tamanho de corpo da requisição.
- **S7 — Health mínimo.** `/api/health` é público, sem dados internos (`{"status":"ok"}`), com rate limit. A verificação com banco (`/api/health/ready`) só responde à rede interna.

## Conteúdo e conformidade
- **C1 — Tom.** Linguagem adulta e acolhedora. O app nunca promete diagnóstico, terapia ou cura. Um botão **Apoio**, discreto e sempre visível, abre o contato do CVV (188, gratuito, 24 h) com convite acolhedor ("Quer conversar com alguém?"), sem linguagem alarmista em tela fixa (D16).
- **C2 — Dados fictícios.** Conteúdos e planos são identificados como demonstração.
- **C3 — Aviso de cuidado.** Na Entrada, em uma frase curta: o app é um espaço de autocuidado e não substitui o acompanhamento profissional.
- **C4 — Gênero neutro.** Sempre que possível, todo texto do projeto (telas, conteúdo, mensagens, documentação) usa linguagem de gênero neutro: construções como "com ansiedade", "a pessoa", "alguém querido", em vez de flexões como "ansioso", "sozinho", "amigo". Identificadores internos (slugs, nomes de tabela como `users`) não são texto para pessoas e ficam como estão.

## Processo
- **P1 — Escopo.** Obrigatório primeiro; opcional do desafio depois; qualquer outra ideia vai para `ROADMAP.md` (nenhuma ideia é descartada).
- **P2 — Versões.** Cada versão entregue recebe tag anotada SemVer (`vX.Y.Z`) no GitHub e entrada no `CHANGELOG.md`.
- **P3 — Commits.** Conventional Commits, pequenos, em branches `feat/*`, `fix/*`, `chore/*`, `docs/*`; citam IDs de regra quando aplicável.
