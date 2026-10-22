// Roda uma vez quando o servidor sobe: configuração inválida impede a inicialização (S4)
export async function register() {
  const { env } = await import("./src/lib/env");
  env();
}
