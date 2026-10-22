import { describe, expect, it } from "vitest";
import { parseEnv } from "@/src/lib/env";

const valido = { DATABASE_URL: "postgresql://x", SESSION_SECRET: "a".repeat(32) };

describe("configuração (S4)", () => {
  it("aceita SESSION_SECRET com 32 caracteres ou mais", () => {
    expect(parseEnv(valido).SESSION_SECRET).toHaveLength(32);
  });

  it("recusa SESSION_SECRET curto, sem expor o valor", () => {
    const fn = () => parseEnv({ ...valido, SESSION_SECRET: "segredo-curto" });
    expect(fn).toThrow(/SESSION_SECRET/);
    expect(fn).not.toThrow(/segredo-curto/);
  });

  it("recusa DATABASE_URL ausente", () => {
    expect(() => parseEnv({ SESSION_SECRET: "a".repeat(32) })).toThrow(/DATABASE_URL/);
  });
});
