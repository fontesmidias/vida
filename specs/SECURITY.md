# Segurança

Camadas independentes (S1). Cada linha cita a ameaça que cobre (OWASP Top 10 quando aplicável).

## 0. Borda externa — Cloudflare (proxy ativo no subdomínio)
| Controle | Ameaça |
|---|---|
| Rede anycast absorve tráfego antes da VPS | DDoS volumétrico |
| Firewall da VPS aceita 80/443 **apenas** dos IPs do Cloudflare | Ataque direto ao IP de origem |
| SSL "Full (strict)": HTTPS também entre Cloudflare e Nginx | Interceptação no trecho de origem |

## 1. Borda — Nginx
| Controle | Ameaça |
|---|---|
| `set_real_ip_from` (faixas do Cloudflare) + `real_ip_header CF-Connecting-IP` | Sem isso, o rate limit veria todos como o mesmo IP |
| Apenas HTTPS (TLS via Certbot) + HSTS | Interceptação |
| `limit_req` por IP (geral e mais restrito em `POST`), `limit_conn` | Força bruta, abuso, DDoS de baixa escala |
| `client_max_body_size` pequeno, timeouts curtos | Payloads gigantes, slowloris |
| `/api/health/ready` bloqueado externamente (`deny all`) | Reconhecimento de infraestrutura |
| Cabeçalhos: CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy | XSS, clickjacking |

Ataques volumétricos são absorvidos pela camada 0; o Nginx cuida do abuso que passa por ela.

## 2. Aplicação — Next.js
| Controle | Ameaça |
|---|---|
| Sessão obrigatória em `/api/*` exceto health; `userId` só da sessão (S2) | Broken Access Control (A01) |
| Rate limit por IP/sessão em memória (`rate-limiter-flexible`), especialmente `POST /api/session/demo` | Criação massiva de usuários, abuso |
| Validação Zod em toda entrada (S5) | Injeção, dados malformados (A03) |
| Verificação do cabeçalho `Origin` em métodos de escrita + `sameSite=lax` | CSRF |
| Erros genéricos ao cliente, detalhe só em log | Vazamento de informação |
| React escapa saída por padrão; sem `dangerouslySetInnerHTML` | XSS |

## 3. Dados — Postgres
| Controle | Ameaça |
|---|---|
| Prisma usa consultas parametrizadas | SQL injection (A03) |
| Banco sem porta pública (apenas rede interna do Docker) | Acesso direto ao banco |
| Usuário da aplicação sem superusuário | Escalada de privilégio |
| Backup diário + `pg_dump` antes de migrar | Perda de dados |

## 4. Infraestrutura e cadeia de suprimentos
| Controle | Ameaça |
|---|---|
| Container roda como usuário não-root, `no-new-privileges` | Escape de container |
| Firewall da VPS: apenas 22, 80, 443 | Superfície exposta |
| Dependabot + `npm audit` no CI; gitleaks contra segredos | Dependências vulneráveis (A06), vazamento de chave |

## Sessão: onde fica o cookie (S4)
O cookie fica **no navegador do usuário** e é enviado automaticamente a cada requisição ao nosso domínio. Ele é criptografado e assinado com `SESSION_SECRET` (que só o servidor conhece): o navegador não consegue ler nem forjar o conteúdo, e `httpOnly` impede que JavaScript o acesse. Ele guarda **apenas o `userId`** — os dados emocionais ficam no Postgres. Se o cookie for apagado, o usuário anônimo perde o acesso ao histórico (por isso, vincular a uma conta real está no ROADMAP).

## Produção com usuários reais (LGPD)
Dado emocional é **dado pessoal sensível** (saúde, art. 11 da LGPD). Para produção: consentimento específico e destacado, autenticação real, criptografia em repouso, minimização (já aplicada: sem texto livre), direito de acesso/exclusão, política de retenção, registro de acesso e DPO. Detalhado em `DECISOES.md`.
