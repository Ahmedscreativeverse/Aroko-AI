import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/server'

interface GenerateRequest {
  projectId: string
  idea: string
  industry: string
  targetAudience: string
  tone: string
}

const EXPECTED_KEYS = [
  'creative_brief',
  'audience_analysis',
  'brand_voice',
  'marketing_strategy',
  'instagram_caption',
  'linkedin_post',
  'twitter_thread',
  'facebook_post',
  'call_to_action',
  'hashtags',
  'seo_keywords',
  'publishing_recommendations',
] as const

function buildPrompt(params: GenerateRequest) {
  return `You are a creative content strategist. Generate comprehensive marketing content for:
  
Idea: ${params.idea}
Industry: ${params.industry}
Target Audience: ${params.targetAudience}
Tone: ${params.tone}

Generate ONLY a valid JSON object with NO markdown formatting, NO code blocks, and NO explanations. Return this exact structure:
{
  "creative_brief": "A comprehensive creative brief (200-300 words)",
  "audience_analysis": "Deep analysis of target audience (150-200 words)",
  "brand_voice": "Brand voice and messaging guidelines (100-150 words)",
  "marketing_strategy": "Overall marketing strategy (200-300 words)",
  "instagram_caption": "Instagram post caption with emojis (80-120 words)",
  "linkedin_post": "Professional LinkedIn post (100-150 words)",
  "twitter_thread": "5-tweet thread with no > 280 chars per tweet",
  "facebook_post": "Engaging Facebook post (100-150 words)",
  "call_to_action": "Compelling CTA with urgency",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "publishing_recommendations": "Optimal times and channels to publish (100-150 words)"
}

Return ONLY the JSON, nothing else. Start with { and end with }`
}

// --- IBM watsonx.ai (Granite) integration ---
// Configured via WATSONX_API_KEY, WATSONX_PROJECT_ID, and optionally
// WATSONX_URL / WATSONX_MODEL_ID. When these aren't set, generation falls
// back to deterministic mock content so local/dev work still functions.
let cachedIamToken: { token: string; expiresAt: number } | null = null

async function getWatsonxIamToken(apiKey: string): Promise<string> {
  if (cachedIamToken && cachedIamToken.expiresAt > Date.now() + 30_000) {
    return cachedIamToken.token
  }

  const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: apiKey,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with IBM Cloud (watsonx.ai)')
  }

  const data = await response.json()
  cachedIamToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  }
  return cachedIamToken.token
}

function extractJson(rawText: string): Record<string, any> {
  const firstBrace = rawText.indexOf('{')
  const lastBrace = rawText.lastIndexOf('}')
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error('Model response did not contain a JSON object')
  }
  const jsonSlice = rawText.slice(firstBrace, lastBrace + 1)
  const parsed = JSON.parse(jsonSlice)

  const missing = EXPECTED_KEYS.filter((key) => !(key in parsed))
  if (missing.length > 0) {
    throw new Error(`Model response missing fields: ${missing.join(', ')}`)
  }

  return parsed
}

async function generateWithGemini(prompt: string): Promise<{ content: Record<string, any>; tokens: number }> {
  const apiKey = process.env.GEMINI_API_KEY!
const modelId = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          // Gemini can be asked to return raw JSON directly - no need to
          // fish a JSON object out of surrounding prose like the watsonx
          // path below has to.
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Gemini request failed (${response.status}): ${errorBody.slice(0, 300)}`)
  }

  const result = await response.json()
  const generatedText: string | undefined = result?.candidates?.[0]?.content?.parts?.[0]?.text
  const tokenCount: number = result?.usageMetadata?.totalTokenCount ?? 0

  if (!generatedText) {
    throw new Error('Gemini returned no generated text')
  }

  return { content: extractJson(generatedText), tokens: tokenCount }
}

async function generateWithGranite(prompt: string): Promise<{ content: Record<string, any>; tokens: number }> {
  const apiKey = process.env.WATSONX_API_KEY!
  const projectId = process.env.WATSONX_PROJECT_ID!
  const baseUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com'
  const modelId = process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct'

  const iamToken = await getWatsonxIamToken(apiKey)

  const response = await fetch(`${baseUrl}/ml/v1/text/generation?version=2024-05-01`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${iamToken}`,
    },
    body: JSON.stringify({
      input: prompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 2000,
        min_new_tokens: 0,
        repetition_penalty: 1,
      },
      model_id: modelId,
      project_id: projectId,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`watsonx.ai request failed (${response.status}): ${errorBody.slice(0, 300)}`)
  }

  const result = await response.json()
  const generatedText: string | undefined = result?.results?.[0]?.generated_text
  const tokenCount: number = result?.results?.[0]?.generated_token_count ?? 0

  if (!generatedText) {
    throw new Error('watsonx.ai returned no generated text')
  }

  return { content: extractJson(generatedText), tokens: tokenCount }
}

async function generateContent(params: GenerateRequest) {
  const startTime = Date.now()
  const isGeminiConfigured = !!process.env.GEMINI_API_KEY
  const isWatsonxConfigured = !!process.env.WATSONX_API_KEY && !!process.env.WATSONX_PROJECT_ID

  if (isGeminiConfigured) {
    const prompt = buildPrompt(params)
    const { content, tokens } = await generateWithGemini(prompt)
    return {
      content,
      tokens,
      generationTimeMs: Date.now() - startTime,
    }
  }

  if (isWatsonxConfigured) {
    const prompt = buildPrompt(params)
    const { content, tokens } = await generateWithGranite(prompt)
    return {
      content,
      tokens,
      generationTimeMs: Date.now() - startTime,
    }
  }

  // No AI provider configured - fall back to mock content so the app still
  // works end-to-end without any AI credentials.
  console.warn(
    'No AI provider configured (GEMINI_API_KEY or WATSONX_API_KEY/WATSONX_PROJECT_ID) - returning mock generated content.'
  )

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const content = {
    creative_brief: `Craft a compelling narrative that positions "${params.idea}" as the solution to ${params.targetAudience}'s pain points. This brief should establish clear brand positioning, value proposition, and emotional connection points. Focus on creating content that resonates with the ${params.tone} tone while addressing specific industry challenges in ${params.industry}.`,
    audience_analysis: `The target audience consists of ${params.targetAudience}. They value innovation and authenticity. Key decision factors include relevance, credibility, and alignment with their values. Understanding their digital behavior and content preferences is crucial for effective engagement.`,
    brand_voice: `The brand voice is ${params.tone}. Maintain consistency across all channels. Use clear, concise language that builds trust. Balance professionalism with approachability to create meaningful connections.`,
    marketing_strategy: `Launch multi-channel campaign highlighting "${params.idea}". Focus on storytelling that connects emotionally with ${params.targetAudience}. Leverage user-generated content and testimonials. Measure success through engagement metrics and conversion rates.`,
    instagram_caption: `Introducing ${params.idea}! 🚀 Transform your ${params.industry} experience. Join thousands discovering innovation today. #Innovation #${params.industry} 💡`,
    linkedin_post: `Thought leadership piece: How "${params.idea}" is reshaping ${params.industry}. Explore the strategic impact and opportunities for ${params.targetAudience}. Learn why forward-thinking organizations are adopting this approach.`,
    twitter_thread: `1. Introducing "${params.idea}" - the game-changer for ${params.industry}\n2. Traditional approaches fall short. Here's why.\n3. Our solution addresses core pain points directly.\n4. Results: Faster, better, more efficient.\n5. Ready to lead? Join the movement.`,
    facebook_post: `We're excited to introduce "${params.idea}" to the ${params.industry} community! Designed with ${params.targetAudience} in mind, this innovative solution delivers real results. Learn how it can transform your approach.`,
    call_to_action: `Start Your Free Trial Today - Limited Time Offer!`,
    hashtags: ['#innovation', `#${params.industry}`, '#FutureReady', '#TransformNow', '#DigitalFirst'],
    seo_keywords: [params.idea, params.industry, params.targetAudience, 'innovation', 'transformation'],
    publishing_recommendations: `Best times to publish: Tuesday-Thursday, 9-11 AM. Prioritize LinkedIn for B2B reach, Instagram for visual storytelling. Repurpose content across all platforms for consistency. Monitor engagement and adjust timing based on audience activity patterns.`,
  }

  const generationTimeMs = Date.now() - startTime

  return {
    content,
    tokens: Math.floor(Math.random() * 2000) + 1000, // Mock token count
    generationTimeMs,
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: GenerateRequest = await request.json()

    // Validate required fields
    if (!data.projectId || !data.idea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user authentication via JWT
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in and try again.' },
        { status: 401 }
      )
    }

    const accessToken = authHeader.slice('Bearer '.length)

    // Get Supabase client (service role - bypasses RLS, so we must verify the token ourselves)
    const supabase = getServiceRoleClient()

    // Verify the token is actually valid rather than just present, and use the
    // verified user id instead of trusting a client-supplied value.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Session expired. Please sign in again.' },
        { status: 401 }
      )
    }

    // Generate content
    const { content, tokens, generationTimeMs } = await generateContent(data)

    // Get current version count
    const { count } = await supabase
      .from('project_versions')
      .select('*', { count: 'exact' })
      .eq('project_id', data.projectId)

    const versionNumber = (count || 0) + 1

    // Create project version
    const { data: version, error: versionError } = await supabase
      .from('project_versions')
      .insert({
        project_id: data.projectId,
        version_number: versionNumber,
        content,
        generation_tokens: tokens,
        generation_time_ms: generationTimeMs,
      })
      .select()
      .single()

    if (versionError) throw versionError

    // Log generation history
    const { error: historyError } = await supabase
      .from('generation_history')
      .insert({
        user_id: user.id,
        project_id: data.projectId,
        version_id: version.id,
        tokens_used: tokens,
        generation_time_ms: generationTimeMs,
        status: 'completed',
      })

    if (historyError) console.error('Failed to log generation history:', historyError)

    return NextResponse.json({
      success: true,
      versionId: version.id,
      versionNumber,
      content,
      metadata: {
        tokens,
        generationTimeMs,
      },
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    )
  }
}