// Exibição de data/hora (UI_UX_SPEC, "Tempo na tela"): a hora vivida no fuso em que o check-in aconteceu

const PLACES: Record<string, string> = {
  Sao_Paulo: "São Paulo",
  Tokyo: "Tóquio",
  Lisbon: "Lisboa",
  London: "Londres",
  New_York: "Nova York",
  Paris: "Paris",
  Madrid: "Madri",
  Berlin: "Berlim",
  Mexico_City: "Cidade do México",
};

export function placeName(timezone: string): string {
  const city = timezone.split("/").at(-1) ?? timezone;
  return PLACES[city] ?? city.replaceAll("_", " ");
}

function dayInZone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function previousDay(isoDay: string): string {
  const d = new Date(`${isoDay}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function formatCheckinTime(
  item: { createdAt: string | Date; localDate: string; timezone: string },
  deviceTimezone: string,
  now: Date = new Date(),
): string {
  const at = new Date(item.createdAt);
  const time = new Intl.DateTimeFormat("pt-BR", { timeZone: item.timezone, hour: "2-digit", minute: "2-digit" }).format(at);

  const today = dayInZone(now, deviceTimezone);
  const [y, m, d] = item.localDate.split("-");
  let day: string;
  if (item.localDate === today) day = "Hoje";
  else if (item.localDate === previousDay(today)) day = "Ontem";
  else day = y === today.slice(0, 4) ? `${d}/${m}` : `${d}/${m}/${y}`;

  const where = item.timezone === deviceTimezone ? "" : ` · horário de ${placeName(item.timezone)}`;
  return `${day}, ${time}${where}`;
}

export function deviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
  } catch {
    return "America/Sao_Paulo";
  }
}
