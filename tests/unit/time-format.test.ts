import { describe, expect, it } from "vitest";
import { formatCheckinTime, placeName } from "@/src/ui/time-format";

// 22/10/2026 10:00 em São Paulo
const now = new Date("2026-10-22T13:00:00Z");
const sp = "America/Sao_Paulo";

describe("hora do check-in na Jornada (R1, UI_UX_SPEC: tempo na tela)", () => {
  it("hoje, no mesmo fuso", () => {
    expect(formatCheckinTime({ createdAt: "2026-10-22T11:30:00Z", localDate: "2026-10-22", timezone: sp }, sp, now)).toBe("Hoje, 08:30");
  });

  it("ontem", () => {
    expect(formatCheckinTime({ createdAt: "2026-10-22T00:40:00Z", localDate: "2026-10-21", timezone: sp }, sp, now)).toBe("Ontem, 21:40");
  });

  it("dias anteriores mostram a data", () => {
    expect(formatCheckinTime({ createdAt: "2026-10-19T11:15:00Z", localDate: "2026-10-19", timezone: sp }, sp, now)).toBe("19/10, 08:15");
  });

  it("feito em outro fuso: hora vivida lá + indicação do lugar", () => {
    expect(formatCheckinTime({ createdAt: "2026-10-19T07:15:00Z", localDate: "2026-10-19", timezone: "Europe/Lisbon" }, sp, now)).toBe(
      "19/10, 08:15 · horário de Lisboa",
    );
  });

  it("outro ano mostra o ano", () => {
    expect(formatCheckinTime({ createdAt: "2025-12-31T15:00:00Z", localDate: "2025-12-31", timezone: sp }, sp, now)).toBe("31/12/2025, 12:00");
  });
});

describe("nome do lugar a partir do fuso", () => {
  it.each([
    ["America/Sao_Paulo", "São Paulo"],
    ["Asia/Tokyo", "Tóquio"],
    ["America/Argentina/Buenos_Aires", "Buenos Aires"],
    ["UTC", "UTC"],
  ])("%s → %s", (tz, nome) => expect(placeName(tz)).toBe(nome));
});
