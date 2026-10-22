// Utilitários da camada HTTP (app/api). Services não importam este arquivo.

// CSRF: em escrita, o Origin enviado pelo navegador precisa ser o próprio site.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: { "cache-control": "no-store" } });
}

export const forbidden = () => jsonError(403, "Não foi possível concluir esta ação.");

// S5: detalhe só no log do servidor; a pessoa recebe uma mensagem amigável
export function internalError(context: string, error: unknown) {
  console.error(`[${context}]`, error);
  return jsonError(500, "Algo não saiu como esperado. Tente de novo em instantes.");
}
