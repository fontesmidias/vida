import { prisma } from "./prisma";
import { getSession } from "./session";
import { jsonError } from "./http";
import type { SessionUser } from "@/src/services/accounts";

// S2: o userId vem só da sessão. S8: só contas de demonstração (com username) entram;
// sessões antigas de visitantes anônimos deixam de valer. R8: devolve também o ciclo atual.
export async function currentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session.userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, currentCycle: true },
  });
  return user?.username ? { id: user.id, cycle: user.currentCycle } : null;
}

export const unauthorized = () => jsonError(401, "Sua sessão terminou. Entre novamente para continuar.");
