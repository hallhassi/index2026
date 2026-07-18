// ============================================================================
// templates.js — pure functions that turn site-data.js entries into HTML.
// No file I/O here; build-site.js handles reading/writing.
// ============================================================================

function esc(str = "") {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pad(n, digits = 2) {
  return String(n).padStart(digits, "0");
}

// ----------------------------------------------------------------------------
// <head> block, shared by every page. Includes the basic OG/social meta tags.
// ----------------------------------------------------------------------------
function headBlock({ siteUrl, pageUrl, title, ogImage }) {
  return `<head>
    <meta charset="UTF-8">
    <title>${esc(title)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css.css">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${esc(siteUrl + pageUrl)}">
    <meta property="og:image" content="${esc(siteUrl + ogImage)}">
    <meta name="twitter:card" content="summary_large_image">
</head>`;
}

function headerBlock({ activeLabel } = {}) {
  const booksLink = activeLabel === "books" ? `<h1>books</h1>` : `<a href="books.html">books</a>`;
  return `    <header>
        <a href="index.html">Blaise Larmee</a>
        ${booksLink}
        <a href="shows.html">shows</a>
    </header>`;
}

function bodyBlocksHtml(blocks = [], indent = "        ") {
  return blocks
    .map((b) => {
      const tag = b.type === "blockquote" ? "blockquote" : "p";
      return `${indent}<${tag}>${b.text}</${tag}>`;
    })
    .join("\n");
}

// ----------------------------------------------------------------------------
// Gallery section (goes after the BUY button) + its supporting <script>
// ----------------------------------------------------------------------------
function genSequence(prefix, start, end, digits, ext = "jpg") {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(`${prefix}${pad(i, digits)}.${ext}`);
  return arr;
}

function galleryHtml(gallery) {
  if (!gallery) return "";
  if (gallery.type === "static") {
    return `        <img src="${gallery.hiRes}">`;
  }
  if (gallery.type === "randomSingle" || gallery.type === "randomPools") {
    return gallery.targets
      .map((t, i) => {
        const label = gallery.labels ? `        <p>${esc(gallery.labels[i])}</p>\n` : "";
        return `${label}        <img id="${t}">`;
      })
      .join("\n");
  }
  return "";
}

function galleryScript(gallery) {
  if (!gallery) return "";

  if (gallery.type === "randomSingle") {
    const pool = genSequence(gallery.prefix, gallery.start, gallery.end, gallery.digits);
    const [t1, t2] = gallery.targets;
    return `    <script>
        const imageData = ${JSON.stringify(pool, null, 12).replace(/^/gm, "")};

        const imgOne = document.getElementById('${t1}');
        const imgTwo = document.getElementById('${t2}');

        if (imageData.length > 0) {
            const firstIdx = Math.floor(Math.random() * imageData.length);
            const randomUrlOne = imageData[firstIdx];

            let randomUrlTwo = randomUrlOne;
            if (imageData.length > 1) {
                let secondIdx;
                do {
                    secondIdx = Math.floor(Math.random() * imageData.length);
                } while (secondIdx === firstIdx);
                randomUrlTwo = imageData[secondIdx];
            }

            if (imgOne) imgOne.src = randomUrlOne;
            if (imgTwo) imgTwo.src = randomUrlTwo;
        }
    </script>`;
  }

  if (gallery.type === "randomPools") {
    const full = genSequence(gallery.prefix, gallery.start, gallery.end, gallery.digits);
    const pools = gallery.poolRanges.map(([from, to]) => full.slice(from, to));
    const assignments = gallery.targets
      .map((t, i) => {
        return `        if (imgTargets[${i}] && pools[${i}].length > 0) {
            const idx = Math.floor(Math.random() * pools[${i}].length);
            imgTargets[${i}].src = pools[${i}][idx];
        }`;
      })
      .join("\n");
    return `    <script>
        const pools = ${JSON.stringify(pools)};
        const imgTargets = [${gallery.targets.map((t) => `document.getElementById('${t}')`).join(", ")}];

${assignments}
    </script>`;
  }

  return "";
}

// ----------------------------------------------------------------------------
// Renders either the BUY link or a SOLD marker for a given slug, depending
// on whether it's in ctx.soldSlugs. Used everywhere a buy button appears.
// ----------------------------------------------------------------------------
function buyBlock(slug, buyUrl, ctx, { className = "buy" } = {}) {
  if (ctx.soldSlugs && ctx.soldSlugs.has(slug)) {
    return ``;
  }
  return `<a class="${className}" href="${buyUrl}">BUY</a>`;
}

// ----------------------------------------------------------------------------
// Combo grid (appears at the bottom of a book page if it belongs to a combo)
// ----------------------------------------------------------------------------
function comboGridHtml(comboSlugs, combosBySlug, ctx) {
  if (!comboSlugs || comboSlugs.length === 0) return "";
  const cards = comboSlugs
    .map((slug) => {
      const combo = combosBySlug[slug];
      return `        <article class="combo" data-url="${combo.slug}.html">
            <img src="${combo.image}">
            <p>${esc(combo.title)}</p>
            <p>$${combo.price}</p>
            ${buyBlock(combo.slug, combo.buyUrl, ctx)}
        </article>`;
    })
    .join("\n\n");
  return `    <div class="grid">
${cards}
    </div>`;
}

// ----------------------------------------------------------------------------
// Click-to-navigate script shared by every page with an .grid of <article>s
// ----------------------------------------------------------------------------
const clickNavScript = `    <script>
        const books = document.querySelectorAll('article');

        books.forEach(book => {
            book.addEventListener('click', (e) => {
                if (e.target.closest('a')) {
                    return;
                }
                if (book.dataset.url) {
                    window.location.href = book.dataset.url;
                }
            });
        });
    </script>`;

// ----------------------------------------------------------------------------
// PAGE: individual book page
// ----------------------------------------------------------------------------
function bookPage(book, ctx) {
  const title = book.titleTagOverride || `${book.title} by Blaise Larmee`;
  const ogImage = book.ogImage || bookThumbnail(book) || ctx.defaultOgImage;
  const cover = book.cover ? `        <img src="${book.cover}">\n` : "";
  const gallery = galleryHtml(book.gallery);
  const script = galleryScript(book.gallery);
  const comboGrid = comboGridHtml(book.combos, ctx.combosBySlug, ctx);

  return `<!DOCTYPE html>
<html>

${headBlock({ siteUrl: ctx.siteUrl, pageUrl: `${book.slug}.html`, title, ogImage })}

<body id="book">
${headerBlock()}
    <main>
        <h1>${esc(book.title)}</h1>
${cover}${bodyBlocksHtml(book.bodyBlocks)}
        ${buyBlock(book.slug, book.buyUrl, ctx)}
${gallery}
    </main>
${comboGrid}
${script}
${comboGrid ? clickNavScript : ""}
</body>

</html>
`;
}

// ----------------------------------------------------------------------------
// PAGE: combo page
// ----------------------------------------------------------------------------
function comboPage(combo, memberBooks, ctx) {
  const title = `${combo.description} by Blaise Larmee`;
  const ogImage = combo.image;

  const memberCards = memberBooks
    .map(
      (b) => `            <article data-url="${b.slug}.html">
                <img src="${b.cover}">
                <p>${esc(b.title)}</p>
                <p>$${b.price}</p>
                ${buyBlock(b.slug, b.buyUrl, ctx)}
            </article>`
    )
    .join("\n\n");

  return `<!DOCTYPE html>
<html>

${headBlock({ siteUrl: ctx.siteUrl, pageUrl: `${combo.slug}.html`, title, ogImage })}

<body id="book">
${headerBlock()}
    <main>
        <h1>${esc(combo.title)}</h1>
        <img src="${combo.image}">
        <p>${esc(combo.description)}</p>
        <p>$${combo.price}</p>
        ${buyBlock(combo.slug, combo.buyUrl, ctx)}
        <div class="grid">
${memberCards}
        </div>
    </main>
${clickNavScript}
</body>

</html>
`;
}

// ----------------------------------------------------------------------------
// PAGE: individual edition page (e.g. young-lions-artist-edition-03.html)
// ----------------------------------------------------------------------------
function editionPage(set, num, buyUrl, ctx) {
  const numStr = pad(num, 2);
  const slug = `${set.slugPrefix}-${numStr}`;
  const price = typeof set.price === "function" ? set.price(num) : set.price;
  const formatLine = set.formatLine(num, price);
  const title = `${set.title.replace(/s$/, "")} ${numStr} by Blaise Larmee`;
  const loImg = `lo/${slug}.jpg`;
  const hiImg = `hi/${slug}.jpg`;

  return `<!DOCTYPE html>
<html>

${headBlock({ siteUrl: ctx.siteUrl, pageUrl: `${slug}.html`, title, ogImage: loImg })}

<body id="book">
${headerBlock()}
    <main>
        <h1>${set.title.replace(/s$/, "").replace("Editions", "Edition")} ${numStr}</h1>
        <img src="${loImg}">
        <p>${esc(formatLine)}</p>
        ${buyBlock(slug, buyUrl, ctx)}
        <img src="${hiImg}">
        <a href="${set.galleryFilename}">${esc(set.title)}</a>
    </main>
</body>

</html>
`;
}

// ----------------------------------------------------------------------------
// PAGE: edition gallery page (e.g. young-lions-artist-editions.html)
// ----------------------------------------------------------------------------
function editionGalleryPage(set, links, ctx) {
  const title = `${set.title} by Blaise Larmee`;
  const cards = [];
  for (let i = 1; i <= set.count; i++) {
    const numStr = pad(i, 2);
    const slug = `${set.slugPrefix}-${numStr}`;
    const price = typeof set.price === "function" ? set.price(i) : set.price;
    cards.push(`        <article data-url="${slug}.html">
            <img src="lo/${slug}.jpg">
            <p>${set.title.replace(/s$/, "").replace("Editions", "Edition")} ${numStr}</p>
            <p>$${price}</p>
            ${buyBlock(slug, links[numStr], ctx)}
        </article>`);
  }

  return `<!DOCTYPE html>
<html>

${headBlock({ siteUrl: ctx.siteUrl, pageUrl: set.galleryFilename, title, ogImage: `lo/${set.slugPrefix}-01.jpg` })}

<body>
${headerBlock()}
    <h1 class="center">${esc(set.title)}</h1>
${bodyBlocksHtml(set.galleryIntro, "    ")}
    <div class="grid">
${cards.join("\n\n")}
    </div>
${clickNavScript}
</body>

</html>
`;
}

// Best available thumbnail for a book that has no static `cover` — falls back
// to an explicit `cardImage`, then the first image in a random gallery pool.
function bookThumbnail(b) {
  if (b.cover) return b.cover;
  if (b.cardImage) return b.cardImage;
  const g = b.gallery;
  if (!g) return "";
  if (g.type === "static") return g.hiRes;
  if (g.type === "randomSingle" || g.type === "randomPools") {
    return `${g.prefix}${pad(g.start, g.digits)}.jpg`;
  }
  return "";
}

// ----------------------------------------------------------------------------
// PAGE: books.html (main gallery)
// ----------------------------------------------------------------------------
function booksIndexPage(books, editionSets, ctx) {
  const bookCards = books
    .filter((b) => b.listOnBooksPage)
    .map(
      (b) => `        <article data-url="${b.slug}.html">
            <img src="${bookThumbnail(b)}">
            <p>${esc(b.title)}</p>
            <p>$${b.price}</p>
            ${buyBlock(b.slug, b.buyUrl, ctx)}
        </article>`
    );

  const editionCards = editionSets.map((set, i) => {
    const target = `random-${i}`;
    const prices = set.count
      ? Array.from({ length: set.count }, (_, idx) => (typeof set.price === "function" ? set.price(idx + 1) : set.price))
      : [set.price];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const priceLabel = min === max ? `$${min}` : `$${min}-${max}`;
    return {
      target,
      html: `        <article data-url="${set.galleryFilename}">
            <img id="${target}">
            <p>${esc(set.title.replace("Artist Editions", "").trim())}</p>
            <p>${priceLabel}</p>
            <a class="buy" href="${set.galleryFilename}">BROWSE</a>
        </article>`,
    };
  });

  const editionVarName = (set) => `set_${set.id.replace(/[^a-zA-Z0-9]/g, "_")}`; // must start with a letter

  const editionScriptEntries = editionSets
    .map((set, i) => {
      const varName = editionVarName(set);
      const pool = Array.from({ length: set.count }, (_, idx) => `lo/${set.slugPrefix}-${pad(idx + 1, 2)}.jpg`);
      return `            ${varName}: ${JSON.stringify(pool)}`;
    })
    .join(",\n");

  const editionScriptAssignments = editionSets
    .map((set, i) => {
      const varName = editionVarName(set);
      return `        if (imgTargets[${i}] && imageData.${varName}.length > 0) {
            const idx = Math.floor(Math.random() * imageData.${varName}.length);
            imgTargets[${i}].src = imageData.${varName}[idx];
        }`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>

${headBlock({ siteUrl: ctx.siteUrl, pageUrl: "books.html", title: "Blaise Larmee books", ogImage: ctx.defaultOgImage })}

<body>
${headerBlock({ activeLabel: "books" })}
    <div class="grid">
${bookCards.join("\n\n")}

${editionCards.map((c) => c.html).join("\n\n")}
    </div>

    <script>
        const imageData = {
${editionScriptEntries}
        };

        const imgTargets = [${editionSets.map((_, i) => `document.getElementById('random-${i}')`).join(", ")}];

${editionScriptAssignments}
    </script>
${clickNavScript}
</body>

</html>
`;
}

module.exports = {
  bookPage,
  comboPage,
  editionPage,
  editionGalleryPage,
  booksIndexPage,
  genSequence,
  pad,
};
