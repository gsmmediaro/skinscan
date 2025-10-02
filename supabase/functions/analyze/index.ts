import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // Get the image from the request
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
