document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const deleteArticleBtn = document.getElementById("delete-article-btn");
    const articlesContainer = document.getElementById("articles");
    const articleModal = document.getElementById("article-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModalBtn = document.querySelector(".close-modal");

    let deleteMode = false; // Tracks if delete mode is active

    // Load stored articles on page load
    loadArticles();

    addArticleBtn.addEventListener("click", function () {
        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            createArticle(title, content);
            saveArticle(title, content);
        } else {
            alert("Article creation cancelled.");
        }
    });

    deleteArticleBtn.addEventListener("click", function () {
        deleteMode = !deleteMode; // Toggle delete mode
        deleteArticleBtn.style.background = deleteMode ? "#b22222" : "#333"; // Change button color in delete mode

        // Highlight selectable articles when delete mode is active
        document.querySelectorAll(".lore-article").forEach(article => {
            if (deleteMode) {
                article.classList.add("delete-mode");
                article.addEventListener("click", deleteArticleOnClick);
            } else {
                article.classList.remove("delete-mode");
                article.removeEventListener("click", deleteArticleOnClick);
            }
        });
    });

    function createArticle(title, content) {
        const article = document.createElement("article");
        article.classList.add("lore-article");

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

        // Append elements
        article.appendChild(articleTitle);
        article.appendChild(readMoreButton);
        articlesContainer.appendChild(article);
    }

    // Save article to localStorage
    function saveArticle(title, content) {
        let articles = JSON.parse(localStorage.getItem("articles")) || [];
        articles.push({ title, content });
        localStorage.setItem("articles", JSON.stringify(articles));
    }

    // Load articles from localStorage
    function loadArticles() {
        let articles = JSON.parse(localStorage.getItem("articles")) || [];
        articles.forEach(article => {
            createArticle(article.title, article.content);
        });
    }

    // Delete article when clicked in delete mode
    function deleteArticleOnClick(event) {
        const article = event.currentTarget;
        const title = article.querySelector("h3").textContent;

        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            article.remove();
            removeArticleFromStorage(title);
        }
    }

    // Remove article from localStorage
    function removeArticleFromStorage(title) {
        let articles = JSON.parse(localStorage.getItem("articles")) || [];
        articles = articles.filter(article => article.title !== title);
        localStorage.setItem("articles", JSON.stringify(articles));
    }

    // Close Modal when clicking "X"
    closeModalBtn.addEventListener("click", function () {
        articleModal.classList.remove("open");
        articleModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    // Close Modal if clicking outside of it
    modalOverlay.addEventListener("click", function () {
        articleModal.classList.remove("open");
        articleModal.style.display = "none";
        modalOverlay.style.display = "none";
    });
});
