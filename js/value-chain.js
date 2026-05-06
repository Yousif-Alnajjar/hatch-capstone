// Chapter 4C: value-chain bar chart with scale break before the car.

import { palette } from "./utils.js?v=19";

export function initValueChain() {
  const el = document.getElementById("value-chain-bars");
  if (!el) return;

  const rows = [
    { label: "Raw hide at slaughter",      price: 23,     domain: "hide", note: "Marabá" },
    { label: "Wet-blue, post-tanning",     price: 68,     domain: "hide", note: "Xinguara" },
    { label: "Finished red Nappa",         price: 200,    domain: "hide", note: "Yamagata" },
    { label: "Seat, fully assembled",      price: 275,    domain: "hide", note: "Fuchu-cho" },
    { label: "Car MSRP, 2020",             price: 32670,  domain: "car",  note: "Ujina → dealer → driver" }
  ];

  // We use two linear scales so the car bar has its own visual domain.
  // The hide segment spans 0..320; the car segment sits beyond a break.
  const HIDE_MAX = 320;
  const drawCar = rows.some(r => r.domain === "car");

  const W = 760, H = 360;
  const margin = { top: 40, right: 40, bottom: 40, left: 220 };
  const innerW = W - margin.left - margin.right;
  const innerH = H - margin.top - margin.bottom;

  // Hide bars occupy the left 78% of the bar area. Car occupies the right 18%,
  // separated by a 4% visual break.
  const HIDE_W = innerW * 0.78;
  const BREAK_W = innerW * 0.04;
  const CAR_W  = innerW * 0.18;

  const rowH = innerH / rows.length;
  const barH = Math.min(26, rowH * 0.55);

  const bars = rows.map((r, i) => {
    const y = i * rowH + (rowH - barH) / 2;
    let width, color;
    if (r.domain === "hide") {
      width = (r.price / HIDE_MAX) * HIDE_W;
      color = palette.nappa;
    } else {
      // car: scale from 0 to 40000 across CAR_W
      width = Math.min(CAR_W, (r.price / 40000) * CAR_W);
      color = palette.ink;
    }
    const xStart = r.domain === "car" ? (HIDE_W + BREAK_W) : 0;
    const priceStr = "$" + r.price.toLocaleString();
    return `
      <g transform="translate(0, ${y})">
        <rect x="${xStart}" y="0" width="${width}" height="${barH}" fill="${color}" rx="1"/>
        <text x="${xStart + width + 8}" y="${barH / 2 + 4}" fill="${palette.ink}" font-family="JetBrains Mono, monospace" font-size="12" font-variant-numeric="tabular-nums">${priceStr}</text>
        <text x="-12" y="${barH / 2 + 4}" text-anchor="end" fill="${palette.ink}" font-family="Inter, sans-serif" font-size="13" font-weight="500">${r.label}</text>
        <text x="-12" y="${barH / 2 + 20}" text-anchor="end" fill="${palette.ink3}" font-family="Inter, sans-serif" font-size="11">${r.note}</text>
      </g>
    `;
  }).join("");

  // axis/baseline
  const axisTicks = [0, 100, 200, 300];

  // scale break glyph — zig-zag between segments
  const bx = HIDE_W + BREAK_W / 2;
  const zig = `
    <g transform="translate(${bx - 6}, 0)">
      <line x1="0" y1="0" x2="0" y2="${innerH}" stroke="${palette.rule}" stroke-width="1"/>
      <path d="M -6 ${innerH / 2 - 10} L 6 ${innerH / 2 - 4} L -6 ${innerH / 2 + 2} L 6 ${innerH / 2 + 8}" fill="none" stroke="${palette.ink3}" stroke-width="1.2"/>
      <path d="M 6 ${innerH / 2 - 12} L 18 ${innerH / 2 - 6} L 6 ${innerH / 2} L 18 ${innerH / 2 + 6} L 6 ${innerH / 2 + 12}" fill="none" stroke="${palette.ink3}" stroke-width="1.2"/>
    </g>
  `;

  const ticksLeft = axisTicks.map(v => {
    const x = (v / HIDE_MAX) * HIDE_W;
    return `
      <g transform="translate(${x}, ${innerH})">
        <line x1="0" y1="0" x2="0" y2="4" stroke="${palette.ink3}"/>
        <text x="0" y="18" text-anchor="middle" fill="${palette.ink3}" font-family="Inter, sans-serif" font-size="10.5">$${v}</text>
      </g>`;
  }).join("");

  const carTicks = [32670];
  const ticksRight = carTicks.map(v => {
    const x = HIDE_W + BREAK_W + Math.min(CAR_W, (v / 40000) * CAR_W);
    return `
      <g transform="translate(${x}, ${innerH})">
        <line x1="0" y1="0" x2="0" y2="4" stroke="${palette.ink3}"/>
        <text x="0" y="18" text-anchor="middle" fill="${palette.ink3}" font-family="Inter, sans-serif" font-size="10.5">$${v.toLocaleString()}</text>
      </g>`;
  }).join("");

  const footnote = `
    <g transform="translate(${innerW - 10}, -18)">
      <text x="0" y="0" text-anchor="end" fill="${palette.accent}" font-family="Inter, sans-serif" font-size="11" font-weight="600" letter-spacing="0.1em" text-transform="uppercase">Hide as share of MSRP: 0.07%</text>
    </g>
  `;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMin meet" role="img" aria-label="Price of leather at five points in its life; the car bar sits beyond a scale break">
      <g transform="translate(${margin.left}, ${margin.top})">
        ${footnote}
        <line x1="0" y1="${innerH}" x2="${innerW}" y2="${innerH}" stroke="${palette.ink2}" stroke-width="1"/>
        ${ticksLeft}
        ${ticksRight}
        ${zig}
        ${bars}
      </g>
    </svg>
  `;
}
