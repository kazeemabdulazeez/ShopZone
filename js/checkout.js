/*==================================================
                FEEDBACK

    Same resolution chain the rest of the project
    uses: notify() if app.js is loaded, the toast
    region if only ui.js is, alert() otherwise.
==================================================*/

function checkoutNotify(title, options = {}) {

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

function checkoutFlash(title, options = {}) {

    if (typeof window.flashToast === "function") {

        window.flashToast(title, options);

        return;

    }

    checkoutNotify(title, options);

}


/*==================================================
                LOAD CHECKOUT
==================================================*/

function loadCheckout() {

    const container = document.getElementById("checkoutItems");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `

            <p>Your cart is empty.</p>

        `;

        return;

    }

    container.innerHTML = cart.map(item => {

        const product = getProductById(item.id);

        if (!product) return "";

        return `

            <div class="checkout-item">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                <div>

                    <h4>

                        ${product.name}

                    </h4>

                    <p>

                        Quantity: ${item.quantity}

                    </p>

                </div>

                <strong>

                    $${(product.price * item.quantity).toFixed(2)}

                </strong>

            </div>

        `;

    }).join("");

    updateCheckoutSummary();

}


/*==================================================
                SUMMARY
==================================================*/

function updateCheckoutSummary() {

    const totals = calculateCartTotals();

    const subtotal = document.getElementById("checkoutSubtotal");
    const shipping = document.getElementById("checkoutShipping");
    const tax = document.getElementById("checkoutTax");
    const total = document.getElementById("checkoutTotal");

    if (subtotal) {

        subtotal.textContent = `$${totals.subtotal.toFixed(2)}`;

    }

    if (shipping) {

        shipping.textContent =

            totals.shipping === 0

                ? "Free"

                : `$${totals.shipping.toFixed(2)}`;

    }

    if (tax) {

        tax.textContent = `$${totals.tax.toFixed(2)}`;

    }

    if (total) {

        total.textContent = `$${totals.total.toFixed(2)}`;

    }

}


/*==================================================
                VALIDATION
==================================================*/

function validateCheckoutForm() {

    const form = document.getElementById("checkoutForm");

    if (!form) return false;

    return form.reportValidity();

}

/*==================================================
                PLACE ORDER
==================================================*/

function placeOrder() {

    if (!currentUser) {

        checkoutFlash("Sign in to place your order", {

            detail: "Your bag is saved and waiting.",

            type: "info"

        });

        window.location.href = "login.html";

        return;

    }

    if (cart.length === 0) {

        checkoutNotify("Your bag is empty", {

            detail: "Add something before checking out.",

            type: "error",

            actionLabel: "Browse products",

            actionHref: "products.html"

        });

        return;

    }

    if (!validateCheckoutForm()) return;

    const totals = calculateCartTotals();

    const order = {

        id: Date.now(),

        date: new Date().toLocaleString(),

        items: [...cart],

        subtotal: totals.subtotal,

        shipping: totals.shipping,

        tax: totals.tax,

        total: totals.total,

        status: "Processing"

    };

    if (!currentUser.orders) {

        currentUser.orders = [];

    }

    currentUser.orders.push(order);

    const userIndex = users.findIndex(user =>

        user.id === currentUser.id

    );

    if (userIndex !== -1) {

        users[userIndex] = currentUser;

    }

    saveUsers();

    saveCurrentUser();

    cart = [];

    saveCart();

    updateCartCount();

    checkoutFlash("Order confirmed", {

        detail: `Order #${order.id} — $${order.total.toFixed(2)}. A receipt is on its way.`,

        type: "success"

    });

    window.location.href = "profile.html";

}


/*==================================================
                ORDER HISTORY
==================================================*/

function renderOrderHistory() {

    const container = document.getElementById("ordersContainer");

    if (!container) return;

    if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>No Orders Yet</h3>

                <p>Your order history will appear here.</p>

            </div>

        `;

        return;

    }

    container.innerHTML = currentUser.orders.map(order => `

        <div class="order-card">

            <div class="order-header">

                <h3>Order #${order.id}</h3>

                <span>${order.status}</span>

            </div>

            <p><strong>Date:</strong> ${order.date}</p>

            <p><strong>Items:</strong> ${order.items.length}</p>

            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>

        </div>

    `).join("");

}


/*==================================================
                CHECKOUT FORM
==================================================*/

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        placeOrder();

    });

}


/*==================================================
                PLACE ORDER BUTTON

    The button lives in the order summary, which sits
    outside the form, so submitting the form never
    reaches it and the form has no submit control of
    its own. It has to be bound directly.
==================================================*/

const placeOrderButton = document.getElementById("placeOrderBtn");

if (placeOrderButton) {

    placeOrderButton.addEventListener("click", function (event) {

        event.preventDefault();

        placeOrder();

    });

}


/*==================================================
                INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadCheckout();

    renderOrderHistory();

});