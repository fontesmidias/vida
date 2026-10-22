import { currentUserId, unauthorized } from "@/src/lib/auth";
import { badRequest, forbidden, internalError, isSameOrigin, readJson } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { checkinsRepository } from "@/src/repositories/checkins";
import { createCheckin, UnknownMoodError } from "@/src/services/checkins";
import { checkinBodySchema } from "@/src/validation/checkins";

// R1: cria check-in com instante do servidor e dia no fuso de quem usa
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const body = checkinBodySchema.safeParse(await readJson(request));
    if (!body.success) return badRequest();

    const checkin = await createCheckin(checkinsRepository(prisma), { userId, ...body.data, now: new Date() });
    return Response.json(checkin, { status: 201 });
  } catch (error) {
    if (error instanceof UnknownMoodError) return badRequest("Escolha um dos estados da lista.");
    return internalError("checkins", error);
  }
}
