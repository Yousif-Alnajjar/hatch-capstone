// Ch 1 + Ch 6: Pittsburgh trip-trace map.

import { lightRasterStyle } from "./map-styles.js?v=19";
import { loadJSON, palette, greatCircle, waitForSize } from "./utils.js?v=19";

export async function initPittsburghTrace(containerId, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Wait for the container to have real dimensions before creating the map.
  await waitForSize(el);

  const data = await loadJSON("data/all_trips.geojson");

  const map = new maplibregl.Map({
    container: containerId,
    style: lightRasterStyle(),
    center: [-79.973, 40.443],
    zoom: opts.zoom ?? 10.4,
    attributionControl: true,
    interactive: opts.interactive ?? false,
    dragRotate: false,
    pitchWithRotate: false
  });
  // Never hijack page scroll: wheel must always scroll the page, not the map.
  if (map.scrollZoom) map.scrollZoom.disable();
  if (map.touchZoomRotate) map.touchZoomRotate.disableRotation();
  // Double-click zoom stays as a discoverable affordance.

  map.on("load", () => {
    map.addSource("trips", { type: "geojson", data });
    map.addLayer({
      id: "trips-line",
      type: "line",
      source: "trips",
      paint: {
        "line-color": palette.accent,
        "line-width": 1,
        "line-opacity": opts.opacity ?? 0.18,
        "line-blur": 0.2
      },
      layout: { "line-cap": "round", "line-join": "round" }
    });

    // Zoom to the urban core where ≥95% of trips live.
    // The outer 2–5% of GPS points (westbound freeway runs, the Laurel Highlands)
    // pull the fit-to-bounds view too wide and drown the city in paper. Instead,
    // fit to a manually-tuned bbox covering Pittsburgh proper.
    const urbanBbox = opts.urbanBbox ?? [
      [-80.020, 40.421],  // SW: Manchester / South Side
      [-79.908, 40.472]   // NE: Highland Park / East Liberty
    ];
    map.fitBounds(urbanBbox, { padding: 16, duration: 0 });

    // Ensure the canvas matches its container once layout settles
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(el);
    map.resize();
    requestAnimationFrame(() => map.resize());
    setTimeout(() => map.resize(), 200);

    // For the Ch 6 closing variant: add a faint great-circle line
    // from Cachoeira Seca to Pittsburgh.
    if (opts.includeWorldArc) {
      const arc = greatCircle([-52.8, -3.5], [-79.995, 40.44], 128);
      map.addSource("arc", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: arc }
        }
      });
      map.addLayer({
        id: "arc-line",
        type: "line",
        source: "arc",
        paint: {
          "line-color": palette.nappa,
          "line-width": 0.9,
          "line-opacity": 0.35,
          "line-dasharray": [1, 3]
        }
      });
    }
  });

  return map;
}
