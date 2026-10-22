# Registro de decisões

Decisão consolidada só muda com nova entrada aqui. Formato: data · decisão · motivo · status.

| # | Data | Decisão | Motivo | Status |
|---|---|---|---|---|
| D1 | 2026-10-21 | Next.js monolítico em camadas, em vez de front e back separados | Menos infraestrutura; services independentes de `next/*` permitem separar depois | Ativa |
| D2 | 2026-10-21 | Postgres próprio em Docker na VPS + Prisma, em vez de Supabase/Vercel | Controle, sem dependência de fornecedor, execução local idêntica à produção | Ativa |
| D3 | 2026-10-21 | Usuário demo anônimo com sessão em cookie criptografado | Avaliadores isolados entre si sem atrito de cadastro | Ativa |
| D4 | 2026-10-21 | Check-in sem texto livre | Minimização de dado sensível (LGPD) | Ativa |
| D5 | 2026-10-21 | Instante registrado pelo servidor; "dia" calculado pelo fuso IANA do cliente (R1/R2) | Relógio do cliente não é confiável; servidor não sabe o dia local do usuário | Ativa |
| D6 | 2026-10-21 | Estados emocionais em tabela (`moods`) agrupados em famílias de conteúdo, não em enum | Adicionar estado sem migration nem deploy de código | Ativa |
| D7 | 2026-10-21 | Dias do plano em ordem livre com "próximo sugerido" (R5) | Bloqueio sequencial gera atrito sem ganho real neste produto | Ativa |
| D8 | 2026-10-21 | Progresso cumulativo, sem streaks (R6) | Evitar sensação de perda e evasão | Ativa |
| D9 | 2026-10-21 | Check-ins e conclusões append-only (R7) | Preservar histórico | Ativa |
| D10 | 2026-10-21 | Tag SemVer + CHANGELOG a cada versão (P2) | Rastreabilidade de entregas | Ativa |
| D11 | 2026-10-21 | Catálogo inicial: 8 estados em 4 famílias (agitado: ansioso, irritado · baixa energia: cansado, desanimado · pesado: triste, sobrecarregado · sereno: em paz, grato) | Cobre o exemplo do desafio e dá variedade sem multiplicar conteúdo | Ativa |
| D12 | 2026-10-21 | Cloudflare (proxy) na frente da VPS; origem aceita só IPs do Cloudflare | Proteção real contra DDoS volumétrico, sem custo | Ativa |
| D13 | 2026-10-21 | Prisma fixado na versão 6 (não 7) | A 7 é uma versão major recente com mudanças de configuração; a 6 é estável e suficiente. Atualizar exige nova entrada | Ativa |
| D14 | 2026-10-21 | Linguagem de gênero neutro em todo o projeto, sempre que possível (C4) | Acolher todas as pessoas que usam o app; definido pelo responsável do projeto | Ativa |
