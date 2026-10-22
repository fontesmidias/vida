"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError, useApi } from "@/src/ui/api";
import { ErrorView, Kicker, Loading, ProgressDots } from "@/src/ui/feedback";
import { MoodIcon } from "@/src/ui/MoodIcon";
import { deviceTimezone, formatCheckinTime } from "@/src/ui/time-format";
import type { CheckinItem, PlanSummary } from "@/src/ui/types";
import Link from "next/link";

type Page = { items: CheckinItem[]; nextCursor: string | null };

// R6: progresso dos planos · R7: check-ins mais recentes, 10 por vez
export default function JornadaPage() {
  const router = useRouter();
  const plans = useApi<{ plans: PlanSummary[] }>("/api/plans");
  const first = useApi<Page>("/api/checkins");
  const [more, setMore] = useState<CheckinItem[]>([]);
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);

  const next = cursor === undefined ? first.data?.nextCursor : cursor;
  const items = [...(first.data?.items ?? []), ...more];
  const tz = deviceTimezone();

  const loadMore = async () => {
    if (!next) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const page = await api<Page>(`/api/checkins?cursor=${encodeURIComponent(next)}`);
      setMore((m) => [...m, ...page.items]);
      setCursor(page.nextCursor);
    } catch (e) {
      setMoreError(e instanceof ApiError ? e.message : "Algo não saiu como esperado. Tente de novo em instantes.");
    } finally {
      setLoadingMore(false);
    }
  };

  const logout = async () => {
    await api("/api/session", { method: "DELETE" }).catch(() => null);
    router.replace("/");
  };

  if (plans.error) return <ErrorView message={plans.error.message} onRetry={plans.reload} />;
  if (first.error) return <ErrorView message={first.error.message} onRetry={first.reload} />;
  if ((plans.loading && !plans.data) || (first.loading && !first.data)) return <Loading blocks={3} />;

  return (
    <section className="screen" aria-labelledby="t-jornada">
      <Kicker letter="A" word="Avançar" />
      <h1 id="t-jornada" className="h1">
        Sua jornada
      </h1>

      <h2 className="h2">Planos</h2>
      <div className="card">
        {plans.data?.plans.map((p) => (
          <div key={p.slug} className="li">
            <span className="grow">
              <span className="li-title">{p.title}</span>
              <ProgressDots done={Array.from({ length: p.totalDays }, (_, i) => i < p.completedDays)} />
            </span>
            {p.completed ? (
              <span className="badge">Concluído</span>
            ) : (
              <span className="small">
                {p.completedDays} de {p.totalDays}
              </span>
            )}
          </div>
        ))}
      </div>

      <h2 className="h2">Check-ins</h2>
      {items.length === 0 ? (
        <div className="card soft">
          <p className="body">Seus check-ins aparecem aqui.</p>
          <Link className="btn" href="/check-in">
            Fazer o primeiro check-in
          </Link>
        </div>
      ) : (
        <div className="card">
          {items.map((c) => (
            <div key={c.id} className="li">
              <MoodIcon slug={c.mood.slug} family={c.mood.family} size={40} />
              <span className="grow">
                <span className="li-title">{c.mood.label}</span>
                <span className="small" suppressHydrationWarning>
                  {formatCheckinTime(c, tz)}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
      {moreError && (
        <p className="card soft body" role="alert">
          {moreError}
        </p>
      )}
      {next && (
        <button className="btn ghost" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Carregando…" : "Carregar mais"}
        </button>
      )}
      <button className="link-btn" onClick={logout}>
        Sair da demonstração
      </button>
    </section>
  );
}
