# VIDA — instruções para agentes de código

Protótipo mobile-first de check-in emocional (avaliação técnica). Specs em `specs/`: leia PRD, RULES e ARCHITECTURE antes de mudar comportamento.

## Restrições obrigatórias
- Nunca commitar sem `npm run lint && npm run typecheck && npm test` verdes.
- Nunca alterar `specs/RULES.md` nem afrouxar testes existentes sem aprovação explícita do usuário.
- Nunca colocar segredos em código, logs ou commits. Variáveis novas entram em `.env.example`.
- Nunca versionar nada da pasta `doc/`.
- Nunca editar uma migration já aplicada; criar uma nova.
- `userId` sempre da sessão no servidor (S2). Services não importam `next/*`.
- Textos para o usuário: português, tom acolhedor, sem prometer diagnóstico/terapia/cura (C1).

## Fluxo
1. Ler a spec relevante → 2. escrever/ajustar teste citando a regra (ex.: `R4`) → 3. ver falhar → 4. implementar o mínimo → 5. refatorar com testes verdes.
Uma mudança por vez; commits pequenos no padrão Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`), em branches `feat/*`, `fix/*`, `chore/*`.

## Comandos
- `docker compose up -d db` — Postgres local
- `npm run dev` — app em http://localhost:3000
- `npx prisma migrate dev --name <nome>` — nova migration
- `npm test` / `npm run test:e2e`
