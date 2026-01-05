import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler } from "lucide-react";

const units = [
  { value: "mm", label: "Millimeters (mm)", factor: 1000 },
  { value: "cm", label: "Centimeters (cm)", factor: 100 },
  { value: "m", label: "Meters (m)", factor: 1 },
  { value: "km", label: "Kilometers (km)", factor: 0.001 },
  { value: "in", label: "Inches (in)", factor: 39.3701 },
  { value: "ft", label: "Feet (ft)", factor: 3.28084 },
  { value: "yd", label: "Yards (yd)", factor: 1.09361 },
  { value: "mi", label: "Miles (mi)", factor: 0.000621371 },
];

const LengthConverter = () => {
  const [value, setValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");

  const convert = () => {
    const inputValue = parseFloat(value) || 0;
    const fromFactor = units.find(u => u.value === fromUnit)?.factor || 1;
    const toFactor = units.find(u => u.value === toUnit)?.factor || 1;
    const meters = inputValue / fromFactor;
    return (meters * toFactor).toFixed(6).replace(/\.?0+$/, "");
  };

  const faqs = [
    {
      question: "How do I convert meters to feet?",
      answer: "To convert meters to feet, multiply the meter value by 3.28084. Our length converter does this automatically - just enter your value in meters and select feet as the output unit. One meter equals approximately 3.28 feet."
    },
    {
      question: "What is the difference between inches and centimeters?",
      answer: "Inches are part of the imperial system used mainly in the US, while centimeters are part of the metric system used worldwide. One inch equals 2.54 centimeters. Our converter handles both seamlessly."
    },
    {
      question: "How many feet are in a mile?",
      answer: "There are exactly 5,280 feet in one mile. This conversion is commonly used for measuring distances in countries that use the imperial system."
    },
    {
      question: "Is this length converter accurate?",
      answer: "Yes! Our length converter uses precise conversion factors and provides results accurate to multiple decimal places. It's suitable for both everyday use and professional applications."
    },
    {
      question: "Can I convert between metric and imperial units?",
      answer: "Absolutely! Our converter supports both metric (mm, cm, m, km) and imperial (inches, feet, yards, miles) units, allowing seamless conversion between any combination."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Length Converter - Convert Meters, Feet, Inches, Cm Online Free"
        description="Free length converter to convert between meters, feet, inches, centimeters, kilometers, miles and more. Instant metric to imperial conversion calculator."
        keywords="length converter, meters to feet, feet to meters, inches to cm, cm to inches, length calculator, unit converter, metric converter"
        canonical="https://pinetoolshub.com/length-converter"
      />
      
      <ToolStructuredData
        toolName="Length Converter - Unit Conversion Calculator"
        toolDescription="Convert length units instantly - meters, feet, inches, centimeters, kilometers, miles and more."
        toolUrl="https://pinetoolshub.com/length-converter"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Length Converter"
        description="Convert between meters, feet, inches, and more instantly"
        icon={<Ruler className="h-8 w-8" />}
        color="bg-blue-500/20"
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

          <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">Result</p>
              <p className="text-4xl font-bold text-primary">{convert()} {toUnit}</p>
              <p className="text-sm text-muted-foreground mt-2">{value} {fromUnit} = {convert()} {toUnit}</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Length Converter</h2>
          <p className="text-muted-foreground mb-4">
            Need to convert meters to feet or inches to centimeters? Our free length converter handles all common 
            length and distance conversions instantly. Perfect for construction, DIY projects, travel planning, 
            or any situation requiring unit conversions.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">Supported Units</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Metric:</strong> Millimeters, Centimeters, Meters, Kilometers</li>
            <li><strong>Imperial:</strong> Inches, Feet, Yards, Miles</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default LengthConverter;
