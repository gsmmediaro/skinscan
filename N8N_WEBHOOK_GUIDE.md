# n8n Webhook Integration Guide

## Webhook URL
```
https://shadow424.app.n8n.cloud/webhook/skin-scan-ai
```

This webhook is configured in `.env` as `VITE_N8N_WEBHOOK_URL`

---

## Request Format

The app sends a `POST` request with `multipart/form-data` containing:

### FormData Fields:
- **`image`** (File) - The user's selfie in JPEG format
- **`userId`** (String) - The Supabase user ID (UUID)
- **`userEmail`** (String) - The user's email address

### Example Request:
```http
POST https://shadow424.app.n8n.cloud/webhook/skin-scan-ai
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="selfie.jpg"
Content-Type: image/jpeg

[binary image data]
--boundary
Content-Disposition: form-data; name="userId"

3a68c8e7-f8d9-4e2a-9f3b-1d5e8c7a9b2f
--boundary
Content-Disposition: form-data; name="userEmail"

shadowgaming424@gmail.com
--boundary--
```

---

## Expected Response Format

The n8n workflow MUST return a JSON response with the following structure:

### Option 1: Object Format (Recommended)
```json
{
  "analysis": {
    "glowScore": 75,
    "evenness": 68,
    "texture": 82,
    "wrinkles": 15
  }
}
```

### Option 2: Array Format (Also Supported)
```json
[
  {
    "analysis": {
      "glowScore": 75,
      "evenness": 68,
      "texture": 82,
      "wrinkles": 15
    }
  }
]
```

---

## Response Fields Explained

### Required Fields (0-100 scale):

- **`glowScore`** (Number: 0-100)
  - Overall skin health score
  - Higher = better skin condition
  - Displayed as main score on results page

- **`evenness`** (Number: 0-100)
  - Skin tone evenness and pigmentation
  - Higher = more even skin tone
  - Used to calculate: acne, redness, darkSpots metrics

- **`texture`** (Number: 0-100)
  - Skin smoothness and texture quality
  - Higher = smoother skin
  - Directly used for texture metric

- **`wrinkles`** (Number: 0-100)
  - Wrinkle severity
  - Higher = more wrinkles
  - Inverted (100 - wrinkles) for fineLines metric

---

## How Metrics Are Calculated

The app transforms the AI response into 5 user-facing metrics:

```typescript
const metrics = {
  // Higher evenness = less acne
  acne: {
    score: 100 - analysis.evenness,
    severity: "low" | "medium" | "high",
    description: "Blemishes and breakouts"
  },

  // Higher evenness = less redness
  redness: {
    score: 100 - analysis.evenness,
    severity: "low" | "medium" | "high",
    description: "Skin inflammation"
  },

  // Direct texture score
  texture: {
    score: analysis.texture,
    severity: "low" | "medium" | "high",
    description: "Skin smoothness"
  },

  // Fewer wrinkles = fewer fine lines
  fineLines: {
    score: 100 - analysis.wrinkles,
    severity: "low" | "medium" | "high",
    description: "Early signs of aging"
  },

  // Higher evenness = fewer dark spots
  darkSpots: {
    score: 100 - analysis.evenness,
    severity: "low" | "medium" | "high",
    description: "Pigmentation issues"
  }
};
```

### Severity Levels:
- **Score ≥ 70**: `low` severity (good!)
- **Score 40-69**: `medium` severity (needs attention)
- **Score < 40**: `high` severity (focus area)

---

## n8n Workflow Structure

Your n8n workflow should have these nodes:

### 1. Webhook Trigger
- Method: `POST`
- Path: `/skin-scan-ai`
- Response Mode: `When Last Node Finishes`
- Binary Data: `Yes` (to receive the image)

### 2. Extract Image from FormData
The image will be in `binary.image.data`

### 3. AI Vision Analysis
Send the image to your AI service (OpenAI GPT-4 Vision, Google Gemini, etc.) with a prompt like:

```
Analyze this facial selfie for skin health. Return ONLY a JSON object with these numeric scores (0-100):
{
  "glowScore": overall skin health,
  "evenness": skin tone uniformity (higher = more even),
  "texture": skin smoothness (higher = smoother),
  "wrinkles": wrinkle severity (higher = more wrinkles)
}

Be objective and provide realistic scores based on:
- glowScore: Overall radiance, hydration, and health
- evenness: Color uniformity, pigmentation, redness
- texture: Smoothness, pore visibility, surface quality
- wrinkles: Fine lines, creases, age-related texture
```

### 4. Parse AI Response
Extract the JSON from the AI's response text

### 5. Format Response
Return the expected JSON structure:

```json
{
  "analysis": {
    "glowScore": {{ $json.glowScore }},
    "evenness": {{ $json.evenness }},
    "texture": {{ $json.texture }},
    "wrinkles": {{ $json.wrinkles }}
  }
}
```

### 6. (Optional) Save to Database
You might want to save the analysis along with userId and userEmail for tracking/analytics.

---

## Error Handling

### If the webhook returns an error:

**HTTP 401**: User will be redirected to sign in
**HTTP 429**: User will see "Upgrade to Premium" prompt
**HTTP 500**: User will see "Analysis failed. Please try again."

### Make sure your n8n workflow:
- Returns HTTP 200 on success
- Returns proper error codes on failure
- Always returns valid JSON
- Handles image upload failures gracefully

---

## Testing the Integration

### 1. Test with curl:
```bash
curl -X POST https://shadow424.app.n8n.cloud/webhook/skin-scan-ai \
  -F "image=@test-selfie.jpg" \
  -F "userId=test-user-123" \
  -F "userEmail=test@example.com"
```

Expected response:
```json
{
  "analysis": {
    "glowScore": 75,
    "evenness": 68,
    "texture": 82,
    "wrinkles": 15
  }
}
```

### 2. Test in the app:
1. Sign in to SkinScan
2. Take a selfie on the `/scan` page
3. Click "Analyze My Skin"
4. Check browser console for logs:
   - `[Scan] Sending image to n8n webhook: https://shadow424...`
   - n8n should receive the request
5. Check n8n execution logs to see the workflow run

### 3. Verify the response:
The app should navigate to `/results/[scan-id]` with:
- Glow Score displayed prominently
- 5 metrics with severity indicators
- Strength and focus areas calculated

---

## Sample n8n Workflow (JSON)

Here's a basic n8n workflow structure you can import:

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {
        "path": "skin-scan-ai",
        "responseMode": "lastNode",
        "options": {}
      }
    },
    {
      "name": "AI Vision Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [450, 300],
      "parameters": {
        "resource": "image",
        "operation": "analyze",
        "text": "Analyze skin health. Return JSON: {glowScore, evenness, texture, wrinkles} (0-100)",
        "options": {
          "binaryData": "={{$binary.image}}"
        }
      }
    },
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [650, 300],
      "parameters": {
        "values": {
          "json": {
            "analysis": {
              "glowScore": "={{$json.glowScore}}",
              "evenness": "={{$json.evenness}}",
              "texture": "={{$json.texture}}",
              "wrinkles": "={{$json.wrinkles}}"
            }
          }
        }
      }
    }
  ]
}
```

---

## Troubleshooting

### "Failed to fetch" error
- Check n8n webhook is active and accessible
- Verify URL in `.env` is correct
- Check CORS settings in n8n (should allow any origin for webhooks)

### "Invalid webhook response format" error
- Verify JSON structure matches expected format
- Check that all 4 fields are present and are numbers
- Use browser Network tab to inspect actual response

### Wrong scores displayed
- Verify AI is returning 0-100 scale
- Check that evenness/wrinkles are being inverted correctly
- Test with known values to validate calculations

---

## Environment Variables

Make sure `.env` contains:
```env
VITE_N8N_WEBHOOK_URL="https://shadow424.app.n8n.cloud/webhook/skin-scan-ai"
```

**Important**: After changing `.env`, restart the dev server:
```bash
npm run dev
```

---

## Next Steps

1. ✅ Build your n8n workflow with AI vision analysis
2. ✅ Test with curl to verify response format
3. ✅ Test in the app with a real selfie
4. ✅ Monitor n8n execution logs for errors
5. ✅ Adjust AI prompts to get better scores

---

**Last Updated**: November 10, 2025
**Integration Status**: Ready for testing
