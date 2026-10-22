import type { PrismaClient } from "@prisma/client";
import type { MoodRepository } from "@/src/services/moods";

export function moodsRepository(db: PrismaClient): MoodRepository {
  return {
    listActive: () =>
      db.mood.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, label: true, family: true },
      }),
  };
}
