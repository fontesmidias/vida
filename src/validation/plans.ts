import { z } from "zod";

// S5: parâmetros de rota também são entrada externa
export const planSlugSchema = z.string().regex(/^[a-z0-9-]{1,60}$/);

export const dayParamsSchema = z.object({
  slug: planSlugSchema,
  day: z.coerce.number().int().min(1).max(365),
});
