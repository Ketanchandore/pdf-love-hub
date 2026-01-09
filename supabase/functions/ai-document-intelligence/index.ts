import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  type: "extract" | "chat" | "risk-analysis" | "key-data" | "compare";
  text: string;
  query?: string;
  documentType?: "invoice" | "contract" | "resume" | "general";
  conversationHistory?: Array<{ role: string; content: string }>;
}

const systemPrompts: Record<string, string> = {
  extract: `You are an expert document analyst. Extract all key data from the document in a structured format.

For INVOICES, extract:
- Invoice number, date, due date
- Vendor/Company name and address
- Customer/Bill to name and address
- Line items (description, quantity, unit price, total)
- Subtotal, tax, total amount
- Payment terms

For CONTRACTS, extract:
- Contract type and title
- Parties involved
- Effective date and term/duration
- Key obligations of each party
- Payment terms
- Important clauses (termination, liability, confidentiality)
- Signatures required

For RESUMES, extract:
- Name and contact info
- Professional summary
- Work experience (company, role, duration, achievements)
- Education
- Skills
- Certifications

Return as structured JSON:
{
  "documentType": "invoice|contract|resume|general",
  "extractedData": { ... },
  "confidence": "high|medium|low",
  "missingFields": ["field1", "field2"]
}`,

  chat: `You are an intelligent document assistant. Answer questions about the document accurately and helpfully.

Guidelines:
- Base answers ONLY on the document content provided
- If information is not in the document, say so clearly
- Quote relevant sections when helpful
- Be concise but thorough
- If asked about something ambiguous, explain the ambiguity`,

  "risk-analysis": `You are a legal and business risk analyst. Analyze the document for potential risks and issues.

Analyze for:
1. **Legal Risks**: Unfavorable clauses, liability exposure, compliance issues
2. **Financial Risks**: Payment terms, penalties, hidden costs
3. **Operational Risks**: Unrealistic deadlines, resource requirements
4. **Missing Protections**: What clauses are missing that should be there

Return as JSON:
{
  "overallRiskScore": "low|medium|high|critical",
  "summary": "Brief overall assessment",
  "risks": [
    {
      "category": "legal|financial|operational|compliance",
      "severity": "low|medium|high|critical",
      "title": "Short title",
      "description": "Detailed explanation",
      "location": "Where in document",
      "recommendation": "How to mitigate"
    }
  ],
  "positives": ["Good aspects of the document"],
  "recommendations": ["Top priority actions"]
}`,

  "key-data": `You are a data extraction specialist. Extract all named entities and key data points from the document.

Extract:
- **Names**: People, companies, organizations
- **Dates**: All dates mentioned with context
- **Numbers**: Monetary amounts, quantities, percentages
- **Locations**: Addresses, cities, countries
- **Contact Info**: Emails, phones, websites
- **Key Terms**: Important defined terms or jargon
- **Action Items**: Any tasks or obligations mentioned

Return as JSON:
{
  "entities": {
    "people": ["name1", "name2"],
    "organizations": ["org1", "org2"],
    "dates": [{"date": "...", "context": "..."}],
    "amounts": [{"value": "...", "context": "..."}],
    "locations": ["loc1", "loc2"],
    "contacts": ["email/phone"],
    "keyTerms": [{"term": "...", "definition": "..."}],
    "actionItems": ["item1", "item2"]
  },
  "summary": "Brief document summary"
}`,

  compare: `You are a document comparison specialist. Compare the two documents and identify:

1. **Added Content**: New sections or clauses in Document 2
2. **Removed Content**: Sections removed from Document 1
3. **Modified Content**: Changes to existing sections
4. **Semantic Changes**: Changes that alter the meaning or obligations
5. **Impact Assessment**: Whether changes favor Party A, Party B, or neutral

Return as JSON:
{
  "summary": "Overall comparison summary",
  "totalChanges": number,
  "significantChanges": number,
  "changes": [
    {
      "type": "added|removed|modified",
      "location": "Section/clause reference",
      "original": "Original text (if applicable)",
      "new": "New text (if applicable)",
      "impact": "high|medium|low",
      "favors": "party_a|party_b|neutral",
      "explanation": "What this change means"
    }
  ],
  "riskAssessment": "Overall risk of accepting these changes"
}`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, text, query, documentType, conversationHistory } = (await req.json()) as RequestBody;

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
    const messages: Array<{ role: string; content: string }> = [];

    // Build messages based on type
    if (type === "chat" && conversationHistory) {
      messages.push({ role: "system", content: systemPrompt + `\n\nDocument content:\n${text.slice(0, 15000)}` });
      messages.push(...conversationHistory);
      if (query) {
        messages.push({ role: "user", content: query });
      }
    } else if (type === "extract" && documentType) {
      systemPrompt += `\n\nFocus on extracting ${documentType}-specific data.`;
      messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: text.slice(0, 20000) });
    } else {
      messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: text.slice(0, 20000) });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
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

    // Parse JSON responses
    let result = content;
    if (type !== "chat") {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
      }
    }

    return new Response(
      JSON.stringify({ result, type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI document intelligence error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
