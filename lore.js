document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const articlesContainer = document.getElementById("articles");

    addArticleBtn.addEventListener("click", function () {
        // Prompt for article title & content
        const title = prompt("Enter the article title:");
        const content = prompt("Enter the article content:");

        if (title && content) {
            // Create new article element
            const article = document.createElement("article");
            article.classList.add("lore-article");

            // Add title
            const articleTitle = document.createElement("h3");
            articleTitle.textContent = title;

            // Add content
            const articleContent = document.createElement("p");
            articleContent.textContent = content;

            // Append to article and container
            article.appendChild(articleTitle);
            article.appendChild(articleContent);
            articlesContainer.appendChild(article);
        } else {
            alert("Article creation cancelled.");
        }
    });
});
