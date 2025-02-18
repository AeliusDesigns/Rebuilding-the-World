const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// User Registration
app.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) return res.status(400).send("All fields are required");

        const { data: existingUser } = await supabase.from("users").select("username").eq("username", username).single();
        if (existingUser) return res.status(400).send("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const { error } = await supabase.from("users").insert([{ username, password: hashedPassword, role }]);
        if (error) throw error;

        res.status(201).send("User registered");
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// User Login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send("All fields are required");

        const { data: user } = await supabase.from("users").select("id, password, role").eq("username", username).single();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Middleware to Authenticate Users
const authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("Access denied");

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("Invalid token");
        req.user = decoded;
        next();
    });
};

// Middleware to Check If User is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).send("Admins only");
    next();
};

// Fetch All Articles
app.get("/articles", async (req, res) => {
    try {
        const { data, error } = await supabase.from("lore_articles").select("*");
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Add New Article (Admins Only)
app.post("/articles", authenticate, isAdmin, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).send("All fields are required");

        const { error } = await supabase.from("lore_articles").insert([{ title, content, author_id: req.user.id }]);
        if (error) throw error;

        res.status(201).send("Article added successfully");
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Delete Article (Admins Only)
app.delete("/articles/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("lore_articles").delete().eq("id", id);
        if (error) throw error;

        res.status(200).send("Article deleted successfully");
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Check Database
// server.js (on your server)
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.set('view engine', 'ejs'); // Use EJS templating engine

const supabase = createClient('<your_supabase_url>', '<your_supabase_anon_key>');

app.get('/', async (req, res) => {
  try {
    const { data: nations, error } = await supabase
    .from('Nations')
    .select('*');

    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      res.render('index', { nations }); // Render the 'index.ejs' template with the data
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
