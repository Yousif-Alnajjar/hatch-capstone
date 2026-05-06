// Orchestrator.
// All module imports carry a version query so the browser reliably refetches
// after an edit. Bump V whenever you change any js/ file.
const V = "?v=19";

import { initPittsburghTrace } from "./pittsburgh-trace.js?v=19";
import { initGreenBook }       from "./green-book.js?v=19";
import { initDriveScrolly }    from "./longest-drive.js?v=19";
import { initSupplyChain }     from "./supply-chain.js?v=19";
import { initLaundering }      from "./laundering.js?v=19";
import { initValueChain }      from "./value-chain.js?v=19";
import { initFourRegimes }     from "./four-regimes.js?v=19";
import { getMotionPref, setMotionPref } from "./utils.js?v=19";

// ── Motion toggle ────────────────────────────────────────────
(function initMotionToggle() {
  const btn = document.getElementById("motion-toggle-btn");
  if (!btn) return;

  const pref = getMotionPref();
  document.documentElement.dataset.motion = pref;
  setButton(pref);

  btn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.motion || "on";
    const next = cur === "on" ? "off" : "on";
    setMotionPref(next);
    setButton(next);
  });

  function setButton(pref) {
    btn.setAttribute("aria-pressed", pref === "off" ? "true" : "false");
    btn.querySelector(".motion-label").textContent = pref === "off" ? "Motion off" : "Motion on";
  }
})();

// ── Kick off each component ──────────────────────────────────
// Defer until load so MapLibre + Scrollama + D3 are ready.

function start() {
  Promise.resolve()
    .then(() => initPittsburghTrace("pittsburgh-trace", { zoom: 10.4, interactive: true }))
    .catch(console.error);

  Promise.resolve()
    .then(() => initGreenBook("green-book-map"))
    .catch(console.error);

  Promise.resolve()
    .then(() => initDriveScrolly())
    .catch(console.error);

  Promise.resolve()
    .then(() => initSupplyChain())
    .catch(console.error);

  Promise.resolve()
    .then(() => initLaundering())
    .catch(console.error);

  Promise.resolve()
    .then(() => initValueChain())
    .catch(console.error);

  Promise.resolve()
    .then(() => initFourRegimes())
    .catch(console.error);

  // closing Pittsburgh mini-trace
  Promise.resolve()
    .then(() => initPittsburghTrace("pittsburgh-closing", { zoom: 9.8, interactive: false, opacity: 0.14, includeWorldArc: true }))
    .catch(console.error);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
