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
    // Fetch and Display Articles
    // ===========================
    async function fetchArticles() {
        console.log("📥 Fetching articles from database...");

        const { data, error } = await window.supabaseClient
            .from("articles")
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
            articleCard.innerHTML = `
                <h3>${article.title}</h3>
                <p class="caption">${article.caption || "No caption provided."}</p>
                <p class="timestamp">${new Date(article.created_at).toLocaleString()}</p>
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
            .from("articles")
            .select("*")
            .eq("id", articleId)
            .single();

        if (error) {
            console.error("❌ Error fetching article:", error);
            return;
        }

        modalTitle.textContent = data.title;
        modalContent.textContent = data.content; // Assuming "content" column holds the full text

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
        console.log("📝 Creating a new article...");

        const title = prompt("Enter article title:");
        if (!title) return alert("Title is required.");

        const caption = prompt("Enter article caption:");
        const content = prompt("Enter article content:");
        if (!content) return alert("Content is required.");

        const { error } = await window.supabaseClient
            .from("articles")
            .insert([{ title, caption, content }]);

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
        console.log("🗑 Deleting an article...");

        const articleId = prompt("Enter the ID of the article to delete:");
        if (!articleId) return alert("Article ID is required.");

        const { error } = await window.supabaseClient
            .from("articles")
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
