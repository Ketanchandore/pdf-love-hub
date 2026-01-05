import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hash, Copy } from "lucide-react";
import { toast } from "sonner";

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const NumberToWords = () => {
  const [number, setNumber] = useState("");

  const convertToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    if (num < 0) return 'Negative ' + convertToWords(-num);
    
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
      if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + ' Billion' + (n % 1000000000 ? ' ' + convert(n % 1000000000) : '');
      return convert(Math.floor(n / 1000000000000)) + ' Trillion' + (n % 1000000000000 ? ' ' + convert(n % 1000000000000) : '');
    };
    
    return convert(Math.floor(num));
  };

  const numValue = parseFloat(number) || 0;
  const words = number ? convertToWords(numValue) : '';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "How do I convert numbers to words?",
      answer: "Simply enter any number in the input field and our tool instantly converts it to English words. It handles numbers from zero to trillions and beyond."
    },
    {
      question: "Can I convert large numbers?",
      answer: "Yes! Our converter handles numbers up to trillions. Enter any number and see it converted to words like 'One Million Two Hundred Thirty Four Thousand'."
    },
    {
      question: "Does it work with negative numbers?",
      answer: "Yes, negative numbers are converted with 'Negative' prefix. For example, -42 becomes 'Negative Forty Two'."
    },
    {
      question: "What about decimal numbers?",
      answer: "Currently, the tool converts the whole number part. Decimal portions are not converted. For example, 123.45 converts as 123 = 'One Hundred Twenty Three'."
    },
    {
      question: "Why would I need to convert numbers to words?",
      answer: "Number-to-words conversion is commonly used for writing checks, legal documents, invoices, formal letters, and any situation where numbers need to be written out fully."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Number to Words Converter - Convert Numbers to English Online"
        description="Convert numbers to words in English. Free number to text converter for checks, documents, and more. Convert any number to written words instantly."
        keywords="number to words, number converter, numbers in words, convert number to text, number spelling, write number in words, check writing"
        canonical="https://pinetoolshub.com/number-to-words"
      />
      
      <ToolStructuredData
        toolName="Number to Words Converter"
        toolDescription="Convert numbers to English words instantly. Perfect for checks and documents."
        toolUrl="https://pinetoolshub.com/number-to-words"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Number to Words"
        description="Convert any number to English words instantly"
        icon={<Hash className="h-8 w-8" />}
        color="bg-teal-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <Label htmlFor="number" className="text-sm font-medium mb-2 block">Enter Number</Label>
              <Input
                id="number"
                type="number"
                placeholder="Enter a number (e.g., 12345)"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="text-2xl text-center font-mono"
              />
            </CardContent>
          </Card>

          {words && (
            <Card className="bg-gradient-to-r from-primary/20 to-teal-500/20 border-primary/50">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-sm text-muted-foreground">In Words</Label>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(words)}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <p className="text-2xl font-semibold text-foreground">{words}</p>
              </CardContent>
            </Card>
          )}

          {/* Common Examples */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Quick Examples</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Button variant="outline" className="justify-start" onClick={() => setNumber("100")}>
                  100 → One Hundred
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setNumber("1000")}>
                  1,000 → One Thousand
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setNumber("1000000")}>
                  1,000,000 → One Million
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setNumber("1234567")}>
                  1,234,567 → Try It!
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reference Table */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Number Words Reference</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {[
                  { n: "1", w: "One" },
                  { n: "10", w: "Ten" },
                  { n: "100", w: "Hundred" },
                  { n: "1,000", w: "Thousand" },
                  { n: "10,000", w: "Ten Thousand" },
                  { n: "100,000", w: "Hundred Thousand" },
                  { n: "1,000,000", w: "Million" },
                  { n: "1,000,000,000", w: "Billion" },
                ].map((item) => (
                  <div key={item.n} className="p-2 bg-muted/50 rounded text-center">
                    <p className="font-mono font-bold">{item.n}</p>
                    <p className="text-muted-foreground text-xs">{item.w}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Number to Words Converter</h2>
          <p className="text-muted-foreground mb-4">
            Convert any number to English words instantly. Perfect for writing checks, legal documents, 
            invoices, or any formal document where numbers need to be spelled out.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default NumberToWords;
