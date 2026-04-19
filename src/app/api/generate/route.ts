import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const groq = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { idea, format, tone, vstyle, palette, slideCount } = body

    if (!idea?.trim()) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    const numSlides =
      format === 'carousel'
        ? Math.min(Math.max(Number(slideCount) || 5, 2), 10)
        : 1

    const systemPrompt = `
You must return ONLY valid JSON.
Do NOT include markdown, backticks, or explanations.
Do NOT include line breaks inside string values.
All keys and strings must use double quotes.
Start with { and end with }.

JSON structure:
{
  "title": "short creative title",
  "slides": [
    {
      "headline": "short headline",
      "subtext": "short subtext",
      "body": "optional body",
      "type": "hook",
      "emoji": "🧠"
    }
  ],
  "caption": "caption text",
  "hashtags": ["#tag1","#tag2"]
}

Rules:
- Tone: ${tone}
- Style: ${vstyle}
- Format: ${format}
- Slides: ${numSlides}
- Keep it simple, clean, and useful
`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Create content for: "${idea.trim()}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const rawText = response.choices[0]?.message?.content || ''

    // 🔥 Extract ONLY JSON (ignore garbage text)
    const match = rawText.match(/\{[\s\S]*\}/)

    if (!match) {
      console.error('RAW AI RESPONSE:\n', rawText)
      throw new Error('AI did not return valid JSON')
    }

    let parsed

    try {
      parsed = JSON.parse(match[0])
    } catch (err) {
      console.error('INVALID JSON:\n', match[0])
      throw new Error('Invalid JSON from AI')
    }

    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      throw new Error('Invalid response structure')
    }

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('Generate error:', err?.message || err)

    return NextResponse.json(
      { error: err?.message || 'Generation failed' },
      { status: 500 }
    )
  }
}