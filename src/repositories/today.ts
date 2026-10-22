import type { PrismaClient } from "@prisma/client";
import type { TodayRepository } from "@/src/services/today";

const moodSelect = { slug: true, label: true, family: true } as const;

export function todayRepository(db: PrismaClient): TodayRepository {
  return {
    latestCheckinOn: (userId, localDate) =>
      db.checkin.findFirst({
        where: { userId, localDate: new Date(`${localDate}T00:00:00.000Z`) },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, mood: { select: moodSelect } },
      }),
    contentFor: (family) =>
      db.dailyContent.findUnique({
        where: { family },
        select: {
          family: true,
          reflectionTitle: true,
          reflectionBody: true,
          practiceTitle: true,
          practiceBody: true,
          practiceMinutes: true,
          practiceKind: true,
        },
      }),
  };
}
