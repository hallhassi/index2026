// ============================================================================
// generate-stripe-links.js
// ----------------------------------------------------------------------------
// Talks to Stripe. Reads data/site-data.js, compares it against the existing
// stripe_links.json, and only creates/updates what's actually new or changed:
//   - a slug with no entry yet            -> creates product + price + link
//   - a slug whose price/shipping changed -> creates a NEW price + link,
//     archives the old payment link, updates the entry
//   - a slug newly marked soldOut         -> deactivates its payment link,
//     does NOT create a new one
//   - everything else                     -> left alone, no Stripe API calls
//
// This is what lets you add one new book to site-data.js and re-run this
// without regenerating (or re-paying Stripe fees on) every other link.
//
// If you've just changed shippingTiers/WORLD_COUNTRIES and want EXISTING
// payment links to pick up the new rates/countries without touching their
// price or URL, run scripts/update-shipping-rates.js instead — that's a
// separate, cheaper operation than what this file does.
//
// Usage:
//   STRIPE_SECRET_KEY=sk_live_... node scripts/generate-stripe-links.js
// ============================================================================

const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");
const { SITE_URL, shippingTiers, WORLD_COUNTRIES, books, combos, editionSets } = require("../data/site-data");
const { pad } = require("./lib/templates");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const LINKS_FILE = path.join(__dirname, "..", "stripe_links.json");

// ----------------------------------------------------------------------------
// Flatten site-data.js into one list of { slug, name, price, shippingTier,
// imageUrl, pageUrl, inventoryLimit, soldOut } — the full inventory of things
// that need (or used to need) a Stripe payment link.
// ----------------------------------------------------------------------------
function buildInventory() {
  const items = [];

  for (const b of books) {
    items.push({
      slug: b.slug,
      name: b.title,
      price: b.price,
      shippingTier: b.shippingTier,
      imageUrl: `${SITE_URL}${b.cover || (b.gallery && b.gallery.hiRes) || ""}`,
      pageUrl: `${SITE_URL}${b.slug}.html`,
      inventoryLimit: b.inventoryLimit || null,
      soldOut: !!b.soldOut,
    });
  }

  for (const c of combos) {
    items.push({
      slug: c.slug,
      name: c.title,
      price: c.price,
      shippingTier: c.shippingTier,
      imageUrl: `${SITE_URL}${c.image}`,
      pageUrl: `${SITE_URL}${c.slug}.html`,
      inventoryLimit: null,
      soldOut: !!c.soldOut,
    });
  }

  for (const set of editionSets) {
    const soldSet = new Set(set.soldOut || []);
    for (let i = 1; i <= set.count; i++) {
      const numStr = pad(i, 2);
      const slug = `${set.slugPrefix}-${numStr}`;
      const price = typeof set.price === "function" ? set.price(i) : set.price;
      items.push({
        slug,
        name: `${set.title.replace(/s$/, "").replace("Editions", "Edition")} ${numStr}`,
        price,
        shippingTier: set.shippingTier,
        imageUrl: `${SITE_URL}lo/${slug}.jpg`,
        pageUrl: `${SITE_URL}${slug}.html`,
        inventoryLimit: set.inventoryLimit || null,
        soldOut: soldSet.has(i),
      });
    }
  }

  return items;
}

// ----------------------------------------------------------------------------
// Shipping rates: reuse existing ones by display_name, create if missing.
// ----------------------------------------------------------------------------
async function getOrCreateShippingRates() {
  console.log("Checking Stripe shipping rates...");
  const active = await stripe.shippingRates.list({ active: true, limit: 100 });
  const byName = Object.fromEntries(active.data.map((r) => [r.display_name, r]));

  const resolved = {};
  for (const [tierName, tier] of Object.entries(shippingTiers)) {
    let usa = byName[tier.usaLabel];
    let world = byName[tier.worldLabel];

    if (!usa) {
      usa = await stripe.shippingRates.create({
        display_name: tier.usaLabel,
        type: "fixed_amount",
        fixed_amount: { amount: tier.usa, currency: "usd" },
      });
    }
    if (!world) {
      world = await stripe.shippingRates.create({
        display_name: tier.worldLabel,
        type: "fixed_amount",
        fixed_amount: { amount: tier.world, currency: "usd" },
      });
    }
    resolved[tierName] = [{ shipping_rate: usa.id }, { shipping_rate: world.id }];
  }
  return resolved;
}

// ----------------------------------------------------------------------------
// Stripe rejects a payment link if allowed_countries includes a code it
// doesn't recognize/allow for your account (e.g. a comprehensively
// sanctioned country). Rather than requiring a hand-curated list, try the
// full WORLD_COUNTRIES list and if Stripe complains about specific codes,
// strip them out and retry.
// ----------------------------------------------------------------------------
function extractRejectedCountryCodes(errorMessage) {
  const matches = [...errorMessage.matchAll(/\b([A-Z]{2})\b/g)].map((m) => m[1]);
  return [...new Set(matches)].filter((c) => WORLD_COUNTRIES.includes(c));
}

async function createPaymentLinkWithCountryFallback(payload) {
  let countries = [...payload.shipping_address_collection.allowed_countries];
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      payload.shipping_address_collection.allowed_countries = countries;
      return await stripe.paymentLinks.create(payload);
    } catch (err) {
      const rejected = extractRejectedCountryCodes(err.message || "");
      if (rejected.length === 0 || attempt === 4) throw err;
      console.warn(`    Stripe rejected countries [${rejected.join(", ")}] — dropping and retrying`);
      countries = countries.filter((c) => !rejected.includes(c));
    }
  }
}

async function createLinkFor(item, shippingRates) {
  console.log(`  creating: ${item.name} ($${item.price})`);

  const product = await stripe.products.create({
    name: item.name,
    images: [item.imageUrl],
    metadata: { page_url: item.pageUrl, slug: item.slug },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: item.price * 100,
    currency: "usd",
  });

  const selectedShipping = shippingRates[item.shippingTier] || shippingRates.package;

  const payload = {
    line_items: [{ price: price.id, quantity: 1 }],
    shipping_address_collection: { allowed_countries: WORLD_COUNTRIES },
    shipping_options: selectedShipping,
    after_completion: { type: "redirect", redirect: { url: item.pageUrl } },
  };
  if (item.inventoryLimit) {
    payload.restrictions = { completed_sessions: { limit: item.inventoryLimit } };
  }

  const paymentLink = await createPaymentLinkWithCountryFallback(payload);

  return {
    slug: item.slug,
    name: item.name,
    price: item.price,
    shippingTier: item.shippingTier,
    imageUrl: item.imageUrl,
    dataUrl: item.pageUrl.replace(SITE_URL, ""),
    buyUrl: paymentLink.url,
    productId: product.id,
    priceId: price.id,
    paymentLinkId: paymentLink.id,
    soldOut: false,
  };
}

async function main() {
  const inventory = buildInventory();
  const existing = fs.existsSync(LINKS_FILE) ? JSON.parse(fs.readFileSync(LINKS_FILE, "utf-8")) : {};

  const shippingRates = await getOrCreateShippingRates();

  let created = 0;
  let updated = 0;
  let deactivated = 0;
  let skipped = 0;

  for (const item of inventory) {
    const prev = existing[item.slug];

    // Newly sold out: deactivate the link if one exists, don't create anything.
    if (item.soldOut) {
      if (prev && prev.paymentLinkId && !prev.soldOut) {
        console.log(`  deactivating (sold out): ${item.name}`);
        try {
          await stripe.paymentLinks.update(prev.paymentLinkId, { active: false });
        } catch (e) {
          console.warn(`    (couldn't deactivate: ${e.message})`);
        }
        existing[item.slug] = { ...prev, soldOut: true };
        deactivated++;
      } else if (prev) {
        existing[item.slug] = { ...prev, soldOut: true };
      }
      continue;
    }

    if (!prev) {
      existing[item.slug] = await createLinkFor(item, shippingRates);
      created++;
      await new Promise((r) => setTimeout(r, 250));
      continue;
    }

    const changed = prev.price !== item.price || prev.shippingTier !== item.shippingTier || prev.soldOut;
    if (changed) {
      const reason = prev.soldOut ? "back in stock" : `price/shipping changed: $${prev.price}->$${item.price}`;
      console.log(`  updating: ${item.name} (${reason})`);
      if (prev.paymentLinkId) {
        try {
          await stripe.paymentLinks.update(prev.paymentLinkId, { active: false });
        } catch (e) {
          console.warn(`    (couldn't deactivate old link: ${e.message})`);
        }
      }
      existing[item.slug] = await createLinkFor(item, shippingRates);
      updated++;
      await new Promise((r) => setTimeout(r, 250));
      continue;
    }

    skipped++;
  }

  fs.writeFileSync(LINKS_FILE, JSON.stringify(existing, null, 2));
  console.log(`\n✅ Done. Created ${created}, updated ${updated}, deactivated ${deactivated}, left ${skipped} unchanged.`);
  console.log(`   ${LINKS_FILE}`);
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
