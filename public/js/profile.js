
document.addEventListener("DOMContentLoaded", async () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const username = parts[0] === "profile" && parts[1]
        ? decodeURIComponent(parts[1])
        : null;

    if (!username) return;

    const avatarEl = document.getElementById("profileAvatarImg");
    const displayNameEl = document.getElementById("profileDisplayName");
    const handleEl = document.getElementById("profileUsernameHandle");
    const joinedEl = document.getElementById("profileJoinedDate");

    const readingGrid = document.querySelector(".currently-reading-grid");
    const activityList = document.querySelector(".profile-activity-list");

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function getCover(url) {
        return url || "/public/images/default-profile.png";
    }

    function updateTabs(booksRead, reviewsCount) {
        const reviewsTab = document.querySelector('.profile-tab[data-tab="reviews"]');
        const booksTab = document.querySelector('.profile-tab[data-tab="read-books"]');

        if (reviewsTab) reviewsTab.textContent = `Reviews (${reviewsCount})`;
        if (booksTab) booksTab.textContent = `Books Read (${booksRead})`;
    }

    function renderCurrentlyReading(books) {
        if (!readingGrid) return;

        readingGrid.innerHTML = "";

        if (!books.length) {
            readingGrid.textContent = "No books currently being read.";
            return;
        }

        books.forEach(book => {
            const currentPage = Number(book.current_page) || 0;
            const totalPages = Number(book.page_count) || 0;
            const progress = totalPages > 0
                ? Math.min(100, Math.max(0, currentPage / totalPages * 100))
                : 0;

            readingGrid.insertAdjacentHTML("beforeend", `
                <div class="reading-book-card">
                    <img src="${escapeHTML(getCover(book.cover))}"
                         alt="${escapeHTML(book.title)}"
                         class="reading-book-cover">

                    <div class="reading-book-info">
                        <span class="reading-book-title">
                            ${escapeHTML(book.title)}
                        </span>

                        <span class="reading-page-text">
                            ${currentPage} / ${totalPages} pages
                        </span>

                        <div class="reading-progress-track">
                            <div class="reading-progress-fill"
                                 style="width: ${progress}%;">
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    function renderActivities(activities, username, profilePhoto) {
        if (!activityList) return;

        activityList.innerHTML = "";

        if (!activities.length) {
            activityList.textContent = "No activities yet.";
            return;
        }

        activities.forEach(post => {
            const isReview = post.type === "review";
            const type = isReview ? "reviews" : "read-books";

            const title = escapeHTML(post.book_title);
            const author = escapeHTML(post.author);
            const cover = escapeHTML(getCover(post.cover));
            const content = escapeHTML(post.content);
            const postTitle = escapeHTML(post.title);
            const pages = Number(post.page_count) || 0;
            const readingDays = Number(post.reading_days) || 0;
            const currentPage = Number(post.current_page) || 0;

            
let stats = "";

const pageIcon = `
    <svg class="stat-icon" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
`;

const clockIcon = `
    <svg class="stat-icon" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>
`;

const checkIcon = `
    <svg class="stat-icon" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
`;

if (isReview) {
    stats = `
        <span class="stat-item">${pageIcon}${pages} pages</span>
        ${readingDays ? `<span class="stat-item">${clockIcon}Read in ${readingDays} days</span>` : ""}
    `;
} else {
    stats = `
        <span class="stat-item">${pageIcon}${pages} pages</span>
        <span class="stat-item">${post.status === "finished" ? checkIcon : clockIcon}${escapeHTML(post.status || "Reading")}</span>
        ${readingDays ? `<span class="stat-item">${clockIcon}Read in ${readingDays} days</span>` : ""}
        ${post.status === "reading" ? `<span class="stat-item">${pageIcon}Page ${currentPage}</span>` : ""}
    `;
}


            activityList.insertAdjacentHTML("beforeend", `
                <article class="post-card" data-type="${type}">
                    <div class="post-header">
                        <img src="${escapeHTML(getCover(profilePhoto))}"
                             alt="Avatar"
                             class="user-avatar">

                        <div class="user-meta">
                            <span class="user-name">${escapeHTML(username)}</span>
                            <span class="post-info-text">@${escapeHTML(username)}</span>
                        </div>
                    </div>

                    ${isReview ? "" : `
                        <div class="post-action-desc">
                            <strong>${escapeHTML(username)}</strong>
                            ${post.status === "finished" ? "finished reading a book" : "updated reading progress"}
                        </div>
                    `}

                    <div class="book-stats-bar">
                        ${stats}
                    </div>

                    ${isReview ? `
                        <div class="post-text-content">
                            ${postTitle ? `<p><strong>${postTitle}</strong></p>` : ""}
                            ${post.spoiler ? "<p><strong>This review contains spoilers.</strong></p>" : ""}
                            <p>${content}</p>
                        </div>
                    ` : ""}

                    <div class="book-card-embedded">
                        <div class="book-cover-container">
                            <img src="${cover}"
                                 alt="${title}"
                                 class="book-cover-img">
                        </div>

                        <div class="book-details">
                            <h3 class="book-title">${title}</h3>
                            <p class="book-author">${author}</p>
                            <span class="badge-status">
                                ${isReview ? "Reviewed" : escapeHTML(post.status || "Reading")}
                            </span>
                        </div>
                    </div>
                </article>
            `);
        });
    }

    try {
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`, {
            credentials: "same-origin",
            cache: "no-store"
        });

        if (!res.ok) {
            document.title = "KitHub - User Not Found";
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

        if (displayNameEl) displayNameEl.textContent = data.username;
        if (handleEl) handleEl.textContent = `@${data.username}`;
        if (joinedEl) joinedEl.textContent = data.joined_text || "Joined recently";

        const booksRead = data.books_read || 0;
        const reviewsCount = data.reviews_count || 0;

        const countItems = document.querySelectorAll(".profile-counts-bar .count-item");

        if (countItems[0]) {
            countItems[0].innerHTML = `<strong>${booksRead}</strong> Books Read`;
        }

        if (countItems[1]) {
            countItems[1].innerHTML = `<strong>${reviewsCount}</strong> Reviews`;
        }

        updateTabs(booksRead, reviewsCount);

        renderCurrentlyReading(data.currently_reading || []);

        renderActivities(
            data.activities || [],
            data.username,
            data.profile_photo
        );

    } catch (err) {
        console.error("Failed to load profile:", err);
        if (displayNameEl) displayNameEl.textContent = "Error loading profile";
    }

    document.querySelectorAll(".profile-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".profile-tab").forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            const filter = tab.dataset.tab;

            document.querySelectorAll(".profile-activity-list .post-card").forEach(card => {
                card.style.display =
                    filter === "all" || card.dataset.type === filter
                        ? "block"
                        : "none";
            });
        });
    });
});
