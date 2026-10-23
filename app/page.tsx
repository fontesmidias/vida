import { redirect } from "next/navigation";
import { currentUser } from "@/src/lib/auth";
import { Header } from "@/src/ui/AppFrame";
import { DemoLogin } from "@/src/ui/DemoLogin";

// Entrada: proposta, sigla (D18), aviso de cuidado (C3) e contas de demonstração (C2, D26)
export default async function Entrada({ searchParams }: { searchParams: Promise<{ sessao?: string; dados?: string; conta?: string }> }) {
  if (await currentUser()) redirect("/hoje");
  const params = await searchParams;
  const sessionEnded = params.sessao === "encerrada";
  const dataDeleted = params.dados === "apagados"; // D19

  return (
    <div className="shell">
      <div className="hero" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <Header path="/" />
      <main className="content no-nav">
        <section className="screen entrada" aria-labelledby="t-entrada">
          <span className="badge">Demonstração</span>
          <h1 id="t-entrada" className="display">
            Um momento para você.
          </h1>
          <ul className="acro" aria-label="O que significa VIDA">
            {[
              ["V", "Ver"],
              ["I", "Inspirar"],
              ["D", "Desacelerar"],
              ["A", "Avançar"],
            ].map(([l, w]) => (
              <li key={l}>
                <span className="acro-l" aria-hidden="true">
                  {l}
                </span>
                <span className="acro-w">{w}</span>
              </li>
            ))}
          </ul>
          <p className="muted">Veja como você está, inspire-se, desacelere e avance no seu ritmo.</p>
          {dataDeleted && (
            <p className="card soft body" role="status">
              Seus dados foram apagados.
            </p>
          )}
          {sessionEnded && (
            <p className="card soft body" role="status">
              Sua sessão terminou. Entre novamente para continuar.
            </p>
          )}
          <DemoLogin testAccount={params.conta} />
          <p className="small">Um espaço de autocuidado. Não substitui o acompanhamento profissional.</p>
        </section>
      </main>
    </div>
  );
}
