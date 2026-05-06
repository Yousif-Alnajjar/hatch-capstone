// Chapter 4B: GTA laundering diagram + Gibbs 81/19 donut.
//
// Two-register layout, top to bottom:
//
//   1. Banner: "The cow's real journey"
//   2. Row of four farms with labels underneath
//   3. Generous vertical gap (breathing room)
//   4. Banner: "What the paper trail says"
//   5. Row of three GTA permit cards, each sitting between adjacent farms
//   6. Single audit callout under the final permit
//
// The permit cards' FROM field carries the scandal: each transfer overwrites
// the prior origin, so the illegal ranch disappears from the active record.

import { palette } from "./utils.js?v=19";

export function initLaundering() {
  const diagEl  = document.getElementById("laundering-diagram");
  const donutEl = document.getElementById("gibbs-donut");
  if (!diagEl) return;

  // ── Laundering diagram ────────────────────────────────────
  const W = 900, H = 540;
  const farms = [
    { id: "illegal", label: "Cachoeira Seca", tag: "Illegal ranch",    kind: "bad"   },
    { id: "farmA",   label: "Farm A",          tag: "Compliant farm",   kind: "clean" },
    { id: "farmB",   label: "Farm B",          tag: "Compliant farm",   kind: "clean" },
    { id: "jbs",     label: "JBS · Marabá",    tag: "Slaughterhouse",   kind: "end"   }
  ];
  const permits = [
    { idx: 0, from: "Cachoeira Seca", to: "Farm A",
      label: "GTA-1", note: "never audited downstream", fromIsIllegal: true },
    { idx: 1, from: "Farm A", to: "Farm B",
      label: "GTA-2", note: "overwrites the prior origin" },
    { idx: 2, from: "Farm B", to: "JBS",
      label: "GTA-3", note: "what the audit sees" }
  ];

  const PAD_X = 70;
  const slotX = i => PAD_X + (W - PAD_X * 2) * (i / (farms.length - 1));
  // Vertical layout — chosen to leave at least 50px between successive tracks
  const Y_TOP_EYEBROW   = 30;
  const Y_TOP_RULE      = 42;
  const Y_JOURNEY       = 120;   // farm circle centers
  // farm labels sit at y + 58 and y + 76 relative to Y_JOURNEY (i.e. 178, 196)
  const Y_BOT_EYEBROW   = 256;
  const Y_BOT_RULE      = 268;
  const Y_PAPER         = 370;   // permit card centers
  // permit cards are 130 tall → span 305–435
  const Y_AUDIT_ARROW_T = 448;
  const Y_AUDIT_TEXT    = 498;

  // Farm nodes
  const journeyNodes = farms.map((f, i) => {
    const x = slotX(i);
    const isBad = f.kind === "bad";
    const isEnd = f.kind === "end";
    const fill = isBad ? palette.accentHi :
                 isEnd ? palette.cream :
                 palette.paper;
    const stroke = isBad ? palette.accentHi : palette.cream2;
    const labelColor = isBad ? palette.accentHi : palette.cream;
    const tagColor   = isBad ? "#F6C2C5"       : palette.cream2;
    const glyph = isBad ? `
      <g stroke="${palette.cream}" stroke-width="2" fill="none">
        <circle r="14"/>
        <line x1="-10" y1="-10" x2="10" y2="10"/>
      </g>`
      : isEnd ? `
      <path d="M -11 -8 L -11 8 L 11 8 L 11 2 L 15 2 L 15 -2 L 11 -2 L 11 -8 Z"
            fill="${palette.nocturne}" fill-opacity="0.55" stroke="${palette.cream2}"/>`
      : `
      <text x="0" y="5" text-anchor="middle" fill="${palette.cream2}"
            font-family="EB Garamond, serif" font-size="20" font-weight="700">✓</text>`;
    return `
      <g class="lnd-farm" data-id="${f.id}" transform="translate(${x}, ${Y_JOURNEY})">
        <circle r="34" fill="${fill}" fill-opacity="${isBad ? 0.95 : 0.12}"
                stroke="${stroke}" stroke-width="1.5"/>
        ${glyph}
        <text x="0" y="58" text-anchor="middle"
              font-family="EB Garamond, serif" font-size="16" font-weight="700"
              fill="${labelColor}">${f.label}</text>
        <text x="0" y="76" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="10"
              letter-spacing="0.12em" text-transform="uppercase"
              fill="${tagColor}">${f.tag}</text>
      </g>`;
  }).join("");

  // Journey arrows (between farms, at Y_JOURNEY)
  const journeyArrows = farms.slice(0, -1).map((_, i) => {
    const x1 = slotX(i) + 36, x2 = slotX(i + 1) - 40;
    return `
      <g class="lnd-arrow-j">
        <line x1="${x1}" y1="${Y_JOURNEY}" x2="${x2}" y2="${Y_JOURNEY}"
              stroke="${palette.cream2}" stroke-width="1.2" opacity="0.85"/>
        <polygon points="${x2},${Y_JOURNEY} ${x2 - 8},${Y_JOURNEY - 4} ${x2 - 8},${Y_JOURNEY + 4}"
                 fill="${palette.cream2}"/>
      </g>`;
  }).join("");

  // Permit cards (3 of them, sitting between adjacent farms)
  const CARD_W = 200, CARD_H = 130;
  const permitCards = permits.map((p) => {
    const x = (slotX(p.idx) + slotX(p.idx + 1)) / 2;
    const tx = x - CARD_W / 2, ty = Y_PAPER - CARD_H / 2;
    const fromColor = p.fromIsIllegal ? palette.accent : palette.ink;
    return `
      <g class="lnd-permit" data-i="${p.idx}" transform="translate(${tx}, ${ty})">
        <rect width="${CARD_W}" height="${CARD_H}" rx="2"
              fill="${palette.paper}" stroke="${palette.cream2}" stroke-width="0.8"/>
        <path d="M ${CARD_W - 14} 0 L ${CARD_W} 14 L ${CARD_W} 0 Z"
              fill="${palette.cream2}" fill-opacity="0.18"/>
        <text x="16" y="22" font-family="JetBrains Mono, monospace" font-size="10"
              letter-spacing="0.12em" fill="${palette.accent}"
              text-transform="uppercase">${p.label}</text>
        <line x1="16" y1="30" x2="${CARD_W - 16}" y2="30" stroke="${palette.rule}"/>
        <text x="16" y="58" font-family="Inter, sans-serif" font-size="9"
              letter-spacing="0.14em" text-transform="uppercase"
              fill="${palette.ink3}">From</text>
        <text x="60" y="58" font-family="EB Garamond, serif" font-size="14"
              font-weight="600" fill="${fromColor}">${p.from}</text>
        <text x="16" y="82" font-family="Inter, sans-serif" font-size="9"
              letter-spacing="0.14em" text-transform="uppercase"
              fill="${palette.ink3}">To</text>
        <text x="60" y="82" font-family="EB Garamond, serif" font-size="14"
              font-weight="600" fill="${palette.ink}">${p.to}</text>
        <text x="${CARD_W / 2}" y="${CARD_H - 14}" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="10"
              letter-spacing="0.06em" fill="${palette.ink3}" font-style="italic">
          ${p.note}
        </text>
      </g>`;
  }).join("");

  // Audit callout under GTA-3 (which sits between farm 2 and farm 3, so at midpoint)
  const gta3X = (slotX(2) + slotX(3)) / 2;
  const auditArrow = `
    <g class="lnd-audit-arrow">
      <line x1="${gta3X}" y1="${Y_AUDIT_ARROW_T + 28}"
            x2="${gta3X}" y2="${Y_AUDIT_ARROW_T + 8}"
            stroke="${palette.accentHi}" stroke-width="1.4"/>
      <polygon points="${gta3X},${Y_AUDIT_ARROW_T + 4}
                       ${gta3X - 5},${Y_AUDIT_ARROW_T + 12}
                       ${gta3X + 5},${Y_AUDIT_ARROW_T + 12}"
               fill="${palette.accentHi}"/>
      <text x="${gta3X}" y="${Y_AUDIT_TEXT}" text-anchor="middle"
            font-family="Inter, sans-serif" font-size="10.5"
            letter-spacing="0.16em" text-transform="uppercase"
            fill="${palette.accentHi}">Only this is audited</text>
    </g>`;

  const banners = `
    <g class="lnd-banner">
      <text x="${PAD_X}" y="${Y_TOP_EYEBROW}" font-family="Inter, sans-serif"
            font-size="11" letter-spacing="0.18em" text-transform="uppercase"
            fill="${palette.cream2}">The cow's real journey</text>
      <line x1="${PAD_X}" y1="${Y_TOP_RULE}" x2="${W - PAD_X}" y2="${Y_TOP_RULE}"
            stroke="${palette.cream2}" stroke-opacity="0.3"/>
      <text x="${PAD_X}" y="${Y_BOT_EYEBROW}" font-family="Inter, sans-serif"
            font-size="11" letter-spacing="0.18em" text-transform="uppercase"
            fill="${palette.cream2}">What the paper trail says</text>
      <line x1="${PAD_X}" y1="${Y_BOT_RULE}" x2="${W - PAD_X}" y2="${Y_BOT_RULE}"
            stroke="${palette.cream2}" stroke-opacity="0.3"/>
    </g>`;

  diagEl.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img"
         aria-label="Two-track diagram: the cow's real journey across four farms on top, and the corresponding three GTA permits on the bottom. Each permit's FROM field names only the most recent farm, so the illegal birthplace disappears from the paper record after the first transfer.">
      ${banners}
      ${journeyArrows}
      ${journeyNodes}
      ${permitCards}
      ${auditArrow}
    </svg>
  `;

  // ── Gibbs 81/19 donut ─────────────────────────────────────
  if (donutEl) {
    const DW = 560, DH = 260;
    const cx = 110, cy = 110, r = 76, ir = 44;
    const pct = 81;
    const angle = (pct / 100) * Math.PI * 2;
    const arc  = describeDonut(cx, cy, r, ir, -Math.PI / 2, -Math.PI / 2 + angle);
    const rest = describeDonut(cx, cy, r, ir, -Math.PI / 2 + angle, -Math.PI / 2 + Math.PI * 2);
    donutEl.innerHTML = `
      <svg viewBox="0 0 ${DW} ${DH}" role="img"
           aria-label="Gibbs Lab, 2020: 81 percent of deforestation in Brazilian slaughterhouse supply chains came from indirect suppliers the slaughterhouses did not monitor.">
        <path d="${arc}"  fill="${palette.accentHi}"/>
        <path d="${rest}" fill="${palette.cream}" opacity="0.3"/>
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" fill="${palette.cream}"
              font-family="EB Garamond, serif" font-size="32" font-weight="700"
              dominant-baseline="middle">81%</text>
        <text x="${cx}" y="${cy + r + 26}" text-anchor="middle" fill="${palette.accentHi}"
              font-family="Inter, sans-serif" font-size="10.5"
              letter-spacing="0.14em" text-transform="uppercase">Indirect suppliers</text>
        <g font-family="Inter, sans-serif" fill="${palette.cream}">
          <text x="240" y="50" font-family="EB Garamond, serif" font-size="20" font-weight="700">
            Gibbs Lab, 2020
          </text>
          <text x="240" y="82"  fill="${palette.cream2}" font-size="13">
            Of all the deforestation inside the supply chains
          </text>
          <text x="240" y="102" fill="${palette.cream2}" font-size="13">
            of Brazil's largest slaughterhouses, 81&nbsp;percent
          </text>
          <text x="240" y="122" fill="${palette.cream2}" font-size="13">
            came from indirect suppliers the slaughterhouses
          </text>
          <text x="240" y="142" fill="${palette.cream2}" font-size="13">
            did not monitor. The remaining 19&nbsp;percent came
          </text>
          <text x="240" y="162" fill="${palette.cream2}" font-size="13">
            from direct suppliers whose own audits missed it.
          </text>
        </g>
      </svg>`;
  }

  // ── Scrollama-driven step emphasis ────────────────────────
  const scrollyEl = document.getElementById("scrolly-laundering");
  if (!scrollyEl || !window.scrollama) return;

  function highlight(stepIdx) {
    const svg = diagEl.querySelector("svg");
    if (!svg) return;
    const farmsG   = svg.querySelectorAll(".lnd-farm");
    const arrowsG  = svg.querySelectorAll(".lnd-arrow-j");
    const permitsG = svg.querySelectorAll(".lnd-permit");
    const auditG   = svg.querySelector(".lnd-audit-arrow");

    farmsG.forEach((g, i) => {
      g.style.opacity = i <= Math.max(0, stepIdx) || stepIdx >= 4 ? "1" : "0.2";
      g.style.transition = "opacity .5s ease";
    });
    arrowsG.forEach((g, i) => {
      g.style.opacity = (i < Math.max(0, stepIdx) || stepIdx >= 4) ? "1" : "0.15";
      g.style.transition = "opacity .5s ease";
    });
    permitsG.forEach((g, i) => {
      g.style.opacity = (i < Math.max(0, stepIdx) || stepIdx >= 4) ? "1" : "0.2";
      g.style.transition = "opacity .5s ease";
    });
    if (auditG) {
      auditG.style.opacity = stepIdx >= 3 ? "1" : "0";
      auditG.style.transition = "opacity .5s ease";
    }
    if (donutEl) {
      donutEl.style.opacity = stepIdx >= 4 ? "1" : "0.15";
      donutEl.style.transition = "opacity .6s ease";
    }
  }
  highlight(0);

  const scroller = scrollama();
  scroller
    .setup({ step: "#scrolly-laundering .step", offset: 0.6 })
    .onStepEnter(({ element, index }) => {
      scrollyEl.querySelectorAll(".step").forEach(s => s.setAttribute("data-active", "false"));
      element.setAttribute("data-active", "true");
      highlight(index);
    });
  window.addEventListener("resize", () => scroller.resize());
}

function describeDonut(cx, cy, r, ir, a1, a2) {
  const large = a2 - a1 > Math.PI ? 1 : 0;
  const x1o = cx + r * Math.cos(a1),  y1o = cy + r * Math.sin(a1);
  const x2o = cx + r * Math.cos(a2),  y2o = cy + r * Math.sin(a2);
  const x1i = cx + ir * Math.cos(a2), y1i = cy + ir * Math.sin(a2);
  const x2i = cx + ir * Math.cos(a1), y2i = cy + ir * Math.sin(a1);
  return `M ${x1o} ${y1o}
          A ${r} ${r} 0 ${large} 1 ${x2o} ${y2o}
          L ${x1i} ${y1i}
          A ${ir} ${ir} 0 ${large} 0 ${x2i} ${y2i}
          Z`;
}
