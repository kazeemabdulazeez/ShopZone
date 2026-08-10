/*==================================================
    SHOPZONE — UI / INTERACTION LAYER

    Presentation only. This file adds motion, theming
    and feedback on top of the existing app logic; it
    never owns cart, wishlist, auth or product state.

    Every routine bails out quietly when its markup is
    absent, so the same script is safe on every page.
==================================================*/


/*==================================================
                HELPERS
==================================================*/

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function prefersReducedMotion() {

    return reduceMotion.matches;

}

function onIdle(callback) {

    if ("requestIdleCallback" in window) {

        requestIdleCallback(callback, { timeout: 900 });

    } else {

        setTimeout(callback, 220);

    }

}


/*==================================================
                TOASTS

    Replaces blocking alert() dialogs. Exposed as
    window.showToast so cart.js / auth.js / checkout.js
    can use it with a graceful alert() fallback.
==================================================*/

const TOAST_ICONS = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    info: "fa-circle-info"
};

function getToastRegion() {

    let region = document.querySelector(".toast-region");

    if (!region) {

        region = document.createElement("div");

        region.className = "toast-region";

        region.setAttribute("role", "status");

        region.setAttribute("aria-live", "polite");

        document.body.appendChild(region);

    }

    return region;

}

function showToast(title, options = {}) {

    const {
        detail = "",
        type = "success",
        duration = 3600,
        actionLabel = "",
        actionHref = ""
    } = options;

    const region = getToastRegion();

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <i class="fas ${TOAST_ICONS[type] || TOAST_ICONS.info}" aria-hidden="true"></i>

        <div class="toast-body">
            <strong></strong>
            ${detail ? "<span></span>" : ""}
        </div>

        ${actionLabel && actionHref ? `<a href="${actionHref}"></a>` : ""}

        <button class="toast-close" type="button" aria-label="Dismiss notification">
            <i class="fas fa-xmark" aria-hidden="true"></i>
        </button>
    `;

    /* textContent keeps product names safe from markup injection */
    toast.querySelector(".toast-body strong").textContent = title;

    if (detail) {

        toast.querySelector(".toast-body span").textContent = detail;

    }

    if (actionLabel && actionHref) {

        toast.querySelector("a").textContent = actionLabel;

    }

    region.appendChild(toast);

    /* Keep the stack shallow */
    const toasts = region.querySelectorAll(".toast");

    if (toasts.length > 3) {

        dismissToast(toasts[0]);

    }

    const timer = setTimeout(() => dismissToast(toast), duration);

    toast.querySelector(".toast-close").addEventListener("click", () => {

        clearTimeout(timer);

        dismissToast(toast);

    });

    return toast;

}

function dismissToast(toast) {

    if (!toast || toast.classList.contains("leaving")) return;

    toast.classList.add("leaving");

    toast.addEventListener("animationend", () => toast.remove(), { once: true });

    /* Fallback when animations are disabled */
    setTimeout(() => toast.remove(), 400);

}

window.showToast = showToast;


/*==================================================
                FLASH MESSAGES

    A toast raised a moment before a redirect never
    gets read — the page it belongs to is already
    gone. These park the message so the destination
    page raises it on arrival instead, which is also
    where it actually makes sense to read it.
==================================================*/

const FLASH_KEY = "shopzoneFlash";

function flashToast(title, options = {}) {

    try {

        sessionStorage.setItem(

            FLASH_KEY,

            JSON.stringify({ title, options })

        );

    } catch (error) {

        /*  Private browsing can refuse storage. The
            message is cosmetic, so show it here and
            accept that the redirect may outrun it. */

        showToast(title, options);

    }

}

function drainFlash() {

    let raw = null;

    try {

        raw = sessionStorage.getItem(FLASH_KEY);

        sessionStorage.removeItem(FLASH_KEY);

    } catch (error) {

        return;

    }

    if (!raw) return;

    try {

        const flash = JSON.parse(raw);

        if (flash && flash.title) {

            showToast(flash.title, flash.options || {});

        }

    } catch (error) {

        /* Malformed entry — already cleared above */

    }

}

window.flashToast = flashToast;


/*==================================================
                THEME

    Honours a saved choice first, then the OS setting.
==================================================*/

const THEME_KEY = "shopzoneTheme";

function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);

    document.querySelectorAll(".theme-toggle").forEach(button => {

        button.setAttribute("aria-pressed", String(theme === "dark"));

        button.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        );

    });

}

function initializeTheme() {

    const saved = localStorage.getItem(THEME_KEY);

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    applyTheme(saved || (systemDark.matches ? "dark" : "light"));

    systemDark.addEventListener("change", event => {

        if (!localStorage.getItem(THEME_KEY)) {

            applyTheme(event.matches ? "dark" : "light");

        }

    });

    document.addEventListener("click", event => {

        const toggle = event.target.closest(".theme-toggle");

        if (!toggle) return;

        const next =
            document.documentElement.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark";

        applyTheme(next);

        localStorage.setItem(THEME_KEY, next);

    });

}

/* Run immediately to avoid a light-theme flash */
initializeTheme();

/*==================================================
                SCROLL REVEAL

    Elements marked [data-reveal] fade in once. Items
    inside a [data-reveal-group] are staggered by their
    index, which is what gives the grids their cascade.
==================================================*/

function initializeScrollReveal() {

    const targets = document.querySelectorAll("[data-reveal]");

    if (!targets.length) return;

    /* Reduced motion: show everything, animate nothing */
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {

        targets.forEach(element => element.classList.add("revealed"));

        return;

    }

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("revealed");

            observer.unobserve(entry.target);

        });

    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px"
    });

    targets.forEach(element => observer.observe(element));

}

function staggerGroup(container) {

    if (!container || prefersReducedMotion()) return;

    const children = container.children;

    for (let i = 0; i < children.length; i++) {

        children[i].setAttribute("data-reveal", "");

        /* Cap the delay so long grids never feel sluggish */
        children[i].style.setProperty(
            "--reveal-delay",
            `${Math.min(i, 11) * 55}ms`
        );

    }

}

/* Re-run reveal for markup injected after load (product grids) */
function revealNewContent(container) {

    if (!container) return;

    staggerGroup(container);

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {

        container.querySelectorAll("[data-reveal]")
            .forEach(element => element.classList.add("revealed"));

        return;

    }

    initializeScrollReveal();

}

window.revealNewContent = revealNewContent;


/*==================================================
                HEADER ON SCROLL
==================================================*/

function initializeHeaderScroll() {

    const header = document.getElementById("mainHeader");

    if (!header) return;

    let ticking = false;

    function update() {

        header.classList.toggle("scrolled", window.scrollY > 12);

        ticking = false;

    }

    window.addEventListener("scroll", () => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(update);

    }, { passive: true });

    update();

}


/*==================================================
                MOBILE DRAWER

    Adds a scrim, focus trapping and Escape handling
    on top of the existing .mobile-menu markup.
==================================================*/

function initializeDrawer() {

    const toggle = document.querySelector(".menu-toggle");

    const drawer = document.querySelector(".mobile-menu");

    if (!toggle || !drawer) return;

    /* app.js checks this flag and stands down, so the two
       scripts never toggle the same class in one click */
    window.shopzoneDrawerReady = true;

    let scrim = document.querySelector(".menu-scrim");

    if (!scrim) {

        scrim = document.createElement("div");

        scrim.className = "menu-scrim";

        document.body.appendChild(scrim);

    }

    function openDrawer() {

        drawer.classList.add("active");

        scrim.classList.add("active");

        toggle.setAttribute("aria-expanded", "true");

        document.body.classList.add("no-scroll");

        const firstLink = drawer.querySelector("a, button");

        if (firstLink) {

            setTimeout(() => firstLink.focus(), 260);

        }

    }

    function closeDrawer() {

        if (!drawer.classList.contains("active")) return;

        drawer.classList.remove("active");

        scrim.classList.remove("active");

        toggle.setAttribute("aria-expanded", "false");

        document.body.classList.remove("no-scroll");

        toggle.focus();

    }

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", () => {

        if (drawer.classList.contains("active")) {

            closeDrawer();

        } else {

            openDrawer();

        }

    });

    scrim.addEventListener("click", closeDrawer);

    drawer.addEventListener("click", event => {

        if (event.target.closest("a") || event.target.closest(".drawer-close")) {

            closeDrawer();

        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeDrawer();

        }

    });

}

/*==================================================
                BACK TO TOP + PROGRESS RING
==================================================*/

function initializeBackToTopRing() {

    const button = document.getElementById("backToTop");

    if (!button) return;

    /* app.js checks this flag and skips its inline
       display toggling, which would fight the ring */
    window.shopzoneBackToTopReady = true;

    /* Build the ring once, around the existing arrow icon */
    if (!button.querySelector(".progress-ring")) {

        const ring = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        ring.setAttribute("class", "progress-ring");

        ring.setAttribute("viewBox", "0 0 56 56");

        ring.setAttribute("aria-hidden", "true");

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("cx", "28");

        circle.setAttribute("cy", "28");

        circle.setAttribute("r", "26");

        ring.appendChild(circle);

        button.appendChild(ring);

        const circumference = 2 * Math.PI * 26;

        button.style.setProperty("--circ", circumference.toFixed(1));

        button.style.setProperty("--dash", circumference.toFixed(1));

    }

    const circumference = 2 * Math.PI * 26;

    let ticking = false;

    function update() {

        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

        button.classList.toggle("visible", window.scrollY > 320);

        button.style.setProperty(
            "--dash",
            (circumference * (1 - Math.min(progress, 1))).toFixed(1)
        );

        ticking = false;

    }

    window.addEventListener("scroll", () => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(update);

    }, { passive: true });

    update();

}


/*==================================================
                BUTTON RIPPLE
==================================================*/

function initializeRipple() {

    document.addEventListener("pointerdown", event => {

        if (prefersReducedMotion()) return;

        const target = event.target.closest(".btn, .add-cart");

        if (!target) return;

        const rect = target.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        const ripple = document.createElement("span");

        ripple.className = "ripple";

        ripple.style.width = `${size}px`;

        ripple.style.height = `${size}px`;

        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;

        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        target.appendChild(ripple);

        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });

    });

}


/*==================================================
                CARD TILT

    Subtle parallax on precise pointers only. Values
    feed the CSS custom props .product-card.tilt reads.
==================================================*/

function initializeTilt() {

    if (prefersReducedMotion()) return;

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const MAX_TILT = 4.5;

    document.addEventListener("pointermove", event => {

        const card = event.target.closest(".product-card");

        if (!card) return;

        const rect = card.getBoundingClientRect();

        const px = (event.clientX - rect.left) / rect.width - 0.5;

        const py = (event.clientY - rect.top) / rect.height - 0.5;

        card.classList.add("tilt");

        card.style.setProperty("--rx", `${(px * MAX_TILT).toFixed(2)}deg`);

        card.style.setProperty("--ry", `${(-py * MAX_TILT).toFixed(2)}deg`);

    });

    document.addEventListener("pointerout", event => {

        const card = event.target.closest(".product-card");

        if (!card) return;

        if (card.contains(event.relatedTarget)) return;

        card.classList.remove("tilt");

        card.style.removeProperty("--rx");

        card.style.removeProperty("--ry");

    });

}


/*==================================================
                MAGNETIC BUTTONS
==================================================*/

function initializeMagnetic() {

    if (prefersReducedMotion()) return;

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const magnets = document.querySelectorAll("[data-magnetic]");

    magnets.forEach(magnet => {

        magnet.addEventListener("pointermove", event => {

            const rect = magnet.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;

            const y = event.clientY - rect.top - rect.height / 2;

            magnet.style.transform =
                `translate(${(x * 0.18).toFixed(2)}px, ${(y * 0.28).toFixed(2)}px)`;

        });

        magnet.addEventListener("pointerleave", () => {

            magnet.style.transform = "";

        });

    });

}


/*==================================================
                HERO PARALLAX
==================================================*/

function initializeParallax() {

    if (prefersReducedMotion()) return;

    const layers = document.querySelectorAll("[data-parallax]");

    if (!layers.length) return;

    let ticking = false;

    function update() {

        const offset = window.scrollY;

        layers.forEach(layer => {

            const speed = parseFloat(layer.dataset.parallax) || 0.12;

            /* Stop translating once the hero is off screen */
            if (offset < window.innerHeight * 1.2) {

                layer.style.transform =
                    `translate3d(0, ${(offset * speed).toFixed(1)}px, 0)`;

            }

        });

        ticking = false;

    }

    window.addEventListener("scroll", () => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(update);

    }, { passive: true });

}

/*==================================================
                QUICK VIEW MODAL

    Upgrades the existing .view-btn from "navigate to
    product page" into an in-place preview. The button
    still carries data-id, and the modal's own link
    goes to the full product page, so nothing is lost.
==================================================*/

let lastFocusedElement = null;

function buildModal() {

    let scrim = document.querySelector(".modal-scrim");

    if (scrim) return scrim;

    scrim = document.createElement("div");

    scrim.className = "modal-scrim";

    scrim.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="quickViewTitle">

            <button class="modal-close" type="button" aria-label="Close quick view">
                <i class="fas fa-xmark" aria-hidden="true"></i>
            </button>

            <div class="modal-grid">

                <div class="modal-media">
                    <img id="quickViewImage" src="" alt="">
                </div>

                <div class="modal-body">

                    <span class="product-category" id="quickViewCategory"></span>

                    <h2 id="quickViewTitle"></h2>

                    <div class="product-rating" id="quickViewRating"></div>

                    <div class="modal-price">
                        <span class="current-price" id="quickViewPrice"></span>
                        <span class="old-price" id="quickViewOldPrice"></span>
                    </div>

                    <p id="quickViewDescription"></p>

                    <div class="product-meta">
                        <p><strong>Brand</strong> <span id="quickViewBrand"></span></p>
                        <p><strong>SKU</strong> <span id="quickViewSku"></span></p>
                        <p><strong>Status</strong> <span id="quickViewStock"></span></p>
                    </div>

                    <div class="modal-actions">
                        <button class="btn btn-primary add-cart" id="quickViewAdd" type="button">
                            <i class="fas fa-cart-shopping" aria-hidden="true"></i>
                            Add To Cart
                        </button>
                        <a class="btn btn-secondary" id="quickViewLink" href="#">
                            Full Details
                        </a>
                    </div>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(scrim);

    scrim.addEventListener("click", event => {

        if (event.target === scrim || event.target.closest(".modal-close")) {

            closeQuickView();

        }

    });

    return scrim;

}

function starsMarkup(rating) {

    const full = Math.floor(rating);

    const half = rating - full >= 0.5;

    let markup = "";

    for (let i = 0; i < full; i++) {

        markup += '<i class="fas fa-star"></i>';

    }

    if (half) {

        markup += '<i class="fas fa-star-half-stroke"></i>';

    }

    return `<span class="stars">${markup}</span>`;

}

function openQuickView(productId) {

    /* products.js owns the data; bail if it isn't loaded */
    if (typeof getProductById !== "function") return;

    const product = getProductById(productId);

    if (!product) return;

    const scrim = buildModal();

    lastFocusedElement = document.activeElement;

    const image = scrim.querySelector("#quickViewImage");

    image.src = product.image;

    image.alt = product.name;

    scrim.querySelector("#quickViewCategory").textContent = product.category;

    scrim.querySelector("#quickViewTitle").textContent = product.name;

    scrim.querySelector("#quickViewRating").innerHTML =
        `${starsMarkup(product.rating)} <span>${product.rating} (${product.reviews} reviews)</span>`;

    scrim.querySelector("#quickViewPrice").textContent = `$${product.price}`;

    scrim.querySelector("#quickViewOldPrice").textContent =
        product.oldPrice ? `$${product.oldPrice}` : "";

    scrim.querySelector("#quickViewDescription").textContent =
        `${product.name} by ${product.brand} delivers premium quality, excellent performance, and modern design. One of the standout products in our ${product.category} collection.`;

    scrim.querySelector("#quickViewBrand").textContent = product.brand;

    scrim.querySelector("#quickViewSku").textContent =
        `SZ-${product.id.toString().padStart(4, "0")}`;

    scrim.querySelector("#quickViewStock").textContent =
        product.stock ? "In Stock" : "Out of Stock";

    scrim.querySelector("#quickViewAdd").dataset.id = product.id;

    scrim.querySelector("#quickViewLink").href = `product.html?id=${product.id}`;

    scrim.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => scrim.querySelector(".modal-close").focus(), 120);

}

function closeQuickView() {

    const scrim = document.querySelector(".modal-scrim");

    if (!scrim || !scrim.classList.contains("active")) return;

    scrim.classList.remove("active");

    document.body.classList.remove("no-scroll");

    if (lastFocusedElement) {

        lastFocusedElement.focus();

        lastFocusedElement = null;

    }

}

function initializeQuickView() {

    /* Capture phase so this runs before app.js's navigation handler */
    document.addEventListener("click", event => {

        const button = event.target.closest(".view-btn");

        if (!button) return;

        event.preventDefault();

        event.stopPropagation();

        openQuickView(button.dataset.id);

    }, true);

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeQuickView();

        }

    });

}


/*==================================================
                CUSTOM CURSOR
==================================================*/

function initializeCursor() {

    if (prefersReducedMotion()) return;

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = document.createElement("div");

    dot.className = "cursor-dot";

    const ring = document.createElement("div");

    ring.className = "cursor-ring";

    document.body.append(dot, ring);

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

    document.addEventListener("pointermove", event => {

        dotX = event.clientX;

        dotY = event.clientY;

        document.body.classList.add("cursor-active");

    });

    document.addEventListener("pointerleave", () => {

        document.body.classList.remove("cursor-active");

    });

    /* Ring lags the dot for a soft trailing feel */
    function render() {

        ringX += (dotX - ringX) * 0.16;

        ringY += (dotY - ringY) * 0.16;

        dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

        requestAnimationFrame(render);

    }

    render();

    const INTERACTIVE = "a, button, input, select, textarea, .product-card, .category-card, label";

    document.addEventListener("pointerover", event => {

        if (event.target.closest(INTERACTIVE)) {

            ring.classList.add("hovering");

        }

    });

    document.addEventListener("pointerout", event => {

        if (event.target.closest(INTERACTIVE)) {

            ring.classList.remove("hovering");

        }

    });

}


/*==================================================
                PAGE TRANSITIONS
==================================================*/

function initializePageTransitions() {

    if (prefersReducedMotion()) return;

    const fade = document.createElement("div");

    fade.className = "page-fade";

    document.body.appendChild(fade);

    document.addEventListener("click", event => {

        const link = event.target.closest("a");

        if (!link) return;

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey
        ) {
            return;
        }

        /* Internal navigation only */
        if (link.host !== window.location.host) return;

        event.preventDefault();

        fade.classList.add("active");

        setTimeout(() => {

            window.location.href = link.href;

        }, 220);

    });

    /* Clear the overlay when returning via the back button */
    window.addEventListener("pageshow", () => {

        fade.classList.remove("active");

    });

}


/*==================================================
                PRELOADER
==================================================*/

function initializePreloader() {

    const preloader = document.querySelector(".preloader");

    if (!preloader) return;

    /* app.js checks this flag and leaves the fade to us */
    window.shopzonePreloaderReady = true;

    function hide() {

        preloader.classList.add("done");

    }

    window.addEventListener("load", hide);

    /* Never let a stalled asset trap the page behind the loader */
    setTimeout(hide, 2200);

}


/*==================================================
                PASSWORD TOGGLE
==================================================*/

function initializePasswordToggles() {

    document.querySelectorAll(".password-field").forEach(field => {

        const input = field.querySelector("input");

        const toggle = field.querySelector(".toggle-password");

        if (!input || !toggle) return;

        toggle.addEventListener("click", () => {

            const revealed = input.type === "text";

            input.type = revealed ? "password" : "text";

            toggle.innerHTML = revealed
                ? '<i class="fas fa-eye" aria-hidden="true"></i>'
                : '<i class="fas fa-eye-slash" aria-hidden="true"></i>';

            toggle.setAttribute(
                "aria-label",
                revealed ? "Show password" : "Hide password"
            );

        });

    });

}


/*==================================================
                MARQUEE

    Duplicates the track so the -50% loop is seamless.
==================================================*/

function initializeMarquee() {

    const track = document.querySelector(".marquee-track");

    if (!track || track.dataset.cloned === "true") return;

    track.innerHTML += track.innerHTML;

    track.dataset.cloned = "true";

}


/*==================================================
                INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    drainFlash();

    initializeHeaderScroll();

    initializeDrawer();

    initializeBackToTopRing();

    initializeQuickView();

    initializePreloader();

    initializePasswordToggles();

    initializeMarquee();

    initializeParallax();

    initializeMagnetic();

    initializeRipple();

    initializeTilt();

    /* Stagger any grids already present in the markup */
    document.querySelectorAll("[data-reveal-group]").forEach(staggerGroup);

    initializeScrollReveal();

    /* Non-essential polish runs after first paint */
    onIdle(() => {

        initializeCursor();

        initializePageTransitions();

    });

});

