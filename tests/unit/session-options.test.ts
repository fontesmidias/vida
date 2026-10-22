import { describe, expect, it } from "vitest";
import { buildSessionOptions } from "@/src/lib/session-options";

const secret = "a".repeat(32);

describe("cookie de sessão (S4)", () => {
  it("é httpOnly e sameSite=lax", () => {
    const o = buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "development" });
    expect(o.cookieOptions).toMatchObject({ httpOnly: true, sameSite: "lax" });
  });

  it("é secure só em produção", () => {
    expect(buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "production" }).cookieOptions?.secure).toBe(true);
    expect(buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "development" }).cookieOptions?.secure).toBe(false);
  });

  it("usa o SESSION_SECRET como senha de criptografia", () => {
    expect(buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "test" }).password).toBe(secret);
  });
});
