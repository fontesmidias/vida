// R2/R3: conteúdo do dia conforme o check-in mais recente do dia no fuso atual de quem usa
import { localDateFor, resolveTimezone } from "./checkins";

export const NEUTRAL_FAMILY = "neutro";

export type DailyContent = {
  family: string;
  reflectionTitle: string;
  reflectionBody: string;
  practiceTitle: string;
  practiceBody: string;
  practiceMinutes: number;
  practiceKind: string;
};

export type MoodSummary = { slug: string; label: string; family: string };

export interface TodayRepository {
  latestCheckinOn(userId: string, localDate: string): Promise<{ createdAt: Date; mood: MoodSummary } | null>;
  contentFor(family: string): Promise<DailyContent | null>;
}

export async function getToday(repo: TodayRepository, input: { userId: string; timezone?: string | null; now: Date }) {
  const timezone = resolveTimezone(input.timezone);
  const date = localDateFor(input.now, timezone);
  const checkin = await repo.latestCheckinOn(input.userId, date);
  const content = (checkin && (await repo.contentFor(checkin.mood.family))) ?? (await repo.contentFor(NEUTRAL_FAMILY));
  if (!content) throw new Error("Conteúdo neutro ausente: rode o seed");
  return { date, timezone, checkin, content };
}
