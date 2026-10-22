# Roadmap

Ideias fora do escopo desta entrega. Nenhuma ideia é descartada: ela entra aqui com o motivo de ter ficado para depois.

| Ideia | Origem | Por que depois |
|---|---|---|
| Estado emocional personalizado (texto livre) | Discussão de R1 | Texto livre é dado sensível sem estrutura (LGPD) e não tem conteúdo associado; exige moderação |
| Modo guiado (dias sequenciais bloqueados) como opção do plano | Discussão de R5 | Gera atrito; só faz sentido para planos cuja didática dependa de ordem |
| Regras de WAF personalizadas e bot management no Cloudflare | SECURITY.md | Proxy básico já ativo; regras finas exigem tráfego real para calibrar |
| Conta real (e-mail/magic link) e vínculo do usuário anônimo | S4 | Sem isso, apagar o cookie perde o acesso ao histórico |
| Exportação e exclusão de dados pelo titular | R7 / LGPD | Direitos do titular em produção |
| Consentimento LGPD específico para dado sensível | SECURITY.md | Obrigatório com usuários reais |
| Chat com IA e RAG com pgvector | Pergunta 6 do desafio | Fora do escopo obrigatório; exige guardrails e aviso de não aconselhamento |
| Assinatura via Kiwify (webhooks + controle de acesso) | Pergunta 6 do desafio | Fora do escopo obrigatório |
| Notificações/lembretes de check-in | Produto | Fora do escopo obrigatório |
| Painel administrativo de conteúdos e planos | Produto | Fora do escopo obrigatório; hoje o conteúdo vem do seed |
| Música ambiente (lofi/calma) com ícone discreto | Teste do protótipo | Fora do escopo do desafio. Requisitos: **desligada por padrão e nunca uma surpresa**; só toca quando a pessoa escolher tocar no ícone; começa em volume baixo; controle de volume, pausa e escolha de faixa sempre visíveis; lembrar a preferência; só faixas com licença livre (CC0 ou royalty-free) com atribuição exibida |
| Usuário do banco só com as permissões do app, separado do dono que roda as migrations | SECURITY.md (camada de dados) | O banco já fica isolado na rede interna da stack; separar papéis exige script de inicialização do Postgres e testes de permissão |
| Cópia externa dos backups (outro provedor ou bucket S3) | docs/OPERACAO.md | Hoje o backup diário fica na própria VPS; protege contra erro e corrupção, não contra perda da máquina |
| Observabilidade (Sentry, métricas, alertas de uptime) | Pergunta 4 do desafio | Entrega usa logs + healthcheck; ferramentas dedicadas depois |
