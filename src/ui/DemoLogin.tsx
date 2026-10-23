"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEMO_PASSWORD, demoAccounts, testAccounts } from "@/prisma/seed-data";
import { api, ApiError } from "./api";

type LoginResult = { displayName: string; hasProgress: boolean };

// D26/D28: escolher a conta por toque, digitar a senha exibida; R8: continuar ou começar do zero
// `testAccount` vem de /?conta=e2eN: só os testes automáticos usam, para nunca tocar nas contas de avaliação
export function DemoLogin({ testAccount }: { testAccount?: string }) {
  const router = useRouter();
  const extra = testAccounts.find((a) => a.username === testAccount);
  const accounts = extra ? [extra] : demoAccounts;
  const [username, setUsername] = useState(accounts[0].username);
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
        <p className="h2">Que bom ter você de volta.</p>
        <p className="muted">
          A conta <strong>{returning}</strong> já tem registros. Você pode seguir de onde parou ou recomeçar a jornada.
          Recomeçar não apaga nada: só abre uma página nova.
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
    <form className="card login" onSubmit={enter} aria-labelledby="t-contas">
      <p id="t-contas" className="h2">
        Contas de demonstração
      </p>
      <div className="accounts" role="radiogroup" aria-label="Escolha uma conta">
        {accounts.map((a) => (
          <button
            key={a.username}
            type="button"
            role="radio"
            aria-checked={username === a.username}
            className="acc"
            onClick={() => setUsername(a.username)}
          >
            <span className="acc-n">{a.displayName}</span>
            <span className="acc-u">{a.username}</span>
          </button>
        ))}
      </div>
      <label className="field" htmlFor="senha">
        <span>
          Senha: <strong className="pw">{DEMO_PASSWORD}</strong>
        </span>
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
      <p className="small">Três contas para quem avalia testar ao mesmo tempo, cada uma com a própria jornada.</p>
    </form>
  );
}
