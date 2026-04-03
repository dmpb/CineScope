import { expect, test } from "@playwright/test";

test("smoke: Home -> Detail", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "CineScope" })).toBeVisible();

  const firstMovieLink = page.getByRole("link", { name: /Ver detalle de/i }).first();
  await expect(firstMovieLink).toBeVisible();

  await firstMovieLink.click();
  await expect(page).toHaveURL(/\/movie\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("smoke: Search por query param", async ({ page }) => {
  await page.goto("/search?q=matrix");

  await expect(page.getByRole("heading", { level: 1, name: /Búsqueda|Busqueda/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /Resultados para "matrix"/i })).toBeVisible();

  await page.getByRole("searchbox", { name: /Buscar pelicula/i }).fill("inception");
  await page.getByRole("button", { name: /Buscar/i }).click();

  await expect(page).toHaveURL(/\/search\?q=inception$/);
  await expect(page.getByRole("heading", { level: 2, name: /Resultados para "inception"/i })).toBeVisible();
});
