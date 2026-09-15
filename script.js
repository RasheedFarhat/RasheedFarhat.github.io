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
   nothing rewrites itself and nothing auto-advances. A row of ticks marks
   every module's position on the same rail; each is a real anchor link
   (works with JS off), and lights up in step with its module seating.
   Under reduced motion the rack renders already seated, ticks are placed
   once with no continuous travel, and the sliding indicator is not drawn. */
const rack = document.querySelector("[data-rack]");

if (rack) {
  const indicator = rack.querySelector("[data-rack-indicator]");
  const modules = Array.from(rack.querySelectorAll(".module"));
  const ticks = Array.from(rack.querySelectorAll("[data-rack-tick]"));
  const tickByModuleId = new Map(ticks.map((tick) => [tick.dataset.rackTick, tick]));
  const stillQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const seatAll = () => {
    modules.forEach((module) => module.classList.add("is-seated"));
    ticks.forEach((tick) => tick.classList.add("is-seated"));
  };

  /* The indicator sits at 42% of the viewport, high enough that a module is
     already reading when it seats rather than seating after it has been
     read. The ceiling is the rail's own height, but a page rarely scrolls
     far enough for box.top to fall that low; whatever sits below the rack
     (the footer, the last sliver of viewport under the read line) eats into
     the scroll distance first. So every position on the rail is expressed
     as a fraction of what the read line actually reaches at max scroll,
     rather than a raw pixel offset, and both the indicator and the ticks
     land exactly where they should regardless of viewport or footer size. */
  const railMetrics = (box) => {
    const line = window.innerHeight * 0.42;
    const doc = document.documentElement;
    const maxScrollTop = Math.max(doc.scrollHeight - window.innerHeight, 0);
    const railDocTop = box.top + window.scrollY;
    const reachable = Math.max(line - railDocTop + maxScrollTop, 1);
    const ceiling = Math.max(box.height - 28, 0);
    return { line, reachable, ceiling };
  };

  const layoutTicks = () => {
    if (!ticks.length) return;
    const box = rack.getBoundingClientRect();
    const { reachable, ceiling } = railMetrics(box);

    ticks.forEach((tick) => {
      const target = document.getElementById(tick.dataset.rackTick);
      if (!target) return;
      const moduleOffset = target.getBoundingClientRect().top - box.top;
      const progress = Math.min(Math.max(moduleOffset / reachable, 0), 1);
      tick.style.transform = `translateY(${progress * ceiling}px)`;
    });
  };

  if (stillQuery.matches) {
    seatAll();
    layoutTicks();
  } else {
    let ticking = false;

    const travel = () => {
      ticking = false;
      const box = rack.getBoundingClientRect();

      if (indicator) {
        const { line, reachable, ceiling } = railMetrics(box);
        const rawOffset = Math.max(line - box.top, 0);
        const progress = Math.min(rawOffset / reachable, 1);
        indicator.style.transform = `translateY(${progress * ceiling}px)`;
      }

      const line = window.innerHeight * 0.42;
      for (const module of modules) {
        if (module.classList.contains("is-seated")) continue;
        if (module.getBoundingClientRect().top <= line) {
          module.classList.add("is-seated");
          tickByModuleId.get(module.id)?.classList.add("is-seated");
        }
      }
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(travel);
    };

    const scheduleLayout = () => {
      layoutTicks();
      schedule();
    };

    /* Armed and the first pass run in the same task, so whatever is already
       on screen is seated before the browser paints and the page never
       flashes through its unlit state. */
    rack.dataset.rack = "armed";
    rack.dataset.rackLive = "true";
    layoutTicks();
    travel();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", scheduleLayout);

    stillQuery.addEventListener("change", (event) => {
      if (event.matches) seatAll();
    });
  }
}
