import { forbidden, internalError, isSameOrigin } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { tooManyRequests } from "@/src/lib/rate-limit";
import { getSession } from "@/src/lib/session";
import { usersRepository } from "@/src/repositories/users";
import { getOrCreateDemoUser } from "@/src/services/demo-user";

// Cria visitante e sessão, ou reutiliza a sessão existente (D3)
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  const limited = tooManyRequests(request, "session"); // S6: o mais restrito
  if (limited) return limited;
  try {
    const session = await getSession();
    const { user, created } = await getOrCreateDemoUser(usersRepository(prisma), session.userId);
    session.userId = user.id;
    await session.save();
    return Response.json({ displayName: user.displayName }, { status: created ? 201 : 200 });
  } catch (error) {
    return internalError("session/demo", error);
  }
}
