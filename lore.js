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

    // Fix: Get Supabase User Session & Token
    async function checkAuth() {
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session || !session.session) {
            console.error("User not authenticated.");
            return;
        }

        const authToken = session.session.access_token; // ✅ Get token correctly
        user = session.session.user; // ✅ Get user

        localStorage.setItem("session", JSON.stringify({ user, token: authToken })); // Store session

        // Send token to backend to verify role
        const response = await fetch("http://localhost:5000/user-info", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` // ✅ Send token correctly
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

    // Run authentication check on page load
    await checkAuth();
});

    // Load Articles from Supabase
    async function loadArticles() {
        const response = await fetch("http://localhost:5000/articles");
        const data = await response.json();
        articlesContainer.innerHTML = "";
        data.forEach(article => createArticle(article.id, article.title, article.content));
    }

    // Create an Article (Send Token to Backend)
    addArticleBtn.addEventListener("click", async function () {
        const session = JSON.parse(localStorage.getItem("session"));
        if (!session || session.user.role !== "admin") return alert("Unauthorized");

        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            await fetch("http://localhost:5000/articles", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}` // Send token
                },
                body: JSON.stringify({ title, content, user_id: session.user.id }),
            });
            loadArticles();
        }
    });

    await checkAuth();
    await loadArticles();
});
