import { describe, expect, it, vi } from "vitest";
import {
  createCheckin,
  DEFAULT_TIMEZONE,
  localDateFor,
  resolveTimezone,
  UnknownMoodError,
  type CheckinRepository,
} from "@/src/services/checkins";

describe("fuso horário (R1)", () => {
  it("aceita fuso IANA válido", () => {
    expect(resolveTimezone("Asia/Tokyo")).toBe("Asia/Tokyo");
  });

  it.each([undefined, null, "", "Lua/Base", "GMT+99", "<script>"])("usa America/Sao_Paulo se o fuso for %s", (tz) => {
    expect(resolveTimezone(tz)).toBe(DEFAULT_TIMEZONE);
  });
});

describe("data local (R1)", () => {
  // 02:30 UTC de 22/10 ainda é 21/10 em São Paulo (UTC-3), mas já é 22/10 em Tóquio
  const instante = new Date("2026-10-22T02:30:00Z");

  it("calcula o dia no fuso de quem fez o check-in", () => {
    expect(localDateFor(instante, "America/Sao_Paulo")).toBe("2026-10-21");
    expect(localDateFor(instante, "Asia/Tokyo")).toBe("2026-10-22");
  });

  it("vira o dia exatamente à meia-noite local", () => {
    expect(localDateFor(new Date("2026-10-22T02:59:59Z"), "America/Sao_Paulo")).toBe("2026-10-21");
    expect(localDateFor(new Date("2026-10-22T03:00:00Z"), "America/Sao_Paulo")).toBe("2026-10-22");
  });
});

describe("criar check-in (R1)", () => {
  const mood = { id: 1, slug: "ansioso", label: "Com ansiedade", family: "agitado" };

  function fakeRepo(): CheckinRepository {
    return {
      findActiveMoodBySlug: vi.fn(async (slug: string) => (slug === "ansioso" ? mood : null)),
      create: vi.fn(async (data) => ({ id: "c1", createdAt: data.createdAt, localDate: data.localDate })),
    };
  }

  it("registra o instante do servidor e a data local do fuso informado", async () => {
    const repo = fakeRepo();
    const now = new Date("2026-10-22T02:30:00Z");
    const r = await createCheckin(repo, { userId: "u1", cycle: 2, moodSlug: "ansioso", timezone: "America/Sao_Paulo", now });

    expect(repo.create).toHaveBeenCalledWith({
      userId: "u1",
      cycle: 2,
      moodId: 1,
      createdAt: now,
      timezone: "America/Sao_Paulo",
      localDate: "2026-10-21",
    });
    expect(r).toEqual({ id: "c1", createdAt: now, localDate: "2026-10-21", mood: { slug: "ansioso", label: "Com ansiedade", family: "agitado" } });
  });

  it("fuso inválido cai no padrão em vez de falhar", async () => {
    const repo = fakeRepo();
    await createCheckin(repo, { userId: "u1", cycle: 2, moodSlug: "ansioso", timezone: "xx", now: new Date() });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ timezone: DEFAULT_TIMEZONE }));
  });

  it("estado inexistente ou inativo é recusado", async () => {
    const repo = fakeRepo();
    await expect(createCheckin(repo, { userId: "u1", cycle: 2, moodSlug: "feliz", now: new Date() })).rejects.toBeInstanceOf(UnknownMoodError);
    expect(repo.create).not.toHaveBeenCalled();
  });
});
