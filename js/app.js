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

    updateCartCount();

    updateWishlistCount();

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
==================================================*/

function initializeMobileMenu() {

    const menuButton = document.querySelector(".menu-toggle");

    const mobileMenu = document.querySelector(".mobile-menu");

    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");

    });

}


/*==================================================
                BACK TO TOP
==================================================*/

function initializeBackToTop() {

    const button = document.getElementById("backToTop");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            button.style.display = "flex";

        } else {

            button.style.display = "none";

        }

    });

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

        alert("Thank you for subscribing!");

        this.reset();

    });

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

function createProductCard(product) {

    return `

        <div class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                ${product.flashSale ? `
                    <span class="product-badge">
                        Sale
                    </span>
                ` : ""}

                <div class="product-actions">

                    <button
                        class="wishlist-btn"
                        data-id="${product.id}">

                        <i class="far fa-heart"></i>

                    </button>

                    <button
                        class="view-btn"
                        data-id="${product.id}">

                        <i class="fas fa-eye"></i>

                    </button>

                </div>

            </div>

            <div class="product-content">

                <span class="product-category">

                    ${product.category}

                </span>

                <h3 class="product-title">

                    ${product.name}

                </h3>

                <div class="product-rating">

                    ⭐ ${product.rating}

                    <span>

                        (${product.reviews})

                    </span>

                </div>

                <div class="product-price">

                    <span class="current-price">

                        $${product.price}

                    </span>

                    <span class="old-price">

                        $${product.oldPrice}

                    </span>

                </div>

                <div class="product-footer">

                    <button
                        class="add-cart"
                        data-id="${product.id}">

                        Add To Cart

                    </button>

                    <a
                        href="product.html?id=${product.id}"
                        class="view-product">

                        View

                    </a>

                </div>

            </div>

        </div>

    `;

}


/*==================================================
            RENDER PRODUCTS
==================================================*/

function renderProducts(containerId, data) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = data

        .map(product => createProductCard(product))

        .join("");

}


/*==================================================
        HOME FEATURED PRODUCTS
==================================================*/

function loadHomeProducts() {

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
==================================================*/

function loadProductsPage() {

    const container = document.getElementById("productsContainer");

    if (!container) return;

    renderProducts(

        "productsContainer",

        products

    );

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

    generateSpecifications(product);

    loadRelatedProducts(product);

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

    const categoryFilter = document.getElementById("categoryFilter");

    const sortProducts = document.getElementById("sortProducts");

    if (!categoryFilter || !sortProducts) return;

    function updateProducts() {

        let filtered = filterProductsByCategory(categoryFilter.value);

        filtered = sortProductsList(filtered, sortProducts.value);

        renderProducts("productsContainer", filtered);

        updateProductCount(filtered.length);

    }

    categoryFilter.addEventListener("change", updateProducts);

    sortProducts.addEventListener("change", updateProducts);

}


/*==================================================
                SEARCH FROM URL
==================================================*/

function loadSearchResults() {

    const container = document.getElementById("productsContainer");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);

    const keyword = params.get("search");

    if (!keyword) return;

    const results = filterProductsBySearch(keyword);

    renderProducts("productsContainer", results);

    updateProductCount(results.length);

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
==================================================*/

window.addEventListener("load", () => {

    const preloader = document.querySelector(".preloader");

    if (preloader) {

        preloader.style.display = "none";

    }

});