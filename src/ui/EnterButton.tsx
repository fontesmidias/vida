"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "./api";

export function EnterButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enter = async () => {
    setBusy(true);
    setError(null);
    try {
      await api("/api/session/demo", { method: "POST" });
      router.replace("/hoje");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      setBusy(false);
    }
  };

  return (
    <>
      {error && (
        <p className="card soft body" role="alert">
          {error}
        </p>
      )}
      <button className="btn" onClick={enter} disabled={busy}>
        {busy ? "Preparando seu espaço…" : "Entrar como demonstração"}
      </button>
    </>
  );
}
