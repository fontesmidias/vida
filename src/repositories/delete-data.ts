import type { PrismaClient } from "@prisma/client";
import type { DeleteRepository } from "@/src/services/delete-data";

// Uma transação: ou sai tudo (conclusões, check-ins e a pessoa), ou nada.
// As chaves estrangeiras usam Restrict (R7), então a ordem importa: filhos antes da pessoa.
export function deleteRepository(db: PrismaClient): DeleteRepository {
  return {
    deleteUserData: async (userId) => {
      const [completions, checkins] = await db.$transaction([
        db.planDayCompletion.deleteMany({ where: { userId } }),
        db.checkin.deleteMany({ where: { userId } }),
        db.user.deleteMany({ where: { id: userId } }),
      ]);
      return { checkins: checkins.count, completions: completions.count };
    },
  };
}
