// ===========================
// Import and Initialize Supabase
// ===========================
const { createClient } = window.supabase;  // Fix Supabase import

const supabaseUrl = "https://your-project-id.supabase.co"; // Replace with your actual Supabase URL
const supabaseAnonKey = "your-anon-key"; // Replace with your actual anon key

window.supabaseClient = createClient(supabaseUrl, supabaseAnonKey); // Store in window

// ===========================
// Wait for DOM to Load
// ===========================
document.addEventListener("DOMContentLoaded", async function () {
    console.log("📜 script.js Loaded!");

    // Ensure Supabase is available
    if (!window.supabaseClient) {
        console.error("❌ Supabase is not initialized. Check supabase.js!");
        return;
    }

    console.log("✅ Supabase is available in script.js.");

    // ===========================
    // Check If User is Logged In
    // ===========================
    async function checkAuth() {
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();
        
        if (error || !user) {
            console.warn("User not authenticated.");
            return null;
        }

        console.log("Authenticated user:", user);
        return user;
    }

    await checkAuth();

    // ===========================
    // Handle Dropdown Menu
    // ===========================
    const menuButton = document.getElementById("menu-button");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (menuButton && dropdownMenu) {
        console.log("Menu button found!");
        menuButton.addEventListener("click", function () {
            dropdownMenu.classList.toggle("show");
        });

        // Close the menu when clicking outside of it
        document.addEventListener("click", function (event) {
            if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    } else {
        console.error("Menu button or dropdown menu not found!");
    }

    // ===========================
    // Handle Map Layer Toggle
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

    // ===========================
    // Upload File to Supabase
    // ===========================
    async function uploadFile(file) {
        const user = await checkAuth();
        if (!user) {
            alert("You must be logged in to upload a file.");
            return;
        }

        const { data, error } = await window.supabaseClient.storage
            .from("your-bucket-name") // Replace with your actual bucket name
            .upload(`uploads/${file.name}`, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            console.error("Upload error:", error);
            alert("Error uploading file.");
        } else {
            alert("File uploaded successfully!");
            console.log("Uploaded file data:", data);
        }
    }
});
