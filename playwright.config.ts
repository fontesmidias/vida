import { defineConfig, devices } from "@playwright/test";

// E2E_BASE_URL aponta os testes para a demo pública (ex.: https://vida.fontesmidias.com.br); sem ela, sobe o app local
const publicUrl = process.env.E2E_BASE_URL;

// PRD: fluxo principal coberto por E2E em tela de celular (Chrome/Android e Safari/iPhone)
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: { baseURL: publicUrl ?? "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "android-chrome", use: { ...devices["Pixel 7"] } },
    { name: "iphone-safari", use: { ...devices["iPhone 13"] } },
  ],
  // Testa o build de produção (o mesmo que vai para a VPS), não o modo dev, que compila cada tela na 1ª visita
  webServer: publicUrl
    ? undefined
    : {
        command: "npm run build && npm run start",
        // Safari (WebKit) não guarda cookie secure em http://localhost; em produção (HTTPS) o padrão é secure
        env: { SESSION_COOKIE_SECURE: "false" },
        url: "http://localhost:3000/api/health",
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
