
document.addEventListener('DOMContentLoaded', () => {
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostMenu = document.getElementById('createPostMenu');

    const openReviewModalBtn = document.getElementById('openReviewModalBtn');
    const openReadModalBtn = document.getElementById('openReadModalBtn');

    const reviewModal = document.getElementById('reviewModal');
    const readModal = document.getElementById('readModal');

    // Modal açma fonksiyonu
    function openModal(modal) {
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    // Modal kapatma fonksiyonu
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('open');
        }

        if (
            !reviewModal?.classList.contains('open') &&
            !readModal?.classList.contains('open')
        ) {
            document.body.style.overflow = '';
        }
    }

    // Create Post menüsünü açıp kapat
    createPostBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        createPostMenu?.classList.toggle('open');
    });

    // Menü dışına tıklanınca menüyü kapat
    document.addEventListener('click', (e) => {
        if (
            createPostMenu &&
            !createPostMenu.contains(e.target) &&
            e.target !== createPostBtn
        ) {
            createPostMenu.classList.remove('open');
        }
    });

    // Create a Review modalını aç
    openReviewModalBtn?.addEventListener('click', () => {
        createPostMenu?.classList.remove('open');
        openModal(reviewModal);
    });

    // Save a Reading modalını aç
    openReadModalBtn?.addEventListener('click', () => {
        createPostMenu?.classList.remove('open');
        openModal(readModal);
    });

    // data-close özelliğine sahip butonlarla modalları kapat
    document.querySelectorAll('[data-close]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            const modal = document.getElementById(modalId);
            closeModal(modal);
        });
    });

    // Modalın dışındaki alana tıklanınca kapat
    [reviewModal, readModal].forEach((modal) => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // ESC tuşuyla menüyü ve modalları kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            createPostMenu?.classList.remove('open');
            closeModal(reviewModal);
            closeModal(readModal);
        }
    });

    // Save a Reading formunu backend'e gönder
    const readingForm = readModal?.querySelector('#readingForm');
    const readingMessage = readModal?.querySelector('#readingMessage');

    const readingStatus = readingForm?.querySelector('[name="readingStatus"]');
    const currentPageGroup = readingForm?.querySelector('#currentPageGroup');
    const durationGroup = readingForm?.querySelector('#durationGroup');

    readingStatus?.addEventListener('change', () => {
        if (currentPageGroup) {
            currentPageGroup.style.display =
                readingStatus.value === 'reading' ? 'block' : 'none';
        }

        if (durationGroup) {
            durationGroup.style.display =
                readingStatus.value === 'finished' ? 'block' : 'none';
        }
    });

    readingForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submittedForm = e.currentTarget;
        const formData = new FormData(submittedForm);

        if (!formData.get('currentPage')) {
            formData.delete('currentPage');
        }

        if (!formData.get('readingDuration')) {
            formData.delete('readingDuration');
        }

        console.log("Sending form data:", [...formData.entries()].map(([key, value]) => [
            key,
            value instanceof File ? value.name : value
        ]));

        try {
            const response = await fetch('/save-reading', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            const result = await response.json();

            console.log("Response status:", response.status);
            console.log("Server response:", result);

            if (!response.ok) {
                throw new Error(
                    typeof result.detail === 'string'
                        ? result.detail
                        : JSON.stringify(result.detail, null, 2)
                );
            }

            readingMessage.textContent = "Your reading is saved!";
            readingMessage.style.display = "block";
            readingMessage.style.color = "green";
            readingMessage.style.padding = "10px";

            submittedForm.reset();

            if (currentPageGroup) {
                currentPageGroup.style.display = 'none';
            }

            if (durationGroup) {
                durationGroup.style.display = 'none';
            }

        } catch (error) {
            readingMessage.textContent = error.message;
            readingMessage.style.color = "red";
            readingMessage.style.display = "block";
        }
    });
});
