import type { PrismaClient } from "@prisma/client";
import type { UserRepository } from "@/src/services/demo-user";

const select = { id: true, displayName: true } as const;

export function usersRepository(db: PrismaClient): UserRepository {
  return {
    findById: (id) => db.user.findUnique({ where: { id }, select }),
    createDemo: (displayName) => db.user.create({ data: { displayName, isDemo: true }, select }),
  };
}
