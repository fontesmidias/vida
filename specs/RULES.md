# Regras (IDs estáveis — citar em testes e commits)

## Domínio
- **R1** — Check-in aceita apenas estados de uma lista fechada: `ANSIOSO`, `CANSADO`, `TRISTE`, `EM_PAZ`. A data/hora é definida pelo servidor, nunca pelo cliente.
- **R2** — Vários check-ins por dia são permitidos. A tela Hoje considera o **mais recente do dia corrente** no fuso `America/Sao_Paulo`.
- **R3** — Hoje varia conforme o estado de R2: cada estado tem reflexão e prática próprias. Sem check-in no dia, mostra conteúdo neutro e convida ao check-in.
- **R4** — Concluir um dia de plano é idempotente: concluir de novo não duplica registro nem gera erro.
- **R5** — Os dias de um plano são sequenciais: o Dia N só pode ser concluído se o Dia N-1 estiver concluído.
- **R6** — Progresso do plano = dias concluídos ÷ total de dias, exibido em porcentagem inteira.
- **R7** — Minha Jornada lista os 10 check-ins mais recentes (do mais novo para o mais antigo) e o progresso de cada plano iniciado.

## Segurança
- **S1** — Toda rota `/api/*`, exceto `/api/health`, exige sessão válida (401 sem sessão).
- **S2** — O `userId` vem **somente** da sessão no servidor, nunca do corpo, da query ou da URL. Toda consulta a dados de usuário filtra por esse `userId`.
- **S3** — Nenhum segredo no repositório. Variáveis documentadas em `.env.example`; o CI bloqueia segredos com gitleaks.
- **S4** — Cookie de sessão criptografado, `httpOnly`, `sameSite=lax` e `secure` em produção. `SESSION_SECRET` com ≥ 32 caracteres, validado na inicialização.
- **S5** — Toda entrada da API é validada com Zod. Erros retornam mensagem genérica, sem stack trace nem detalhes do banco.

## Conteúdo e conformidade
- **C1** — Linguagem adulta e acolhedora. O app nunca promete diagnóstico, terapia ou cura. Rodapé fixo indica o CVV (188) para sofrimento intenso.
- **C2** — Apenas dados fictícios. Conteúdos e planos são identificados como demonstração.
