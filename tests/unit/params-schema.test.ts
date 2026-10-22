import { describe, expect, it } from "vitest";
import { dayParamsSchema, planSlugSchema } from "@/src/validation/plans";

describe("parâmetros de rota (S5)", () => {
  it.each(["respirar-com-calma", "a1"])("aceita slug %s", (s) => expect(planSlugSchema.safeParse(s).success).toBe(true));
  it.each(["", "A", "../x", "a b", "x".repeat(61)])("recusa slug %j", (s) => expect(planSlugSchema.safeParse(s).success).toBe(false));
  it("converte o número do dia", () => expect(dayParamsSchema.parse({ slug: "a", day: "3" })).toEqual({ slug: "a", day: 3 }));
  it.each(["0", "-1", "1.5", "abc", "999"])("recusa dia %s", (day) => expect(dayParamsSchema.safeParse({ slug: "a", day }).success).toBe(false));
});
