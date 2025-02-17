document.addEventListener("DOMContentLoaded", function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const articlesContainer = document.getElementById("articles");

    // Create the pop-up container
    const popup = document.createElement("div");
    popup.classList.add("article-popup");
    popup.innerHTML = `
        <span class="close-popup">&times;</span>
        <h3 id="popup-title"></h3>
        <p id="popup-content"></p>
    `;
    document.body.appendChild(popup);

    const popupTitle = document.getElementById("popup-title");
    const popupContent = document.getElementById("popup-content");
    const closePopupBtn = document.querySelector(".close-popup");

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

        // Read More Button
        const readMoreButton = document.createElement("button");
        readMoreButton.textContent = "Read More";
        readMoreButton.classList.add("read-more");
        readMoreButton.addEventListener("click", function () {
            popupTitle.textContent = title;
            popupContent.textContent = content;
            popup.style.display = "block";
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

        article.appendChild(articleTitle);
        article.appendChild(readMoreButton);
        article.appendChild(deleteButton);
        articlesContainer.appendChild(article);
    }

    // Close pop-up when clicking "X"
    closePopupBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // Close pop-up if clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});
