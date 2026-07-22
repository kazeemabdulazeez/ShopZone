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
                ADD TO CART
==================================================*/

function addToCart(productId) {

    const product = getProductById(productId);

    if (!product) return;

    const existingItem = getCartItem(productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: product.id,

            quantity: 1

        });

    }

    saveCart();

    updateCartCount();

    alert(`${product.name} added to cart.`);

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

                <img src="${product.image}" alt="${product.name}">

                <div class="cart-info">

                    <h3>${product.name}</h3>

                    <p>$${product.price}</p>

                    <div class="cart-quantity">

                        <button class="decrease-btn" data-id="${product.id}">-</button>

                        <span>${item.quantity}</span>

                        <button class="increase-btn" data-id="${product.id}">+</button>

                    </div>

                </div>

                <button class="remove-btn" data-id="${product.id}">

                    Remove

                </button>

            </div>
        `;

    }).join("");

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

});