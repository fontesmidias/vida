"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError, useApi } from "@/src/ui/api";
import { ErrorView, Loading, NextStep, useToast } from "@/src/ui/feedback";
import { CheckIcon, LeafIcon } from "@/src/ui/icons";
import { Overlay } from "@/src/ui/Overlay";
import type { PlanDetail } from "@/src/ui/types";

// R4: concluir de novo não muda nada; o último dia abre a celebração. Fluxo guiado: depois de concluir, a Jornada
export default function DiaPage() {
  const { slug, n } = useParams<{ slug: string; n: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data, error, loading, reload } = useApi<PlanDetail>(`/api/plans/${encodeURIComponent(slug)}`);
  const [busy, setBusy] = useState(false);
  const [doneNow, setDoneNow] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  if (error) return <ErrorView message={error.message} onRetry={reload} />;
  if (loading && !data) return <Loading blocks={2} />;
  if (!data) return null;

  const day = data.days.find((d) => String(d.dayNumber) === n);
  if (!day) return <ErrorView message="Não encontramos esse dia." onRetry={() => router.push(`/planos/${slug}`)} />;

  const complete = async () => {
    setBusy(true);
    setActionError(null);
    try {
      const r = await api<{ alreadyCompleted: boolean; plan: PlanDetail }>(
        `/api/plans/${encodeURIComponent(slug)}/days/${day.dayNumber}/complete`,
        { method: "POST" },
      );
      setDoneNow(true);
      if (r.plan.completed && !r.alreadyCompleted) {
        setCelebrate(r.plan.title);
      } else {
        toast("Dia concluído");
        setBusy(false);
      }
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      setBusy(false);
    }
  };

  const done = day.completed || doneNow;
  return (
    <section className="screen" aria-labelledby="t-dia">
      <p className="eyebrow">
        {data.title} · Dia {day.dayNumber} de {data.totalDays}
      </p>
      <h1 id="t-dia" className="h1">
        {day.title}
      </h1>
      <p className="body">{day.body}</p>
      {actionError && (
        <p className="card soft body" role="alert">
          {actionError}
        </p>
      )}
      {done ? (
        <button className="btn done" disabled>
          <CheckIcon />
          Concluído
        </button>
      ) : (
        <button className="btn" onClick={complete} disabled={busy}>
          {busy ? "Concluindo…" : "Concluir dia"}
        </button>
      )}
      {done && (
        <NextStep hint="ver tudo na sua jornada." href="/jornada" label="Ver minha jornada" />
      )}
      {celebrate && <Celebration title={celebrate} />}
    </section>
  );
}

function Celebration({ title }: { title: string }) {
  return (
    <Overlay>
    <div className="celebrate" role="dialog" aria-modal="true" aria-labelledby="t-cel">
      <div className="cel-art" aria-hidden="true">
        <span className="c1" />
        <span className="c2" />
        <span className="c3" />
        <LeafIcon size={72} />
      </div>
      <h2 id="t-cel" className="h1">
        Plano concluído
      </h2>
      <p className="body">{title}: todos os dias percorridos. Que caminho bonito.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: "24rem" }}>
        <Link className="btn" href="/jornada" autoFocus>
          Ver minha jornada
        </Link>
        <Link className="btn quiet" href="/planos">
          Escolher outro plano
        </Link>
      </div>
    </div>
    </Overlay>
  );
}
