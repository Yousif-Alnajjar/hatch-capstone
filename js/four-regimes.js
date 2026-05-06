// Chapter 5: four regimes of movement, rendered as a 2×2 editorial grid.
//
// NYT-minimal: serif numeral, serif title, sans description, a single
// numeric anchor per panel, one hairline cross dividing the four.

import { palette } from "./utils.js?v=19";

export function initFourRegimes() {
  const el = document.getElementById("four-regimes");
  if (!el) return;

  // Grid dimensions — each panel needs ~240px of height for: numeral (y=4),
  // title (y=52), then a foreignObject containing a ~3-line description + a
  // hairline + a 32-28px figure number + a 12px label. Round up for safety.
  const W = 820, H = 640;
  const panels = [
    {
      num: "i",
      title: "OBD-II in the dash",
      body: "The car's own journal, read back to myself at the kitchen table.",
      figure: "336",
      figureLabel: "trips logged in 50 days"
    },
    {
      num: "ii",
      title: "Telematics scoring",
      body: "The same signals, rendered as risk and sold to insurers.",
      figure: "130-pg",
      figureLabel: "LexisNexis dossier"
    },
    {
      num: "iii",
      title: "Green Book · ALPR",
      body: "A public record of a public constraint: permission, then presence.",
      figure: "2×",
      figureLabel: "Black-driver stop rate vs white"
    },
    {
      num: "iv",
      title: "Cachoeira Seca",
      body: "Not surveillance but dispossession. Movement taken, not tracked.",
      figure: "1,400 ha",
      figureLabel: "cleared from the Arara in 2024"
    }
  ];

  // Grid math
  const gx = W / 2;
  const gy = H / 2;
  const pad = 48;

  function panelSVG(p, col, row) {
    const x0 = col === 0 ? pad : gx + pad;
    const y0 = row === 0 ? pad : gy + pad;
    const w  = (gx - pad * 2);
    const h  = (gy - pad * 2);
    const cx = x0;
    return `
      <g transform="translate(${x0}, ${y0})" class="fr-panel">
        <text x="0" y="4"
              font-family="EB Garamond, serif" font-style="italic" font-weight="500"
              font-size="22" fill="${palette.accent}"
              letter-spacing="0.02em">${p.num}.</text>
        <text x="0" y="52"
              font-family="EB Garamond, serif" font-weight="700"
              font-size="26" fill="${palette.ink}"
              letter-spacing="-0.005em">${p.title}</text>
        <foreignObject x="0" y="68" width="${w}" height="${h - 68}">
          <div xmlns="http://www.w3.org/1999/xhtml" class="fr-body">
            <p class="fr-desc">${p.body}</p>
            <p class="fr-fig"><span class="fr-fig-num">${p.figure}</span><span class="fr-fig-lbl">${p.figureLabel}</span></p>
          </div>
        </foreignObject>
      </g>
    `;
  }

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"
         role="img" aria-label="Four regimes of movement tracking: OBD, telematics scoring, Green Book and ALPR, and Cachoeira Seca.">
      <!-- hairline cross dividing the four -->
      <line x1="${gx}" y1="${pad * 0.5}" x2="${gx}" y2="${H - pad * 0.5}"
            stroke="${palette.rule}" stroke-width="1"/>
      <line x1="${pad * 0.5}" y1="${gy}" x2="${W - pad * 0.5}" y2="${gy}"
            stroke="${palette.rule}" stroke-width="1"/>
      ${panelSVG(panels[0], 0, 0)}
      ${panelSVG(panels[1], 1, 0)}
      ${panelSVG(panels[2], 0, 1)}
      ${panelSVG(panels[3], 1, 1)}
    </svg>
  `;
}
