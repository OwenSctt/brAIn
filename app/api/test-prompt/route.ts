import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Error testing prompt:", error)
    return Response.json({ error: "Failed to test prompt" }, { status: 500 })
  }
}
