document.addEventListener("DOMContentLoaded", async () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const username = parts[0] === "profile" && parts[1]
        ? decodeURIComponent(parts[1])
        : null;

    if (!username) return;

    const bannerEl = document.getElementById("profileBannerImg");
    const editBannerBtn = document.getElementById("editProfileBannerBtn");
    const bannerInputEl = document.getElementById("bannerFileInput");

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

let isOwner = false;

const statusLabels = {
    want_to_read: "Want to Read",
    reading: "Currently Reading",
    finished: "Finished",
    dropped: "Dropped"
};

function createEditModal() {
    if (document.getElementById("editReadingModal")) return;

    document.body.insertAdjacentHTML("beforeend", `
        <div id="editReadingModal" class="reading-edit-overlay">
            <div class="reading-edit-modal">
                <div class="reading-edit-header">
                    <h3>Edit Book</h3>
                    <button type="button" id="closeReadingModal">&times;</button>
                </div>

                <form id="editReadingForm">
                    <input type="hidden" id="editUserBookId">

                    <div class="reading-edit-group">
                        <label for="editBookStatus">Reading Status</label>
                        <select id="editBookStatus" required>
                            <option value="want_to_read">Want to Read</option>
                            <option value="reading">Currently Reading</option>
                            <option value="finished">Finished</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>

                    <div class="reading-edit-group">
                        <label for="editCurrentPage">Current Page</label>
                        <input type="number" id="editCurrentPage" min="0" required>
                    </div>

                    <div class="reading-edit-group">
                        <label for="editReadingDays">Reading Duration (days)</label>
                        <input type="number" id="editReadingDays" min="1">
                    </div>

                    <div class="reading-edit-actions">
                        <button type="button" id="cancelReadingEdit">Cancel</button>
                        <button type="submit" id="saveReadingEdit">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `);

    const modal = document.getElementById("editReadingModal");

    document.getElementById("closeReadingModal").addEventListener("click", closeEditModal);
    document.getElementById("cancelReadingEdit").addEventListener("click", closeEditModal);

    document.getElementById("editBookStatus").addEventListener("change", updateEditFields);

    document.getElementById("editReadingForm").addEventListener("submit", saveReadingChanges);
}

function openEditModal(book) {
    if (!book.user_book_id) {
        alert("Book record could not be found.");
        return;
    }

    createEditModal();

    document.getElementById("editUserBookId").value = book.user_book_id;
    document.getElementById("editBookStatus").value = book.status || "reading";
    document.getElementById("editCurrentPage").value = book.current_page ?? 0;
    document.getElementById("editReadingDays").value = book.reading_days ?? "";

    document.getElementById("editReadingModal").classList.add("active");

    updateEditFields();
}

function closeEditModal() {
    document.getElementById("editReadingModal")?.classList.remove("active");
}

function updateEditFields() {
    const status = document.getElementById("editBookStatus").value;
    const pageInput = document.getElementById("editCurrentPage");
    const daysInput = document.getElementById("editReadingDays");

    if (status === "finished") {
        daysInput.required = true;
        daysInput.disabled = false;
    } else {
        daysInput.required = false;
        daysInput.disabled = status !== "reading";
    }

    pageInput.disabled = status === "finished" ||
        status === "want_to_read" ||
        status === "dropped";
}

async function saveReadingChanges(event) {
    event.preventDefault();

    const userBookId = document.getElementById("editUserBookId").value;
    const status = document.getElementById("editBookStatus").value;
    const currentPage = Number(document.getElementById("editCurrentPage").value);
    const readingDaysValue = document.getElementById("editReadingDays").value;

    const payload = {
        status: status,
        current_page: currentPage
    };

    if (readingDaysValue !== "") {
        payload.reading_days = Number(readingDaysValue);
    }

    if (status === "finished" && (!payload.reading_days || payload.reading_days < 1)) {
        alert("Please enter how many days it took to finish the book.");
        return;
    }

    const saveButton = document.getElementById("saveReadingEdit");
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        const response = await fetch(`/api/user-books/${userBookId}`, {
            method: "PATCH",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Book could not be updated.");
        }

        closeEditModal();
        window.location.reload();

    } catch (error) {
        alert(error.message);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Changes";
    }
}

    function normalizeMediaUrl(url, fallback) {
        if (!url) return fallback;
        return url.startsWith("/") ? url : `/${url}`;
    }

    function getCover(url) {
        return normalizeMediaUrl(url, "/public/images/default-profile.png");
    }

    function setBannerImage(url, bustCache = false) {
        if (!bannerEl) return;
        const cleanUrl = normalizeMediaUrl(url, "/public/images/background.jpg");
        bannerEl.src = bustCache ? `${cleanUrl}?t=${Date.now()}` : cleanUrl;
        bannerEl.alt = `${username} Banner`;
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

                    ${isOwner ? `
                        <button
                            type="button"
                            class="edit-reading-btn"
                            data-book='${escapeHTML(JSON.stringify(book))}'>
                            Edit
                        </button>
                    ` : ""}
                </div>
            </div>
        `);
    });

    readingGrid.querySelectorAll(".edit-reading-btn").forEach(button => {
        button.addEventListener("click", () => {
            openEditModal(JSON.parse(button.dataset.book));
        });
    });
}


    function renderActivities(activities, profileUsername, profilePhoto) {
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
                            <span class="user-name">${escapeHTML(profileUsername)}</span>
                            <span class="post-info-text">@${escapeHTML(profileUsername)}</span>
                        </div>
                    </div>

                    ${isReview ? "" : `
                        <div class="post-action-desc">
                            <strong>${escapeHTML(profileUsername)}</strong>
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

                    ${!isReview && isOwner && post.user_book_id ? `
                        <button
                            type="button"
                            class="edit-reading-btn activity-edit-btn"
                            data-book='${escapeHTML(JSON.stringify({
                                user_book_id: post.user_book_id,
                                status: post.status,
                                current_page: post.current_page,
                                reading_days: post.reading_days
                            }))}'>
                            Edit
                        </button>
                    ` : ""}
                    </div>
                </article>
            `);
        });
    }
    activityList.querySelectorAll(".activity-edit-btn").forEach(button => {
        button.addEventListener("click", () => {
            openEditModal(JSON.parse(button.dataset.book));
        });
    });
    if (editBannerBtn && bannerInputEl) {
        editBannerBtn.addEventListener("click", () => {
            bannerInputEl.click();
        });

        bannerInputEl.addEventListener("change", async () => {
            const file = bannerInputEl.files && bannerInputEl.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("banner_photo", file);

            const originalText = editBannerBtn.textContent;
            editBannerBtn.disabled = true;
            editBannerBtn.textContent = "Uploading...";

            try {
                const uploadRes = await fetch(
                    `/api/profile/${encodeURIComponent(username)}/banner`,
                    {
                        method: "POST",
                        credentials: "same-origin",
                        body: formData
                    }
                );

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    throw new Error(uploadData.detail || uploadData.message || "Banner upload failed");
                }

                const savedBanner = uploadData.banner_photo || uploadData.banner_url;
                setBannerImage(savedBanner, true);
            } catch (err) {
                console.error("Banner upload error:", err);
                alert(err.message || "Arka plan resmi güncellenemedi.");
            } finally {
                editBannerBtn.disabled = false;
                editBannerBtn.textContent = originalText;
                bannerInputEl.value = "";
            }
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
            setBannerImage("/public/images/background.jpg", false);
            return;
        }

        const data = await res.json();
        
        const meResponse = await fetch("/me", {
            credentials: "same-origin"
        });
        
        if (meResponse.ok) {
            const me = await meResponse.json();
            isOwner = String(me.user_id) === String(data.user_id);
        }
        
        document.title = `KitHub - ${data.username} (@${data.username})`;

        if (avatarEl) {
            avatarEl.src = normalizeMediaUrl(data.profile_photo, "/public/images/default-profile.png");
            avatarEl.alt = data.username;
        }

        setBannerImage(data.banner_photo, false);

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