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

  it("SESSION_COOKIE_SECURE=false desliga o secure só quando explícito (teste local em http)", () => {
    expect(buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "production", SESSION_COOKIE_SECURE: "false" }).cookieOptions?.secure).toBe(false);
    expect(buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "development", SESSION_COOKIE_SECURE: "true" }).cookieOptions?.secure).toBe(true);
  });

  it("usa o SESSION_SECRET como senha de criptografia", () => {
    expect(buildSessionOptions({ SESSION_SECRET: secret, NODE_ENV: "test" }).password).toBe(secret);
  });
});
