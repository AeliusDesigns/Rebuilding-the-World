document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const articlesContainer = document.getElementById("articles");
    const articleModal = document.getElementById("article-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModalBtn = document.querySelector(".close-modal");

    addArticleBtn.addEventListener("click", function () {
        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            createArticle(title, content);
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
            modalContent.textContent = content;
            articleModal.classList.add("open"); // Add "open" class to show close button
            articleModal.style.display = "block";
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.classList.add("delete-article");
        deleteButton.addEventListener("click", function () {
            if (confirm(`Are you sure you want to delete "${title}"?`)) {
                article.remove();
            }
        });

        // Append elements
        article.appendChild(articleTitle);
        article.appendChild(readMoreButton);
        article.appendChild(deleteButton);
        articlesContainer.appendChild(article);
    }

    // Close Modal when clicking "X"
    closeModalBtn.addEventListener("click", function () {
        articleModal.classList.remove("open"); // Remove "open" class to hide close button
        articleModal.style.display = "none";
    });

    // Close Modal if clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === articleModal) {
            articleModal.classList.remove("open");
            articleModal.style.display = "none";
        }
    });
});
