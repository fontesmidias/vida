"use client";

import Link from "next/link";
import { useApi } from "@/src/ui/api";
import { ErrorView, Kicker, Loading, ProgressDots } from "@/src/ui/feedback";
import { ChevronIcon, LeafIcon } from "@/src/ui/icons";
import type { PlanSummary } from "@/src/ui/types";

const dots = (p: PlanSummary) => Array.from({ length: p.totalDays }, (_, i) => i < p.completedDays);

// R6: progresso como conquista ("2 de 5"), nunca como falta
export default function PlanosPage() {
  const { data, error, loading, reload } = useApi<{ plans: PlanSummary[] }>("/api/plans");

  if (error) return <ErrorView message={error.message} onRetry={reload} />;
  if (loading && !data) return <Loading />;

  return (
    <section className="screen" aria-labelledby="t-planos">
      <Kicker letter="A" word="Avançar" />
      <h1 id="t-planos" className="h1">
        Planos
      </h1>
      <p className="muted">Escolha um plano para seguir no seu ritmo.</p>
      {data?.plans.map((p) => (
        <Link key={p.slug} href={`/planos/${p.slug}`} className="card plan">
          <span className="row">
            <span className="plan-ic" aria-hidden="true">
              <LeafIcon size={26} />
            </span>
            <span className="grow">
              <span className="h2">{p.title}</span>
              <span className="small">{p.description}</span>
            </span>
            <ChevronIcon />
          </span>
          <span className="row">
            <ProgressDots done={dots(p)} />
            <span className="small">
              {p.completed ? "Concluído" : `${p.completedDays} de ${p.totalDays} dias concluídos`}
            </span>
          </span>
        </Link>
      ))}
    </section>
  );
}
