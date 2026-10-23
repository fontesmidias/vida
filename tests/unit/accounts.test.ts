import { describe, expect, it, vi } from "vitest";
import { hashPassword } from "@/src/lib/password";
import { InvalidCredentialsError, login, startOver, type AccountRepository } from "@/src/services/accounts";

const HASH = hashPassword("vida2026");

function fakeRepo(over: Partial<AccountRepository> = {}): AccountRepository {
  return {
    findByUsername: vi.fn(async (u: string) =>
      u === "avaliador1" ? { id: "u1", displayName: "Avaliador 1", passwordHash: HASH, currentCycle: 2 } : null,
    ),
    countInCycle: vi.fn(async () => 0),
    newCycle: vi.fn(async (_id: string, from: number) => from + 1),
    ...over,
  };
}

describe("login nas contas de demonstração (S8, D26)", () => {
  it("senha certa entra e informa se o ciclo atual já tem registros", async () => {
    const repo = fakeRepo({ countInCycle: vi.fn(async () => 3) });
    const r = await login(repo, { username: "avaliador1", password: "vida2026" });
    expect(r).toEqual({ id: "u1", displayName: "Avaliador 1", hasProgress: true });
    expect(repo.countInCycle).toHaveBeenCalledWith("u1", 2);
  });

  it("ciclo vazio → hasProgress falso (botão Iniciar)", async () => {
    const r = await login(fakeRepo(), { username: "avaliador1", password: "vida2026" });
    expect(r.hasProgress).toBe(false);
  });

  it.each([
    ["avaliador1", "errada"],
    ["ninguem", "vida2026"],
  ])("usuário %s com senha %s → o mesmo erro genérico", async (username, password) => {
    await expect(login(fakeRepo(), { username, password })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("usuário sem senha cadastrada (visitante antigo) não entra", async () => {
    const repo = fakeRepo({
      findByUsername: vi.fn(async () => ({ id: "x", displayName: "Visitante", passwordHash: null, currentCycle: 1 })),
    });
    await expect(login(repo, { username: "x", password: "" })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

describe("começar do zero (R8, D27)", () => {
  it("abre o próximo ciclo e não apaga nada", async () => {
    const repo = fakeRepo();
    const r = await startOver(repo, { id: "u1", cycle: 2 });
    expect(repo.newCycle).toHaveBeenCalledWith("u1", 2);
    expect(r).toEqual({ cycle: 3 });
  });
});
