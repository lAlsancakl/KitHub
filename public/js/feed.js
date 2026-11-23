
const feedContainer = document.getElementById("feedContainer");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
}

function getStatusText(status) {
    const statuses = {
        want_to_read: "Want to Read",
        reading: "Currently Reading",
        finished: "Completed",
        dropped: "Dropped"
    };

    return statuses[status] || status;
}

function getBookBadge(post) {
    if (post.type === "review") {
        return {
            text: "Reviewed",
            className: "badge-reviewed"
        };
    }

    if (post.status === "finished") {
        return {
            text: "Read",
            className: "badge-read"
        };
    }

    return {
        text: getStatusText(post.status),
        className: "badge-status"
    };
}

function getReadingDescription(status) {
    const descriptions = {
        want_to_read: "added a book to their reading list",
        reading: "started reading a book",
        finished: "finished reading a book",
        dropped: "stopped reading a book"
    };

    return descriptions[status] || "updated their reading activity";
}

function renderPost(post) {
    const username = escapeHTML(post.user.username);
    const profilePhoto = escapeHTML(
        post.user.profile_photo || "/public/images/default-profile.png"
    );

    const bookTitle = escapeHTML(post.book.title);
    const author = escapeHTML(post.book.author || "");
    const cover = escapeHTML(post.book.cover || "");
    const pageCount = post.book.page_count;
    const date = formatDate(post.created_at);

    const header = `
        <div class="post-header">
            <img src="${profilePhoto}"
                alt="Avatar"
                class="user-avatar"
                onerror="this.src='/public/images/default-profile.png'">

            <div class="user-meta">
                <span class="user-name">${username}</span>
                <span class="post-info-text">${date}</span>
            </div>
        </div>
    `;

    
const badge = getBookBadge(post);

    const bookCard = `
        <div class="book-card-embedded">
            <div class="book-cover-container">
                <img src="${cover}"
                    alt="${bookTitle}"
                    class="book-cover-img">
            </div>
    
            <div class="book-details">
                <h3 class="book-title">${bookTitle}</h3>
                <p class="book-author">${author}</p>
    
                <span class="badge-status ${badge.className}">
                    ${escapeHTML(badge.text)}
                </span>
            </div>
        </div>
`;


if (post.type === "reading") {

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

    let stats = `
        <span class="stat-item">
            ${pageIcon}${pageCount} pages
        </span>

        <span class="stat-item">
            ${post.status === "finished" ? checkIcon : clockIcon}${escapeHTML(getStatusText(post.status))}
        </span>
    `;

    if (post.status === "reading" && post.current_page) {
        stats += `
            <span class="stat-item">
                ${pageIcon}Page ${post.current_page} of ${pageCount}
            </span>
        `;
    }

    if (post.status === "finished" && post.reading_days) {
        stats += `
            <span class="stat-item">
                ${clockIcon}Read in ${post.reading_days} days
            </span>
        `;
    }

    if (date) {
        stats += `
            <span class="stat-item">
                ${escapeHTML(date)}
            </span>
        `;
    }

        return `
            <article class="post-card">
                ${header}

                <div class="post-action-desc">
                    <strong>${username}</strong>
                    ${escapeHTML(getReadingDescription(post.status))}
                </div>

                <div class="book-stats-bar">
                    ${stats}
                </div>

                ${bookCard}
            </article>
        `;
    }

    if (post.type === "review") {
        const spoilerWarning = post.spoiler
            ? "<p><strong>This review contains spoilers!</strong></p>"
            : "";
        const clockIcon = `
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    `;
    
        return `
            <article class="post-card">
                ${header}

                <div class="book-stats-bar">
                    <span class="stat-item">${pageCount} pages</span>
                    <span class="stat-item">${clockIcon}Read in ${post.reading_days} days</span>
                    <span class="stat-item">${escapeHTML(date)}</span>
                </div>

                <div class="post-text-content">
                    ${spoilerWarning}
                    <h3>${escapeHTML(post.post_title)}</h3>
                    <p>${escapeHTML(post.content)}</p>
                </div>

                ${bookCard}
            </article>
        `;
    }

    return "";
}

async function loadFeed() {
    if (!feedContainer) return;

    try {
        const response = await fetch("/api/feed", {
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error("Failed to load feed.");
        }

        const posts = await response.json();

        if (!posts.length) {
            feedContainer.innerHTML = `
                <p class="feed-empty">
                    No posts yet. Be the first to share a reading activity!
                </p>
            `;
            return;
        }

        feedContainer.innerHTML = posts.map(renderPost).join("");

    } catch (error) {
        console.error("Feed error:", error);

        feedContainer.innerHTML = `
            <p class="feed-error">
                Could not load posts. Please try again later.
            </p>
        `;
    }
}

window.loadFeed = loadFeed;

document.addEventListener("DOMContentLoaded", loadFeed);
