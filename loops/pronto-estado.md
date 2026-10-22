# Estado do loop "pronto"

- **Volta atual:** 3 concluída
- **Placar:** `PRONTO: 5/12` (check completo, 2026-10-22 02:19, commit 5efc847)
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

## Histórico
| Volta | Item | Mudança | Commit | Placar depois |
|---|---|---|---|---|
| 3 | 5 rate limit (S6) | Limitador em memória por IP (X-Real-IP do Nginx): sessão demo 10/min, escritas 30/min, 429 com Retry-After. Deploy 5efc847 com backup pré-deploy. 40 POST públicos → 6×201, 34×429 | 5efc847 | 5/12 |
| 2 | 3 health público (+4 E2E público) | Dockerfile, `/api/health/ready`, stack no Portainer, `scripts/deploy.sh` (portão de CI, build na VPS, D24), DNS CNAME com proxy depois do certificado, site Nginx só para IPs do Cloudflare (D22/D23). Acesso direto ao IP → 403. Achados: `mockReset` do Vitest 5 quebra mock assíncrono; máquina local com pouca RAM derruba o Docker (usar `--workers=1`) | 2c3d3ab | 4/12 |
| 1 | 2 CI + gitleaks | Workflow `Verificar`: lint, tipos, unit, E2E (Chrome e Safari) com Postgres de serviço, gitleaks no histórico inteiro (binário oficial, sem licença). Verde na 1ª execução | 52eb1bd | 2/12 |

## Bloqueios abertos
Nenhum que trave o loop.

## Pendências para o responsável (não bloqueiam)
- **Antes do repositório público (D20): limpar o histórico.** O commit bae15d0 (já enviado, repo privado) continha referência ao autor das referências de método, que não deve ser pública. Arquivos já corrigidos e gancho local de pre-push instalado. Falta reescrever o histórico (`git filter-repo --replace-text`) e fazer force push, o que só acontece com autorização explícita do responsável, como parte do passo D20.
- **Rate limit na borda (Nginx):** exige declarar zonas `limit_req_zone` num arquivo em `/etc/nginx/conf.d/` (escopo global do Nginx da VPS). Não afeta os outros sites (zonas com prefixo `vida_` usadas só no site `vida`), mas o guardrail pede aprovação. Hoje: proxy do Cloudflare + limite na aplicação.

## Resolvidos
- **SSL do Cloudflare (D23), 2026-10-22:** regra `vida - SSL full strict (D23)` criada pela API (token com Config Rules: Edit e Zone Settings: Read), no mesmo ruleset da regra existente "Stape", que não foi alterada. A zona continua em Flexible. O item 3 do check prova o HTTPS de ponta a ponta quando o DNS existir.

## Vereditos do revisor
Nenhum ainda.
