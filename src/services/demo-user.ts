// D3: visitante anônimo, isolado de outras pessoas pela sessão

export const DEMO_DISPLAY_NAME = "Visitante";

export type DemoUser = { id: string; displayName: string };

export interface UserRepository {
  findById(id: string): Promise<DemoUser | null>;
  createDemo(displayName: string): Promise<DemoUser>;
}

export async function getOrCreateDemoUser(repo: UserRepository, sessionUserId: string | undefined) {
  if (sessionUserId) {
    const user = await repo.findById(sessionUserId);
    if (user) return { user, created: false };
  }
  return { user: await repo.createDemo(DEMO_DISPLAY_NAME), created: true };
}
