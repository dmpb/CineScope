import { expect, test } from "@playwright/test";

test("smoke: Home -> Detail", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "CineScope" })).toBeVisible();

  const firstMovieLink = page
    .getByRole("link", { name: /Ver detalle de|View .* details for/i })
    .first();
  await expect(firstMovieLink).toBeVisible({ timeout: 30000 });
  await firstMovieLink.scrollIntoViewIfNeeded();

  await Promise.all([
    page.waitForURL(/\/(movie|tv)\/\d+$/, { timeout: 30000 }),
    firstMovieLink.click()
  ]);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 30000 });
});

test("smoke: Search por query param", async ({ page }) => {
  await page.goto("/search?q=matrix", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: /Búsqueda|Busqueda|Search/i })).toBeVisible({
    timeout: 30000
  });
  await expect(page.getByRole("heading", { level: 2 }).filter({ hasText: /matrix/i })).toBeVisible({
    timeout: 30000
  });

  const searchInput = page.locator("#search-query");
  await expect(searchInput).toBeVisible();
  await searchInput.fill("inception");
  await Promise.all([
    page.waitForURL(/\/search\?q=inception$/, { timeout: 30000 }),
    searchInput.press("Enter")
  ]);

  await expect(page.getByRole("heading", { level: 2 }).filter({ hasText: /inception/i })).toBeVisible({
    timeout: 30000
  });
});
