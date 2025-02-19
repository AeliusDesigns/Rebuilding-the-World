document.addEventListener("DOMContentLoaded", async function () {
    console.log("📜 lore.js Loaded!");

    const articlesContainer = document.getElementById("articles");
    const createArticleBtn = document.getElementById("create-article-btn");
    const deleteArticleBtn = document.getElementById("delete-article-btn");
    const modalOverlay = document.getElementById("modal-overlay");
    const articleModal = document.getElementById("article-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModal = document.querySelector(".close-modal");

    if (!articlesContainer || !createArticleBtn || !deleteArticleBtn) {
        console.error("❌ One or more required elements not found in lore.js.");
        return;
    }

    // ===========================
    // User Authentication Check
    // ===========================
    async function checkAuth() {
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();

        if (error || !user) {
            console.warn("❌ User not authenticated.");
            return null;
        }

        console.log("✅ Authenticated user:", user);
        return user;
    }
    
    // ===========================
    // Fetch and Display Articles
    // ===========================
    async function fetchArticles() {
        console.log("📥 Fetching articles from database...");

        const { data, error } = await window.supabaseClient
            .from("lore_articles") // ✅ Correct Table Name
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("❌ Error fetching articles:", error);
            return;
        }

        articlesContainer.innerHTML = ""; // Clear current articles

        data.forEach((article) => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("lore-article");

            // UTC to Local Time Conversion
            const createdAt = new Date(article.created_at + "Z"); // Treat as UTC
            const localTime = createdAt.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
            });

            articleCard.innerHTML = `
                <span class="article-id">ID: ${article.id}</span>
                <h3>${article.title}</h3>
                <p class="caption">${article.caption || "No caption provided."}</p>
                <p class="timestamp">${localTime}</p> <!-- ✅ Now shows the correct local time -->
                <button class="view-article-btn" data-id="${article.id}">View</button>
            `;

            articlesContainer.appendChild(articleCard);
        });

        console.log("✅ Articles loaded successfully!");

        // Add event listeners to "View" buttons
        document.querySelectorAll(".view-article-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const articleId = this.getAttribute("data-id");
                openArticle(articleId);
            });
        });
    }

    fetchArticles(); // Load articles when page loads

    // ===========================
    // Open Article Modal
    // ===========================
    async function openArticle(articleId) {
        console.log(`📖 Opening article with ID: ${articleId}`);

        const { data, error } = await window.supabaseClient
            .from("lore_articles") // ✅ Fixed Table Name
            .select("*")
            .eq("id", articleId)
            .single();

        if (error) {
            console.error("❌ Error fetching article:", error);
            return;
        }

        modalTitle.textContent = data.title;
        modalContent.textContent = data.content || "No content available."; // ✅ Prevent Null

        articleModal.style.display = "block";
        modalOverlay.style.display = "block";
    }

    // ===========================
    // Close Modal
    // ===========================
    closeModal.addEventListener("click", function () {
        articleModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    modalOverlay.addEventListener("click", function () {
        articleModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    // ===========================
    // Create New Article
    // ===========================
    createArticleBtn.addEventListener("click", async function () {
        console.log("📝 Attempting to create an article...");

        const user = await checkAuth();
        if (!user) {
            alert("❌ You must be logged in to create an article.");
            return;
        }

        const title = prompt("Enter article title:");
        if (!title) return alert("Title is required.");

        const caption = prompt("Enter article caption:");
        const content = prompt("Enter article content:");
        if (!content) return alert("Content is required.");

        const { error } = await window.supabaseClient
            .from("lore_articles")
            .insert([{ title, caption, content, user_id: user.id }]); // Store user ID

        if (error) {
            console.error("❌ Error creating article:", error);
            alert("Failed to create article.");
            return;
        }
    
        alert("✅ Article created successfully!");
        fetchArticles(); // Refresh articles
    });


    // ===========================
    // Delete Articles
    // ===========================
        deleteArticleBtn.addEventListener("click", async function () {
        console.log("🗑 Attempting to delete an article...");

        const user = await checkAuth();
        if (!user) {
            alert("❌ You must be logged in to delete an article.");
            return;
        }

        const articleId = prompt("Enter the ID of the article to delete:");
        if (!articleId) return alert("Article ID is required.");

        const { data: article, error: fetchError } = await window.supabaseClient
            .from("lore_articles")
            .select("user_id")
            .eq("id", articleId)
            .single();

        if (fetchError || !article) {
            console.error("❌ Error fetching article:", fetchError);
            alert("Article not found or an error occurred.");
            return;
        }

        // Ensure only the article creator can delete
        if (article.user_id !== user.id) {
            alert("❌ You are not authorized to delete this article.");
            return;
        }

        const { error } = await window.supabaseClient
            .from("lore_articles")
            .delete()
            .eq("id", articleId);

        if (error) {
            console.error("❌ Error deleting article:", error);
            alert("Failed to delete article.");
            return;
        }

        alert("✅ Article deleted successfully!");
        fetchArticles(); // Refresh articles
    });

});
