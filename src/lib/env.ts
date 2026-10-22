import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string({ error: "DATABASE_URL não definida" }).min(1, "DATABASE_URL não definida"),
  // S4: segredo forte, validado na inicialização
  SESSION_SECRET: z
    .string({ error: "SESSION_SECRET não definida" })
    .min(32, "SESSION_SECRET precisa ter pelo menos 32 caracteres"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof schema>;

// A mensagem cita só o nome da variável, nunca o valor (S3).
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    const detalhes = result.error.issues.map((i) => i.message).join("; ");
    throw new Error(`Configuração inválida: ${detalhes}. Veja .env.example.`);
  }
  return result.data;
}

let cached: Env | undefined;

export function env(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
