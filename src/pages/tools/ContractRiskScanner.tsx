import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Scale, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  Sparkles,
  Info
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface RiskItem {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  clause: string;
  recommendation: string;
}

interface ContractAnalysis {
  overallRiskScore: number;
  contractType: string;
  parties: string[];
  effectiveDate: string;
  terminationDate: string;
  keyTerms: {
    paymentTerms: string;
    terminationClause: string;
    liabilityLimit: string;
    confidentiality: string;
  };
  risks: RiskItem[];
  missingClauses: string[];
  summary: string;
}

const ContractRiskScanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ContractAnalysis | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    
    return text;
  };

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFile(file);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({ title: "Contract loaded!", description: "Ready for risk analysis." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to read contract.", variant: "destructive" });
    }
  }, []);

  const analyzeContract = async () => {
    if (!extractedText) {
      toast({ title: "No file", description: "Please upload a contract first.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "contract-risk-analysis",
          text: extractedText.slice(0, 20000)
        }
      });

      if (error) throw error;
      setResult(data);
      toast({ 
        title: "Analysis complete!", 
        description: `Found ${data.risks.length} potential risks.` 
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Error", description: "Failed to analyze contract.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Medium Risk</Badge>;
      default:
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Low Risk</Badge>;
    }
  };

  return (
    <>
      <SEOHead
        title="Contract Risk Scanner - AI Legal Document Analyzer | Pine Tools Hub"
        description="Free AI contract risk scanner. Upload any contract or agreement and get instant risk analysis, red flag detection, and clause recommendations. Perfect for freelancers, businesses, and legal review."
        keywords="contract risk scanner, legal document analyzer, contract analyzer ai, detect contract red flags, lease agreement checker, nda analyzer, employment contract review"
        canonical="https://pinetoolshub.com/contract-risk-scanner"
      />
      <ToolStructuredData
        toolName="Contract Risk Scanner"
        toolDescription="AI-powered contract analyzer that detects risks, red flags, and missing clauses in legal documents."
        toolUrl="https://pinetoolshub.com/contract-risk-scanner"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="Contract Risk Scanner"
          description="AI legal assistant that scans your contracts for risks, red flags, and missing protections. Get instant analysis before you sign."
          icon={<Scale className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Contract
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept={{ "application/pdf": [".pdf"] }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFileSelected}
                />
                {file && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Supported Contract Types</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Employment agreements, NDAs, lease agreements, freelance contracts, 
                      service agreements, SaaS terms, partnership agreements, and more.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={analyzeContract} 
              disabled={isAnalyzing || !extractedText}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning for Risks...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze Contract
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!result ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Scale className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload a Contract</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Our AI will scan for risks, unfair terms, and missing protections.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Risk Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Safety Score</h3>
                        <div className={`text-4xl font-bold ${getRiskColor(result.overallRiskScore)}`}>
                          {result.overallRiskScore}/100
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{result.contractType}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.risks.filter(r => r.severity === "high").length} high-risk items
                        </p>
                      </div>
                    </div>
                    <Progress value={result.overallRiskScore} className="h-2" />
                  </CardContent>
                </Card>

                {/* Key Terms */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Key Terms Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-xs text-muted-foreground">
                            {result.effectiveDate} - {result.terminationDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Payment</p>
                          <p className="text-xs text-muted-foreground">
                            {result.keyTerms.paymentTerms}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Risk Analysis ({result.risks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {result.risks.map((risk, index) => (
                        <AccordionItem key={index} value={`risk-${index}`}>
                          <AccordionTrigger className="text-sm">
                            <div className="flex items-center gap-2">
                              {getRiskBadge(risk.severity)}
                              <span>{risk.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 text-sm">
                              <p>{risk.description}</p>
                              <div className="p-2 bg-muted rounded text-xs">
                                <p className="font-medium mb-1">Clause:</p>
                                <p className="italic">"{risk.clause}"</p>
                              </div>
                              <div className="p-2 bg-green-500/10 rounded text-xs">
                                <p className="font-medium text-green-600 mb-1">Recommendation:</p>
                                <p>{risk.recommendation}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Missing Clauses */}
                {result.missingClauses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Missing Protections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.missingClauses.map((clause, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-3 w-3 mt-1 text-red-500 shrink-0" />
                            <span>{clause}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractRiskScanner;
