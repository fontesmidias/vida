"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Camadas (painéis, celebração) são renderizadas direto no <body>: dentro de uma tela animada,
// um elemento position:fixed ficaria preso à área da tela em vez de cobrir a janela inteira.
export function Overlay({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
