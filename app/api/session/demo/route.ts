import { badRequest, forbidden, internalError, isSameOrigin, jsonError, readJson } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { tooManyRequests } from "@/src/lib/rate-limit";
import { getSession } from "@/src/lib/session";
import { accountsRepository } from "@/src/repositories/accounts";
import { InvalidCredentialsError, login } from "@/src/services/accounts";
import { loginBodySchema } from "@/src/validation/accounts";

// D26/S8: entrar numa conta de demonstração. O limite por IP (S6) vem antes de tudo: freia força bruta.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  const limited = tooManyRequests(request, "session");
  if (limited) return limited;
  try {
    const body = loginBodySchema.safeParse(await readJson(request));
    if (!body.success) return badRequest("Escolha uma conta e digite a senha.");

    const account = await login(accountsRepository(prisma), body.data);
    const session = await getSession();
    session.userId = account.id;
    await session.save();
    return Response.json({ displayName: account.displayName, hasProgress: account.hasProgress });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) return jsonError(401, error.message);
    return internalError("session/demo", error);
  }
}
