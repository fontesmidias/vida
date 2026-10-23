import { currentUser, unauthorized } from "@/src/lib/auth";
import { badRequest, forbidden, internalError, isSameOrigin, readJson } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { tooManyRequests } from "@/src/lib/rate-limit";
import { checkinsRepository } from "@/src/repositories/checkins";
import { historyRepository } from "@/src/repositories/history";
import { createCheckin, UnknownMoodError } from "@/src/services/checkins";
import { decodeCursor, listCheckins } from "@/src/services/history";
import { checkinBodySchema } from "@/src/validation/checkins";
import { cursorQuerySchema } from "@/src/validation/query";

// R1: cria check-in com instante do servidor e dia no fuso de quem usa
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  const limited = tooManyRequests(request, "write"); // S6
  if (limited) return limited;
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const body = checkinBodySchema.safeParse(await readJson(request));
    if (!body.success) return badRequest();

    const checkin = await createCheckin(checkinsRepository(prisma), {
      userId: user.id,
      cycle: user.cycle,
      ...body.data,
      now: new Date(),
    });
    return Response.json(checkin, { status: 201 });
  } catch (error) {
    if (error instanceof UnknownMoodError) return badRequest("Escolha um dos estados da lista.");
    return internalError("checkins", error);
  }
}

// R7: histórico paginado, 10 por vez, mais recentes primeiro
export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const raw = cursorQuerySchema.safeParse(new URL(request.url).searchParams.get("cursor"));
    if (!raw.success) return badRequest();
    const cursor = raw.data ? decodeCursor(raw.data) : null;
    if (raw.data && !cursor) return badRequest();

    const page = await listCheckins(historyRepository(prisma), { userId: user.id, cycle: user.cycle, cursor });
    return Response.json(page, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return internalError("checkins/list", error);
  }
}
