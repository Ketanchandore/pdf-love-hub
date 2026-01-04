import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
  "accusamus", "accusantium", "adipisci", "alias", "aliquam", "aperiam", "architecto", "asperiores",
  "aspernatur", "assumenda", "atque", "autem", "beatae", "blanditiis", "commodi", "consequuntur",
  "corporis", "corrupti", "cumque", "cupiditate", "debitis", "delectus", "deleniti", "dicta", "dignissimos",
  "distinctio", "doloremque", "dolorem", "dolores", "doloribus", "ducimus", "eaque", "earum", "eligendi",
  "eos", "error", "eveniet", "expedita", "explicabo", "facere", "facilis", "fuga", "harum", "hic",
  "illum", "impedit", "inventore", "ipsa", "ipsam", "iste", "itaque", "iure", "iusto", "laudantium"
];

const LoremIpsum = () => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [generatedText, setGeneratedText] = useState("");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generateWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  };

  const generateSentence = (minWords = 8, maxWords = 15) => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(generateWord());
    }
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
  };

  const generateParagraph = (minSentences = 4, maxSentences = 8) => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  };

  const generate = () => {
    let result = "";
    
    if (type === "paragraphs") {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(" ");
    } else {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(generateWord());
      }
      result = words.join(" ");
      result = result.charAt(0).toUpperCase() + result.slice(1) + ".";
    }

    if (startWithLorem && result.length > 0) {
      result = "Lorem ipsum dolor sit amet, " + result.charAt(0).toLowerCase() + result.slice(1);
    }

    setGeneratedText(result);
    toast.success(`Generated ${count} ${type}!`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast.success("Lorem ipsum text copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is Lorem Ipsum?",
      answer: "Lorem Ipsum is placeholder text used in the design and publishing industry. It looks like readable Latin text but is actually scrambled nonsense. Designers and developers use it to show how text will look in a layout before final content is written. It's been the industry standard since the 1500s!"
    },
    {
      question: "Why use a Lorem Ipsum generator?",
      answer: "Lorem Ipsum generators create realistic-looking placeholder text for websites, apps, documents, and designs. Using Lorem Ipsum prevents readers from focusing on content and instead lets them evaluate layout, typography, and design. It's essential for mockups, wireframes, and prototypes."
    },
    {
      question: "Is this Lorem Ipsum generator free?",
      answer: "Yes! Our Lorem Ipsum generator is 100% free with no limits. Generate unlimited paragraphs, sentences, or words. No signup, no registration, no hidden fees - just instant placeholder text whenever you need it."
    },
    {
      question: "Can I generate specific amounts of text?",
      answer: "Absolutely! You can choose to generate a specific number of paragraphs (1-100), sentences (1-500), or individual words (1-1000). This flexibility helps you get exactly the amount of placeholder content you need for any project."
    },
    {
      question: "Is the generated text random?",
      answer: "Yes, our generator creates randomized Lorem Ipsum text each time. While it uses the classic Lorem Ipsum vocabulary, the sentences and paragraphs are uniquely generated. You can optionally start with the traditional 'Lorem ipsum dolor sit amet' opening."
    },
    {
      question: "What are common uses for Lorem Ipsum?",
      answer: "Common uses include: website mockups, graphic design layouts, WordPress theme demos, mobile app prototypes, presentation templates, print design drafts, typography testing, and anywhere you need placeholder text before real content is ready."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Lorem Ipsum Generator - Free Dummy Text Generator Online 2025"
        description="Generate Lorem Ipsum placeholder text instantly. Free online dummy text generator for designers & developers. Create paragraphs, sentences, or words - no signup!"
        keywords="lorem ipsum generator, dummy text generator, placeholder text, lipsum generator, lorem ipsum online, free lorem ipsum, random text generator, filler text generator"
        canonical="https://pinetoolshub.com/lorem-ipsum"
      />
      
      <ToolStructuredData
        toolName="Lorem Ipsum Generator - Free Placeholder Text Tool"
        toolDescription="Generate Lorem Ipsum dummy text for websites, designs, and mockups. Create paragraphs, sentences, or words instantly - free online tool."
        toolUrl="https://pinetoolshub.com/lorem-ipsum"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Lorem Ipsum Generator"
        description="Generate placeholder dummy text for your designs, websites, and mockups. Free online Lorem Ipsum generator with no limits!"
        icon={<FileText className="h-8 w-8" />}
        color="bg-emerald-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Generator Controls */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="count" className="text-sm font-medium mb-2 block">Amount</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max={type === "paragraphs" ? 100 : type === "sentences" ? 500 : 1000}
                    value={count}
                    onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                      <SelectItem value="words">Words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={generate} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="startWithLorem"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="startWithLorem" className="text-sm cursor-pointer">
                  Start with "Lorem ipsum dolor sit amet..."
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Generated Text */}
          {generatedText && (
            <Card className="bg-card border-border mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Generated Text</h3>
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="prose prose-invert max-w-none">
                  {generatedText.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Generate Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="outline" onClick={() => { setCount(1); setType("paragraphs"); setTimeout(generate, 0); }}>
              1 Paragraph
            </Button>
            <Button variant="outline" onClick={() => { setCount(3); setType("paragraphs"); setTimeout(generate, 0); }}>
              3 Paragraphs
            </Button>
            <Button variant="outline" onClick={() => { setCount(5); setType("paragraphs"); setTimeout(generate, 0); }}>
              5 Paragraphs
            </Button>
            <Button variant="outline" onClick={() => { setCount(100); setType("words"); setTimeout(generate, 0); }}>
              100 Words
            </Button>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Lorem Ipsum Text Generator</h2>
          <p className="text-muted-foreground mb-4">
            Need placeholder text for your website, app design, or document layout? Our free Lorem Ipsum generator creates 
            realistic dummy text instantly. Whether you're a web designer mocking up a new site, a developer testing typography, 
            or a content creator visualizing layouts - generate unlimited Lorem Ipsum text with one click.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">Why Lorem Ipsum?</h3>
          <p className="text-muted-foreground mb-4">
            Lorem Ipsum has been the printing industry's standard dummy text since the 1500s. Unlike using "content here, content here," 
            Lorem Ipsum provides a realistic distribution of letters and words, making it look like readable text. This helps designers 
            and clients focus on visual design rather than being distracted by content.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-3">Perfect For</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Web Designers:</strong> Fill website mockups with realistic-looking content</li>
            <li><strong>Graphic Designers:</strong> Test typography and layout in print designs</li>
            <li><strong>Developers:</strong> Populate test data in applications and prototypes</li>
            <li><strong>Marketers:</strong> Create presentation templates and proposal layouts</li>
            <li><strong>Writers:</strong> Visualize blog post and article formatting</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default LoremIpsum;
