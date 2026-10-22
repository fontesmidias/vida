import { currentUserId, unauthorized } from "@/src/lib/auth";
import { badRequest, forbidden, internalError, isSameOrigin, notFound } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { tooManyRequests } from "@/src/lib/rate-limit";
import { plansRepository } from "@/src/repositories/plans";
import { completeDay, PlanNotFoundError } from "@/src/services/plans";
import { dayParamsSchema } from "@/src/validation/plans";

// R4: concluir de novo responde 200 com o mesmo estado, sem duplicar
export async function POST(request: Request, { params }: { params: Promise<{ slug: string; day: string }> }) {
  if (!isSameOrigin(request)) return forbidden();
  const limited = tooManyRequests(request, "write"); // S6
  if (limited) return limited;
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const parsed = dayParamsSchema.safeParse(await params);
    if (!parsed.success) return badRequest();

    const result = await completeDay(plansRepository(prisma), {
      userId,
      slug: parsed.data.slug,
      dayNumber: parsed.data.day,
    });
    return Response.json(result, { status: result.alreadyCompleted ? 200 : 201 });
  } catch (error) {
    if (error instanceof PlanNotFoundError) return notFound();
    return internalError("plans/complete", error);
  }
}
