// ============================================================================
// site-data.js
// ----------------------------------------------------------------------------
// This is the ONLY file you should need to edit to add/change a book, combo,
// or edition set. Both the Stripe link generator and the HTML page builder
// read from this file, so a new entry here automatically:
//   - gets a Stripe product/price/payment link created for it (once)
//   - gets its own book page generated
//   - shows up on books.html (if listOnBooksPage is true)
//   - shows up on any combo grids it belongs to
//
// Run order:
//   1. node scripts/generate-stripe-links.js   (only touches NEW/changed items)
//   2. node scripts/build-site.js              (regenerates all HTML)
// ============================================================================

const SITE_URL = "https://blaiselarmee.com/";

// ----------------------------------------------------------------------------
// SHIPPING TIERS
// Each tier maps to a pair of Stripe shipping rates (USA / WORLD).
// Add a new tier here if a book needs different shipping costs.
//
// 2026-07: renamed Domestic/International -> USA/WORLD, and merged the old
// heavyBook + heavyPackage tiers into one "heavy" tier. Per the live Stripe
// dashboard, "International Heavy Combo Shipping" and "International Heavy
// Book Shipping" were already both $50 — a combo of two heavy books was
// only ever charged what a single heavy book costs to ship together, so a
// dedicated combo rate was redundant. Both 2001/Mirror Mirror individually
// and Combo 02 now share the same "heavy" tier.
// ----------------------------------------------------------------------------
const shippingTiers = {
  letter:   { usa: 200, world: 600,  usaLabel: "USA Shipping (Letter)",  worldLabel: "WORLD Shipping (Letter)" },
  package:  { usa: 500, world: 2000, usaLabel: "USA Shipping (Package)", worldLabel: "WORLD Shipping (Package)" },
  heavy:    { usa: 500, world: 5000, usaLabel: "USA Shipping (Heavy)",   worldLabel: "WORLD Shipping (Heavy)" },
};

// ----------------------------------------------------------------------------
// COUNTRIES — "WORLD" now means essentially everywhere Stripe can ship,
// rather than the old hardcoded 6-country list (US, CA, GB, FR, DE, JP, AU).
// This is the standard ISO 3166-1 alpha-2 list, minus countries under
// comprehensive US sanctions that Stripe won't let you select anyway (Cuba,
// Iran, North Korea, Syria). If Stripe rejects any other code on your
// account for its own compliance reasons, generate-stripe-links.js will
// automatically drop just that code and retry — no need to hand-edit this
// list unless you want to deliberately exclude somewhere.
// ----------------------------------------------------------------------------
const WORLD_COUNTRIES = ["CA", "GB", "FR", "DE", "JP", "AU"];

// ----------------------------------------------------------------------------
// BOOKS
// ----------------------------------------------------------------------------
// bodyBlocks: ordered list of {type: 'p'|'blockquote', text} rendered between
//   the cover image and the BUY button — this is the book's description area.
// cover: the lo-res image shown at the top of the book's own page (omit for
//   books like Jaywalk that don't have one).
// gallery: what appears *after* the BUY button.
//   - { type: 'static', hiRes: '...' }                     one fixed hi-res image
//   - { type: 'randomSingle', prefix, start, end, targets } N random picks from
//     one numbered sequence of images (e.g. hi/2001-02.jpg .. -91.jpg)
//   - { type: 'randomPools', prefix, start, end, targets, poolRanges, labels }
//     splits one numbered sequence into pools (e.g. pages 1-3 vs 4-7) and picks
//     one random image per pool, optionally with a text label above each image
// combos: slugs of combo entries (below) this book participates in
// listOnBooksPage: whether it shows up on books.html
// titleTagOverride: use if the <title> byline isn't "by Blaise Larmee"
// soldOut: set to true to pull the BUY button everywhere this book appears
//   (its own page, books.html, and any combo grids) while keeping the page
//   itself live. Doesn't touch Stripe on its own — run generate-stripe-links.js
//   afterward and it'll deactivate the payment link too, as a safety net
//   against someone using an old/bookmarked BUY link.
// ----------------------------------------------------------------------------
const books = [
  {
    slug: "comics-youth-1",
    title: "Comics Youth 1",
    price: 5,
    shippingTier: "letter",
    cover: "lo/comics-youth-1.jpg",
    bodyBlocks: [
      { type: "p", text: "$5, 16 pages, half letter, self-published, 2009" },
      { type: "blockquote", text: "\"A true classic of zine making and comics journalism, this is a comic magazine edited by Blaise Larmee where he interviews Jason T. Miles, Jason Overby and the person writing this. Lots of ideas that were in the air at the time of Domino's early 2010's birth can be found here.\" Austin English" },
    ],
    gallery: { type: "static", hiRes: "hi/comics-youth-1.jpg" },
    combos: ["combo-01"],
    listOnBooksPage: true,
  },
  {
    slug: "comics-youth-2",
    title: "Comics Youth 2",
    price: 5,
    shippingTier: "letter",
    cover: "lo/comics-youth-2.jpg",
    bodyBlocks: [
      { type: "p", text: "$5, 16 pages, half letter, GAZE2, 2026" },
    ],
    gallery: { type: "static", hiRes: "hi/comics-youth-2.jpg" },
    combos: ["combo-01"],
    listOnBooksPage: true,
  },
  {
    slug: "altcomics-7",
    title: "Altcomics 7",
    price: 7,
    shippingTier: "package",
    cover: "lo/altcomics-7.jpg",
    titleTagOverride: "Altcomics 7 edited by Blaise Larmee",
    bodyBlocks: [
      { type: "p", text: "$7, 40 pages, 6 by 10 inches, 2dcloud, 2025" },
      { type: "blockquote", text: "\"This anthology will be one of the best you've read all year, though it doesn't alert you to this fact in its production or vibe...everything is very understated here. Larmee edits this perfectly though, bringing in Katie Lane, Claire Gunther, Matthew Thurber, Jason Overby and Frank Santoro to show the true cutting edge of comics: artists reinventing the form to explore thoughts, ideas and feelings rather than grafting naturalistic fiction onto the comics form. It's an incredible mix of artists and the entry fee is cheap, this anthology is a minor miracle.\" Austin English" },
    ],
    gallery: { type: "static", hiRes: "hi/altcomics-7.jpg" },
    combos: [],
    listOnBooksPage: true,
  },
  {
    slug: "2001",
    title: "2001",
    price: 25,
    shippingTier: "heavy",
    cover: "lo/2001.jpg",
    bodyBlocks: [
      { type: "p", text: "$25, 176 pages, 7 by 10 inches, 2dcloud, 2017" },
      { type: "blockquote", text: "\"This is Larmee's best book, in a career marked by many thoughtful projects. Here, we find Larmee continuing to create systems that invert themselves into each other. He compliments one stream of thinking only to undercut it, and then reverse course again. Larmee thinks about comics far more ambitiously than so many of his peers, using the form as commentary on imagery, perceptions of artistic stances, etc, only to then question the very idea of such commentary. Underneath it all is what draws people to Larmee's work in the first place, the sharp as a tack drawing and cartooning, which has never been more distilled than it is in this work.\" Austin English" },
    ],
    // NOTE: sequence starts at 02, not 01 — preserved from the original file.
    // Flag for Blaise: confirm hi/2001-01.jpg is meant to be excluded
    // from the random pool (e.g. reserved/duplicate of the cover) and not a
    // missing-file bug.
    gallery: { type: "randomSingle", prefix: "hi/2001-", start: 2, end: 91, digits: 2, targets: ["random-one", "random-two"] },
    combos: ["combo-02"],
    listOnBooksPage: true,
  },
  {
    slug: "mirror-mirror",
    title: "Mirror Mirror",
    price: 28,
    shippingTier: "heavy",
    cover: "lo/mirror-mirror.jpg",
    bodyBlocks: [
      { type: "p", text: "$28, 192 pages, 7 by 10 inches, 2dcloud, 2016" },
      { type: "p", text: "an exhibition of 10 artists in print" },
      { type: "p", text: "Tracy Auch Nou Andrea Bj\u00fcrstrom Leslie Weibeler Caroline Hennessy Nicholas Verstraeten Katherine Poe Margot Ferrick Connor Willumsen Leomi Sadler" },
      { type: "p", text: "edited by Blaise Larmee" },
    ],
    gallery: { type: "randomSingle", prefix: "hi/mirrormirror-", start: 1, end: 97, digits: 2, targets: ["random-one", "random-two"] },
    combos: ["combo-02"],
    listOnBooksPage: true,
  },
  {
    slug: "jaywalk",
    title: "Jaywalk",
    price: 15,
    shippingTier: "package",
    titleTagOverride: "Jaywalk featuring Blaise Larmee",
    // no cover image on this page in the original — preserved
    bodyBlocks: [
      { type: "p", text: "$15, 116 page anthology featuring 14 pages by Blaise Larmee, 8 by 11 inches, Domino Books, 2025" },
    ],
    gallery: {
      type: "randomPools",
      prefix: "hi/jaywalk-", start: 1, end: 7, digits: 2,
      poolRanges: [[0, 3], [3, 7]], // indices into the 1..7 sequence
      targets: ["random-one", "random-two"],
      labels: ["6 page comic", "8 page comic"],
    },
    combos: [],
    listOnBooksPage: false, // <-- flip to false to take it back off books.html
  },
  {
    slug: "the-whale",
    title: "The Whale",
    price: 25,
    shippingTier: "package",
    inventoryLimit: 17,
    cover: "lo/the-whale.jpg",
    titleTagOverride: "The Whale by Aidan Koch",
    bodyBlocks: [
      { type: "p", text: "$25, 64 pages, 5 by 7 inches, Gaze Books, 2010" },
      { type: "blockquote", text: "I started Gaze Books in order to publish this book. It's the only book by another author I've ever published." },
    ],
    // Original page's hi-res file is still named after the artist, not the slug.
    // Point this at hi/the-whale.jpg once/if that file is renamed to match.
    gallery: { type: "static", hiRes: "hi/aidankoch-01.jpg" },
    combos: [],
    listOnBooksPage: true,
  },
];

// ----------------------------------------------------------------------------
// COMBOS
// slug is both the filename stem (combo-01.html) and the Stripe lookup key.
// members: array of book slugs (from `books` above) included in the bundle.
// soldOut: true pulls this combo's BUY button (see soldOut note on `books`).
// ----------------------------------------------------------------------------
const combos = [
  {
    slug: "combo-01",
    title: "Combo 01",
    price: 10,
    shippingTier: "letter",
    image: "combo-01.png",
    description: "Comics Youth 1 and Comics Youth 2",
    members: ["comics-youth-1", "comics-youth-2"],
  },
  {
    slug: "combo-02",
    title: "Combo 02",
    price: 53,
    shippingTier: "heavy",
    image: "combo-02.png",
    description: "2001 and Mirror Mirror",
    members: ["2001", "mirror-mirror"],
  },
];

// ----------------------------------------------------------------------------
// EDITION SETS (numbered, one-of-a-kind items: Young Lions, 3 Books)
// slugPrefix + NN (zero-padded) = both the filename stem and Stripe key
// price: flat number, OR a function(number) => price for variable pricing
// formatLine: string, OR a function(number, price) => string
// galleryIntro: blockquotes shown at the top of the gallery page
// soldOut: array of copy numbers that are sold (e.g. [3, 7] for copies 03
//   and 07) — each is a one-of-a-kind item, so this is per-copy, not
//   per-set. Their BUY buttons disappear on their own page and on the
//   gallery card; everything else about the page stays.
// ----------------------------------------------------------------------------
const threeBooksPrices = {
  1: 500, 2: 250, 3: 200,
  4: 150, 5: 150, 6: 150, 7: 150, 8: 150, 9: 150,
  10: 100, 11: 100, 12: 100,
  // 13-28 fall through to defaultPrice below
};

const editionSets = [
  {
    id: "young-lions",
    slugPrefix: "young-lions-artist-edition",
    galleryFilename: "young-lions-artist-editions.html",
    title: "Young Lions Artist Editions",
    count: 10,
    price: 25,
    shippingTier: "package",
    inventoryLimit: 1,
    soldOut: [], // e.g. [3, 7] to mark copies 03 and 07 as sold
    formatLine: (num, price) => `$${price}, 96 pages, half letter, self-published, 2009`,
    galleryIntro: [
      { type: "blockquote", text: "The original book with a print glued to the cover." },
      { type: "blockquote", text: "\"Everything in Larmee's work fufills Edward Gorey's belief that all great art is never about what it presents itself as. Here, in a 'debut' graphic novel published in 2010, the work appears to be a naturalistic cartoon novella, with highly accomplished but very contemporary drawing. The story can be enjoyed on those terms, or as a critical statement about the very idea of such a book.\" Austin English" },
      { type: "blockquote", text: "\"the story of a cadre of bored performance artists looking for a new inspiration, and finding it in the form of a fresh-faced young girl.\" Rob Clough" },
    ],
  },
  {
    id: "3-books",
    slugPrefix: "3-books-artist-edition",
    galleryFilename: "3-books-artist-editions.html",
    title: "3 Books Artist Editions",
    count: 28,
    price: (num) => (threeBooksPrices[num] !== undefined ? threeBooksPrices[num] : 50),
    shippingTier: "package",
    inventoryLimit: 1,
    soldOut: [18],
    formatLine: (num, price) => `$${price}, 0 pages, 6 by 9 inches, 2dcloud, 2015`,
    galleryIntro: [
      { type: "blockquote", text: "Raighne gave me his last remaining copies of 3 Books. I modified them by gluing a drawing or print to the cover. Then I discarded the guts, leaving stiff, hollow shells. To scan them I inserted Atlantic Island by Tony Duvert." },
      { type: "blockquote", text: "\"3 Books (2015) disguises its author with inflated privilege, fame, controversies, art world money, before being called out 'in real life' by his publisher, two years later.\" Stephen Hayes" },
    ],
  },
];

module.exports = { SITE_URL, shippingTiers, WORLD_COUNTRIES, books, combos, editionSets };
