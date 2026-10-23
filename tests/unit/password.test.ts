import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/src/lib/password";

describe("senha das contas de demonstração (S8)", () => {
  it("o hash não contém a senha e muda a cada geração (sal aleatório)", () => {
    const a = hashPassword("vida2026");
    const b = hashPassword("vida2026");
    expect(a).not.toContain("vida2026");
    expect(a).not.toBe(b);
    expect(a).toMatch(/^scrypt\$/);
  });

  it("confere a senha certa e recusa a errada", () => {
    const h = hashPassword("vida2026");
    expect(verifyPassword("vida2026", h)).toBe(true);
    expect(verifyPassword("vida2027", h)).toBe(false);
    expect(verifyPassword("", h)).toBe(false);
  });

  it.each([null, "", "texto-qualquer", "scrypt$x$y", "md5$abc$def"])("hash inválido %j nunca confere", (h) => {
    expect(verifyPassword("vida2026", h)).toBe(false);
  });
});
