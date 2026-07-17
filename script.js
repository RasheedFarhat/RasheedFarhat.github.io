const yearNodes = document.querySelectorAll("[data-year]");
const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const themeButton = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeKey = "rf-theme";

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const applyTheme = (theme, persist = false) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  if (themeButton) {
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeButton.title = `Switch to ${isDark ? "light" : "dark"} theme`;
  }
  if (themeLabel) themeLabel.textContent = isDark ? "Light" : "Dark";
  if (themeColor) themeColor.content = isDark ? "#10191b" : "#e2e9e7";
  if (persist) {
    try {
      window.localStorage.setItem(themeKey, isDark ? "dark" : "light");
    } catch {
      // The theme still applies when storage is unavailable.
    }
  }
};

if (themeButton) {
  applyTheme(document.documentElement.dataset.theme);
  themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark"
      ? "light"
      : "dark";
    applyTheme(nextTheme, true);
  });

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  systemTheme.addEventListener("change", (event) => {
    let hasSavedTheme = false;
    try {
      hasSavedTheme = window.localStorage.getItem(themeKey) !== null;
    } catch {
      hasSavedTheme = false;
    }
    if (!hasSavedTheme) applyTheme(event.matches ? "dark" : "light");
  });
}

if (menuButton && menu) {
  const closeMenu = (returnFocus = false) => {
    menuButton.setAttribute("aria-expanded", "false");
    menu.dataset.open = "false";
    document.documentElement.classList.remove("nav-open");
    if (returnFocus) menuButton.focus();
  };

  const openMenu = () => {
    menuButton.setAttribute("aria-expanded", "true");
    menu.dataset.open = "true";
    document.documentElement.classList.add("nav-open");
    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 54.01rem)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}
