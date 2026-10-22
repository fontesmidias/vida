import type { PrismaClient } from "@prisma/client";
import type { CheckinRepository } from "@/src/services/checkins";

// Coluna DATE: gravada e lida como meia-noite UTC; a API trabalha com "AAAA-MM-DD"
const toDbDate = (day: string) => new Date(`${day}T00:00:00.000Z`);
const fromDbDate = (date: Date) => date.toISOString().slice(0, 10);

export function checkinsRepository(db: PrismaClient): CheckinRepository {
  return {
    findActiveMoodBySlug: (slug) =>
      db.mood.findFirst({
        where: { slug, active: true },
        select: { id: true, slug: true, label: true, emoji: true, family: true },
      }),
    create: async ({ localDate, ...data }) => {
      const c = await db.checkin.create({
        data: { ...data, localDate: toDbDate(localDate) },
        select: { id: true, createdAt: true, localDate: true },
      });
      return { ...c, localDate: fromDbDate(c.localDate) };
    },
  };
}
