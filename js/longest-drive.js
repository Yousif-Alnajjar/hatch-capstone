// Chapter 2 — two scrollies.
//
// 2A ("drive"): the web of everyday routes. Pittsburgh map with all 50 days
// of trip traces as backdrop; each scroll step highlights one of the author's
// repeat destinations (home, campus, the park, Home Depot).
//
// 2B ("telematics"): same Pittsburgh map reused; an overlay of hard-brake
// and hard-accel points from the full fifty-day OBD dataset, a peak-speed
// pin, and a LexisNexis-style dossier that populates step by step.

import { lightRasterStyle } from "./map-styles.js?v=19";
import { loadJSON, palette, waitForSize } from "./utils.js?v=19";

const TRIPS_URL     = "data/all_trips.geojson";
const DESTINATIONS  = "data/destinations.geojson";
const EVENTS_URL    = "data/telemetry_events.geojson";
const SUMMARY_URL   = "data/summary.json";
const PEAK_DRIVE    = "data/peak_drive.geojson";

const URBAN_BBOX = [[-80.020, 40.421], [-79.908, 40.472]];

function splitEvents(ev) {
  const brake = [], accel = [];
  let peak = null;
  for (const f of ev.features) {
    const k = f.properties.kind;
    if (k === "brake") brake.push(f);
    else if (k === "accel") accel.push(f);
    else if (k === "peak") peak = f;
  }
  return { brake, accel, peak };
}

// ── Map setup (shared between 2A and 2B) ────────────────────

async function setupMap(containerId, trips, opts = {}) {
  await waitForSize(document.getElementById(containerId));
  const map = new maplibregl.Map({
    container: containerId,
    style: lightRasterStyle(),
    center: [-79.965, 40.445],
    zoom: 11.2,
    dragRotate: false,
    pitchWithRotate: false,
    attributionControl: true,
    interactive: false
  });
  if (map.scrollZoom) map.scrollZoom.disable();

  const ro = new ResizeObserver(() => map.resize());
  ro.observe(document.getElementById(containerId));

  map.once("load", () => {
    map.resize();
    requestAnimationFrame(() => map.resize());
    setTimeout(() => map.resize(), 200);
  });

  map.on("load", () => {
    // All trip traces as faint accent lines
    map.addSource("trips", { type: "geojson", data: trips });
    map.addLayer({
      id: "trips-line",
      type: "line",
      source: "trips",
      paint: {
        "line-color": palette.accent,
        "line-width": 1,
        "line-opacity": opts.tripOpacity ?? 0.12,
        "line-blur": 0.2
      },
      layout: { "line-cap": "round", "line-join": "round" }
    });

    // Destination marker ring (one active at a time)
    map.addSource("destinations", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "dest-halo",
      type: "circle",
      source: "destinations",
      paint: {
        "circle-color": palette.accent,
        "circle-opacity": 0.18,
        "circle-radius": 32,
        "circle-blur": 0.85
      }
    });
    map.addLayer({
      id: "dest-ring",
      type: "circle",
      source: "destinations",
      paint: {
        "circle-color": palette.paper,
        "circle-opacity": 0.6,
        "circle-stroke-color": palette.accent,
        "circle-stroke-width": 2,
        "circle-radius": 12
      }
    });

    // Event overlay (for 2B)
    map.addSource("events", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] }
    });
    map.addLayer({
      id: "events-circles",
      type: "circle",
      source: "events",
      paint: {
        "circle-color": [
          "match", ["get", "kind"],
          "brake", palette.accent,
          "accel", "#2B4862",
          "peak",  palette.accent,
          palette.accent
        ],
        "circle-stroke-color": palette.paper,
        "circle-stroke-width": 0.5,
        "circle-radius": [
          "case",
          ["==", ["get", "kind"], "peak"], 11,
          ["interpolate", ["linear"], ["coalesce", ["get", "mag"], 7], 7, 3, 25, 6]
        ],
        "circle-opacity": [
          "case",
          ["==", ["get", "kind"], "peak"], 1.0,
          0.6
        ]
      }
    });

    map.fitBounds(URBAN_BBOX, { padding: 20, duration: 0 });
  });

  return map;
}

// ── Scrolly A: everyday destinations ───────────────────────

async function initEverydayScrolly(trips, destinations) {
  const mapA = await setupMap("longest-drive-map", trips, { tripOpacity: 0.14 });
  const byId = Object.fromEntries(destinations.features.map(f => [f.properties.id, f]));

  // Scroll steps — align with the six step elements in index.html.
  const steps = [
    { id: null,         zoom: "overview" },
    { id: "melwood",    zoom: 14.4 },
    { id: "cmu",        zoom: 14.4 },
    { id: "schenley",   zoom: 13.6 },
    { id: "color",      zoom: 14.4 },
    { id: "homedepot",  zoom: 14.2 }
  ];

  // Label markers — HTML-based for clean typography.
  // MapLibre's Marker writes opacity:1 onto the element each frame, so we
  // control visibility via a class on an inner div instead.
  const labelByDest = {};
  for (const f of destinations.features) {
    const el = document.createElement("div");
    el.className = "dest-label";
    el.dataset.id = f.properties.id;
    el.innerHTML = `
      <div class="dest-label-inner">
        <div class="dest-label-name">${f.properties.name}</div>
        <div class="dest-label-sub">${f.properties.subtitle} · ${f.properties.trip_count} trips</div>
      </div>
    `;
    new maplibregl.Marker({ element: el, anchor: "top", offset: [0, 14] })
      .setLngLat(f.geometry.coordinates)
      .addTo(mapA);
    labelByDest[f.properties.id] = el;
  }
  // Default hide every label
  Object.values(labelByDest).forEach(el => el.classList.add("dest-label--off"));

  function applyStepA(i) {
    const cfg = steps[Math.max(0, Math.min(steps.length - 1, i))];
    // Update the highlight ring source
    const destSrc = mapA.getSource("destinations");
    if (destSrc) {
      destSrc.setData(cfg.id ? {
        type: "FeatureCollection",
        features: [byId[cfg.id]]
      } : { type: "FeatureCollection", features: [] });
    }
    // Show only the active label
    Object.entries(labelByDest).forEach(([id, el]) => {
      el.classList.toggle("dest-label--off", id !== cfg.id);
    });

    if (cfg.zoom === "overview" || !cfg.id) {
      mapA.fitBounds(URBAN_BBOX, { padding: 20, duration: 900 });
    } else {
      const coord = byId[cfg.id].geometry.coordinates;
      mapA.easeTo({ center: coord, zoom: cfg.zoom, duration: 1000 });
    }
  }

  attachScroller("scrolly-drive", applyStepA);
  return mapA;
}

// ── Scrolly B: telematics overlay ──────────────────────────

async function initTelematicsScrolly(trips, events, summary, peakDrive) {
  const mapB = await setupMap("telematics-map", trips, { tripOpacity: 0.09 });

  const peakFeature = events.peak;
  const peakLngLat  = peakFeature ? peakFeature.geometry.coordinates : null;
  const peakMph     = peakFeature ? peakFeature.properties.mph : 96.5;
  const hbTotal     = summary.hard_brake_total ?? events.brake.length;
  const haTotal     = summary.hard_accel_total ?? events.accel.length;

  // Mini-charts fed by the actual OBD trip in which 96.5 mph was reached.
  const peakFeat = peakDrive?.features?.[0];
  const peakPoints = peakFeat ? peakFeat.properties.points : null;
  const peakPointIdx = peakFeat ? peakFeat.properties.peak_idx : 0;
  const mphChart = peakPoints
    ? pendingChart("mph-chart-2", "Speed · 96.5 mph drive",      peakPoints, p => p.mph,   "mph")
    : null;
  const altChart = peakPoints
    ? pendingChart("alt-chart-2", "Altitude · 96.5 mph drive",   peakPoints, p => p.alt_m, "m")
    : null;

  const state = { hb: 0, ha: 0, peak: 0, premium: 0 };

  function eventsForStep(step) {
    const feats = [];
    if (step >= 1) feats.push(...events.brake);
    if (step >= 2) feats.push(...events.accel);
    if (step >= 3 && peakFeature) feats.push(peakFeature);
    return { type: "FeatureCollection", features: feats };
  }

  // Choose the scrubbed chart index for each step:
  //   steps 0–2: park the cursor at the end of the drive, charts dim
  //   step 3:    scrub to the 96.5 peak, charts fully lit
  //   step 4:    leave cursor at peak
  function chartIdxForStep(stepIdx) {
    if (!peakPoints) return 0;
    return stepIdx >= 3 ? peakPointIdx : peakPoints.length - 1;
  }

  function applyStepB(stepIdx) {
    const dossierEl = document.getElementById("dossier-overlay-2");
    if (dossierEl) dossierEl.setAttribute("data-active", "true");

    const src = mapB.getSource("events");
    if (src) src.setData(eventsForStep(stepIdx));

    setOrAnimate("hb-count-2", state, "hb",
      stepIdx >= 1 ? hbTotal : null,
      v => Math.round(v).toLocaleString());
    setOrAnimate("ha-count-2", state, "ha",
      stepIdx >= 2 ? haTotal : null,
      v => Math.round(v).toLocaleString());
    setOrAnimate("peak-val-2", state, "peak",
      stepIdx >= 3 ? peakMph : null,
      v => `${v.toFixed(1)} mph`);
    setOrAnimate("premium-val-2", state, "premium",
      stepIdx >= 4 ? 12 : null,
      v => `+${v.toFixed(1)}%`);

    const peakTile = document.getElementById("peak-val-2");
    if (peakTile) peakTile.classList.toggle("dossier-pulse", stepIdx >= 3);

    // Scrub the mph / alt mini-charts.
    const idx = chartIdxForStep(stepIdx);
    if (mphChart?.ready) updateChart(mphChart.chart, idx);
    if (altChart?.ready) updateChart(altChart.chart, idx);
    // Charts brighten when the peak is the focus.
    const chartStack = document.querySelector('#scrolly-telematics .chart-stack');
    if (chartStack) {
      chartStack.classList.toggle('chart-stack--active', stepIdx >= 3);
    }

    if (stepIdx >= 3 && peakLngLat) {
      mapB.easeTo({ center: peakLngLat, zoom: 13.6, duration: 900 });
    } else {
      mapB.fitBounds(URBAN_BBOX, { padding: 20, duration: 900 });
    }
  }

  attachScroller("scrolly-telematics", applyStepB);

  // Initial scrub of the charts to the end of the drive, so even before the
  // reader enters the scrolly the mph/alt panels look authored rather than
  // empty. Keep retrying until the charts have laid out.
  const initialIdx = peakPoints ? peakPoints.length - 1 : 0;
  const nudgeCharts = () => {
    if (mphChart?.ready) updateChart(mphChart.chart, initialIdx);
    if (altChart?.ready) updateChart(altChart.chart, initialIdx);
  };
  [500, 1200, 2500].forEach(ms => setTimeout(nudgeCharts, ms));

  return mapB;
}

// ── Public entry ───────────────────────────────────────────

export async function initDriveScrolly() {
  const [trips, destinations, eventsDoc, summary, peakDrive] = await Promise.all([
    loadJSON(TRIPS_URL),
    loadJSON(DESTINATIONS),
    loadJSON(EVENTS_URL).catch(() => ({ type: "FeatureCollection", features: [] })),
    loadJSON(SUMMARY_URL).catch(() => ({})),
    loadJSON(PEAK_DRIVE).catch(() => null)
  ]);
  const events = splitEvents(eventsDoc);

  await initEverydayScrolly(trips, destinations);
  await initTelematicsScrolly(trips, events, summary, peakDrive);
}

// ── Mini-chart renderer (shared) ───────────────────────────

function buildChart(containerId, label, points, accessor, unit) {
  const el = document.getElementById(containerId);
  if (!el) return null;
  const W = el.clientWidth || 280, H = 62;
  const pad = { l: 6, r: 6, t: 14, b: 6 };
  const innerW = W - pad.l - pad.r, innerH = H - pad.t - pad.b;

  const values = points.map(accessor).map(v => (v == null ? 0 : v));
  const minV = Math.min(...values), maxV = Math.max(...values);
  const x = i => pad.l + (i / (points.length - 1)) * innerW;
  const y = v => pad.t + innerH - ((v - minV) / (maxV - minV || 1)) * innerH;

  let d = `M ${x(0)} ${y(values[0])}`;
  for (let i = 1; i < values.length; i++) d += ` L ${x(i)} ${y(values[i])}`;
  const area = d + ` L ${x(values.length - 1)} ${y(minV)} L ${x(0)} ${y(minV)} Z`;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${label}">
      <text class="chart-title" x="6" y="10">${label}</text>
      <text class="chart-value" x="${W - 6}" y="10" text-anchor="end"></text>
      <path d="${area}" fill="#6E1418" fill-opacity="0.08"/>
      <path d="${d}" fill="none" stroke="#6E1418" stroke-width="1.2" stroke-opacity="0.85"/>
      <line x1="${x(0)}" x2="${x(0)}" y1="${pad.t}" y2="${H - pad.b}" stroke="#A61C25" stroke-width="1.2"/>
      <circle cx="${x(0)}" cy="${y(values[0])}" r="2.5" fill="#A61C25"/>
    </svg>
  `;
  return { el, x, y, values, unit, label };
}

function updateChart(chart, idx) {
  if (!chart) return;
  const { el, x, y, values, unit } = chart;
  const clamped = Math.max(0, Math.min(values.length - 1, idx));
  const val = values[clamped];
  const cursor = el.querySelector("line");
  const dot    = el.querySelector("circle");
  const vLabel = el.querySelector("text.chart-value");
  if (!cursor || !dot || !vLabel) return;
  cursor.setAttribute("x1", x(clamped));
  cursor.setAttribute("x2", x(clamped));
  dot.setAttribute("cx", x(clamped));
  dot.setAttribute("cy", y(val));
  vLabel.textContent = `${val.toFixed(unit === "mph" ? 1 : 0)} ${unit}`;
}

function pendingChart(id, label, points, accessor, unit) {
  let chart = null;
  let ready = false;
  const el = document.getElementById(id);
  const build = () => {
    if (!el || ready) return;
    if (el.clientWidth === 0) return;
    chart = buildChart(id, label, points, accessor, unit);
    ready = true;
  };
  if (el) {
    // ResizeObserver reliably fires once the container gets a non-zero size.
    const ro = new ResizeObserver(() => { if (!ready) build(); });
    ro.observe(el);
    // IntersectionObserver in case the container is already sized but
    // hasn't laid out yet.
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting) && !ready) build();
    });
    io.observe(el);
  }
  // Safety net — a few setTimeouts to catch late layout.
  [300, 900, 2000].forEach(ms => setTimeout(build, ms));
  return {
    get chart() { return chart; },
    get ready() { return ready; },
    rebuild: () => { if (el) { el.innerHTML = ""; ready = false; build(); } }
  };
}

// ── Scrollama glue + utilities ─────────────────────────────

function attachScroller(scrollyId, applyStep) {
  const el = document.getElementById(scrollyId);
  if (!el || !window.scrollama) return;
  const scroller = scrollama();
  scroller
    .setup({ step: `#${scrollyId} .step`, offset: 0.6, debug: false })
    .onStepEnter(({ element, index }) => {
      el.querySelectorAll(".step").forEach(s => s.setAttribute("data-active", "false"));
      element.setAttribute("data-active", "true");
      applyStep(index);
    });
  window.addEventListener("resize", () => scroller.resize());
}

function animateCount(id, from, to, fmt) {
  const elt = document.getElementById(id);
  if (!elt) return;
  const start = performance.now();
  const dur = 700;
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const v = from + (to - from) * easeOutCubic(t);
    elt.textContent = fmt(v);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setOrAnimate(id, state, key, to, fmt) {
  const el = document.getElementById(id);
  if (!el) return;
  if (to === null) {
    el.textContent = "·";
    state[key] = 0;
    return;
  }
  animateCount(id, state[key] ?? 0, to, fmt);
  state[key] = to;
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
