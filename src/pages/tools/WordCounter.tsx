import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Type, Copy, Trash2, FileText, Clock, Mic } from "lucide-react";
import { toast } from "sonner";

const WordCounter = () => {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    
    // Word count
    const words = trimmedText ? trimmedText.split(/\s+/).filter(word => word.length > 0).length : 0;
    
    // Character counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    
    // Sentence count
    const sentences = trimmedText ? (trimmedText.match(/[.!?]+/g) || []).length || (trimmedText.length > 0 ? 1 : 0) : 0;
    
    // Paragraph count
    const paragraphs = trimmedText ? trimmedText.split(/\n\n+/).filter(p => p.trim().length > 0).length : 0;
    
    // Reading time (200 words per minute average)
    const readingTime = Math.ceil(words / 200);
    
    // Speaking time (150 words per minute average)
    const speakingTime = Math.ceil(words / 150);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    };
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };

  const clearText = () => {
    setText("");
    toast.success("Text cleared!");
  };

  const faqs = [
    {
      question: "How does the word counter work?",
      answer: "Our free online word counter instantly analyzes your text as you type. It counts words by detecting spaces between text, characters with and without spaces, sentences by detecting punctuation marks, and paragraphs by detecting line breaks. It's 100% accurate and works in real-time."
    },
    {
      question: "Is this word counter free to use?",
      answer: "Yes! PineToolsHub word counter is completely free with no limits. You can count words, characters, sentences, and paragraphs unlimited times. No registration, no signup, no hidden fees - just paste your text and get instant results."
    },
    {
      question: "Can I count words in essays, articles, and documents?",
      answer: "Absolutely! Our word counter tool is perfect for counting words in essays, blog posts, articles, research papers, social media posts, and any type of text content. Students use it for meeting word count requirements, writers for tracking article length, and marketers for social media character limits."
    },
    {
      question: "How accurate is the reading time estimate?",
      answer: "Our reading time calculator uses the industry-standard average of 200 words per minute for reading and 150 words per minute for speaking. These are widely accepted averages used by major platforms like Medium. Actual reading time may vary based on text complexity and individual reading speed."
    },
    {
      question: "Does this tool work on mobile phones?",
      answer: "Yes! Our word counter is fully responsive and works perfectly on mobile phones, tablets, and desktop computers. You can count words on the go, paste text from any app, and get instant character counts - all from your smartphone browser."
    },
    {
      question: "What's the maximum text length I can analyze?",
      answer: "There's no limit! You can paste entire books, long research papers, or any length of text. Our word counter processes everything instantly in your browser. Whether it's a tweet or a novel, we'll count it accurately."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Word Counter - Free Online Word Count Tool | Character Counter 2025"
        description="Count words, characters, sentences & paragraphs instantly. Free online word counter with reading time calculator. No signup required - paste text and count!"
        keywords="word counter, character counter, word count tool, online word counter free, count words in text, character count online, sentence counter, paragraph counter, reading time calculator"
        canonical="https://pinetoolshub.com/word-counter"
      />
      
      <ToolStructuredData
        toolName="Word Counter - Free Character & Word Count Tool"
        toolDescription="Count words, characters, sentences, and paragraphs instantly with our free online word counter. Includes reading time and speaking time calculator."
        toolUrl="https://pinetoolshub.com/word-counter"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Word Counter"
        description="Count words, characters, sentences & paragraphs instantly. Free online word counter with reading time calculator - no signup required!"
        icon={<Type className="h-8 w-8" />}
        color="bg-blue-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{stats.words}</p>
                <p className="text-sm text-muted-foreground">Words</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{stats.characters}</p>
                <p className="text-sm text-muted-foreground">Characters</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">{stats.sentences}</p>
                <p className="text-sm text-muted-foreground">Sentences</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-orange-400">{stats.paragraphs}</p>
                <p className="text-sm text-muted-foreground">Paragraphs</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">{stats.charactersNoSpaces}</p>
                <p className="text-xs text-muted-foreground">Characters (no spaces)</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{stats.readingTime} min</p>
                  <p className="text-xs text-muted-foreground">Reading Time</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-center gap-2">
                <Mic className="h-5 w-5 text-pink-400" />
                <div>
                  <p className="text-2xl font-bold text-pink-400">{stats.speakingTime} min</p>
                  <p className="text-xs text-muted-foreground">Speaking Time</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Text Area */}
          <div className="mb-6">
            <Textarea
              placeholder="Start typing or paste your text here to count words, characters, sentences, and paragraphs..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={copyToClipboard} disabled={!text} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
            <Button onClick={clearText} disabled={!text} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Word Counter Tool</h2>
          <p className="text-muted-foreground mb-4">
            Need to count words in your essay, article, or document? Our free word counter tool gives you instant, accurate results. 
            Whether you're a student checking assignment requirements, a writer tracking article length, or a social media manager 
            counting characters for Twitter/X posts - this tool does it all.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">What Our Word Counter Measures</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Word Count:</strong> Total number of words in your text, perfect for essays and articles</li>
            <li><strong>Character Count:</strong> Total characters including spaces - essential for SMS and social media</li>
            <li><strong>Characters Without Spaces:</strong> Character count excluding whitespace</li>
            <li><strong>Sentence Count:</strong> Number of sentences based on punctuation</li>
            <li><strong>Paragraph Count:</strong> Paragraphs detected by line breaks</li>
            <li><strong>Reading Time:</strong> Estimated time to read your text (200 words/min)</li>
            <li><strong>Speaking Time:</strong> Estimated time to speak your text (150 words/min)</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3">Perfect For</h3>
          <p className="text-muted-foreground mb-4">
            Students meeting essay word requirements, content writers optimizing article length, SEO specialists checking meta descriptions, 
            social media managers crafting posts within character limits, authors tracking manuscript progress, and anyone who needs 
            accurate word and character counts instantly.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default WordCounter;
