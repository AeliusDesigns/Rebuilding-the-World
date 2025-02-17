// Ensure script is loaded only after the page is ready
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded Successfully");

    // Navigation function
    window.navigateTo = function (page) {
        window.location.href = page;
    };

    // Dropdown functionality
    const menuButton = document.getElementById("menu-button");
    const menuDropdown = document.getElementById("menu-dropdown");

    menuButton.addEventListener("click", function () {
        menuDropdown.style.display =
            menuDropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
            menuDropdown.style.display = "none";
        }
    });
});
