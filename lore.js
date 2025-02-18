document.addEventListener("DOMContentLoaded", async function () {
    console.log("📜 lore.js Loaded!");

    // Ensure Supabase is available
    if (!window.supabaseClient) {
        console.error("❌ Supabase is not initialized in lore.js. Check supabase.js!");
        return;
    }

    console.log("✅ Supabase is available in lore.js.");

    // UI Elements
    const addArticleBtn = document.getElementById("add-article-btn");
    const deleteArticleBtn = document.getElementById("delete-article-btn");
    const articlesContainer = document.getElementById("articles");

    let user = null; // Store authenticated user
    let deleteMode = false;

    // ===========================
    // Load Articles from Supabase
    // ===========================
    async function loadArticles() {
        try {
            const { data, error } = await window.supabaseClient
                .from("lore_articles")
                .select("*");

            if (error) throw error;

            articlesContainer.innerHTML = ""; // Clear existing content

            data.forEach(article => {
                const articleElement = document.createElement("div");
                articleElement.classList.add("lore-article");
                articleElement.dataset.id = article.id;
                articleElement.innerHTML = `
                    <h2>${article.title}</h2>
                    <p>${article.content}</p>
                    <small>Created: ${new Date(article.created_at).toLocaleString()}</small>
                `;
                articlesContainer.appendChild(articleElement);
            });

            console.log("✅ Articles loaded:", data);
        } catch (error) {
            console.error("❌ Error loading articles:", error);
        }
    }

    // ===========================
    // Create an Article (Supabase)
    // ===========================
    if (addArticleBtn) {
    addArticleBtn.addEventListener("click", async function () {
        // Get current user from Supabase
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();
        
        if (error || !user) {
            alert("Unauthorized: Please log in.");
            return;
        }

        // Check if user is an admin from the database
        const { data: userData, error: roleError } = await window.supabaseClient
            .from("users") // Replace "users" with your actual user role table
            .select("role")
            .eq("id", user.id)
            .single();

        if (roleError || !userData || userData.role !== "admin") {
            alert("Unauthorized: You do not have admin permissions.");
            return;
        }

        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            try {
                const { data, error } = await window.supabaseClient
                    .from("lore_articles")
                    .insert([{ title, content }]);

                if (error) throw error;

                alert("Article added successfully!");
                loadArticles(); // Reload articles after inserting
            } catch (error) {
                console.error("Error creating article:", error);
                alert("Error adding article.");
            }
        }
    });
}

    // ===========================
    // Delete an Article (Supabase)
    // ===========================
    async function deleteArticle(id) {
        // Get the currently logged-in user
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();

        if (error || !user) {
            alert("Unauthorized: Please log in.");
            return;
        }

        // Check if user is an admin
        const { data: userData, error: roleError } = await window.supabaseClient
            .from("users") // Replace "users" with your actual user role table
            .select("role")
            .eq("id", user.id)
            .single();

        if (roleError || !userData || userData.role !== "admin") {
            alert("Unauthorized: You do not have admin permissions.");
            return;
        }

        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            const { error } = await window.supabaseClient
                .from("lore_articles")
                .delete()
                .eq("id", id);

            if (error) throw error;

            alert("Article deleted successfully!");
            loadArticles(); // Reload articles after deleting
        } catch (error) {
            console.error("Error deleting article:", error);
            alert("Error deleting article.");
        }
    }

    // ===========================
    // Initialize Page
    // ===========================
    async function initLorePage() {
        await loadArticles();
    }

    initLorePage();
});
