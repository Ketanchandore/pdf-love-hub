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
import { Binary, Copy, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

const Base64Tool = () => {
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [decodeInput, setDecodeInput] = useState("");

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setEncodedText(encoded);
    } catch {
      toast.error("Unable to encode text");
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(decodeInput)));
      setDecodedText(decoded);
    } catch {
      toast.error("Invalid Base64 string");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is Base64 encoding?",
      answer: "Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters. It's commonly used to transmit data over media designed for text, like email or HTML."
    },
    {
      question: "Is Base64 encryption?",
      answer: "No, Base64 is not encryption - it's encoding. Anyone can decode Base64 easily. Never use Base64 for security purposes; it only transforms data format without protecting it."
    },
    {
      question: "Why use Base64 encoding?",
      answer: "Base64 is used when you need to store or transfer binary data over text-based protocols. Common uses include embedding images in HTML/CSS, encoding email attachments, and API data transfer."
    },
    {
      question: "Does Base64 increase data size?",
      answer: "Yes, Base64 encoding increases data size by approximately 33% (every 3 bytes become 4 characters). This is the trade-off for text-safe transmission."
    },
    {
      question: "Can Base64 encode any data?",
      answer: "Yes, Base64 can encode any binary data, including text, images, files, and more. Our tool handles UTF-8 text encoding automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Base64 Encoder Decoder - Encode & Decode Base64 Online Free"
        description="Free Base64 encoder and decoder tool. Encode text to Base64 or decode Base64 to text instantly. Online Base64 converter."
        keywords="base64, base64 encoder, base64 decoder, encode base64, decode base64, base64 converter, base64 online"
        canonical="https://pinetoolshub.com/base64"
      />
      
      <ToolStructuredData
        toolName="Base64 Encoder Decoder"
        toolDescription="Encode text to Base64 or decode Base64 to text instantly."
        toolUrl="https://pinetoolshub.com/base64"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Base64 Encoder/Decoder"
        description="Encode text to Base64 or decode Base64 to text"
        icon={<Binary className="h-8 w-8" />}
        color="bg-cyan-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="encode" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="encode" className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" /> Encode to Base64
              </TabsTrigger>
              <TabsTrigger value="decode" className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" /> Decode from Base64
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encode">
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="input" className="text-sm font-medium mb-2 block">Text to Encode</Label>
                    <Textarea
                      id="input"
                      placeholder="Enter text to encode..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[120px] font-mono"
                    />
                  </div>

                  <Button onClick={encode} className="w-full">
                    <ArrowDown className="h-4 w-4 mr-2" /> Encode to Base64
                  </Button>

                  {encodedText && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-medium">Base64 Result</Label>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(encodedText)}>
                          <Copy className="h-4 w-4 mr-2" /> Copy
                        </Button>
                      </div>
                      <Textarea
                        value={encodedText}
                        readOnly
                        className="min-h-[120px] font-mono bg-muted"
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
                    <Label htmlFor="decodeInput" className="text-sm font-medium mb-2 block">Base64 to Decode</Label>
                    <Textarea
                      id="decodeInput"
                      placeholder="Enter Base64 string to decode..."
                      value={decodeInput}
                      onChange={(e) => setDecodeInput(e.target.value)}
                      className="min-h-[120px] font-mono"
                    />
                  </div>

                  <Button onClick={decode} className="w-full">
                    <ArrowUp className="h-4 w-4 mr-2" /> Decode from Base64
                  </Button>

                  {decodedText && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-medium">Decoded Text</Label>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(decodedText)}>
                          <Copy className="h-4 w-4 mr-2" /> Copy
                        </Button>
                      </div>
                      <Textarea
                        value={decodedText}
                        readOnly
                        className="min-h-[120px] font-mono bg-muted"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Base64 Encoder Decoder</h2>
          <p className="text-muted-foreground mb-4">
            Convert text to Base64 encoding or decode Base64 strings back to readable text. Essential for 
            developers working with APIs, data URIs, email encoding, or any text-safe data transfer needs.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default Base64Tool;
