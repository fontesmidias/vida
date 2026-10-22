import { describe, expect, it } from "vitest";
import { clientKey, createRateLimiter, LIMITS } from "@/src/lib/rate-limit";

describe("limite por IP na aplicação (S6)", () => {
  it("permite até o limite dentro da janela e bloqueia o excedente", () => {
    const rl = createRateLimiter({ limit: 3, windowMs: 60_000 });
    const t = 1_000;
    expect([1, 2, 3].map(() => rl.hit("ip-a", t).allowed)).toEqual([true, true, true]);
    const r = rl.hit("ip-a", t + 10);
    expect(r.allowed).toBe(false);
    expect(r.retryAfterSeconds).toBe(60);
  });

  it("cada IP tem o próprio contador", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(rl.hit("ip-a", 0).allowed).toBe(true);
    expect(rl.hit("ip-b", 0).allowed).toBe(true);
    expect(rl.hit("ip-a", 0).allowed).toBe(false);
  });

  it("libera de novo quando a janela termina", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000 });
    rl.hit("ip-a", 0);
    expect(rl.hit("ip-a", 59_999).allowed).toBe(false);
    expect(rl.hit("ip-a", 60_000).allowed).toBe(true);
  });

  it("não cresce sem limite: janelas vencidas são descartadas", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 1_000 });
    for (let i = 0; i < 500; i++) rl.hit(`ip-${i}`, 0);
    rl.hit("novo", 5_000);
    expect(rl.size()).toBe(1);
  });

  it("criação de sessão demo é o limite mais restrito (S6)", () => {
    expect(LIMITS.session.limit).toBeLessThan(LIMITS.write.limit);
    // o E2E completo cria 12 sessões por execução: o limite não pode atrapalhar uso real nem testes
    expect(LIMITS.session.limit).toBeGreaterThanOrEqual(15);
  });
});

describe("chave do cliente", () => {
  const req = (h: Record<string, string>) => new Request("http://x/api", { headers: h });
  it("usa o X-Real-IP definido pelo Nginx", () => expect(clientKey(req({ "x-real-ip": "203.0.113.9" }))).toBe("203.0.113.9"));
  it("sem cabeçalho (local), cai numa chave única", () => expect(clientKey(req({}))).toBe("local"));
  it("ignora valor malformado", () => expect(clientKey(req({ "x-real-ip": "x".repeat(200) }))).toBe("local"));
});
