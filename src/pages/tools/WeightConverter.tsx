import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale } from "lucide-react";

const units = [
  { value: "mg", label: "Milligrams (mg)", factor: 1000000 },
  { value: "g", label: "Grams (g)", factor: 1000 },
  { value: "kg", label: "Kilograms (kg)", factor: 1 },
  { value: "t", label: "Metric Tons (t)", factor: 0.001 },
  { value: "oz", label: "Ounces (oz)", factor: 35.274 },
  { value: "lb", label: "Pounds (lb)", factor: 2.20462 },
  { value: "st", label: "Stone (st)", factor: 0.157473 },
];

const WeightConverter = () => {
  const [value, setValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState("kg");
  const [toUnit, setToUnit] = useState("lb");

  const convert = () => {
    const inputValue = parseFloat(value) || 0;
    const fromFactor = units.find(u => u.value === fromUnit)?.factor || 1;
    const toFactor = units.find(u => u.value === toUnit)?.factor || 1;
    const kilograms = inputValue / fromFactor;
    return (kilograms * toFactor).toFixed(6).replace(/\.?0+$/, "");
  };

  const faqs = [
    {
      question: "How many pounds are in a kilogram?",
      answer: "One kilogram equals approximately 2.20462 pounds. Our weight converter calculates this precisely for any value you enter."
    },
    {
      question: "How do I convert ounces to grams?",
      answer: "One ounce equals approximately 28.3495 grams. Simply enter the ounce value and select grams as output to get instant conversion."
    },
    {
      question: "What is a stone measurement?",
      answer: "Stone is a British unit of weight equal to 14 pounds or about 6.35 kilograms. It's commonly used in the UK and Ireland for measuring body weight."
    },
    {
      question: "Is this weight converter accurate?",
      answer: "Yes, our converter uses internationally recognized conversion factors and provides results accurate to multiple decimal places."
    },
    {
      question: "Can I convert between metric and imperial weight?",
      answer: "Absolutely! Convert seamlessly between metric (grams, kilograms) and imperial (ounces, pounds, stone) weight measurements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Weight Converter - Convert Kg to Lbs, Grams, Ounces Free"
        description="Free weight converter to convert kilograms, pounds, grams, ounces, and stone. Instant kg to lbs conversion calculator online."
        keywords="weight converter, kg to lbs, pounds to kg, grams to ounces, weight calculator, mass converter, kg to pounds"
        canonical="https://pinetoolshub.com/weight-converter"
      />
      
      <ToolStructuredData
        toolName="Weight Converter - Mass Unit Calculator"
        toolDescription="Convert weight units instantly - kilograms, pounds, grams, ounces, stone and more."
        toolUrl="https://pinetoolshub.com/weight-converter"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Weight Converter"
        description="Convert kilograms, pounds, grams, ounces instantly"
        icon={<Scale className="h-8 w-8" />}
        color="bg-green-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="value" className="text-sm font-medium mb-2 block">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">To</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/20 to-green-500/20 border-primary/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">Result</p>
              <p className="text-4xl font-bold text-primary">{convert()} {toUnit}</p>
              <p className="text-sm text-muted-foreground mt-2">{value} {fromUnit} = {convert()} {toUnit}</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Weight Converter</h2>
          <p className="text-muted-foreground mb-4">
            Convert between kilograms and pounds, grams and ounces, or any weight measurement instantly. 
            Perfect for cooking, fitness tracking, shipping calculations, or scientific applications.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default WeightConverter;
