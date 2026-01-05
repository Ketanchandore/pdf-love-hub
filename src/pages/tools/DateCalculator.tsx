import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Copy, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const DateCalculator = () => {
  // Days between dates
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  
  // Add/subtract days
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [daysToAdd, setDaysToAdd] = useState(30);

  const calculateDaysBetween = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    return { days, weeks, months, years };
  };

  const calculateNewDate = (operation: 'add' | 'subtract') => {
    if (!baseDate) return null;
    const date = new Date(baseDate);
    const multiplier = operation === 'add' ? 1 : -1;
    date.setDate(date.getDate() + (daysToAdd * multiplier));
    return date;
  };

  const daysBetween = calculateDaysBetween();
  const addedDate = calculateNewDate('add');
  const subtractedDate = calculateNewDate('subtract');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const faqs = [
    {
      question: "How do I calculate days between two dates?",
      answer: "Enter your start and end dates in the 'Days Between Dates' section. The calculator instantly shows the difference in days, weeks, months, and years."
    },
    {
      question: "Can I add days to a specific date?",
      answer: "Yes! Use the 'Add/Subtract Days' section. Enter your starting date and the number of days, and see what date it will be after adding or subtracting those days."
    },
    {
      question: "Does it account for leap years?",
      answer: "Yes, our calculator uses accurate date mathematics that properly accounts for leap years and varying month lengths."
    },
    {
      question: "What's the difference between calendar days and business days?",
      answer: "Calendar days include all days (weekends included), while business days typically exclude weekends and holidays. This calculator shows calendar days."
    },
    {
      question: "Can I calculate how many weeks are between dates?",
      answer: "Absolutely! When you calculate days between two dates, we also show the equivalent in weeks, months, and years."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Date Calculator - Days Between Dates, Add Subtract Days Free"
        description="Free date calculator. Find days between two dates or add/subtract days from a date. Calculate weeks, months, years between dates online."
        keywords="date calculator, days between dates, add days to date, subtract days, date difference, how many days until, date counter, day counter"
        canonical="https://pinetoolshub.com/date-calculator"
      />
      
      <ToolStructuredData
        toolName="Date Calculator"
        toolDescription="Calculate days between dates or add/subtract days from any date."
        toolUrl="https://pinetoolshub.com/date-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Date Calculator"
        description="Calculate days between dates or add/subtract days"
        icon={<CalendarIcon className="h-8 w-8" />}
        color="bg-violet-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Days Between Dates */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" /> Days Between Dates
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm mb-2 block">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-sm mb-2 block">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {daysBetween && (
                    <div className="p-4 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-lg">
                      <p className="text-3xl font-bold text-center text-primary mb-2">
                        {daysBetween.days.toLocaleString()} days
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <p className="font-bold">{daysBetween.weeks}</p>
                          <p className="text-muted-foreground text-xs">weeks</p>
                        </div>
                        <div>
                          <p className="font-bold">{daysBetween.months}</p>
                          <p className="text-muted-foreground text-xs">months</p>
                        </div>
                        <div>
                          <p className="font-bold">{daysBetween.years}</p>
                          <p className="text-muted-foreground text-xs">years</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add/Subtract Days */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Add/Subtract Days
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="baseDate" className="text-sm mb-2 block">Starting Date</Label>
                    <Input
                      id="baseDate"
                      type="date"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="daysToAdd" className="text-sm mb-2 block">Number of Days</Label>
                    <Input
                      id="daysToAdd"
                      type="number"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
                      min={0}
                    />
                  </div>

                  {addedDate && subtractedDate && (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-500/10 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Plus className="h-3 w-3" /> {daysToAdd} days
                          </p>
                          <p className="font-semibold text-sm">{formatDate(addedDate)}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(formatDate(addedDate))}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 bg-red-500/10 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Minus className="h-3 w-3" /> {daysToAdd} days
                          </p>
                          <p className="font-semibold text-sm">{formatDate(subtractedDate)}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(formatDate(subtractedDate))}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Presets */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Quick Presets</h3>
              <div className="flex flex-wrap gap-2">
                {[7, 14, 30, 60, 90, 180, 365].map((days) => (
                  <Button key={days} variant="outline" size="sm" onClick={() => setDaysToAdd(days)}>
                    {days} days
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Date Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Calculate the number of days between any two dates, or find what date it will be after adding 
            or subtracting days. Perfect for project planning, deadline tracking, or countdown calculations.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default DateCalculator;
