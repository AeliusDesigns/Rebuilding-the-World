// ===========================
// Initialize Supabase Client
// ===========================
const SUPABASE_URL = "https://utanijplulkywjzjvmty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YW5panBsdWxreXdqemp2bXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjM1OTgsImV4cCI6MjA1NTM5OTU5OH0.PeJW5YAOHuaoF_prggpAqC1Sz4b5ufnpW1_Uq7U1cWk";

// Ensure Supabase is available before initializing
if (window.supabase) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase Loaded Successfully!");
} else {
    console.error("❌ Supabase library is missing. Make sure it's loaded in the HTML file before this script.");
}
