document.addEventListener("DOMContentLoaded", async function () {
    console.log("Lore Script Loaded!");

    // Ensure Supabase is available
    if (!supabase) {
        console.error("❌ Supabase is not defined in lore.js.");
        return;
    }

    console.log("✅ Supabase is available in lore.js.");

    const addArticleBtn = document.getElementById("add-article-btn");
    const deleteArticleBtn = document.getElementById("delete-article-btn");
    const articlesContainer = document.getElementById("articles");

    let user = null; // Store authenticated user
    let deleteMode = false;

    // ===========================
    // Check Authentication (Fix)
    // ===========================
    async function checkAuth() {
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session || !session.session) {
            console.error("User not authenticated.");
            return;
        }

        const authToken = session.session.access_token;
        user = session.session.user;

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
            const response = await fetch("http://localhost:5000/articles");
            const data = await response.json();
            articlesContainer.innerHTML = "";

            data.forEach(article => createArticle(article.id, article.title, article.content));
        } catch (error) {
            console.error("Error loading articles:", error);
        }
    }

    // ===========================
    //  Create an Article
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
                await fetch("http://localhost:5000/articles", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session.token}`
                    },
                    body: JSON.stringify({ title, content, user_id: session.user.id }),
                });

                loadArticles();
            } catch (error) {
                console.error("Error creating article:", error);
            }
        }
    });

    // ===========================
    //  Delete Mode Toggle
    // ===========================
    deleteArticleBtn.addEventListener("click", function () {
        deleteMode = !deleteMode;
        document.querySelectorAll(".lore-article").forEach(article => {
            article.classList.toggle("delete-mode", deleteMode);
            article.onclick = deleteMode ? () => deleteArticle(article.dataset.id) : null;
        });
    });

    // ===========================
    // Delete an Article 
    // ===========================
    async function deleteArticle(id) {
        const session = JSON.parse(localStorage.getItem("session"));
        if (!session || session.user.role !== "admin") {
            alert("Unauthorized");
            return;
        }

        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            await fetch(`http://localhost:5000/articles/${id}`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`
                }
            });

            loadArticles();
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    }

    //  Ensure authentication and articles load on page load
    await checkAuth();
    await loadArticles();
}); 
