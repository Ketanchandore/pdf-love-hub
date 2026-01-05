import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Copy, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

const UrlEncoder = () => {
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");

  const encode = () => {
    try {
      setEncodeOutput(encodeURIComponent(encodeInput));
    } catch {
      toast.error("Unable to encode URL");
    }
  };

  const decode = () => {
    try {
      setDecodeOutput(decodeURIComponent(decodeInput));
    } catch {
      toast.error("Invalid encoded URL");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is URL encoding?",
      answer: "URL encoding converts characters that are unsafe for URLs into a format that can be transmitted. Special characters are replaced with % followed by their hexadecimal ASCII value."
    },
    {
      question: "Why do I need to encode URLs?",
      answer: "URLs can only contain certain characters. Spaces, special characters, and non-ASCII characters must be encoded to be safely transmitted in URLs, query strings, and form data."
    },
    {
      question: "What characters get encoded?",
      answer: "Characters like spaces, &, ?, =, +, and non-ASCII characters get encoded. For example, space becomes %20, & becomes %26, and so on."
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer: "encodeURI encodes a complete URL (keeping : / ? = &), while encodeURIComponent encodes everything including those characters. Our tool uses encodeURIComponent for complete encoding."
    },
    {
      question: "Is this URL encoder safe to use?",
      answer: "Yes! All encoding happens locally in your browser. No data is sent to any server, ensuring your URLs and data remain private."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="URL Encoder Decoder - Encode & Decode URLs Online Free"
        description="Free URL encoder and decoder. Encode special characters for URLs or decode percent-encoded URLs. Online URL encoding tool."
        keywords="url encoder, url decoder, encode url, decode url, percent encoding, url escape, urlencode online"
        canonical="https://pinetoolshub.com/url-encoder"
      />
      
      <ToolStructuredData
        toolName="URL Encoder Decoder"
        toolDescription="Encode special characters for URLs or decode percent-encoded URLs."
        toolUrl="https://pinetoolshub.com/url-encoder"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="URL Encoder/Decoder"
        description="Encode and decode URLs for safe transmission"
        icon={<Link className="h-8 w-8" />}
        color="bg-indigo-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="encode" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="encode" className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" /> Encode URL
              </TabsTrigger>
              <TabsTrigger value="decode" className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" /> Decode URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encode">
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="encodeInput" className="text-sm font-medium mb-2 block">Text to Encode</Label>
                    <Textarea
                      id="encodeInput"
                      placeholder="Enter text or URL to encode..."
                      value={encodeInput}
                      onChange={(e) => setEncodeInput(e.target.value)}
                      className="min-h-[100px] font-mono"
                    />
                  </div>

                  <Button onClick={encode} className="w-full">
                    <ArrowDown className="h-4 w-4 mr-2" /> Encode URL
                  </Button>

                  {encodeOutput && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-medium">Encoded Result</Label>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(encodeOutput)}>
                          <Copy className="h-4 w-4 mr-2" /> Copy
                        </Button>
                      </div>
                      <Textarea
                        value={encodeOutput}
                        readOnly
                        className="min-h-[100px] font-mono bg-muted"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode">
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="decodeInput" className="text-sm font-medium mb-2 block">URL to Decode</Label>
                    <Textarea
                      id="decodeInput"
                      placeholder="Enter encoded URL to decode..."
                      value={decodeInput}
                      onChange={(e) => setDecodeInput(e.target.value)}
                      className="min-h-[100px] font-mono"
                    />
                  </div>

                  <Button onClick={decode} className="w-full">
                    <ArrowUp className="h-4 w-4 mr-2" /> Decode URL
                  </Button>

                  {decodeOutput && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-medium">Decoded Result</Label>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(decodeOutput)}>
                          <Copy className="h-4 w-4 mr-2" /> Copy
                        </Button>
                      </div>
                      <Textarea
                        value={decodeOutput}
                        readOnly
                        className="min-h-[100px] font-mono bg-muted"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Common Examples */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Common URL Encoding Examples</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">Space</p>
                  <p className="text-muted-foreground font-mono">%20</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">&</p>
                  <p className="text-muted-foreground font-mono">%26</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">=</p>
                  <p className="text-muted-foreground font-mono">%3D</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">?</p>
                  <p className="text-muted-foreground font-mono">%3F</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online URL Encoder Decoder</h2>
          <p className="text-muted-foreground mb-4">
            Encode special characters in URLs for safe transmission, or decode percent-encoded URLs back to 
            readable format. Essential for web developers, API work, and handling query strings.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default UrlEncoder;
