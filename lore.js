const supabase = window.supabase.createClient(
    "https://utanijplulkywjzjvmty.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YW5panBsdWxreXdqemp2bXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjM1OTgsImV4cCI6MjA1NTM5OTU5OH0.PeJW5YAOHuaoF_prggpAqC1Sz4b5ufnpW1_Uq7U1cWk"
);

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Lore Script Loaded!");

    const addArticleBtn = document.getElementById("add-article-btn");
    const deleteArticleBtn = document.getElementById("delete-article-btn");
    const articlesContainer = document.getElementById("articles");

    let user = null; // Store authenticated user
    let deleteMode = false;

    // Get Supabase User Session
    async function checkAuth() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return console.error("User not authenticated.");

        const authToken = await supabase.auth.getSession(); // Get token
        localStorage.setItem("session", JSON.stringify({ user, token: authToken.session.access_token })); // Store session

        // Send token to backend to verify role
        const response = await fetch("http://localhost:5000/user-info", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken.session.access_token}` // Send token
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
