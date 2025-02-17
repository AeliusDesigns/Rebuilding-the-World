document.addEventListener("DOMContentLoaded", async function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const deleteArticleBtn = document.getElementById("delete-article-btn");
    const articlesContainer = document.getElementById("articles");
    const articleModal = document.getElementById("article-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModalBtn = document.querySelector(".close-modal");

    let user = null; // Store authenticated user
    let deleteMode = false;

    // Authenticate User (Check if Admin)
    async function checkAuth() {
        const session = JSON.parse(localStorage.getItem("session")); // Retrieve stored session
        if (!session) return;

        const response = await fetch("http://localhost:5000/user-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: session.user.id }),
        });

        const data = await response.json();
        if (data.role === "admin") {
            user = data; // Store user info
            addArticleBtn.style.display = "inline-block";
            deleteArticleBtn.style.display = "inline-block";
        }
    }

    // Load Articles from Supabase
    async function loadArticles() {
        const response = await fetch("http://localhost:5000/articles");
        const data = await response.json();
        articlesContainer.innerHTML = "";
        data.forEach(article => createArticle(article.id, article.title, article.content));
    }

    // Create an Article (Only for Admins)
    addArticleBtn.addEventListener("click", async function () {
        if (!user) return alert("Unauthorized");

        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            await fetch("http://localhost:5000/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, user_id: user.id }),
            });
            loadArticles();
        }
    });

    // Delete Mode Toggle (Highlight Articles for Deletion)
    deleteArticleBtn.addEventListener("click", function () {
        deleteMode = !deleteMode;
        deleteArticleBtn.style.background = deleteMode ? "#b22222" : "#333"; // Change button color in delete mode

        document.querySelectorAll(".lore-article").forEach(article => {
            article.classList.toggle("delete-mode", deleteMode);
            article.onclick = deleteMode ? () => deleteArticle(article.dataset.id) : null;
        });
    });

    // Create Article Card with Read More Button
    function createArticle(id, title, content) {
        const article = document.createElement("article");
        article.classList.add("lore-article");
        article.dataset.id = id;

        const articleTitle = document.createElement("h3");
        articleTitle.textContent = title;

        // Read More Button (Opens Modal)
        const readMoreButton = document.createElement("button");
        readMoreButton.textContent = "Read More";
        readMoreButton.classList.add("read-more");
        readMoreButton.addEventListener("click", function () {
            if (!deleteMode) { // Prevents opening modal in delete mode
                modalTitle.textContent = title;
                modalContent.innerHTML = content.replace(/\n/g, "<br>");
                articleModal.classList.add("open");
                articleModal.style.display = "block";
                modalOverlay.style.display = "block";
            }
        });

        article.appendChild(articleTitle);
        article.appendChild(readMoreButton);
        articlesContainer.appendChild(article);
    }

    // Delete an Article (Only for Admins)
    async function deleteArticle(id) {
        if (!user) return alert("Unauthorized");
        if (!confirm("Are you sure you want to delete this article?")) return;

        await fetch(`http://localhost:5000/articles/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id }),
        });

        loadArticles();
    }

    // ✅ Close Modal when clicking "X"
    closeModalBtn.addEventListener("click", function () {
        articleModal.classList.remove("open");
        articleModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    // ✅ Close Modal if clicking outside of it
    modalOverlay.addEventListener("click", function () {
        articleModal.classList.remove("open");
        articleModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    await checkAuth();
    await loadArticles();
});
