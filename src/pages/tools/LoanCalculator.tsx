import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(250000);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTerm, setLoanTerm] = useState(30);

  const result = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / numPayments,
        totalPayment: principal,
        totalInterest: 0
      };
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    
    return { monthlyPayment, totalPayment, totalInterest };
  }, [principal, interestRate, loanTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const faqs = [
    {
      question: "How is monthly mortgage payment calculated?",
      answer: "Monthly payments are calculated using the amortization formula that factors in your principal, interest rate, and loan term. This ensures equal payments throughout the loan."
    },
    {
      question: "What is included in the monthly payment?",
      answer: "This calculator shows principal and interest only (P&I). Your actual payment may include property taxes, homeowner's insurance, and PMI depending on your down payment."
    },
    {
      question: "How does loan term affect my payment?",
      answer: "Shorter terms mean higher monthly payments but less total interest. A 15-year mortgage typically has lower rates and saves significantly on interest compared to 30-year terms."
    },
    {
      question: "What is a good interest rate?",
      answer: "Interest rates vary by market conditions, credit score, and loan type. Check current rates with multiple lenders. Even small rate differences significantly impact total cost."
    },
    {
      question: "How much house can I afford?",
      answer: "A common guideline is spending no more than 28% of gross monthly income on housing. This calculator helps you see what different loan amounts cost monthly."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Loan Calculator - Mortgage Payment Calculator Free Online"
        description="Free loan calculator. Calculate monthly mortgage payments, total interest, and loan costs. EMI calculator for home loans, car loans, and personal loans."
        keywords="loan calculator, mortgage calculator, emi calculator, monthly payment calculator, home loan calculator, interest calculator, amortization calculator"
        canonical="https://pinetoolshub.com/loan-calculator"
      />
      
      <ToolStructuredData
        toolName="Loan Calculator"
        toolDescription="Calculate monthly loan payments, total interest, and amortization."
        toolUrl="https://pinetoolshub.com/loan-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Loan Calculator"
        description="Calculate monthly payments, total interest, and loan cost"
        icon={<DollarSign className="h-8 w-8" />}
        color="bg-emerald-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="principal">Loan Amount</Label>
                  <span className="font-mono font-bold">{formatCurrency(principal)}</span>
                </div>
                <Input
                  id="principal"
                  type="range"
                  min={10000}
                  max={1000000}
                  step={5000}
                  value={principal}
                  onChange={(e) => setPrincipal(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$10,000</span>
                  <span>$1,000,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="interestRate">Interest Rate (Annual)</Label>
                  <span className="font-mono font-bold">{interestRate}%</span>
                </div>
                <Input
                  id="interestRate"
                  type="range"
                  min={0.5}
                  max={15}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0.5%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="loanTerm">Loan Term</Label>
                  <span className="font-mono font-bold">{loanTerm} years</span>
                </div>
                <Input
                  id="loanTerm"
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 year</span>
                  <span>40 years</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setLoanTerm(15)}>15 Years</Button>
                <Button variant="outline" size="sm" onClick={() => setLoanTerm(20)}>20 Years</Button>
                <Button variant="outline" size="sm" onClick={() => setLoanTerm(30)}>30 Years</Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-to-r from-primary/20 to-emerald-500/20 border-primary/50 mb-6">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">Monthly Payment</p>
              <p className="text-5xl font-bold text-primary mb-6">
                {formatCurrency(result.monthlyPayment)}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold">{formatCurrency(result.totalPayment)}</p>
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-400">{formatCurrency(result.totalInterest)}</p>
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Payment Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Principal</span>
                    <span>{((principal / result.totalPayment) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(principal / result.totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Interest</span>
                    <span>{((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-400" 
                      style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Loan Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Calculate your monthly loan payments instantly. Perfect for mortgages, car loans, personal loans, 
            and any fixed-rate loan. See exactly how much you'll pay in interest over the life of your loan.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default LoanCalculator;
