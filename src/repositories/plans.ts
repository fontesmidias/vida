import type { PrismaClient } from "@prisma/client";
import type { PlanRepository, PlanWithDays } from "@/src/services/plans";

// S2: as conclusões trazidas são sempre só as do userId da sessão; R8: e só do ciclo atual
const planSelect = (userId: string, cycle: number) =>
  ({
    slug: true,
    title: true,
    description: true,
    days: {
      orderBy: { dayNumber: "asc" },
      select: { dayNumber: true, title: true, body: true, completions: { where: { userId, cycle }, select: { id: true } } },
    },
  }) as const;

type Row = {
  slug: string;
  title: string;
  description: string;
  days: { dayNumber: number; title: string; body: string; completions: { id: string }[] }[];
};

const toView = (p: Row): PlanWithDays => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  days: p.days.map(({ completions, ...d }) => ({ ...d, completed: completions.length > 0 })),
});

export function plansRepository(db: PrismaClient): PlanRepository {
  return {
    findPlans: async (userId, cycle) =>
      (await db.plan.findMany({ orderBy: { id: "asc" }, select: planSelect(userId, cycle) })).map(toView),
    findPlan: async (userId, cycle, slug) => {
      const p = await db.plan.findUnique({ where: { slug }, select: planSelect(userId, cycle) });
      return p ? toView(p) : null;
    },
    findDayId: async (slug, dayNumber) =>
      (await db.planDay.findFirst({ where: { dayNumber, plan: { slug } }, select: { id: true } }))?.id ?? null,
    // R4: o índice único (user_id, plan_day_id, cycle) garante uma só conclusão por ciclo, mesmo com toques simultâneos
    markCompleted: async (userId, planDayId, cycle) =>
      (await db.planDayCompletion.createMany({ data: [{ userId, planDayId, cycle }], skipDuplicates: true })).count === 1,
  };
}
