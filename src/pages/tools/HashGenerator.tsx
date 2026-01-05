import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hash, Copy } from "lucide-react";
import { toast } from "sonner";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generateHashes = async () => {
    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      results[algo] = hashHex;
    }

    // MD5 is not supported by SubtleCrypto, so we'll show a note
    results['MD5'] = '(Not available - use SHA-256 instead)';

    setHashes(results);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is a hash function?",
      answer: "A hash function converts any input data into a fixed-size string of characters. The same input always produces the same hash, but it's practically impossible to reverse-engineer the original input from the hash."
    },
    {
      question: "Which hash algorithm should I use?",
      answer: "For security purposes, use SHA-256 or SHA-512. Avoid MD5 and SHA-1 for security-critical applications as they have known vulnerabilities. SHA-256 is the most commonly recommended choice."
    },
    {
      question: "What is SHA-256 used for?",
      answer: "SHA-256 is used for password hashing, digital signatures, blockchain (Bitcoin uses it), file integrity verification, and many security protocols including SSL/TLS certificates."
    },
    {
      question: "Can hashes be decrypted?",
      answer: "No, hashes cannot be decrypted. They are one-way functions designed to be irreversible. You can only verify a hash by hashing the same input and comparing results."
    },
    {
      question: "Why are hash values different lengths?",
      answer: "Different algorithms produce different lengths: SHA-1 produces 160 bits (40 hex chars), SHA-256 produces 256 bits (64 hex chars), SHA-512 produces 512 bits (128 hex chars)."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Hash Generator - SHA256, SHA512, SHA1 Online Free"
        description="Generate SHA-256, SHA-512, SHA-384, SHA-1 hashes online. Free cryptographic hash generator for text and strings."
        keywords="hash generator, sha256, sha512, sha1, hash calculator, md5 generator, cryptographic hash, hash online"
        canonical="https://pinetoolshub.com/hash-generator"
      />
      
      <ToolStructuredData
        toolName="Hash Generator"
        toolDescription="Generate SHA-256, SHA-512, SHA-1 cryptographic hashes from text."
        toolUrl="https://pinetoolshub.com/hash-generator"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Hash Generator"
        description="Generate SHA-256, SHA-512, SHA-1 hashes from text"
        icon={<Hash className="h-8 w-8" />}
        color="bg-rose-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="input" className="text-sm font-medium mb-2 block">Enter Text to Hash</Label>
                <Textarea
                  id="input"
                  placeholder="Enter text to generate hashes..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[100px] font-mono"
                />
              </div>

              <Button onClick={generateHashes} className="w-full" disabled={!input}>
                <Hash className="h-4 w-4 mr-2" /> Generate Hashes
              </Button>
            </CardContent>
          </Card>

          {Object.keys(hashes).length > 0 && (
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Generated Hashes</h3>
                
                {Object.entries(hashes).map(([algo, hash]) => (
                  <div key={algo}>
                    <Label className="text-sm font-medium mb-1 block">{algo}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={hash}
                        readOnly
                        className="font-mono text-xs bg-muted"
                      />
                      {!hash.startsWith('(') && (
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(hash)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Hash Comparison */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Hash Algorithm Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="p-2">Algorithm</th>
                      <th className="p-2">Output Size</th>
                      <th className="p-2">Security</th>
                      <th className="p-2">Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">SHA-1</td>
                      <td className="p-2">160 bits</td>
                      <td className="p-2 text-yellow-400">Deprecated</td>
                      <td className="p-2">Legacy systems</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">SHA-256</td>
                      <td className="p-2">256 bits</td>
                      <td className="p-2 text-green-400">Secure</td>
                      <td className="p-2">Recommended</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">SHA-384</td>
                      <td className="p-2">384 bits</td>
                      <td className="p-2 text-green-400">Secure</td>
                      <td className="p-2">High security</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">SHA-512</td>
                      <td className="p-2">512 bits</td>
                      <td className="p-2 text-green-400">Most Secure</td>
                      <td className="p-2">Maximum security</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Hash Generator</h2>
          <p className="text-muted-foreground mb-4">
            Generate cryptographic hashes from any text using industry-standard algorithms. Perfect for 
            developers needing hash values for password storage, data integrity verification, or security applications.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default HashGenerator;
