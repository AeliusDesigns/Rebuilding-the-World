document.addEventListener("DOMContentLoaded", async function () {
    console.log("📜 Lore Script Loaded!");

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
    // Check Authentication (Fix)
    // ===========================
    async function checkAuth() {
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();
        
        if (error || !user) {
            console.warn("User not authenticated.");
            return;
        }

        // Store user in variable
        console.log("Authenticated user:", user);
        const authToken = user?.access_token;

        // Store session locally
        localStorage.setItem("session", JSON.stringify({ user, token: authToken }));

        // Send token to backend to verify role
        const response = await fetch("http://localhost:5000/user-info", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ user_id: user.id }),
        });

        const data = await response.json();
        if (data.role === "admin") {
            user.role = "admin";
            addArticleBtn.style.display = "inline-block"; // Show Create button
            deleteArticleBtn.style.display = "inline-block"; // Show Delete button
        }
    }

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
addArticleBtn.addEventListener("click", async function () {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session || session.user.role !== "admin") {
        alert("Unauthorized");
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

// ===========================
// Delete an Article (Supabase)
// ===========================
async function deleteArticle(id) {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session || session.user.role !== "admin") {
        alert("Unauthorized");
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
});
