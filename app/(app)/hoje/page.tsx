"use client";

import Link from "next/link";
import { useApi } from "@/src/ui/api";
import { DemoTag, ErrorView, Kicker, Loading, NextStep } from "@/src/ui/feedback";
import { BreathIcon, DotsIcon, DropIcon, HeartIcon, PlayIcon } from "@/src/ui/icons";
import { MoodIcon } from "@/src/ui/MoodIcon";
import { deviceTimezone } from "@/src/ui/time-format";
import type { Today } from "@/src/ui/types";

const PRACTICE_ICON = {
  breath: <BreathIcon size={28} />,
  heart: <HeartIcon size={28} />,
  tiny: <DropIcon size={28} />,
  three: <DotsIcon size={28} />,
};

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

// R2/R3: reflexão e prática conforme o último check-in do dia no fuso do dispositivo
export default function HojePage() {
  const { data, error, loading, reload } = useApi<Today>(`/api/today?tz=${encodeURIComponent(deviceTimezone())}`);

  if (error) return <ErrorView message={error.message} onRetry={reload} />;
  if (loading && !data) return <Loading />;
  if (!data) return null;

  const { checkin, content } = data;
  return (
    <section className="screen" aria-labelledby="t-hoje">
      <div className="row-between">
        <h1 id="t-hoje" className="h1">
          Hoje
        </h1>
        <p className="eyebrow" suppressHydrationWarning>
          {greeting()}
        </p>
      </div>

      {checkin ? (
        <div className="chip">
          <MoodIcon slug={checkin.mood.slug} family={checkin.mood.family} size={40} />
          <span className="chip-t">{checkin.mood.label}</span>
          <Link className="link-btn" href="/check-in">
            Mudar
          </Link>
        </div>
      ) : (
        <div className="card soft">
          <p className="h2">Como você está?</p>
          <Link className="btn" href="/check-in">
            <HeartIcon />
            Fazer check-in
          </Link>
        </div>
      )}

      <article className="card">
        <div className="row-between">
          <Kicker letter="I" word="Inspirar" />
          <DemoTag />
        </div>
        <p className="quote">{content.reflectionTitle}</p>
        <p className="muted">{content.reflectionBody}</p>
      </article>

      <article className="card">
        <div className="row-between">
          <Kicker letter="D" word="Desacelerar" />
          <span className="small">{content.practiceMinutes} min</span>
        </div>
        <div className="prac">
          <div className={content.practiceKind === "breath" ? "prac-ic anim" : "prac-ic"} aria-hidden="true">
            {PRACTICE_ICON[content.practiceKind] ?? PRACTICE_ICON.breath}
          </div>
          <span className="li-title grow">{content.practiceTitle}</span>
          <Link className="btn ghost sm" href="/pratica">
            <PlayIcon size={18} />
            Começar
          </Link>
        </div>
      </article>

      {checkin && <NextStep hint="o Dia 1 de um plano." href="/planos" label="Ver planos" />}
    </section>
  );
}
