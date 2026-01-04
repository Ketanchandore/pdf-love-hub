import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Percent, Calculator, ArrowRight } from "lucide-react";

const PercentageCalculator = () => {
  // What is X% of Y?
  const [percentOf1, setPercentOf1] = useState("");
  const [value1, setValue1] = useState("");
  
  // X is what % of Y?
  const [value2, setValue2] = useState("");
  const [total2, setTotal2] = useState("");
  
  // % increase/decrease
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  
  // Add/subtract percentage
  const [baseValue, setBaseValue] = useState("");
  const [percentChange, setPercentChange] = useState("");

  // Calculations
  const result1 = percentOf1 && value1 ? ((parseFloat(percentOf1) / 100) * parseFloat(value1)).toFixed(2) : "";
  const result2 = value2 && total2 ? ((parseFloat(value2) / parseFloat(total2)) * 100).toFixed(2) : "";
  const percentageChange = fromValue && toValue ? (((parseFloat(toValue) - parseFloat(fromValue)) / parseFloat(fromValue)) * 100).toFixed(2) : "";
  const addPercent = baseValue && percentChange ? (parseFloat(baseValue) * (1 + parseFloat(percentChange) / 100)).toFixed(2) : "";
  const subtractPercent = baseValue && percentChange ? (parseFloat(baseValue) * (1 - parseFloat(percentChange) / 100)).toFixed(2) : "";

  const faqs = [
    {
      question: "How do I calculate percentage of a number?",
      answer: "To find X% of a number, multiply the number by X and divide by 100. For example, 20% of 150 = (20 × 150) ÷ 100 = 30. Our calculator does this instantly - just enter the percentage and number."
    },
    {
      question: "How do I find what percentage one number is of another?",
      answer: "To find what percentage A is of B, divide A by B and multiply by 100. For example, to find what percent 25 is of 200: (25 ÷ 200) × 100 = 12.5%. Our calculator handles this automatically."
    },
    {
      question: "How do I calculate percentage increase or decrease?",
      answer: "Percentage change = ((New Value - Old Value) ÷ Old Value) × 100. If the result is positive, it's an increase. If negative, it's a decrease. For example, going from 100 to 125 is a 25% increase."
    },
    {
      question: "How do I add a percentage to a number?",
      answer: "To add X% to a number, multiply the number by (1 + X/100). For example, to add 15% to 200: 200 × 1.15 = 230. This is commonly used for calculating tips, taxes, and markups."
    },
    {
      question: "How do I subtract a percentage from a number?",
      answer: "To subtract X% from a number, multiply by (1 - X/100). For example, to subtract 20% from 100: 100 × 0.80 = 80. This is used for discounts, sales, and reductions."
    },
    {
      question: "Is this percentage calculator free?",
      answer: "Yes! Our percentage calculator is 100% free with no limits. Calculate percentages as many times as you want. No signup, no registration, no hidden fees - instant results every time."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Percentage Calculator - Calculate Percent Online Free 2025"
        description="Calculate percentages instantly! Find percent of a number, percentage increase/decrease, add or subtract percentages. Free online percentage calculator - no signup!"
        keywords="percentage calculator, calculate percentage, percent calculator, percentage increase calculator, percentage decrease, what percent of, discount calculator, tip calculator"
        canonical="https://pinetoolshub.com/percentage-calculator"
      />
      
      <ToolStructuredData
        toolName="Percentage Calculator - Calculate Percent Online"
        toolDescription="Calculate percentages instantly. Find percent of a number, percentage change, increase/decrease. Free online percentage calculator."
        toolUrl="https://pinetoolshub.com/percentage-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Percentage Calculator"
        description="Calculate percentages instantly! Find percent of a number, percentage change, increase/decrease, and more."
        icon={<Percent className="h-8 w-8" />}
        color="bg-green-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* What is X% of Y? */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  What is X% of Y?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Percentage</Label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={percentOf1}
                      onChange={(e) => setPercentOf1(e.target.value)}
                    />
                  </div>
                  <span className="mt-5">% of</span>
                  <div className="flex-1">
                    <Label className="text-xs">Number</Label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                    />
                  </div>
                </div>
                {result1 && (
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-3xl font-bold text-primary">{result1}</p>
                    <p className="text-xs text-muted-foreground mt-1">{percentOf1}% of {value1} = {result1}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* X is what % of Y? */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Percent className="h-5 w-5 text-green-400" />
                  X is what % of Y?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Value</Label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                    />
                  </div>
                  <span className="mt-5">is what % of</span>
                  <div className="flex-1">
                    <Label className="text-xs">Total</Label>
                    <Input
                      type="number"
                      placeholder="200"
                      value={total2}
                      onChange={(e) => setTotal2(e.target.value)}
                    />
                  </div>
                </div>
                {result2 && (
                  <div className="p-4 bg-green-500/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-3xl font-bold text-green-400">{result2}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{value2} is {result2}% of {total2}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Percentage Change */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-orange-400" />
                  Percentage Increase/Decrease
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">From</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                    />
                  </div>
                  <ArrowRight className="h-4 w-4 mt-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs">To</Label>
                    <Input
                      type="number"
                      placeholder="125"
                      value={toValue}
                      onChange={(e) => setToValue(e.target.value)}
                    />
                  </div>
                </div>
                {percentageChange && (
                  <div className={`p-4 rounded-lg text-center ${parseFloat(percentageChange) >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <p className="text-sm text-muted-foreground">
                      {parseFloat(percentageChange) >= 0 ? 'Increase' : 'Decrease'}
                    </p>
                    <p className={`text-3xl font-bold ${parseFloat(percentageChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(percentageChange) >= 0 ? '+' : ''}{percentageChange}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add/Subtract Percentage */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-400" />
                  Add/Subtract Percentage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Base Number</Label>
                    <Input
                      type="number"
                      placeholder="200"
                      value={baseValue}
                      onChange={(e) => setBaseValue(e.target.value)}
                    />
                  </div>
                  <span className="mt-5">±</span>
                  <div className="flex-1">
                    <Label className="text-xs">Percentage</Label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={percentChange}
                      onChange={(e) => setPercentChange(e.target.value)}
                    />
                  </div>
                  <span className="mt-5">%</span>
                </div>
                {addPercent && subtractPercent && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-green-500/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">+ {percentChange}%</p>
                      <p className="text-xl font-bold text-green-400">{addPercent}</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">- {percentChange}%</p>
                      <p className="text-xl font-bold text-red-400">{subtractPercent}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Percentage Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Need to calculate percentages quickly? Our free percentage calculator handles all common percentage calculations 
            instantly. Whether you're figuring out a tip, calculating discounts, determining percentage increase or decrease, 
            or solving math problems - get accurate results in seconds.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">What You Can Calculate</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Percent of a Number:</strong> What is 20% of 150? Perfect for tips, taxes, and discounts</li>
            <li><strong>Percentage Value:</strong> 25 is what percent of 200? Great for test scores and ratios</li>
            <li><strong>Percentage Change:</strong> Calculate increase or decrease between two values</li>
            <li><strong>Add/Subtract Percent:</strong> Add markup or apply discounts to prices</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3">Common Uses</h3>
          <p className="text-muted-foreground mb-4">
            Restaurant tip calculation, shopping discounts, tax calculation, grade percentage, salary increase, 
            investment returns, body weight changes, and any mathematical percentage problems.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default PercentageCalculator;
