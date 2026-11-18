
document.addEventListener("DOMContentLoaded", function () {

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
