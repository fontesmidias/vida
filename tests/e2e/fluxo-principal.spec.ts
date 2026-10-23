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

// D29: a senha vem do ambiente, nunca do código nem da tela
const SENHA = process.env.DEMO_PASSWORD ?? "";

// D26: cada navegador de teste usa a própria conta de teste (nunca as de avaliação)
const conta = () => (test.info().project.name === "iphone-safari" ? "e2e2" : "e2e1");

// Entra pela Entrada real e começa sempre de um ciclo limpo (R8), para o teste não depender de execuções anteriores
async function entrar(page: Page, username = conta()) {
  await page.goto(`/?conta=${username}`);
  await page.getByPlaceholder("Digite a senha").fill(SENHA);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  const continuar = page.getByRole("button", { name: "Continuar de onde parou" });
  // O primeiro carregamento depois do login (Hoje + dados) é o mais pesado: espera maior só aqui
  await expect(continuar.or(page.getByRole("heading", { name: "Hoje", exact: true }))).toBeVisible({ timeout: 20_000 });
  if (await continuar.isVisible()) await page.getByRole("button", { name: "Começar do zero" }).click();
  await expect(page).toHaveURL(/\/hoje$/);
}

// PRD, "Fluxo principal": entrar → check-in → Hoje → concluir Dia 1 → Jornada → recarregar
test("fluxo principal do desafio", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Um momento para você." })).toBeVisible();
  await expect(page.getByText("Não substitui o acompanhamento profissional")).toBeVisible(); // C3
  await page.screenshot({ path: shots("1-entrada"), fullPage: true });

  // 1. Entrar com a conta de avaliação (D29): a senha não aparece na tela
  expect(SENHA.length).toBeGreaterThanOrEqual(8);
  await expect(page.getByText(SENHA)).toHaveCount(0);
  await entrar(page);
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

  // Passo 3 do roteiro: "Começar" abre a respiração guiada (D17)
  await page.getByRole("link", { name: "Começar" }).click();
  await expect(page).toHaveURL(/\/pratica$/);
  await expect(page.getByText(/Inspire…|Solte o ar…|Prepare-se/)).toBeVisible();
  await page.getByRole("button", { name: "Encerrar" }).click();
  await expect(page).toHaveURL(/\/hoje$/);

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
  await entrar(page);
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

test("LGPD: apagar meus dados remove tudo e encerra a sessão (D19)", async ({ page }) => {
  await entrar(page);
  await page.getByRole("link", { name: "Fazer check-in" }).click();
  await page.getByRole("button", { name: "Em paz" }).click();
  await expect(page).toHaveURL(/\/hoje$/);

  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Jornada" }).click();
  await expect(page.getByText("Em paz")).toBeVisible();
  await page.getByRole("button", { name: "Apagar meus dados" }).click();

  // Confirmação explícita, sem diálogo nativo do navegador
  const dialog = page.getByRole("dialog", { name: "Apagar todos os seus dados?" });
  await expect(dialog).toBeVisible();
  const box = await dialog.locator("xpath=..").boundingBox();
  expect(box).toMatchObject({ x: 0, y: 0 }); // a camada cobre a janela, não só a tela
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/telas/${test.info().project.name}-8-apagar.png` });
  await dialog.getByRole("button", { name: "Apagar definitivamente" }).click();

  await expect(page).toHaveURL(/\/\?dados=apagados$/);
  await expect(page.getByText("Seus dados foram apagados.")).toBeVisible();

  // A sessão acabou: as telas internas voltam para a Entrada
  await page.goto("/jornada");
  await expect(page).toHaveURL(/\/$/);
});

test("celebração cobre a tela inteira ao concluir o último dia do plano", async ({ page }) => {
  await entrar(page);
  for (let dia = 1; dia <= 5; dia++) {
    await page.goto(`/planos/respirar-com-calma/dia/${dia}`);
    await page.getByRole("button", { name: "Concluir dia" }).click();
    if (dia < 5) await expect(page).toHaveURL(/\/planos\/respirar-com-calma$/);
  }
  const cel = page.getByRole("dialog", { name: "Plano concluído" });
  await expect(cel).toBeVisible();
  // A camada cobre a janela toda, não só a área da tela (bug de position:fixed dentro de tela animada)
  const box = await cel.boundingBox();
  const vp = page.viewportSize()!;
  expect(box).toMatchObject({ x: 0, y: 0, width: vp.width, height: vp.height });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `test-results/telas/${test.info().project.name}-9-celebracao.png` });
});

test("S2: uma pessoa não vê os dados de outra", async ({ browser }) => {
  const a = await browser.newContext();
  const b = await browser.newContext();
  try {
    // Pessoa A entra e faz um check-in
    const pa = await a.newPage();
    await entrar(pa);
    const novo = await pa.request.post("/api/checkins", { data: { moodSlug: "triste", timezone: "America/Sao_Paulo" } });
    expect(novo.status()).toBe(201);

    // Pessoa B, outra sessão, não enxerga nada de A
    const pb = await b.newPage();
    await entrar(pb, "e2e3");
    const lista = await pb.request.get("/api/checkins");
    expect(await lista.json()).toEqual({ items: [], nextCursor: null });
  } finally {
    await a.close();
    await b.close();
  }
});

test("R8: começar do zero esvazia a jornada sem apagar a conta", async ({ page }) => {
  await entrar(page);
  await page.getByRole("link", { name: "Fazer check-in" }).click();
  await page.getByRole("button", { name: "Com cansaço" }).click();
  await expect(page).toHaveURL(/\/hoje$/);

  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Jornada" }).click();
  await expect(page.getByText("Com cansaço")).toBeVisible();
  await page.getByRole("button", { name: "Começar do zero" }).click();
  const dialog = page.getByRole("dialog", { name: "Começar a jornada do zero?" });
  await expect(dialog.getByText("Nada é apagado")).toBeVisible();
  await dialog.getByRole("button", { name: "Começar do zero" }).click();
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByText("Um momento para você.")).toBeVisible(); // Hoje neutro de novo

  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Jornada" }).click();
  await expect(page.getByText("Seus check-ins aparecem aqui.")).toBeVisible();

  // A conta continua existindo: sair e entrar de novo leva direto ao Hoje (ciclo novo, sem registros)
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/$/); // espera o Sair terminar de navegar antes de abrir a Entrada de novo
  await page.goto(`/?conta=${conta()}`);
  await page.getByPlaceholder("Digite a senha").fill(SENHA);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/hoje$/);
});

test("S8: senha errada mostra mensagem genérica e não entra", async ({ page }) => {
  await page.goto(`/?conta=${conta()}`);
  await page.getByPlaceholder("Digite a senha").fill("senha-errada");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Usuário ou senha não conferem." })).toBeVisible();
  await expect(page).not.toHaveURL(/\/hoje$/);
});
