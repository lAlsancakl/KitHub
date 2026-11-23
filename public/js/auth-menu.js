document.addEventListener("DOMContentLoaded", async () => {
    const guestMenu = document.getElementById("guestMenu");
    const userMenu = document.getElementById("userMenu");
    const profilePhoto = document.getElementById("sidebarProfilePhoto");
    const profileLink = document.getElementById("sidebarProfileLink") || userMenu?.querySelector('a[href^="/profile"]');
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

            if (profilePhoto) {
                if (user.profile_photo) {
                    profilePhoto.src = "/" + String(user.profile_photo).replace(/^\/+/, "");
                } else {
                    profilePhoto.src = "/public/images/default-profile.png";
                }
                if (user.username) {
                    profilePhoto.alt = user.username;
                }
            }

            if (profileLink && user.username) {
                profileLink.href = `/profile/${encodeURIComponent(user.username)}`;
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
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                const response = await fetch("/logout", {
                    method: "POST",
                    credentials: "same-origin"
                });

                if (response.ok) {
                    window.location.href = "/";
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
});