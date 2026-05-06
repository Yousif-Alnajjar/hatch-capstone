// Chapter 3: Green Book Hill District map + static listing table.

import { lightRasterStyle } from "./map-styles.js?v=19";
import { loadJSON, palette, waitForSize } from "./utils.js?v=19";

// Approximate footprint of the Lower Hill demolition zone (~95 acres
// cleared 1955–1961 for the Civic Arena). Bounded by Bedford Ave (N),
// Fifth Ave (S), Grant Street / Bigelow Blvd (W), Crawford Street (E).
// Corners derived from the surviving 1950s lot grid as traced on current
// OSM — intentionally kept tight to the actual razed area, which is why
// it does not overlap the surviving dots east of Crawford.
const LOWER_HILL_POLYGON = {
  type: "Feature",
  properties: { name: "Lower Hill demolition zone (approx.)" },
  geometry: {
    type: "Polygon",
    coordinates: [[
      [-79.9987, 40.4472],   // NW: Bigelow & Bedford
      [-79.9908, 40.4488],   // NE: Bedford & Crawford
      [-79.9875, 40.4429],   // SE: Fifth & Crawford
      [-79.9960, 40.4415],   // SW: Fifth & Grant
      [-79.9987, 40.4472]    // close
    ]]
  }
};

export async function initGreenBook(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  await waitForSize(el);
  const data = await loadJSON("data/green_book_hill_district.geojson");

  const map = new maplibregl.Map({
    container: containerId,
    style: lightRasterStyle(),
    center: [-79.984, 40.4462],
    zoom: 14.8,
    dragRotate: false,
    pitchWithRotate: false,
    attributionControl: true
  });
  if (map.scrollZoom) map.scrollZoom.disable();
  if (map.touchZoomRotate) map.touchZoomRotate.disableRotation();

  // Keep canvas sized correctly as layout settles
  const ro = new ResizeObserver(() => map.resize());
  ro.observe(el);
  map.once("load", () => {
    map.resize();
    requestAnimationFrame(() => map.resize());
    setTimeout(() => map.resize(), 200);
  });

  map.on("load", () => {
    map.addSource("demolition", { type: "geojson", data: LOWER_HILL_POLYGON });
    // Hatched fill: build a small pattern on a canvas, then register as an image.
    const size = 12;
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = size;
    patternCanvas.height = size;
    const pctx = patternCanvas.getContext("2d");
    pctx.fillStyle = "rgba(138, 133, 126, 0.14)";
    pctx.fillRect(0, 0, size, size);
    pctx.strokeStyle = "rgba(85, 80, 74, 0.55)";
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(-2, size + 2);
    pctx.lineTo(size + 2, -2);
    pctx.stroke();
    try {
      const imgData = pctx.getImageData(0, 0, size, size);
      map.addImage("hatch", {
        width: size,
        height: size,
        data: new Uint8Array(imgData.data.buffer)
      });
      map.addLayer({
        id: "demolition-fill",
        type: "fill",
        source: "demolition",
        paint: { "fill-pattern": "hatch", "fill-opacity": 0.95 }
      });
    } catch (e) {
      map.addLayer({
        id: "demolition-fill",
        type: "fill",
        source: "demolition",
        paint: { "fill-color": palette.ink3, "fill-opacity": 0.18 }
      });
    }
    map.addLayer({
      id: "demolition-stroke",
      type: "line",
      source: "demolition",
      paint: {
        "line-color": palette.ink3,
        "line-width": 1,
        "line-dasharray": [2, 4]
      }
    });

    // Demolition-zone label as an HTML marker for typographic control.
    // Placed inside the new polygon so it stays on land and inside the hatch.
    const lbl = document.createElement("div");
    lbl.className = "map-hud-label";
    lbl.textContent = "Lower Hill · razed 1955–1961";
    new maplibregl.Marker({ element: lbl, anchor: "center" })
      .setLngLat([-79.9932, 40.4452])
      .addTo(map);

    map.addSource("green-book", { type: "geojson", data });
    map.addLayer({
      id: "gb-halo",
      type: "circle",
      source: "green-book",
      paint: {
        "circle-color": palette.accent,
        "circle-opacity": 0.18,
        "circle-radius": 14,
        "circle-blur": 0.6
      }
    });
    map.addLayer({
      id: "gb-dots",
      type: "circle",
      source: "green-book",
      paint: {
        "circle-color": palette.accent,
        "circle-stroke-color": palette.paper,
        "circle-stroke-width": 1.5,
        "circle-radius": 6
      }
    });

    // Interactivity
    map.on("mouseenter", "gb-dots", () => map.getCanvas().style.cursor = "pointer");
    map.on("mouseleave", "gb-dots", () => map.getCanvas().style.cursor = "");
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: "gb-popup"
    });
    map.on("mousemove", "gb-dots", (e) => {
      const f = e.features[0];
      const p = f.properties;
      popup.setLngLat(f.geometry.coordinates)
        .setHTML(`<strong>${p.name}</strong><br><span>${p.street}</span><br><span class="y">${p.years}</span>`)
        .addTo(map);
    });
    map.on("mouseleave", "gb-dots", () => popup.remove());
  });

  renderTable(data);

  return map;
}

function renderTable(geojson) {
  const tbody = document.getElementById("green-book-rows");
  if (!tbody) return;
  const rows = geojson.features
    .map(f => f.properties)
    .sort((a, b) => a.name.localeCompare(b.name));
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.name}</strong></td>
      <td class="est">${r.type}</td>
      <td class="est">${r.street}</td>
      <td class="est">${r.years}</td>
    </tr>
  `).join("");
}
