// ============================================================================
// build-site.js
// ----------------------------------------------------------------------------
// Regenerates every HTML page on the site from data/site-data.js and
// stripe_links.json. Safe to run as many times as you want — it doesn't talk
// to Stripe or the network at all, it just writes files.
//
// Usage:
//   node scripts/build-site.js
//
// Output goes to OUTPUT_DIR (defaults to ./output next to this project so it
// never overwrites your live site by accident). Once you're happy with what
// it produces, change OUTPUT_DIR below to point at your actual site folder,
// or copy the contents of ./output over.
// ============================================================================

const fs = require("fs");
const path = require("path");
const { SITE_URL, books, combos, editionSets } = require("../data/site-data");
const {
  bookPage,
  comboPage,
  editionPage,
  editionGalleryPage,
  booksIndexPage,
  pad,
} = require("./lib/templates");

const OUTPUT_DIR = path.join(__dirname, "..", "output");
const LINKS_FILE = path.join(__dirname, "..", "stripe_links.json");
const DEFAULT_OG_IMAGE = "og-default.jpg"; // used as a fallback if a page has no natural image

function loadLinks() {
  if (!fs.existsSync(LINKS_FILE)) {
    console.warn(`⚠️  ${LINKS_FILE} not found — run generate-stripe-links.js first. Using "#" placeholders.`);
    return {};
  }
  return JSON.parse(fs.readFileSync(LINKS_FILE, "utf-8"));
}

function write(filename, content) {
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), content);
  console.log(`  wrote ${filename}`);
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const links = loadLinks(); // { slug: { buyUrl, price, shippingTier, ... } }
  const buyUrl = (slug) => (links[slug] && links[slug].buyUrl) || "#";

  const ctx = { siteUrl: SITE_URL, defaultOgImage: DEFAULT_OG_IMAGE };

  // Every slug that should have its BUY button pulled everywhere it appears.
  const soldSlugs = new Set();
  for (const b of books) if (b.soldOut) soldSlugs.add(b.slug);
  for (const c of combos) if (c.soldOut) soldSlugs.add(c.slug);
  for (const set of editionSets) {
    for (const n of set.soldOut || []) soldSlugs.add(`${set.slugPrefix}-${pad(n, 2)}`);
  }
  ctx.soldSlugs = soldSlugs;

  // Attach resolved buy URLs to in-memory copies so templates can use them directly
  const booksWithLinks = books.map((b) => ({ ...b, buyUrl: buyUrl(b.slug) }));
  const combosWithLinks = combos.map((c) => ({ ...c, buyUrl: buyUrl(c.slug) }));
  const booksBySlug = Object.fromEntries(booksWithLinks.map((b) => [b.slug, b]));
  const combosBySlug = Object.fromEntries(combosWithLinks.map((c) => [c.slug, c]));
  ctx.combosBySlug = combosBySlug;

  console.log("Building book pages...");
  for (const book of booksWithLinks) {
    write(`${book.slug}.html`, bookPage(book, ctx));
  }

  console.log("Building combo pages...");
  for (const combo of combosWithLinks) {
    const memberBooks = combo.members.map((slug) => booksBySlug[slug]);
    write(`${combo.slug}.html`, comboPage(combo, memberBooks, ctx));
  }

  console.log("Building edition pages + galleries...");
  for (const set of editionSets) {
    const setLinks = {};
    for (let i = 1; i <= set.count; i++) {
      const numStr = pad(i, 2);
      const slug = `${set.slugPrefix}-${numStr}`;
      const url = buyUrl(slug);
      setLinks[numStr] = url;
      write(`${slug}.html`, editionPage(set, i, url, ctx));
    }
    write(set.galleryFilename, editionGalleryPage(set, setLinks, ctx));
  }

  console.log("Building books.html...");
  write("books.html", booksIndexPage(booksWithLinks, editionSets, ctx));

  console.log(`\n✅ Done. ${OUTPUT_DIR}`);
  console.log("   (css.css and image folders are not touched by this script — copy them over yourself if needed.)");
}

main();
