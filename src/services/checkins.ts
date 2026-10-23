// R1: o servidor define o instante; o fuso de quem usa define o "dia"

export const DEFAULT_TIMEZONE = "America/Sao_Paulo";

// Só nomes IANA (ex.: America/Sao_Paulo, UTC); offsets como "+03:00" não são aceitos
const IANA_NAME = /^[A-Za-z_]+(\/[A-Za-z0-9_+-]+)*$/;

export function resolveTimezone(tz: string | null | undefined): string {
  if (!tz || !IANA_NAME.test(tz)) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

// Data (AAAA-MM-DD) do instante no fuso informado
export function localDateFor(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    instant,
  );
}

export type Mood = { id: number; slug: string; label: string; family: string };

export type NewCheckin = { userId: string; cycle: number; moodId: number; createdAt: Date; timezone: string; localDate: string };

export interface CheckinRepository {
  findActiveMoodBySlug(slug: string): Promise<Mood | null>;
  create(data: NewCheckin): Promise<{ id: string; createdAt: Date; localDate: string }>;
}

export class UnknownMoodError extends Error {
  constructor() {
    super("Estado emocional inexistente ou inativo");
  }
}

export async function createCheckin(
  repo: CheckinRepository,
  input: { userId: string; cycle: number; moodSlug: string; timezone?: string; now: Date },
) {
  const mood = await repo.findActiveMoodBySlug(input.moodSlug);
  if (!mood) throw new UnknownMoodError();

  const timezone = resolveTimezone(input.timezone);
  const checkin = await repo.create({
    userId: input.userId,
    cycle: input.cycle, // R8: o check-in pertence ao ciclo atual
    moodId: mood.id,
    createdAt: input.now,
    timezone,
    localDate: localDateFor(input.now, timezone),
  });
  return { ...checkin, mood: { slug: mood.slug, label: mood.label, family: mood.family } };
}
