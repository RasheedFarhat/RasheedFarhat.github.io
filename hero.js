/* Hero engine.

   The homepage opens on the same rule set the bench section further down
   runs, evaluating the same corpus records, with no controls. The bench is
   the instrument a visitor drives; this is only the proof that it is
   running before they have scrolled far enough to touch it.

   Nothing here re-implements a rule or hard-codes a verdict. Every value on
   screen comes back from window.MCPBench, which bench.js builds from
   wazuh/local_rules.xml, so the two cannot drift apart: if a pattern
   changes, this changes with it or stops rendering. */
(function () {
  "use strict";

  var root = document.querySelector("[data-hero-engine]");
  var api = window.MCPBench;
  if (!root || !api) return;

  var caseEl = root.querySelector("[data-engine-case]");
  var recordEl = root.querySelector("[data-engine-record]");
  var scanEl = root.querySelector("[data-engine-scan]");
  var wordEl = root.querySelector("[data-engine-word]");
  var detailEl = root.querySelector("[data-engine-detail]");
  if (!caseEl || !recordEl || !scanEl || !wordEl || !detailEl) return;

  /* Three beats, in this order for a reason. The rule works. The rule still
     works once someone hides the keyword inside Unicode. The rule does not
     work at all against the next class along. A visitor who watches one
     cycle has read the argument the rest of the page makes in prose, and
     the page always loads on a rule that holds rather than one that does
     not. */
  var SEQUENCE = ["base", "e3a", "e1"];

  var cases = SEQUENCE.map(function (id) {
    var found = null;
    api.CASES.forEach(function (c) {
      if (c.id === id) found = c;
    });
    return found;
  }).filter(function (c) {
    return c && c.record;
  });
  if (!cases.length) return;

  var TICK = 55;
  var SETTLE = 300;
  var HOLD = 3600;
  var CLEAR = 320;

  var timers = [];
  var index = 0;
  var stopped = false;

  function after(ms, fn) {
    timers.push(setTimeout(fn, ms));
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function el(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function scanRow(step) {
    var li = el("li", "hero-engine__step");
    li.appendChild(el("span", "hero-engine__step-id", step.rule.id));
    li.appendChild(el("span", "hero-engine__step-reads", step.rule.reads));
    li.appendChild(
      el("span", "hero-engine__step-state", step.ok ? "match" : "no match")
    );
    if (step.ok) li.classList.add("is-hit");
    return li;
  }

  function verdict(caseDef, outcome) {
    var fired = outcome.fired;
    if (fired) {
      wordEl.textContent = "Caught";
      detailEl.textContent =
        "rule " + fired.id + " · level " + fired.level +
        (fired.mitre ? " · " + fired.mitre : "");
      return "sig";
    }
    wordEl.textContent = "Missed";
    detailEl.textContent =
      "no rule fired · " + (caseDef.efficacy || "payload still works");
    return "amb";
  }

  /* One case, start to finish. Painting the whole scan list up front and
     revealing rows on a timer keeps the element count stable, so the
     browser is never relaying out the block while the rules tick past. */
  function play(caseDef, animate) {
    var outcome = api.evaluate(caseDef.record);
    var steps = outcome.steps;

    root.setAttribute("data-state", "scanning");
    root.removeAttribute("data-verdict");
    caseEl.textContent = caseDef.label;
    recordEl.textContent = api.show(caseDef.record);
    wordEl.textContent = "";
    detailEl.textContent = "";
    scanEl.textContent = "";

    var rows = steps.map(function (step) {
      var row = scanRow(step);
      if (animate) row.setAttribute("data-pending", "true");
      scanEl.appendChild(row);
      return row;
    });

    if (!animate) {
      root.setAttribute("data-verdict", verdict(caseDef, outcome));
      root.setAttribute("data-state", "settled");
      return;
    }

    rows.forEach(function (row, i) {
      after(TICK * i, function () {
        row.removeAttribute("data-pending");
      });
    });

    after(TICK * rows.length + SETTLE, function () {
      root.setAttribute("data-verdict", verdict(caseDef, outcome));
      root.setAttribute("data-state", "settled");
    });

    after(TICK * rows.length + SETTLE + HOLD, function () {
      root.setAttribute("data-state", "clearing");
    });

    after(TICK * rows.length + SETTLE + HOLD + CLEAR, function () {
      if (stopped) return;
      index = (index + 1) % cases.length;
      play(cases[index], true);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function start() {
    clearTimers();
    stopped = false;
    if (reduceMotion.matches) {
      play(cases[0], false);
      return;
    }
    play(cases[index], true);
  }

  function stop() {
    stopped = true;
    clearTimers();
  }

  /* A loop running against a tab nobody is looking at is wasted battery,
     and coming back to a half-finished scan looks like a stall. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stop();
    } else if (!reduceMotion.matches) {
      start();
    }
  });

  start();
})();
