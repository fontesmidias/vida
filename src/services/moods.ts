export type MoodOption = { slug: string; label: string; emoji: string };

export interface MoodRepository {
  listActive(): Promise<MoodOption[]>;
}

// D6: o catálogo vem do banco; novo estado não exige mudar código
export const listMoods = (repo: MoodRepository) => repo.listActive();
