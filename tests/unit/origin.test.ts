import { describe, expect, it } from "vitest";
import { isSameOrigin } from "@/src/lib/http";

const req = (headers: Record<string, string>) => new Request("http://localhost:3000/api/x", { method: "POST", headers });

describe("verificação de Origin em escrita (CSRF, S1)", () => {
  it("aceita Origin igual ao host", () => {
    expect(isSameOrigin(req({ origin: "http://localhost:3000", host: "localhost:3000" }))).toBe(true);
  });

  it("recusa Origin de outro site", () => {
    expect(isSameOrigin(req({ origin: "https://malicioso.example", host: "localhost:3000" }))).toBe(false);
  });

  it("considera o host repassado pelo proxy", () => {
    expect(isSameOrigin(req({ origin: "https://vida.example", host: "app:3000", "x-forwarded-host": "vida.example" }))).toBe(true);
  });

  it("recusa Origin malformado", () => {
    expect(isSameOrigin(req({ origin: "null", host: "localhost:3000" }))).toBe(false);
  });

  // Navegadores sempre enviam Origin em POST/DELETE; sem ele não há risco de CSRF (ex.: curl, healthcheck)
  it("aceita requisição sem Origin", () => {
    expect(isSameOrigin(req({ host: "localhost:3000" }))).toBe(true);
  });
});
