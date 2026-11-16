
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
});
