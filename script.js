// ===========================
// Initialize Supabase Client
// ===========================
const SUPABASE_URL = "https://utanijplulkywjzjvmty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YW5panBsdWxreXdqemp2bXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjM1OTgsImV4cCI6MjA1NTM5OTU5OH0.PeJW5YAOHuaoF_prggpAqC1Sz4b5ufnpW1_Uq7U1cWk";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===========================
// Check If User is Logged In
// ===========================
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        console.warn("User not authenticated.");
        return null;
    }

    console.log("Authenticated user:", user);
    return user;
}

// ===========================
// Handle Dropdown Menu 
// ===========================
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Script Loaded!");

    // Check if the user is logged in when the page loads
    await checkAuth();

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
});

// ===========================
// Upload File to Supabase
// ===========================
async function uploadFile(file) {
    const user = await checkAuth();
    if (!user) {
        alert("You must be logged in to upload a file.");
        return;
    }

    const { data, error } = await supabase.storage
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
