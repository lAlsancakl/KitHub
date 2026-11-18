
document.addEventListener("DOMContentLoaded", async () => {

    const guestMenu = document.getElementById("guestMenu");
    const userMenu = document.getElementById("userMenu");
    const profilePhoto = document.getElementById("sidebarProfilePhoto");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!guestMenu || !userMenu) return;

    guestMenu.hidden = true;
    userMenu.hidden = true;

    try {
        const response = await fetch("/me", {
            credentials: "same-origin",
            cache: "no-store"
        });

        if (response.ok) {
            const user = await response.json();

            if (profilePhoto && user.profile_photo) {
                profilePhoto.src = "/" + user.profile_photo.replace(/^\/+/, "");
}

            userMenu.hidden = false;

        } else {
            guestMenu.hidden = false;
        }

    } catch (error) {
        console.error("Session check failed:", error);
        guestMenu.hidden = false;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const confirmLogout = confirm(
    "Are you sure you want to log out?"
);

if (!confirmLogout) {
    return;
}

            try {
                const response = await fetch("/logout", {
                    method: "POST",
                    credentials: "same-origin"
                });

                if (response.ok) {
                    window.location.href = "/";
                } else {
                    alert("Logout failed.");
                }

            } catch (error) {
                console.error(error);
                alert("Cannot connect to the server.");
            }
        });
    }
});
