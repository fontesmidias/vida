// U9: toda tela abaixo do primeiro nível tem "Voltar" para um destino previsível

export const TABS = [
  { href: "/hoje", label: "Hoje" },
  { href: "/check-in", label: "Check-in" },
  { href: "/planos", label: "Planos" },
  { href: "/jornada", label: "Jornada" },
] as const;

const TOP = new Set<string>(["/", ...TABS.map((t) => t.href)]);

export function parentOf(path: string): string | null {
  if (TOP.has(path)) return null;
  const day = path.match(/^\/planos\/([^/]+)\/dia\/[^/]+$/);
  if (day) return `/planos/${day[1]}`;
  if (/^\/planos\/[^/]+$/.test(path)) return "/planos";
  return "/hoje";
}

export function activeTab(path: string): string {
  return TABS.find((t) => path === t.href || path.startsWith(`${t.href}/`))?.href ?? "/hoje";
}
