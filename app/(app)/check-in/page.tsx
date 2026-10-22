"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError, useApi } from "@/src/ui/api";
import { ErrorView, Kicker, useToast } from "@/src/ui/feedback";
import { MoodIcon } from "@/src/ui/MoodIcon";
import { deviceTimezone } from "@/src/ui/time-format";
import type { Mood } from "@/src/ui/types";

// R1: um toque registra; o dispositivo informa o fuso, o servidor registra o instante
export default function CheckinPage() {
  const router = useRouter();
  const toast = useToast();
  const { data, error, loading, reload } = useApi<{ moods: Mood[] }>("/api/moods");
  const [sending, setSending] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const pick = async (slug: string) => {
    if (sending) return;
    setSending(slug);
    setSendError(null);
    try {
      await api("/api/checkins", { method: "POST", body: JSON.stringify({ moodSlug: slug, timezone: deviceTimezone() }) });
      toast("Check-in registrado");
      router.push("/hoje");
    } catch (e) {
      // 400 aqui significa que o catálogo mudou (D6): atualiza a lista
      if (e instanceof ApiError && e.status === 400) {
        setSendError("Esse estado não está mais disponível. Atualizamos a lista para você.");
        void reload();
      } else {
        setSendError(e instanceof ApiError ? e.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      }
      setSending(null);
    }
  };

  if (error) return <ErrorView message={error.message} onRetry={reload} />;

  return (
    <section className="screen" aria-labelledby="t-checkin">
      <Kicker letter="V" word="Ver" />
      <h1 id="t-checkin" className="h1">
        Como você está agora?
      </h1>
      <p className="muted">Toque no que mais combina com você.</p>
      {sendError && (
        <p className="card soft body" role="alert">
          {sendError}
        </p>
      )}
      {loading && !data ? (
        <div className="moods" aria-busy="true" aria-label="Carregando">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton" style={{ minHeight: 118 }} />
          ))}
        </div>
      ) : (
        <div className="moods">
          {data?.moods.map((m) => (
            <button
              key={m.slug}
              className="mood"
              onClick={() => pick(m.slug)}
              disabled={!!sending}
              data-state={sending === m.slug ? "sending" : sending ? "dim" : undefined}
              aria-label={sending === m.slug ? `${m.label}, registrando` : m.label}
            >
              <MoodIcon slug={m.slug} family={m.family} size={52} />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
