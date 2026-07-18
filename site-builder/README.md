# blaiselarmee.com — site builder

One data file drives the whole site. To add a book, combo, or edition set,
edit `data/site-data.js` — that's it. Two scripts read it:

```
data/site-data.js          <- the only file you normally touch
scripts/generate-stripe-links.js   <- talks to Stripe, only for NEW/changed items
scripts/build-site.js              <- regenerates every HTML page (no network)
scripts/lib/templates.js           <- the HTML templates (rarely needs touching)
stripe_links.json                  <- cache of slug -> Stripe payment link (auto-generated, commit this)
output/                            <- where build-site.js writes generated pages
```

## Setup

```
npm install
export STRIPE_SECRET_KEY=sk_live_...
```

## Adding a new single book

1. Add an entry to the `books` array in `data/site-data.js`. Copy the shape
   of an existing one — `slug`, `title`, `price`, `shippingTier`, `cover`,
   `bodyBlocks`, `gallery`, `combos`, `listOnBooksPage`.
2. `npm run links` — creates a Stripe product/price/payment link **only for
   the new slug**. Everything else is left untouched (no new fees, no broken
   links to your existing order history).
3. `npm run build` — regenerates every page, including the new book's own
   page and its card on `books.html`.
4. Upload the contents of `output/` (plus any new images under `lo/`/`hi/`)
   to your live site.

## Adding a new combo

Add an entry to `combos`, listing the `members` (book slugs) it bundles.
Also add that combo's slug to the `combos: [...]` array on each member book
so the combo card shows up on their individual pages. Then `npm run links`
and `npm run build` as above.

## Adding a new numbered edition set (like Young Lions or 3 Books)

Add an entry to `editionSets`. `price` can be a flat number or a
`(number) => price` function if pricing varies per copy. `npm run links`
will create one Stripe link per numbered copy; `npm run build` generates
each copy's page plus the gallery page.

## Changing a price

Just change the number in `data/site-data.js` and run `npm run links`. It
detects the price no longer matches what's on file, creates a **new** Stripe
price + payment link, deactivates the old payment link (so it stops
accepting money but doesn't vanish from your Stripe dashboard history), and
`npm run build` picks up the new link automatically.

## Marking something as sold

Set `soldOut: true` on a book or combo, or add a copy number to an edition
set's `soldOut: [...]` array, in `data/site-data.js`. Then:

```
npm run links   # deactivates that item's Stripe payment link (safety net —
                 # stops anyone with an old/bookmarked link from paying)
npm run build   # regenerates the site with the BUY button removed
                 # everywhere that item appears: its own page, books.html,
                 # any combo grids, and edition gallery cards
```

The page itself stays live — only the buy button disappears, replaced with
`<p class="sold">SOLD</p>`. Nothing in `css.css` styles `.sold` yet, so
right now it'll just render as plain text where the button used to be. Add
something like this to `css.css` if you want it to look distinct:

```css
.sold {
    opacity: .5;
}
```

To bring something back in stock, just remove/flip the `soldOut` flag and
run both scripts again — a fresh payment link is created automatically.

## Shipping rates (USA / WORLD)

As of 2026-07, shipping tiers are named USA/WORLD instead of
Domestic/International, and the old "Heavy Combo" rate (used only by Combo
02) was dropped — it's now on the same "heavy" tier as 2001 and Mirror
Mirror individually, since shipping two heavy books together didn't
actually cost more. WORLD now covers essentially every country Stripe
supports (see `WORLD_COUNTRIES` in `data/site-data.js`) instead of the old
6-country shortlist.

If you're setting this up against a Stripe account that already has the OLD
rate names/links (Domestic/International, separate Heavy Combo), run this
once:

```
npm run update-shipping   # points EXISTING payment links at the new rates
                           # — same price, same buy URL, just new shipping
```

This is cheaper and safer than regenerating every link from scratch, and
won't break any buy button already printed on a live page. The old shipping
rate objects stay in your Stripe dashboard (Stripe doesn't allow deleting
them) but nothing references them anymore after this runs — deactivate them
by hand from the dashboard if you want them out of the list.

## Output location

By default `build-site.js` writes to `./output` so it can never clobber your
live files by accident. Once you trust it, either point `OUTPUT_DIR` in
`scripts/build-site.js` at your actual site folder, or just copy
`output/*.html` over after each build. `css.css` and the `lo/`/`hi/` image
folders are untouched by the build — manage those the same way you do now.

## One more reconciled discrepancy

The old `generate-buttons.js` had "International Heavy Book Shipping" at
$25, but your live Stripe dashboard actually had it at $50 (matching what
"International Heavy Combo Shipping" was charging) — the code had drifted
from what was actually deployed at some point. The consolidated `heavy`
tier now uses $50 for WORLD shipping, matching your dashboard, not the
stale $25 from the old script.

## Known items carried over from the old files (flagged, not silently fixed)

- `2001`'s random hi-res image pool starts at `-02.jpg`, skipping `-01.jpg`.
  Preserved as-is; confirm `hi/2017-2001-01.jpg` is intentionally excluded.
- `the-whale.html`'s hi-res image is still named `hi/2010-aidankoch-01.jpg`
  (artist name, not slug). The low-res cover now uses `lo/the-whale.jpg` per
  your instruction — make sure that file exists on the server.
- Jaywalk is now included on `books.html` (`listOnBooksPage: true`). Flip it
  to `false` in `data/site-data.js` if that was actually intentional before.

## Bugs fixed along the way

- `combo-01.html` / `combo-02.html` both had the `<title>` "Comics Youth 1
  and 2 by Blaise Larmee" — combo-02 (2001 + Mirror Mirror) now gets its own
  correct title.
- The old `generate-buttons.js` pointed **both** combo bundles' Stripe
  `pageUrl` at `books.html`, which meant their entries in `stripe_links.json`
  had colliding keys. Combos now redirect to their own page after checkout.
- Orphaned stray `</p>` on `comics-youth-2.html` removed.
- `.combo` CSS class (50% width) is now applied consistently to all combo
  cards, not just some.
- Every page now has a real `<!DOCTYPE html>`, closing `</body></html>`, and
  basic `og:title` / `og:image` / `og:url` / `twitter:card` meta tags for
  link previews on social platforms.
