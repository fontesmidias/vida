// Idempotente: pode rodar várias vezes (upsert por chave única). Nunca toca em dados de usuário (R7).
import { PrismaClient } from "@prisma/client";
import { dailyContents, moods, plans } from "./seed-data";

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

  console.log(`Seed: ${moods.length} estados, ${dailyContents.length} conteúdos, ${plans.length} planos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
