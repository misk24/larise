import { test, expect, type Page } from "@playwright/test";

// Scroll through the page so every whileInView animation fires, then assert the
// content is actually visible (opacity > 0). Catches animations stuck at opacity 0.
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight / 2, 300);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

for (const viewport of [{ name: "desktop", width: 1280, height: 800 }, { name: "mobile", width: 390, height: 844 }]) {
  test(`landing sections and footer are visible (${viewport.name})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await scrollThrough(page);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const id of ["#value", "#features", "#how-it-works", "#faq"]) {
      await expect(page.locator(id)).toBeVisible();
    }

    const footer = page.locator("footer");
    await expect(footer).toContainText("LARISÉ");
    await expect(footer.getByText("Jelajahi")).toBeVisible();
    await expect(footer.getByText("Terhubung")).toBeVisible();

    // No element in the main content may be left fully transparent after scrolling.
    const stuck = await page.evaluate(() =>
      [...document.querySelectorAll("main h2, main h3, footer h3, footer p")]
        .filter((el) => {
          let node: Element | null = el;
          while (node) {
            if (Number.parseFloat(getComputedStyle(node).opacity) < 0.05) return true;
            node = node.parentElement;
          }
          return false;
        })
        // The closed FAQ answers and the closed mobile menu are intentionally hidden.
        .filter((el) => !el.closest("[aria-hidden='true']"))
        .map((el) => el.textContent?.trim().slice(0, 40)),
    );
    expect(stuck).toEqual([]);
  });
}
