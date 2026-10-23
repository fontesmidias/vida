import { describe, expect, it, vi } from "vitest";
import { decodeCursor, encodeCursor, listCheckins, PAGE_SIZE, type HistoryRepository } from "@/src/services/history";

const item = (i: number) => ({
  id: `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`,
  createdAt: new Date(Date.UTC(2026, 9, 21, 12, 0, 0) - i * 60_000),
  timezone: "America/Sao_Paulo",
  localDate: "2026-10-21",
  mood: { slug: "em-paz", label: "Em paz", family: "sereno" },
});

describe("histórico paginado (R7)", () => {
  it("devolve 10 por página e o cursor da próxima", async () => {
    const repo: HistoryRepository = { listCheckins: vi.fn(async () => Array.from({ length: PAGE_SIZE + 1 }, (_, i) => item(i))) };
    const r = await listCheckins(repo, { userId: "u1", cycle: 2 });
    expect(PAGE_SIZE).toBe(10);
    expect(r.items).toHaveLength(10);
    expect(decodeCursor(r.nextCursor!)).toEqual({ createdAt: item(9).createdAt, id: item(9).id });
    expect(repo.listCheckins).toHaveBeenCalledWith("u1", 2, null, PAGE_SIZE + 1);
  });

  it("última página não tem cursor", async () => {
    const repo: HistoryRepository = { listCheckins: vi.fn(async () => [item(0)]) };
    expect((await listCheckins(repo, { userId: "u1", cycle: 2 })).nextCursor).toBeNull();
  });

  it("cursor ida e volta", () => {
    const c = { createdAt: new Date("2026-10-21T10:00:00.123Z"), id: item(1).id };
    expect(decodeCursor(encodeCursor(c))).toEqual(c);
  });

  it.each(["", "lixo", "bWFs", encodeCursor({ createdAt: new Date(0), id: "x" }).slice(0, 5)])("cursor inválido '%s' → null", (c) => {
    expect(decodeCursor(c)).toBeNull();
  });
});
