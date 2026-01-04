import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ALargeSmall, Copy, Trash2, ArrowDown } from "lucide-react";
import { toast } from "sonner";

const CaseConverter = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const toUpperCase = () => {
    setOutputText(inputText.toUpperCase());
    toast.success("Converted to UPPERCASE!");
  };

  const toLowerCase = () => {
    setOutputText(inputText.toLowerCase());
    toast.success("Converted to lowercase!");
  };

  const toTitleCase = () => {
    const result = inputText.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    setOutputText(result);
    toast.success("Converted to Title Case!");
  };

  const toSentenceCase = () => {
    const result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
    setOutputText(result);
    toast.success("Converted to Sentence case!");
  };

  const toCamelCase = () => {
    const result = inputText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^[A-Z]/, char => char.toLowerCase());
    setOutputText(result);
    toast.success("Converted to camelCase!");
  };

  const toPascalCase = () => {
    const result = inputText
      .toLowerCase()
      .replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, char) => char.toUpperCase());
    setOutputText(result);
    toast.success("Converted to PascalCase!");
  };

  const toSnakeCase = () => {
    const result = inputText
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    setOutputText(result);
    toast.success("Converted to snake_case!");
  };

  const toKebabCase = () => {
    const result = inputText
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    setOutputText(result);
    toast.success("Converted to kebab-case!");
  };

  const toAlternatingCase = () => {
    const result = inputText
      .split("")
      .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join("");
    setOutputText(result);
    toast.success("Converted to aLtErNaTiNg CaSe!");
  };

  const toInverseCase = () => {
    const result = inputText
      .split("")
      .map(char => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
      .join("");
    setOutputText(result);
    toast.success("Converted to iNVERSE cASE!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Converted text copied to clipboard!");
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    toast.success("Cleared!");
  };

  const faqs = [
    {
      question: "What is a case converter tool?",
      answer: "A case converter tool transforms text between different letter case formats. You can convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and more. It's essential for writers, developers, and anyone who needs to quickly change text formatting."
    },
    {
      question: "Is this case converter free to use?",
      answer: "Yes! PineToolsHub case converter is 100% free with no limits. Convert unlimited text between any case formats. No signup, no registration, no hidden fees - just paste your text and convert instantly."
    },
    {
      question: "What case formats are supported?",
      answer: "We support all major case formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase (for programming), PascalCase, snake_case (for databases), kebab-case (for URLs), aLtErNaTiNg CaSe, and iNVERSE cASE. Perfect for any use case!"
    },
    {
      question: "Why do developers need case conversion?",
      answer: "Developers frequently need to convert between naming conventions. camelCase is used in JavaScript variables, snake_case in Python and databases, kebab-case in URLs and CSS, and PascalCase for class names. Our tool makes these conversions instant and error-free."
    },
    {
      question: "Can I use this for long documents?",
      answer: "Absolutely! There's no character limit. You can paste entire documents, essays, or articles and convert the entire text to any case format instantly. The conversion happens in your browser, so it's fast regardless of text length."
    },
    {
      question: "What's the difference between Title Case and Sentence case?",
      answer: "Title Case capitalizes the first letter of every word (like book titles), while Sentence case only capitalizes the first letter of each sentence (like normal writing). For example: 'The Quick Brown Fox' (Title Case) vs 'The quick brown fox' (Sentence case)."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Case Converter - Change Text Case Online Free | UPPERCASE lowercase Title Case"
        description="Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case & more. Free online case converter tool - no signup required. Change text case instantly!"
        keywords="case converter, uppercase converter, lowercase converter, title case converter, sentence case, camelCase converter, snake_case, text case changer, change text case online"
        canonical="https://pinetoolshub.com/case-converter"
      />
      
      <ToolStructuredData
        toolName="Case Converter - Free Text Case Changer Tool"
        toolDescription="Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly."
        toolUrl="https://pinetoolshub.com/case-converter"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Case Converter"
        description="Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case & more. Free instant text case changer!"
        icon={<ALargeSmall className="h-8 w-8" />}
        color="bg-violet-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Enter Your Text</label>
            <Textarea
              placeholder="Type or paste your text here to convert case..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] text-base"
            />
          </div>

          {/* Conversion Buttons */}
          <Card className="bg-card border-border mb-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Choose conversion type:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Button onClick={toUpperCase} variant="outline" size="sm" disabled={!inputText}>
                  UPPERCASE
                </Button>
                <Button onClick={toLowerCase} variant="outline" size="sm" disabled={!inputText}>
                  lowercase
                </Button>
                <Button onClick={toTitleCase} variant="outline" size="sm" disabled={!inputText}>
                  Title Case
                </Button>
                <Button onClick={toSentenceCase} variant="outline" size="sm" disabled={!inputText}>
                  Sentence case
                </Button>
                <Button onClick={toCamelCase} variant="outline" size="sm" disabled={!inputText}>
                  camelCase
                </Button>
                <Button onClick={toPascalCase} variant="outline" size="sm" disabled={!inputText}>
                  PascalCase
                </Button>
                <Button onClick={toSnakeCase} variant="outline" size="sm" disabled={!inputText}>
                  snake_case
                </Button>
                <Button onClick={toKebabCase} variant="outline" size="sm" disabled={!inputText}>
                  kebab-case
                </Button>
                <Button onClick={toAlternatingCase} variant="outline" size="sm" disabled={!inputText}>
                  aLtErNaTiNg
                </Button>
                <Button onClick={toInverseCase} variant="outline" size="sm" disabled={!inputText}>
                  iNVERSE
                </Button>
              </div>
            </CardContent>
          </Card>

          {outputText && (
            <div className="flex justify-center mb-4">
              <ArrowDown className="h-6 w-6 text-muted-foreground animate-bounce" />
            </div>
          )}

          {/* Output */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Converted Text</label>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Converted text will appear here..."
              className="min-h-[150px] text-base bg-muted/30"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={copyToClipboard} disabled={!outputText} variant="default">
              <Copy className="h-4 w-4 mr-2" />
              Copy Result
            </Button>
            <Button onClick={clearAll} disabled={!inputText && !outputText} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Text Case Converter</h2>
          <p className="text-muted-foreground mb-4">
            Need to change text case quickly? Our free case converter tool transforms text between UPPERCASE, lowercase, 
            Title Case, and programming cases like camelCase and snake_case. Perfect for writers, developers, students, 
            and anyone working with text formatting.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">All Case Formats Explained</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>UPPERCASE:</strong> ALL LETTERS CAPITALIZED - great for headlines and emphasis</li>
            <li><strong>lowercase:</strong> all letters small - for casual text or data normalization</li>
            <li><strong>Title Case:</strong> First Letter Of Each Word Capitalized - for titles and headings</li>
            <li><strong>Sentence case:</strong> First letter of sentence capitalized - normal writing style</li>
            <li><strong>camelCase:</strong> firstWordLowerThenCapitalized - JavaScript variable naming</li>
            <li><strong>PascalCase:</strong> EachWordCapitalized - class names in programming</li>
            <li><strong>snake_case:</strong> words_separated_by_underscores - Python and database columns</li>
            <li><strong>kebab-case:</strong> words-separated-by-hyphens - URLs and CSS classes</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default CaseConverter;
