import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor enxuto (server.js + só as dependências usadas) para a imagem Docker
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
