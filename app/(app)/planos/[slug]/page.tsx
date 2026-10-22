"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApi } from "@/src/ui/api";
import { ErrorView, Loading, ProgressDots } from "@/src/ui/feedback";
import { CheckIcon } from "@/src/ui/icons";
import type { PlanDetail } from "@/src/ui/types";

// R5: qualquer dia pode ser aberto; o primeiro não concluído é o "Próximo"
export default function PlanoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, error, loading, reload } = useApi<PlanDetail>(`/api/plans/${encodeURIComponent(slug)}`);

  if (error) return <ErrorView message={error.message} onRetry={reload} />;
  if (loading && !data) return <Loading blocks={3} />;
  if (!data) return null;

  return (
    <section className="screen" aria-labelledby="t-plano">
      <h1 id="t-plano" className="h1">
        {data.title}
      </h1>
      <div className="row">
        <ProgressDots done={data.days.map((d) => d.completed)} />
        <span className="small">
          {data.completedDays} de {data.totalDays} dias concluídos
        </span>
      </div>
      {data.completed && (
        <p className="card soft body">Você percorreu todos os dias deste plano. Que caminho bonito.</p>
      )}
      <p className="muted">Toque em um dia para abrir. Pode ser em qualquer ordem.</p>
      <div className="days">
        {data.days.map((d) => {
          const suggested = d.dayNumber === data.suggestedDay;
          return (
            <Link
              key={d.dayNumber}
              href={`/planos/${data.slug}/dia/${d.dayNumber}`}
              className="day-b"
              data-suggested={suggested}
              aria-label={`Dia ${d.dayNumber}: ${d.title}${d.completed ? ", concluído" : suggested ? ", próximo sugerido" : ""}`}
            >
              <span className="num" data-ok={d.completed} aria-hidden="true">
                {d.completed ? <CheckIcon /> : d.dayNumber}
              </span>
              <span className="day-t">{d.title}</span>
              {suggested && <span className="badge">Próximo</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
