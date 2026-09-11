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
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    if (event.key === "Escape") {
      closeMenu(true);
      return;
    }

    if (event.key === "Tab") {
      const focusable = [menuButton, ...menu.querySelectorAll("a[href], button:not([disabled])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 64rem)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

/* Rail travel.
   One machined indicator rides the left rail with the scroll, and a module
   seats its bolts the instant its top edge crosses the indicator. Seat and
   hold is the whole grammar: each module fires once and never reverses,
   nothing rewrites itself and nothing auto-advances. Under reduced motion
   the rack renders already seated and the indicator is not drawn at all. */
const rack = document.querySelector("[data-rack]");

if (rack) {
  const indicator = rack.querySelector("[data-rack-indicator]");
  const modules = Array.from(rack.querySelectorAll(".module"));
  const stillQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const seatAll = () => {
    modules.forEach((module) => module.classList.add("is-seated"));
  };

  if (stillQuery.matches) {
    seatAll();
  } else {
    let ticking = false;

    const travel = () => {
      ticking = false;
      /* The indicator sits at 42% of the viewport, high enough that a module
         is already reading when it seats rather than seating after it has
         been read. */
      const line = window.innerHeight * 0.42;
      const box = rack.getBoundingClientRect();

      if (indicator) {
        const offset = Math.min(Math.max(line - box.top, 0), Math.max(box.height - 28, 0));
        indicator.style.transform = `translateY(${offset}px)`;
      }

      for (const module of modules) {
        if (module.classList.contains("is-seated")) continue;
        if (module.getBoundingClientRect().top <= line) module.classList.add("is-seated");
      }
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(travel);
    };

    /* Armed and the first pass run in the same task, so whatever is already
       on screen is seated before the browser paints and the page never
       flashes through its unlit state. */
    rack.dataset.rack = "armed";
    rack.dataset.rackLive = "true";
    travel();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    stillQuery.addEventListener("change", (event) => {
      if (event.matches) seatAll();
    });
  }
}
