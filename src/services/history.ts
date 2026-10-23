// R7: histórico append-only, mais recentes primeiro, paginado por cursor (created_at, id)
import type { MoodSummary } from "./today";

export const PAGE_SIZE = 10;

export type Cursor = { createdAt: Date; id: string };

export type HistoryItem = { id: string; createdAt: Date; timezone: string; localDate: string; mood: MoodSummary };

export interface HistoryRepository {
  listCheckins(userId: string, cycle: number, after: Cursor | null, take: number): Promise<HistoryItem[]>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function encodeCursor(c: Cursor): string {
  return Buffer.from(`${c.createdAt.toISOString()}|${c.id}`).toString("base64url");
}

// O cursor vem do cliente: qualquer coisa fora do formato vira null (a rota responde 400)
export function decodeCursor(raw: string): Cursor | null {
  try {
    const [iso, id, ...rest] = Buffer.from(raw, "base64url").toString("utf8").split("|");
    const createdAt = new Date(iso);
    if (rest.length || !id || !UUID.test(id) || Number.isNaN(createdAt.getTime())) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

export async function listCheckins(repo: HistoryRepository, input: { userId: string; cycle: number; cursor?: Cursor | null }) {
  const rows = await repo.listCheckins(input.userId, input.cycle, input.cursor ?? null, PAGE_SIZE + 1);
  const items = rows.slice(0, PAGE_SIZE);
  const last = items.at(-1);
  const nextCursor = rows.length > PAGE_SIZE && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : null;
  return { items, nextCursor };
}
