import { describe, expect, it } from "vitest";
import { loginBodySchema } from "@/src/validation/accounts";

describe("entrada do login (S5, S8)", () => {
  it("aceita usuário e senha", () => {
    expect(loginBodySchema.parse({ username: "avaliador", password: "vida2026" })).toEqual({ username: "avaliador", password: "vida2026" });
  });
  it.each([{}, { username: "avaliador" }, { username: "", password: "x" }, { username: "a", password: "x".repeat(101) }, { username: "a", password: "b", userId: "x" }])(
    "recusa %j",
    (body) => expect(loginBodySchema.safeParse(body).success).toBe(false),
  );
});
