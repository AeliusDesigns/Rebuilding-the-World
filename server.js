require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase Configuration
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch All Articles
app.get("/articles", async (req, res) => {
    const { data, error } = await supabase.from("lore_articles").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Add a New Article (Only Authorized Users)
app.post("/articles", async (req, res) => {
    const { title, content, user_id } = req.body;

    // Check if the user is authorized (replace with role-based check later)
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user_id)
        .single();

    if (userError || user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.from("lore_articles").insert([{ title, content, author_id: user_id }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Article added successfully!", article: data });
});

// Delete Article (Only Admins)
app.delete("/articles/:id", async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    // Check if the user is authorized
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user_id)
        .single();

    if (userError || user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase.from("lore_articles").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Article deleted successfully!" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000...");
});
