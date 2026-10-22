"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastProvider } from "./feedback";
import { BackIcon, HeartIcon, LeafIcon, MoonIcon, PathIcon, PhoneIcon, SunIcon, SupportIcon } from "./icons";
import { activeTab, parentOf, TABS } from "./navigation";

const TAB_ICONS: Record<string, React.ReactNode> = {
  "/hoje": <SunIcon size={24} />,
  "/check-in": <HeartIcon size={24} />,
  "/planos": <LeafIcon size={24} />,
  "/jornada": <PathIcon size={24} />,
};

// Telas imersivas (prática guiada) escondem a barra inferior
const IMMERSIVE = new Set(["/pratica"]);

export function AppFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const immersive = IMMERSIVE.has(path);
  return (
    <ToastProvider>
      <div className="shell">
        <Header path={path} />
        <main className={immersive ? "content no-nav" : "content"}>{children}</main>
      </div>
      {!immersive && <BottomNav path={path} />}
    </ToastProvider>
  );
}

export function Header({ path }: { path: string }) {
  const parent = parentOf(path);
  return (
    <header className="top">
      {parent ? (
        <Link className="back" href={parent}>
          <BackIcon />
          Voltar
        </Link>
      ) : (
        <span className="brand" aria-label="VIDA">
          vida
        </span>
      )}
      <div className="top-r">
        <SupportButton />
        <ThemeToggle />
      </div>
    </header>
  );
}

function BottomNav({ path }: { path: string }) {
  const active = activeTab(path);
  return (
    <nav className="nav" aria-label="Navegação principal">
      <div className="nav-in">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className="nav-btn" aria-current={active === t.href ? "page" : undefined}>
            {TAB_ICONS[t.href]}
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// C1 / D16: apoio discreto, sempre a um toque
export function SupportButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className="icon-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <SupportIcon />
        Apoio
      </button>
      {open && (
        <div className="scrim" onClick={() => setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apoio-t"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grip" aria-hidden="true" />
            <h2 id="apoio-t" className="h2">
              Quer conversar com alguém?
            </h2>
            <p className="muted">O CVV, Centro de Valorização da Vida, escuta você a qualquer hora, de graça e em sigilo.</p>
            <a className="btn" href="tel:188">
              <PhoneIcon />
              Ligar para o 188
            </a>
            <button className="btn quiet" onClick={() => setOpen(false)} autoFocus>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Preferência manual em cookie, lida pelo layout no servidor; sem escolha, segue o sistema
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const explicit = document.documentElement.dataset.theme;
    setDark(explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.cookie = `vida-theme=${next}; path=/; max-age=31536000; samesite=lax`;
    setDark(!dark);
  };

  return (
    <button className="icon-btn" onClick={toggle} aria-label={dark ? "Mudar para o modo claro" : "Mudar para o modo escuro"}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
