import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredRoutes = [
  "index.html",
  "404.html",
  "projects/index.html",
  "projects/detection-as-code/index.html",
  "projects/mcp-security/index.html",
  "projects/identity-deception/index.html",
  "writing/index.html",
  "about/index.html",
  "resume/index.html",
  "contact/index.html"
];

const failures = [];

function collectHtml(directory) {
  return readdirSync(directory).flatMap((name) => {
    if (name === ".git" || name === "scripts") return [];
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return collectHtml(path);
    return path.endsWith(".html") ? [path] : [];
  });
}

function fail(file, message) {
  failures.push(`${relative(root, file)}: ${message}`);
}

for (const route of requiredRoutes) {
  if (!existsSync(join(root, route))) failures.push(`${route}: required route is missing`);
}

for (const file of collectHtml(root)) {
  const html = readFileSync(file, "utf8");
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  const mainCount = (html.match(/<main(?:\s|>)/g) || []).length;
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

  if (!/^<!doctype html>/i.test(html)) fail(file, "HTML5 doctype is missing");
  if (h1Count !== 1) fail(file, `expected one h1, found ${h1Count}`);
  if (mainCount !== 1) fail(file, `expected one main landmark, found ${mainCount}`);
  if (!html.includes('class="skip-link"')) fail(file, "skip link is missing");
  if (!/<meta\s+name="description"/.test(html)) fail(file, "meta description is missing");
  if (file.endsWith("404.html")) {
    if (!/<meta\s+name="robots"\s+content="noindex"\s*\/?>/.test(html)) fail(file, "404 page must be noindex");
  } else if (!/<link\s+rel="canonical"/.test(html)) {
    fail(file, "canonical link is missing");
  }
  if (/\sstyle="/.test(html)) fail(file, "inline style is not allowed");
  if (/[\u2013\u2014]/.test(html)) fail(file, "typographic dash is not allowed");
  if (/lorem ipsum|placeholder testimonial/i.test(html)) fail(file, "placeholder content is not allowed");

  for (const match of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) {
    const attributes = match[1];
    if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(attributes)) {
      fail(file, "target blank link is missing noopener and noreferrer");
    }
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith("#")) {
      const target = value.slice(1);
      if (target && !ids.has(target)) fail(file, `missing fragment target ${value}`);
      continue;
    }
    if (!value.startsWith("/")) continue;
    const clean = value.split("?")[0].split("#")[0];
    const targetPath = clean.endsWith("/") ? join(root, clean, "index.html") : join(root, clean);
    if (!existsSync(targetPath)) fail(file, `missing local asset or route ${value}`);
  }
}

const requiredAssets = [
  "styles.css",
  "script.js",
  "favicon.svg",
  "assets/fonts/big-shoulders-var.woff2",
  "assets/fonts/public-sans-var.woff2",
  "assets/fonts/plex-mono-400.woff2",
  "assets/fonts/plex-mono-600.woff2",
  "assets/social-card.png",
  "assets/apple-touch-icon.png",
  "assets/rasheed-farhat.jpg",
  "assets/rasheed-farhat-resume.pdf",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest"
];

for (const asset of requiredAssets) {
  if (!existsSync(join(root, asset))) failures.push(`${asset}: required asset is missing`);
}

if (failures.length) {
  console.error(`Site validation failed with ${failures.length} issue(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Site validation passed for ${collectHtml(root).length} HTML files and ${requiredAssets.length} required assets.`);
