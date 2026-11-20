
document.addEventListener("DOMContentLoaded", function () {

    const themeToggleButtons = document.querySelectorAll(".theme-toggle-btn");
    const savedTheme = localStorage.getItem("kithub-theme");
    let activeTheme = savedTheme === "dark" ? "dark" : "light";

    function applyTheme(theme) {
        activeTheme = theme;
        document.body.dataset.theme = theme;

        themeToggleButtons.forEach(function (button) {
            const isDark = theme === "dark";
            button.setAttribute("aria-label", isDark ? "Gündüz moduna geç" : "Gece moduna geç");
            button.setAttribute("aria-pressed", String(isDark));
            button.title = isDark ? "Gündüz moduna geç" : "Gece moduna geç";
            button.innerHTML = isDark
                ? '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
                : '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>';
        });
    }

    applyTheme(activeTheme);

    themeToggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const nextTheme = activeTheme === "dark" ? "light" : "dark";
            localStorage.setItem("kithub-theme", nextTheme);
            applyTheme(nextTheme);
        });
    });

    const readingForm = document.getElementById("readingForm");
    const readingStatus = document.getElementById("readingStatus");

    const currentPageGroup = document.getElementById("currentPageGroup");
    const durationGroup = document.getElementById("durationGroup");

    const currentPage = document.getElementById("currentPage");
    const readingDuration = document.getElementById("readingDuration");

    const totalPages = document.getElementById("totalPages");

    const bookCover = document.getElementById("bookCover");
    const coverPreview = document.getElementById("coverPreview");

    const readingMessage = document.getElementById("readingMessage");

    if (!readingForm || !readingStatus || !currentPageGroup || !durationGroup) {
        console.error("Save a Reading form elements could not be found.");
        return;
    }

    // Show or hide fields according to selected status
    function updateStatusFields() {

        currentPageGroup.style.display = "none";
        durationGroup.style.display = "none";

        currentPage.required = false;
        readingDuration.required = false;

        if (readingStatus.value === "reading") {
            currentPageGroup.style.display = "block";
            currentPage.required = true;
        }

        else if (readingStatus.value === "finished") {
            durationGroup.style.display = "block";
            readingDuration.required = true;
        }
    }

    readingStatus.addEventListener("change", updateStatusFields);

    // Book cover preview
    bookCover.addEventListener("change", function () {

        const file = bookCover.files[0];

        if (file) {
            coverPreview.src = URL.createObjectURL(file);
            coverPreview.style.display = "block";
        } else {
            coverPreview.src = "";
            coverPreview.style.display = "none";
        }
    });

    // Check current page
    currentPage.addEventListener("input", function () {

        currentPage.setCustomValidity("");

        if (
            currentPage.value !== "" &&
            totalPages.value !== "" &&
            Number(currentPage.value) > Number(totalPages.value)
        ) {
            currentPage.setCustomValidity(
                "Current page cannot be greater than total pages."
            );
        }
    });

    // Check total pages
    totalPages.addEventListener("input", function () {

        currentPage.setCustomValidity("");

        if (
            currentPage.value !== "" &&
            totalPages.value !== "" &&
            Number(currentPage.value) > Number(totalPages.value)
        ) {
            currentPage.setCustomValidity(
                "Current page cannot be greater than total pages."
            );
        }
    });

    // Initial field visibility
    updateStatusFields();

});
