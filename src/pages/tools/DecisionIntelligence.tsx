import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShieldAlert, Sparkles, Download, RefreshCw, CheckCircle, 
  AlertTriangle, XCircle, FileText, TrendingUp, Scale
} from "lucide-react";
import { motion } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Risk {
  category: string;
  severity: string;
  title: string;
  description: string;
  location: string;
  recommendation: string;
}

interface RiskAnalysis {
  overallRiskScore: string;
  summary: string;
  risks: Risk[];
  positives: string[];
  recommendations: string[];
}

const DecisionIntelligence = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setAnalysis(null);
      
      if (selectedFile.type === "application/pdf") {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          
          for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += pageText + "\n\n";
          }
          
          setText(fullText);
          toast({
            title: "Document Loaded",
            description: `Ready to analyze for risks`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to read PDF",
            variant: "destructive",
          });
        }
      }
    }
  };

  const analyzeRisks = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          type: "risk-analysis",
          text: text,
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result) {
        setAnalysis(data.result);
        toast({
          title: "Analysis Complete!",
          description: `Found ${data.result.risks?.length || 0} potential risks`,
        });
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze document",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, toast]);

  const downloadReport = () => {
    if (!analysis) return;
    const report = `
DOCUMENT RISK ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
Document: ${file?.name || "Unknown"}

OVERALL RISK SCORE: ${analysis.overallRiskScore?.toUpperCase()}

SUMMARY
${analysis.summary}

IDENTIFIED RISKS
${analysis.risks?.map((risk, i) => `
${i + 1}. [${risk.severity.toUpperCase()}] ${risk.title}
   Category: ${risk.category}
   Location: ${risk.location}
   Description: ${risk.description}
   Recommendation: ${risk.recommendation}
`).join("\n")}

POSITIVE ASPECTS
${analysis.positives?.map((p, i) => `${i + 1}. ${p}`).join("\n")}

RECOMMENDATIONS
${analysis.recommendations?.map((r, i) => `${i + 1}. ${r}`).join("\n")}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "document"}-risk-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return <XCircle className="h-5 w-5 text-red-500" />;
      case "high": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "medium": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getOverallScoreColor = (score: string) => {
    switch (score?.toLowerCase()) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const faqs = [
    {
      question: "What types of documents can the Decision Intelligence analyze?",
      answer: "Our AI analyzes contracts, agreements, legal documents, business proposals, invoices, and any document containing terms, conditions, or commitments. It's especially powerful for contracts, NDAs, service agreements, and employment offers.",
    },
    {
      question: "What risks does it detect?",
      answer: "The AI identifies legal risks (unfavorable clauses, liability exposure), financial risks (hidden costs, payment terms), operational risks (unrealistic deadlines), and compliance issues. It also flags missing protections you should request.",
    },
    {
      question: "How accurate is the risk analysis?",
      answer: "Our AI provides high-quality analysis based on patterns in legal and business documents. However, for legally binding decisions, we always recommend review by a qualified attorney. The tool is meant to help you identify areas requiring attention.",
    },
    {
      question: "Can I use this for contract negotiations?",
      answer: "Absolutely! The recommendations section provides specific points to negotiate. Understanding risks before signing gives you leverage to request better terms or additional protections.",
    },
    {
      question: "Is my document kept confidential?",
      answer: "Yes, documents are processed securely and not stored. Your sensitive business and legal documents are protected throughout the analysis process.",
    },
  ];

  return (
    <>
      <SEOHead
        title="AI Contract Risk Analyzer | Document Risk Assessment Tool"
        description="Analyze contracts and documents for legal, financial, and operational risks using AI. Get risk scores, detailed analysis, and negotiation recommendations."
        canonicalUrl="https://pinetoolshub.com/decision-intelligence"
        keywords="contract risk analysis, document risk assessment, legal document analyzer, contract review AI, risk detection, due diligence tool"
      />
      <ToolStructuredData
        toolName="Decision Intelligence"
        toolDescription="AI-powered document risk analysis and decision support"
        toolUrl="https://pinetoolshub.com/decision-intelligence"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <ToolHero
          title="Decision Intelligence"
          description="AI-powered risk analysis for contracts and documents. Identify legal, financial, and operational risks before signing."
          icon={<ShieldAlert className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
          {!analysis ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-6 space-y-6">
                <FileUpload
                  accept={{ "application/pdf": [".pdf"] }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFilesSelected}
                />
                
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}

                {isProcessing ? (
                  <ProcessingStatus progress={progress} message="AI is analyzing document risks..." />
                ) : (
                  <Button
                    onClick={analyzeRisks}
                    disabled={!text.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Document Risks
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={getOverallScoreColor(analysis.overallRiskScore)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/50 rounded-full">
                          <Scale className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-sm font-medium opacity-75">Overall Risk Score</p>
                          <p className="text-3xl font-bold uppercase">{analysis.overallRiskScore}</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={downloadReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                    <p className="mt-4 text-sm">{analysis.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Risk Stats */}
              <div className="grid grid-cols-4 gap-4">
                {["critical", "high", "medium", "low"].map((severity) => {
                  const count = analysis.risks?.filter((r) => r.severity?.toLowerCase() === severity).length || 0;
                  return (
                    <Card key={severity} className="text-center">
                      <CardContent className="p-4">
                        <p className={`text-2xl font-bold ${getRiskColor(severity).replace("bg-", "text-")}`}>
                          {count}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">{severity}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Risks List */}
              {analysis.risks && analysis.risks.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Identified Risks ({analysis.risks.length})
                    </h3>
                    <div className="space-y-4">
                      {analysis.risks.map((risk, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            {getRiskIcon(risk.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{risk.title}</span>
                                <Badge variant="outline" className="capitalize">
                                  {risk.category}
                                </Badge>
                                <Badge className={`${getRiskColor(risk.severity)} text-white`}>
                                  {risk.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                              {risk.location && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  📍 Found in: {risk.location}
                                </p>
                              )}
                              <div className="p-2 bg-primary/5 rounded text-sm">
                                <span className="font-medium">Recommendation:</span> {risk.recommendation}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Positives & Recommendations */}
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.positives && analysis.positives.length > 0 && (
                  <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        Positive Aspects
                      </h3>
                      <ul className="space-y-2">
                        {analysis.positives.map((pos, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            {pos}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <TrendingUp className="h-5 w-5" />
                        Priority Actions
                      </h3>
                      <ol className="space-y-2 list-decimal list-inside">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm">{rec}</li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null);
                    setFile(null);
                    setText("");
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Analyze Another Document
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Make Informed Decisions with AI</h2>
          <p className="text-muted-foreground">
            Before signing any contract or agreement, understand the risks. Our Decision Intelligence tool
            analyzes documents like a legal expert, identifying potential issues that could cost you money,
            create liability, or lock you into unfavorable terms.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Beyond Simple Document Review</h3>
          <p className="text-muted-foreground">
            Traditional document review is time-consuming and error-prone. Our AI reads the entire document,
            understands context, and identifies risks that might be buried in complex legal language or
            scattered across multiple sections.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Perfect for Business Professionals</h3>
          <p className="text-muted-foreground">
            Whether you're reviewing vendor contracts, employment agreements, NDAs, or partnership deals,
            get actionable insights in minutes instead of hours. Focus your legal team's time on the
            issues that matter most.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default DecisionIntelligence;
