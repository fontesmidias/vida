import { describe, expect, it, vi } from "vitest";
import { DEMO_DISPLAY_NAME, getOrCreateDemoUser, type UserRepository } from "@/src/services/demo-user";

function fakeRepo(existentes: string[] = []): UserRepository {
  return {
    findById: vi.fn(async (id: string) => (existentes.includes(id) ? { id, displayName: DEMO_DISPLAY_NAME } : null)),
    createDemo: vi.fn(async () => ({ id: "novo", displayName: DEMO_DISPLAY_NAME })),
  };
}

describe("usuário de demonstração (D3)", () => {
  it("cria usuário quando não há sessão", async () => {
    const repo = fakeRepo();
    const r = await getOrCreateDemoUser(repo, undefined);
    expect(r).toEqual({ user: { id: "novo", displayName: DEMO_DISPLAY_NAME }, created: true });
  });

  it("reutiliza o usuário da sessão existente, sem criar outro", async () => {
    const repo = fakeRepo(["u1"]);
    const r = await getOrCreateDemoUser(repo, "u1");
    expect(r.created).toBe(false);
    expect(r.user.id).toBe("u1");
    expect(repo.createDemo).not.toHaveBeenCalled();
  });

  it("cria novo usuário se o da sessão não existe mais no banco", async () => {
    const repo = fakeRepo();
    const r = await getOrCreateDemoUser(repo, "sumiu");
    expect(r.created).toBe(true);
  });

  it("nome de exibição é neutro (C4)", () => {
    expect(DEMO_DISPLAY_NAME).toBe("Visitante");
  });
});
