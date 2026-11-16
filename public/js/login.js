
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    loginError.textContent = "";

    const formData = new FormData(loginForm);

    try {
        const response = await fetch("/login", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = "/";
        } else {
            loginError.textContent =
                result.detail || "Invalid username or password.";
        }

    } catch (error) {
        loginError.textContent =
            "Cannot connect to the server.";

        console.error(error);
    }
});
