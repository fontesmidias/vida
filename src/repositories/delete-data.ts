import type { PrismaClient } from "@prisma/client";
import type { DeleteRepository } from "@/src/services/delete-data";

// Uma transação: ou sai tudo, ou nada. Saem conclusões, check-ins e o registro de recomeços, de todos os ciclos.
// D27: as contas de demonstração são compartilhadas, então a conta fica (sem dados pessoais) e volta ao ciclo 1.
export function deleteRepository(db: PrismaClient): DeleteRepository {
  return {
    deleteUserData: async (userId) => {
      const [completions, checkins] = await db.$transaction([
        db.planDayCompletion.deleteMany({ where: { userId } }),
        db.checkin.deleteMany({ where: { userId } }),
        db.journeyReset.deleteMany({ where: { userId } }),
        db.user.update({ where: { id: userId }, data: { currentCycle: 1 } }),
      ]);
      return { checkins: checkins.count, completions: completions.count };
    },
  };
}
