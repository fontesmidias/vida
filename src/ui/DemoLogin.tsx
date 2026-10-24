"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoAccount, testAccounts } from "@/prisma/seed-data";
import { api, ApiError } from "./api";

type LoginResult = { displayName: string; hasProgress: boolean };

// D29: uma conta de avaliação; a senha vem nas instruções de entrega, nunca na tela. R8: continuar ou começar do zero
// `testAccount` vem de /?conta=e2eN: só os testes automáticos usam, para nunca tocar na conta de avaliação
export function DemoLogin({ testAccount }: { testAccount?: string }) {
  const router = useRouter();
  const { username } = testAccounts.find((a) => a.username === testAccount) ?? demoAccount;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returning, setReturning] = useState<string | null>(null);

  const enter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lido do campo, não de estado: quem digita antes de a página terminar de carregar não perde a senha
    const password = String(new FormData(e.currentTarget).get("senha") ?? "");
    setBusy(true);
    setError(null);
    try {
      const r = await api<LoginResult>("/api/session/demo", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      if (r.hasProgress) {
        setReturning(r.displayName);
        setBusy(false);
      } else {
        router.replace("/hoje");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      setBusy(false);
    }
  };

  const startOver = async () => {
    setBusy(true);
    setError(null);
    try {
      await api("/api/me/reset", { method: "POST" });
      router.replace("/hoje");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Algo não saiu como esperado. Tente de novo em instantes.");
      setBusy(false);
    }
  };

  if (returning) {
    return (
      <div className="card soft" role="status">
        <p className="muted">
          <strong>Que bom ter você de volta.</strong> A conta {returning} já tem registros. Siga de onde parou ou
          recomece: nada é apagado.
        </p>
        {error && (
          <p className="body" role="alert">
            {error}
          </p>
        )}
        <button className="btn" onClick={() => router.replace("/hoje")} disabled={busy}>
          Continuar de onde parou
        </button>
        <button className="btn ghost" onClick={startOver} disabled={busy}>
          {busy ? "Recomeçando…" : "Começar do zero"}
        </button>
      </div>
    );
  }

  return (
    <form className="card login" onSubmit={enter} aria-labelledby="t-acesso">
      <label className="field" htmlFor="senha">
        <span id="t-acesso" className="h2">
          Acesso de avaliação
        </span>
        <span>Use a senha enviada com as instruções.</span>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          placeholder="Digite a senha"
          required
        />
      </label>
      {error && (
        <p className="body" role="alert">
          {error}
        </p>
      )}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
