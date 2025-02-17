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
            console.log("Menu button clicked!");
            dropdownMenu.classList.toggle("show");
        });
    } else {
        console.error("Menu button or dropdown menu not found!");
    }

    // ===========================
    // Adjust Dropdown Options Based on Page
    // ===========================
    if (document.body.classList.contains("map-page")) {
        dropdownMenu.innerHTML = `
            <ul>
                <li><a href="index.html">Dashboard</a></li>
                <li><a href="world_lore.html">World Lore</a></li>
            </ul>`;
    } else if (document.body.classList.contains("lore-page")) {
        dropdownMenu.innerHTML = `
            <ul>
                <li><a href="index.html">Dashboard</a></li>
                <li><a href="map.html">World Map</a></li>
            </ul>`;
    } else {
        dropdownMenu.innerHTML = `
            <ul>
                <li><a href="map.html">World Map</a></li>
                <li><a href="world_lore.html">World Lore</a></li>
            </ul>`;
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
