(() => {
  const themeKey = "rf-theme";
  let savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem(themeKey);
  } catch {
    savedTheme = null;
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const theme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemTheme;

  document.documentElement.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "dark" ? "#10191b" : "#e2e9e7";
})();
