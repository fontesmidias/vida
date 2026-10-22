# Roadmap

Ideias fora do escopo desta entrega. Nenhuma ideia é descartada: ela entra aqui com o motivo de ter ficado para depois.

| Ideia | Origem | Por que depois |
|---|---|---|
| Estado emocional personalizado (texto livre) | Discussão de R1 | Texto livre é dado sensível sem estrutura (LGPD) e não tem conteúdo associado; exige moderação |
| Modo guiado (dias sequenciais bloqueados) como opção do plano | Discussão de R5 | Gera atrito; só faz sentido para planos cuja didática dependa de ordem |
| Regras de WAF personalizadas e bot management no Cloudflare | SECURITY.md | Proxy básico já ativo; regras finas exigem tráfego real para calibrar |
| Conta real (e-mail/magic link) e vínculo do usuário anônimo | S4 | Sem isso, apagar o cookie perde o acesso ao histórico |
| Exportação dos dados pelo titular (portabilidade) | R7 / LGPD | A exclusão já existe (D19); exportar exige definir formato e autenticação forte |
| Consentimento LGPD específico para dado sensível | SECURITY.md | Obrigatório com usuários reais |
| Chat com IA e RAG com pgvector | Pergunta 6 do desafio | Fora do escopo obrigatório; exige guardrails e aviso de não aconselhamento |
| Assinatura via Kiwify (webhooks + controle de acesso) | Pergunta 6 do desafio | Fora do escopo obrigatório |
| Notificações/lembretes de check-in | Produto | Fora do escopo obrigatório |
| Painel administrativo de conteúdos e planos | Produto | Fora do escopo obrigatório; hoje o conteúdo vem do seed |
| Música ambiente (lofi/calma) com ícone discreto | Teste do protótipo | Fora do escopo do desafio. Requisitos: **desligada por padrão e nunca uma surpresa**; só toca quando a pessoa escolher tocar no ícone; começa em volume baixo; controle de volume, pausa e escolha de faixa sempre visíveis; lembrar a preferência; só faixas com licença livre (CC0 ou royalty-free) com atribuição exibida |
| Usuário do banco só com as permissões do app, separado do dono que roda as migrations | SECURITY.md (camada de dados) | O banco já fica isolado na rede interna da stack; separar papéis exige script de inicialização do Postgres e testes de permissão |
| Cópia externa dos backups (outro provedor ou bucket S3) | docs/OPERACAO.md | Hoje o backup diário fica na própria VPS; protege contra erro e corrupção, não contra perda da máquina |
| App nativo (iOS/Android) | Fora do escopo do desafio | A API REST já pode ser consumida por um app; o web app mobile-first atende a demonstração |
| Rate limit também no Nginx (`limit_req`/`limit_conn`) | specs/SECURITY.md | Exige declarar zonas em arquivo de escopo global do Nginx da VPS compartilhada; hoje: Cloudflare na borda + limite na aplicação |
| Reinício automático quando o healthcheck falha (autoheal ou orquestrador) | docs/OPERACAO.md | No Docker standalone o healthcheck só marca `unhealthy`; hoje o restart cobre a queda do processo e o resto é manual |
| Observabilidade (Sentry, métricas, alertas de uptime) | Pergunta 4 do desafio | Entrega usa logs + healthcheck; ferramentas dedicadas depois |
