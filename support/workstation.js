/*
 * The Support Workstation shell
 *
 * A small window manager for the retro machine that holds the Resolution
 * Desk scene on /support/. It owns five things and nothing else: where
 * windows sit, which one is on top, the scroll hold, the power-on, and the
 * exact page width the CSS needs to size the case. The desk inside the window
 * is still driven entirely by resolution-desk.js, which neither knows nor
 * cares that it is running inside a window.
 *
 * Progressive enhancement is the rule. Every launcher is a real button or
 * link, every window is in the DOM, and support/workstation.css places the
 * desk window statically on its own. If this file never loads, the machine
 * still renders with the desk open inside it, powered on, with no hold: the
 * boot cover and the scroll runway are both off until this file switches
 * them on.
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
    hold();
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
    release();
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

  /* The scroll hold and the power-on -------------------------------------
     The machine sits well below the fold, and a boot that ran on a timer was
     over before anyone reached it. It is now scrubbed by the page's own
     scroll position instead.

     support/workstation.css makes .ws-stage taller than the case by
     --ws-runway and pins the case at --ws-pin-top, so the machine holds still
     while that runway scrolls past. This file measures the two values, reads
     how far through the runway the page is, and moves the screen from off, to
     striking, to on across it. Nothing here touches the scroll itself: no
     wheel handler, no preventDefault, no scrollTo. Every input keeps its
     normal distance and the visitor can leave at any moment, which is the
     line between holding someone's attention and taking it.

     The sequence only ever runs forward. Scrolling back up holds the machine
     at whatever state it reached rather than putting it back to sleep, since
     someone scrolling back up is usually re-reading the thing they just
     watched come on, and a screen that switched itself off underneath them
     would be a bug from where they sit. */

  const stage = document.querySelector("[data-ws-stage]");
  const boot = document.querySelector("[data-ws-boot]");
  const bootLines = boot ? Array.from(boot.querySelectorAll(".ws-boot__line")) : [];

  // Progress points through the runway. Power strikes early so the case is
  // still arriving when the screen catches, and the desk is on well before
  // the runway ends, so the last stretch of the hold is spent looking at a
  // working machine rather than at a boot message.
  const STRIKE = 0.08;
  const LINE_AT = [0.26, 0.44, 0.62];
  const READY = 0.8;

  const header = document.querySelector(".site-header");

  let held = false; // are the CSS custom properties currently published
  let phase = -1; // -1 off, 0 striking, 1..3 lines lit, 4 ready
  let caseH = 0;
  let pinTop = 0;
  let runway = 0;
  let frame = 0;

  /* The page header is sticky, so the top of the window is not free space to
     pin into. Measured rather than assumed, so a header that grows a row or
     gets replaced does not silently push the machine behind it. */

  function headerHeight() {
    if (!header) return 0;
    const position = window.getComputedStyle(header).position;
    if (position !== "sticky" && position !== "fixed") return 0;
    return Math.round(header.getBoundingClientRect().height);
  }

  function roomForHold() {
    // --ws-hold-reserve has already taken the header out of the screen's
    // height by the time this runs, so the case fits by construction. This is
    // belt and braces for a window too short to hold anything at all.
    return caseH > 0 && headerHeight() + caseH <= window.innerHeight;
  }

  function measure() {
    caseH = Math.round(chassis.getBoundingClientRect().height);

    // Centred in what the header leaves, then held to a narrow band so the
    // case always reads as parked just under the nav rather than floating in
    // a window tall enough to have opinions about where its middle is.
    const head = headerHeight();
    pinTop = head + clamp(Math.round((window.innerHeight - head - caseH) / 2), 8, 28);

    // Long enough that a fast skim cannot outrun the sequence, short enough
    // that it is one unhurried gesture rather than a corridor.
    runway = Math.round(clamp(window.innerHeight * 0.8, 380, 620));
  }

  function setPhase(next) {
    if (next <= phase) return; // forward only
    phase = next;

    // Any live phase means the tube has struck, not just phase 0. A scroll
    // that lands between two animation frames, or a jump from a link, can
    // arrive at phase 2 having never passed through 0, and gating the strike
    // on phase 0 alone left the machine dark with lit boot lines behind it.
    if (phase < 4) {
      chassis.classList.remove("is-off");
      chassis.classList.add("is-booting");
    }

    bootLines.forEach((line, index) => {
      if (index < phase) line.classList.add("is-shown");
    });

    if (phase >= 4) finish();
  }

  function finish() {
    phase = 4;
    chassis.classList.remove("is-off");
    if (!boot) return;
    // Kept in the DOM and hidden by state rather than removed, so the machine
    // has one description of itself and re-arming after a gate change does
    // not depend on markup this file destroyed.
    boot.classList.add("is-clearing");
    window.setTimeout(() => {
      chassis.classList.remove("is-booting");
      boot.classList.remove("is-clearing");
      bootLines.forEach((line) => line.classList.remove("is-shown"));
    }, 300);
  }

  function progress() {
    const top = stage.getBoundingClientRect().top;
    return clamp((pinTop - top) / runway, 0, 1);
  }

  function update() {
    if (!held || phase >= 4) return;
    const p = progress();
    if (p >= READY) return setPhase(4);
    if (p >= LINE_AT[2]) return setPhase(3);
    if (p >= LINE_AT[1]) return setPhase(2);
    if (p >= LINE_AT[0]) return setPhase(1);
    if (p >= STRIKE) return setPhase(0);
  }

  function onScroll() {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  }

  function hold() {
    if (!stage || !boot) return;
    if (!GATE.matches || reduceMotion.matches) return release();

    // Publish the reserve before measuring, not after: shortening the case by
    // the height of the header is what makes it fit under the header, so a
    // measurement taken first would always report a machine too tall to hold.
    // It is set here rather than alongside --ws-viewport so a reader who has
    // asked for reduced motion, and so never gets a hold, also never gets a
    // machine shrunk to make room for one.
    chassis.style.setProperty("--ws-hold-reserve", `${headerHeight()}px`);
    if (phase >= 4) return; // booted; keep the size, stop scrubbing

    measure();
    if (!roomForHold()) return release();
    stage.style.setProperty("--ws-pin-top", `${pinTop}px`);
    stage.style.setProperty("--ws-runway", `${runway}px`);
    if (!held) {
      held = true;
      // Start dark only if the visitor has not already scrolled past. On a
      // reload part way down the page the machine is simply on.
      if (progress() < STRIKE) chassis.classList.add("is-off");
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    update();
  }

  function release() {
    chassis.style.removeProperty("--ws-hold-reserve");
    if (stage) {
      stage.style.removeProperty("--ws-pin-top");
      stage.style.removeProperty("--ws-runway");
    }
    if (!held) return;
    held = false;
    window.removeEventListener("scroll", onScroll);
    chassis.classList.remove("is-off", "is-booting");
    bootLines.forEach((line) => line.classList.remove("is-shown"));
  }

  // Anyone who reaches the machine deliberately gets it on at once: a
  // keyboard visitor tabbing into the desk, or a pointer landing on it,
  // has stopped skimming, and the hold has nothing left to do for them.
  if (stage && boot) {
    ["pointerdown", "keydown", "focusin"].forEach((type) => {
      desktop.addEventListener(type, () => {
        if (held && phase < 4) finish();
      });
    });
  }

  /* Initial state and gate tracking --------------------------------------- */

  if (GATE.matches) activate();

  // Measure again once everything has settled. Two things move between the
  // deferred run above and load: web fonts can change the height the pin is
  // centred against, and a visitor who arrived on a #fragment has by then been
  // scrolled to it. Without this second pass that visitor can land on a dark
  // screen that has no scrolling left to do to switch itself on.
  window.addEventListener("load", () => {
    if (GATE.matches) hold();
  });

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
      hold();
    }, 120);
  });
})();
