import { useState, useEffect } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shuffle, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [unique, setUnique] = useState(false);

  const generate = () => {
    if (min > max) {
      toast.error("Min must be less than max");
      return;
    }

    const range = max - min + 1;
    if (unique && count > range) {
      toast.error(`Can only generate ${range} unique numbers in this range`);
      return;
    }

    if (unique) {
      const nums = new Set<number>();
      while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range) + min);
      }
      setResults(Array.from(nums).sort((a, b) => a - b));
    } else {
      const nums = [];
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + min);
      }
      setResults(nums.sort((a, b) => a - b));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(", "));
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "Are these truly random numbers?",
      answer: "These numbers are generated using JavaScript's Math.random(), which is a pseudorandom number generator. For most purposes like games and simulations, they are sufficiently random."
    },
    {
      question: "Can I generate unique numbers only?",
      answer: "Yes! Enable the 'Unique numbers only' option to ensure no duplicates. Note that the count cannot exceed the range (max - min + 1)."
    },
    {
      question: "What's the maximum range I can use?",
      answer: "You can use any range supported by JavaScript numbers. For practical purposes, stay within reasonable bounds for instant generation."
    },
    {
      question: "Can I use this for lottery numbers?",
      answer: "Yes, set your range (e.g., 1-49), enable unique numbers, and set the count to how many numbers you need. Perfect for generating lottery picks!"
    },
    {
      question: "How do I pick a random winner from a list?",
      answer: "If you have N contestants, generate a single random number between 1 and N. The generated number is the winner's position."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Random Number Generator - Generate Random Numbers Online Free"
        description="Free random number generator. Generate random numbers in any range with options for unique numbers, multiple results, and more."
        keywords="random number generator, rng, random picker, lottery number generator, random generator, dice roller, number randomizer"
        canonical="https://pinetoolshub.com/random-number-generator"
      />
      
      <ToolStructuredData
        toolName="Random Number Generator"
        toolDescription="Generate random numbers in any range with unique and multiple options."
        toolUrl="https://pinetoolshub.com/random-number-generator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Random Number Generator"
        description="Generate random numbers in any range"
        icon={<Shuffle className="h-8 w-8" />}
        color="bg-fuchsia-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min" className="text-sm font-medium mb-2 block">Minimum</Label>
                  <Input
                    id="min"
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="max" className="text-sm font-medium mb-2 block">Maximum</Label>
                  <Input
                    id="max"
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="count" className="text-sm font-medium mb-2 block">How many numbers?</Label>
                <Input
                  id="count"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                  min={1}
                  max={1000}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unique}
                  onChange={(e) => setUnique(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Unique numbers only (no duplicates)</span>
              </label>

              <Button onClick={generate} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" /> Generate Random Numbers
              </Button>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/20 to-fuchsia-500/20 border-primary/50">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-muted-foreground">Generated Numbers:</p>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {results.map((num, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-lg"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Presets */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Quick Presets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" onClick={() => { setMin(1); setMax(6); setCount(1); }}>
                  🎲 Dice (1-6)
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setMin(1); setMax(100); setCount(1); }}>
                  🔢 1-100
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setMin(1); setMax(49); setCount(6); setUnique(true); }}>
                  🎰 Lottery (6 from 49)
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setMin(0); setMax(1); setCount(1); }}>
                  🪙 Coin Flip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Random Number Generator</h2>
          <p className="text-muted-foreground mb-4">
            Generate random numbers instantly in any range. Perfect for games, lotteries, decision making, 
            simulations, and any situation where you need random numbers.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
