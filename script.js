document.addEventListener("DOMContentLoaded", function () {
    // Map images
    const images = {
        abovegroundBorders: document.getElementById("abovegroundBordersImg"),
        abovegroundNames: document.getElementById("abovegroundNamesImg"),
        belowgroundBorders: document.getElementById("belowgroundBordersImg"),
        belowgroundNames: document.getElementById("belowgroundNamesImg"),
    };

    // Checkboxes
    const checkboxes = {
        abovegroundBorders: document.getElementById("abovegroundBorders"),
        abovegroundNames: document.getElementById("abovegroundNames"),
        belowgroundBorders: document.getElementById("belowgroundBorders"),
        belowgroundNames: document.getElementById("belowgroundNames"),
    };

    // Function to toggle visibility
    function updateLayers() {
        for (let key in images) {
            images[key].style.display = checkboxes[key].checked ? "inline-block" : "none";
        }
    }

    // Attach event listeners
    for (let key in checkboxes) {
        checkboxes[key].addEventListener("change", updateLayers);
    }

    // Initial update
    updateLayers();
});
