import { currentUser, unauthorized } from "@/src/lib/auth";
import { forbidden, internalError, isSameOrigin } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { tooManyRequests } from "@/src/lib/rate-limit";
import { accountsRepository } from "@/src/repositories/accounts";
import { startOver } from "@/src/services/accounts";

// R8/D27: "Começar do zero" abre um novo ciclo; nada é apagado e o pedido fica registrado
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  const limited = tooManyRequests(request, "write"); // S6
  if (limited) return limited;
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    return Response.json(await startOver(accountsRepository(prisma), user));
  } catch (error) {
    return internalError("me/reset", error);
  }
}
