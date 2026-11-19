document.addEventListener("DOMContentLoaded", async () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const username = parts[0] === "profile" && parts[1] ? decodeURIComponent(parts[1]) : null;

    if (!username) return;

    const avatarEl = document.getElementById("profileAvatarImg");
    const displayNameEl = document.getElementById("profileDisplayName");
    const handleEl = document.getElementById("profileUsernameHandle");
    const joinedEl = document.getElementById("profileJoinedDate");

    try {
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`, {
            credentials: "same-origin",
            cache: "no-store"
        });

        if (!res.ok) {
            document.title = `KitHub - User Not Found`;
            if (displayNameEl) displayNameEl.textContent = "User Not Found";
            if (handleEl) handleEl.textContent = `@${username}`;
            if (joinedEl) joinedEl.textContent = "";
            if (avatarEl) avatarEl.src = "/public/images/default-profile.png";
            return;
        }

        const data = await res.json();

        document.title = `KitHub - ${data.username} (@${data.username})`;

        if (avatarEl) {
            avatarEl.src = data.profile_photo || "/public/images/default-profile.png";
            avatarEl.alt = data.username;
        }

        if (displayNameEl) {
            displayNameEl.textContent = data.username;
        }

        if (handleEl) {
            handleEl.textContent = `@${data.username}`;
        }

        if (joinedEl) {
            joinedEl.textContent = data.joined_text || "Joined recently";
        }
    } catch (err) {
        console.error("Failed to load profile:", err);
        if (displayNameEl) displayNameEl.textContent = "Error loading profile";
    }
});