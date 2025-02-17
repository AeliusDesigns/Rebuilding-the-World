document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const articlesContainer = document.getElementById("articles");
    const articleModal = document.getElementById("article-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModalBtn = document.querySelector(".close-modal");

    // Load stored articles on page load
    loadArticles();

    addArticleBtn.addEventListener("click", function () {
        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            createArticle(title, content);
            saveArticle(title, content); // Save to localStorage
        } else {
            alert("Article creation cancelled.");
        }
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
            modalTitle.textContent = title;
            modalContent.innerHTML = content.replace(/\n/g, "<br>"); // Preserve formatting
            articleModal.classList.add("open");
            articleModal.style.display = "block";
            modalOverlay.style.display = "block"; // Show overlay
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.classList.add("delete-article");
        deleteButton.addEventListener("click", function () {
            if (confirm(`Are you sure you want to delete "${title}"?`)) {
                article.remove();
                deleteArticle(title); // Remove from localStorage
            }
        });

        // Append elements
        article.appendChild(articleTitle);
        article.appendChild(readMoreButton);
        article.appendChild(deleteButton);
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

    // Delete article from localStorage
    function deleteArticle(title) {
        let articles = JSON.parse(localStorage.getItem("articles")) || [];
        articles = articles.filter(article => article.title !== title);
        localStorage.setItem("articles", JSON.stringify(articles));
    }

    // Close Modal when clicking "X"
    closeModalBtn.addEventListener("click", function () {
        articleModal.classList.remove("open");
        articleModal.style.display = "none";
        modalOverlay.style.display = "none"; // Hide overlay
    });

    // Close Modal if clicking outside of it
    modalOverlay.addEventListener("click", function () {
        articleModal.classList.remove("open");
        articleModal.style.display = "none";
        modalOverlay.style.display = "none"; // Hide overlay
    });
});
