import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralRequest {
  inviteToken: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { inviteToken }: ReferralRequest = await req.json();

    if (!inviteToken) {
      throw new Error("Invite token is required");
    }

    // Fetch invite by token
    const { data: invite, error: inviteError } = await supabase
      .from("invites")
      .select("*")
      .eq("invite_token", inviteToken)
      .eq("status", "pending")
      .single();

    if (inviteError || !invite) {
      console.error("Invite not found or already used:", inviteError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired invite" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify email matches
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    if (!profile || profile.email !== invite.invitee_email) {
      return new Response(
        JSON.stringify({ error: "Email mismatch" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if already accepted (idempotency)
    if (invite.status === "accepted") {
      return new Response(
        JSON.stringify({ success: true, message: "Invite already accepted" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update invite status
    await supabase
      .from("invites")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        accepted_by: user.id,
      })
      .eq("invite_token", inviteToken);

    // Update inviter stats (grant reward)
    const { data: inviterStats, error: fetchError } = await supabase
      .from("user_stats")
      .select("invites_completed, free_scans_remaining")
      .eq("user_id", invite.inviter_id)
      .single();

    if (!fetchError && inviterStats) {
      await supabase
        .from("user_stats")
        .update({
          invites_completed: inviterStats.invites_completed + 1,
          free_scans_remaining: inviterStats.free_scans_remaining + 1,
        })
        .eq("user_id", invite.inviter_id);
    }

    // Update invitee stats (grant initial bonus)
    const { data: inviteeStats, error: fetchError2 } = await supabase
      .from("user_stats")
      .select("free_scans_remaining")
      .eq("user_id", user.id)
      .single();

    if (!fetchError2 && inviteeStats) {
      await supabase
        .from("user_stats")
        .update({
          free_scans_remaining: inviteeStats.free_scans_remaining + 1,
        })
        .eq("user_id", user.id);
    }

    console.log(`Referral processed: ${user.id} accepted invite from ${invite.inviter_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Referral processed successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in process-referral function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === "Unauthorized" ? 401 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
