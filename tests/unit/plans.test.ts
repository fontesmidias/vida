import { describe, expect, it, vi } from "vitest";
import { completeDay, getPlan, listPlans, PlanNotFoundError, summarize, type PlanRepository } from "@/src/services/plans";

const plan = (done: number[]) => ({
  slug: "respirar",
  title: "Respirar",
  description: "d",
  days: [1, 2, 3, 4, 5].map((n) => ({ dayNumber: n, title: `Dia ${n}`, body: "b", completed: done.includes(n) })),
});

describe("progresso (R5, R6)", () => {
  it("conta concluídos e sugere o primeiro não concluído", () => {
    expect(summarize(plan([1, 3]))).toMatchObject({ completedDays: 2, totalDays: 5, suggestedDay: 2, completed: false });
  });

  it("plano completo não tem sugestão e é marcado como concluído", () => {
    expect(summarize(plan([1, 2, 3, 4, 5]))).toMatchObject({ completedDays: 5, suggestedDay: null, completed: true });
  });

  it("sem conclusões, sugere o dia 1", () => {
    expect(summarize(plan([])).suggestedDay).toBe(1);
  });
});

function fakeRepo(over: Partial<PlanRepository> = {}): PlanRepository {
  return {
    findPlans: vi.fn(async () => [plan([1])]),
    findPlan: vi.fn(async (_u, _c, slug) => (slug === "respirar" ? plan([1]) : null)),
    findDayId: vi.fn(async (slug, n) => (slug === "respirar" && n >= 1 && n <= 5 ? 100 + n : null)),
    markCompleted: vi.fn(async () => true),
    ...over,
  };
}

describe("planos", () => {
  it("lista com resumo, sem o corpo dos dias", async () => {
    const [p] = await listPlans(fakeRepo(), "u1", 2);
    expect(p).toMatchObject({ slug: "respirar", completedDays: 1, totalDays: 5 });
    expect(p).not.toHaveProperty("days");
  });

  it("detalhe inexistente → PlanNotFoundError", async () => {
    await expect(getPlan(fakeRepo(), "u1", 2, "nada")).rejects.toBeInstanceOf(PlanNotFoundError);
  });
});

describe("concluir dia (R4, R5)", () => {
  it("qualquer dia pode ser concluído, em qualquer ordem", async () => {
    const repo = fakeRepo();
    const r = await completeDay(repo, { userId: "u1", cycle: 2, slug: "respirar", dayNumber: 4 });
    expect(repo.markCompleted).toHaveBeenCalledWith("u1", 104, 2);
    expect(r.alreadyCompleted).toBe(false);
  });

  it("concluir de novo não duplica nem falha (idempotente)", async () => {
    const repo = fakeRepo({ markCompleted: vi.fn(async () => false) });
    const r = await completeDay(repo, { userId: "u1", cycle: 2, slug: "respirar", dayNumber: 1 });
    expect(r.alreadyCompleted).toBe(true);
  });

  it("dia ou plano inexistente → PlanNotFoundError", async () => {
    await expect(completeDay(fakeRepo(), { userId: "u1", cycle: 2, slug: "respirar", dayNumber: 9 })).rejects.toBeInstanceOf(PlanNotFoundError);
    await expect(completeDay(fakeRepo(), { userId: "u1", cycle: 2, slug: "nada", dayNumber: 1 })).rejects.toBeInstanceOf(PlanNotFoundError);
  });

  it("devolve o progresso atualizado", async () => {
    const r = await completeDay(fakeRepo(), { userId: "u1", cycle: 2, slug: "respirar", dayNumber: 2 });
    expect(r.plan).toMatchObject({ slug: "respirar", totalDays: 5 });
  });
});

describe("ciclo da jornada (R8)", () => {
  it("lista e conclusões consideram só o ciclo atual", async () => {
    const repo = fakeRepo();
    await listPlans(repo, "u1", 3);
    expect(repo.findPlans).toHaveBeenCalledWith("u1", 3);
  });
});
