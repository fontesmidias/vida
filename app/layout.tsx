import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

// Fonte variável: um único arquivo cobre todos os pesos usados (400 a 800)
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIDA · Ver, Inspirar, Desacelerar, Avançar",
  description: "Um momento para você: conte como está e receba uma pausa curta para o seu dia.",
};

// U12: ocupa a tela toda e respeita as áreas seguras (recorte da câmera, barra de gestos)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#121816" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tema escolhido manualmente fica em cookie e é aplicado no servidor: sem script inline e sem piscar
  const theme = (await cookies()).get("vida-theme")?.value;
  const dataTheme = theme === "light" || theme === "dark" ? theme : undefined;

  return (
    <html lang="pt-BR" data-theme={dataTheme}>
      <body className={`${nunito.variable} antialiased`}>{children}</body>
    </html>
  );
}
