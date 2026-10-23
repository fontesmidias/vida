// D26/S8: contas de demonstração. R8/D27: "Começar do zero" abre um novo ciclo, sem apagar nada.
import { verifyPassword } from "@/src/lib/password";

export type Account = { id: string; displayName: string; passwordHash: string | null; currentCycle: number };
export type SessionUser = { id: string; cycle: number };

export interface AccountRepository {
  findByUsername(username: string): Promise<Account | null>;
  // check-ins + conclusões do ciclo
  countInCycle(userId: string, cycle: number): Promise<number>;
  // registra o pedido (journey_resets) e avança o ciclo; devolve o novo ciclo
  newCycle(userId: string, fromCycle: number): Promise<number>;
}

// Mesma mensagem para usuário inexistente e senha errada: não revela quais contas existem
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Usuário ou senha não conferem.");
  }
}

export async function login(repo: AccountRepository, input: { username: string; password: string }) {
  const account = await repo.findByUsername(input.username);
  if (!account || !verifyPassword(input.password, account.passwordHash)) throw new InvalidCredentialsError();
  const count = await repo.countInCycle(account.id, account.currentCycle);
  return { id: account.id, displayName: account.displayName, hasProgress: count > 0 };
}

export async function startOver(repo: AccountRepository, user: SessionUser) {
  return { cycle: await repo.newCycle(user.id, user.cycle) };
}
