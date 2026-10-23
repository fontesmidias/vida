import { currentUser, unauthorized } from "@/src/lib/auth";
import { internalError } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { plansRepository } from "@/src/repositories/plans";
import { listPlans } from "@/src/services/plans";

// R6: cada plano com o progresso de quem está na sessão
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    return Response.json({ plans: await listPlans(plansRepository(prisma), user.id, user.cycle) }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return internalError("plans", error);
  }
}
