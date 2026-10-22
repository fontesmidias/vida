// S6: limite por IP na aplicação, em memória (um único processo do app; ver SECURITY.md)
import { jsonError } from "./http";

type Window = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  return {
    hit(key: string, now = Date.now()) {
      // Descarta janelas vencidas para a memória não crescer com IPs que não voltam
      if (windows.size > 1_000 || !windows.has(key)) {
        for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
      }
      let w = windows.get(key);
      if (!w || w.resetAt <= now) {
        w = { count: 0, resetAt: now + windowMs };
        windows.set(key, w);
      }
      w.count += 1;
      return { allowed: w.count <= limit, retryAfterSeconds: Math.ceil((w.resetAt - now) / 1000) };
    },
    size: () => windows.size,
  };
}

// Sessão demo é o mais restrito (criação massiva de usuários); um E2E completo cria 4 sessões
export const LIMITS = {
  session: { limit: 10, windowMs: 60_000 },
  write: { limit: 30, windowMs: 60_000 },
} as const;

const limiters = {
  session: createRateLimiter(LIMITS.session),
  write: createRateLimiter(LIMITS.write),
};

const IP = /^[0-9a-fA-F:.]{2,45}$/;

// X-Real-IP é definido pelo Nginx a partir do Cloudflare; o app só aceita conexões do Nginx (127.0.0.1)
export function clientKey(request: Request): string {
  const ip = request.headers.get("x-real-ip")?.trim();
  return ip && IP.test(ip) ? ip : "local";
}

export function tooManyRequests(request: Request, bucket: keyof typeof limiters): Response | null {
  const r = limiters[bucket].hit(clientKey(request));
  if (r.allowed) return null;
  const res = jsonError(429, "Muitas tentativas em pouco tempo. Respire um pouco e tente de novo em instantes.");
  res.headers.set("retry-after", String(r.retryAfterSeconds));
  return res;
}
