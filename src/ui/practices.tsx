"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckIcon, DropIcon, HeartIcon, LeafIcon, StretchIcon, WindowIcon } from "./icons";

// D17 / U10: práticas guiadas, um passo por vez, que levam a pessoa para fora da tela
type Kind = "breath" | "heart" | "tiny" | "three";

const END_TEXT: Record<Kind, string> = {
  breath: "Pronto. Leve essa calma com você.",
  heart: "Pronto. Você fez algo gentil por você.",
  tiny: "Que bom. Um passo de cada vez.",
  three: "Guarde essas três com você.",
};

const HEART_WORDS = [
  "Estou fazendo o que posso.",
  "Posso ir com calma.",
  "Mereço gentileza.",
  "Um passo de cada vez.",
  "Estou aqui, agora.",
  "Posso pedir ajuda.",
];

const IN_MS = 4000;
const OUT_MS = 6000;
export const cyclesFor = (minutes: number) => Math.max(1, Math.round((minutes * 60_000) / (IN_MS + OUT_MS)));

export function Practice({ kind, minutes, onFinish }: { kind: Kind; minutes: number; onFinish: () => void }) {
  const [ended, setEnded] = useState(false);
  const end = useCallback(() => setEnded(true), []);

  if (ended) {
    return (
      <>
        <div className="end-blob" aria-hidden="true">
          <CheckIcon size={56} />
        </div>
        <p className="say">{END_TEXT[kind]}</p>
        <button className="btn" style={{ width: "100%" }} onClick={onFinish}>
          Concluir
        </button>
      </>
    );
  }

  return (
    <>
      {kind === "breath" || kind === "heart" ? (
        <Breath heart={kind === "heart"} cycles={cyclesFor(minutes)} onEnd={end} />
      ) : kind === "tiny" ? (
        <Tiny onEnd={end} />
      ) : (
        <Three onEnd={end} />
      )}
      <button className="link-btn" onClick={onFinish}>
        Encerrar
      </button>
    </>
  );
}

// 4 s inspirando (círculo cresce), 6 s soltando (círculo diminui)
function Breath({ heart, cycles, onEnd }: { heart: boolean; cycles: number; onEnd: () => void }) {
  const [phase, setPhase] = useState<"ready" | "in" | "out">("ready");
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "ready") t = setTimeout(() => setPhase("in"), 400);
    else if (phase === "in") t = setTimeout(() => setPhase("out"), IN_MS);
    else
      t = setTimeout(() => {
        if (cycle >= cycles) onEnd();
        else {
          setCycle((c) => c + 1);
          setPhase("in");
        }
      }, OUT_MS);
    return () => clearTimeout(t);
  }, [phase, cycle, cycles, onEnd]);

  const say = heart
    ? HEART_WORDS[(cycle - 1) % HEART_WORDS.length]
    : phase === "in"
      ? "Inspire…"
      : phase === "out"
        ? "Solte o ar…"
        : "Prepare-se";

  return (
    <>
      <div className="stage" aria-hidden="true">
        <div className="bc" data-phase={phase === "ready" ? "out" : phase}>
          {heart && <HeartIcon size={64} />}
        </div>
      </div>
      <p key={heart ? cycle : phase} className="say" aria-live="polite">
        {say}
      </p>
      <p className="small">
        {heart ? "Mão no peito. Respire devagar." : "Acompanhe o círculo."} {cycle} de {cycles}
      </p>
    </>
  );
}

const TINY = [
  { key: "agua", label: "Beber água", icon: <DropIcon size={28} /> },
  { key: "janela", label: "Abrir a janela", icon: <WindowIcon size={28} /> },
  { key: "alongar", label: "Alongar o corpo", icon: <StretchIcon size={28} /> },
  { key: "planta", label: "Olhar uma planta", icon: <LeafIcon size={28} /> },
];

function Tiny({ onEnd }: { onEnd: () => void }) {
  const [picked, setPicked] = useState<(typeof TINY)[number] | null>(null);

  if (picked) {
    return (
      <>
        <div className="wait-blob" aria-hidden="true">
          <LeafIcon size={56} />
        </div>
        <p className="say">{picked.label}</p>
        <p className="muted">Vá com calma. Eu espero aqui.</p>
        <button className="btn" style={{ width: "100%" }} onClick={onEnd}>
          Fiz
        </button>
      </>
    );
  }
  return (
    <>
      <p className="say">Escolha uma coisa pequena</p>
      <div className="tiny">
        {TINY.map((o) => (
          <button key={o.key} className="tiny-b" onClick={() => setPicked(o)}>
            <span className="tiny-ic" aria-hidden="true">
              {o.icon}
            </span>
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}

const THREE_SAY = ["Pense em algo bom de hoje.", "Mais uma.", "A última."];

function Three({ onEnd }: { onEnd: () => void }) {
  const [count, setCount] = useState(0);
  const tap = () => {
    if (count + 1 >= 3) onEnd();
    else setCount(count + 1);
  };
  return (
    <>
      <div className="dots3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="d3" data-on={i < count} />
        ))}
      </div>
      <p key={count} className="say" aria-live="polite">
        {THREE_SAY[count]}
      </p>
      <p className="muted">Quando pensar, toque abaixo.</p>
      <button className="btn" style={{ width: "100%" }} onClick={tap}>
        Pensei
      </button>
    </>
  );
}
