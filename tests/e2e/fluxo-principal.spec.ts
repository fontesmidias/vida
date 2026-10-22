import { expect, test, type Page } from "@playwright/test";

const shots = (name: string) => `test-results/telas/${test.info().project.name}-${name}.png`;

// U12: a barra inferior fixa nunca cobre o último elemento da tela
async function expectNothingUnderNav(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const nav = await page.locator("nav.nav").boundingBox();
  const last = await page.locator("main section > *:last-child").last().boundingBox();
  expect(nav && last).toBeTruthy();
  expect(last!.y + last!.height).toBeLessThanOrEqual(nav!.y);
}

// PRD, "Fluxo principal": entrar → check-in → Hoje → concluir Dia 1 → Jornada → recarregar
test("fluxo principal do desafio", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Um momento para você." })).toBeVisible();
  await expect(page.getByText("Não substitui o acompanhamento profissional")).toBeVisible(); // C3
  await page.screenshot({ path: shots("1-entrada"), fullPage: true });

  // 1. Entrar como demonstração
  await page.getByRole("button", { name: "Entrar como demonstração" }).click();
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByText("Um momento para você.")).toBeVisible(); // R3: conteúdo neutro

  // 2. Check-in: um toque registra
  await page.getByRole("link", { name: "Fazer check-in" }).click();
  await expect(page.getByRole("heading", { name: "Como você está agora?" })).toBeVisible();
  await page.screenshot({ path: shots("2-check-in"), fullPage: true });
  await page.getByRole("button", { name: "Com ansiedade" }).click();

  // 3. Hoje coerente com o check-in (R2/R3)
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByText("Nem tudo precisa ser resolvido agora.")).toBeVisible();
  await expect(page.getByText("Respiração 4-6")).toBeVisible();
  await page.screenshot({ path: shots("3-hoje"), fullPage: true });
  await expectNothingUnderNav(page);

  // 4. Abrir um plano e concluir o Dia 1
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Planos" }).click();
  await page.getByRole("link", { name: /Respirar com calma/ }).click();
  await expect(page.getByRole("link", { name: /Dia 1: .*próximo sugerido/ })).toBeVisible(); // R5
  await page.screenshot({ path: shots("4-plano"), fullPage: true });
  await expectNothingUnderNav(page);
  await page.getByRole("link", { name: /Dia 1:/ }).click();
  await expect(page.getByRole("link", { name: "Voltar" })).toBeVisible(); // U9
  await page.getByRole("button", { name: "Concluir dia" }).click();
  await expect(page.getByRole("link", { name: /Dia 1: .*concluído/ })).toBeVisible();
  await expect(page.getByText("1 de 5 dias concluídos")).toBeVisible(); // R6

  // 5. Minha Jornada mostra check-in e conclusão
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Jornada" }).click();
  await expect(page.getByText("Com ansiedade")).toBeVisible();
  await expect(page.getByText(/^Hoje, \d{2}:\d{2}$/)).toBeVisible();
  await expect(page.getByText("1 de 5")).toBeVisible();
  await page.screenshot({ path: shots("5-jornada"), fullPage: true });
  await expectNothingUnderNav(page);

  // 6. Recarregar: dados persistidos no Postgres
  await page.reload();
  await expect(page.getByText("Com ansiedade")).toBeVisible();
  await expect(page.getByText("1 de 5")).toBeVisible();
});

test("apoio: CVV por extenso, a um toque (C1, D16)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Apoio" }).click();
  const dialog = page.getByRole("dialog", { name: "Quer conversar com alguém?" });
  await expect(dialog.getByText("Centro de Valorização da Vida")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Ligar para o 188" })).toHaveAttribute("href", "tel:188");
  await page.screenshot({ path: shots("6-apoio") });
  await dialog.getByRole("button", { name: "Fechar" }).click();
  await expect(dialog).toBeHidden();
});

test("prática guiada abre sem barra inferior e pode ser encerrada (D17)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Entrar como demonstração" }).click();
  await page.getByRole("link", { name: "Começar" }).click();
  await expect(page).toHaveURL(/\/pratica$/);
  await expect(page.locator("nav.nav")).toHaveCount(0);
  await expect(page.getByText(/Inspire…|Solte o ar…|Prepare-se/)).toBeVisible();
  await page.screenshot({ path: shots("7-pratica") });
  await page.getByRole("button", { name: "Encerrar" }).click();
  await expect(page).toHaveURL(/\/hoje$/);
});

test("sem sessão, telas internas voltam para a Entrada (S2)", async ({ page }) => {
  await page.goto("/jornada");
  await expect(page).toHaveURL(/\/$/);
});
