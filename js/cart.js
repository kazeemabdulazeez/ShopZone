/*==================================================
                LOCAL STORAGE
==================================================*/

let cart = JSON.parse(

    localStorage.getItem("shopzoneCart")

) || [];

let wishlist = JSON.parse(

    localStorage.getItem("shopzoneWishlist")

) || [];


/*==================================================
                SAVE DATA
==================================================*/

function saveCart() {

    localStorage.setItem(

        "shopzoneCart",

        JSON.stringify(cart)

    );

}

function saveWishlist() {

    localStorage.setItem(

        "shopzoneWishlist",

        JSON.stringify(wishlist)

    );

}


/*==================================================
                UPDATE BADGES
==================================================*/

function updateCartCount() {

    const badge = document.getElementById("cartCount");

    if (!badge) return;

    const total = cart.reduce(

        (sum, item) => sum + item.quantity,

        0

    );

    badge.textContent = total;

}

function updateWishlistCount() {

    const badge = document.getElementById("wishlistCount");

    if (!badge) return;

    badge.textContent = wishlist.length;

}


/*==================================================
                GET CART ITEM
==================================================*/

function getCartItem(id) {

    return cart.find(

        item => item.id === Number(id)

    );

}


/*==================================================
                CHECK WISHLIST
==================================================*/

function isInWishlist(id) {

    return wishlist.includes(Number(id));

}


/*==================================================
                INITIALIZE
==================================================*/

updateCartCount();

updateWishlistCount();


/*==================================================
                FEEDBACK

    app.js owns notify() and ui.js owns the toast
    region. Script order differs between pages, so
    this resolves whichever is present at call time
    and still works on its own.
==================================================*/

function cartNotify(title, options = {}) {

    if (typeof notify === "function") {

        notify(title, options);

        return;

    }

    if (typeof window.showToast === "function") {

        window.showToast(title, options);

        return;

    }

    alert(options.detail ? `${title} — ${options.detail}` : title);

}


/*  Every .wishlist-btn in the document reflects the
    saved wishlist, so a heart toggled on the details
    page also updates the cards behind it. */

function syncWishlistButtons() {

    document.querySelectorAll(".wishlist-btn[data-id]").forEach(button => {

        const active = isInWishlist(button.dataset.id);

        button.classList.toggle("active", active);

        button.setAttribute("aria-pressed", String(active));

        const icon = button.querySelector("i");

        if (icon) {

            icon.classList.toggle("fas", active);

            icon.classList.toggle("far", !active);

        }

    });

}

/*==================================================
                ADD TO CART
==================================================*/

function addToCart(productId, quantity = 1) {

    const product = getProductById(productId);

    if (!product) return;

    const amount = Math.max(1, parseInt(quantity, 10) || 1);

    const existingItem = getCartItem(productId);

    if (existingItem) {

        existingItem.quantity += amount;

    } else {

        cart.push({

            id: product.id,

            quantity: amount

        });

    }

    saveCart();

    updateCartCount();

    cartNotify("Added to bag", {

        detail: amount > 1

            ? `${amount} × ${product.name}`

            : product.name,

        type: "success",

        actionLabel: "View bag",

        actionHref: "cart.html"

    });

}


/*==================================================
                REMOVE FROM CART
==================================================*/

function removeFromCart(productId) {

    cart = cart.filter(item =>

        item.id !== Number(productId)

    );

    saveCart();

    updateCartCount();

    renderCart();

}


/*==================================================
            INCREASE QUANTITY
==================================================*/

function increaseQuantity(productId) {

    const item = getCartItem(productId);

    if (!item) return;

    item.quantity++;

    saveCart();

    updateCartCount();

    renderCart();

}


/*==================================================
            DECREASE QUANTITY
==================================================*/

function decreaseQuantity(productId) {

    const item = getCartItem(productId);

    if (!item) return;

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        removeFromCart(productId);

        return;

    }

    saveCart();

    updateCartCount();

    renderCart();

}


/*==================================================
                CLEAR CART
==================================================*/

function clearCart() {

    if (!confirm("Clear your shopping cart?")) return;

    cart = [];

    saveCart();

    updateCartCount();

    renderCart();

    cartNotify("Bag cleared", {

        detail: "Every item has been removed.",

        type: "info"

    });

}


/*==================================================
                EVENT LISTENERS
==================================================*/

document.addEventListener("click", (event) => {

    const addButton = event.target.closest(".add-cart");

    if (addButton) {

        addToCart(addButton.dataset.id);

    }

    const clearButton = event.target.closest("#clearCartBtn");

    if (clearButton) {

        clearCart();

    }

});

/*==================================================
                WISHLIST
==================================================*/

function toggleWishlist(productId) {

    const id = Number(productId);

    const index = wishlist.indexOf(id);

    if (index === -1) {

        wishlist.push(id);

    } else {

        wishlist.splice(index, 1);

    }

    saveWishlist();

    updateWishlistCount();

    renderWishlist();

    syncWishlistButtons();

    const product = getProductById(id);

    cartNotify(

        index === -1 ? "Saved to wishlist" : "Removed from wishlist",

        {

            detail: product ? product.name : "",

            type: index === -1 ? "success" : "info",

            actionLabel: index === -1 ? "View wishlist" : "",

            actionHref: index === -1 ? "wishlist.html" : ""

        }

    );

}


/*==================================================
                CART TOTALS
==================================================*/

function calculateCartTotals() {

    let subtotal = 0;

    cart.forEach(item => {

        const product = getProductById(item.id);

        if (product) {

            subtotal += product.price * item.quantity;

        }

    });

    const tax = subtotal * 0.075;

    const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 25;

    const total = subtotal + tax + shipping;

    return {

        subtotal,

        tax,

        shipping,

        total

    };

}


/*==================================================
                RENDER CART
==================================================*/

function renderCart() {

    const container = document.getElementById("cartItems");

    if (!container) return;

    const emptyState = document.getElementById("emptyCart");

    if (cart.length === 0) {

        container.innerHTML = "";

        if (emptyState) {

            emptyState.style.display = "block";

        }

        return;

    }

    if (emptyState) {

        emptyState.style.display = "none";

    }

    container.innerHTML = cart.map(item => {

        const product = getProductById(item.id);

        if (!product) return "";

        return `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">

                <div class="cart-info">

                    <h3>${product.name}</h3>

                    <p>$${product.price}</p>

                    <div class="cart-quantity">

                        <button class="decrease-btn" type="button" data-id="${product.id}" aria-label="Decrease quantity of ${product.name}">-</button>

                        <span>${item.quantity}</span>

                        <button class="increase-btn" type="button" data-id="${product.id}" aria-label="Increase quantity of ${product.name}">+</button>

                    </div>

                </div>

                <button class="remove-btn" type="button" data-id="${product.id}" title="Remove" aria-label="Remove ${product.name} from bag">

                    <i class="fas fa-xmark" aria-hidden="true"></i>

                </button>

            </div>
        `;

    }).join("");

    if (typeof window.revealNewContent === "function") {

        window.revealNewContent(container);

    }

    const totals = calculateCartTotals();

    document.getElementById("subtotal").textContent =
        `$${totals.subtotal.toFixed(2)}`;

    document.getElementById("shipping").textContent =
        totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`;

    document.getElementById("tax").textContent =
        `$${totals.tax.toFixed(2)}`;

    document.getElementById("total").textContent =
        `$${totals.total.toFixed(2)}`;

}


/*==================================================
                RENDER WISHLIST
==================================================*/

function renderWishlist() {

    const container = document.getElementById("wishlistContainer");

    if (!container) return;

    const emptyState = document.getElementById("emptyWishlist");

    const items = products.filter(product =>

        wishlist.includes(product.id)

    );

    if (items.length === 0) {

        container.innerHTML = "";

        if (emptyState) {

            emptyState.style.display = "block";

        }

        return;

    }

    if (emptyState) {

        emptyState.style.display = "none";

    }

    container.innerHTML = items

        .map(product => createProductCard(product))

        .join("");

    if (typeof window.revealNewContent === "function") {

        window.revealNewContent(container);

    }

}


/*==================================================
                PAGE EVENTS
==================================================*/

document.addEventListener("click", (event) => {

    const target = event.target.closest("button");

    if (!target) return;

    if (target.classList.contains("wishlist-btn")) {

        toggleWishlist(target.dataset.id);

    }

    if (target.classList.contains("remove-btn")) {

        removeFromCart(target.dataset.id);

    }

    if (target.classList.contains("increase-btn")) {

        increaseQuantity(target.dataset.id);

    }

    if (target.classList.contains("decrease-btn")) {

        decreaseQuantity(target.dataset.id);

    }

});


/*==================================================
                INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    renderCart();

    renderWishlist();

    updateCartCount();

    updateWishlistCount();

    syncWishlistButtons();

});