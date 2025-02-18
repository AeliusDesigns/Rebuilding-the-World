// ===========================
// Initialize Supabase Client
// ===========================
const SUPABASE_URL = "https://utanijplulkywjzjvmty.supabase.co";
const SUPABASE_KEY = "your-anon-key"; // Replace with your actual anon key

// Ensure Supabase is loaded before creating the client
if (window.supabase) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase Loaded Successfully!");
} else {
    console.error("❌ Supabase library is missing. Check your script order in HTML.");
}
