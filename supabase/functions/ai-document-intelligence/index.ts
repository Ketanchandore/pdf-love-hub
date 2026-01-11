import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  type?: string;
  action?: string;
  text?: string;
  query?: string;
  documentType?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  resumeText?: string;
  jobDescription?: string;
  style?: string;
  durationMinutes?: number;
  bankHint?: string;
  slideCount?: number;
  categories?: string[];
  context?: string;
  documentNames?: string[];
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

  compare: `You are a document comparison specialist. Compare the two documents and identify differences.`,

  "resume-optimizer": `You are an expert ATS (Applicant Tracking System) resume optimizer. Analyze the resume against the job description.

Your task:
1. Calculate an ATS compatibility score (0-100)
2. Identify keywords from the job description that ARE in the resume
3. Identify keywords that are MISSING from the resume
4. List strengths of the resume for this specific job
5. List weaknesses or areas to improve
6. Provide specific, actionable suggestions to optimize the resume

Return as JSON:
{
  "atsScore": number (0-100),
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["specific suggestion 1", "specific suggestion 2", ...],
  "optimizedSummary": "A brief rewritten professional summary optimized for this job"
}`,

  "pdf-to-podcast": `You are a podcast script writer. Convert the document content into an engaging two-person podcast conversation.

Create a natural dialogue between:
- HOST: Asks questions, guides the conversation, summarizes key points
- EXPERT: Explains concepts, provides insights, shares the document's key information

Guidelines:
- Make it conversational and engaging, not a dry reading
- Break complex topics into digestible segments
- Include natural transitions and reactions
- Cover the most important points from the document
- Add context and explanations where helpful

Return as JSON:
{
  "segments": [
    {"speaker": "host", "text": "Welcome to today's episode..."},
    {"speaker": "expert", "text": "Thanks for having me..."},
    ...
  ]
}`,

  "bank-statement-extract": `You are a financial document specialist. Extract transaction data from this bank statement.

Extract:
1. Bank name and account details
2. Statement period
3. Opening and closing balance
4. All transactions with: date, description, amount, type (credit/debit), category

Categories to use: Salary, Transfer, Shopping, Food, Utilities, Entertainment, Healthcare, Transport, Investment, ATM, Fee, Other

Return as JSON:
{
  "bankName": "Bank Name",
  "accountNumber": "****1234",
  "period": "Jan 1 - Jan 31, 2024",
  "openingBalance": 1000.00,
  "closingBalance": 1500.00,
  "totalCredits": 2000.00,
  "totalDebits": 1500.00,
  "transactions": [
    {"date": "Jan 5", "description": "Direct Deposit - Employer", "amount": 2000.00, "type": "credit", "category": "Salary"},
    {"date": "Jan 6", "description": "Amazon Purchase", "amount": 50.00, "type": "debit", "category": "Shopping"},
    ...
  ]
}`,

  "contract-risk-analysis": `You are a legal contract risk analyst. Analyze this contract for potential risks, red flags, and missing protections.

Provide:
1. Overall safety score (0-100, where 100 is safest)
2. Contract type identification
3. Key parties involved
4. Important dates (effective, termination)
5. Key terms summary
6. Detailed risk analysis with severity levels
7. Missing clauses that should be present

Return as JSON:
{
  "overallRiskScore": 75,
  "contractType": "Employment Agreement",
  "parties": ["Company Inc.", "John Doe"],
  "effectiveDate": "January 1, 2024",
  "terminationDate": "December 31, 2024",
  "keyTerms": {
    "paymentTerms": "Monthly salary of $X",
    "terminationClause": "30 days notice required",
    "liabilityLimit": "Limited to contract value",
    "confidentiality": "2 year post-employment NDA"
  },
  "risks": [
    {
      "title": "Non-compete is overly broad",
      "description": "The non-compete clause restricts work in the entire industry for 2 years",
      "severity": "high",
      "clause": "Section 5.2: Employee shall not work for any competitor...",
      "recommendation": "Negotiate to limit geographic scope and duration"
    }
  ],
  "missingClauses": ["Dispute resolution mechanism", "Force majeure clause"],
  "summary": "Overall assessment of the contract"
}`,

  "linkedin-carousel": `You are a LinkedIn content strategist. Convert this document into engaging carousel slides for LinkedIn.

Create slides that:
1. Start with a hook/title slide
2. Break down key insights into bite-sized points
3. Use simple, impactful language
4. End with a call-to-action or takeaway

Each slide should have:
- A short, punchy title (max 8 words)
- Supporting content (2-3 sentences max)

Return as JSON:
{
  "slides": [
    {"slideNumber": 1, "title": "Hook Title Here", "content": "Opening content that grabs attention"},
    {"slideNumber": 2, "title": "Key Point 1", "content": "Explanation of this insight"},
    ...
    {"slideNumber": N, "title": "Key Takeaway", "content": "Call to action or summary"}
  ]
}`,

  "detect-pii": `You are a privacy and data protection specialist. Scan this document for Personally Identifiable Information (PII).

Detect and locate:
- Social Security Numbers (SSN)
- Credit card numbers
- Phone numbers
- Email addresses
- Physical addresses
- Person names
- Dates of birth
- Bank account numbers

For each match, provide:
- Type of PII
- The actual value found
- Confidence level (0-1)
- Approximate location (page number if available)

Return as JSON:
{
  "matches": [
    {"type": "ssn", "value": "123-45-6789", "confidence": 0.95, "position": {"page": 1, "start": 150, "end": 161}},
    {"type": "email", "value": "john@example.com", "confidence": 1.0, "position": {"page": 1, "start": 200, "end": 216}},
    {"type": "phone", "value": "(555) 123-4567", "confidence": 0.9, "position": {"page": 2, "start": 50, "end": 64}},
    ...
  ],
  "summary": "Found X instances of sensitive information"
}`,

  "knowledge-vault-query": `You are a knowledgeable research assistant. Answer questions based on the provided documents.

Guidelines:
1. ONLY use information from the provided documents
2. If you can't find the answer, say so clearly
3. Cite which document(s) the information comes from
4. Be thorough but concise
5. If there are contradictions between documents, mention them

Return as JSON:
{
  "answer": "Your detailed answer here, referencing the source documents...",
  "sources": ["document1.pdf", "document2.pdf"],
  "confidence": "high|medium|low",
  "relatedTopics": ["topic1", "topic2"]
}`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;
    
    // Support both 'type' and 'action' fields
    const actionType = body.action || body.type;

    if (!actionType) {
      return new Response(
        JSON.stringify({ error: "Missing required field: action or type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const messages: Array<{ role: string; content: string }> = [];
    let systemPrompt = "";

    // Handle different action types
    switch (actionType) {
      case "resume-optimizer": {
        systemPrompt = systemPrompts["resume-optimizer"];
        const userContent = `Resume:\n${body.resumeText?.slice(0, 10000)}\n\nJob Description:\n${body.jobDescription?.slice(0, 5000)}`;
        messages.push({ role: "system", content: systemPrompt });
        messages.push({ role: "user", content: userContent });
        break;
      }

      case "pdf-to-podcast": {
        systemPrompt = systemPrompts["pdf-to-podcast"];
        const styleNote = body.style ? `\n\nStyle: ${body.style}` : "";
        const durationNote = body.durationMinutes ? `\nTarget duration: approximately ${body.durationMinutes} minutes of content.` : "";
        messages.push({ role: "system", content: systemPrompt + styleNote + durationNote });
        messages.push({ role: "user", content: body.text?.slice(0, 15000) || "" });
        break;
      }

      case "bank-statement-extract": {
        systemPrompt = systemPrompts["bank-statement-extract"];
        const bankNote = body.bankHint ? `\n\nNote: This appears to be from ${body.bankHint}.` : "";
        messages.push({ role: "system", content: systemPrompt + bankNote });
        messages.push({ role: "user", content: body.text?.slice(0, 20000) || "" });
        break;
      }

      case "contract-risk-analysis": {
        systemPrompt = systemPrompts["contract-risk-analysis"];
        messages.push({ role: "system", content: systemPrompt });
        messages.push({ role: "user", content: body.text?.slice(0, 20000) || "" });
        break;
      }

      case "linkedin-carousel": {
        systemPrompt = systemPrompts["linkedin-carousel"];
        const slideNote = body.slideCount ? `\n\nCreate exactly ${body.slideCount} slides.` : "\n\nCreate 5-7 slides.";
        messages.push({ role: "system", content: systemPrompt + slideNote });
        messages.push({ role: "user", content: body.text?.slice(0, 10000) || "" });
        break;
      }

      case "detect-pii": {
        systemPrompt = systemPrompts["detect-pii"];
        const categoriesNote = body.categories?.length 
          ? `\n\nFocus on detecting: ${body.categories.join(", ")}` 
          : "";
        messages.push({ role: "system", content: systemPrompt + categoriesNote });
        messages.push({ role: "user", content: body.text?.slice(0, 20000) || "" });
        break;
      }

      case "knowledge-vault-query": {
        systemPrompt = systemPrompts["knowledge-vault-query"];
        const docsContext = `Documents in vault: ${body.documentNames?.join(", ") || "Unknown"}\n\nDocument Contents:\n${body.context?.slice(0, 30000) || ""}`;
        messages.push({ role: "system", content: systemPrompt + "\n\n" + docsContext });
        messages.push({ role: "user", content: body.query || "" });
        break;
      }

      case "chat": {
        systemPrompt = systemPrompts.chat;
        messages.push({ role: "system", content: systemPrompt + `\n\nDocument content:\n${body.text?.slice(0, 15000)}` });
        if (body.conversationHistory) {
          messages.push(...body.conversationHistory);
        }
        if (body.query) {
          messages.push({ role: "user", content: body.query });
        }
        break;
      }

      default: {
        // Handle legacy types: extract, risk-analysis, key-data, compare
        systemPrompt = systemPrompts[actionType] || systemPrompts.extract;
        if (actionType === "extract" && body.documentType) {
          systemPrompt += `\n\nFocus on extracting ${body.documentType}-specific data.`;
        }
        messages.push({ role: "system", content: systemPrompt });
        messages.push({ role: "user", content: body.text?.slice(0, 20000) || "" });
      }
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

    // Parse JSON responses for non-chat actions
    let result = content;
    if (actionType !== "chat") {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        // Return raw content if JSON parsing fails
        result = { rawContent: content };
      }
    }

    return new Response(
      JSON.stringify(result),
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
