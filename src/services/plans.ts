// R4: conclusão idempotente · R5: ordem livre + próximo sugerido · R6: progresso cumulativo, sem streaks

export type PlanDayView = { dayNumber: number; title: string; body: string; completed: boolean };
export type PlanWithDays = { slug: string; title: string; description: string; days: PlanDayView[] };

export interface PlanRepository {
  // R8: conclusões consideradas são só as do ciclo atual
  findPlans(userId: string, cycle: number): Promise<PlanWithDays[]>;
  findPlan(userId: string, cycle: number, slug: string): Promise<PlanWithDays | null>;
  findDayId(slug: string, dayNumber: number): Promise<number | null>;
  // true se criou agora; false se já existia
  markCompleted(userId: string, planDayId: number, cycle: number): Promise<boolean>;
}

export class PlanNotFoundError extends Error {
  constructor() {
    super("Plano ou dia inexistente");
  }
}

export function summarize(plan: PlanWithDays) {
  const completedDays = plan.days.filter((d) => d.completed).length;
  const suggested = plan.days.find((d) => !d.completed);
  return {
    slug: plan.slug,
    title: plan.title,
    description: plan.description,
    completedDays,
    totalDays: plan.days.length,
    suggestedDay: suggested?.dayNumber ?? null,
    completed: completedDays === plan.days.length,
  };
}

export async function listPlans(repo: PlanRepository, userId: string, cycle: number) {
  return (await repo.findPlans(userId, cycle)).map(summarize);
}

export async function getPlan(repo: PlanRepository, userId: string, cycle: number, slug: string) {
  const plan = await repo.findPlan(userId, cycle, slug);
  if (!plan) throw new PlanNotFoundError();
  return { ...summarize(plan), days: plan.days };
}

export async function completeDay(repo: PlanRepository, input: { userId: string; cycle: number; slug: string; dayNumber: number }) {
  const dayId = await repo.findDayId(input.slug, input.dayNumber);
  if (dayId === null) throw new PlanNotFoundError();
  const created = await repo.markCompleted(input.userId, dayId, input.cycle);
  return { alreadyCompleted: !created, plan: await getPlan(repo, input.userId, input.cycle, input.slug) };
}
