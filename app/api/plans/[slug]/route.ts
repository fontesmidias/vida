import { currentUser, unauthorized } from "@/src/lib/auth";
import { badRequest, internalError, notFound } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { plansRepository } from "@/src/repositories/plans";
import { getPlan, PlanNotFoundError } from "@/src/services/plans";
import { planSlugSchema } from "@/src/validation/plans";

// R5/R6: dias com status e o próximo sugerido
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const slug = planSlugSchema.safeParse((await params).slug);
    if (!slug.success) return badRequest();

    return Response.json(await getPlan(plansRepository(prisma), user.id, user.cycle, slug.data), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    if (error instanceof PlanNotFoundError) return notFound();
    return internalError("plans/slug", error);
  }
}
