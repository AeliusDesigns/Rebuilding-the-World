document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded!"); // Debugging

    // ===========================
    // Handle Dropdown Menu (For index.html)
    // ===========================
    const menuButton = document.getElementById("menu-button");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (menuButton && dropdownMenu) {
        console.log("Menu button found!"); // Debugging
        menuButton.addEventListener("click", function () {
            console.log("Menu button clicked!"); // Debugging
            dropdownMenu.classList.toggle("show");
        });
    } else {
        console.error("Menu button or dropdown menu not found!");
    }

    // ===========================
    // Handle Map Layer Toggle (For map.html)
    // ===========================
    if (document.body.classList.contains("map-page")) {
        const images = {
            abovegroundBorders: document.getElementById("abovegroundBordersImg"),
            abovegroundNames: document.getElementById("abovegroundNamesImg"),
            belowgroundBorders: document.getElementById("belowgroundBordersImg"),
            belowgroundNames: document.getElementById("belowgroundNamesImg"),
        };

        const checkboxes = {
            abovegroundBorders: document.getElementById("abovegroundBorders"),
            abovegroundNames: document.getElementById("abovegroundNames"),
            belowgroundBorders: document.getElementById("belowgroundBorders"),
            belowgroundNames: document.getElementById("belowgroundNames"),
        };

        function updateLayers() {
            for (let key in images) {
                if (images[key] && checkboxes[key]) {
                    images[key].style.display = checkboxes[key].checked ? "inline-block" : "none";
                }
            }
        }

        for (let key in checkboxes) {
            if (checkboxes[key]) {
                checkboxes[key].addEventListener("change", updateLayers);
            }
        }

        updateLayers(); // Initial check
    }
});
