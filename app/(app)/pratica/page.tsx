"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/src/ui/api";
import { ErrorView, Kicker, Loading } from "@/src/ui/feedback";
import { Practice } from "@/src/ui/practices";
import { deviceTimezone } from "@/src/ui/time-format";
import type { Today } from "@/src/ui/types";

// D17: a prática do dia, guiada em tela cheia (sem barra inferior)
export default function PraticaPage() {
  const router = useRouter();
  const { data, error, loading, reload } = useApi<Today>(`/api/today?tz=${encodeURIComponent(deviceTimezone())}`);

  if (error) return <ErrorView message={error.message} onRetry={reload} />;
  if (loading && !data) return <Loading blocks={1} />;
  if (!data) return null;

  return (
    <section className="screen guide" aria-label={data.content.practiceTitle}>
      <Kicker letter="D" word="Desacelerar" />
      <Practice
        kind={data.content.practiceKind}
        minutes={data.content.practiceMinutes}
        onFinish={() => router.push("/hoje")}
      />
    </section>
  );
}
