// S7: público e mínimo; nada de versão, banco ou ambiente.
export function GET() {
  return Response.json({ status: "ok" }, { headers: { "cache-control": "no-store" } });
}
