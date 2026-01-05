import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Minus } from "lucide-react";

const TimeCalculator = () => {
  // Time addition
  const [hours1, setHours1] = useState(0);
  const [minutes1, setMinutes1] = useState(0);
  const [seconds1, setSeconds1] = useState(0);
  const [hours2, setHours2] = useState(0);
  const [minutes2, setMinutes2] = useState(0);
  const [seconds2, setSeconds2] = useState(0);

  // Time conversion
  const [convertValue, setConvertValue] = useState(3600);

  const addTimes = () => {
    let totalSeconds = seconds1 + seconds2;
    let totalMinutes = minutes1 + minutes2 + Math.floor(totalSeconds / 60);
    let totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60);
    
    return {
      hours: totalHours,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60
    };
  };

  const subtractTimes = () => {
    const total1 = hours1 * 3600 + minutes1 * 60 + seconds1;
    const total2 = hours2 * 3600 + minutes2 * 60 + seconds2;
    const diff = Math.abs(total1 - total2);
    
    return {
      hours: Math.floor(diff / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60
    };
  };

  const added = addTimes();
  const subtracted = subtractTimes();

  const formatTime = (h: number, m: number, s: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const faqs = [
    {
      question: "How do I add hours and minutes?",
      answer: "Enter the first time value in the left column (hours, minutes, seconds) and the second time in the right column. The calculator instantly shows the sum and difference."
    },
    {
      question: "Can I calculate overtime hours?",
      answer: "Yes! Enter your regular work hours and overtime hours separately, then see the total. Great for payroll calculations and time tracking."
    },
    {
      question: "How do I convert seconds to hours?",
      answer: "Use the conversion section at the bottom. Enter seconds and see the equivalent in hours, minutes, and formatted time display."
    },
    {
      question: "Does it handle times over 24 hours?",
      answer: "Absolutely! The calculator handles any amount of time - hours can exceed 24, making it perfect for calculating total project hours or multi-day durations."
    },
    {
      question: "Can I subtract times?",
      answer: "Yes, the calculator shows both addition and subtraction results. The subtraction shows the absolute difference between the two times."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Time Calculator - Add Subtract Hours Minutes Seconds Online"
        description="Free time calculator. Add or subtract hours, minutes, and seconds. Calculate time duration, convert seconds to hours, and more."
        keywords="time calculator, add hours, add minutes, time addition, hours calculator, time duration, subtract time, time converter"
        canonical="https://pinetoolshub.com/time-calculator"
      />
      
      <ToolStructuredData
        toolName="Time Calculator"
        toolDescription="Add or subtract hours, minutes, and seconds. Calculate time durations."
        toolUrl="https://pinetoolshub.com/time-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Time Calculator"
        description="Add or subtract hours, minutes, and seconds"
        icon={<Clock className="h-8 w-8" />}
        color="bg-sky-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                {/* Time 1 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Time 1</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Input
                        type="number"
                        value={hours1}
                        onChange={(e) => setHours1(parseInt(e.target.value) || 0)}
                        min={0}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">Hours</p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={minutes1}
                        onChange={(e) => setMinutes1(parseInt(e.target.value) || 0)}
                        min={0}
                        max={59}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">Min</p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={seconds1}
                        onChange={(e) => setSeconds1(parseInt(e.target.value) || 0)}
                        min={0}
                        max={59}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">Sec</p>
                    </div>
                  </div>
                </div>

                {/* Operators */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    <Plus className="h-6 w-6 text-green-400" />
                    <Minus className="h-6 w-6 text-red-400" />
                  </div>
                </div>

                {/* Time 2 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Time 2</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Input
                        type="number"
                        value={hours2}
                        onChange={(e) => setHours2(parseInt(e.target.value) || 0)}
                        min={0}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">Hours</p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={minutes2}
                        onChange={(e) => setMinutes2(parseInt(e.target.value) || 0)}
                        min={0}
                        max={59}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">Min</p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={seconds2}
                        onChange={(e) => setSeconds2(parseInt(e.target.value) || 0)}
                        min={0}
                        max={59}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">Sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-500/20 to-primary/20 border-green-500/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Addition Result
                </p>
                <p className="text-3xl font-bold font-mono">
                  {formatTime(added.hours, added.minutes, added.seconds)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {added.hours}h {added.minutes}m {added.seconds}s
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500/20 to-primary/20 border-red-500/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                  <Minus className="h-4 w-4" /> Difference
                </p>
                <p className="text-3xl font-bold font-mono">
                  {formatTime(subtracted.hours, subtracted.minutes, subtracted.seconds)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {subtracted.hours}h {subtracted.minutes}m {subtracted.seconds}s
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Time Conversion */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Time Conversion</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="convertValue" className="text-sm mb-2 block">Enter seconds</Label>
                  <Input
                    id="convertValue"
                    type="number"
                    value={convertValue}
                    onChange={(e) => setConvertValue(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xl font-bold">{convertValue}</p>
                    <p className="text-xs text-muted-foreground">Seconds</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xl font-bold">{(convertValue / 60).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xl font-bold">{(convertValue / 3600).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Hours</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xl font-bold">{(convertValue / 86400).toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">Days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Time Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Add or subtract hours, minutes, and seconds with ease. Perfect for calculating work hours, 
            project time, exercise duration, or any time-based calculations.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default TimeCalculator;
