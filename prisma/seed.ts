// Idempotente: pode rodar várias vezes (upsert por chave única). Nunca toca em dados de usuário (R7).
import { PrismaClient } from "@prisma/client";
import { verifyPassword, hashPassword } from "../src/lib/password";
import { dailyContents, DEMO_PASSWORD, demoAccounts, moods, plans, testAccounts } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const mood of moods) {
    await prisma.mood.upsert({ where: { slug: mood.slug }, update: mood, create: mood });
  }

  for (const content of dailyContents) {
    await prisma.dailyContent.upsert({ where: { family: content.family }, update: content, create: content });
  }

  for (const { days, ...plan } of plans) {
    const { id: planId } = await prisma.plan.upsert({ where: { slug: plan.slug }, update: plan, create: plan });
    for (const day of days) {
      await prisma.planDay.upsert({
        where: { planId_dayNumber: { planId, dayNumber: day.dayNumber } },
        update: day,
        create: { ...day, planId },
      });
    }
  }

  // D26: contas de demonstração. Só troca o hash se a senha mudou; nunca mexe em check-ins nem no ciclo (R7, R8)
  const accounts = [...demoAccounts, ...testAccounts];
  for (const a of accounts) {
    const current = await prisma.user.findUnique({ where: { username: a.username }, select: { passwordHash: true } });
    const passwordHash = verifyPassword(DEMO_PASSWORD, current?.passwordHash) ? current!.passwordHash! : hashPassword(DEMO_PASSWORD);
    await prisma.user.upsert({
      where: { username: a.username },
      update: { displayName: a.displayName, passwordHash },
      create: { username: a.username, displayName: a.displayName, passwordHash, isDemo: true },
    });
  }

  console.log(`Seed: ${moods.length} estados, ${dailyContents.length} conteúdos, ${plans.length} planos, ${accounts.length} contas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
