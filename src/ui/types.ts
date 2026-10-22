// Formato das respostas da API (ver specs/ARCHITECTURE.md)
export type Mood = { slug: string; label: string; family: string };

export type Today = {
  date: string;
  timezone: string;
  checkin: { createdAt: string; mood: Mood } | null;
  content: {
    family: string;
    reflectionTitle: string;
    reflectionBody: string;
    practiceTitle: string;
    practiceBody: string;
    practiceMinutes: number;
    practiceKind: "breath" | "heart" | "tiny" | "three";
  };
};

export type CheckinItem = { id: string; createdAt: string; timezone: string; localDate: string; mood: Mood };

export type PlanSummary = {
  slug: string;
  title: string;
  description: string;
  completedDays: number;
  totalDays: number;
  suggestedDay: number | null;
  completed: boolean;
};

export type PlanDetail = PlanSummary & {
  days: { dayNumber: number; title: string; body: string; completed: boolean }[];
};
