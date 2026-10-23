// R8/D27 contra o Postgres real: "Começar do zero" não apaga nem altera nenhum registro
import { loadEnvConfig } from "@next/env";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

loadEnvConfig(process.cwd());
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("começar do zero no banco (R8, D27)", async () => {
  const { PrismaClient } = await import("@prisma/client");
  const { accountsRepository } = await import("@/src/repositories/accounts");
  const db = new PrismaClient();
  let userId = "";

  beforeAll(async () => {
    const mood = await db.mood.findFirstOrThrow({ where: { slug: "em-paz" } });
    const user = await db.user.create({ data: { displayName: "Integração", username: `int-${Date.now()}` } });
    userId = user.id;
    await db.checkin.create({
      data: { userId, moodId: mood.id, timezone: "America/Sao_Paulo", localDate: new Date("2026-10-23T00:00:00Z"), cycle: 1 },
    });
  });

  afterAll(async () => {
    await db.journeyReset.deleteMany({ where: { userId } });
    await db.checkin.deleteMany({ where: { userId } });
    await db.user.delete({ where: { id: userId } });
    await db.$disconnect();
  });

  it("o ciclo avança, o check-in antigo continua no banco e o pedido fica registrado", async () => {
    const repo = accountsRepository(db);
    const antes = await db.checkin.findMany({ where: { userId } });

    expect(await repo.newCycle(userId, 1)).toBe(2);

    expect(await repo.countInCycle(userId, 2)).toBe(0); // para a pessoa, é do zero
    expect(await db.checkin.findMany({ where: { userId } })).toEqual(antes); // nada apagado nem alterado
    const resets = await db.journeyReset.findMany({ where: { userId } });
    expect(resets).toHaveLength(1);
    expect(resets[0].fromCycle).toBe(1);
  });

  it("dois pedidos simultâneos do mesmo ciclo avançam uma vez só", async () => {
    const repo = accountsRepository(db);
    const [a, b] = await Promise.all([repo.newCycle(userId, 2), repo.newCycle(userId, 2)]);
    expect([a, b]).toEqual([3, 3]);
    expect(await db.journeyReset.count({ where: { userId } })).toBe(2);
  });
});
