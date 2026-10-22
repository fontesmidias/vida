import { describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();
vi.mock("@/src/lib/prisma", () => ({ prisma: { $queryRaw: queryRaw } }));

const { GET } = await import("@/app/api/health/ready/route");

describe("GET /api/health/ready (S7: só rede interna, verifica o banco)", () => {


  it("200 quando o banco responde", async () => {
    queryRaw.mockImplementation(() => Promise.resolve([{ "?column?": 1 }]));
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("503 sem detalhes internos quando o banco falha", async () => {
    queryRaw.mockImplementation(() => Promise.reject(new Error("connection refused at 10.0.0.5")));
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.text()).not.toMatch(/10\.0\.0\.5|refused/);
  });
});
