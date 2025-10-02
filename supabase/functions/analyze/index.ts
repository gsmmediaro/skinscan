import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Analyze function called');
    console.log('Request method:', req.method);
    console.log('Content-Type:', req.headers.get('content-type'));
    
    // Get authentication token
    console.log('Checking authentication...');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header found');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client for auth check
    console.log('Creating Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created successfully');

    console.log('Verifying user token...');
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError) {
      console.error('User verification error:', userError.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError.message }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!user) {
      console.error('No user found from token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User authenticated:', user.id);

    // Check subscription tier and scan limits
    console.log('Checking user subscription...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
    }

    const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'pro';
    console.log('User subscription tier:', profile?.subscription_tier || 'free');

    // Premium users have unlimited scans, free users need to check limits
    if (!isPremium) {
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('free_scans_remaining')
        .eq('user_id', user.id)
        .single();

      if (statsError) {
        console.error('Error fetching user stats:', statsError);
        return new Response(
          JSON.stringify({ error: 'Failed to check scan limits' }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!stats || stats.free_scans_remaining <= 0) {
        console.log('Rate limit exceeded for user:', user.id);
        return new Response(
          JSON.stringify({ 
            error: 'No scans remaining',
            message: 'You have used all your free scans. Upgrade to premium for unlimited scans or invite friends to earn more.',
            code: 'RATE_LIMIT_EXCEEDED'
          }), 
          { 
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('User has', stats.free_scans_remaining, 'scans remaining');
    } else {
      console.log('Premium user - unlimited scans');
    }
    
    // Get the image from the request
    console.log('Processing image from request...');
    const contentType = req.headers.get('content-type') || '';
    let imageBlob: Blob;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('image');
      if (!file || !(file instanceof File)) {
        throw new Error('No image file found in request');
      }
      imageBlob = file;
    } else if (contentType.includes('image/jpeg')) {
      imageBlob = await req.blob();
    } else {
      throw new Error('Invalid content type. Expected multipart/form-data or image/jpeg');
    }

    console.log('Image received, size:', imageBlob.size, 'bytes');

    // Forward to n8n webhook
    const n8nUrl = 'https://shadow424.app.n8n.cloud/webhook/skin-scan-ai';
    console.log('Forwarding to n8n...');
    
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: imageBlob,
    });

    console.log('n8n response status:', n8nResponse.status);
    console.log('n8n response content-type:', n8nResponse.headers.get('content-type'));

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n error response:', errorText.substring(0, 200));
      return new Response(
        JSON.stringify({ 
          error: `n8n webhook failed with status ${n8nResponse.status}`,
          details: errorText.substring(0, 200)
        }), 
        { 
          status: n8nResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Try to parse as JSON, fallback to text
    const responseText = await n8nResponse.text();
    console.log('n8n response (first 200 chars):', responseText.substring(0, 200));

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse n8n response as JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'n8n returned invalid JSON',
          details: responseText.substring(0, 200)
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully parsed n8n response');
    
    // Decrement scan count for free users after successful analysis
    if (!isPremium) {
      // Get current stats
      const { data: currentStats } = await supabase
        .from('user_stats')
        .select('free_scans_remaining, total_scans')
        .eq('user_id', user.id)
        .single();

      if (currentStats) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ 
            free_scans_remaining: Math.max(0, currentStats.free_scans_remaining - 1),
            total_scans: currentStats.total_scans + 1
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating scan count:', updateError);
          // Don't fail the request, but log it
        } else {
          console.log('Updated scan count for user:', user.id);
        }
      }
    }
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
