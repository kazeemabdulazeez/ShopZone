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
                REGISTER
==================================================*/

function registerUser(name, email, password) {

    const exists = users.find(user =>

        user.email.toLowerCase() === email.toLowerCase()

    );

    if (exists) {

        alert("Email already exists.");

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

    alert("Registration successful.");

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

        alert("Invalid email or password.");

        return false;

    }

    currentUser = user;

    saveCurrentUser();

    alert(`Welcome ${user.name}!`);

    window.location.href = "profile.html";

    return true;

}


/*==================================================
                LOGOUT
==================================================*/

function logoutUser() {

    localStorage.removeItem(CURRENT_USER_KEY);

    currentUser = null;

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

    alert("Profile updated successfully.");

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

            alert("Passwords do not match.");

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