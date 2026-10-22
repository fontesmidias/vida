import { describe, expect, it } from "vitest";
import { checkinBodySchema } from "@/src/validation/checkins";

describe("entrada do check-in (S5, S2, D4)", () => {
  it("aceita estado e fuso", () => {
    expect(checkinBodySchema.parse({ moodSlug: "ansioso", timezone: "America/Sao_Paulo" })).toEqual({
      moodSlug: "ansioso",
      timezone: "America/Sao_Paulo",
    });
  });

  it("fuso é opcional", () => {
    expect(checkinBodySchema.safeParse({ moodSlug: "ansioso" }).success).toBe(true);
  });

  it("recusa userId no corpo (S2)", () => {
    expect(checkinBodySchema.safeParse({ moodSlug: "ansioso", userId: "outra-pessoa" }).success).toBe(false);
  });

  it("recusa texto livre (D4)", () => {
    expect(checkinBodySchema.safeParse({ moodSlug: "ansioso", note: "hoje..." }).success).toBe(false);
  });

  it.each([{}, { moodSlug: "" }, { moodSlug: 1 }, { moodSlug: "a".repeat(51) }, { moodSlug: "ansioso", timezone: "x".repeat(101) }])(
    "recusa %j",
    (body) => {
      expect(checkinBodySchema.safeParse(body).success).toBe(false);
    },
  );
});
