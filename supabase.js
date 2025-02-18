// ===========================
// Initialize Supabase Client
// ===========================
const SUPABASE_URL = "https://utanijplulkywjzjvmty.supabase.co";
const SUPABASE_KEY = "your-anon-key"; // Replace with your actual Supabase anon key

// Ensure Supabase is available before initializing
if (window.supabase) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase Loaded Successfully!");
} else {
    console.error("❌ Supabase library is missing. Make sure it's loaded in the HTML file before this script.");
}
