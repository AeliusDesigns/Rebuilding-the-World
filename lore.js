document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const articlesContainer = document.getElementById("articles");

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

        // Add content preview
        const articleContent = document.createElement("p");
        articleContent.textContent = content.substring(0, 100) + "..."; // Show only first 100 characters

        // Add full content (hidden by default)
        const fullContent = document.createElement("p");
        fullContent.textContent = content;
        fullContent.style.display = "none";

        // Add expand button
        const expandButton = document.createElement("button");
        expandButton.textContent = "Read More";
        expandButton.classList.add("expand-article");
        expandButton.addEventListener("click", function () {
            if (fullContent.style.display === "none") {
                fullContent.style.display = "block";
                expandButton.textContent = "Read Less";
            } else {
                fullContent.style.display = "none";
                expandButton.textContent = "Read More";
            }
        });

        // Add delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.classList.add("delete-article");
        deleteButton.addEventListener("click", function () {
            if (confirm(`Are you sure you want to delete "${title}"?`)) {
                article.remove();
            }
        });

        // Append elements to the article
        article.appendChild(articleTitle);
        article.appendChild(articleContent);
        article.appendChild(expandButton);
        article.appendChild(fullContent);
        article.appendChild(deleteButton);
        articlesContainer.appendChild(article);
    }
});
