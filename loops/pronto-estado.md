# Estado do loop "pronto"

- **Volta atual:** 2 concluída
- **Placar:** `PRONTO: 4/12` (check completo, 2026-10-22 02:10, commit 2c3d3ab)
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
| 2 | 3 health público (+4 E2E público) | Dockerfile, `/api/health/ready`, stack no Portainer, `scripts/deploy.sh` (portão de CI, build na VPS, D24), DNS CNAME com proxy depois do certificado, site Nginx só para IPs do Cloudflare (D22/D23). Acesso direto ao IP → 403. Achados: `mockReset` do Vitest 5 quebra mock assíncrono; máquina local com pouca RAM derruba o Docker (usar `--workers=1`) | 2c3d3ab | 4/12 |
| 1 | 2 CI + gitleaks | Workflow `Verificar`: lint, tipos, unit, E2E (Chrome e Safari) com Postgres de serviço, gitleaks no histórico inteiro (binário oficial, sem licença). Verde na 1ª execução | 52eb1bd | 2/12 |

## Bloqueios abertos
Nenhum.

## Resolvidos
- **SSL do Cloudflare (D23), 2026-10-22:** regra `vida - SSL full strict (D23)` criada pela API (token com Config Rules: Edit e Zone Settings: Read), no mesmo ruleset da regra existente "Stape", que não foi alterada. A zona continua em Flexible. O item 3 do check prova o HTTPS de ponta a ponta quando o DNS existir.

## Vereditos do revisor
Nenhum ainda.
