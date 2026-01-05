import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Braces, Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setIsValid(true);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      setError("");
      toast.success("Valid JSON!");
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
      toast.error("Invalid JSON");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is JSON formatting?",
      answer: "JSON formatting adds proper indentation and line breaks to make JSON data human-readable. This helps developers debug, review, and understand complex data structures."
    },
    {
      question: "What is JSON minification?",
      answer: "Minification removes all unnecessary whitespace from JSON, making the file size smaller. This is useful for production environments where bandwidth and speed matter."
    },
    {
      question: "How do I validate JSON?",
      answer: "Paste your JSON into the input field and click 'Validate'. The tool will check if the syntax is correct and show any errors with line numbers and descriptions."
    },
    {
      question: "What are common JSON errors?",
      answer: "Common errors include missing commas, unquoted keys, trailing commas, single quotes instead of double quotes, and unclosed brackets or braces."
    },
    {
      question: "Is this JSON formatter secure?",
      answer: "Yes! All processing happens locally in your browser. Your JSON data is never sent to any server, ensuring complete privacy and security."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="JSON Formatter & Validator - Beautify, Minify JSON Online Free"
        description="Free JSON formatter, beautifier, and validator. Format, minify, and validate JSON data online. Pretty print JSON with syntax highlighting."
        keywords="json formatter, json beautifier, json validator, format json, minify json, json prettifier, json online, json parser"
        canonical="https://pinetoolshub.com/json-formatter"
      />
      
      <ToolStructuredData
        toolName="JSON Formatter & Validator"
        toolDescription="Format, beautify, minify, and validate JSON data online."
        toolUrl="https://pinetoolshub.com/json-formatter"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="JSON Formatter"
        description="Format, beautify, minify, and validate JSON"
        icon={<Braces className="h-8 w-8" />}
        color="bg-yellow-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Input JSON</Label>
                  {isValid !== null && (
                    <span className={`flex items-center gap-1 text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                      {isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {isValid ? 'Valid' : 'Invalid'}
                    </span>
                  )}
                </div>
                <Textarea
                  placeholder='{"example": "paste your JSON here"}'
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setIsValid(null);
                    setError("");
                  }}
                  className="min-h-[300px] font-mono text-sm"
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button onClick={formatJson}>Format</Button>
                  <Button onClick={minifyJson} variant="outline">Minify</Button>
                  <Button onClick={validateJson} variant="outline">Validate</Button>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Output</Label>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Formatted/minified JSON will appear here"
                  className="min-h-[300px] font-mono text-sm bg-muted"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sample JSON */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Try with Sample JSON</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput('{"name":"John Doe","age":30,"email":"john@example.com","isActive":true,"tags":["developer","blogger"]}')}
                >
                  User Object
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput('[{"id":1,"title":"Post 1"},{"id":2,"title":"Post 2"},{"id":3,"title":"Post 3"}]')}
                >
                  Array of Objects
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput('{"config":{"theme":"dark","language":"en","notifications":{"email":true,"push":false}}}')}
                >
                  Nested Object
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online JSON Formatter</h2>
          <p className="text-muted-foreground mb-4">
            Format and beautify your JSON data with proper indentation, or minify it for production use. 
            Our validator catches syntax errors and helps you debug JSON issues quickly.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default JsonFormatter;
