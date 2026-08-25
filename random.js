(function () {
    const baseUrl = "https://apartment.gallery/400/";

    const imageData = Array.from({ length: 90 }, (_, i) => `2001-${String(i + 2).padStart(2, '0')}.jpg`);
    const dominoData = ["hi/2001-domino-01.jpeg", "hi/2001-domino-02.jpeg"];
    const bibliokleptData = Array.from({ length: 5 }, (_, i) => `hi/biblioklept-${String(i + 1).padStart(2, '0')}.jpg`);
    const b3pool = Array.from({ length: 51 }, (_, i) => i + 1)
        .filter(n => n < 47 || n > 49)
        .map(n => `3-books-artist-editions-highlights-${String(n).padStart(2, '0')}.jpg`);

    const swaps = {
        "random-larmee": {
            allowClick: true,
            prefix: "",
            pool: Array.from({ length: 90 }, (_, i) => `https://larmee.org/800/${String(90 - i).padStart(3, "0")}kevinlarmee.jpg`),
            targetUrls: Array.from({ length: 90 }, (_, i) => `https://larmee.org/paintings/${i + 1}.html`),
            preserveImage: false
        },
        "random-apartment-gallery": {
            allowClick: true,
            prefix: baseUrl,
            targetUrl: (imageSrc) => `https://apartment.gallery/${new URL(imageSrc).pathname.split("/")[2]}`,
            preserveImage: false,
            pool: [
                ...Array.from({ length: 11 }, (_, i) => `blaise-larmee/${String(i + 1).padStart(2, '0')}.jpg`),
                ..."6564 6577 6578 6579 6580 6581 6582 6583 6584 6585 6586 6587 6588 6589 6590 6605 6606 6607 6608 6609 6610 6611 6612 6615 6616 6617 6618 6619 6621 6622 6623 6624 6625 6626 6627 6628 6629 6631 6632 6633 6634 6635 6636 6638 6639 6640 6641 6643 6644 6645 6646 6647 6648 6649 6650 6651 6652 6654 6655 6656 6657 6658 6659 6660 6661 6662 6666".split(" ").map(n => `brianna-perry/DSC_${n}.JPG`),
                ..."0351 0399 0414 0417 0420 0432 0453 0456 0459 0462 0468 0511 0512 0513 0514 0515 0517 0518 0519 0520 0524 0525 0526 0528 0532 0533 0534 0535 0536 0537 0538 0540 0541 0542 0543 0546 0548 0553 0554 0556 0559 0565 0575 0577 0578 0579 0580 0583 0584 0588 0591".split(" ").map(n => `kevin-larmee/IMG_${n}.JPG`),
                ..."3246 3247 3248 3249 3250 3251 3252 3253 3254 3255 3256 3257 3258 3259 3260 3261 3262 3263 3264 3265 3266 3267 3268 3269 3270 3271 3272 3273 3274 3275 3276 3277 3278 3279 3280 3281 3282 3283 3284 3285 3286 3287 3288 3289 3290 3291 3292 3293 3294 3295 3296 3297 3299 3300 3301 3302 3303 3305 3306 3307 3308 3309 3314 3315 3316 3318 3320 3321 3322 3323 3324 3325 3326 3327 3328 3329".split(" ").map(n => `altcomics/IMG_${n}.HEIC.jpg`),
                ..."1 2 3 4 5 5b 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20".split(" ").map(n => `vogel-morra-and-kevin-larmee/${n}.jpg`)
            ]
        },
        "random-apartment-show": { targetUrl: "apartment.html", pool: Array.from({ length: 11 }, (_, i) => `apartment-${String(i + 1).padStart(2, '0')}.jpg`) },
        "random-my-parents": { pool: Array.from({ length: 7 }, (_, i) => `myparents-${String(i + 1).padStart(2, '0')}.jpg`) },
        "random-pirates": { pool: Array.from({ length: 10 }, (_, i) => `piratesofthecarbombinfantry-${String(i + 1).padStart(2, '0')}.jpg`) },
        "random-jaywalk": { pool: Array.from({ length: 7 }, (_, i) => `jaywalk-${String(i + 1).padStart(2, '0')}.jpg`) },
        "random-comics-youth": {
            allowClick: true,
            prefix: "",
            pool: ["lo/comics-youth-1.jpg", "lo/comics-youth-2.jpg"],
            targetUrls: ["comics-youth-1.html", "comics-youth-2.html"],
            preserveImage: false
        },
        "random-young-lions": { allowClick: true, targetUrl: "young-lions-artist-edition-07.html", pool: ["young-lions-artist-edition-07.jpg"] },
        "random-young-lions-highlights": { targetUrl: "young-lions-artist-edition-07.html", pool: ["02", "03", "04"].map(n => `young-lions-artist-editions-highlights-${n}.jpg`) },
        "random-mirror-mirror": { pool: Array.from({ length: 97 }, (_, i) => `mirrormirror-${String(i + 1).padStart(2, '0')}.jpg`) },
        "random-3-books": {
            allowClick: true,
            pool: [1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27].map(n => `3-books-artist-edition-${String(n).padStart(2, '0')}.jpg`),
            targetUrls: [1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27].map(n => `3-books-artist-edition-${String(n).padStart(2, '0')}.html`)
        },
        "random-3-books-highlights": { targetUrl: "3-books.html", pool: b3pool },
        "random-silkscreen-books": { targetUrl: "untitled-silkscreen-books.html", pool: ["01", "02", "03", "04", "05"].map(n => `untitled-silkscreen-book-${n}.jpg`) },
        "random-cruise": {
            allowClick: true,
            pool: [1, 2, 3, 4, 5, 6, 7].map(n => `cruise-${String(n).padStart(2, '0')}.${n <= 5 ? 'png' : 'jpg'}`),
            targetUrls: [1, 2, 3, 4, 5, 6, 7].map(n => `cruise-${String(n).padStart(2, '0')}.html`)
        },
        "random-silkscreen-books": {
            allowClick: true,
            pool: [1, 2, 3, 4, 5].map(n => `untitled-silkscreen-book-${String(n).padStart(2, '0')}.jpg`),
            targetUrls: [1, 2, 3, 4, 5].map(n => `untitled-silkscreen-book-${String(n).padStart(2, '0')}.html`)
        },
    };

    const fn = window.location.pathname.split('/').pop().toLowerCase();
    const isRoot = !fn || fn === "/";
    const disableClick = ["index.html", "books.html", "shows.html", "bio.html"].includes(fn) || isRoot;
    const folder = (["index.html", "bio.html", "books.html", "shows.html"].includes(fn) || isRoot) ? "lo/" : "hi/";

    const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const requestedImage = new URLSearchParams(window.location.search).get("image");
    const matchesRequestedImage = (url) => requestedImage && (url === requestedImage || url.split("/").pop() === requestedImage);

    Object.entries(swaps).forEach(([id, { prefix, pool, targetUrl, targetUrls, allowClick, preserveImage = true }]) => {
        const el = document.getElementById(id);
        if (!el || !pool?.length) return;

        const requestedIndex = requestedImage ? pool.findIndex(matchesRequestedImage) : -1;
        const pickIndex = requestedIndex >= 0 ? requestedIndex : Math.floor(Math.random() * pool.length);
        const pick = pool[pickIndex];
        el.src = pick.startsWith("http") ? pick : (prefix !== undefined ? prefix : folder) + pick;
        const link = document.getElementById(`${id}-link`) || el.closest("a");

        const linkHref = link?.getAttribute("href") || "";
        if (disableClick && link && !/^(https?:|\/\/)/i.test(linkHref)) {
            link.href = `${linkHref.split("?")[0]}?image=${encodeURIComponent(pick)}`;
        }

        if (!disableClick || allowClick) {
            el.style.cursor = "pointer";
            if (link && (targetUrl || targetUrls)) {
                const destination = targetUrls
                    ? targetUrls[pickIndex]
                    : typeof targetUrl === "function"
                        ? targetUrl(el.src, pickIndex)
                        : targetUrl;
                link.href = preserveImage ? `${destination}?image=${encodeURIComponent(pick)}` : destination;
            }
            el.addEventListener("click", () => {
                if (link && (targetUrl || targetUrls)) return;
                const nextPick = getRand(pool);
                if (link) link.href = `${link.href.split("?")[0]}?image=${encodeURIComponent(nextPick)}`;
                el.src = (prefix !== undefined ? prefix : folder) + nextPick;
            });
        }
    });

    const imgOne = document.getElementById('random-one');
    if (imgOne && imageData.length) {
        const requestedIndex = requestedImage ? imageData.findIndex(matchesRequestedImage) : -1;
        const selectedImage = requestedIndex >= 0 ? imageData[requestedIndex] : getRand(imageData);
        imgOne.src = folder + selectedImage;
        const link = imgOne.closest("a");
        const linkHref = link?.getAttribute("href") || "";
        if (disableClick && link && !/^(https?:|\/\/)/i.test(linkHref)) {
            link.href = `${linkHref.split("?")[0]}?image=${encodeURIComponent(selectedImage)}`;
        }
        if (!disableClick) {
            imgOne.style.cursor = "pointer";
            imgOne.addEventListener('click', () => imgOne.src = folder + getRand(imageData.filter(u => folder + u !== imgOne.src)));
        }
    }

    const randomDomino = document.getElementById('random-domino');
    if (randomDomino) randomDomino.src = getRand(dominoData);

    const randomTwo = document.getElementById('random-two');
    if (randomTwo) randomTwo.src = getRand(bibliokleptData);
})();

// Keypad Navigation
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const path = window.location.pathname.split('/').pop().toLowerCase();
    const isIdx = !path || path === 'index.html';
    if (!isIdx && !/^\d+(\.html)?$/.test(path)) return;

    const page = isIdx ? 0 : parseInt(path, 10);
    if (e.key === 'ArrowLeft') window.location.href = page === 1 ? 'index.html' : `${page - 1}.html`;
    if (e.key === 'ArrowRight' && page < 5) window.location.href = page === 0 ? '1.html' : `${page + 1}.html`;
});