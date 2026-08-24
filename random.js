(function () {
    const baseUrl = "https://apartment.gallery/400/";

    const imageData = [
        "hi/2001-02.jpg", "hi/2001-03.jpg", "hi/2001-04.jpg", "hi/2001-05.jpg",
        "hi/2001-06.jpg", "hi/2001-07.jpg", "hi/2001-08.jpg", "hi/2001-09.jpg",
        "hi/2001-10.jpg", "hi/2001-11.jpg", "hi/2001-12.jpg", "hi/2001-13.jpg",
        "hi/2001-14.jpg", "hi/2001-15.jpg", "hi/2001-16.jpg", "hi/2001-17.jpg",
        "hi/2001-18.jpg", "hi/2001-19.jpg", "hi/2001-20.jpg", "hi/2001-21.jpg",
        "hi/2001-22.jpg", "hi/2001-23.jpg", "hi/2001-24.jpg", "hi/2001-25.jpg",
        "hi/2001-26.jpg", "hi/2001-27.jpg", "hi/2001-28.jpg", "hi/2001-29.jpg",
        "hi/2001-30.jpg", "hi/2001-31.jpg", "hi/2001-32.jpg", "hi/2001-33.jpg",
        "hi/2001-34.jpg", "hi/2001-35.jpg", "hi/2001-36.jpg", "hi/2001-37.jpg",
        "hi/2001-38.jpg", "hi/2001-39.jpg", "hi/2001-40.jpg", "hi/2001-41.jpg",
        "hi/2001-42.jpg", "hi/2001-43.jpg", "hi/2001-44.jpg", "hi/2001-45.jpg",
        "hi/2001-46.jpg", "hi/2001-47.jpg", "hi/2001-48.jpg", "hi/2001-49.jpg",
        "hi/2001-50.jpg", "hi/2001-51.jpg", "hi/2001-52.jpg", "hi/2001-53.jpg",
        "hi/2001-54.jpg", "hi/2001-55.jpg", "hi/2001-56.jpg", "hi/2001-57.jpg",
        "hi/2001-58.jpg", "hi/2001-59.jpg", "hi/2001-60.jpg", "hi/2001-61.jpg",
        "hi/2001-62.jpg", "hi/2001-63.jpg", "hi/2001-64.jpg", "hi/2001-65.jpg",
        "hi/2001-66.jpg", "hi/2001-67.jpg", "hi/2001-68.jpg", "hi/2001-69.jpg",
        "hi/2001-70.jpg", "hi/2001-71.jpg", "hi/2001-72.jpg", "hi/2001-73.jpg",
        "hi/2001-74.jpg", "hi/2001-75.jpg", "hi/2001-76.jpg", "hi/2001-77.jpg",
        "hi/2001-78.jpg", "hi/2001-79.jpg", "hi/2001-80.jpg", "hi/2001-81.jpg",
        "hi/2001-82.jpg", "hi/2001-83.jpg", "hi/2001-84.jpg", "hi/2001-85.jpg",
        "hi/2001-86.jpg", "hi/2001-87.jpg", "hi/2001-88.jpg", "hi/2001-89.jpg",
        "hi/2001-90.jpg", "hi/2001-91.jpg"
    ];

    // Generate pool for 01-51, skipping 47, 48, and 49
    const b3pool = Array.from({ length: 51 }, (_, i) => i + 1)
        .filter(num => num < 47 || num > 49)
        .map(num => `3-books-artist-editions-highlights-${String(num).padStart(2, '0')}.jpg`);

    const swaps = {
        "random-larmee": {
            prefix: "",
            pool: Array.from({ length: 90 }, (_, i) => {
                const num = String(90 - i).padStart(3, "0");
                return `https://larmee.org/800/${num}kevinlarmee.jpg`;
            })
        },
        "random-apartment-gallery": {
            prefix: baseUrl,
            pool: [
                "blaise-larmee/01.jpg", "blaise-larmee/02.jpg", "blaise-larmee/03.jpg", "blaise-larmee/04.jpg",
                "blaise-larmee/05.jpg", "blaise-larmee/06.jpg", "blaise-larmee/07.jpg", "blaise-larmee/08.jpg",
                "blaise-larmee/09.jpg", "blaise-larmee/10.jpg", "blaise-larmee/11.jpg",
                "brianna-perry/DSC_6564.JPG", "brianna-perry/DSC_6577.JPG", "brianna-perry/DSC_6578.JPG",
                "brianna-perry/DSC_6579.JPG", "brianna-perry/DSC_6580.JPG", "brianna-perry/DSC_6581.JPG",
                "brianna-perry/DSC_6582.JPG", "brianna-perry/DSC_6583.JPG", "brianna-perry/DSC_6584.JPG",
                "brianna-perry/DSC_6585.JPG", "brianna-perry/DSC_6586.JPG", "brianna-perry/DSC_6587.JPG",
                "brianna-perry/DSC_6588.JPG", "brianna-perry/DSC_6589.JPG", "brianna-perry/DSC_6590.JPG",
                "brianna-perry/DSC_6605.JPG", "brianna-perry/DSC_6606.JPG", "brianna-perry/DSC_6607.JPG",
                "brianna-perry/DSC_6608.JPG", "brianna-perry/DSC_6609.JPG", "brianna-perry/DSC_6610.JPG",
                "brianna-perry/DSC_6611.JPG", "brianna-perry/DSC_6612.JPG", "brianna-perry/DSC_6615.JPG",
                "brianna-perry/DSC_6616.JPG", "brianna-perry/DSC_6617.JPG", "brianna-perry/DSC_6618.JPG",
                "brianna-perry/DSC_6619.JPG", "brianna-perry/DSC_6621.JPG", "brianna-perry/DSC_6622.JPG",
                "brianna-perry/DSC_6623.JPG", "brianna-perry/DSC_6624.JPG", "brianna-perry/DSC_6625.JPG",
                "brianna-perry/DSC_6626.JPG", "brianna-perry/DSC_6627.JPG", "brianna-perry/DSC_6628.JPG",
                "brianna-perry/DSC_6629.JPG", "brianna-perry/DSC_6631.JPG", "brianna-perry/DSC_6632.JPG",
                "brianna-perry/DSC_6633.JPG", "brianna-perry/DSC_6634.JPG", "brianna-perry/DSC_6635.JPG",
                "brianna-perry/DSC_6636.JPG", "brianna-perry/DSC_6638.JPG", "brianna-perry/DSC_6639.JPG",
                "brianna-perry/DSC_6640.JPG", "brianna-perry/DSC_6641.JPG", "brianna-perry/DSC_6643.JPG",
                "brianna-perry/DSC_6644.JPG", "brianna-perry/DSC_6645.JPG", "brianna-perry/DSC_6646.JPG",
                "brianna-perry/DSC_6647.JPG", "brianna-perry/DSC_6648.JPG", "brianna-perry/DSC_6649.JPG",
                "brianna-perry/DSC_6650.JPG", "brianna-perry/DSC_6651.JPG", "brianna-perry/DSC_6652.JPG",
                "brianna-perry/DSC_6654.JPG", "brianna-perry/DSC_6655.JPG", "brianna-perry/DSC_6656.JPG",
                "brianna-perry/DSC_6657.JPG", "brianna-perry/DSC_6658.JPG", "brianna-perry/DSC_6659.JPG",
                "brianna-perry/DSC_6660.JPG", "brianna-perry/DSC_6661.JPG", "brianna-perry/DSC_6662.JPG",
                "brianna-perry/DSC_6666.JPG",
                "kevin-larmee/IMG_0351.JPG", "kevin-larmee/IMG_0399.JPG", "kevin-larmee/IMG_0414.JPG",
                "kevin-larmee/IMG_0417.JPG", "kevin-larmee/IMG_0420.JPG", "kevin-larmee/IMG_0432.JPG",
                "kevin-larmee/IMG_0453.JPG", "kevin-larmee/IMG_0456.JPG", "kevin-larmee/IMG_0459.JPG",
                "kevin-larmee/IMG_0462.JPG", "kevin-larmee/IMG_0468.JPG", "kevin-larmee/IMG_0511.JPG",
                "kevin-larmee/IMG_0512.JPG", "kevin-larmee/IMG_0513.JPG", "kevin-larmee/IMG_0514.JPG",
                "kevin-larmee/IMG_0515.JPG", "kevin-larmee/IMG_0517.JPG", "kevin-larmee/IMG_0518.JPG",
                "kevin-larmee/IMG_0519.JPG", "kevin-larmee/IMG_0520.JPG", "kevin-larmee/IMG_0524.JPG",
                "kevin-larmee/IMG_0525.JPG", "kevin-larmee/IMG_0526.JPG", "kevin-larmee/IMG_0528.JPG",
                "kevin-larmee/IMG_0532.JPG", "kevin-larmee/IMG_0533.JPG", "kevin-larmee/IMG_0534.JPG",
                "kevin-larmee/IMG_0535.JPG", "kevin-larmee/IMG_0536.JPG", "kevin-larmee/IMG_0537.JPG",
                "kevin-larmee/IMG_0538.JPG", "kevin-larmee/IMG_0540.JPG", "kevin-larmee/IMG_0541.JPG",
                "kevin-larmee/IMG_0542.JPG", "kevin-larmee/IMG_0543.JPG", "kevin-larmee/IMG_0546.JPG",
                "kevin-larmee/IMG_0548.JPG", "kevin-larmee/IMG_0553.JPG", "kevin-larmee/IMG_0554.JPG",
                "kevin-larmee/IMG_0556.JPG", "kevin-larmee/IMG_0559.JPG", "kevin-larmee/IMG_0565.JPG",
                "kevin-larmee/IMG_0575.JPG", "kevin-larmee/IMG_0577.JPG", "kevin-larmee/IMG_0578.JPG",
                "kevin-larmee/IMG_0579.JPG", "kevin-larmee/IMG_0580.JPG", "kevin-larmee/IMG_0583.JPG",
                "kevin-larmee/IMG_0584.JPG", "kevin-larmee/IMG_0588.JPG", "kevin-larmee/IMG_0591.JPG",
                "altcomics/IMG_3246.HEIC.jpg", "altcomics/IMG_3247.HEIC.jpg", "altcomics/IMG_3248.HEIC.jpg",
                "altcomics/IMG_3249.HEIC.jpg", "altcomics/IMG_3250.HEIC.jpg", "altcomics/IMG_3251.HEIC.jpg",
                "altcomics/IMG_3252.HEIC.jpg", "altcomics/IMG_3253.HEIC.jpg", "altcomics/IMG_3254.HEIC.jpg",
                "altcomics/IMG_3255.HEIC.jpg", "altcomics/IMG_3256.HEIC.jpg", "altcomics/IMG_3257.HEIC.jpg",
                "altcomics/IMG_3258.HEIC.jpg", "altcomics/IMG_3259.HEIC.jpg", "altcomics/IMG_3260.HEIC.jpg",
                "altcomics/IMG_3261.HEIC.jpg", "altcomics/IMG_3262.HEIC.jpg", "altcomics/IMG_3263.HEIC.jpg",
                "altcomics/IMG_3264.HEIC.jpg", "altcomics/IMG_3265.HEIC.jpg", "altcomics/IMG_3266.HEIC.jpg",
                "altcomics/IMG_3267.HEIC.jpg", "altcomics/IMG_3268.HEIC.jpg", "altcomics/IMG_3269.HEIC.jpg",
                "altcomics/IMG_3270.HEIC.jpg", "altcomics/IMG_3271.HEIC.jpg", "altcomics/IMG_3272.HEIC.jpg",
                "altcomics/IMG_3273.HEIC.jpg", "altcomics/IMG_3274.HEIC.jpg", "altcomics/IMG_3275.HEIC.jpg",
                "altcomics/IMG_3276.HEIC.jpg", "altcomics/IMG_3277.HEIC.jpg", "altcomics/IMG_3278.HEIC.jpg",
                "altcomics/IMG_3279.HEIC.jpg", "altcomics/IMG_3280.HEIC.jpg", "altcomics/IMG_3281.HEIC.jpg",
                "altcomics/IMG_3282.HEIC.jpg", "altcomics/IMG_3283.HEIC.jpg", "altcomics/IMG_3284.HEIC.jpg",
                "altcomics/IMG_3285.HEIC.jpg", "altcomics/IMG_3286.HEIC.jpg", "altcomics/IMG_3287.HEIC.jpg",
                "altcomics/IMG_3288.HEIC.jpg", "altcomics/IMG_3289.HEIC.jpg", "altcomics/IMG_3290.HEIC.jpg",
                "altcomics/IMG_3291.HEIC.jpg", "altcomics/IMG_3292.HEIC.jpg", "altcomics/IMG_3293.HEIC.jpg",
                "altcomics/IMG_3294.HEIC.jpg", "altcomics/IMG_3295.HEIC.jpg", "altcomics/IMG_3296.HEIC.jpg",
                "altcomics/IMG_3297.HEIC.jpg", "altcomics/IMG_3299.HEIC.jpg", "altcomics/IMG_3300.HEIC.jpg",
                "altcomics/IMG_3301.HEIC.jpg", "altcomics/IMG_3302.HEIC.jpg", "altcomics/IMG_3303.HEIC.jpg",
                "altcomics/IMG_3305.HEIC.jpg", "altcomics/IMG_3306.HEIC.jpg", "altcomics/IMG_3307.HEIC.jpg",
                "altcomics/IMG_3308.HEIC.jpg", "altcomics/IMG_3309.HEIC.jpg", "altcomics/IMG_3314.HEIC.jpg",
                "altcomics/IMG_3315.HEIC.jpg", "altcomics/IMG_3316.HEIC.jpg", "altcomics/IMG_3318.HEIC.jpg",
                "altcomics/IMG_3320.HEIC.jpg", "altcomics/IMG_3321.HEIC.jpg", "altcomics/IMG_3322.HEIC.jpg",
                "altcomics/IMG_3323.HEIC.jpg", "altcomics/IMG_3324.HEIC.jpg", "altcomics/IMG_3325.HEIC.jpg",
                "altcomics/IMG_3326.HEIC.jpg", "altcomics/IMG_3327.HEIC.jpg", "altcomics/IMG_3328.HEIC.jpg",
                "altcomics/IMG_3329.HEIC.jpg",
                "vogel-morra-and-kevin-larmee/1.jpg", "vogel-morra-and-kevin-larmee/2.jpg",
                "vogel-morra-and-kevin-larmee/3.jpg", "vogel-morra-and-kevin-larmee/4.jpg",
                "vogel-morra-and-kevin-larmee/5.jpg", "vogel-morra-and-kevin-larmee/5b.jpg",
                "vogel-morra-and-kevin-larmee/6.jpg", "vogel-morra-and-kevin-larmee/7.jpg",
                "vogel-morra-and-kevin-larmee/8.jpg", "vogel-morra-and-kevin-larmee/9.jpg",
                "vogel-morra-and-kevin-larmee/10.jpg", "vogel-morra-and-kevin-larmee/11.jpg",
                "vogel-morra-and-kevin-larmee/12.jpg", "vogel-morra-and-kevin-larmee/13.jpg",
                "vogel-morra-and-kevin-larmee/14.jpg", "vogel-morra-and-kevin-larmee/15.jpg",
                "vogel-morra-and-kevin-larmee/16.jpg", "vogel-morra-and-kevin-larmee/17.jpg",
                "vogel-morra-and-kevin-larmee/18.jpg", "vogel-morra-and-kevin-larmee/19.jpg",
                "vogel-morra-and-kevin-larmee/20.jpg"
            ]
        },
        "random-apartment-show": { prefix: "", pool: ["apartment-01.jpg", "apartment-02.jpg", "apartment-03.jpg", "apartment-04.jpg", "apartment-05.jpg", "apartment-06.jpg", "apartment-07.jpg", "apartment-08.jpg", "apartment-09.jpg", "apartment-10.jpg"] },
        "random-my-parents": { prefix: "", pool: ["myparents-01.jpg", "myparents-02.jpg", "myparents-03.jpg", "myparents-04.jpg", "myparents-05.jpg", "myparents-06.jpg", "myparents-07.jpg"] },
        "random-pirates": { prefix: "", pool: ["piratesofthecarbombinfantry-01.jpg", "piratesofthecarbombinfantry-02.jpg", "piratesofthecarbombinfantry-03.jpg", "piratesofthecarbombinfantry-04.jpg", "piratesofthecarbombinfantry-05.jpg", "piratesofthecarbombinfantry-06.jpg", "piratesofthecarbombinfantry-07.jpg", "piratesofthecarbombinfantry-08.jpg", "piratesofthecarbombinfantry-09.jpg", "piratesofthecarbombinfantry-10.jpg"] },
        "random-jaywalk": { prefix: "", pool: ["jaywalk-01.jpg", "jaywalk-02.jpg", "jaywalk-03.jpg", "jaywalk-04.jpg", "jaywalk-05.jpg", "jaywalk-06.jpg", "jaywalk-07.jpg"] },
        "random-young-lions": { prefix: "", pool: ["young-lions-artist-edition-07.jpg"] },
        "random-young-lions-highlights": {
            prefix: "",
            pool: [
                "young-lions-artist-editions-highlights-02.jpg",
                "young-lions-artist-editions-highlights-03.jpg",
                "young-lions-artist-editions-highlights-04.jpg"
            ]
        },
        "random-mirror-mirror": {
            prefix: "",
            pool: Array.from({ length: 97 }, (_, i) => `mirrormirror-${String(i + 1).padStart(2, '0')}.jpg`)
        },
        "random-3-books": { prefix: "", pool: ["3-books-artist-edition-01.jpg", "3-books-artist-edition-02.jpg", "3-books-artist-edition-03.jpg", "3-books-artist-edition-04.jpg", "3-books-artist-edition-06.jpg", "3-books-artist-edition-08.jpg", "3-books-artist-edition-09.jpg", "3-books-artist-edition-11.jpg", "3-books-artist-edition-14.jpg", "3-books-artist-edition-15.jpg", "3-books-artist-edition-16.jpg", "3-books-artist-edition-17.jpg", "3-books-artist-edition-18.jpg", "3-books-artist-edition-19.jpg", "3-books-artist-edition-21.jpg", "3-books-artist-edition-22.jpg", "3-books-artist-edition-23.jpg", "3-books-artist-edition-25.jpg", "3-books-artist-edition-26.jpg", "3-books-artist-edition-27.jpg"] },
        "random-3-books-highlights": { prefix: "", pool: b3pool },
        "random-silkscreen-books": { prefix: "", pool: ["untitled-silkscreen-book-01.jpg", "untitled-silkscreen-book-02.jpg", "untitled-silkscreen-book-03.jpg"] }
    };

    // Determine current page details
    const pathname = window.location.pathname.toLowerCase();
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    const loPages = ["index.html", "bio.html", "books.html", "shows.html"];
    const isRootIndex = filename === "" || filename === "/";
    const useLo = loPages.includes(filename) || isRootIndex;

    const disabledPages = ["index.html", "books.html", "shows.html", "bio.html"];
    const disableClick = disabledPages.includes(filename) || isRootIndex;

    const folder = useLo ? "lo/" : "hi/";

    Object.keys(swaps).forEach(function (id) {
        const el = document.getElementById(id);
        const config = swaps[id];
        if (!el || !config.pool || config.pool.length === 0) return;

        function setRandomImage() {
            const choice = config.pool[Math.floor(Math.random() * config.pool.length)];
            const isFullUrl = choice.startsWith("http://") || choice.startsWith("https://");

            if (isFullUrl) {
                el.src = choice;
            } else if (config.prefix) {
                // If prefix is set (like baseUrl), skip inserting "hi/" or "lo/"
                el.src = config.prefix + choice;
            } else {
                el.src = folder + choice;
            }
        }

        // Set initial image swap
        setRandomImage();

        // Swap on click only if not on an excluded page
        if (!disableClick) {
            el.style.cursor = "pointer";
            el.addEventListener("click", setRandomImage);
        }
    });

    // Handle random-one image swap
    const imgOne = document.getElementById('random-one');

    function getRandomImage(excludeUrl = null) {
        if (imageData.length === 0) return '';
        if (imageData.length === 1) return imageData[0];

        const available = imageData.filter(url => url !== excludeUrl);
        return available[Math.floor(Math.random() * available.length)];
    }

    if (imgOne) {
        imgOne.src = getRandomImage();

        if (!disableClick) {
            imgOne.style.cursor = "pointer";
            imgOne.addEventListener('click', () => {
                imgOne.src = getRandomImage(imgOne.src);
            });
        }
    }
})();

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  const path = window.location.pathname.split('/').pop();
  const page = path === '' || path === 'index.html' ? 0 : parseInt(path, 10) || 0;

  if (e.key === 'ArrowLeft' && page > 0) {
    window.location.href = page === 1 ? 'index.html' : `${page - 1}.html`;
  } else if (e.key === 'ArrowRight') {
    window.location.href = page === 0 ? '1.html' : `${page + 1}.html`;
  }
});