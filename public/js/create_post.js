document.addEventListener('DOMContentLoaded', () => {
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostMenu = document.getElementById('createPostMenu');
    
    const openReviewModalBtn = document.getElementById('openReviewModalBtn');
    const openReadModalBtn = document.getElementById('openReadModalBtn');
    
    const reviewModal = document.getElementById('reviewModal');
    const readModal = document.getElementById('readModal');

    // 1. "Create Post" butonuna basınca menüyü aç/kapat
    createPostBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        createPostMenu.classList.toggle('open');
    });

    // 2. Sayfada başka bir yere tıklanınca menüyü kapat
    document.addEventListener('click', (e) => {
        if (!createPostMenu?.contains(e.target) && e.target !== createPostBtn) {
            createPostMenu.classList.remove('open');
        }
    });

    // 3. "Create a Review" butonuna basınca İnceleme Modalını aç
    openReviewModalBtn?.addEventListener('click', () => {
        createPostMenu.classList.remove('open');
        reviewModal.classList.add('open');
    });

    // 4. "Save a Reading" butonuna basınca Okuma Modalını aç
    openReadModalBtn?.addEventListener('click', () => {
        createPostMenu.classList.remove('open');
        readModal.classList.add('open');
    });

    // 5. Tüm [data-close] butonları ile modalları kapat
    document.querySelectorAll('[data-close]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            document.getElementById(modalId)?.classList.remove('open');
        });
    });

    // 6. Modal dışındaki siyah boşluğa tıklanınca kapat
    [reviewModal, readModal].forEach((modal) => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    });

    // 7. ESC tuşuna basınca her şeyi kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            createPostMenu?.classList.remove('open');
            reviewModal?.classList.remove('open');
            readModal?.classList.remove('open');
        }
    });
});