import { describe, expect, it } from "vitest";
import { dailyContents, moods, NEUTRAL_FAMILY, plans } from "@/prisma/seed-data";

describe("catálogo de estados (D11)", () => {
  it("tem 8 estados em 4 famílias, 2 por família", () => {
    expect(moods).toHaveLength(8);
    const porFamilia = Object.groupBy(moods, (m) => m.family);
    expect(Object.keys(porFamilia)).toHaveLength(4);
    for (const lista of Object.values(porFamilia)) expect(lista).toHaveLength(2);
  });

  it("slugs e ordens são únicos", () => {
    expect(new Set(moods.map((m) => m.slug)).size).toBe(moods.length);
    expect(new Set(moods.map((m) => m.sortOrder)).size).toBe(moods.length);
  });

  it("inclui o exemplo do desafio (ansioso)", () => {
    expect(moods.some((m) => m.slug === "ansioso")).toBe(true);
  });
});

describe("conteúdo do dia (R3)", () => {
  it("cada família tem exatamente um conteúdo, além do neutro", () => {
    const familias = new Set(moods.map((m) => m.family));
    const comConteudo = dailyContents.map((c) => c.family);
    expect(new Set(comConteudo).size).toBe(comConteudo.length);
    expect(new Set(comConteudo)).toEqual(new Set([...familias, NEUTRAL_FAMILY]));
  });

  it("práticas são curtas (até 10 minutos)", () => {
    for (const c of dailyContents) {
      expect(c.practiceMinutes).toBeGreaterThan(0);
      expect(c.practiceMinutes).toBeLessThanOrEqual(10);
    }
  });
});

describe("planos (PRD)", () => {
  it("há pelo menos 2 planos, com slugs únicos", () => {
    expect(plans.length).toBeGreaterThanOrEqual(2);
    expect(new Set(plans.map((p) => p.slug)).size).toBe(plans.length);
  });

  it("dias são numerados de 1 a N, sem lacunas", () => {
    for (const p of plans) {
      expect(p.days.map((d) => d.dayNumber)).toEqual(p.days.map((_, i) => i + 1));
    }
  });

  it("planos são identificados como demonstração (C2)", () => {
    for (const p of plans) expect(p.description).toMatch(/demonstração/i);
  });
});

describe("tom dos textos (C1)", () => {
  const textos = [
    ...dailyContents.flatMap((c) => [c.reflectionTitle, c.reflectionBody, c.practiceTitle, c.practiceBody]),
    ...plans.flatMap((p) => [p.title, p.description, ...p.days.flatMap((d) => [d.title, d.body])]),
  ];

  it.each(["cura", "curar", "diagnóstico", "terapia", "tratamento", "transtorno"])(
    "nenhum texto usa '%s'",
    (palavra) => {
      const re = new RegExp(`\b${palavra}\b`, "i");
      expect(textos.filter((t) => re.test(t))).toEqual([]);
    },
  );
});
