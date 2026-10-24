# Estado do loop "pronto"

- **Volta atual:** 8 (release v1.0.0). O placar final é o check completo rodado sobre a tag `v1.0.0`, colado na conversa da sessão
- **Placar antes da release:** itens 1–11 verdes; item 12 depende desta tag
- **Teto:** 40 voltas ou 2026-10-24 18h

## Linha de base (volta 0)
```
[OK]     1 local (lint/tipos/unit/e2e)   lint, typecheck, 122 passed (122), e2e local pulado
[FALHA]  2 CI GitHub + gitleaks          → nenhum CI para 9eb0005
[FALHA]  3 health público                → sem resposta
[FALHA]  4 E2E contra URL pública        → pulado (--rapido)
[FALHA]  5 rate limit (S6)               → sem teste unitário citando S6
[FALHA]  6 README completo               → faltam seções: Demo, Stack, Estrutura, Variáveis de ambiente, O que é demonstração
[FALHA]  7 DECISOES.md (7 + revisor)     → falta DECISOES.md
[FALHA]  8 backup + restauração          → sem backup das últimas 26h
[FALHA]  9 exclusão de dados (LGPD)      → sem E2E de exclusão (LGPD)
[FALHA] 10 roteiro do vídeo (revisor)    → falta docs/ROTEIRO_VIDEO.md
[FALHA] 11 apresentação (revisor)        → README sem link do documento de apresentação
[FALHA] 12 tag ≥ v1.0.0 + CHANGELOG      → main sem tag
PRONTO: 1/12
```

## Aprovações
| Categoria | Status |
|---|---|
| DNS `vida` no Cloudflare | **aprovado** pelo responsável em 2026-10-22 |
| Site `vida` no Nginx + certificado | **aprovado** pelo responsável em 2026-10-22 |
| Stack `vida` no Portainer | **aprovado** pelo responsável em 2026-10-22 |
| Exceção à R7 para exclusão de dados (LGPD) | **aprovado** pelo responsável em 2026-10-22 (D19) |

| Repositório público na entrega (D20) | **aprovado** em 2026-10-22: último passo, após varredura de segredos no histórico |
| Ajuste do item 11 do check (D21) | **aprovado** em 2026-10-22 |

Escopo das aprovações: valem só para os recursos do VIDA (registro `vida.fontesmidias.com.br`, site `vida` no Nginx, stack `vida`). Os guardrails do "Nunca" continuam valendo: nada de outro site, stack, DNS ou container; nada de firewall ou Nginx global; `nginx -t` antes de todo reload.

## Ordem planejada
Itens 8 (backup) e 9 (exclusão LGPD) antes do 7 (DECISOES): as respostas 3 e 4 descrevem esses recursos, e escrevê-las antes forçaria reescrever e revisar de novo (regra: dependências antes).

## Histórico
| Volta | Item | Mudança | Commit | Placar depois |
|---|---|---|---|---|
| 14 | revisão de entrega (pedido da pessoa responsável) | Conta única `avaliador` com senha só no ambiente (D29); fluxo guiado com "Próximo passo" e telas do fluxo em 360×640 sem rolar (D30); selo "Demonstração"; README no formato do desafio; DECISOES (−43%) e roteiro mais curtos. Unit 160/160, E2E 20/20 local. Pendente: vereditos, merge, CI, deploy (DEMO_PASSWORD na stack), tag v1.2.0; decisão sobre repositório público (D25) | c1423ac, 752d3bf, 2b76ab4 | ver check final |
| 13 | CI vermelho na v1.1.0 | Teste da R8 com navegações colidindo (Sair + abrir Entrada). O portão do deploy recusou; a tag v1.1.0 foi publicada por erro de encadeamento (`deploy | tail && tag` esconde a falha) e não foi movida. Teste corrigido; v1.1.1 | (tag v1.1.1) | ver check final |
| 12 | contas de demonstração (pedido da pessoa responsável) | D26–D28, R8, S8: três contas com senha visível, continuar ou começar do zero sem apagar (ciclos + `journey_resets`), contas e2e para os testes, `reset-demo.sh`. Revisores: roteiro aprovado na 1ª; DECISOES aprovado na 3ª (faixas de IDs, criptografia em repouso no ROADMAP); apresentação aprovada na 3ª (faixas, exceção da senha D28). Versão 1.1.0 | (tag v1.1.0) | CI vermelho, não publicada |
| 11 | regressão 9/12 (cont.) | Mesmo com espera maior, falhas em massa só com vários navegadores em paralelo; máquina com 2,6 GB livres. `workers: 1` local (CI segue paralelo); versão 1.0.3 | (tag v1.0.3) | ver check final |
| 10 | regressão 9/12 | Check sobre v1.0.1 caiu: banco local desligado (Docker Desktop reiniciou) e E2E público estourando 5 s por verificação no WebKit (a API respondia; a navegação pela internet demorava). Espera de 15 s só contra a demo pública, mesmas verificações; versão 1.0.2 | (tag v1.0.2) | 9/12 |
| 9 | pós-loop | `docs/CONFORMIDADE.md` (matriz do desafio) e D25 (repositório privado, substitui D20); versão 1.0.1 | (tag v1.0.1) | 9/12 |
| 8 | 12 tag + CHANGELOG | Versão 1.0.0: CHANGELOG fechado, `package.json` 1.0.0, tag anotada `v1.0.0` | (tag v1.0.0) | ver check final |
| 7 | 7, 10, 11 (documentos) | DECISOES.md (3 rodadas), roteiro (1), apresentação (3); E2E novo de isolamento entre pessoas (S2); limite de sessão 20/min para o E2E completo caber | — | 11/12 |
| 6 | 9 exclusão LGPD (D19) | `DELETE /api/me` em transação, só userId da sessão; confirmação em painel; E2E nos 2 navegadores (também contra a demo pública). Achados corrigidos: camadas fixed presas à tela animada (portal + `backwards`; E2E mede cobertura da janela) e cliente tratando 204 como erro. Atenção: E2E público já cria 8 de 10 sessões/min permitidas | 2d2bbc7 | 8/12 |
| 5 | 8 backup + restauração | `vida-backup` diário (03:15 UTC, cron próprio em /etc/cron.d, retenção 14 d, gunzip -t), backups só do root, pré-deploy com umask 077; restauração provada em banco temporário (8 estados); `docs/OPERACAO.md` | 275ad96 | 7/12 |
| 4 | 6 README | README de entrega: demo + roteiro, o que é demonstração, stack, estrutura, variáveis, banco, testes, deploy, uso de IA (rascunho a confirmar pelo responsável). Também: removida referência externa do documento do loop; gancho local de pre-push | 1deab58 | 6/12 |
| 3 | 5 rate limit (S6) | Limitador em memória por IP (X-Real-IP do Nginx): sessão demo 10/min, escritas 30/min, 429 com Retry-After. Deploy 5efc847 com backup pré-deploy. 40 POST públicos → 6×201, 34×429 | 5efc847 | 5/12 |
| 2 | 3 health público (+4 E2E público) | Dockerfile, `/api/health/ready`, stack no Portainer, `scripts/deploy.sh` (portão de CI, build na VPS, D24), DNS CNAME com proxy depois do certificado, site Nginx só para IPs do Cloudflare (D22/D23). Acesso direto ao IP → 403. Achados: `mockReset` do Vitest 5 quebra mock assíncrono; máquina local com pouca RAM derruba o Docker (usar `--workers=1`) | 2c3d3ab | 4/12 |
| 1 | 2 CI + gitleaks | Workflow `Verificar`: lint, tipos, unit, E2E (Chrome e Safari) com Postgres de serviço, gitleaks no histórico inteiro (binário oficial, sem licença). Verde na 1ª execução | 52eb1bd | 2/12 |

## Bloqueios abertos
Nenhum que trave o loop.

## Pendências para o responsável (não bloqueiam)
- **Acesso dos avaliadores (D25):** a pessoa responsável decidiu não reescrever o histórico; o repositório fica privado. Falta convidar os avaliadores (usuário GitHub deles) ou enviar um `.zip`.
- **Rate limit na borda (Nginx):** exige declarar zonas `limit_req_zone` num arquivo em `/etc/nginx/conf.d/` (escopo global do Nginx da VPS). Não afeta os outros sites (zonas com prefixo `vida_` usadas só no site `vida`), mas o guardrail pede aprovação. Hoje: proxy do Cloudflare + limite na aplicação.

## Resolvidos
- **SSL do Cloudflare (D23), 2026-10-22:** regra `vida - SSL full strict (D23)` criada pela API (token com Config Rules: Edit e Zone Settings: Read), no mesmo ruleset da regra existente "Stape", que não foi alterada. A zona continua em Flexible. O item 3 do check prova o HTTPS de ponta a ponta quando o DNS existir.

## Vereditos do revisor
| Documento | Rodada | Veredito | Observação |
|---|---|---|---|
| `docs/ROTEIRO_VIDEO.md` | 1 | APROVADO | 8 blocos somam 5:00; tudo citado existe no repo |
| `DECISOES.md` | 1 | REPROVADO | A5: itens "fora" atribuídos ao ROADMAP sem estar lá; pgvector descrito como habilitado. A6: "o responsável", "usuários reais". Corrigido em 3a15779 (também README e apresentação) |
| `DECISOES.md` | 2 | REPROVADO | A5: afirmava que o healthcheck reinicia o app (no Docker standalone só marca `unhealthy`). Corrigido também em `docs/OPERACAO.md`; autoheal no ROADMAP |
| `DECISOES.md` | 3 | APROVADO | A1–A7, inclusive o comportamento real do Docker |
| `docs/apresentacao.html` | 1 | REPROVADO | B3: mesmo erro do healthcheck; B4: rolagem lateral de 20 px no Pixel 7 (forma decorativa) |
| `docs/apresentacao.html` | 2 | REPROVADO | B3: "streaks" atribuído ao ROADMAP (a fonte é D8/R6); integrações sem marcar como plano |
| `docs/apresentacao.html` | 3 | APROVADO | B1–B5; sem rolagem lateral em 6 casos. Observação acatada: o E2E do fluxo principal passou a cobrir o "Começar" |
