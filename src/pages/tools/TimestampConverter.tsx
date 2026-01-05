import { useState, useEffect } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = (ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num)) return null;
    const ms = ts.length > 10 ? num : num * 1000;
    return new Date(ms);
  };

  const dateToTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return Math.floor(date.getTime() / 1000);
  };

  const convertedDate = timestamp ? timestampToDate(timestamp) : null;
  const convertedTimestamp = dateInput ? dateToTimestamp(dateInput) : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is a Unix timestamp?",
      answer: "A Unix timestamp (also called Epoch time) is the number of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC. It's widely used in programming and databases to store and compare dates."
    },
    {
      question: "How do I convert a timestamp to a date?",
      answer: "Enter your Unix timestamp in the converter and it will instantly show the corresponding date and time in a human-readable format, including the day of week and timezone."
    },
    {
      question: "What's the difference between seconds and milliseconds timestamps?",
      answer: "Standard Unix timestamps are in seconds (10 digits), while JavaScript and some APIs use milliseconds (13 digits). Our converter automatically detects and handles both formats."
    },
    {
      question: "Why do programmers use Unix timestamps?",
      answer: "Timestamps are timezone-independent, easy to compare mathematically, compact for storage, and universally understood across programming languages and systems."
    },
    {
      question: "What is the Y2K38 problem?",
      answer: "The Year 2038 problem occurs because 32-bit systems storing Unix timestamps will overflow on January 19, 2038. Most modern systems now use 64-bit timestamps to avoid this issue."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Unix Timestamp Converter - Epoch Time to Date Free Online"
        description="Free Unix timestamp converter. Convert epoch time to human-readable date and vice versa. Live timestamp clock and conversion tool."
        keywords="unix timestamp, epoch converter, timestamp to date, date to timestamp, epoch time, unix time converter, timestamp calculator"
        canonical="https://pinetoolshub.com/timestamp-converter"
      />
      
      <ToolStructuredData
        toolName="Unix Timestamp Converter"
        toolDescription="Convert Unix timestamps to dates and dates to timestamps. Free online epoch time converter."
        toolUrl="https://pinetoolshub.com/timestamp-converter"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Timestamp Converter"
        description="Convert Unix timestamps to dates and dates to timestamps"
        icon={<Clock className="h-8 w-8" />}
        color="bg-purple-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Current Timestamp */}
          <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/50 mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-2">Current Unix Timestamp</p>
              <div className="flex items-center justify-center gap-4">
                <p className="text-4xl font-bold text-primary font-mono">{currentTimestamp}</p>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(currentTimestamp.toString())}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{new Date().toUTCString()}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Timestamp to Date */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Timestamp to Date
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timestamp" className="text-sm mb-2 block">Unix Timestamp</Label>
                    <Input
                      id="timestamp"
                      type="number"
                      placeholder="e.g., 1704067200"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  {convertedDate && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Converted Date:</p>
                      <p className="font-semibold">{convertedDate.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">UTC: {convertedDate.toUTCString()}</p>
                      <p className="text-xs text-muted-foreground">ISO: {convertedDate.toISOString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date to Timestamp */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" /> Date to Timestamp
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dateInput" className="text-sm mb-2 block">Date & Time</Label>
                    <Input
                      id="dateInput"
                      type="datetime-local"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                    />
                  </div>
                  {convertedTimestamp && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Unix Timestamp:</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold font-mono text-lg">{convertedTimestamp}</p>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(convertedTimestamp.toString())}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Milliseconds: {convertedTimestamp * 1000}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Timestamps */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Common Timestamps</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-muted/50 rounded">
                  <p className="font-bold">Unix Epoch</p>
                  <p className="text-muted-foreground font-mono">0</p>
                  <p className="text-xs text-muted-foreground">Jan 1, 1970</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <p className="font-bold">Y2K</p>
                  <p className="text-muted-foreground font-mono">946684800</p>
                  <p className="text-xs text-muted-foreground">Jan 1, 2000</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <p className="font-bold">2025</p>
                  <p className="text-muted-foreground font-mono">1735689600</p>
                  <p className="text-xs text-muted-foreground">Jan 1, 2025</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <p className="font-bold">Max 32-bit</p>
                  <p className="text-muted-foreground font-mono">2147483647</p>
                  <p className="text-xs text-muted-foreground">Jan 19, 2038</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Unix Timestamp Converter</h2>
          <p className="text-muted-foreground mb-4">
            Convert between Unix timestamps and human-readable dates instantly. Essential for developers, 
            system administrators, and anyone working with date/time data in software applications.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default TimestampConverter;
