import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer } from "lucide-react";

const units = [
  { value: "c", label: "Celsius (°C)" },
  { value: "f", label: "Fahrenheit (°F)" },
  { value: "k", label: "Kelvin (K)" },
];

const TemperatureConverter = () => {
  const [value, setValue] = useState<string>("0");
  const [fromUnit, setFromUnit] = useState("c");
  const [toUnit, setToUnit] = useState("f");

  const convert = () => {
    const v = parseFloat(value) || 0;
    
    // First convert to Celsius
    let celsius: number;
    if (fromUnit === "c") celsius = v;
    else if (fromUnit === "f") celsius = (v - 32) * 5 / 9;
    else celsius = v - 273.15;
    
    // Then convert from Celsius to target
    let result: number;
    if (toUnit === "c") result = celsius;
    else if (toUnit === "f") result = celsius * 9 / 5 + 32;
    else result = celsius + 273.15;
    
    return result.toFixed(2).replace(/\.?0+$/, "");
  };

  const faqs = [
    {
      question: "How do I convert Celsius to Fahrenheit?",
      answer: "To convert Celsius to Fahrenheit, multiply by 9/5 (or 1.8) and add 32. For example, 20°C = (20 × 1.8) + 32 = 68°F. Our converter does this calculation instantly."
    },
    {
      question: "How do I convert Fahrenheit to Celsius?",
      answer: "To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9. For example, 68°F = (68 - 32) × 5/9 = 20°C."
    },
    {
      question: "What is Kelvin and when is it used?",
      answer: "Kelvin is the SI unit of temperature used in science. It starts at absolute zero (-273.15°C). To convert Celsius to Kelvin, add 273.15."
    },
    {
      question: "What is 0 degrees Celsius in Fahrenheit?",
      answer: "0°C equals 32°F - this is the freezing point of water. Similarly, 100°C equals 212°F, which is water's boiling point."
    },
    {
      question: "What is normal body temperature in both units?",
      answer: "Normal human body temperature is approximately 37°C or 98.6°F. However, it can vary slightly between individuals."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Temperature Converter - Celsius to Fahrenheit, Kelvin Free"
        description="Free temperature converter to convert Celsius, Fahrenheit, and Kelvin. Instant C to F conversion calculator online."
        keywords="temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, C to F, F to C, temperature calculator"
        canonical="https://pinetoolshub.com/temperature-converter"
      />
      
      <ToolStructuredData
        toolName="Temperature Converter - Celsius Fahrenheit Kelvin"
        toolDescription="Convert temperature units instantly - Celsius, Fahrenheit, and Kelvin."
        toolUrl="https://pinetoolshub.com/temperature-converter"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Temperature Converter"
        description="Convert Celsius, Fahrenheit, and Kelvin instantly"
        icon={<Thermometer className="h-8 w-8" />}
        color="bg-orange-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="value" className="text-sm font-medium mb-2 block">Temperature</Label>
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

          <Card className="bg-gradient-to-r from-primary/20 to-orange-500/20 border-primary/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">Result</p>
              <p className="text-4xl font-bold text-primary">{convert()}°{toUnit.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground mt-2">{value}°{fromUnit.toUpperCase()} = {convert()}°{toUnit.toUpperCase()}</p>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Quick Reference</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">Water Freezing</p>
                  <p className="text-muted-foreground">0°C / 32°F</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">Body Temp</p>
                  <p className="text-muted-foreground">37°C / 98.6°F</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="font-bold">Water Boiling</p>
                  <p className="text-muted-foreground">100°C / 212°F</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Temperature Converter</h2>
          <p className="text-muted-foreground mb-4">
            Need to convert Celsius to Fahrenheit or vice versa? Our free temperature converter handles conversions 
            between Celsius, Fahrenheit, and Kelvin instantly. Essential for cooking, weather, science, and travel.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default TemperatureConverter;
