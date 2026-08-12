window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.dataset.loaded = "true";
});

const yearNodes = document.querySelectorAll("[data-year]");
const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
const themeLabels = document.querySelectorAll("[data-theme-label]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeKey = "rf-theme";

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const applyTheme = (theme, persist = false) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    button.title = `Switch to ${isDark ? "light" : "dark"} theme`;
  });
  themeLabels.forEach((label) => {
    label.textContent = isDark ? "Light" : "Dark";
  });
  if (themeColor) themeColor.content = isDark ? "#171b1a" : "#edebe5";
  if (persist) {
    try {
      window.localStorage.setItem(themeKey, isDark ? "dark" : "light");
    } catch {
      // The theme still applies when storage is unavailable.
    }
  }
};

if (themeButtons.length > 0) {
  applyTheme(document.documentElement.dataset.theme);
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark";
      applyTheme(nextTheme, true);
    });
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
