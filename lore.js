document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const articlesContainer = document.getElementById("articles");
    const articleModal = document.getElementById("article-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModalBtn = document.querySelector(".close-modal");

    addArticleBtn.addEventListener("click", function () {
        // Prompt for article title & content
        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            createArticle(title, content);
        } else {
            alert("Article creation cancelled.");
        }
    });

    function createArticle(title, content) {
        // Create new article element
        const article = document.createElement("article");
        article.classList.add("lore-article");

        // Add title
        const articleTitle = document.createElement("h3");
        articleTitle.textContent = title;

        // Add delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.classList.add("delete-article");
        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent modal from opening when clicking delete
            if (confirm(`Are you sure you want to delete "${title}"?`)) {
                article.remove();
            }
        });

        // Add event listener to open modal on click
        article.addEventListener("click", function () {
            modalTitle.textContent = title;
            modalContent.textContent = content;
            articleModal.style.display = "block";
        });

        // Append elements to the article
        article.appendChild(articleTitle);
        article.appendChild(deleteButton);
        articlesContainer.appendChild(article);
    }

    // Close modal when the close button is clicked
    closeModalBtn.addEventListener("click", function () {
        articleModal.style.display = "none";
    });

    // Close modal if user clicks outside of the content box
    window.addEventListener("click", function (event) {
        if (event.target === articleModal) {
            articleModal.style.display = "none";
        }
    });
});
