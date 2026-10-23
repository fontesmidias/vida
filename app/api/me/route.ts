import { currentUser, unauthorized } from "@/src/lib/auth";
import { forbidden, internalError, isSameOrigin } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { tooManyRequests } from "@/src/lib/rate-limit";
import { getSession } from "@/src/lib/session";
import { deleteRepository } from "@/src/repositories/delete-data";
import { deleteMyData } from "@/src/services/delete-data";

// D19 (LGPD): a pessoa apaga os próprios dados; o userId vem só da sessão (S2)
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  const limited = tooManyRequests(request, "write"); // S6
  if (limited) return limited;
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    await deleteMyData(deleteRepository(prisma), user.id);
    (await getSession()).destroy();
    return new Response(null, { status: 204 });
  } catch (error) {
    return internalError("me/delete", error);
  }
}
