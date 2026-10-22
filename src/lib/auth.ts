import { prisma } from "./prisma";
import { getSession } from "./session";
import { jsonError } from "./http";
import { usersRepository } from "@/src/repositories/users";

// S2: o userId vem só da sessão, e a pessoa precisa existir no banco
export async function currentUserId(): Promise<string | null> {
  const session = await getSession();
  if (!session.userId) return null;
  const user = await usersRepository(prisma).findById(session.userId);
  return user?.id ?? null;
}

export const unauthorized = () => jsonError(401, "Sua sessão terminou. Entre novamente para continuar.");
