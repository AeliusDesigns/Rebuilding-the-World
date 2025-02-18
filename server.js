const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = "https://utanijplulkywjzjvmty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YW5panBsdWxreXdqemp2bXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjM1OTgsImV4cCI6MjA1NTM5OTU5OH0.PeJW5YAOHuaoF_prggpAqC1Sz4b5ufnpW1_Uq7U1cWk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).send("All fields are required");
    
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();
    
    if (existingUser) return res.status(400).send("User already exists");
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ username, password: hashedPassword, role }]);
    
    if (insertError) throw insertError;
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("All fields are required");
    
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, password, role")
      .eq("username", username)
      .single();
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = decoded;
    next();
  });
};

app.get("/data", authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase.from("data").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/data", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).send("Admins only");
    const { name, value } = req.body;
    if (!name || !value) return res.status(400).send("All fields are required");
    
    const { error } = await supabase.from("data").insert([{ name, value }]);
    if (error) throw error;
    
    res.status(201).send("Data added");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
