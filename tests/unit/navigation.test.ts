import { describe, expect, it } from "vitest";
import { activeTab, parentOf } from "@/src/ui/navigation";

describe("voltar sempre visível (U9)", () => {
  it.each(["/", "/hoje", "/check-in", "/planos", "/jornada"])("%s é primeiro nível: sem Voltar", (p) => expect(parentOf(p)).toBeNull());
  it.each([
    ["/pratica", "/hoje"],
    ["/planos/respirar-com-calma", "/planos"],
    ["/planos/respirar-com-calma/dia/3", "/planos/respirar-com-calma"],
    ["/qualquer", "/hoje"],
  ])("%s volta para %s", (p, pai) => expect(parentOf(p)).toBe(pai));
});

describe("aba ativa", () => {
  it.each([
    ["/hoje", "/hoje"],
    ["/pratica", "/hoje"],
    ["/planos/x/dia/1", "/planos"],
    ["/jornada", "/jornada"],
  ])("%s → %s", (p, aba) => expect(activeTab(p)).toBe(aba));
});
