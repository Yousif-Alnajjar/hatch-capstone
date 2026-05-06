// Shared utilities.

export const palette = {
  paper: "#F5F2EB",
  ink: "#15110E",
  ink2: "#55504A",
  ink3: "#8A857E",
  accent: "#A61C25",
  accentHi: "#C8252F",
  nappa: "#6E1418",
  rule: "#DCD6CB",
  nocturne: "#121013",
  cream: "#EBE4D6",
  cream2: "#A39B8A"
};

export const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function getMotionPref() {
  // ordering: explicit user toggle overrides OS preference
  const stored = localStorage.getItem("atlas-motion");
  if (stored === "off") return "off";
  if (stored === "on") return "on";
  return prefersReducedMotion() ? "off" : "on";
}

export function setMotionPref(val) {
  localStorage.setItem("atlas-motion", val);
  document.documentElement.dataset.motion = val;
  window.dispatchEvent(new CustomEvent("motionchange", { detail: { motion: val } }));
}

// Interpolate between two colors (hex strings).
export function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
  const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr}, ${rg}, ${rb})`;
}

export async function loadJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
  return r.json();
}

export async function loadText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
  return r.text();
}

// Parse a very small CSV (no quoting edge cases needed for our data).
export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const cells = line.split(",");
    const row = {};
    headers.forEach((h, i) => { row[h] = cells[i]; });
    return row;
  });
}

// Great-circle (haversine-ish) interpolation between two [lon, lat] points.
// Returns an array of points along a great-circle arc.
export function greatCircle(p1, p2, npoints = 64) {
  const [lon1, lat1] = p1.map(d => d * Math.PI / 180);
  const [lon2, lat2] = p2.map(d => d * Math.PI / 180);
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((lat2 - lat1) / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
  ));
  if (d === 0) return [p1, p2];
  const pts = [];
  for (let i = 0; i <= npoints; i++) {
    const f = i / npoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    pts.push([lon * 180 / Math.PI, lat * 180 / Math.PI]);
  }
  return pts;
}

export function fmt(n, digits = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// Wait until an element has non-zero size. Useful when bootstrapping maps
// before the page's layout has settled (fonts still loading, viewport 0, etc.).
export function waitForSize(el, timeoutMs = 4000) {
  return new Promise(resolve => {
    const check = () => {
      const r = el.getBoundingClientRect();
      return r.width > 20 && r.height > 20;
    };
    if (check()) return resolve();
    let settled = false;
    const finish = () => { if (settled) return; settled = true; obs.disconnect(); resolve(); };
    const obs = new ResizeObserver(() => { if (check()) finish(); });
    obs.observe(el);
    setTimeout(finish, timeoutMs);
  });
}

// Debounce.
export function debounce(fn, ms = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
