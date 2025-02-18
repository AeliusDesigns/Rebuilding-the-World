console.log("✅ script.js is running!");

// ===========================
// Import and Initialize Supabase
// ===========================
const createClient = window.supabase?.createClient;

if (!createClient) {
    console.error("❌ Supabase library failed to load.");
} else {
    console.log("✅ Supabase is available.");
} 

const supabaseUrl = "https://utanijplulkywjzjvmty.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YW5panBsdWxreXdqemp2bXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjM1OTgsImV4cCI6MjA1NTM5OTU5OH0.PeJW5YAOHuaoF_prggpAqC1Sz4b5ufnpW1_Uq7U1cWk";

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
    document.addEventListener("DOMContentLoaded", function () {
    console.log("📜 script.js Loaded!");

    // Get menu button & dropdown menu
    const menuButton = document.getElementById("menu-button");
    const dropdownMenu = document.getElementById("dropdown-menu");

    // Check if they exist before attaching event listener
    if (menuButton && dropdownMenu) {
        console.log("✅ Menu button & dropdown menu found!");

        menuButton.addEventListener("click", function (event) {
            event.stopPropagation();
            console.log("✅ Menu button clicked!");

            dropdownMenu.classList.toggle("show");
            menuButton.classList.toggle("active");

            // Set aria-expanded for accessibility
            const isExpanded = dropdownMenu.classList.contains("show");
            menuButton.setAttribute("aria-expanded", isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {
            if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("show");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
                console.log("❌ Dropdown menu closed");
            }
        });

    } else {
        console.error("❌ Menu button or dropdown menu NOT found!");
    }
});

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
