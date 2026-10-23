import type { PrismaClient } from "@prisma/client";
import type { HistoryRepository } from "@/src/services/history";

export function historyRepository(db: PrismaClient): HistoryRepository {
  return {
    listCheckins: async (userId, cycle, after, take) => {
      const rows = await db.checkin.findMany({
        where: {
          userId,
          cycle,
          ...(after && {
            OR: [{ createdAt: { lt: after.createdAt } }, { createdAt: after.createdAt, id: { lt: after.id } }],
          }),
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        select: {
          id: true,
          createdAt: true,
          timezone: true,
          localDate: true,
          mood: { select: { slug: true, label: true, family: true } },
        },
      });
      return rows.map((r) => ({ ...r, localDate: r.localDate.toISOString().slice(0, 10) }));
    },
  };
}
