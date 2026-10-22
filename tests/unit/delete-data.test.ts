import { describe, expect, it, vi } from "vitest";
import { deleteMyData, type DeleteRepository } from "@/src/services/delete-data";

describe("exclusão dos próprios dados (D19, LGPD)", () => {
  it("apaga só os dados da pessoa da sessão (S2) e informa o que saiu", async () => {
    const repo: DeleteRepository = { deleteUserData: vi.fn(async () => ({ checkins: 3, completions: 2 })) };
    const r = await deleteMyData(repo, "u1");
    expect(repo.deleteUserData).toHaveBeenCalledWith("u1");
    expect(r).toEqual({ checkins: 3, completions: 2 });
  });

  it("sem userId não apaga nada", async () => {
    const repo: DeleteRepository = { deleteUserData: vi.fn() };
    await expect(deleteMyData(repo, "")).rejects.toThrow();
    expect(repo.deleteUserData).not.toHaveBeenCalled();
  });
});
