document.addEventListener("DOMContentLoaded", () => {

    const bookSelect = document.getElementById("reviewBook");
    const preview = document.getElementById("reviewBookPreview");
    const reviewForm = document.getElementById("reviewForm");

    const content = document.getElementById("reviewContent");
    const charCount = document.getElementById("reviewCharCount");

    let savedBooks = [];

    async function loadReviewBooks() {
        const message = document.getElementById("reviewMessage");

        bookSelect.innerHTML =
            '<option value="">Select a book</option>';

        bookSelect.disabled = true;
        preview.style.display = "none";

        savedBooks = [];

        try {
            const response = await fetch("/api/review-books", {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store"
            });

            if (response.status === 401) {
                throw new Error("Please log in first.");
            }

            if (!response.ok) {
                throw new Error("Could not load your books.");
            }

            savedBooks = await response.json();

            if (savedBooks.length === 0) {
                message.textContent =
                    "You have no finished books yet.";
                return;
            }

            message.textContent = "";

            savedBooks.forEach(book => {
                const option = document.createElement("option");

                option.value = book.id;
                option.textContent = book.title;

                bookSelect.appendChild(option);
            });

            bookSelect.disabled = false;

        } catch (error) {
            console.error("Review books error:", error);
            message.textContent = error.message;
        }
    }

    loadReviewBooks();

    // Kitap seçildiğinde bilgilerini göster
    bookSelect.addEventListener("change", () => {

        const book = savedBooks.find(
            item => item.id == bookSelect.value
        );

        if (book) {
            document.getElementById("reviewCover").src = book.cover;
            document.getElementById("reviewBookTitle").textContent = book.title;
            document.getElementById("reviewBookAuthor").textContent = book.author;

            preview.style.display = "flex";
        } else {
            preview.style.display = "none";
        }
    });

    // Karakter sayacı
    content.addEventListener("input", () => {
        charCount.textContent = content.value.length;
    });

    // Form gönderimi (şimdilik sadece frontend)

    // Review'u backend'e gönderiyoruz
    reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = document.getElementById("reviewMessage");

        if (!bookSelect.value) {
            message.textContent = "Please select a book.";
            return;
        }

        const reviewData = {
            book_id: Number(bookSelect.value),
            title: document.getElementById("reviewTitle").value,
            content: content.value,
            spoiler: document.getElementById("reviewSpoiler").checked
        };

        message.textContent = "Submitting review...";

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify(reviewData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof result.detail === "string"
                        ? result.detail
                        : "Could not save review."
                );
            }

            message.textContent = "Review created successfully!";

            reviewForm.reset();
            charCount.textContent = "0";
            preview.style.display = "none";

            setTimeout(() => {
                document.getElementById("reviewModal")
                    .classList.remove("open");

                document.body.style.overflow = "";
                message.textContent = "";
            }, 1200);

        } catch (error) {
            console.error("Review error:", error);
            message.textContent = error.message;
        }
    });

});
