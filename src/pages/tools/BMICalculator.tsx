import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Heart, TrendingUp } from "lucide-react";

const BMICalculator = () => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const bmiData = useMemo(() => {
    let bmi = 0;
    
    if (unit === "metric" && weight && height) {
      const weightKg = parseFloat(weight);
      const heightM = parseFloat(height) / 100;
      bmi = weightKg / (heightM * heightM);
    } else if (unit === "imperial" && weight && (heightFt || heightIn)) {
      const weightLbs = parseFloat(weight);
      const totalInches = (parseFloat(heightFt || "0") * 12) + parseFloat(heightIn || "0");
      if (totalInches > 0) {
        bmi = (weightLbs * 703) / (totalInches * totalInches);
      }
    }

    if (bmi <= 0) return null;

    let category = "";
    let color = "";
    let advice = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-400";
      advice = "You may need to gain some weight. Consider consulting a healthcare provider about healthy weight gain strategies.";
    } else if (bmi < 25) {
      category = "Normal Weight";
      color = "text-green-400";
      advice = "Great! Your BMI is within the healthy range. Maintain your current lifestyle with balanced diet and regular exercise.";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-400";
      advice = "Consider lifestyle changes including increased physical activity and dietary modifications. Consult a healthcare provider for personalized advice.";
    } else {
      category = "Obese";
      color = "text-red-400";
      advice = "It's recommended to consult a healthcare provider for a comprehensive health assessment and personalized weight management plan.";
    }

    // Healthy weight range (BMI 18.5-24.9)
    let healthyWeightMin = 0;
    let healthyWeightMax = 0;
    
    if (unit === "metric" && height) {
      const heightM = parseFloat(height) / 100;
      healthyWeightMin = 18.5 * heightM * heightM;
      healthyWeightMax = 24.9 * heightM * heightM;
    } else if (unit === "imperial" && (heightFt || heightIn)) {
      const totalInches = (parseFloat(heightFt || "0") * 12) + parseFloat(heightIn || "0");
      healthyWeightMin = (18.5 * totalInches * totalInches) / 703;
      healthyWeightMax = (24.9 * totalInches * totalInches) / 703;
    }

    return {
      bmi: bmi.toFixed(1),
      category,
      color,
      advice,
      healthyWeightMin: healthyWeightMin.toFixed(1),
      healthyWeightMax: healthyWeightMax.toFixed(1)
    };
  }, [unit, weight, height, heightFt, heightIn]);

  const faqs = [
    {
      question: "What is BMI and how is it calculated?",
      answer: "BMI (Body Mass Index) is a measure of body fat based on height and weight. For metric units: BMI = weight(kg) ÷ height(m)². For imperial: BMI = (weight(lbs) × 703) ÷ height(inches)². It's a simple screening tool to identify potential weight problems."
    },
    {
      question: "What is a healthy BMI range?",
      answer: "A healthy BMI range is typically 18.5 to 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese. However, BMI doesn't account for muscle mass, bone density, or fat distribution."
    },
    {
      question: "Is BMI accurate for everyone?",
      answer: "BMI is a useful screening tool but has limitations. It may overestimate body fat in athletes with high muscle mass and underestimate it in older adults who have lost muscle. It doesn't distinguish between fat and muscle or consider where fat is distributed."
    },
    {
      question: "Should I use metric or imperial measurements?",
      answer: "Use whichever system you're more comfortable with. Metric uses kilograms for weight and centimeters for height. Imperial uses pounds for weight and feet/inches for height. Our calculator supports both and gives the same BMI result."
    },
    {
      question: "What should I do if my BMI is outside the healthy range?",
      answer: "If your BMI is outside the healthy range, consider consulting a healthcare provider. They can assess your overall health, consider other factors like waist circumference and body composition, and provide personalized recommendations."
    },
    {
      question: "Does BMI apply to children?",
      answer: "BMI calculation is the same for children, but interpretation differs. Children's BMI is compared to other children of the same age and sex using percentiles. This calculator is designed for adults (20 years and older)."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="BMI Calculator - Calculate Body Mass Index Free Online 2025"
        description="Calculate your BMI (Body Mass Index) instantly! Free online BMI calculator with weight category, healthy weight range, and health advice. Metric & Imperial units."
        keywords="bmi calculator, body mass index calculator, calculate bmi, bmi check, healthy weight calculator, am i overweight, weight calculator, bmi formula"
        canonical="https://pinetoolshub.com/bmi-calculator"
      />
      
      <ToolStructuredData
        toolName="BMI Calculator - Body Mass Index Calculator"
        toolDescription="Calculate your BMI instantly with our free online Body Mass Index calculator. Get weight category, healthy weight range, and personalized health advice."
        toolUrl="https://pinetoolshub.com/bmi-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="BMI Calculator"
        description="Calculate your Body Mass Index (BMI) instantly. Find your weight category and healthy weight range!"
        icon={<Scale className="h-8 w-8" />}
        color="bg-cyan-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Calculator */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <Tabs value={unit} onValueChange={(v) => setUnit(v as typeof unit)} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric (kg, cm)</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial (lbs, ft/in)</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Weight ({unit === "metric" ? "kg" : "lbs"})
                  </Label>
                  <Input
                    type="number"
                    placeholder={unit === "metric" ? "70" : "154"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {unit === "metric" ? (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Height (cm)</Label>
                    <Input
                      type="number"
                      placeholder="175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Feet</Label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Inches</Label>
                      <Input
                        type="number"
                        placeholder="9"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {bmiData && (
            <>
              <Card className="bg-gradient-to-r from-primary/20 to-cyan-500/20 border-primary/50 mb-6">
                <CardContent className="p-8 text-center">
                  <h2 className="text-lg text-muted-foreground mb-2">Your BMI</h2>
                  <p className={`text-6xl font-bold ${bmiData.color}`}>{bmiData.bmi}</p>
                  <p className={`text-2xl font-semibold mt-2 ${bmiData.color}`}>{bmiData.category}</p>
                </CardContent>
              </Card>

              {/* BMI Scale */}
              <Card className="bg-card border-border mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">BMI Categories</h3>
                  <div className="relative h-8 rounded-full overflow-hidden mb-2">
                    <div className="absolute inset-0 flex">
                      <div className="flex-1 bg-blue-500" title="Underweight" />
                      <div className="flex-1 bg-green-500" title="Normal" />
                      <div className="flex-1 bg-yellow-500" title="Overweight" />
                      <div className="flex-1 bg-red-500" title="Obese" />
                    </div>
                    {/* Indicator */}
                    <div 
                      className="absolute top-0 w-1 h-full bg-white shadow-lg"
                      style={{ 
                        left: `${Math.min(Math.max((parseFloat(bmiData.bmi) - 15) / 25 * 100, 0), 100)}%`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  </div>
                  <div className="flex text-xs text-muted-foreground">
                    <span className="flex-1 text-center">Under 18.5</span>
                    <span className="flex-1 text-center">18.5 - 24.9</span>
                    <span className="flex-1 text-center">25 - 29.9</span>
                    <span className="flex-1 text-center">30+</span>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm">Healthy Weight Range</h4>
                        <p className="text-2xl font-bold text-green-400">
                          {bmiData.healthyWeightMin} - {bmiData.healthyWeightMax}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {unit === "metric" ? "kg" : "lbs"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm">Recommendation</h4>
                        <p className="text-sm text-muted-foreground">{bmiData.advice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online BMI Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Calculate your Body Mass Index (BMI) instantly with our free online calculator. BMI is a widely used measure 
            to determine if your weight is healthy for your height. Get your BMI score, weight category, and personalized 
            recommendations in seconds.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">Understanding BMI Categories</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Underweight (Below 18.5):</strong> May indicate nutritional deficiency or health issues</li>
            <li><strong>Normal Weight (18.5 - 24.9):</strong> Healthy range associated with lowest health risks</li>
            <li><strong>Overweight (25 - 29.9):</strong> May increase risk of health conditions</li>
            <li><strong>Obese (30 and above):</strong> Higher risk of weight-related health problems</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3">Important Notes</h3>
          <p className="text-muted-foreground mb-4">
            While BMI is a useful screening tool, it doesn't directly measure body fat or account for factors like 
            muscle mass, bone density, age, sex, or ethnicity. Athletes may have high BMI due to muscle mass. 
            Always consult healthcare professionals for comprehensive health assessments.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default BMICalculator;
