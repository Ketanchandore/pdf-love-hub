import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Coins, ArrowRightLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.50 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.88 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 3.67 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const result = useMemo(() => {
    const inputAmount = parseFloat(amount) || 0;
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    const usdAmount = inputAmount / fromRate;
    return (usdAmount * toRate).toFixed(2);
  }, [amount, fromCurrency, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const faqs = [
    {
      question: "How accurate are these exchange rates?",
      answer: "These are approximate rates for reference. For actual transactions, please check with your bank or a live currency exchange service as rates fluctuate constantly."
    },
    {
      question: "How do I convert USD to EUR?",
      answer: "Enter the amount, select USD as the source currency and EUR as the target. The converter instantly shows the approximate converted amount."
    },
    {
      question: "Can I convert between any two currencies?",
      answer: "Yes! Select any two currencies from our list of 12 major world currencies and the converter will calculate the exchange."
    },
    {
      question: "Why do exchange rates change?",
      answer: "Exchange rates fluctuate based on economic factors like interest rates, inflation, political stability, and market demand. They change constantly in global forex markets."
    },
    {
      question: "What currencies are supported?",
      answer: "We support major world currencies: USD, EUR, GBP, INR, AUD, CAD, JPY, CNY, CHF, SGD, AED, and SAR."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Currency Converter - USD EUR GBP INR Exchange Rate Calculator"
        description="Free currency converter. Convert between USD, EUR, GBP, INR and 10+ currencies. Quick exchange rate calculator online."
        keywords="currency converter, exchange rate, usd to eur, usd to inr, currency calculator, money converter, forex converter"
        canonical="https://pinetoolshub.com/currency-converter"
      />
      
      <ToolStructuredData
        toolName="Currency Converter"
        toolDescription="Convert between major world currencies with approximate exchange rates."
        toolUrl="https://pinetoolshub.com/currency-converter"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Currency Converter"
        description="Convert between major world currencies"
        icon={<Coins className="h-8 w-8" />}
        color="bg-amber-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium mb-2 block">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl"
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {currencies.map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <button onClick={swap} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowRightLeft className="h-5 w-5" />
                  </button>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">To</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {currencies.map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/20 to-amber-500/20 border-primary/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">
                {amount} {fromCurrency} =
              </p>
              <p className="text-4xl font-bold text-primary">
                {currencies.find(c => c.code === toCurrency)?.symbol}{result} {toCurrency}
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                * Approximate rate. Check with your bank for actual transaction rates.
              </p>
            </CardContent>
          </Card>

          {/* Popular Conversions */}
          <Card className="bg-card border-border mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Current Exchange Rates (vs USD)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {currencies.filter(c => c.code !== "USD").slice(0, 8).map(c => (
                  <div key={c.code} className="p-2 bg-muted/50 rounded text-center">
                    <p className="font-mono font-bold">{c.code}</p>
                    <p className="text-muted-foreground">{c.rate.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Currency Converter</h2>
          <p className="text-muted-foreground mb-4">
            Quickly convert between major world currencies using approximate exchange rates. Perfect for 
            travel planning, international shopping, or quick currency calculations.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default CurrencyConverter;
