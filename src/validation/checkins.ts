import { z } from "zod";

// S5: formato exato; strict recusa campos extras como userId (S2) ou texto livre (D4)
export const checkinBodySchema = z.strictObject({
  moodSlug: z.string().min(1).max(50),
  timezone: z.string().max(100).optional(),
});
