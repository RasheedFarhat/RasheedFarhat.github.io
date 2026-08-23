import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const source = pathToFileURL(resolve(here, "writing-card-source.html")).href;
const output = resolve(root, "assets", "writing");

const cards = [
  { article: "1", name: "agent-rogue" },
  { article: "2", name: "five-detections" },
  { article: "3", name: "legitimate-call" },
  { article: "4", name: "claim-was-wrong" },
  { article: "5", name: "support-answer" }
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
const page = await browser.newPage();

for (const card of cards) {
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(source + "?article=" + card.article, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(output, card.name + "-preview.png"), type: "png" });

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(source + "?article=" + card.article, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(output, card.name + "-linkedin.png"), type: "png" });
}

await browser.close();
console.log("Rendered 10 writing cards.");
