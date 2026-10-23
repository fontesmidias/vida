import type { PrismaClient } from "@prisma/client";
import type { AccountRepository } from "@/src/services/accounts";

export function accountsRepository(db: PrismaClient): AccountRepository {
  return {
    findByUsername: (username) =>
      db.user.findUnique({
        where: { username },
        select: { id: true, displayName: true, passwordHash: true, currentCycle: true },
      }),
    countInCycle: async (userId, cycle) => {
      const [checkins, completions] = await Promise.all([
        db.checkin.count({ where: { userId, cycle } }),
        db.planDayCompletion.count({ where: { userId, cycle } }),
      ]);
      return checkins + completions;
    },
    // R8/D27: registra o pedido e avança o ciclo na mesma transação. A condição no ciclo atual
    // evita avançar duas vezes com dois toques simultâneos.
    newCycle: (userId, fromCycle) =>
      db.$transaction(async (tx) => {
        const moved = await tx.user.updateMany({
          where: { id: userId, currentCycle: fromCycle },
          data: { currentCycle: { increment: 1 } },
        });
        if (moved.count === 1) await tx.journeyReset.create({ data: { userId, fromCycle } });
        const user = await tx.user.findUniqueOrThrow({ where: { id: userId }, select: { currentCycle: true } });
        return user.currentCycle;
      }),
  };
}
