import { z } from "zod";

// S5: só usuário e senha, com limites de tamanho; campos extras (ex.: userId, S2) são recusados
export const loginBodySchema = z.strictObject({
  username: z.string().min(1).max(40),
  password: z.string().min(1).max(100),
});
