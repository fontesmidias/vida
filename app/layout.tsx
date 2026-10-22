import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIDA",
  description: "Um espaço de autocuidado e reflexão para o seu dia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased min-h-dvh flex flex-col`}>
        <div className="flex-1">{children}</div>
        {/* C1: rodapé fixo com o CVV */}
        <footer className="px-4 py-3 text-center text-xs text-neutral-600 border-t">
          Em sofrimento intenso? Ligue 188 (CVV), 24 horas, gratuito.
        </footer>
      </body>
    </html>
  );
}
