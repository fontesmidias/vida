"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useState } from "react";
import { CheckIcon, ChevronIcon } from "./icons";

// Aviso curto de sucesso, acima da barra inferior (U12)
const ToastContext = createContext<(text: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);
  const show = useCallback((text: string) => {
    const key = Date.now();
    setToast({ text, key });
    setTimeout(() => setToast((t) => (t?.key === key ? null : t)), 2700);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div key={toast.key} className="toast" role="status">
          <CheckIcon size={20} />
          <span>{toast.text}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// U5: carregando / erro com saída
export function Loading({ blocks = 2 }: { blocks?: number }) {
  return (
    <div className="screen" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: blocks }, (_, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 64 : 150 }} />
      ))}
    </div>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="screen card soft" role="alert">
      <p className="body">{message}</p>
      <button className="btn" onClick={onRetry}>
        Tentar de novo
      </button>
    </div>
  );
}

export function ProgressDots({ done }: { done: boolean[] }) {
  return (
    <span className="pdots" aria-hidden="true">
      {done.map((on, i) => (
        <span key={i} className="pd" data-on={on} />
      ))}
    </span>
  );
}

export function Kicker({ letter, word }: { letter: string; word: string }) {
  return (
    <p className="kicker">
      <span className="kl" aria-hidden="true">
        {letter}
      </span>
      {word}
    </p>
  );
}

// Fluxo guiado (desafio, seção 03): cada etapa termina apontando a próxima, com verbo (U13)
export function NextStep({ hint, href, label }: { hint: string; href: string; label: string }) {
  return (
    <div className="next">
      <p className="small">
        <strong>Próximo passo:</strong> {hint}
      </p>
      <Link className="btn" href={href}>
        {label}
        <ChevronIcon />
      </Link>
    </div>
  );
}

// C2: conteúdo fictício sempre identificado
export function DemoTag() {
  return <span className="tag">Demonstração</span>;
}
