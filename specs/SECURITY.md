# Segurança

Camadas independentes (S1). Cada linha cita a ameaça que cobre (OWASP Top 10 quando aplicável).

## 0. Borda externa — Cloudflare (proxy ativo no subdomínio)
| Controle | Ameaça |
|---|---|
| Rede anycast absorve tráfego antes da VPS | DDoS volumétrico |
| Firewall da VPS aceita 80/443 **apenas** dos IPs do Cloudflare | Ataque direto ao IP de origem |
| SSL "Full (strict)" só para o host `vida` (Configuration Rule, D23; a zona segue em Flexible por causa de outros serviços): HTTPS também entre Cloudflare e Nginx | Interceptação no trecho de origem |

## 1. Borda — Nginx
| Controle | Ameaça |
|---|---|
| `set_real_ip_from` (faixas do Cloudflare) + `real_ip_header CF-Connecting-IP` | Sem isso, o rate limit veria todos como o mesmo IP |
| Apenas HTTPS (TLS via Certbot) + HSTS | Interceptação |
| `limit_req` por IP (geral e mais restrito em `POST`), `limit_conn` (**pendente**: exige declarar zonas em `conf.d`, arquivo de escopo global do Nginx da VPS, que só muda com aprovação do responsável; hoje a borda conta com o proxy do Cloudflare e o limite na aplicação) | Força bruta, abuso, DDoS de baixa escala |
| `client_max_body_size` pequeno, timeouts curtos | Payloads gigantes, slowloris |
| `/api/health/ready` bloqueado externamente (`deny all`) | Reconhecimento de infraestrutura |
| Cabeçalhos: CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy | XSS, clickjacking |

Ataques volumétricos são absorvidos pela camada 0; o Nginx cuida do abuso que passa por ela.

## 2. Aplicação — Next.js
| Controle | Ameaça |
|---|---|
| Sessão obrigatória em `/api/*` exceto health; `userId` só da sessão (S2) | Broken Access Control (A01) |
| Rate limit por IP em memória (`src/lib/rate-limit.ts`, janela fixa de 1 min): `POST /api/session/demo` 10/min (o mais restrito), escritas (check-in, concluir dia) 30/min; excedente → 429 com `Retry-After`. IP vem do `X-Real-IP` posto pelo Nginx a partir do Cloudflare (confiável: o app só aceita conexões de 127.0.0.1). Em memória basta porque há um único processo do app | Criação massiva de usuários, abuso |
| Validação Zod em toda entrada (S5) | Injeção, dados malformados (A03) |
| Verificação do cabeçalho `Origin` em métodos de escrita + `sameSite=lax` | CSRF |
| Erros genéricos ao cliente, detalhe só em log | Vazamento de informação |
| React escapa saída por padrão; sem `dangerouslySetInnerHTML` | XSS |

## 3. Dados — Postgres
| Controle | Ameaça |
|---|---|
| Prisma usa consultas parametrizadas | SQL injection (A03) |
| Banco sem porta pública (apenas rede interna do Docker) | Acesso direto ao banco |
| Usuário da aplicação sem superusuário (**pendente**: hoje o app usa o usuário dono do banco criado pela imagem do Postgres; ver ROADMAP) | Escalada de privilégio |
| Backup diário + `pg_dump` antes de migrar | Perda de dados |

## 4. Infraestrutura e cadeia de suprimentos
| Controle | Ameaça |
|---|---|
| Container roda como usuário não-root, `no-new-privileges` | Escape de container |
| Firewall da VPS: apenas 22, 80, 443 | Superfície exposta |
| Dependabot + `npm audit` no CI; gitleaks contra segredos | Dependências vulneráveis (A06), vazamento de chave |

## Credenciais de deploy (S3)
Tokens de Portainer e Cloudflare e a chave SSH ficam em `.env.deploy` (fora do Git e fora do processo do app), com menor privilégio: token Cloudflare só com `DNS:Edit` na zona do domínio; chave SSH dedicada (`vida_deploy`), referenciada por caminho, nunca colada.

## Cookie `secure` (S4)
Em produção o cookie de sessão é sempre `secure` (só trafega em HTTPS). A variável opcional `SESSION_COOKIE_SECURE=false` existe apenas para rodar o build de produção em `http://localhost` nos testes E2E (o Safari recusa cookie `secure` sem HTTPS). Nunca defini-la na VPS.

## Verificação de Origin (CSRF)
Em `POST`/`DELETE`, se o cabeçalho `Origin` vier, o host dele precisa ser o do próprio site (ou o `X-Forwarded-Host` repassado pelo Nginx); senão → 403. Requisição **sem** `Origin` é aceita: navegadores sempre o enviam em métodos de escrita, então a ausência indica cliente não-navegador (curl, healthcheck), que não carrega o cookie da vítima e não oferece risco de CSRF. Implementação: `src/lib/http.ts` (`isSameOrigin`).

## Sessão: onde fica o cookie (S4)
O cookie fica **no navegador do usuário** e é enviado automaticamente a cada requisição ao nosso domínio. Ele é criptografado e assinado com `SESSION_SECRET` (que só o servidor conhece): o navegador não consegue ler nem forjar o conteúdo, e `httpOnly` impede que JavaScript o acesse. Ele guarda **apenas o `userId`** — os dados emocionais ficam no Postgres. Se o cookie for apagado, o usuário anônimo perde o acesso ao histórico (por isso, vincular a uma conta real está no ROADMAP).

## Produção com usuários reais (LGPD)
Dado emocional é **dado pessoal sensível** (saúde, art. 11 da LGPD). Para produção: consentimento específico e destacado, autenticação real, criptografia em repouso, minimização (já aplicada: sem texto livre), direito de acesso/exclusão, política de retenção, registro de acesso e DPO. Detalhado em `DECISOES.md`.
