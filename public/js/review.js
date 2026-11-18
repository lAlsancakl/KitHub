
document.addEventListener("DOMContentLoaded", () => {

    const bookSelect = document.getElementById("reviewBook");
    const preview = document.getElementById("reviewBookPreview");
    const reviewForm = document.getElementById("reviewForm");

    const content = document.getElementById("reviewContent");
    const charCount = document.getElementById("reviewCharCount");

    // Örnek kitaplar - API bağlantısı yapılana kadar
    // test amacıyla kullanılacak.
    const savedBooks = [
        {
            id: 1,
            title: "Şüpheli",
            author: "Keigo Higashino",
            cover: "/uploads/book_cover/supheli.jpg"
        },
        {
            id: 2,
            title: "Şüpheli X",
            author: "Keigo Higashino",
            cover: "/uploads/book_cover/supheli.jpg"
        }
    ];

    // Kitapları dropdown'a ekle
    savedBooks.forEach(book => {
        const option = document.createElement("option");

        option.value = book.id;
        option.textContent = book.title;

        bookSelect.appendChild(option);
    });

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
    reviewForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const message = document.getElementById("reviewMessage");

        if (!bookSelect.value) {
            message.textContent = "Please select a book.";
            return;
        }

        const reviewData = {
            book_id: bookSelect.value,
            title: document.getElementById("reviewTitle").value,
            content: content.value,
            spoiler: document.getElementById("reviewSpoiler").checked
        };

        console.log("Review Data:", reviewData);

        message.textContent = "Your review has been created successfully!";

        reviewForm.reset();

        charCount.textContent = "0";

        preview.style.display = "none";

        setTimeout(() => {
            document.getElementById("reviewModal").classList.remove("open");
            document.body.style.overflow = "";
            message.textContent = "";
        }, 1200);

    });

});
