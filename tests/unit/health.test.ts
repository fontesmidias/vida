import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health (S7)", () => {
  it("responde apenas {status:'ok'}, sem dados internos", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("não é cacheado", async () => {
    const res = await GET();
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
});
