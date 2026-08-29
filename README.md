# MuniBlock Website — v2 Rebuild

Handoff notes for whoever picks this up next.

## What changed from v1

- **Full visual rebuild** on the same dark navy / cyan-violet "Web3 cybersecurity"
  direction the original had, pushed further: animated canvas node-network
  hero, glassmorphic cards, gradient-text stats, CSS-driven bar/donut charts,
  a chain-link motif divider, Space Grotesk + Inter type system.
- **New page: `impact.html`** ("Impact & Data") — a dedicated hub for all the
  research/stat material from `context.zip` (adoption growth charts, use-case
  breakdown, 13 real-world case studies, methodology note). This didn't exist
  in v1; it's now in the main nav.
- **Every page rebuilt** (`index`, `about`, `solutions`, `benefits`, `contact`)
  with the boss's new content from `context.zip` worked in — ROI tables,
  the ERP feature list, the system architecture diagram, the phased adoption
  roadmap, the audit-distribution donut chart, etc. See "Where the data came
  from" below for a full map of source → page.
- **Brand facts corrected/updated** from the newer marketing collateral:
  - Phone: `888-444-8169` (v1 had a placeholder)
  - HQ: San Marcos, Texas (v1 said Kyle, Texas)
  - Added: Texans for Accountable Government endorsement badge (footer +
    About page)
- Component-loading pattern (`fetch('components/header.html')`) kept from
  v1's `js/main.js`, extended with scroll-aware nav, IntersectionObserver
  scroll-reveals, animated counters, and a chart bar-fill trigger.

## Running it locally

`fetch()`-based component loading needs an HTTP origin — opening the HTML
files directly (`file://`) will fail to load the header/footer due to CORS.
Serve the folder locally, e.g.:

```
cd MuniBlock
python3 -m http.server 8000
```

then visit `http://localhost:8000/index.html`. This is also how it should be
deployed (Netlify/Vercel/S3+CloudFront/etc. all serve over HTTP by default,
so this isn't a deploy blocker — just a local-preview note).

## File structure

```
MuniBlock/
  index.html / about.html / solutions.html / benefits.html / impact.html / contact.html
  components/header.html, footer.html   — fetched into every page at runtime
  css/global.css                        — design system (tokens, nav, cards, charts, etc.)
  css/<page>.css                        — per-page overrides only
  js/main.js                            — component loader, nav, reveals, counters, form
  js/network.js                         — canvas node-network hero background
  images/favicon.svg
```

All charts (bar + donut) are pure CSS — no chart library. Bars use a
`--h` custom property animated on scroll via `.bar-chart.in-view`; donuts use
`conic-gradient`. See `global.css` for both patterns if you need to add a new
chart — copy an existing `.bar-chart` or `.donut` block rather than
reinventing it.

## Where the data came from (context.zip)

| Page section | Source in context.zip |
|---|---|
| Hero stats (96% / 85% / 91% / $24B) | `unnamed-2.jpg` ("The MuniBlock Advantage") |
| Ecosystem 6-module grid + architecture diagram | `b5552faa...png` |
| ERP feature list + "Smart Contract Automation" | `unnamed-1.jpg` |
| Solutions page ROI callouts (80% cost, 40-75% audit labor) | `d97f253b...png` (Performance & Economic Efficiency Framework) |
| Phased roadmap (Phase 0 detail) | `Phased Municipal Blockchain Adoption Roadmap.pages` |
| Benefits comparison lists | `MuniBlock Tri Fold.jpg`, `5202a07e...png` |
| Legacy vs blockchain metric cards | `d97f253b...png` summary table |
| Audit-distribution donut (32.5/22.5/16.5/10/8.5/6.5/3.5%) | `d2a83d29...png` |
| ROI Tier 1 table + $150M budget scenarios | `BPF Highest ROI Potential.pages`, `da31610d...png` |
| Impact page 5-year stat grid | `84842B57...PNG` |
| Impact page adoption/spend bar charts | `17344296...PNG`, `1F5B1239...PNG`, `6A39D40B...PNG`, `CB650A15...PNG`, `CF2E5E67...PNG` |
| Use-case breakdown (30/22/15/12/8/6/4/3%) | `5c0113b0...png`, `7a752ccb...png`, and the "estimated percentage breakdown" PDF |
| 13 case studies (Quincy, Guinea-Bissau, World Bank, Baltimore, Lugano, Toronto, Estonia, Wyoming, Reno, Berkeley, Cook County, NYC, Miami) | the case-study PDFs (`Real time case studies.pdf`, `Real-World Blockchain...pdf`, `Short list of municipalities...pdf`, `Several cities have moved beyond theory...pdf`) |
| Copy/catchphrases ("Secure Systems. Transparent Government.", etc.) | `MuniBlock Catchphrases .pdf` |
| Endorsement badge | `MuniBlock Tri Fold.jpg`, `5202a07e...png` |

**Left out on purpose:** `Uprooting Corruption with Blockchain 2024.pdf` contains
political/partisan rhetoric (candidate endorsements, "puppet masters" framing)
that doesn't belong on client-facing marketing — none of that made it in.
Where that same document had legitimate, non-partisan factual content
overlapping with the other sources, that content is reflected elsewhere on
the site instead.

**Note on the stat strip / ROI figures:** these are industry benchmarks and
modeled ranges (Moody's, Deloitte, Gartner, public-sector transformation
studies — see the Impact page methodology note), not guaranteed results for
any specific client. Keep the "modeled from industry benchmarks" framing
intact if you edit that copy — don't present them as audited MuniBlock
results unless/until there's a real client case study to cite.

## Known gaps / good next steps

- No real photography/video — everything is CSS/canvas generated. Real
  screenshots of the product UI (if one exists) would strengthen the
  Solutions page a lot.
- `contact.html`'s form posts to a Formspree endpoint
  (`https://formspree.io/f/mojpoona`) carried over from v1 — confirm that's
  still the right endpoint/owner before launch.
- The Phase 1–3 roadmap cards (Solutions page) are written at a high level
  since the source doc only detailed Phase 0 — flesh out with real bullets
  if/when the boss provides the rest of that roadmap doc.
- Could add a `/news` or blog template if `municipalblockchainsolutions.com`
  content should eventually live on-domain instead of linking out.
- Real client logos/testimonials once available — there's an obvious slot
  for a logo strip on the homepage once MuniBlock has named municipal
  clients to show.
