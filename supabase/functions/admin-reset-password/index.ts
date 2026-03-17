import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, recovery_keyword, new_password } = await req.json();

    if (!email || !recovery_keyword || !new_password) {
      return new Response(
        JSON.stringify({ error: "Email, recovery keyword, and new password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new_password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check admin_emails table
    const { data: adminEmail, error: lookupError } = await supabase
      .from("admin_emails")
      .select("id, recovery_keyword")
      .eq("email", email.toLowerCase().trim())
      .eq("active", true)
      .maybeSingle();

    if (lookupError) {
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminEmail) {
      return new Response(
        JSON.stringify({ error: "This email is not authorized as an admin account." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminEmail.recovery_keyword) {
      return new Response(
        JSON.stringify({ error: "Recovery is not configured for this account. Contact another admin." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (adminEmail.recovery_keyword !== recovery_keyword) {
      return new Response(
        JSON.stringify({ error: "Recovery keyword is incorrect." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the auth user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authUser = users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
    );

    if (!authUser) {
      return new Response(
        JSON.stringify({ error: "No account found for this email. Please sign up first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      { password: new_password }
    );

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update password. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Password updated successfully." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
