/*==================================================
                ADMIN DASHBOARD
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    protectAdminPage();

    loadDashboard();

    loadAdminProducts();

    loadCustomers();

    loadOrders();

});


/*==================================================
                ADMIN CHECK
==================================================*/

function protectAdminPage() {

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    /*

        Demo Project

        Change this email if you want a different
        administrator account.

    */

    if (currentUser.email !== "admin@shopzone.com") {

        alert("Access denied.");

        window.location.href = "index.html";

    }

}


/*==================================================
                DASHBOARD
==================================================*/

function loadDashboard() {

    document.getElementById("totalProducts").textContent =

        products.length;

    const totalCustomers = users.length;

    document.getElementById("totalCustomers").textContent =

        totalCustomers;

    let orderCount = 0;

    let revenue = 0;

    users.forEach(user => {

        if (!user.orders) return;

        orderCount += user.orders.length;

        user.orders.forEach(order => {

            revenue += order.total;

        });

    });

    document.getElementById("totalOrders").textContent =

        orderCount;

    document.getElementById("totalRevenue").textContent =

        `$${revenue.toFixed(2)}`;

}


/*==================================================
                PRODUCTS
==================================================*/

function loadAdminProducts() {

    const container = document.getElementById("adminProducts");

    if (!container) return;

    container.innerHTML = products.map(product => `

        <div class="product-card">

            <img

                src="${product.image}"

                alt="${product.name}">

            <div class="product-content">

                <h3>${product.name}</h3>

                <p>${product.brand}</p>

                <strong>$${product.price}</strong>

            </div>

        </div>

    `).join("");

}

/*==================================================
                CUSTOMERS
==================================================*/

function loadCustomers() {

    const container = document.getElementById("adminCustomers");

    if (!container) return;

    if (users.length === 0) {

        container.innerHTML = `

            <p>No registered customers.</p>

        `;

        return;

    }

    container.innerHTML = users.map(user => `

        <div class="admin-card">

            <h3>${user.name}</h3>

            <p>${user.email}</p>

            <p>

                Orders:

                ${user.orders ? user.orders.length : 0}

            </p>

        </div>

    `).join("");

}


/*==================================================
                ORDERS
==================================================*/

function loadOrders() {

    const container = document.getElementById("adminOrders");

    if (!container) return;

    let orders = [];

    users.forEach(user => {

        if (user.orders) {

            user.orders.forEach(order => {

                orders.push({

                    customer: user.name,

                    ...order

                });

            });

        }

    });

    if (orders.length === 0) {

        container.innerHTML = `

            <p>No orders available.</p>

        `;

        return;

    }

    container.innerHTML = orders.map(order => `

        <div class="admin-card">

            <h3>

                Order #${order.id}

            </h3>

            <p>

                Customer:

                ${order.customer}

            </p>

            <p>

                Date:

                ${order.date}

            </p>

            <p>

                Status:

                ${order.status}

            </p>

            <strong>

                Total:

                $${order.total.toFixed(2)}

            </strong>

        </div>

    `).join("");

}


/*==================================================
                SETTINGS
==================================================*/

const settingsForm = document.getElementById("settingsForm");

if (settingsForm) {

    settingsForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Settings saved successfully.");

    });

}


/*==================================================
                ADMIN LOGOUT
==================================================*/

const adminLogout = document.getElementById("adminLogout");

if (adminLogout) {

    adminLogout.addEventListener("click", () => {

        logoutUser();

    });

}


/*==================================================
                ADD PRODUCT
==================================================*/

const addProductBtn = document.getElementById("addProductBtn");

if (addProductBtn) {

    addProductBtn.addEventListener("click", () => {

        alert(

            "Product management can be expanded in a future version."

        );

    });

}