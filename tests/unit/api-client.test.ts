import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "@/src/ui/api";

afterEach(() => vi.unstubAllGlobals());

describe("cliente da API (U5)", () => {
  it("204 sem corpo é sucesso, não erro", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));
    await expect(api("/api/me", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("erro da API vira ApiError com a mensagem amigável do servidor", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "Escolha um dos estados da lista." }, { status: 400 })));
    await expect(api("/api/checkins")).rejects.toMatchObject({ status: 400, message: "Escolha um dos estados da lista." });
  });

  it("sem conexão vira ApiError 0 com convite a tentar de novo", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("Failed to fetch"))));
    const e = (await api("/api/today").catch((x: unknown) => x)) as ApiError;
    expect(e).toBeInstanceOf(ApiError);
    expect(e.status).toBe(0);
  });
});
