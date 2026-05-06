// Chapter 4A: world map scrolly from Pará to Pittsburgh.

import { darkRasterStyle } from "./map-styles.js?v=19";
import { loadJSON, palette, greatCircle, waitForSize } from "./utils.js?v=19";

export async function initSupplyChain() {
  const container = document.getElementById("supply-chain-map");
  if (!container) return;
  await waitForSize(container);
  const data = await loadJSON("data/supply_chain.geojson");

  // Order nodes by the scrolly plan (1..9):
  // 1 Hiroshima (mazda)  2 Fuchu-cho (seat)  3 Yamagata (finishing)
  // 4 Ludwigshafen (chemistry)  5 Khromtau (chromium)  6 Xinguara (tannery)
  // 7 break (laundering handled elsewhere — still show the slaughter)
  // 8 Marabá/Cachoeira Seca  9 Pittsburgh
  const byId = Object.fromEntries(data.features.map(f => [f.properties.id, f]));
  const stepOrder = [
    { id: "mazda",       zoom: 9,   label: "Mazda Ujina Plant · Hiroshima Bay",       showTo: ["mazda"] },
    { id: "seat",        zoom: 8.5, label: "Delta Kogyo · Fuchu-cho, Hiroshima",     showTo: ["mazda", "seat"] },
    { id: "finishing",   zoom: 5.2, label: "Midori Auto Leather · Yamagata",         showTo: ["mazda", "seat", "finishing"] },
    { id: "chemistry",   zoom: 3.8, label: "BASF Verbund · Ludwigshafen",            showTo: ["mazda", "seat", "finishing", "chemistry"] },
    { id: "chromium",    zoom: 3.6, label: "Donskoy ore plant · Khromtau",           showTo: ["mazda", "seat", "finishing", "chemistry", "chromium"] },
    { id: "tannery",     zoom: 3.4, label: "Durlicouros · Xinguara, Pará",           showTo: ["mazda", "seat", "finishing", "chemistry", "chromium", "tannery"] },
    { id: "slaughter",   zoom: 3.4, label: "The paper trail breaks here",            showTo: ["mazda", "seat", "finishing", "chemistry", "chromium", "tannery", "slaughter"] },
    { id: "origin",      zoom: 4,   label: "Cachoeira Seca Indigenous Territory",    showTo: ["mazda", "seat", "finishing", "chemistry", "chromium", "tannery", "slaughter", "origin"], highlightOrigin: true },
    { id: "pittsburgh",  zoom: 2.6, label: "Pittsburgh · driver's seat",             showTo: ["mazda", "seat", "finishing", "chemistry", "chromium", "tannery", "slaughter", "origin", "pittsburgh"], highlightPittsburgh: true, fitAll: true }
  ];

  const map = new maplibregl.Map({
    container: "supply-chain-map",
    style: darkRasterStyle(),
    center: byId.mazda.geometry.coordinates,
    zoom: 5,
    dragRotate: false,
    pitchWithRotate: false,
    interactive: false,
    attributionControl: true
  });

  const ro = new ResizeObserver(() => map.resize());
  ro.observe(container);
  map.once("load", () => {
    map.resize();
    requestAnimationFrame(() => map.resize());
    setTimeout(() => map.resize(), 200);
  });

  // HTML markers for node labels
  const labelMarkers = {};
  function ensureLabelMarker(id, name, coord, highlight, activeNow) {
    if (!labelMarkers[id]) {
      const el = document.createElement("div");
      el.className = "sc-label";
      el.dataset.id = id;
      const bg = document.createElement("div");
      bg.className = "sc-label-dot";
      const lbl = document.createElement("div");
      lbl.className = "sc-label-text";
      lbl.textContent = name;
      el.appendChild(bg);
      el.appendChild(lbl);
      const marker = new maplibregl.Marker({ element: el, anchor: "top" })
        .setLngLat(coord)
        .addTo(map);
      labelMarkers[id] = { marker, el, lbl };
    }
    const m = labelMarkers[id];
    m.el.dataset.highlight = highlight ? "true" : "false";
    m.el.dataset.active = activeNow ? "true" : "false";
    m.el.style.display = "flex";
  }
  function hideAllLabels() {
    Object.values(labelMarkers).forEach(m => m.el.style.display = "none");
  }

  map.on("load", () => {
    // nodes
    map.addSource("sc-nodes", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "sc-nodes-halo",
      type: "circle",
      source: "sc-nodes",
      paint: {
        "circle-color": ["case", ["==", ["get", "highlight"], true], palette.accentHi, palette.cream],
        "circle-opacity": 0.18,
        "circle-radius": ["case", ["==", ["get", "highlight"], true], 24, 14],
        "circle-blur": 0.8
      }
    });
    map.addLayer({
      id: "sc-nodes-dot",
      type: "circle",
      source: "sc-nodes",
      paint: {
        "circle-color": ["case", ["==", ["get", "highlight"], true], palette.accentHi, palette.cream],
        "circle-stroke-color": palette.nocturne,
        "circle-stroke-width": 1.5,
        "circle-radius": ["case", ["==", ["get", "active"], true], 7, ["==", ["get", "highlight"], true], 9, 5]
      }
    });
    // Labels via HTML markers (better typography, avoids glyph dependency)

    // arcs
    map.addSource("sc-arcs", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "sc-arcs-line",
      type: "line",
      source: "sc-arcs",
      paint: {
        "line-color": palette.cream,
        "line-width": 1,
        "line-opacity": 0.55,
        "line-dasharray": [2, 3]
      },
      layout: { "line-cap": "round", "line-join": "round" }
    });
  });

  const caption = document.getElementById("supply-caption");

  function applyStep(i) {
    const cfg = stepOrder[Math.max(0, Math.min(stepOrder.length - 1, i))];
    const activeIds = new Set(cfg.showTo);
    const activeNode = cfg.id;

    hideAllLabels();
    const features = data.features.map(f => {
      const id = f.properties.id;
      if (!activeIds.has(id)) return null;
      const highlight =
        (cfg.highlightOrigin && id === "origin") ||
        (cfg.highlightPittsburgh && id === "pittsburgh") ||
        id === "origin" || id === "pittsburgh";
      const isActive = id === activeNode;
      ensureLabelMarker(id, f.properties.name, f.geometry.coordinates, highlight, isActive);
      return {
        type: "Feature",
        geometry: f.geometry,
        properties: { id, highlight, active: isActive }
      };
    }).filter(Boolean);

    const src = map.getSource("sc-nodes");
    if (src) src.setData({ type: "FeatureCollection", features });

    // Build arcs between consecutive active nodes in the material-flow order:
    // origin → slaughter → tannery ← (chemistry, chromium feed in) → finishing → seat → mazda → pittsburgh
    const flow = [
      ["chemistry", "finishing"],
      ["chromium", "tannery"],
      ["origin", "slaughter"],
      ["slaughter", "tannery"],
      ["tannery", "finishing"],
      ["finishing", "seat"],
      ["seat", "mazda"],
      ["mazda", "pittsburgh"]
    ];
    const arcs = flow
      .filter(([a, b]) => activeIds.has(a) && activeIds.has(b))
      .map(([a, b]) => ({
        type: "Feature",
        properties: { from: a, to: b },
        geometry: {
          type: "LineString",
          coordinates: greatCircle(byId[a].geometry.coordinates, byId[b].geometry.coordinates, 80)
        }
      }));
    const arcSrc = map.getSource("sc-arcs");
    if (arcSrc) arcSrc.setData({ type: "FeatureCollection", features: arcs });

    // Pan
    const coord = byId[activeNode].geometry.coordinates;
    if (cfg.fitAll) {
      // fit across all active nodes
      const bounds = new maplibregl.LngLatBounds();
      activeIds.forEach(id => bounds.extend(byId[id].geometry.coordinates));
      map.fitBounds(bounds, { padding: { top: 80, bottom: 120, left: 60, right: 60 }, duration: 1400, maxZoom: 4 });
    } else {
      map.easeTo({ center: coord, zoom: cfg.zoom, duration: 1400 });
    }

    if (caption) caption.textContent = `Step ${i + 1} of 9 · ${cfg.label}`;
  }

  // Initial state
  map.on("load", () => applyStep(0));

  // Scrollama
  const el = document.getElementById("scrolly-supply");
  if (el && window.scrollama) {
    const scroller = scrollama();
    scroller
      .setup({ step: "#scrolly-supply .step", offset: 0.6 })
      .onStepEnter(({ element, index }) => {
        el.querySelectorAll(".step").forEach(s => s.setAttribute("data-active", "false"));
        element.setAttribute("data-active", "true");
        applyStep(index);
      });
    window.addEventListener("resize", () => scroller.resize());
  }
}
