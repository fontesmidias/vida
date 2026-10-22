// D19: única exceção ao append-only (R7). A pessoa pede, e só os dados dela saem, de forma definitiva.
// A aplicação continua sem alterar nem apagar registros por conta própria.

export interface DeleteRepository {
  deleteUserData(userId: string): Promise<{ checkins: number; completions: number }>;
}

export async function deleteMyData(repo: DeleteRepository, userId: string) {
  if (!userId) throw new Error("Exclusão sem pessoa identificada");
  return repo.deleteUserData(userId);
}
