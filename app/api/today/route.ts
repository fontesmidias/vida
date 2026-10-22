import { currentUserId, unauthorized } from "@/src/lib/auth";
import { badRequest, internalError } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { todayRepository } from "@/src/repositories/today";
import { getToday } from "@/src/services/today";
import { timezoneQuerySchema } from "@/src/validation/query";

// R2/R3: o "hoje" é calculado no fuso atual do dispositivo (?tz=)
export async function GET(request: Request) {
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const tz = timezoneQuerySchema.safeParse(new URL(request.url).searchParams.get("tz"));
    if (!tz.success) return badRequest();

    const today = await getToday(todayRepository(prisma), { userId, timezone: tz.data, now: new Date() });
    return Response.json(today, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return internalError("today", error);
  }
}
