# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]
### Adicionado
- Scaffold Next.js 15 + TypeScript + Tailwind, com Vitest e Playwright (viewport mobile).
- `docker-compose.yml` com Postgres 16 + pgvector local e `.env.example`.
- README com setup, verificações e problemas comuns (porta do Postgres configurável via `POSTGRES_PORT`).
- Esquema Prisma com as 7 tabelas da arquitetura e migration inicial; relações com `Restrict` (sem apagar em cascata, R7).
- Seed idempotente com 8 estados (D11), conteúdos por família + neutro (R3) e 2 planos de demonstração (C2), com testes de tom (C1).
- `GET /api/health` público e mínimo (S7); layout `pt-BR` com aviso de cuidado (C3) e rodapé CVV (C1).

## [0.1.0] - 2026-10-21
### Adicionado
- Specs iniciais: PRD, regras com IDs, arquitetura, segurança, stack justificada, registro de decisões.
- Roadmap de ideias fora do escopo.
- Instruções para agentes de código (CLAUDE.md).
