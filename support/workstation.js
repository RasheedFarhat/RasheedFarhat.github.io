/*
 * The Support Workstation shell
 *
 * A small window manager for the retro machine that holds the Resolution
 * Desk scene on /support/. It owns four things and nothing else: where
 * windows sit, which one is on top, the boot cover, and the exact page width
 * the CSS needs to size the case. The desk inside the window is still driven
 * entirely by resolution-desk.js, which neither knows nor cares that it is
 * running inside a window.
 *
 * Progressive enhancement is the rule. Every launcher is a real button or
 * link, every window is in the DOM, and support/workstation.css places the
 * desk window statically on its own. If this file never loads, the machine
 * still renders with the desk open inside it.
 *
 * The gate is the important idea. Below 90rem none of the workstation CSS
 * applies and the desk is an ordinary page section, so this file must not
 * touch window geometry there: an inline width on a plain div would be a
 * real layout bug on a phone. Everything below is therefore gated on the
 * same media query the stylesheet uses, and crossing the gate downward
 * strips every inline style this file has written.
 */
(() => {
  "use strict";

  const desktop = document.querySelector("[data-ws-desktop]");
  const chassis = document.querySelector(".ws-chassis");
  if (!desktop || !chassis) return;

  const MENUBAR_H = 26;
  const MARGIN = 16;
  const GUTTER = 116; // icon column width plus its right and left breathing room
  const DRAG_STEP = 8;
  const DRAG_STEP_LARGE = 24;

  // Must match the gate in support/workstation.css. If these ever disagree,
  // the JS places windows the CSS is not positioning, or the reverse.
  const GATE = window.matchMedia("(min-width: 90rem)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const windows = new Map();
  let topZ = 10;
  let lastOpener = null;
  let live = false;

  // Preferred geometry per window. Width and height are ceilings: the
  // placement pass shrinks them to fit whatever the screen actually gives,
  // so nothing can open larger than the desktop it lives in.
  //
  // 1164 must stay in step with the .ws-window[data-ws-window="desk"] rule in
  // support/workstation.css, and it breaks down as the 1112px canvas + 2px of
  // window border + 32px of body padding + 18px for a classic vertical
  // scrollbar. The desk is taller than the window on any normal laptop, so
  // that scrollbar is always there on Windows and Linux; leaving it out of
  // the arithmetic is what makes the window scroll sideways as well.
  const LAYOUT = {
    desk: { w: 1164, h: 10000, x: MARGIN, y: MENUBAR_H + 8 },
    readme: { w: 480, h: 320, x: 220, y: 260 }
  };

  document.querySelectorAll("[data-ws-window]").forEach((el) => {
    windows.set(el.dataset.wsWindow, {
      el,
      bar: el.querySelector(".ws-window__bar"),
      grip: el.querySelector(".ws-window__grip"),
      placed: false
    });
  });

  /* Page width -------------------------------------------------------------
     documentElement.clientWidth excludes a classic scrollbar; 100vw does not.
     The stylesheet sizes the case from this, so publishing the exact number
     is what keeps the machine from overhanging the page on Windows and Linux
     and giving the whole document a horizontal scrollbar. */

  function publishViewport() {
    chassis.style.setProperty("--ws-viewport", `${document.documentElement.clientWidth}px`);
  }

  function screenBox() {
    return { w: desktop.clientWidth, h: desktop.clientHeight };
  }

  function clamp(value, min, max) {
    if (max < min) return min;
    return Math.max(min, Math.min(max, value));
  }

  /* Sizing and placement --------------------------------------------------
     The desk window is deliberately kept out of the icon gutter so the
     desktop still reads as a desktop on first load. It is the only window
     wide enough for that to matter. */
  function place(key, entry) {
    const want = LAYOUT[key];
    if (!want) return;

    const { w: screenW, h: screenH } = screenBox();
    const reserved = key === "desk" ? GUTTER : 0;
    const width = Math.min(want.w, screenW - MARGIN * 2 - reserved);
    const height = Math.min(want.h, screenH - want.y - MARGIN);

    entry.el.style.width = `${Math.max(280, width)}px`;
    entry.el.style.height = `${Math.max(180, height)}px`;
    entry.el.style.left = `${clamp(want.x, MARGIN, screenW - width - MARGIN)}px`;
    entry.el.style.top = `${clamp(want.y, MENUBAR_H, screenH - height - 8)}px`;
    entry.placed = true;
  }

  function reclamp() {
    const { w: screenW, h: screenH } = screenBox();
    windows.forEach((entry, key) => {
      if (!entry.placed || entry.el.hidden) return;
      // Re-run placement for the desk so it keeps filling the new screen, and
      // only re-clamp the others so a window the visitor dragged somewhere on
      // purpose stays roughly where they put it.
      if (key === "desk") {
        place(key, entry);
        return;
      }
      const width = entry.el.offsetWidth;
      const height = entry.el.offsetHeight;
      entry.el.style.left = `${clamp(parseFloat(entry.el.style.left) || 0, 0, Math.max(0, screenW - width))}px`;
      entry.el.style.top = `${clamp(parseFloat(entry.el.style.top) || 0, MENUBAR_H, Math.max(MENUBAR_H, screenH - height))}px`;
    });
  }

  /* Crossing the gate -----------------------------------------------------
     Going up, place the desk window and let the machine run. Coming down,
     put every window back exactly as the markup shipped it: no inline
     geometry, README closed, focus classes cleared. Below the gate those
     elements are unstyled divs in the page flow, so a stale inline width or
     an open README would show up as broken content rather than furniture. */

  function activate() {
    if (live) return;
    live = true;
    publishViewport();
    const deskEntry = windows.get("desk");
    if (deskEntry) {
      place("desk", deskEntry);
      deskEntry.el.style.zIndex = String(topZ);
      deskEntry.el.classList.add("is-focused");
    }
  }

  function deactivate() {
    if (!live) return;
    live = false;
    windows.forEach((entry, key) => {
      entry.el.removeAttribute("style");
      entry.el.classList.remove("is-focused");
      entry.placed = false;
      if (key !== "desk") entry.el.hidden = true;
      else entry.el.hidden = false;
    });
    lastOpener = null;
  }

  /* Stacking and focus ---------------------------------------------------- */

  function raise(key) {
    const entry = windows.get(key);
    if (!entry || !live) return;
    topZ += 1;
    entry.el.style.zIndex = String(topZ);
    windows.forEach((other, otherKey) => {
      other.el.classList.toggle("is-focused", otherKey === key);
    });
  }

  function openWindow(key, opener) {
    const entry = windows.get(key);
    if (!entry || !live) return;
    if (opener) lastOpener = opener;
    const wasHidden = entry.el.hidden;
    entry.el.hidden = false;
    if (!entry.placed || wasHidden) place(key, entry);
    raise(key);
    if (entry.grip) entry.grip.focus();
  }

  function closeWindow(key) {
    const entry = windows.get(key);
    if (!entry || !live) return;
    entry.el.hidden = true;
    entry.el.classList.remove("is-focused");
    const fallback = document.querySelector(`[data-ws-open="${key}"]`);
    const target = lastOpener && document.contains(lastOpener) ? lastOpener : fallback;
    if (target) target.focus();
    lastOpener = null;
  }

  /* Dragging -------------------------------------------------------------- */

  function startDrag(entry, key, event) {
    if (!live) return;
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest(".ws-window__close")) return;

    raise(key);

    const rect = entry.el.getBoundingClientRect();
    const parent = desktop.getBoundingClientRect();
    const grabX = event.clientX - rect.left;
    const grabY = event.clientY - rect.top;
    const maxX = Math.max(0, parent.width - rect.width);
    const maxY = Math.max(MENUBAR_H, parent.height - rect.height);

    function move(moveEvent) {
      const x = clamp(moveEvent.clientX - parent.left - grabX, 0, maxX);
      const y = clamp(moveEvent.clientY - parent.top - grabY, MENUBAR_H, maxY);
      entry.el.style.left = `${x}px`;
      entry.el.style.top = `${y}px`;
    }

    function end() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    event.preventDefault();
  }

  // Arrow keys move a window whose title bar has focus. Dragging is a mouse
  // affordance, so without this the windows would be unmovable by keyboard.
  function nudge(entry, key, event) {
    if (!live) return false;
    const step = event.shiftKey ? DRAG_STEP_LARGE : DRAG_STEP;
    const deltas = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const delta = deltas[event.key];
    if (!delta) return false;

    const { w: screenW, h: screenH } = screenBox();
    const width = entry.el.offsetWidth;
    const height = entry.el.offsetHeight;
    const x = clamp((parseFloat(entry.el.style.left) || 0) + delta[0], 0, Math.max(0, screenW - width));
    const y = clamp((parseFloat(entry.el.style.top) || 0) + delta[1], MENUBAR_H, Math.max(MENUBAR_H, screenH - height));
    entry.el.style.left = `${x}px`;
    entry.el.style.top = `${y}px`;
    raise(key);
    event.preventDefault();
    return true;
  }

  windows.forEach((entry, key) => {
    entry.el.addEventListener("pointerdown", () => raise(key), true);

    if (entry.bar) {
      entry.bar.addEventListener("pointerdown", (event) => startDrag(entry, key, event));
    }

    if (entry.grip) {
      entry.grip.addEventListener("keydown", (event) => {
        if (nudge(entry, key, event)) return;
        if (event.key === "Escape") closeWindow(key);
      });
    }

    const closeButton = entry.el.querySelector(".ws-window__close");
    if (closeButton) closeButton.addEventListener("click", () => closeWindow(key));
  });

  document.querySelectorAll("[data-ws-open]").forEach((launcher) => {
    launcher.addEventListener("click", (event) => {
      event.preventDefault();
      openWindow(launcher.dataset.wsOpen, launcher);
    });
  });

  /* Menu bar clock -------------------------------------------------------- */

  const clock = document.querySelector("[data-ws-clock]");
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });
    };
    tick();
    window.setInterval(tick, 20000);
  }

  /* Boot -----------------------------------------------------------------
     The machine sits well below the fold on this page, so a boot sequence
     that ran on load would be over before anyone scrolled to it. It runs
     when the case first comes into view instead. The cover sits over an
     already laid-out desktop, so this is purely cosmetic and can be cut at
     any point without leaving the page half-started. */

  const boot = document.querySelector("[data-ws-boot]");
  if (boot) {
    let started = false;

    const run = () => {
      if (started) return;
      started = true;

      if (reduceMotion.matches || !GATE.matches) {
        boot.remove();
        return;
      }

      const lines = Array.from(boot.querySelectorAll(".ws-boot__line"));
      const timers = [];
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        timers.forEach(window.clearTimeout);
        boot.classList.add("is-clearing");
        window.setTimeout(() => boot.remove(), 300);
        window.removeEventListener("keydown", finish);
        desktop.removeEventListener("pointerdown", finish);
      };

      lines.forEach((line, index) => {
        timers.push(window.setTimeout(() => line.classList.add("is-shown"), 160 * (index + 1)));
      });
      timers.push(window.setTimeout(finish, 160 * (lines.length + 1) + 420));
      window.addEventListener("keydown", finish);
      desktop.addEventListener("pointerdown", finish);
    };

    if (typeof window.IntersectionObserver === "function") {
      const watcher = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          watcher.disconnect();
          run();
        });
      }, { threshold: 0.2 });
      watcher.observe(chassis);
    } else {
      run();
    }
  }

  /* Initial state and gate tracking --------------------------------------- */

  if (GATE.matches) activate();

  const onGateChange = () => (GATE.matches ? activate() : deactivate());
  if (typeof GATE.addEventListener === "function") {
    GATE.addEventListener("change", onGateChange);
  } else if (typeof GATE.addListener === "function") {
    GATE.addListener(onGateChange); // Safari before 14
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!GATE.matches) return;
      publishViewport();
      reclamp();
    }, 120);
  });
})();
