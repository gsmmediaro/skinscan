import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  emails: string[];
  inviterName: string;
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

    const { emails, inviterName }: InviteRequest = await req.json();

    if (!emails || emails.length === 0) {
      throw new Error("No emails provided");
    }

    const appUrl = `${req.headers.get("origin") || "https://tqnlhqtruatpaplsrtso.lovable.app"}`;
    
    // Create invite records
    const invitePromises = emails.map(async (email) => {
      const { error } = await supabase
        .from("invites")
        .insert({
          inviter_id: user.id,
          invitee_email: email.trim(),
          status: "pending",
        });

      if (error && !error.message.includes("duplicate")) {
        console.error("Error creating invite:", error);
      }

      // Send invite email
      return resend.emails.send({
        from: "SkinScan <onboarding@resend.dev>",
        to: [email.trim()],
        subject: `${inviterName} invites you to try SkinScan!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">You're Invited to SkinScan!</h1>
            <p>${inviterName} wants you to try SkinScan - get personalized skincare insights with AI.</p>
            <p style="margin: 30px 0;">
              <a href="${appUrl}/?ref=${user.id}" 
                 style="background: #84cc16; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Get Your Free Skin Analysis
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              Join thousands of users who have discovered their personalized skincare routine.
            </p>
          </div>
        `,
      });
    });

    const results = await Promise.allSettled(invitePromises);
    const successful = results.filter(r => r.status === "fulfilled").length;

    console.log(`Sent ${successful}/${emails.length} invites for user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful,
        total: emails.length 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === "Unauthorized" ? 401 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});