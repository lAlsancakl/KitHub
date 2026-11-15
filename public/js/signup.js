const form = document.querySelector("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const errorMessage = document.getElementById("username-error");

    errorMessage.textContent = "";

    const response = await fetch("/register", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (response.status === 409) {
        errorMessage.textContent = data.detail;
    } 
    else if (response.ok) {
        window.location.href = "/login/";
    }
    else {
        errorMessage.textContent = data.detail || "Registration failed.";
    }
});