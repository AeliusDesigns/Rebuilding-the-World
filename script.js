document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded!");

    // ===========================
    // Handle Dropdown Menu (For All Pages)
    // ===========================
    const menuButton = document.getElementById("menu-button");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (menuButton && dropdownMenu) {
        console.log("Menu button found!");
        menuButton.addEventListener("click", function () {
            dropdownMenu.classList.toggle("show");
        });
    } else {
        console.error("Menu button or dropdown menu not found!");
    }

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded!");

    // ===========================
    // Handle Map Layer Toggle (For map.html)
    // ===========================
    if (document.body.classList.contains("map-page")) {
        console.log("Map Page Detected!");

        const buttons = document.querySelectorAll(".map-toggle");
        const images = {
            abovegroundBorders: document.getElementById("abovegroundBordersImg"),
            abovegroundNames: document.getElementById("abovegroundNamesImg"),
            belowgroundBorders: document.getElementById("belowgroundBordersImg"),
            belowgroundNames: document.getElementById("belowgroundNamesImg"),
        };

        function selectLayer(selectedLayer) {
            // Remove "active" class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));

            // Hide all images
            for (let key in images) {
                if (images[key]) {
                    images[key].style.display = "none";
                }
            }

            // Activate the clicked button & show corresponding map layer
            const selectedButton = document.querySelector(`.map-toggle[data-layer="${selectedLayer}"]`);
            if (selectedButton) {
                selectedButton.classList.add("active");
            }

            if (images[selectedLayer]) {
                images[selectedLayer].style.display = "inline-block";
            }
        }

        // Add event listeners to buttons
        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const layer = this.getAttribute("data-layer");
                selectLayer(layer);
            });
        });
    }
});
