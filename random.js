(function () {
    const imageData = Array.from({ length: 90 }, (_, i) => `2001-${String(i + 2).padStart(2, '0')}.jpg`);
    const dominoData = ["hi/2001-domino-01.jpeg", "hi/2001-domino-02.jpeg"];
    const bibliokleptData = Array.from({ length: 5 }, (_, i) => `hi/biblioklept-${String(i + 1).padStart(2, '0')}.jpg`);
    const b3pool = Array.from({ length: 51 }, (_, i) => i + 1)
        .filter(n => n < 47 || n > 49)
        .map(n => `3-books-artist-editions-highlights-${String(n).padStart(2, '0')}.jpg`);
    const apartmentGalleryCollections = {
        altcomics: 76,
        "blaise-larmee": 11,
        "brianna-perry": 67,
        "kevin-larmee": 51,
        "vogel-morra-and-kevin-larmee": 21
    };
    const apartmentGalleryPool = Object.entries(apartmentGalleryCollections)
        .flatMap(([collection, count]) => Array.from({ length: count }, (_, i) => `${collection}/${i + 1}.jpg`));

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
            prefix: "https://apartment.gallery/lo/",
            targetUrl: (imageSrc) => {
                const path = new URL(imageSrc).pathname.split("/").filter(Boolean);
                return `https://apartment.gallery/${path[path.length - 2]}/${path[path.length - 1].replace(/\.jpg$/, ".html")}`;
            },
            preserveImage: false,
            pool: apartmentGalleryPool
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
        "random-artist-editions": {
            allowClick: true,
            preserveImage: false,
            pool: [
                ...[1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27].map(n => `3-books-artist-edition-${String(n).padStart(2, '0')}.jpg`),
                "young-lions-artist-edition-07.jpg"
            ],
            targetUrls: [
                ...[1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27].map(n => `3-books-artist-edition-${String(n).padStart(2, '0')}.html`),
                "young-lions-artist-edition-07.html"
            ]
        },
        "random-young-lions-highlights": { targetUrl: "young-lions-artist-edition-07.html", pool: ["02", "03", "04"].map(n => `young-lions-artist-editions-highlights-${n}.jpg`) },
        "random-mirror-mirror": { pool: Array.from({ length: 97 }, (_, i) => `mirrormirror-${String(i + 1).padStart(2, '0')}.jpg`) },
        "random-3-books": {
            allowClick: true,
            pool: [1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27].map(n => `3-books-artist-edition-${String(n).padStart(2, '0')}.jpg`),
            targetUrls: [1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27].map(n => `3-books-artist-edition-${String(n).padStart(2, '0')}.html`)
        },
        "random-3-books-highlights": { targetUrl: "3-books.html", pool: b3pool },
        "random-cruise": {
            allowClick: true,
            pool: [1, 2, 3, 4, 5, 6, 7].map(n => `cruise-${String(n).padStart(2, '0')}.${n <= 5 ? 'png' : 'jpg'}`),
            targetUrls: [1, 2, 3, 4, 5, 6, 7].map(n => `cruise-${String(n).padStart(2, '0')}.html`)
        },
        "random-ccs-books": {
            allowClick: true,
            prefix: "",
            preserveImage: false,
            pool: [
                "lo/untitled-silkscreen-book-01.jpg",
                "lo/drawings.jpg",
                "lo/mold-01.jpg",
                "lo/capital-01.jpg",
                "lo/conversations-01.jpg",
                "lo/sttng-01.jpg"
            ],
            targetUrls: [
                "untitled-silkscreen-book-01.html",
                "drawings.html",
                "mold.html",
                "capital.html",
                "conversations.html",
                "sttng.html"
            ]
        },
        "random-silkscreen-book": {
            allowClick: true,
            prefix: "",
            preserveImage: false,
            pool: [1, 2, 3, 4, 5].map(n => `lo/untitled-silkscreen-book-${String(n).padStart(2, "0")}.jpg`),
            targetUrls: [1, 2, 3, 4, 5].map(n => `untitled-silkscreen-book-${String(n).padStart(2, "0")}.html`)
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