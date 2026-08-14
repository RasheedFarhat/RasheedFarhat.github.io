import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredRoutes = [
  "index.html",
  "404.html",
  "projects/index.html",
  "projects/control-plane/index.html",
  "projects/detection-as-code/index.html",
  "projects/mcp-security/index.html",
  "projects/identity-deception/index.html",
  "writing/index.html",
  "writing/how-do-you-know-your-agent-isnt-going-rogue/index.html",
  "writing/i-built-five-mcp-detections-then-broke-them/index.html",
  "writing/the-mcp-call-looked-legitimate/index.html",
  "about/index.html",
  "resume/index.html",
  "contact/index.html",
  "support/index.html",
  "support/casework/index.html"
];

const failures = [];

const articleRoutes = [
  "writing/how-do-you-know-your-agent-isnt-going-rogue/index.html",
  "writing/i-built-five-mcp-detections-then-broke-them/index.html",
  "writing/the-mcp-call-looked-legitimate/index.html"
];

const articleWordTargets = new Map([
  ["writing/how-do-you-know-your-agent-isnt-going-rogue/index.html", [2200, 2700]],
  ["writing/i-built-five-mcp-detections-then-broke-them/index.html", [2700, 3300]],
  ["writing/the-mcp-call-looked-legitimate/index.html", [2200, 2700]]
]);

const forbiddenArticlePhrases = [
  "in today's rapidly evolving landscape",
  "let's dive in",
  "it is important to note",
  "at its core",
  "this begs the question",
  "ultimately",
  "in conclusion",
  "the key takeaway",
  "this serves as a testament to",
  "a testament to",
  "game-changing"
];

const watchedArticleWords = [
  "delve",
  "tapestry",
  "realm",
  "pivotal",
  "multifaceted",
  "nuanced",
  "robust",
  "seamless",
  "unlock",
  "elevate",
  "leverage",
  "showcase",
  "underscore",
  "intricate",
  "transformative"
];

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

for (const route of articleRoutes) {
  const file = join(root, route);
  const html = readFileSync(file, "utf8");
  const lower = html.toLowerCase();
  const articleStartMarker = '<div class="article-body">';
  const articleEndMarker = "\n          </div>\n        </div>\n      </article>";
  const articleStart = html.indexOf(articleStartMarker) + articleStartMarker.length;
  const articleEnd = html.indexOf(articleEndMarker, articleStart);
  const articleHtml = articleStart >= articleStartMarker.length && articleEnd > articleStart
    ? html.slice(articleStart, articleEnd)
    : "";
  const articleText = articleHtml
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = articleText.split(" ").filter(Boolean).length;
  const [minimumWords, maximumWords] = articleWordTargets.get(route);

  if (!html.includes("Inside MCP Detect")) fail(file, "series title is missing");
  if (!/synthetic/i.test(html)) fail(file, "synthetic evidence label is missing");
  if (!html.includes('id="limits"')) fail(file, "visible limitations section is missing");
  if (!html.includes('class="at-a-glance"')) fail(file, "at-a-glance summary is missing");
  if (!/<pre(?:\s[^>]*)?><code>[\s\S]*?(make |unittest)/i.test(html)) fail(file, "executable command is missing");
  if (!/<meta property="article:published_time"/.test(html)) fail(file, "article publication metadata is missing");
  if (!/\bI\b/.test(articleText)) fail(file, "first-person author voice is missing");
  if (wordCount < minimumWords || wordCount > maximumWords) {
    fail(file, `article word count ${wordCount} is outside ${minimumWords}-${maximumWords}`);
  }
  if (/\[AUTHOR INPUT NEEDED:/i.test(html)) fail(file, "unresolved author placeholder remains");
  if (/\b(commercial experiment|pricing|prospect|cold outreach)\b/i.test(html)) fail(file, "private commercial history is present");

  for (const phrase of forbiddenArticlePhrases) {
    if (lower.includes(phrase)) fail(file, `forbidden phrase remains: ${phrase}`);
  }

  for (const word of watchedArticleWords) {
    if (new RegExp(`\\b${word}\\b`, "i").test(articleText)) fail(file, `AI-default watch word remains: ${word}`);
  }
}

const requiredAssets = [
  "styles.css",
  "script.js",
  "theme-init.js",
  "favicon.svg",
  "favicon.ico",
  "assets/fonts/big-shoulders-var.woff2",
  "assets/fonts/public-sans-var.woff2",
  "assets/fonts/plex-mono-400.woff2",
  "assets/fonts/plex-mono-600.woff2",
  "assets/social-card.png",
  "assets/writing/agent-rogue-preview.png",
  "assets/writing/agent-rogue-linkedin.png",
  "assets/writing/five-detections-preview.png",
  "assets/writing/five-detections-linkedin.png",
  "assets/writing/legitimate-call-preview.png",
  "assets/writing/legitimate-call-linkedin.png",
  "assets/apple-touch-icon.png",
  "assets/rasheed-farhat-resume.pdf",
  "assets/support-social-card.png",
  "assets/rasheed-farhat-resume-support.pdf",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest"
];

for (const asset of requiredAssets) {
  if (!existsSync(join(root, asset))) failures.push(`${asset}: required asset is missing`);
}

const cssFile = join(root, "styles.css");
const css = readFileSync(cssFile, "utf8");

function extractTokenBlock(css, openSelectorRegex) {
  const openMatch = openSelectorRegex.exec(css);
  if (!openMatch) return null;
  const bodyStart = openMatch.index + openMatch[0].length;
  const bodyEnd = css.indexOf("}", bodyStart);
  if (bodyEnd === -1) return null;
  return css
    .slice(bodyStart, bodyEnd)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("--"));
}

const explicitLightBlock = extractTokenBlock(css, /:root\[data-theme="light"\]\s*\{/);
const osLightBlock = extractTokenBlock(css, /:root:not\(\[data-theme="dark"\]\)\s*\{/);

if (!explicitLightBlock || !osLightBlock) {
  failures.push("styles.css: could not locate both light-theme token blocks for the sync check");
} else if (explicitLightBlock.join("\n") !== osLightBlock.join("\n")) {
  failures.push(
    "styles.css: :root[data-theme=\"light\"] and the @media (prefers-color-scheme: light) block have drifted; keep their custom properties token-for-token identical"
  );
}

// Resolution Desk (support-page) theme tokens are scoped separately from the
// site-wide :root blocks above, so they need their own explicit-vs-OS-default
// sync check for the same reason.
const supportExplicitLightBlock = extractTokenBlock(css, /html\[data-theme="light"\]\s+body\.support-page\s*\{/);
const supportOsLightBlock = extractTokenBlock(css, /html:not\(\[data-theme="dark"\]\)\s+body\.support-page\s*\{/);

if (!supportExplicitLightBlock || !supportOsLightBlock) {
  failures.push("styles.css: could not locate both support-page light-theme token blocks for the sync check");
} else if (supportExplicitLightBlock.join("\n") !== supportOsLightBlock.join("\n")) {
  failures.push(
    "styles.css: html[data-theme=\"light\"] body.support-page and its @media (prefers-color-scheme: light) mirror have drifted; keep their custom properties token-for-token identical"
  );
}

if (failures.length) {
  console.error(`Site validation failed with ${failures.length} issue(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Site validation passed for ${collectHtml(root).length} HTML files and ${requiredAssets.length} required assets.`);
