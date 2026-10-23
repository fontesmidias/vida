"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { useToast } from "./feedback";
import { Overlay } from "./Overlay";

// R8/D27: recomeçar a jornada sem apagar nada (diferente de "Apagar meus dados", D19)
export function StartOverButton() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || busy) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await api("/api/me/reset", { method: "POST" });
      toast("Jornada recomeçada");
      router.push("/hoje");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      setBusy(false);
    }
  };

  return (
    <>
      <button className="btn ghost" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Começar do zero
      </button>
      {open && (
        <Overlay>
          <div className="scrim" onClick={() => !busy && setOpen(false)}>
            <div
              className="sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="recomecar-t"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="grip" aria-hidden="true" />
              <h2 id="recomecar-t" className="h2">
                Começar a jornada do zero?
              </h2>
              <p className="muted">
                Hoje, planos e jornada voltam ao início. Nada é apagado: os registros anteriores ficam guardados, só não
                aparecem mais aqui.
              </p>
              {error && (
                <p className="card soft body" role="alert">
                  {error}
                </p>
              )}
              <button className="btn" onClick={confirm} disabled={busy}>
                {busy ? "Recomeçando…" : "Começar do zero"}
              </button>
              <button className="btn quiet" onClick={() => setOpen(false)} disabled={busy} autoFocus>
                Continuar de onde parei
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}
