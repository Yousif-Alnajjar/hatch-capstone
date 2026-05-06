# It Takes a Planet to Drive a Miata
## Production Brief — NYT-style interactive article

**Target audience of this document:** Claude Code (agentic implementation).
**Deliverable:** a single-page scrollytelling article, hostable statically, built on the NYT-derived pattern stack (Scrollama + `position: sticky`, D3, MapLibre GL). One author, one car, one atlas project. No branching narrative.
**Editorial register:** first-person, reflective, restrained. No em-dashes (author preference). Serif voice, sans scaffolding.
**Working title:** *It Takes a Planet to Drive a Miata*
**Subtitle:** *A 2,339-pound car, a 23,000-kilometer supply chain, and the arithmetic of freedom.*

Everything you need is in this folder. `/data/` contains pre-processed artifacts. `/prose/` is not a folder — the prose is inline in this document, in fenced `copy-as-is` blocks. Photographs and archival assets have a dedicated "Assets" section with provenance notes at the bottom.

---

## 0. At-a-glance flow

Six chapters. Opens personal, zooms out, comes back personal. The pivot in Chapter 2 (from OBD as journaling to OBD as surveillance) is the first tonal turn. The pivot in Chapter 3 (from my freedom to the historical unfreedom of Black drivers in Pittsburgh) is the second. Chapter 4 is the long supply-chain dive and the moral center. Chapter 5 is synthesis. Chapter 6 is coda.

| # | Title | Length | Primary visual | Map? |
|---|-------|-------:|----------------|:----:|
| 1 | The car I drive | ~350w | Line-drawn hero + first Pittsburgh trace | ✓ |
| 2 | What the car records | ~550w | Scrolly-scrubbed Apr-2 drive: speed/altitude/weather + telematics overlay | ✓ |
| 3 | The geography of permission | ~500w | Green Book Hill District map + razed-building overlay | ✓ |
| 4 | The supply chain of the seat | ~1,200w | Full-bleed world map, 9 scrolly beats Pará→Pittsburgh + laundering diagram + value-chain bars | ✓✓ |
| 5 | The arithmetic of freedom | ~170w | Composite layered diagram: four regimes of movement | — |
| 6 | Coda | ~300w | Small, quiet closing trace | ✓ (small) |

Five maps total. Meets the mapping-class requirement comfortably.

---

## 1. Design system

### 1.1 Color palette
The palette is derived from the car itself so that the article reads as an object of its own subject.

| Token | Value | Usage |
|-------|-------|-------|
| `--paper` | `#F5F2EB` | Primary background (Snowflake White Pearl, slightly warm) |
| `--ink` | `#15110E` | Primary text (warmer than true black) |
| `--ink-2` | `#55504A` | Secondary text, captions, metadata |
| `--ink-3` | `#8A857E` | Tertiary, axis labels, gridlines |
| `--accent` | `#A61C25` | **Cherry Red top** — the single brand accent. Use for emphasis sparingly |
| `--nappa` | `#6E1418` | **Red Nappa leather** — deeper red, used for data-ink on the supply chain chapter |
| `--rule` | `#DCD6CB` | Hairlines, dividers |
| `--nocturne` | `#121013` | Dark-mode background for tonal-inversion sections |

**Rule of usage:** the red is a resource. Per NYT doctrine, the page is mostly black-on-cream. Red only appears on (a) the word "freedom" on first appearance in each chapter, (b) the active step in scrolly graphics, (c) Cachoeira Seca on the supply chain map, (d) the Pittsburgh endpoint on the supply chain map.

**Tonal inversion:** Chapter 4 flips to `--nocturne` background with cream text for the full-bleed world map section. Revert to paper for subsequent chapters. This is the single most Times-like visual move available to us and earns its keep.

### 1.2 Type
Per the NYT-interactive reference: serif voice, sans scaffolding, slab for louder display moments.

| Role | Font (proposed free substitute) | Spec |
|------|---------------------------------|------|
| Headline / chapter titles | EB Garamond 700 or Playfair Display 700 | 48–72px, tight tracking, `line-height: 1.05` |
| Drop cap | Same, bold, 3 lines tall | — |
| Body | Source Serif 4 or Spectral, 400 | 18–20px, `line-height: 1.6`, 620–680px measure |
| Pull quotes | EB Garamond italic 500 | 26–32px, red accent on quotemarks |
| Caption / metadata | Inter or Libre Franklin, 400/500 | 13–14px, `--ink-2`, uppercase label style for section markers |
| Data labels / axes | Inter, 500 | 11–13px |
| Monospace (coordinates, VINs, numbers in-flow) | IBM Plex Mono or JetBrains Mono | 0.9em of body |

### 1.3 Layout primitives

```css
:root {
  --measure: 640px;           /* body column — narrow NYT measure */
  --wide:   1040px;           /* figure column, breaks slightly out */
  --full:   100%;             /* edge-to-edge */
  --gutter: clamp(16px, 4vw, 48px);
}

.body-col   { max-width: var(--measure); margin-inline: auto; padding-inline: var(--gutter); }
.figure-col { max-width: var(--wide);    margin-inline: auto; padding-inline: var(--gutter); }
.full-bleed { width: 100%; }

/* Sticky scaffold — note svh not vh */
.scrolly { position: relative; }
.scrolly .sticky  { position: sticky; top: 0; height: 100svh; }
.scrolly .step    { min-height: 90svh; margin: 0 0 2rem; }
@media (max-width: 760px) {
  .scrolly { display: block; }       /* stack everything on narrow */
}
```

---

## 2. Tech stack

Pick **Astro + Svelte islands + Scrollama + MapLibre GL + D3**. Justification:

- **Astro** gives near-zero JS by default with MDX authoring. The article will still render with JS off, which matters for a class project that may be archived.
- **Svelte islands** for the interactive components (sticky scrollies, charts). Pudding's `svelte-starter` is the reference but you can author from scratch — we only need 4–5 components.
- **Scrollama 3.x** (vanilla JS, IntersectionObserver under the hood). Do NOT use a scrolljacking library (Locomotive, aggressive Lenis). Pudding's rule: *monitor scroll, don't change it*.
- **MapLibre GL JS** for maps. Free. BSD. Vector tiles from MapTiler or Stadia (cheap/free tier for a class project) or serve a Protomaps .pmtiles for fully offline.
- **D3 v7**, modular imports only (`d3-scale`, `d3-shape`, `d3-selection`, `d3-geo`). Never `import * from 'd3'`.
- **GSAP ScrollTrigger** optional for Chapter 4's scrubbed world-map panning (free since April 2025).

### 2.1 File structure

```
.
├── astro.config.mjs
├── src/
│   ├── pages/index.astro           # the whole article
│   ├── layouts/Article.astro
│   ├── components/
│   │   ├── PittsburghTraceMap.svelte      # Ch 1 + 6
│   │   ├── LongestDriveScrolly.svelte     # Ch 2
│   │   ├── TelematicsOverlay.svelte       # Ch 2 second half
│   │   ├── GreenBookMap.svelte            # Ch 3
│   │   ├── SupplyChainWorldMap.svelte     # Ch 4 primary
│   │   ├── LaunderingDiagram.svelte       # Ch 4 mid
│   │   ├── ValueChainBars.svelte          # Ch 4 end
│   │   └── FourRegimes.svelte             # Ch 5
│   └── content/article.mdx          # the prose
└── public/
    ├── data/                        # everything in /data/ below
    └── assets/
        ├── photos/                  # Yousif's uploads
        ├── archival/                # sourced images
        └── illustrations/           # SVGs you generate
```

### 2.2 Data artifacts (pre-processed — just drop into `public/data/`)

These are in the `/data/` subfolder delivered with this brief. Sizes in parens.

- `summary.json` (0.6 KB) — top-level stats. Reference this in copy so the numbers stay live if data is refreshed.
- `trip_stats.csv` (33 KB) — 407 rows, one per trip, with weather join.
- `daily_summary.csv` (0.9 KB) — 35 rows, one per day. Good for a calendar-strip viz.
- `all_trips.geojson` (489 KB) — 310 decimated trip trajectories. Pittsburgh basemap input.
- `longest_drive.geojson` (14 KB) — the Apr 2 58.5 km drive, 400 points, each with `t` (seconds from start), `mph`, `alt_m`. This is the scrubbed scrolly in Ch 2.
- `green_book_hill_district.geojson` (4.5 KB) — 12 researched historical sites with name, address, years listed, source.
- `supply_chain.geojson` (4.7 KB) — 9 nodes Pará→Pittsburgh with `step`, `name`, `subtitle`, `role` copy ready to read, plus per-node accent color.

**Note on the Hill District map:** you'll want to additionally draw the **footprint of the demolished Lower Hill** as a polygon overlay. A serviceable approximation: the area bounded roughly by Crawford St (E), Centre Ave (N), Fifth Ave (S), and the old Bigelow Blvd alignment (W), now dominated by the Civic Arena site and adjacent parking. Draw it as a subtle hatched polygon in `--ink-3` with `fill-opacity: 0.15`.

---

## 3. Chapter-by-chapter spec + full prose

### CHAPTER 1 — "The car I drive"

**Function:** open with the thesis forward, introduce the car and the OBD-II dongle as the twin subjects of the piece, and name the tension the rest of the article will examine.

**Layout:** body column. A small title card above (huge headline, short dek, byline, reading time). Below the opening text, a first Pittsburgh map — subtle, a few of his trip lines in thin red over a cream basemap. This is a *tease*, not a full reveal.

**Visual 1A — Title card.** Giant serif headline over `--paper`. Dek in sans, `--ink-2`. A single hairline rule beneath. Optional: a hand-drawn / line-illustration profile of the ND Miata running full-bleed beneath the dek. If you can't produce this, skip it — a title card on white is more Times-like than a weak illustration.

**Visual 1B — First Pittsburgh trace.** Small inline map, ~520px tall, ~wide-column width. Base: light cream tiles (MapTiler Backdrop or Stadia Outdoors in very-low-contrast style). Overlay: `all_trips.geojson` as `LineString` features, `stroke: #A61C25`, `stroke-width: 1`, `stroke-opacity: 0.18`. The accumulation of thin red lines over the city is the effect. No labels, no legend, no interactivity yet. This is just an atmospheric tease.

**Prose (use verbatim):**

```
There is a particular kind of freedom that comes from driving a small,
manual, open-top sports car, and for the last several months I have
been trying to understand it. My car is a 2020 Mazda MX-5 Miata ND,
100th Anniversary Edition: Snowflake White Pearl over a Cherry Red
soft top, red Nappa leather inside, assembled at the Ujina Plant on
a reclaimed peninsula in Hiroshima Bay. It weighs 2,339 pounds, makes
181 horsepower and is the closest thing sold new in the United States
to the vintage idea of what a car is. The roof is a manual soft top.
I unlatch it with one hand and throw it back behind me, and the whole
action takes under two seconds. The shifter has a throw of about two
inches. Every gear change is a small, deliberate action I perform
with my right hand, and the car answers immediately. Driving it
feels, to me, like an extension of my own body.

Plugged into the dashboard is an OBD-II port. The port itself was
mandated in 1996 by the California Air Resources Board so mechanics
could read emissions codes. Today, through a small dongle the size of
a matchbox, it turns every drive into a dataset: speed, altitude,
engine load, GPS position to five decimal places, every second the
car is moving. I can scroll back through the log at my kitchen table
and encounter myself, in retrospect, as a sequence of numbers.

This piece explores what that dataset reveals and what the car itself
conceals. Through examining the data the car knows about me, the data
that others would now like to know, the older American history of
drivers for whom movement was never free, and the supply chain that
brought this specific object into my driveway, I will show that the
freedom I feel behind the wheel is never actually mine alone. It is
mediated, upstream and downstream, by systems and histories I did
not choose. The purpose of writing this is not to ruin the feeling.
It is to understand it.
```

**Formatting nits:** drop cap on "There". The first occurrence of the word *freedom*, in the opening sentence, should be italic and `--accent` red. After that first occurrence in each subsequent chapter, render it the same way — the word is the piece's editorial throughline.

---

### CHAPTER 2 — "What the car records"

**Function:** establish the intimacy of the OBD data as an act of journaling, then turn the reader on that intimacy with the GM/LexisNexis story. This is the first tonal pivot.

**Layout:** two sections.
- Section A: narrative sets up the data. Sticky scrolly graphic on right (desktop) or stacked (mobile) with the Apr 2 longest drive. As the reader scrolls, the map pans along the route and the speed/altitude charts below the map scrub to match.
- Section B: same sticky graphic is reused, but now an "insurance overlay" layer snaps on. Hard-braking points appear, hard-acceleration points appear, the 96.5 mph peak lights up red, and a hypothetical premium-delta number counts up in a figure caption.

**Data source:** `longest_drive.geojson`. Each of the 400 points has `{t, mph, alt_m}`.

**Visual 2A — Scrubbed drive scrolly.**
- Sticky figure: MapLibre map filling the right column, with the Apr 2 route as a line in `--nappa`. A moving dot tracks the current scroll position along the line. Below the map, two stacked area/line charts: `mph` (y) vs `t` (x), and `alt_m` (y) vs `t` (x). A vertical cursor synchronized with the dot.
- Steps (keep each step tight — ~2 sentences):
  1. **"2,320 kilometers"** — full route zoomed out.
  2. **"Three hundred and thirty-six trips"** — zoom to start of the Apr 2 route.
  3. **"The longest was 58.5"** — scrub to mid-drive at peak speed.
  4. **"At seven PM on a Thursday"** — scrub to late in the drive.
  5. **"The car told me all of it"** — fade the map layers down, bring speed/alt charts forward.

**Visual 2B — Telematics overlay.** Reuses 2A's sticky figure. New steps introduce overlays that snap on top:
  6. **"In March 2024 the New York Times reported"** — a horizontal strip at the bottom of the sticky shows a redacted LexisNexis-style dossier header: "Report ID · 130 pages · Vehicle: 2020 Mazda MX-5 · Driver: [redacted]"
  7. **"Hard-braking events"** — red dots snap onto the map at points where dv/dt < threshold. (Approximate from the `mph` points: compute Δmph/Δt; mark where |Δmph|/Δt > 7 mph/s.)
  8. **"Hard-acceleration events"** — same, opposite sign.
  9. **"96.5"** — single large red number pulses onto the sticky figure; the map dot is parked on the peak-speed point.
  10. **"Estimated premium change"** — a counter rises from +0% to an irreverent number (+12% or similar) with a caveat in small type: *illustrative; actual telematics models vary*.

**Prose (use verbatim):**

```
The first of the car's many lessons is that it knows me. Between
February 27 and April 17, a period of fifty days, I drove 2,320
kilometers over three hundred and thirty-six separate trips. The
average trip was 6.9 kilometers, the median 4.0. The longest was a
canyon run east toward the Laurel Highlands on a Thursday evening in
April: 58.5 kilometers, two hours and eighteen minutes, peaking at
96.5 miles per hour. The coldest morning was 17 degrees Fahrenheit.
The average temperature across the whole period was 52.7. The OBD
dongle recorded all of it, more precisely than I ever could.

Through this, the car demonstrates a kind of intimacy that I had not
expected from a piece of machinery. It quietly quantifies what I had
experienced. When I scroll back through the April 2 trip, the data
helps me reconstruct it: I remember that I had been stressed that
week, that the drive was a reward, that it was cold but clear, that
the stretch at 96.5 miles per hour was on a road I had driven before
and knew was empty. The OBD does not tell me any of this directly,
but it makes it possible. In this sense, the dongle is an act of
journaling.

However, the same port is the most conservative version of what a
modern car can record. A 2020 Miata is, by contemporary standards,
a relatively unconnected vehicle. Newer Mazdas, like every General
Motors vehicle since 2015, every Honda, every Hyundai and most Fords,
do not wait for a third-party dongle. They stream comparable data
continuously to the manufacturer.

In March 2024, The New York Times revealed that General Motors had
been selling detailed driving information, including hard-braking
events, hard acceleration and trip-by-trip GPS position, from millions
of OnStar-equipped vehicles to two data brokers: LexisNexis Risk
Solutions and Verisk Analytics. Those brokers then sold driver reports
to insurance companies. One driver, upon requesting his file, found
that LexisNexis had compiled a 130-page dossier on his driving habits.
His insurance premium had risen by more than twenty percent. He had
never knowingly consented. Almost two years later, in January 2026,
the Federal Trade Commission settled with GM; the company agreed not
to sell geolocation or driver-behaviour data to any consumer reporting
agency for five years, and to obtain what the settlement called
"affirmative customer consent" for twenty.

Through this, a second, darker character of the OBD data reveals
itself. The same signals that, on the kitchen table, help me
reconstruct how I felt about a drive are also actuarially legible.
To a scoring engine, my pull-over-at-night to see a friend is a
"late-night trip", which is a risk factor. The stretch where I open
up the engine is "hard acceleration", which is a risk factor. The
96.5 peak on the empty Thursday road is a "speeding event" that
would, in most telematics programs, disqualify me from the safe-driver
discount entirely. There is no category inside Progressive's scoring
model for "Sunday", or "happy". The drive I remember as *freedom* is,
to the insurer, a liability curve.

My dongle only talks to me. My car, if it were newer, would be talking
to more people than I am.
```

**Formatting nits:** second occurrence of italic `*freedom*` (in `--accent` red) goes in this chapter's closing paragraph.

---

### CHAPTER 3 — "The geography of permission"

**Function:** pull the reader out of the private/personal frame of Chapter 2 and into historical/structural. Pittsburgh-specific. One big map, one archival image.

**Layout:** body column of prose punctuated by a figure-column map, then an archival image, then more prose.

**Visual 3A — Green Book Hill District map.** MapLibre, Hill District extent (roughly `-80.00, 40.435, -79.97, 40.45`). Two layers:
  1. Demolished Lower Hill polygon (hatched fill, `--ink-3`, `fill-opacity: 0.18`, `stroke: --ink-3`, `stroke-dasharray: 2 4`). This is the editorial move — the reader sees the zone where most listings no longer exist before they see the dots.
  2. `green_book_hill_district.geojson` as circles. `fill: --accent`, `stroke: --paper`, `r: 6`. On hover/tap, a small popup with `name`, `street`, `years`. Keep popups minimal — the NYT rule: if it's important, don't hide it in a tooltip. So also render a small companion list below the map enumerating all 12 sites, with type and years, as a static table.

A small footnote beneath the map in caption type: *"Approximate locations. Urban renewal demolished most of the buildings in the shaded zone between 1950 and 1961; exact original addresses are in several cases no longer mappable to existing street grid."*

**Visual 3B — Archival image.** A Charles "Teenie" Harris photograph of Wylie Avenue or the Palace Hotel (Hill District, 1940s–50s). See Assets section for sourcing. Full-bleed width, warm sepia treatment acceptable, credit line in caption.

**Prose (use verbatim):**

```
To describe driving as *freedom* is to use the word in the way it has
historically been used by the Americans for whom it was free. There
is another, older version of American driving, in which the car was
not a symbol of liberation but a site of hazard, and the geography of
the open road was in fact a geography of permission.

In 1936, a postal carrier in Harlem named Victor Hugo Green
self-published the first edition of The Negro Motorist Green Book.
It was a directory of hotels, restaurants, service stations, beauty
shops and boarding houses that would reliably serve Black drivers,
and the tagline on its cover read "Carry your Green Book with you.
You never know when you may need it." The historian Andy Masich,
writing for the Heinz History Center, described it concisely: a
travel guide, but in many ways a survival guide.

Pittsburgh, where I drive, appeared in its pages. Through the Green
Book's thirty-year publication run, more than thirty Hill District
businesses were listed at one point or another: the Terrace Hall
Hotel on Wylie Avenue, the Harlem Casino Dance Hall on Centre, the
Flamingo Hotel, Agnes Taylor's Tourist Home, Dearing's Restaurant,
Scotty's Service Station, the Bailey and Potter's hotels, Charlotte's
Beauty Salon, the Centre Avenue YMCA, Samuel Scott's service station
and later his restaurant. The 1940 edition alone featured fifteen
Pittsburgh listings: seven hotels, three tourist homes, one restaurant,
two beauty parlors, one garage and one service station. These
establishments existed in the Green Book not because they were
architecturally remarkable but because they were *safe*. For a Black
driver in 1940, the Hill District was a functional node in a sparse,
patched-together national network where the freedom to travel, which
other Americans took for granted, had to be negotiated one safe
business at a time.
```

↓ *Visual 3A slots here (Green Book map + static site list)*

```
Most of those buildings no longer exist. Beginning in the late 1940s
and continuing through the 1960s, Pittsburgh's urban renewal program
razed the majority of the Lower Hill District in order to build the
Civic Arena. A city councilmember, describing the neighborhood before
its demolition, remarked that approximately 90 percent of the buildings
"have long outlived their usefulness, and so there would be no social
loss if they were all destroyed". About eight thousand residents,
nearly all of them Black, were displaced. The Green Book itself ceased
publication in 1967, after the Civil Rights Act of 1964 made its
original function legally obsolete. As Green had once predicted, he
had published himself out of a job.
```

↓ *Visual 3B slots here (Teenie Harris or Green Book cover — archival)*

```
The geography of permission, however, did not disappear so much as
change form. Automatic license plate reader networks, or ALPRs, now
catalog billions of car movements every year across the United States,
typically without warrants and with retention windows measured in
years. Pittsburgh police use them. The Department of Homeland Security
uses them. Private companies license access to their records. A 2022
Brookings Institution analysis of national traffic-stop data found
that Black drivers were stopped at roughly twice the rate of white
drivers during daylight hours, and that the disparity narrowed after
sunset, when officers could no longer as easily see into the car. The
researchers named this the *veil of darkness* test. Its implication,
staggering in its simplicity, is that Black drivers are pulled over
disproportionately for the simple fact of being seen.

The Green Book was a directory of permission. The ALPR network is a
directory of presence. Through both, the automobile has never been
a neutral machine.
```

---

### CHAPTER 4 — "The supply chain of the seat"

**Function:** this is the moral and structural center of the piece. It is long. It is a full scrolly with a tonal inversion. Earn the length.

**Layout:** tonal inversion to `--nocturne` background with cream text. Full-bleed world-map sticky on the right (or behind text on mobile). 9 steps pan and zoom the map, each one revealing a supply-chain node. Halfway through, when we arrive at Xinguara (step 2→3 transition), the map pulls back and a separate **laundering diagram** scrolly takes over for 4 beats. Then we pan again to Cachoeira Seca for the moral payload. After the "restricted in movement in their own territory" beat, we return to `--paper`, the map recedes, and a final **value-chain bar chart** plays out the economics inline.

**Visual 4A — World map scrolly (sticky, full-bleed).**
- MapLibre at 1:1 aspect ratio inside a sticky container, filling viewport on desktop.
- Use a **custom projection** if you can — MapLibre supports globe projection as of v4. If not, Mercator with a cautious zoom-out is fine.
- Basemap: a dark style (Stadia Alidade Smooth Dark or a custom Protomaps style) tuned to `--nocturne`.
- Overlay: `supply_chain.geojson` points. Each point is a small cream dot, grows into a labeled node as it becomes active, and connects to the previous active node with a subtle white curve (use `@turf/great-circle` or a Bezier approximation).
- The Cachoeira Seca node gets `--accent` red. The Pittsburgh endpoint gets `--accent` red. Every other node is cream.

**Steps** (read the `role` field of each GeoJSON node for copy cues; the fuller narrative is in the prose blocks below):

| Step | Pan-to | Beat |
|------|--------|------|
| 1 | Hiroshima (Ujina) | Seat installed, VIN-logged |
| 2 | Fuchu-cho (Delta Kogyo) | Seat sewn |
| 3 | Yamagata (Midori) | Hides dyed and cut |
| 4 | Ludwigshafen (BASF) | German chemistry feeds in — line drawn from DE→Yamagata |
| 5 | Khromtau (Kazakhstan) | Chromium feeds in — line drawn from KZ→Brazil |
| 6 | Xinguara (Durlicouros) | Identity destroyed in chrome drum |
| 7 | (break away — laundering diagram takes over) | See 4B |
| 8 | Marabá (JBS) / Cachoeira Seca (Arara) | Moral center; Cachoeira Seca highlighted red |
| 9 | Pittsburgh (home) | Return to home — closes the loop |

**Visual 4B — GTA laundering diagram.** Between steps 6 and 8 of the world map, the sticky figure replaces with a node-link diagram showing:

```
  Illegal ranch (Cachoeira Seca)  →  Farm A (clean)  →  Farm B (clean)  →  JBS slaughterhouse
      [red, with 🚫 icon]              GTA-1 issued       GTA-2 issued       only sees GTA-2's origin
```

Five vertical "step" texts alongside the diagram:
  1. Birth on illegal land
  2. First transfer via GTA — birthplace disappears from paper
  3. Optional further transfers
  4. Compliance audit passes (direct supplier is clean)
  5. Absorption into legal market

Animate each arrow in on step-enter. The *Gibbs Lab 81% / 19%* stat should appear as a small donut chart inline at the end of this sub-scrolly.

**Visual 4C — Value-chain bars.** Plain horizontal bar chart, inline in body column, after the map/diagram returns to `--paper`.

```
$23      ▇                    Raw hide at slaughter
$68      ▇▇▇                  Wet-blue post-tanning
$200     ▇▇▇▇▇▇▇▇             Finished red Nappa
$275     ▇▇▇▇▇▇▇▇▇▇▇          Seat (sewn, Delta Kogyo)
$32,670  ▇▇▇▇▇ [scale break]  Car MSRP (2020)
```

Include a small inset: *"Hide as share of MSRP: 0.07%"*. Use `--nappa` for the hide bars up to the seat; `--ink` for the car. Scale break is editorially important — do not try to draw the full 32,670 linearly, it obliterates the hide bars.

**Prose (use verbatim, break between the three visual moments as marked):**

```
Thus far, this piece has examined how my freedom behind the wheel is
mediated by what the car records about me and by the older American
histories I drive on top of. But the car itself, the object sitting
in my driveway, has a history of its own, and that history is the
most consequential mediation of all.

The red Nappa leather of my driver's seat measures approximately 1.5
to 2.5 square meters of finished hide. It is cut from pieces of
roughly four different animals, assembled into six panels, stitched
over a high-strength steel frame supplied by JFE Steel from the city
of Fukuyama, Japan, and wrapped around polyurethane foam. Delta
Kogyo, a seat manufacturer in Fuchu-cho near Hiroshima, assembled it.
The seat travelled approximately four hours by truck to Mazda's Ujina
Plant No. 1, on a reclaimed peninsula in Hiroshima Bay, where it was
installed at a specific workstation on shift 2, logged with timestamp
against my car's VIN and inspected by a named member of the quality
control team. From that moment forward, the seat's provenance is
impeccable. Every subsequent transfer, from Ujina to the dealership,
from the dealership to me, is captured in a paper trail that Mazda
can reconstruct at any time.

What happened *before* that moment, however, is something else
entirely.
```

↓ *Visual 4A begins here, sticky through the next several paragraphs.*

```
The hides arrived at the Midori Auto Leather plant in Yamagata
Prefecture, in northern Japan, already chrome-tanned in Brazil and
shipped wet-blue through the port of Yokohama. Midori was founded in
1946, and its corporate history notes with some pride that it began
mass production of automotive leather in 1973, the year of the first
oil crisis and of the Japanese automotive industry's turn toward
South American suppliers. At Yamagata the hides were retanned, dyed
in heated drums at approximately 55 degrees Celsius, fatliquored,
dried, softened by a Rizzi staking machine that struck each hide
approximately 40,000 times, buffed, embossed with an artificial grain
and finished with two coats of pigmented polyurethane before being
cut on CNC machines into seat-panel templates. Thirty-five percent of
every hide fell away as waste in this process, later composted and
sold as agricultural fertilizer to rice farmers in the prefecture.

The red pigment is almost certainly an azo dye manufactured by BASF
at its Verbund complex in Ludwigshafen, on the Rhine, one of the
largest continuous chemical production sites on Earth. The
fatliquoring agents, which are the chemistry that keeps the leather
supple for fifteen years without cracking, came from German firms
called Trumpler and TFL, whose ingredient lists span sulfonated fish
oils from Norwegian and Namibian fishing operations, synthetic esters
derived from Indonesian and Malaysian palm oil, and neatsfoot oil
rendered from North American cattle bones.

The chromium itself, which is ultimately responsible for the leather
being leather at all, was almost certainly mined at the Donskoy ore
processing plant in the north of Kazakhstan, near a city called
Khromtau. The name translates as "chromium city". Kazakhstan produces
approximately 30 percent of the world's chromite. Hexavalent chromium
contamination of the groundwater around the plant has been documented
above safety thresholds, and elevated respiratory disease rates in
nearby communities are a direct consequence. The chromium was
partially processed through Lanxess AG in Leverkusen, Germany, before
shipping to Brazil.

All of these materials, the German dyes, the German fatliquors, the
Kazakh chromium, the Norwegian and Namibian fish oil, the Indonesian
palm oil, converged at a tannery called Durlicouros in the town of
Xinguara, in the Brazilian state of Pará. Durlicouros is Leather
Working Group Gold certified, processes over one million hides per
year and exports to the global automotive sector. Inside its chrome
drums, four hundred or more hides from multiple slaughterhouses are
tanned together across forty-eight hours. When the hides emerge,
stable and grey-blue, they are ready for ocean transport. But
something else has also happened. Individual animal origin has been
destroyed. This destruction is not accidental; it is structural to
the industry.

Through this, the supply chain stops cooperating with the question:
where did this come from?
```

↓ *Visual 4A pulls wide to include Brazil. The next paragraph reveals Pará and the moral payload begins.*

```
Brazil has the largest commercial cattle herd in the world,
approximately 238 million head, more than India's and more than the
United States'. Approximately 80 percent of all deforestation in the
Brazilian Amazon is attributable to cattle ranching. In 2024 alone,
the state of Pará lost 17,195 square kilometers of forest, a 421
percent increase over the year before.

A significant portion of that cleared land is, legally, not available
for clearing. Cachoeira Seca, in western Pará, is a 733,000-hectare
Indigenous territory belonging to the Arara people. Under the
Brazilian constitution, non-Indigenous economic activity there is
prohibited. Nevertheless, in 2024, Cachoeira Seca recorded the
largest single-year deforestation of any Indigenous territory in the
Amazon: 1,400 hectares, cleared to make room for illegal cattle
ranches.

The mechanism by which cattle raised on that land ultimately reach
a tannery in Xinguara, and from there a Miata seat in Pittsburgh, is
a single document called the *Guia de Trânsito Animal*, or GTA. The
GTA is a livestock transport permit, issued by the state animal
health agency, and it records, for each shipment, the number of
animals, their age and sex, the farm they are leaving and the farm
they are going to. Importantly, it does *not* record where the
animals were born, nor any farm in the animal's history except the
most recent one.
```

↓ *Visual 4B — laundering diagram takes over as sticky for the next block.*

```
Through this single administrative limitation, an entire laundering
system becomes possible. An animal is born on an illegal ranch inside
Cachoeira Seca. Six to eighteen months later it is trucked to a
compliant neighbouring farm, and the GTA issued for that trip lists
the compliant farm as the origin. The animal's birthplace disappears
from the paper record in a single administrative act. It may move
through two or three more compliant farms before slaughter, each new
permit erasing the previous one. By the time the slaughterhouse runs
a compliance check on the direct supplier, using the industry-standard
software Visipec, the animal's paper trail is immaculate.

In 2020, researchers at the University of Wisconsin–Madison's Gibbs
Lab applied this analysis to GTA and property records from Mato
Grosso and Pará. They found that 81 percent of the deforestation in
the supply chains of major Brazilian slaughterhouses came from
indirect suppliers that those slaughterhouses did not monitor, and
that the remaining 19 percent came from direct suppliers whose own
monitoring systems had failed to catch them. JBS, the largest
meatpacker in the world, acknowledged in its April 2025 SEC filing
that its available monitoring procedures cannot guarantee that any
given animal was raised in full compliance with applicable law.

Human Rights Watch's October 2025 investigation, *Tainted*, documented
five specific cases in which illegal ranches inside Cachoeira Seca
and the neighbouring Terra Nossa settlement sold cattle to intermediate
farms, which then sold cattle to JBS slaughterhouses. The Arara
people, whose ancestral territory those ranchers occupy, depend on
the forest for food, medicine and cultural practice. They are now,
in the language of the report, "restricted in movement in their own
territory."
```

↓ *Sticky releases. Next paragraph stands alone on `--paper`, large type, centered, as a pull quote / breath.*

**Visual 4D — Pull quote as breath.** Single line, centered, EB Garamond italic, 32–40px, `--ink`. Hairline rule above and below.

```
Restricted in movement in their own territory.

The phrase should sit inside the word *freedom* as I have been using it.
```

↓ *Tonal inversion ends. We're back on `--paper`. Value-chain bars (Visual 4C) appear, then the closing paragraphs.*

```
A raw hide at slaughter in Marabá is worth approximately twenty-three
US dollars. The finished red Nappa, after the German dyes and the
Kazakh chromium and the Italian staking machine in Yamagata, is worth
about two hundred. The assembled seat is worth roughly two hundred
and seventy-five. The car, at its 2020 MSRP, was thirty-two thousand
six hundred and seventy. The hide represents about 0.07 percent of
the purchase price.

This is not the injustice.

The injustice is structural. The most environmentally and humanly
costly moment in the life of this object, which is the burning of
a forest that, legally, belongs to the people who live in it, is
simultaneously the moment least visible to anyone downstream who
could act on that knowledge. The system has been designed, at every
level, to allow trade at scale while preventing accountability at
source.
```

---

### CHAPTER 5 — "The arithmetic of freedom"

**Function:** the synthesis. Short by design.

**Layout:** body column only. One inline composite diagram — no map.

**Visual 5A — Four regimes.** An inline SVG (you generate it, not a data-driven chart). Four concentric or adjacent panels, each naming one regime of movement with a tiny glyph or label:

1. **OBD-II in the dash** — private record of private pleasure
2. **Telematics scoring** — private record that is not private
3. **Green Book / ALPR** — public record of public constraint
4. **Cachoeira Seca** — unfreedom through dispossession

Visually link them with thin red threads. Put my position as the small car icon in the center, connected to all four. Keep it restrained — this is illustrative, not infographic.

**Prose (use verbatim):**

```
Four different versions of movement-tracking have moved through this
piece, and in the American imagination they do not typically sit on
the same page. The first is the OBD dongle plugged into my dashboard:
a private record of a private pleasure. The second is the actuarial
scoring engine that rebuilds that same pleasure as a risk curve: a
private record that is not actually private. The third is the Green
Book, the ALPR network, the traffic-stop asymmetry that persists to
this day: a public record of a public constraint, borne by the
American drivers whose *freedom* was never assumed. The fourth is
Cachoeira Seca, where mobility is not being tracked but taken, where
the constraint on movement is not surveillance but dispossession.

Through this, the object in my driveway reveals itself as a meeting
point of four regimes of freedom, distributed unequally across four
continents and linked by a single piece of leather about a meter and
a half on a side. My drive is made possible by each of these regimes,
and was quietly impoverished by my inability, until now, to see them.
```

---

### CHAPTER 6 — "Closing"

**Function:** return to the car without resolving the tension. Stand behind a moral position, then step back. Close with an epigraph that rhymes with the broader argument.

**Layout:** body column. One very small visual only.

**Visual 6A — Closing map.** A minimal version of the Chapter 1 Pittsburgh trace — same basemap, same trip lines — but now half the size, and with a single last line drawn from Cachoeira Seca all the way to the small Pittsburgh polygon (great-circle arc over the globe), rendered so faintly it is almost invisible. 400px tall, inline, centered. No interaction. No labels.

**Prose (use verbatim):**

```
The roof still comes down in under two seconds. The engine still sits
where it sat. The shifter still throws the same two inches. The
OBD-II dongle is still plugged in, and the red Nappa leather is
still, by any measure I can name, beautiful.

Knowing what I know now does not resolve anything. It does not make
the car less of a pleasure. It does not give the Arara back the
1,400 hectares of forest they lost in 2024. It does not unwrite the
Green Book, or unbuild the Civic Arena on the ruins of the Hill
District, or retract the 130-page LexisNexis report that somebody
in Michigan received last year. What it does, I think, is interrupt
the word *freedom* in the middle of itself. The drive that felt
unmediated has turned out to be one of the most mediated objects I
own, and most of that mediation takes place in locations I will
likely never see and involves people I will never meet. The feeling
of freedom is real. It is also the emotional front-end of a system
that is not free for everyone who made it possible.

The reader closes this piece, I hope, with the same complicated
realisation I carried out of the research. That the pleasures we
take for granted are almost always the last, most visible step of
systems that have cost someone else something. That becoming aware
of those systems does not obligate us to abandon the pleasures, but
it does change what the pleasures *mean*. The car will remain in my
driveway. I will keep driving it. But I will, I think, drive it
differently.

"The bird that would soar above the level plain of tradition and
prejudice must have strong wings." — Kate Chopin, The Awakening
```

**End of article.** Include a small footer: credits, sources, attribution, a link back to the atlas project.

---

## 4. Sources & footnotes

Render as a small collapsible "Sources" section at the end, or as inline superscript footnotes. Both work. A flat list is fine for a class project. Must include:

- Kashmir Hill, "Automakers Are Sharing Consumers' Driving Behavior With Insurance Companies," *New York Times*, March 11, 2024.
- FTC v. General Motors settlement, January 2026.
- Human Rights Watch, *Tainted: JBS and the EU's Exposure to Human Rights Violations and Illegal Deforestation in Pará, Brazil*, October 15, 2025.
- Climate Rights International, *Before It's Too Late*, October 9, 2025.
- Gibbs Lab / University of Wisconsin–Madison, *Brazil's cattle supply chain is contaminated with deforestation*, 2020–23.
- OCCRP / Repórter Brasil, *How Illegal Land Grabs in Brazil's Amazon Feed the Global Beef Industry*, July 2022.
- Smithsonian Institution Traveling Exhibition Service / Candacy Taylor, *The Negro Motorist Green Book*.
- Heinz History Center, *Crossroads of the World: How Urban Renewal Changed the Hill*, 2023.
- Brookings Institution, *Traffic stops by race in America*, 2022.
- Bia Leather Supply Chain Reference Report (internal), April 2026.
- OBD-II trip data: author's own, captured via Sidecar, February 27–April 17, 2026.

---

## 5. Assets: what Yousif needs to provide, what is sourceable, what you should generate

### 5.1 Photographs — Yousif needs to take these

**Only three are truly necessary. Do not over-ask.**

1. **Hero / Chapter 1 opener (required).** Roof-down, three-quarter front angle, natural light, ideally golden hour on a Pittsburgh-feeling road. Clean background. Horizontal crop. 2400×1600 minimum. This is the only shot the article cannot function without.
2. **Interior / Chapter 4 opener (required).** Red Nappa driver's seat, close-up, showing grain, stitching, and the Cherry Red soft-top edge visible in the upper corner. Daylight. No people. This is the hero of the supply-chain chapter — the object whose provenance the reader is about to follow. 2000×3000 vertical crop works.
3. **OBD-II dongle plugged in under the dash (recommended, not strictly required).** Flash allowed if needed. A small, matter-of-fact documentary shot for Chapter 2. If the dongle is inconveniently placed, skip this one and use generated illustration instead.

**Nice-to-have, not required:**
4. Through-the-windshield driving shot on a Pittsburgh road. If you have one in your phone already, we'll use it. If not, skip.
5. VIN plate or odometer close-up. Only useful as a Chapter 4 detail. Likely skippable.

### 5.2 Archival / online — you or Claude Code sources these

| Asset | Use | Where to get |
|-------|-----|--------------|
| Negro Motorist Green Book cover (1940 or 1956) | Chapter 3 pull image | Library of Congress (public domain pre-1964 editions), Smithsonian NMAAHC, University of South Carolina Library digital collections |
| Teenie Harris photograph of Wylie Ave / Palace Hotel, Hill District | Chapter 3 archival | Carnegie Museum of Art Teenie Harris Archive — *requires permission / credit*. Alternative: Library of Congress photos of Pittsburgh Hill District 1940s (Jack Delano, FSA) are public domain |
| Cachoeira Seca / Arara people photo | Chapter 4 (Cachoeira Seca beat) | Survival International, Human Rights Watch report imagery (licensed), Mongabay. **All require permission.** If no clear-rights image is available, do not use a photograph — use a MapLibre satellite close-up of deforestation scars in Cachoeira Seca instead (NASA WorldView → Planet Labs → use Sentinel-2 L2A, fully open) |
| Khromtau / Donskoy chromite mine | Optional, Chapter 4 | Wikimedia Commons has a handful of ERG press images. Alternative: skip photo, use a Sentinel-2 satellite close-up |
| BASF Ludwigshafen Verbund aerial | Optional, Chapter 4 | Wikimedia Commons (multiple CC BY-SA aerials exist) |
| Mazda Ujina Plant aerial | Optional, Chapter 4 | Wikimedia Commons. Otherwise skip |

**Editorial advice:** for the supply-chain chapter, lean into cartography over photography. Most of these industrial sites are boring-looking from the outside and their boringness is part of the point. A Sentinel-2 satellite tile of the Cachoeira Seca deforestation frontier is more powerful than any stock photo of a cow.

### 5.3 Generated / SVG — you produce these in-browser

- Line-illustration of the ND Miata (Chapter 1 hero, optional).
- Laundering diagram (Chapter 4, Visual 4B) — pure SVG, five nodes, five arrows.
- "Four regimes" composite (Chapter 5, Visual 5A) — pure SVG, illustrative.
- Value-chain bars (Chapter 4, Visual 4C) — D3 or hand-written SVG.
- Scrubbed speed/altitude charts (Chapter 2) — D3.

---

## 6. Responsive & accessibility checklist

Non-negotiable per the NYT reference's accessibility section:

- [ ] All scrollies stack to single-column on `max-width: 760px`.
- [ ] Reduce-motion: wire `prefers-reduced-motion: reduce` to disable scrubbed animations; render all final states instead. Include an on-page motion toggle (see Pudding's `MotionToggle`).
- [ ] Every step element is keyboard-reachable with visible focus ring. Arrow-keys, Space, Page Up/Down, Home/End all work natively (don't hijack).
- [ ] Every chart and map has a narrative-parity text alternative. Pattern: after a scrolly, include one short paragraph in the body column that restates the key finding ("Over the course of this drive, speed peaked at 96.5 mph and altitude dropped 200 meters between minutes 28 and 36"). This is how screen-reader users get parity.
- [ ] All SVG charts get `role="img"`, `<title>`, `<desc>`.
- [ ] Step captions use `aria-live="polite"`.
- [ ] Reflows correctly at 400% zoom / 320px width (WCAG 1.4.10).
- [ ] Color contrast: red on cream is at risk. Verify `--accent` on `--paper` hits WCAG AA for all body-size text; use `--nappa` (darker) for body-size red text if needed.
- [ ] `100svh` (not `100vh`) on all sticky containers. iOS Safari will otherwise clip.
- [ ] No `overflow: hidden` ancestors to the sticky container. React/Svelte wrappers are the usual culprit.
- [ ] Large images have explicit `width`/`height` to reserve aspect-ratio and prevent layout shift.

---

## 7. Build order (suggested)

If you have limited time, do in this order. Each step is independently shippable.

1. **Static shell.** Typography, palette, layout primitives, all six chapters of prose rendering on paper in the right type. This alone looks good.
2. **Pittsburgh trace map** (Ch 1 / Ch 6). One MapLibre instance, one GeoJSON, one line layer. Confirms your tile/style pipeline works.
3. **Green Book map** (Ch 3). Second map instance, hatched polygon, point layer, hover popup, static table beneath. Map chapter is done.
4. **Value-chain bars** (Ch 4C). Pure D3. Low risk, gets the supply-chain story mostly landed even before the big map is built.
5. **Longest-drive scrubbed scrolly** (Ch 2A). Scrollama + MapLibre + two D3 charts synchronized by step index. First real scrolly.
6. **Telematics overlay** (Ch 2B). Reuses the same sticky; just adds layers.
7. **Supply-chain world map scrolly** (Ch 4A). The big one. Full-bleed, `--nocturne` background, 9 steps. Budget the most time here.
8. **Laundering diagram** (Ch 4B). SVG, pure JS, 5 steps.
9. **Four regimes composite** (Ch 5). Pure SVG illustration. Last because it's the shortest chapter.
10. **Accessibility + reduce-motion + mobile polish + keyboard.**

---

## 8. Final notes for the implementer

- **Voice rule:** the author does not use em-dashes. Use commas, periods, colons, or parentheticals instead. If you need to add copy for a caption or legend, match that restraint.
- **The word "freedom"** is the piece's main editorial throughline. Render it in `--accent` red, italic, **only the first time it appears in each chapter**. After that, it's just text. This is a subtle design moment that rewards a close reader.
- **Don't over-engineer the Miata illustration.** If you can't find or generate a beautiful line drawing in a few passes, ship without it. The title card on white type is more NYT-like than a mediocre SVG.
- **The reader should never need to click, rollover, or hover to see anything that matters.** Tooltips are for supplementary labels only. Tse's Rule 2.
- **Keep the article one HTML page.** No chapter navigation menu. Scroll is the interface. Tse's Rule 3.

Ship it.
