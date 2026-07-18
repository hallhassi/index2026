// ============================================================================
// update-shipping-rates.js
// ----------------------------------------------------------------------------
// Run this ONCE after changing shippingTiers or WORLD_COUNTRIES in
// site-data.js (e.g. the Domestic/International -> USA/WORLD rename, or the
// heavyBook+heavyPackage -> heavy consolidation) to move every EXISTING
// payment link in stripe_links.json onto the new rates.
//
// This does NOT touch price, product, or the buy URL — it only calls
// stripe.paymentLinks.update() to swap shipping_options and
// allowed_countries. Existing links (and any already printed on cards, etc.)
// keep working exactly as before, just with the new shipping setup.
//
// Old shipping rate objects (Domestic/International Shipping...) are left
// active on your account afterward since Stripe doesn't allow deleting
// them — they just won't be referenced by anything anymore. Deactivate them
// by hand in the dashboard if you want them out of the shipping rates list.
//
// Usage:
//   STRIPE_SECRET_KEY=sk_live_... node scripts/update-shipping-rates.js
// ============================================================================

const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");
const { shippingTiers, WORLD_COUNTRIES, books, combos, editionSets } = require("../data/site-data");
const { pad } = require("./lib/templates");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const LINKS_FILE = path.join(__dirname, "..", "stripe_links.json");

function buildShippingTierBySlug() {
  const map = {};
  for (const b of books) map[b.slug] = b.shippingTier;
  for (const c of combos) map[c.slug] = c.shippingTier;
  for (const set of editionSets) {
    for (let i = 1; i <= set.count; i++) {
      map[`${set.slugPrefix}-${pad(i, 2)}`] = set.shippingTier;
    }
  }
  return map;
}

async function getShippingRates() {
  console.log("Fetching/creating USA + WORLD shipping rates...");
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

function extractRejectedCountryCodes(errorMessage) {
  const matches = [...errorMessage.matchAll(/\b([A-Z]{2})\b/g)].map((m) => m[1]);
  return [...new Set(matches)].filter((c) => WORLD_COUNTRIES.includes(c));
}

async function updateLinkWithCountryFallback(paymentLinkId, basePayload) {
  let countries = [...basePayload.shipping_address_collection.allowed_countries];
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      basePayload.shipping_address_collection.allowed_countries = countries;
      return await stripe.paymentLinks.update(paymentLinkId, basePayload);
    } catch (err) {
      const rejected = extractRejectedCountryCodes(err.message || "");
      if (rejected.length === 0 || attempt === 4) throw err;
      console.warn(`      Stripe rejected [${rejected.join(", ")}] — dropping and retrying`);
      countries = countries.filter((c) => !rejected.includes(c));
    }
  }
}

async function main() {
  if (!fs.existsSync(LINKS_FILE)) {
    console.error(`❌ ${LINKS_FILE} not found — nothing to update.`);
    process.exit(1);
  }
  const links = JSON.parse(fs.readFileSync(LINKS_FILE, "utf-8"));
  const tierBySlug = buildShippingTierBySlug();
  const shippingRates = await getShippingRates();

  let updated = 0;
  let skippedNoLink = 0;
  let skippedUnknownSlug = 0;

  for (const [slug, entry] of Object.entries(links)) {
    if (!entry.paymentLinkId) {
      skippedNoLink++;
      continue;
    }
    const tierName = tierBySlug[slug];
    if (!tierName || !shippingRates[tierName]) {
      console.warn(`  ⚠️  no current shipping tier found for "${slug}" — skipping (item may have been removed from site-data.js)`);
      skippedUnknownSlug++;
      continue;
    }

    console.log(`  updating shipping on: ${entry.name || slug}`);
    await updateLinkWithCountryFallback(entry.paymentLinkId, {
      shipping_address_collection: { allowed_countries: WORLD_COUNTRIES },
      shipping_options: shippingRates[tierName],
    });

    entry.shippingTier = tierName;
    updated++;
    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
  console.log(`\n✅ Done. Updated ${updated} payment links. Skipped ${skippedNoLink} with no link, ${skippedUnknownSlug} with no matching tier.`);
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
