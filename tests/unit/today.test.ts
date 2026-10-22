import { describe, expect, it, vi } from "vitest";
import { getToday, type TodayRepository } from "@/src/services/today";

const content = (family: string) => ({
  family,
  reflectionTitle: `r-${family}`,
  reflectionBody: "b",
  practiceTitle: "p",
  practiceBody: "pb",
  practiceMinutes: 1,
  practiceKind: "breath",
});

function fakeRepo(latest: { slug: string; label: string; family: string; createdAt: Date } | null): TodayRepository {
  return {
    latestCheckinOn: vi.fn(async () =>
      latest ? { createdAt: latest.createdAt, mood: { slug: latest.slug, label: latest.label, family: latest.family } } : null,
    ),
    contentFor: vi.fn(async (family: string) => content(family)),
  };
}

describe("Hoje (R2, R3)", () => {
  const now = new Date("2026-10-22T02:30:00Z"); // 21/10 em São Paulo, 22/10 em Tóquio

  it("usa o check-in mais recente do dia no fuso informado", async () => {
    const repo = fakeRepo({ slug: "ansioso", label: "Com ansiedade", family: "agitado", createdAt: now });
    const r = await getToday(repo, { userId: "u1", timezone: "America/Sao_Paulo", now });
    expect(repo.latestCheckinOn).toHaveBeenCalledWith("u1", "2026-10-21");
    expect(r.date).toBe("2026-10-21");
    expect(r.checkin?.mood.slug).toBe("ansioso");
    expect(r.content.family).toBe("agitado");
  });

  it("o dia muda com o fuso: em Tóquio já é 22/10 (viagem)", async () => {
    const repo = fakeRepo(null);
    await getToday(repo, { userId: "u1", timezone: "Asia/Tokyo", now });
    expect(repo.latestCheckinOn).toHaveBeenCalledWith("u1", "2026-10-22");
  });

  it("sem check-in no dia → conteúdo neutro", async () => {
    const r = await getToday(fakeRepo(null), { userId: "u1", timezone: "America/Sao_Paulo", now });
    expect(r.checkin).toBeNull();
    expect(r.content.family).toBe("neutro");
  });

  it("fuso inválido cai no padrão (R1)", async () => {
    const r = await getToday(fakeRepo(null), { userId: "u1", timezone: "nada", now });
    expect(r.timezone).toBe("America/Sao_Paulo");
  });
});
