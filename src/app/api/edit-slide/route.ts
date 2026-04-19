import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const ACTION_MAP: Record<string, string> = {
  shorter: 'Make the headline maximum 5 words and subtext maximum 1 short sentence. Preserve the core message.',
  punchier: 'Rewrite to be bolder and more attention-grabbing. Use power words, active voice, create urgency. Make it impossible to scroll past.',
  stat: 'Add a surprising real-world statistic or research finding in the body field. Keep other fields.',
  fun: 'Make it more playful and energetic. Change the emoji to something expressive and fitting.',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    let userMessage = ''
    const systemPrompt = `You are a social media copywriter. Respond ONLY with a raw JSON object, no markdown, no backticks, no explanation. Structure: {"headline":"...","subtext":"...","body":"...","type":"...","emoji":"..."}`

    if (body.action) {
      // Edit action
      const { slide, slideIndex, totalSlides, action, tone, idea } = body
      userMessage = `Edit this slide (${slideIndex + 1}/${totalSlides}). Action: ${ACTION_MAP[action] || action}\nTone: ${tone}\nIdea context: ${idea}\n\nCurrent slide:\n${JSON.stringify(slide)}\n\nReturn updated JSON with same structure.`
    } else {
      // Regenerate
      const { slideIndex, totalSlides, slideType, idea, tone } = body
      userMessage = `Completely reimagine slide ${slideIndex + 1} of ${totalSlides} for the topic: "${idea}". Slide type: ${slideType}. Tone: ${tone}. Make it feel fresh and different. Return JSON: {"headline":"...","subtext":"...","body":"...","type":"...","emoji":"..."}`
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.9,
    })

    const rawText = response.choices[0]?.message?.content || ''
    const clean = rawText
      .replace(/```json|```/gi, '')
     .replace(/\n/g, '\\n')   // ✅ escape newlines
     .replace(/\r/g, '\\r')
     .replace(/\t/g, '\\t')
     .trim()

    let updated
    try {
      updated = JSON.parse(clean)
    } catch {
      const match = clean.match(/\{[\s\S]*\}/)
      if (match) updated = JSON.parse(match[0])
      else throw new Error('Could not parse response')
    }

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('Edit slide error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Edit failed' }, { status: 500 })
  }
}
