import { expect, test } from "@playwright/test";

// S7: health público e mínimo
test("health responde ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBe(true);
  expect(await res.json()).toEqual({ status: "ok" });
});
