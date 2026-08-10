/*==================================================
                SHOPZONE APP
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});


/*==================================================
                INITIALIZE
==================================================*/

function initializeApp() {

    /*  The auth pages load neither cart.js nor products.js,
        so the badge counters are not always present. Without
        the guard the ReferenceError here aborts everything
        below it and the rest of the page loses its wiring. */

    if (typeof updateCartCount === "function") {

        updateCartCount();

    }

    if (typeof updateWishlistCount === "function") {

        updateWishlistCount();

    }

    initializeMobileMenu();

    initializeBackToTop();

    initializeNewsletter();

    initializeSearch();

    loadHomeProducts();

    loadProductsPage();

    loadProductDetails();

}


/*==================================================
                MOBILE MENU

    ui.js ships a fuller drawer (scrim, focus handling,
    Escape to close). This stays as the fallback for
    when that script is unavailable — without the guard
    both handlers would fire and cancel each other out.
==================================================*/

function initializeMobileMenu() {

    const menuButton = document.querySelector(".menu-toggle");

    const mobileMenu = document.querySelector(".mobile-menu");

    if (!menuButton || !mobileMenu) return;

    if (typeof window.shopzoneDrawerReady !== "undefined") return;

    menuButton.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");

    });

}


/*==================================================
                BACK TO TOP

    ui.js upgrades this with a scroll progress ring and
    a .visible class. Only the click-to-top behaviour is
    kept here; the show/hide is left to whichever script
    is present so the two never fight over inline styles.
==================================================*/

function initializeBackToTop() {

    const button = document.getElementById("backToTop");

    if (!button) return;

    if (typeof window.shopzoneBackToTopReady === "undefined") {

        window.addEventListener("scroll", () => {

            button.style.display = window.scrollY > 300 ? "flex" : "none";

        });

        button.style.display = "none";

    }

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/*==================================================
                NEWSLETTER
==================================================*/

function initializeNewsletter() {

    const form = document.getElementById("newsletterForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = this.querySelector("input").value;

        if (!email) return;

        notify("Subscribed", {
            detail: "You'll hear about new arrivals and offers first.",
            type: "success"
        });

        this.reset();

    });

}


/*==================================================
                NOTIFY

    Routes through the toast system from ui.js, and
    falls back to alert() if that script is absent.
==================================================*/

function notify(title, options = {}) {

    if (typeof window.showToast === "function") {

        return window.showToast(title, options);

    }

    alert(options.detail ? `${title}\n\n${options.detail}` : title);

}


/*==================================================
                SEARCH
==================================================*/

function initializeSearch() {

    const form = document.getElementById("searchForm");

    const input = document.getElementById("searchInput");

    if (!form || !input) return;

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const keyword = input.value.trim();

        if (!keyword) return;

        window.location.href =

            `products.html?search=${encodeURIComponent(keyword)}`;

    });

}

/*==================================================
                CREATE PRODUCT CARD
==================================================*/

/* Product names come from our own data file, but escaping
   keeps the markup safe if that data ever grows. */
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

}

function renderStars(rating) {

    const full = Math.floor(rating);

    const half = rating - full >= 0.5;

    let markup = "";

    for (let i = 0; i < full; i++) {

        markup += '<i class="fas fa-star"></i>';

    }

    if (half) {

        markup += '<i class="fas fa-star-half-stroke"></i>';

    }

    return markup;

}

function createProductCard(product) {

    const name = escapeHtml(product.name);

    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    const saved = product.oldPrice ? product.oldPrice - product.price : 0;

    /* cart.js owns the wishlist array; reflect it if available */
    const wishlisted =
        typeof isInWishlist === "function" && isInWishlist(product.id);

    return `

        <article class="product-card">

            <div class="product-image">

                <a href="product.html?id=${product.id}"
                   aria-label="View ${name}">

                    <img
                        src="${product.image}"
                        alt="${name}"
                        loading="lazy"
                        decoding="async">

                </a>

                <div class="product-badges">

                    ${discount > 0 ? `
                        <span class="product-badge discount-badge">
                            -${discount}%
                        </span>
                    ` : ""}

                    ${product.newArrival ? `
                        <span class="product-badge new-badge">
                            New
                        </span>
                    ` : ""}

                </div>

                <div class="product-actions">

                    <button
                        class="wishlist-btn ${wishlisted ? "active" : ""}"
                        data-id="${product.id}"
                        type="button"
                        aria-label="${wishlisted ? "Remove from" : "Add to"} wishlist ${name}">

                        <i class="${wishlisted ? "fas" : "far"} fa-heart" aria-hidden="true"></i>

                    </button>

                    <button
                        class="view-btn"
                        data-id="${product.id}"
                        type="button"
                        aria-label="Quick view ${name}">

                        <i class="fas fa-eye" aria-hidden="true"></i>

                    </button>

                </div>

                ${!product.stock ? `
                    <div class="out-of-stock">
                        Out Of Stock
                    </div>
                ` : ""}

            </div>

            <div class="product-content">

                <span class="product-category">
                    ${escapeHtml(product.category)}
                </span>

                <h3 class="product-title">
                    <a href="product.html?id=${product.id}">${name}</a>
                </h3>

                <div class="product-rating">

                    <span class="stars" aria-hidden="true">${renderStars(product.rating)}</span>

                    <span>${product.rating} (${product.reviews})</span>

                </div>

                <div class="product-price">

                    <span class="current-price">
                        $${product.price}
                    </span>

                    ${product.oldPrice ? `
                        <span class="old-price">
                            $${product.oldPrice}
                        </span>
                    ` : ""}

                    ${saved > 0 ? `
                        <span class="save-tag">
                            Save $${saved}
                        </span>
                    ` : ""}

                </div>

                <div class="product-footer">

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                        type="button"
                        ${!product.stock ? "disabled" : ""}>

                        <i class="fas fa-cart-shopping" aria-hidden="true"></i>

                        Add To Cart

                    </button>

                </div>

            </div>

        </article>

    `;

}


/*==================================================
            RENDER PRODUCTS
==================================================*/

function renderProducts(containerId, data) {

    const container = document.getElementById(containerId);

    if (!container) return;

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1">

                <i class="fas fa-magnifying-glass" aria-hidden="true"></i>

                <h2>No Products Found</h2>

                <p>
                    We couldn't find anything matching that.
                    Try a different category or search term.
                </p>

                <a href="products.html" class="btn btn-primary">
                    View All Products
                </a>

            </div>
        `;

        return;

    }

    container.innerHTML = data

        .map(product => createProductCard(product))

        .join("");

    /* ui.js staggers and reveals the freshly injected cards */
    if (typeof window.revealNewContent === "function") {

        window.revealNewContent(container);

    }

}


/*==================================================
        HOME FEATURED PRODUCTS
==================================================*/

function loadHomeProducts() {

    /*  renderProducts() bails on a missing container, but the
        arguments below are evaluated first — and products.js
        is not loaded on the auth pages. Leave early instead. */

    if (typeof getFeaturedProducts !== "function") return;

    renderProducts(

        "featuredProducts",

        getFeaturedProducts().slice(0, 8)

    );

    renderProducts(

        "flashProducts",

        getFlashSaleProducts().slice(0, 8)

    );

    renderProducts(

        "newArrivalProducts",

        getNewArrivalProducts().slice(0, 8)

    );

}


/*==================================================
            PRODUCT PAGE

    Single source of truth for the shop listing so the
    category select, the chips, the sort control and
    the ?category= / ?search= URL params can never
    disagree with each other.
==================================================*/

const shopState = {
    category: "all",
    sort: "default",
    search: ""
};

function loadProductsPage() {

    const container = document.getElementById("productsContainer");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);

    shopState.category = params.get("category") || "all";

    shopState.search = params.get("search") || "";

    /* Reflect the URL in the controls */
    const categoryFilter = document.getElementById("categoryFilter");

    if (categoryFilter) {

        categoryFilter.value = shopState.category;

    }

    const searchInput = document.getElementById("productSearch");

    if (searchInput && shopState.search) {

        searchInput.value = shopState.search;

    }

    renderShop();

}

function getShopResults() {

    let results = shopState.search
        ? filterProductsBySearch(shopState.search)
        : products;

    if (shopState.category !== "all") {

        results = results.filter(
            product => product.category === shopState.category
        );

    }

    return sortProductsList(results, shopState.sort);

}

function renderShop() {

    const results = getShopResults();

    renderProducts("productsContainer", results);

    updateProductCount(results.length);

    syncFilterChips();

    updateShopHeading();

}

function updateShopHeading() {

    const heading = document.getElementById("shopHeading");

    if (!heading) return;

    if (shopState.search) {

        heading.textContent = `Results for "${shopState.search}"`;

    } else if (shopState.category !== "all") {

        heading.textContent =
            shopState.category.charAt(0).toUpperCase() +
            shopState.category.slice(1);

    } else {

        heading.textContent = "All Products";

    }

}

function syncFilterChips() {

    document.querySelectorAll(".filter-chips .chip").forEach(chip => {

        chip.classList.toggle(
            "active",
            chip.dataset.category === shopState.category
        );

        chip.setAttribute(
            "aria-pressed",
            String(chip.dataset.category === shopState.category)
        );

    });

}

/*==================================================
                PRODUCT DETAILS
==================================================*/

function loadProductDetails() {

    const image = document.getElementById("productImage");

    if (!image) return;

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    const product = getProductById(productId);

    if (!product) {

        window.location.href = "products.html";

        return;

    }

    document.title = `${product.name} | ShopZone`;

    document.getElementById("breadcrumbProduct").textContent = product.name;

    document.getElementById("productName").textContent = product.name;

    document.getElementById("productCategory").textContent = product.category;

    document.getElementById("productBrand").textContent = product.brand;

    document.getElementById("productSKU").textContent = `SZ-${product.id.toString().padStart(4, "0")}`;

    document.getElementById("productPrice").textContent = `$${product.price}`;

    document.getElementById("reviewCount").textContent = `(${product.reviews} Reviews)`;

    document.getElementById("productImage").src = product.image;

    document.getElementById("productImage").alt = product.name;

    document.getElementById("productAvailability").textContent =
        product.stock ? "In Stock" : "Out of Stock";

    document.getElementById("productDescription").textContent =
        `${product.name} by ${product.brand} delivers premium quality, excellent performance, and modern design. It is one of the top products in our ${product.category} collection.`;

    /*  Rating comes from the data rather than the five
        hard-coded stars the markup used to carry. */

    const stars = document.getElementById("productStars");

    if (stars) {

        stars.innerHTML = renderStars(product.rating);

    }

    /*  Previous price and saving only appear when the
        product actually has one. */

    const oldPrice = document.getElementById("productOldPrice");

    const saveTag = document.getElementById("productSave");

    if (oldPrice) {

        oldPrice.textContent = product.oldPrice ? `$${product.oldPrice}` : "";

    }

    if (saveTag) {

        saveTag.textContent = product.oldPrice
            ? `Save $${(product.oldPrice - product.price).toFixed(0)}`
            : "";

    }

    const stockPill = document.getElementById("productStockPill");

    if (stockPill) {

        stockPill.textContent = product.stock ? "In stock — ships today" : "Currently unavailable";

        stockPill.classList.toggle("out", !product.stock);

    }

    buildThumbnails(product);

    initializeProductActions(product);

    generateSpecifications(product);

    loadRelatedProducts(product);

}


/*==================================================
            PRODUCT GALLERY

    The catalogue carries a single photo per product,
    so the strip is only shown when a product supplies
    an images array. An empty row of one is worse than
    no row at all.
==================================================*/

function buildThumbnails(product) {

    const gallery = document.getElementById("thumbnailGallery");

    if (!gallery) return;

    const sources = Array.isArray(product.images) && product.images.length
        ? product.images
        : [product.image];

    if (sources.length < 2) {

        gallery.hidden = true;

        return;

    }

    gallery.hidden = false;

    gallery.innerHTML = sources.map((src, index) => `
        <img src="${escapeHtml(src)}"
            alt="${escapeHtml(product.name)} view ${index + 1}"
            class="${index === 0 ? "active" : ""}"
            loading="lazy"
            decoding="async"
            tabindex="0"
            role="button">
    `).join("");

    const main = document.getElementById("productImage");

    function select(thumb) {

        if (!thumb || !main) return;

        gallery.querySelectorAll("img").forEach(img => img.classList.remove("active"));

        thumb.classList.add("active");

        /* Fade through so the swap does not snap */
        main.style.opacity = "0";

        setTimeout(() => {

            main.src = thumb.src;

            main.style.opacity = "";

        }, 140);

    }

    gallery.addEventListener("click", (event) => {

        select(event.target.closest("img"));

    });

    gallery.addEventListener("keydown", (event) => {

        if (event.key !== "Enter" && event.key !== " ") return;

        const thumb = event.target.closest("img");

        if (!thumb) return;

        event.preventDefault();

        select(thumb);

    });

}


/*==================================================
            PRODUCT ACTIONS

    Quantity, add to cart, wishlist and buy now were
    markup only — cart.js owns the data, this binds
    the details page to it.
==================================================*/

function initializeProductActions(product) {

    const quantityInput = document.getElementById("quantity");

    function readQuantity() {

        const value = parseInt(quantityInput ? quantityInput.value : "1", 10);

        return Number.isFinite(value) && value > 0 ? value : 1;

    }

    if (quantityInput) {

        const control = quantityInput.closest(".qty-control");

        if (control) {

            control.addEventListener("click", (event) => {

                const button = event.target.closest("button");

                if (!button) return;

                const step = button.classList.contains("qty-up") ? 1 : -1;

                quantityInput.value = Math.max(1, readQuantity() + step);

            });

        }

        /* Typing a zero or a stray minus should not stick */
        quantityInput.addEventListener("change", () => {

            quantityInput.value = readQuantity();

        });

    }

    const addButton = document.getElementById("addToCartBtn");

    if (addButton) {

        if (!product.stock) {

            addButton.disabled = true;

            addButton.innerHTML = "<i class=\"fas fa-ban\" aria-hidden=\"true\"></i> Out Of Stock";

        } else {

            addButton.addEventListener("click", () => {

                addToCart(product.id, readQuantity());

            });

        }

    }

    /*  Reusing cart.js's .wishlist-btn contract means the
        heart state and the toast come for free. */

    const wishlistButton = document.getElementById("wishlistBtn");

    if (wishlistButton) {

        wishlistButton.classList.add("wishlist-btn");

        wishlistButton.dataset.id = product.id;

        if (typeof syncWishlistButtons === "function") {

            syncWishlistButtons();

        }

    }

    const buyNowButton = document.getElementById("buyNowBtn");

    if (buyNowButton) {

        if (!product.stock) {

            buyNowButton.disabled = true;

        } else {

            buyNowButton.addEventListener("click", () => {

                addToCart(product.id, readQuantity());

                window.location.href = "checkout.html";

            });

        }

    }

}


/*==================================================
            SPECIFICATIONS
==================================================*/

function generateSpecifications(product) {

    const table = document.getElementById("specificationTable");

    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Brand</th>
            <td>${product.brand}</td>
        </tr>

        <tr>
            <th>Category</th>
            <td>${product.category}</td>
        </tr>

        <tr>
            <th>Price</th>
            <td>$${product.price}</td>
        </tr>

        <tr>
            <th>Rating</th>
            <td>${product.rating} ⭐</td>
        </tr>

        <tr>
            <th>Reviews</th>
            <td>${product.reviews}</td>
        </tr>

        <tr>
            <th>Availability</th>
            <td>${product.stock ? "In Stock" : "Out of Stock"}</td>
        </tr>
    `;

}


/*==================================================
            RELATED PRODUCTS
==================================================*/

function loadRelatedProducts(product) {

    const related = products

        .filter(item =>

            item.category === product.category &&

            item.id !== product.id

        )

        .slice(0, 4);

    renderProducts(

        "relatedProducts",

        related

    );

}


/*==================================================
            SEARCH PRODUCTS
==================================================*/

function filterProductsBySearch(keyword) {

    return searchProducts(keyword);

}


/*==================================================
            CATEGORY FILTER
==================================================*/

function filterProductsByCategory(category) {

    if (category === "all") {

        return products;

    }

    return getProductsByCategory(category);

}

/*  Single entry point for every category control: the
    select, the editorial filter chips, and the nav /
    footer links that arrive as ?category= in the URL. */
function selectCategory(category) {

    shopState.category = category || "all";

    const categoryFilter = document.getElementById("categoryFilter");

    if (categoryFilter) {

        categoryFilter.value = shopState.category;

    }

    renderShop();

}


/*==================================================
                SORT PRODUCTS
==================================================*/

function sortProducts(list, option) {

    const items = [...list];

    switch (option) {

        case "price-low":

            return items.sort((a, b) => a.price - b.price);

        case "price-high":

            return items.sort((a, b) => b.price - a.price);

        case "name":

            return items.sort((a, b) =>

                a.name.localeCompare(b.name)

            );

        default:

            return items;

    }

}

/*==================================================
                PRODUCT FILTERS
==================================================*/

function initializeProductFilters() {

    if (!document.getElementById("productsContainer")) return;

    const categoryFilter = document.getElementById("categoryFilter");

    const sortControl = document.getElementById("sortProducts");

    if (categoryFilter) {

        categoryFilter.addEventListener("change", () => {

            selectCategory(categoryFilter.value);

        });

    }

    if (sortControl) {

        sortControl.addEventListener("change", () => {

            shopState.sort = sortControl.value;

            renderShop();

        });

    }

    /* Editorial filter chips — delegated so the row can be
       re-rendered without losing its behaviour. */
    const chipRow = document.querySelector(".filter-chips");

    if (chipRow) {

        chipRow.addEventListener("click", (event) => {

            const chip = event.target.closest(".chip");

            if (!chip || !chip.dataset.category) return;

            selectCategory(chip.dataset.category);

        });

    }

    /* products.html has its own in-page search field */
    const shopSearch = document.getElementById("productSearch");

    if (shopSearch) {

        const shopSearchForm = shopSearch.closest("form");

        if (shopSearchForm) {

            shopSearchForm.addEventListener("submit", (e) => {

                e.preventDefault();

            });

        }

        shopSearch.addEventListener("input", () => {

            shopState.search = shopSearch.value.trim();

            renderShop();

        });

    }

}


/*==================================================
                SEARCH FROM URL

    Kept as a named entry point, but the ?search= param
    is now part of shopState so it composes with the
    category filter instead of overwriting the grid.
==================================================*/

function loadSearchResults() {

    const container = document.getElementById("productsContainer");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);

    const keyword = params.get("search");

    if (!keyword) return;

    /* loadProductsPage already applied it on this pass */
    if (shopState.search === keyword) return;

    shopState.search = keyword;

    renderShop();

}


/*==================================================
                PRODUCT COUNT
==================================================*/

function updateProductCount(count) {

    const counter = document.getElementById("productCount");

    if (!counter) return;

    counter.textContent = `Showing ${count} Products`;

}


/*==================================================
                FLASH SALE COUNTDOWN
==================================================*/

function startCountdown() {

    const days = document.getElementById("days");

    const hours = document.getElementById("hours");

    const minutes = document.getElementById("minutes");

    const seconds = document.getElementById("seconds");

    if (!days || !hours || !minutes || !seconds) return;

    let totalSeconds = 3 * 24 * 60 * 60;

    setInterval(() => {

        if (totalSeconds <= 0) return;

        totalSeconds--;

        const d = Math.floor(totalSeconds / 86400);

        const h = Math.floor((totalSeconds % 86400) / 3600);

        const m = Math.floor((totalSeconds % 3600) / 60);

        const s = totalSeconds % 60;

        days.textContent = d.toString().padStart(2, "0");

        hours.textContent = h.toString().padStart(2, "0");

        minutes.textContent = m.toString().padStart(2, "0");

        seconds.textContent = s.toString().padStart(2, "0");

    }, 1000);

}


/*==================================================
                SORT PRODUCTS
==================================================*/

function sortProductsList(productsList, option) {

    switch (option) {

        case "price-low":

            return [...productsList].sort((a, b) => a.price - b.price);

        case "price-high":

            return [...productsList].sort((a, b) => b.price - a.price);

        case "name":

            return [...productsList].sort((a, b) =>

                a.name.localeCompare(b.name)

            );

        default:

            return productsList;

    }

}


/*==================================================
                GLOBAL EVENTS
==================================================*/

document.addEventListener("click", (event) => {

    const viewButton = event.target.closest(".view-btn");

    if (viewButton) {

        const id = viewButton.dataset.id;

        window.location.href = `product.html?id=${id}`;

    }

});


/*==================================================
                FINAL SETUP
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeProductFilters();

    loadSearchResults();

    startCountdown();

});
/*==================================================
                PRELOADER

    ui.js fades the preloader out via a .done class.
    This hard hide only runs when that script is absent,
    otherwise it would cut the transition short.
==================================================*/

window.addEventListener("load", () => {

    const preloader = document.querySelector(".preloader");

    if (!preloader) return;

    if (typeof window.shopzonePreloaderReady !== "undefined") return;

    preloader.style.display = "none";

});