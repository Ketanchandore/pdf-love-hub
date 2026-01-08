import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  type: "summarize" | "flashcards" | "questions" | "mindmap" | "study-plan";
  text: string;
  options?: {
    numFlashcards?: number;
    numQuestions?: number;
    difficulty?: "easy" | "medium" | "hard";
    subject?: string;
  };
}

const systemPrompts: Record<string, string> = {
  summarize: `You are an expert study assistant. Summarize the given text into clear, concise bullet points that capture the key concepts. Focus on:
- Main ideas and themes
- Important facts and figures
- Key definitions and terms
- Relationships between concepts

Format your response as a structured summary with sections if the content covers multiple topics.`,

  flashcards: `You are an expert study assistant. Create flashcards from the given text. Each flashcard should:
- Have a clear, specific question on the front
- Have a concise, accurate answer on the back
- Cover key concepts, definitions, and important facts
- Be suitable for spaced repetition learning

Return your response as a JSON array with this format:
[{"front": "question", "back": "answer"}]

Only return the JSON array, no other text.`,

  questions: `You are an expert exam preparation assistant. Generate practice exam questions from the given text. Include:
- Multiple choice questions (4 options each)
- Short answer questions
- True/False questions

Mix difficulty levels. For each question, provide:
- The question
- The correct answer
- A brief explanation

Return as JSON array:
[{"type": "mcq|short|tf", "question": "...", "options": ["a","b","c","d"] (for mcq), "answer": "...", "explanation": "..."}]

Only return the JSON array, no other text.`,

  mindmap: `You are an expert at organizing information visually. Create a text-based mindmap from the given content. Use this format:

# Central Topic
## Main Branch 1
### Sub-topic 1.1
- Detail point
- Detail point
### Sub-topic 1.2
- Detail point
## Main Branch 2
### Sub-topic 2.1
- Detail point

Make it comprehensive but well-organized. Capture all key relationships between concepts.`,

  "study-plan": `You are an expert study coach. Based on the given content, create a detailed study plan. Include:
- Recommended study sessions with topics
- Time estimates for each session
- Priority levels for different topics
- Suggested review intervals
- Practice activities

Format as a structured plan that students can follow.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, text, options } = (await req.json()) as RequestBody;

    if (!type || !text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type and text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = systemPrompts[type];
    
    // Customize based on options
    if (options?.numFlashcards && type === "flashcards") {
      systemPrompt += `\n\nGenerate exactly ${options.numFlashcards} flashcards.`;
    }
    if (options?.numQuestions && type === "questions") {
      systemPrompt += `\n\nGenerate exactly ${options.numQuestions} questions.`;
    }
    if (options?.difficulty && type === "questions") {
      systemPrompt += `\n\nFocus on ${options.difficulty} difficulty questions.`;
    }
    if (options?.subject) {
      systemPrompt += `\n\nThis content is about: ${options.subject}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    // Parse JSON responses for flashcards and questions
    let result = content;
    if (type === "flashcards" || type === "questions") {
      try {
        // Extract JSON from response (handle potential markdown code blocks)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        // Return raw content if JSON parsing fails
      }
    }

    return new Response(
      JSON.stringify({ result, type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI study assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
