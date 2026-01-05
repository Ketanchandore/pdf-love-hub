import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Receipt, Percent } from "lucide-react";

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState(50);
  const [tipPercentage, setTipPercentage] = useState(18);
  const [splitCount, setSplitCount] = useState(1);

  const result = useMemo(() => {
    const tipAmount = billAmount * (tipPercentage / 100);
    const totalAmount = billAmount + tipAmount;
    const perPerson = totalAmount / splitCount;
    const tipPerPerson = tipAmount / splitCount;
    
    return { tipAmount, totalAmount, perPerson, tipPerPerson };
  }, [billAmount, tipPercentage, splitCount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const faqs = [
    {
      question: "What is a good tip percentage?",
      answer: "In the US, 15-20% is standard for good service. 18% is average, 20% for excellent service, and 25%+ for exceptional service. Tip higher for complex orders or large groups."
    },
    {
      question: "How do I calculate tip quickly?",
      answer: "For 10%: move the decimal point left one place. For 15%: calculate 10% and add half. For 20%: calculate 10% and double it. Our calculator does this instantly!"
    },
    {
      question: "Should I tip on the total or subtotal?",
      answer: "Tip on the subtotal (before tax) is technically correct, but many people tip on the total for simplicity. Either is acceptable."
    },
    {
      question: "How do I split the bill with friends?",
      answer: "Enter the number of people splitting the bill in our calculator. It shows each person's share including their portion of the tip."
    },
    {
      question: "Do I tip on takeout orders?",
      answer: "Tipping for takeout is optional but appreciated (10-15%). During busy times or for complex orders, consider tipping more."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Tip Calculator - Calculate Restaurant Tip & Split Bill Free"
        description="Free tip calculator. Calculate restaurant tips, split bills between friends, and find per-person amounts. Easy gratuity calculator."
        keywords="tip calculator, gratuity calculator, split bill, restaurant tip, how much to tip, bill splitter, calculate tip"
        canonical="https://pinetoolshub.com/tip-calculator"
      />
      
      <ToolStructuredData
        toolName="Tip Calculator"
        toolDescription="Calculate restaurant tips and split bills between multiple people."
        toolUrl="https://pinetoolshub.com/tip-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Tip Calculator"
        description="Calculate tips and split bills easily"
        icon={<Receipt className="h-8 w-8" />}
        color="bg-pink-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="billAmount" className="text-sm font-medium mb-2 block">Bill Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="billAmount"
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                    className="pl-8 text-2xl"
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="tipPercentage">Tip Percentage</Label>
                  <span className="font-mono font-bold">{tipPercentage}%</span>
                </div>
                <Input
                  id="tipPercentage"
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={tipPercentage}
                  onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  {[10, 15, 18, 20, 25].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setTipPercentage(pct)}
                      className={`px-3 py-1 rounded text-sm ${
                        tipPercentage === pct 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="splitCount" className="text-sm font-medium mb-2 block">
                  Split Between (people)
                </Label>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                    className="p-2 bg-muted rounded hover:bg-muted/80"
                  >
                    -
                  </button>
                  <Input
                    id="splitCount"
                    type="number"
                    value={splitCount}
                    onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center text-xl w-20"
                    min={1}
                  />
                  <button
                    onClick={() => setSplitCount(splitCount + 1)}
                    className="p-2 bg-muted rounded hover:bg-muted/80"
                  >
                    +
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Tip Amount</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.tipAmount)}</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(result.totalAmount)}</p>
              </CardContent>
            </Card>
          </div>

          {splitCount > 1 && (
            <Card className="bg-gradient-to-r from-primary/20 to-pink-500/20 border-primary/50 mb-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-2">Each Person Pays</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(result.perPerson)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  (includes {formatCurrency(result.tipPerPerson)} tip per person)
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tip Guide */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Tipping Guide</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-bold text-lg">15%</p>
                  <p className="text-muted-foreground text-xs">Okay Service</p>
                  <p className="text-xs">{formatCurrency(billAmount * 0.15)}</p>
                </div>
                <div className="p-3 bg-primary/20 rounded border border-primary/50">
                  <p className="font-bold text-lg">18-20%</p>
                  <p className="text-muted-foreground text-xs">Good Service</p>
                  <p className="text-xs">{formatCurrency(billAmount * 0.18)} - {formatCurrency(billAmount * 0.20)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-bold text-lg">25%+</p>
                  <p className="text-muted-foreground text-xs">Excellent</p>
                  <p className="text-xs">{formatCurrency(billAmount * 0.25)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Tip Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Calculate restaurant tips quickly and split bills fairly between friends. Never guess how 
            much to tip again with our easy-to-use gratuity calculator.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default TipCalculator;
