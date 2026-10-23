# Registro de decisões

Decisão consolidada só muda com nova entrada aqui. Formato: data · decisão · motivo · status.

| # | Data | Decisão | Motivo | Status |
|---|---|---|---|---|
| D1 | 2026-10-21 | Next.js monolítico em camadas, em vez de front e back separados | Menos infraestrutura; services independentes de `next/*` permitem separar depois | Ativa |
| D2 | 2026-10-21 | Postgres próprio em Docker na VPS + Prisma, em vez de Supabase/Vercel | Controle, sem dependência de fornecedor, execução local idêntica à produção | Ativa |
| D3 | 2026-10-21 | Usuário demo anônimo com sessão em cookie criptografado | Avaliadores isolados entre si sem atrito de cadastro | Substituída por D26 |
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
| D15 | 2026-10-22 | Sem emojis: cada estado tem ícone próprio em SVG (expressão desenhada sobre forma orgânica na cor da família) | Emoji muda de aparência conforme o aparelho; com ícone próprio sabemos exatamente o que a pessoa vê. A coluna `emoji` sai do banco em nova migration | Ativa |
| D16 | 2026-10-22 | CVV acessível por botão "Apoio" discreto, no lugar do rodapé fixo "Em sofrimento intenso…" (altera C1) | A frase fixa causava desconforto mesmo em quem está bem; o apoio continua a um toque em todas as telas | Ativa |
| D17 | 2026-10-22 | Práticas guiadas e interativas (respiração, mão no peito, uma coisa pequena, três coisas boas), um passo por vez | Conduzir a pessoa para fora da tela, para o próprio corpo e ambiente; menos texto, mais intuitivo para todas as idades | Ativa |
| D18 | 2026-10-22 | VIDA significa Ver · Inspirar · Desacelerar · Avançar, uma letra por etapa do app | O nome passa a explicar o fluxo; a sigla completa aparece na Entrada e cada letra aparece na tela da sua etapa, sem repetir o tempo todo | Ativa |
| D19 | 2026-10-22 | Exclusão dos próprios dados pelo titular, a pedido dele, como única exceção ao append-only (R7) | Direito do titular na LGPD; a aplicação continua sem alterar nem apagar registros por conta própria. Implementação no loop "pronto" (item 9) | Ativa |
| D20 | 2026-10-22 | Repositório passa a público na entrega, como último passo do loop, depois de varredura de segredos no histórico inteiro | Avaliadores abrem sem convite; não há segredos versionados (gitleaks) e `doc/` nunca foi versionada | Substituída por D25 |
| D21 | 2026-10-22 | Documento de apresentação só no repositório (`docs/apresentacao.html`), sem publicação no claude.ai; item 11 do check ajustado com aprovação do responsável | Acesso dos avaliadores sem depender de compartilhamento externo | Ativa |
| D22 | 2026-10-22 | Confirma D12 para o VIDA: proxy laranja do Cloudflare, embora os outros subdomínios da VPS sejam dns-only. A restrição "só IPs do Cloudflare" vale apenas no site `vida` do Nginx (não no firewall, que afetaria os outros sites). Requer SSL/TLS da zona em Full ou Full (strict) | Proteção DDoS e IP da origem oculto sem mudar nada dos outros serviços da VPS | Ativa |
| D23 | 2026-10-22 | SSL Full (strict) **só** para `vida.fontesmidias.com.br`, via Configuration Rule do Cloudflare; a zona continua em Flexible | A zona está em Flexible (HTTP sem criptografia entre Cloudflare e origem), inaceitável para dado sensível; mudar a zona inteira poderia derrubar o subdomínio `hostinger` (proxy para outro servidor). Complementa D22 | Ativa |
| D24 | 2026-10-22 | Imagem construída na própria VPS a partir do `git archive` do commit da main (scripts/deploy.sh), em vez de publicar no GHCR | Os outros projetos usam GHCR com pacote público; aqui isso exporia o código antes da entrega (D20) e exigiria mudar permissões do GitHub. O CI continua sendo o portão: o script recusa commit sem CI verde | Ativa |
| D25 | 2026-10-22 | Repositório continua privado; avaliadores recebem acesso por convite (ou `.zip`). Substitui D20 | O histórico antigo contém uma referência que não deve ser pública, e a pessoa responsável decidiu não reescrever o histórico (force push) | Ativa |
| D26 | 2026-10-23 | Três contas de demonstração com usuário e senha visíveis (`avaliador1`–`avaliador3`), no lugar do visitante anônimo; três contas extras só para os testes automáticos | Avaliadores podem sair e voltar à mesma jornada e testar ao mesmo tempo sem um interferir no outro; os testes nunca mexem nas contas dos avaliadores. Substitui D3 | Ativa |
| D27 | 2026-10-23 | "Começar do zero" abre um novo ciclo da jornada (R8): nada é apagado; o pedido fica em `journey_resets` e cada check-in e conclusão guarda o ciclo | Registro preservado e auditável, sem confundir com a exclusão a pedido do titular (D19). Em conta de demonstração compartilhada, D19 apaga os registros mas mantém a conta | Ativa |
| D28 | 2026-10-23 | Exceção a U1 (zero digitação): a senha da conta de demonstração é digitada; a conta é escolhida por toque | Autenticação real com o mínimo de digitação; a senha curta aparece na própria Entrada | Ativa |
