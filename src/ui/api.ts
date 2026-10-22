"use client";

import { useCallback, useEffect, useState } from "react";

// U5 / "Erros: algoritmo único do cliente" (UI_UX_SPEC): toda chamada passa por aqui
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const OFFLINE = "Parece que a conexão falhou. Vamos tentar de novo?";
const GENERIC = "Algo não saiu como esperado. Tente de novo em instantes.";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      cache: "no-store",
      headers: { "content-type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, OFFLINE);
  }

  if (res.status === 401) {
    window.location.assign("/?sessao=encerrada");
    throw new ApiError(401, "Sua sessão terminou. Entre novamente para continuar.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, typeof body?.error === "string" ? body.error : GENERIC);
  }
  return (await res.json()) as T;
}

export function useApi<T>(path: string | null) {
  const [state, setState] = useState<{ data?: T; error?: ApiError; loading: boolean }>({ loading: true });

  const load = useCallback(async () => {
    if (!path) return;
    setState((s) => ({ data: s.data, loading: true }));
    try {
      setState({ data: await api<T>(path), loading: false });
    } catch (error) {
      setState({ error: error instanceof ApiError ? error : new ApiError(500, GENERIC), loading: false });
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
