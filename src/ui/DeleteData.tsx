"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { Overlay } from "./Overlay";

// D19 (LGPD): apagar os próprios dados, com confirmação clara e sem diálogo nativo do navegador
export function DeleteDataButton() {
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
      await api("/api/me", { method: "DELETE" });
      window.location.assign("/?dados=apagados");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      setBusy(false);
    }
  };

  return (
    <>
      <button className="link-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Apagar meus dados
      </button>
      {open && (
        <Overlay>
        <div className="scrim" onClick={() => !busy && setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apagar-t"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grip" aria-hidden="true" />
            <h2 id="apagar-t" className="h2">
              Apagar todos os seus dados?
            </h2>
            <p className="muted">
              Seus check-ins e o progresso nos planos saem de forma definitiva, e esta sessão termina. Isso não pode ser
              desfeito.
            </p>
            {error && (
              <p className="card soft body" role="alert">
                {error}
              </p>
            )}
            <button className="btn danger" onClick={confirm} disabled={busy}>
              {busy ? "Apagando…" : "Apagar definitivamente"}
            </button>
            <button className="btn quiet" onClick={() => setOpen(false)} disabled={busy} autoFocus>
              Manter meus dados
            </button>
          </div>
        </div>
        </Overlay>
      )}
    </>
  );
}
