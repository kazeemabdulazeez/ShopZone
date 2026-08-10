/*==================================================
                LOCAL STORAGE
==================================================*/

const USERS_KEY = "shopzoneUsers";
const CURRENT_USER_KEY = "shopzoneCurrentUser";

let users = JSON.parse(

    localStorage.getItem(USERS_KEY)

) || [];

let currentUser = JSON.parse(

    localStorage.getItem(CURRENT_USER_KEY)

);


/*==================================================
                SAVE USERS
==================================================*/

function saveUsers() {

    localStorage.setItem(

        USERS_KEY,

        JSON.stringify(users)

    );

}

function saveCurrentUser() {

    localStorage.setItem(

        CURRENT_USER_KEY,

        JSON.stringify(currentUser)

    );

}


/*==================================================
                FEEDBACK

    ui.js owns the toast region and app.js owns
    notify(). Script order differs between pages, so
    this resolves whichever is present at call time
    and still works on its own.

    flash() is for the messages raised immediately
    before a redirect — those are handed to the page
    being navigated to, or they never get read.
==================================================*/

function authNotify(title, options = {}) {

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

function authFlash(title, options = {}) {

    if (typeof window.flashToast === "function") {

        window.flashToast(title, options);

        return;

    }

    authNotify(title, options);

}


/*==================================================
                REGISTER
==================================================*/

function registerUser(name, email, password) {

    const exists = users.find(user =>

        user.email.toLowerCase() === email.toLowerCase()

    );

    if (exists) {

        authNotify("That email is already registered", {

            detail: "Sign in instead, or use another address.",

            type: "error",

            actionLabel: "Sign in",

            actionHref: "login.html"

        });

        return false;

    }

    const user = {

        id: Date.now(),

        name,

        email,

        password,

        orders: []

    };

    users.push(user);

    saveUsers();

    authFlash("Account created", {

        detail: `Welcome to ShopZone, ${user.name}. Sign in to start shopping.`,

        type: "success"

    });

    window.location.href = "login.html";

    return true;

}


/*==================================================
                LOGIN
==================================================*/

function loginUser(email, password) {

    const user = users.find(user =>

        user.email === email &&

        user.password === password

    );

    if (!user) {

        authNotify("We could not sign you in", {

            detail: "Check your email address and password.",

            type: "error"

        });

        return false;

    }

    currentUser = user;

    saveCurrentUser();

    authFlash(`Welcome back, ${user.name}`, {

        detail: "You are signed in.",

        type: "success"

    });

    window.location.href = "profile.html";

    return true;

}


/*==================================================
                LOGOUT
==================================================*/

function logoutUser() {

    localStorage.removeItem(CURRENT_USER_KEY);

    currentUser = null;

    authFlash("You have been signed out", {

        detail: "Your bag and wishlist are still saved.",

        type: "info"

    });

    window.location.href = "login.html";

}

/*==================================================
                LOAD PROFILE
==================================================*/

function loadProfile() {

    if (!currentUser) return;

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    const editName = document.getElementById("editName");
    const editEmail = document.getElementById("editEmail");

    if (profileName) {

        profileName.textContent = currentUser.name;

    }

    if (profileEmail) {

        profileEmail.textContent = currentUser.email;

    }

    if (editName) {

        editName.value = currentUser.name;

    }

    if (editEmail) {

        editEmail.value = currentUser.email;

    }

}


/*==================================================
                UPDATE PROFILE
==================================================*/

function updateProfile(name, email) {

    if (!currentUser) return;

    currentUser.name = name;

    currentUser.email = email;

    const index = users.findIndex(user =>

        user.id === currentUser.id

    );

    if (index !== -1) {

        users[index] = currentUser;

    }

    saveUsers();

    saveCurrentUser();

    authNotify("Profile updated", {

        detail: "Your account details have been saved.",

        type: "success"

    });

    loadProfile();

}


/*==================================================
                ROUTE PROTECTION
==================================================*/

function protectProfilePage() {

    if (

        window.location.pathname.includes("profile.html") &&

        !currentUser

    ) {

        /*  The bounce used to be silent, which reads as a
            broken link rather than a locked page. */

        authFlash("Sign in to view your profile", {

            detail: "Your account area is private.",

            type: "info"

        });

        window.location.href = "login.html";

    }

}


/*==================================================
                REGISTER FORM
==================================================*/

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();

        const email = document.getElementById("registerEmail").value.trim();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            authNotify("Those passwords do not match", {

                detail: "Re-enter your confirmation password.",

                type: "error"

            });

            /*  Without the blocking dialog the form stays
                live, so put the cursor where the fix is. */

            const confirmField = document.getElementById("confirmPassword");

            if (confirmField) {

                confirmField.value = "";

                confirmField.focus();

            }

            return;

        }

        registerUser(name, email, password);

    });

}


/*==================================================
                LOGIN FORM
==================================================*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();

        const password = document.getElementById("loginPassword").value;

        loginUser(email, password);

    });

}


/*==================================================
                PROFILE FORM
==================================================*/

const profileForm = document.getElementById("profileForm");

if (profileForm) {

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        updateProfile(

            document.getElementById("editName").value.trim(),

            document.getElementById("editEmail").value.trim()

        );

    });

}


/*==================================================
                LOGOUT BUTTON
==================================================*/

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", logoutUser);

}


/*==================================================
                INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    protectProfilePage();

    loadProfile();

});