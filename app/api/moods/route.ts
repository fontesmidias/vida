import { currentUser, unauthorized } from "@/src/lib/auth";
import { internalError } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { moodsRepository } from "@/src/repositories/moods";
import { listMoods } from "@/src/services/moods";

export async function GET() {
  try {
    if (!(await currentUser())) return unauthorized();
    return Response.json({ moods: await listMoods(moodsRepository(prisma)) });
  } catch (error) {
    return internalError("moods", error);
  }
}
