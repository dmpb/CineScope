import { expect, test } from "@playwright/test";

test("smoke: Home -> Detail", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "CineScope" })).toBeVisible();

  const firstMovieLink = page
    .getByRole("link", { name: /Ver detalle de|View .* details for/i })
    .first();
  await expect(firstMovieLink).toBeVisible();

  await firstMovieLink.click();
  await expect(page).toHaveURL(/\/movie\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("smoke: Search por query param", async ({ page }) => {
  await page.goto("/search?q=matrix");

  await expect(page.getByRole("heading", { level: 1, name: /Búsqueda|Busqueda|Search/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 }).filter({ hasText: /matrix/i })).toBeVisible();

  const searchInput = page.locator("#search-query");
  await expect(searchInput).toBeVisible();
  await searchInput.fill("inception");
  await searchInput.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=inception$/);
  await expect(page.getByRole("heading", { level: 2 }).filter({ hasText: /inception/i })).toBeVisible();
});
