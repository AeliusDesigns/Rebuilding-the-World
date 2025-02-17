// Ensure script is loaded only after the page is ready
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded Successfully");

    // Function for button navigation
    window.navigateTo = function (page) {
        window.location.href = page;
    };
});
