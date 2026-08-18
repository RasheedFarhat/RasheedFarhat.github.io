/*
 * The Resolution Desk
 *
 * A support-lane-only interactive component. Everything here is scoped to
 * /support/ and intentionally kept out of the shared script.js so the
 * security-portfolio routes are untouched.
 *
 * All four tickets below are representative example scenarios that show how
 * I approach a ticket. They are not individual case records; the
 * documented cases live at /support/casework/.
 */
(() => {
  "use strict";

  const root = document.querySelector("[data-resolution-desk]");
  if (!root) return;

  const PHASES = {
    diagnose: ["intake", "triage", "investigation"],
    resolve: ["resolution", "verification"],
    close: ["documentation"]
  };

  const PHASE_LABELS = {
    diagnose: "Diagnose",
    resolve: "Resolve",
    close: "Close"
  };

  const STATION_PHASES = Object.entries(PHASES).reduce((map, [phaseKey, stationKeys]) => {
    stationKeys.forEach((stationKey) => {
      map[stationKey] = phaseKey;
    });
    return map;
  }, {});

  const STATION_LABELS = {
    intake: "Intake",
    triage: "Triage",
    investigation: "Investigation",
    resolution: "Resolution",
    verification: "Verification",
    documentation: "Documentation",
    knowledgeBase: "Knowledge Base",
    escalationDesk: "Escalation Desk"
  };

  // Each primary station surfaces exactly two of the six evidence
  // categories the brief calls for. Across all six stations, every
  // category appears at the point in the workflow where it is genuinely
  // decided, so the full set is covered without repeating all six at
  // every stop.
  const STATION_FIELDS = {
    intake: ["clarify", "check"],
    triage: ["logic", "escalate"],
    investigation: ["check", "logic"],
    resolution: ["logic", "document"],
    verification: ["verify", "escalate"],
    documentation: ["document", "clarify"]
  };

  const FIELD_LABELS = {
    clarify: "What I would clarify with the user",
    check: "What I would check",
    logic: "How I would narrow the cause",
    document: "What I would document",
    escalate: "When I would escalate",
    verify: "How I would verify resolution"
  };

  const SECONDARY_FIELDS = {
    knowledgeBase: ["consult", "update"],
    escalationDesk: ["trigger", "handoff", "retain"]
  };

  const SECONDARY_FIELD_LABELS = {
    consult: "What I would reference",
    update: "What I would add or update",
    trigger: "What would trigger escalation",
    handoff: "What I would include in the handoff",
    retain: "What I would continue to own"
  };

  // Coordinates share the SVG viewBox for each layout. The marker now moves
  // between three recruiter-readable phases; the detailed station buttons
  // inside each phase update the evidence without adding more route choices.
  const DESKTOP_POS = {
    diagnose: { x: 100, y: 60 },
    resolve: { x: 300, y: 60 },
    close: { x: 500, y: 60 }
  };

  const MOBILE_POS = {
    diagnose: { x: 60, y: 40 },
    resolve: { x: 60, y: 180 },
    close: { x: 60, y: 320 }
  };

  const TICKETS = {
    lockout: {
      label: "Account lockout or sign-in failure",
      summary:
        "A user cannot sign in. A locked account, a forgotten password, or a sign-in that fails without an obvious reason.",
      stations: {
        intake: {
          overview:
            "Confirm who is affected, on what device, before assuming a cause.",
          clarify:
            "Whether it is one account or several, which device and app they are signing into, and whether anything changed recently, a new password, a new device, recent travel.",
          check:
            "The account status and whether the lockout counter or recent failed attempts line up with what the user describes."
        },
        triage: {
          overview:
            "Decide whether this is routine or something that needs a faster path.",
          logic:
            "A single, explainable lockout, a forgotten password, caps lock, a stale saved credential, gets handled directly. A pattern across accounts does not.",
          escalate:
            "If several accounts lock at once, or the lockout coincides with a sign-in the user says was not them, it moves to the escalation desk instead of a routine reset."
        },
        investigation: {
          overview:
            "Work through the ordinary causes before treating the lockout as unusual.",
          check:
            "Recent sign-in attempts, whether a saved password on another device is stale, and whether the lockout threshold was actually reached.",
          logic:
            "Rule out the boring explanations first, an expired password, a synced device with an old credential, a typo, before treating the lockout as suspicious."
        },
        resolution: {
          overview: "Reset or unlock through the standard path once the cause is clear.",
          logic:
            "Match the fix to the cause: unlock and reset for a stale credential, then walk the user through updating it on every synced device so it does not immediately relock.",
          document:
            "The cause, the fix applied, and which devices needed the credential updated, so a repeat lockout is not treated as a fresh mystery."
        },
        verification: {
          overview: "Confirm the user is actually back in, not just that a reset succeeded.",
          verify:
            "Have the user sign in while still on the call or chat, on the device they actually use, since a back-end reset confirmation is not the same thing.",
          escalate:
            "If the account locks again shortly after, that stops being a password problem and goes to the escalation desk."
        },
        documentation: {
          overview: "Close the loop in the ticket and with the user.",
          document:
            "Root cause, resolution steps, and any devices updated, written so the next person is not repeating the same diagnosis.",
          clarify:
            "Confirm with the user that they are fully back in on every device they use before marking it resolved, not just the one used to test."
        }
      },
      knowledgeBase: {
        overview: "A quick check before improvising a fix.",
        consult: "Any documented steps for that account type's reset process.",
        update:
          "A note added if this cause was not already covered, so the next lockout with the same signature resolves faster."
      },
      escalationDesk: {
        overview: "The account-security handoff, when the pattern calls for one.",
        trigger:
          "Multiple related lockouts, or a lockout tied to activity the user does not recognize.",
        handoff:
          "Everything gathered so far, timestamps, affected accounts, and what has already been ruled out, so the receiving team is not starting over.",
        retain: "I stay the point of contact for the user even after escalating the account-security piece."
      }
    },

    vpn: {
      label: "Unstable remote-access or VPN connection",
      summary:
        "A remote connection keeps dropping or will not establish, and the user needs it to actually hold, not just reconnect once.",
      stations: {
        intake: {
          overview: "Establish exactly what unstable means before touching anything.",
          clarify:
            "When it drops, whether it is constant or tied to something, waking the laptop, switching Wi-Fi networks, a specific app, and what they were doing when it last failed.",
          check:
            "Whether it is affecting one user or several on the same network, and what network they are actually connecting from."
        },
        triage: {
          overview: "Sort a local network problem from something upstream.",
          logic:
            "One person on flaky home Wi-Fi is a local fix. Several people dropping around the same time points somewhere upstream.",
          escalate:
            "If several users are affected at once, or the client will not connect regardless of network, it goes to whoever owns that infrastructure rather than being treated as one user's Wi-Fi."
        },
        investigation: {
          overview: "Work outward from the device to the network.",
          check:
            "Local network stability with basic diagnostics, whether the client software is current, and whether the drop lines up with sleep, a network switch, or a specific time of day.",
          logic:
            "Isolate the failure point. If a wired connection is stable but Wi-Fi is not, that is the local network, not the remote-access client."
        },
        resolution: {
          overview: "Apply the fix that matches where the failure actually is.",
          logic:
            "A local fix, network settings, an updated client, moving off a congested Wi-Fi channel, for a local cause, and a clear handoff for anything past the user's own network.",
          document:
            "What was tested, what fixed it or did not, and exactly where in the chain the failure was isolated to."
        },
        verification: {
          overview: "One clean reconnect is not proof; stability over time is.",
          verify:
            "Ask the user to keep the connection open through their normal use, not just reconnect once, since intermittent drops do not always show up in the first minute.",
          escalate:
            "If it holds locally but still drops, the cause is upstream and gets handed off with everything already ruled out."
        },
        documentation: {
          overview: "Record what actually fixed it, since resolved without a cause helps no one next time.",
          document:
            "The specific fix and the conditions that triggered the original drop, not just that it is resolved now.",
          clarify:
            "Confirm the user's normal working pattern, like leaving the laptop asleep overnight, was not going to reproduce the same drop the next day."
        }
      },
      knowledgeBase: {
        overview: "Known patterns for this connection type, checked first.",
        consult: "Existing steps for that connection type and any known local network quirks.",
        update: "The isolation steps used here, added if the cause was not already documented."
      },
      escalationDesk: {
        overview: "The infrastructure handoff, when the cause is past the user's own network.",
        trigger:
          "The client will not hold a connection on any known-good network, or several users are affected at once.",
        handoff:
          "Confirmation that the user's own device and network were ruled out, plus timestamps and what was tested.",
        retain: "I keep the user updated while the infrastructure side is investigated."
      }
    },

    workstation: {
      label: "Slow or unreliable workstation",
      summary:
        "A machine that has become sluggish, freezes, or behaves inconsistently, with no single obvious cause yet.",
      stations: {
        intake: {
          overview: "Pin down when it started and what slow actually looks like.",
          clarify:
            "When it started, whether it is constant or happens during specific tasks, and whether anything changed around the same time, an update, a new install, low disk space.",
          check: "Basic resource use, CPU, memory, and disk, to see if something is obviously maxed out."
        },
        triage: {
          overview: "Decide whether this is a quick fix or something deeper.",
          logic:
            "A single background process or a full disk is routine. Failing hardware or the same symptom across multiple machines is not.",
          escalate:
            "If diagnostics point to failing hardware, or the same symptom shows up on multiple machines at once, it goes past a single-workstation fix."
        },
        investigation: {
          overview: "Narrow it from slow to a specific cause.",
          check: "Startup programs, running processes, available disk space, and basic hardware health indicators.",
          logic:
            "Match the pattern to a cause. Constant sluggishness suggests a resource hog or failing hardware; slowness tied to one app suggests that app or its updates."
        },
        resolution: {
          overview: "Fix the specific cause, not just restart and hope.",
          logic:
            "Clear the actual bottleneck, free disk space, disable a runaway process, roll back a problem update, rather than a generic reboot that only masks it temporarily.",
          document: "What was consuming resources, what was changed, and whether it is a one-time fix or something to watch."
        },
        verification: {
          overview: "Confirm performance under real, not idle, conditions.",
          verify:
            "Watch the machine under the user's normal workload for a stretch, not just at idle right after the fix, since some slowness only reappears under load.",
          escalate:
            "If performance degrades again shortly after, or points to hardware wear, it moves to a hardware evaluation rather than another software pass."
        },
        documentation: {
          overview: "Leave a clear record for whoever touches this machine next.",
          document: "Cause, fix, and any hardware concern flagged for future replacement planning.",
          clarify:
            "Confirm with the user which tasks were slow before, so the same tasks can be checked after the fix instead of relying on a general feels faster."
        }
      },
      knowledgeBase: {
        overview: "A pattern check across similar hardware before diagnosing from zero.",
        consult: "Any documented pattern for that symptom on similar hardware or software configuration.",
        update: "The cause, logged if it is a new pattern, especially anything that could recur across similar machines."
      },
      escalationDesk: {
        overview: "The hardware-review handoff, when software fixes are not the answer.",
        trigger: "Hardware diagnostics point to failing components, or the same symptom appears across multiple machines.",
        handoff:
          "What has already been ruled out and the specific diagnostic results, so a hardware or deeper software review does not start from zero.",
        retain: "I keep the ticket and the user informed while a hardware review is pending."
      }
    },

    authentication: {
      label: "Suspicious authentication activity",
      summary:
        "A sign-in that looks off, an unfamiliar location, device, or time, either flagged by the user or by an automated alert.",
      stations: {
        intake: {
          overview: "Get the report precise before assuming anything.",
          clarify:
            "What exactly looked wrong, a sign-in from an unfamiliar place, a device they do not recognize, or an alert they did not trigger themselves, and when they noticed it.",
          check: "The account's recent sign-in history against what the user actually recognizes as their own activity."
        },
        triage: {
          overview: "This category starts cautious by default.",
          logic:
            "Even a plausible explanation, the user traveling or using a new device, does not rule out compromise on its own, so it is treated as a security concern until confirmed otherwise.",
          escalate:
            "Anything that is not clearly and fully explained by the user's own activity goes to the escalation desk rather than being closed as a false alarm."
        },
        investigation: {
          overview: "Compare the report against the account's real activity.",
          check:
            "Sign-in times, locations, and devices against what the user says is theirs, and whether a password reset or session sign-out has already happened.",
          logic:
            "Look for a benign explanation the user can confirm firsthand, a new phone, a trip, a shared device, rather than assuming either compromise or nothing happened."
        },
        resolution: {
          overview: "The support-desk fix here is containment, not investigation.",
          logic:
            "Secure the account first, a password reset and signing out other sessions, then hand the deeper question of what happened to whoever owns account security.",
          document:
            "Exactly what was observed, what the user confirmed or did not recognize, and what containment steps were taken and when."
        },
        verification: {
          overview: "Confirm the account is actually secured, not just that a form was submitted.",
          verify:
            "The user can sign in with a fresh credential and other sessions are actually closed, not just that a reset notice went out.",
          escalate:
            "The activity itself stays with the security or account-owner team regardless of how the containment step goes; this only closes the support-desk portion."
        },
        documentation: {
          overview: "This ticket's record matters beyond just this user.",
          document:
            "A full timeline, what was flagged, what was confirmed, and what containment happened, since this record may feed a broader security review.",
          clarify:
            "Confirm the user understands what changed on their account, like a new sign-in requirement, so they are not caught off guard next time they sign in."
        }
      },
      knowledgeBase: {
        overview: "Containment steps and ownership, confirmed rather than improvised.",
        consult: "Documented steps for account containment and who owns the security follow-up.",
        update: "This case type is rarely new to the knowledge base, but any unusual detail gets flagged forward rather than closed quietly."
      },
      escalationDesk: {
        overview: "The security handoff this category almost always needs.",
        trigger: "Any activity the user cannot fully and firsthand explain.",
        handoff: "Full sign-in history reviewed, what containment was already done, and exactly what remains unexplained.",
        retain: "My role ends at containment and a clean handoff; the security review itself belongs to the team that owns it."
      }
    }
  };

  const DEFAULT_TICKET = "lockout";
  const DEFAULT_PHASE = "diagnose";
  const DEFAULT_STATION = "intake";

  const ticketButtons = Array.from(root.querySelectorAll("[data-ticket]"));
  const phaseButtons = Array.from(root.querySelectorAll("[data-phase]"));
  const phasePanels = Array.from(root.querySelectorAll("[data-phase-panel]"));
  const stationButtons = Array.from(root.querySelectorAll("[data-station]"));
  const summaryEl = root.querySelector("[data-ticket-summary]");
  const phaseLabel = root.querySelector("[data-phase-label]");
  const secondaryDetails = root.querySelector(".resolution-desk__secondary");
  const panelEyebrow = root.querySelector("[data-evidence-eyebrow]");
  const panelTitle = root.querySelector("[data-evidence-title]");
  const panelOverview = root.querySelector("[data-evidence-overview]");
  const panelFields = root.querySelector("[data-evidence-fields]");
  const markers = Array.from(root.querySelectorAll("[data-route-marker]"));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let currentTicket = DEFAULT_TICKET;
  let currentPhase = DEFAULT_PHASE;
  let currentStation = DEFAULT_STATION;
  let animationToken = 0;

  function posFor(map, phaseKey) {
    return map[phaseKey] || map.diagnose;
  }

  function isVisible(el) {
    return !!el && el.getClientRects().length > 0;
  }

  function activeMarkers() {
    // Both layouts render at all times; only one is visible per breakpoint.
    // Keep the hidden one's marker in sync (no animation) so a mid-session
    // resize never shows a stale position.
    return markers.map((marker) => ({
      marker,
      visible: isVisible(marker.closest("svg"))
    }));
  }

  function coordsForLayout(svgEl, phaseKey) {
    const isMobile = svgEl.classList.contains("route-map--mobile");
    return posFor(isMobile ? MOBILE_POS : DESKTOP_POS, phaseKey);
  }

  function setMarkerTransform(marker, x, y) {
    marker.setAttribute("transform", `translate(${x}, ${y})`);
  }

  function placeMarkersInstant(phaseKey) {
    activeMarkers().forEach(({ marker }) => {
      const svg = marker.closest("svg");
      const pos = coordsForLayout(svg, phaseKey);
      setMarkerTransform(marker, pos.x, pos.y);
    });
  }

  function glideMarkers(fromKey, toKey, duration, token) {
    const targets = activeMarkers();
    const start = performance.now();

    function frame(now) {
      if (token !== animationToken) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      targets.forEach(({ marker, visible }) => {
        const svg = marker.closest("svg");
        const from = coordsForLayout(svg, fromKey);
        const to = coordsForLayout(svg, toKey);
        if (!visible) {
          setMarkerTransform(marker, to.x, to.y);
          return;
        }
        const x = from.x + (to.x - from.x) * eased;
        const y = from.y + (to.y - from.y) * eased;
        setMarkerTransform(marker, x, y);
      });
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function ticketDataFor(key) {
    return TICKETS[key] || TICKETS[DEFAULT_TICKET];
  }

  function fieldListFor(stationKey) {
    if (STATION_FIELDS[stationKey]) return STATION_FIELDS[stationKey];
    if (SECONDARY_FIELDS[stationKey]) return SECONDARY_FIELDS[stationKey];
    return [];
  }

  function fieldLabel(fieldKey) {
    return FIELD_LABELS[fieldKey] || SECONDARY_FIELD_LABELS[fieldKey] || fieldKey;
  }

  function renderPanel(ticketKey, stationKey) {
    const ticket = ticketDataFor(ticketKey);
    const stationData = ticket.stations
      ? ticket.stations[stationKey] || ticket[stationKey]
      : ticket[stationKey];
    if (!stationData) return;

    panelEyebrow.textContent = `${ticket.label} / ${STATION_LABELS[stationKey]}`;
    panelTitle.textContent = STATION_LABELS[stationKey];
    panelOverview.textContent = stationData.overview || "";

    panelFields.innerHTML = "";
    fieldListFor(stationKey).forEach((fieldKey) => {
      const value = stationData[fieldKey];
      if (!value) return;
      const wrap = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = fieldLabel(fieldKey);
      const dd = document.createElement("dd");
      dd.textContent = value;
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      panelFields.appendChild(wrap);
    });
  }

  function setStationPressedState(stationKey) {
    stationButtons.forEach((button) => {
      const isCurrent = button.dataset.station === stationKey;
      button.setAttribute("aria-pressed", String(isCurrent));
      button.classList.toggle("is-selected", isCurrent);
    });
  }

  function setPhasePresentation(phaseKey) {
    phaseButtons.forEach((button) => {
      const isCurrent = button.dataset.phase === phaseKey;
      button.setAttribute("aria-pressed", String(isCurrent));
      button.classList.toggle("is-selected", isCurrent);
    });

    phasePanels.forEach((phasePanel) => {
      phasePanel.hidden = phasePanel.dataset.phasePanel !== phaseKey;
    });

    phaseLabel.textContent = `${PHASE_LABELS[phaseKey]} · choose a step`;
  }

  function setTicketPressedState(ticketKey) {
    ticketButtons.forEach((button) => {
      const isCurrent = button.dataset.ticket === ticketKey;
      button.setAttribute("aria-pressed", String(isCurrent));
      button.classList.toggle("is-selected", isCurrent);
    });
  }

  function selectStation(stationKey, options = {}) {
    const { animate = true } = options;
    const stationPhase = STATION_PHASES[stationKey];
    const previousPhase = currentPhase;

    if (stationPhase && stationPhase !== currentPhase) {
      currentPhase = stationPhase;
      setPhasePresentation(currentPhase);
    }

    currentStation = stationKey;
    renderPanel(currentTicket, stationKey);
    setStationPressedState(stationKey);

    if (!stationPhase || stationPhase === previousPhase) return;

    if (!animate || reduceMotion.matches) {
      placeMarkersInstant(currentPhase);
      return;
    }

    animationToken += 1;
    glideMarkers(previousPhase, currentPhase, 320, animationToken);
  }

  function selectPhase(phaseKey, options = {}) {
    if (!PHASES[phaseKey]) return;
    const { animate = true } = options;
    const previousPhase = currentPhase;
    currentPhase = phaseKey;
    setPhasePresentation(phaseKey);

    const stationKey = PHASES[phaseKey][0];
    currentStation = stationKey;
    renderPanel(currentTicket, stationKey);
    setStationPressedState(stationKey);

    if (!animate || reduceMotion.matches) {
      placeMarkersInstant(phaseKey);
      return;
    }

    animationToken += 1;
    glideMarkers(previousPhase, phaseKey, 320, animationToken);
  }

  function selectTicket(ticketKey) {
    if (!TICKETS[ticketKey]) return;
    currentTicket = ticketKey;
    currentPhase = DEFAULT_PHASE;
    currentStation = DEFAULT_STATION;

    setTicketPressedState(ticketKey);
    const ticket = TICKETS[ticketKey];
    summaryEl.textContent = ticket.summary;
    renderPanel(ticketKey, DEFAULT_STATION);
    setPhasePresentation(DEFAULT_PHASE);
    setStationPressedState(DEFAULT_STATION);
    secondaryDetails.open = false;
    animationToken += 1;
    placeMarkersInstant(DEFAULT_PHASE);
  }

  ticketButtons.forEach((button) => {
    button.addEventListener("click", () => selectTicket(button.dataset.ticket));
  });

  phaseButtons.forEach((button) => {
    button.addEventListener("click", () => selectPhase(button.dataset.phase));
  });

  stationButtons.forEach((button) => {
    const key = button.dataset.station;
    button.addEventListener("click", () => selectStation(key));
    button.addEventListener("focus", () => {
      if (currentStation !== key) selectStation(key);
    });
  });

  // Initialize to match the statically rendered default (lockout / intake)
  // with no motion, so nothing has to animate before the panel is correct.
  setTicketPressedState(DEFAULT_TICKET);
  setPhasePresentation(DEFAULT_PHASE);
  setStationPressedState(DEFAULT_STATION);
  placeMarkersInstant(DEFAULT_PHASE);
})();
