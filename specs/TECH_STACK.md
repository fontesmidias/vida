# Tecnologias escolhidas e justificativas

| Tecnologia | Papel | Por quê | Alternativa considerada |
|---|---|---|---|
| **Next.js (App Router)** | Telas e API no mesmo projeto | Uma linguagem, um deploy, um container. API REST em `/api` pode ser consumida por app nativo no futuro | Front e back separados: dobra infraestrutura, CORS e pipelines sem ganho nesta escala |
| **TypeScript** | Linguagem | Tipos pegam erros antes de rodar; o mesmo tipo vale para tela, API e banco | JavaScript puro |
| **Tailwind CSS** | Estilo | Mobile-first por padrão (classes `sm:`/`md:`), sem arquivos CSS espalhados | CSS Modules |
| **Zod** | Validação | Declara o formato esperado e rejeita o resto na fronteira da API; gera o tipo TypeScript a partir do esquema | Validação manual com `if` |
| **iron-session** | Sessão | Cookie criptografado sem precisar de tabela de sessões nem Redis | Auth.js (pesado para usuário anônimo), JWT manual (fácil de errar) |
| **Prisma** | ORM e migrations | Esquema legível, migrations versionadas em SQL, consultas parametrizadas e tipadas | Drizzle (mais novo), SQL puro |
| **Postgres 16 + pgvector** | Banco | Relacional maduro; a extensão pgvector permite busca vetorial (IA/RAG) no mesmo banco no futuro | Supabase (gerenciado), MongoDB (dados aqui são relacionais) |
| **Vitest** | Testes de unidade/integração | Rápido, compatível com TypeScript sem configuração | Jest |
| **Playwright** | Teste E2E | Roda o fluxo real num navegador, inclusive em viewport de celular | Cypress |
| **Docker Compose** | Empacotamento e execução | O mesmo arquivo roda local e na VPS: execução reproduzível | Instalar Node/Postgres direto na VPS |
| **Nginx (existente)** | Proxy reverso, HTTPS, rate limit | Já opera na VPS; evita uma peça nova | Caddy, Traefik |
| **GitHub Actions** | CI | Lint, typecheck, testes e gitleaks a cada push/PR | — |
