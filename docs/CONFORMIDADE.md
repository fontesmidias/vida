# Conformidade com o desafio

Matriz única: cada exigência do PDF do desafio CLAVIS VIA, o que foi feito e onde está a prova. Demo: https://vida.fontesmidias.com.br

Legenda: ✅ feito · ⚪ fora por regra do desafio (não fizemos de propósito) · ◐ opcional · ⏳ pendente

## 1. Escopo obrigatório: as 5 telas
| Exigência do PDF | Status | Onde está | Prova |
|---|---|---|---|
| **Entrada:** identificar usuário de demonstração e mostrar a proposta | ✅ | `app/page.tsx`, `src/ui/DemoLogin.tsx`, `POST /api/session/demo`: uma conta de avaliação; a senha vem nas instruções de entrega, nunca na tela nem no código (D29) | E2E "fluxo principal do desafio" e "S8: senha errada…" |
| **Check-in:** escolher estado (ex.: ansioso, cansado, em paz) e salvar estado e data no backend | ✅ | `app/(app)/check-in`, `POST /api/checkins`, tabela `checkins` | E2E + `tests/unit/checkins.test.ts` (R1) |
| **Hoje:** conteúdo curto e prática do dia, variando conforme o check-in | ✅ | `app/(app)/hoje`, `GET /api/today`, 4 famílias + neutro | E2E (ansiedade → "Nem tudo precisa ser resolvido agora.") + `tests/unit/today.test.ts` (R2, R3) |
| **Planos:** listar pelo menos 2 planos seedados, abrir um e concluir o Dia 1 | ✅ | `app/(app)/planos`, 2 planos em `prisma/seed-data.ts` | E2E conclui o Dia 1 + `tests/unit/plans.test.ts` (R4–R6) |
| **Minha Jornada:** check-ins recentes e progresso do plano, refletindo as ações | ✅ | `app/(app)/jornada` (aba "Jornada") | E2E verifica check-in e "1 de 5" |

## 2. Fluxo de ponta a ponta (os 6 passos)
| Passo | Status | Prova |
|---|---|---|
| 1. Entrar como usuário de demonstração (conta + senha) | ✅ | Teste E2E `fluxo principal do desafio` (`tests/e2e/fluxo-principal.spec.ts`), que percorre os 6 passos em sequência |
| 2. Check-in "ansioso" e salvar | ✅ | idem |
| 3. Hoje coerente com o check-in | ✅ | idem (inclui abrir a prática) |
| 4. Abrir plano e concluir o primeiro dia | ✅ | idem |
| 5. Minha Jornada com check-in e conclusão | ✅ | idem |
| 6. Recarregar e os dados continuam | ✅ | idem (`page.reload()`) |

Roda em Chromium (perfil Pixel 7) e WebKit (perfil iPhone 13), no CI a cada push e contra a demo pública (`scripts/check-pronto.sh`, item 4).

## 3. Critérios técnicos e de entrega
| Exigência | Status | Onde está |
|---|---|---|
| Persistência real em backend/banco (não só localStorage) | ✅ | Postgres 16 via Prisma; migrations em `prisma/migrations/` |
| Interface mobile-first, navegação utilizável, carregamento e erro | ✅ | `specs/UI_UX_SPEC.md` (U1–U13); tratamento único de erros em `src/ui/api.ts` |
| Leitura e escrita reais; esquema legível; responsabilidades separadas | ✅ | `app/api` → `src/services` → `src/repositories`; `specs/ARCHITECTURE.md` |
| URL pública funcionando | ✅ | https://vida.fontesmidias.com.br |
| Repositório Git, nomes consistentes, variáveis tratadas | ✅ | `.env.example`, `.env.deploy.example`; README, seção "Variáveis de ambiente" |
| Pelo menos uma checagem/teste relevante | ✅ | 137 testes de unidade, 16 E2E, CI (`.github/workflows/ci.yml`) |
| Só dados fictícios, identificados como demonstração | ✅ | Regra C2; selo "Demonstração" na Entrada; descrições dos planos |
| Nenhuma chave de API no repositório | ✅ | gitleaks no histórico inteiro a cada push |
| Explicar autenticação, consentimento e proteção em produção | ✅ | `DECISOES.md`, pergunta 3; `specs/SECURITY.md` |
| Transparência sobre IA no README | ✅ | README, seção "Uso de IA"; `DECISOES.md`, pergunta 7 |
| Funcionar em largura de celular | ✅ | E2E em tela de celular; checagem de que a barra não cobre conteúdo (U12) |
| Mensagens compreensíveis de sucesso e erro | ✅ | `src/ui/api.ts`, `src/ui/feedback.tsx` |
| Linguagem adulta e acolhedora; sem prometer diagnóstico, terapia ou cura | ✅ | Regras C1 e C4; testes de tom em `tests/unit/seed-data.test.ts` |
| Componentes simples, sem animações elaboradas | ✅ | Animações curtas e sutis (entrada de tela, respiração); todas desligadas com "reduzir movimento" |

## 4. Como entregar
| Item | Status | Onde está |
|---|---|---|
| 1. Demo com instruções de acesso e roteiro do fluxo | ✅ | README, seção "Demo" |
| 2. Código com acesso ao avaliador | ✅ | Repositório público em https://github.com/fontesmidias/vida (D31) |
| 3. README: passo a passo, stack, estrutura, variáveis, migrations, o que é mockado | ✅ | `README.md` (seções "Como rodar", "Stack", "Estrutura", "Variáveis de ambiente", "Banco de dados", "O que é demonstração") |
| 4. Registro técnico com as 7 perguntas | ✅ | `DECISOES.md`, aprovado por revisor independente com rubrica fixa (`loops/veredito-decisoes.md`) |
| 5. Vídeo de até 5 minutos (opcional) | ◐ | Roteiro pronto e revisado em `docs/ROTEIRO_VIDEO.md`; a gravação é da pessoa candidata |

## 5. O que o desafio disse para não fazer (e não fizemos)
| Fora do escopo obrigatório | Status | Onde explicamos |
|---|---|---|
| Pagamentos, Kiwify, assinatura | ⚪ | Plano em `DECISOES.md`, pergunta 6; `ROADMAP.md` |
| App nativo | ⚪ | `ROADMAP.md` |
| 365 conteúdos | ⚪ | Conteúdo mínimo por família (D11) |
| Notificações push | ⚪ | `ROADMAP.md` |
| Painel de administração | ⚪ | `ROADMAP.md`; prioridade 2 em `DECISOES.md`, pergunta 5 |
| Vídeos, lives, comunidade | ⚪ | Fora do tema desta fatia |
| IA conversacional (não obrigatória) | ⚪ | Não incluímos nem simulamos; plano seguro em `DECISOES.md`, pergunta 6 |

Regra do PDF respeitada: extras só depois do obrigatório funcionando. A ordem está registrada em `loops/pronto-estado.md`.

## 6. Opcionais do próprio desafio
| Opcional | Status | Observação |
|---|---|---|
| Autenticação completa | ◐ parcial | Login com senha (hash scrypt, limite de tentativas) na conta de avaliação (D29, S8); cadastro e conta pessoal ficam no ROADMAP, com a proteção para dados reais em `DECISOES.md`, 3 |
| Vídeo de até 5 minutos | ◐ roteiro pronto | `docs/ROTEIRO_VIDEO.md` |
| Chat com IA (mockado ou real) | ◐ não feito | Preferimos não simular; ver acima |

## 7. Além do mínimo, dentro do tema
| Extra | Por quê | Onde está |
|---|---|---|
| Conta de avaliação com continuar ou começar do zero, sem apagar nada | Quem avalia volta à jornada ou recomeça; histórico preservado e auditável (D27, D29, R8) | `src/ui/DemoLogin.tsx`, `POST /api/me/reset`, `tests/integration/journey.test.ts`, `scripts/reset-demo.sh` |
| Práticas guiadas (respiração 4-6, mão no peito, uma coisa pequena, três coisas boas) | Levar a pessoa para fora da tela (D17) | `src/ui/practices.tsx` |
| Botão Apoio com o CVV por extenso | Cuidado sem alarme (C1, D16) | `src/ui/AppFrame.tsx` |
| Apagar meus dados | Direito do titular na LGPD (D19) | `DELETE /api/me`; E2E "LGPD" |
| Hoje pelo fuso do dispositivo, com viagens | O dia é o da pessoa (R1, R2) | `src/services/checkins.ts`, `src/services/today.ts` |
| Ícones próprios, sigla VIDA, tema claro e escuro, linguagem neutra | Identidade e acessibilidade (D15, D18, C4) | `src/ui/MoodIcon.tsx`, `app/globals.css` |
| Segurança em camadas: Cloudflare, Nginx só para o Cloudflare, rate limit, CSP | S1–S8, D22, D23 | `specs/SECURITY.md`, `deploy/nginx/vida.conf` |
| Deploy com portão de CI e backup diário com restauração provada | Operação confiável | `scripts/deploy.sh`, `docs/OPERACAO.md` |
| E2E em dois motores, contra a demo pública | Prova real, não só local | `scripts/check-pronto.sh` |
| Documentos revisados por revisor independente com rubrica fixa | Honestidade da entrega | `loops/` |
| Apresentação para a conversa técnica | Visão geral em uma página | `docs/apresentacao.html` |

## 8. Divergências deliberadas e pendências
| Ponto | Situação | Motivo / próximo passo |
|---|---|---|
| Referência visual do PDF (branco, azul pastel, lavanda, rosa claro, símbolo de chave) | Divergência deliberada | O PDF diz que é direção, não layout a copiar. A identidade VIDA usa névoa e sálvia, com lavanda nas famílias; não usa o símbolo de chave; o elemento de identidade é a sigla VIDA (D18) |
| Nome do produto | VIDA, não CLAVIS VIA | Escolha da pessoa responsável; o desafio continua identificado em toda a documentação |
| Acesso dos avaliadores ao código | ✅ | Repositório público (D31) |
| Rate limit também no Nginx | ⏳ | Exige configuração global da VPS compartilhada (`ROADMAP.md`) |
| Usuário do banco sem privilégio de dono | ⏳ | `specs/SECURITY.md`, `ROADMAP.md` |
| Reinício automático quando o healthcheck falha | ⏳ | `ROADMAP.md`; hoje o restart cobre queda do processo |
| Cópia dos backups fora da VPS | ⏳ | `ROADMAP.md` |
