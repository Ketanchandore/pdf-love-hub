import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Accessibility,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Loader2,
  Download,
  Eye,
  Type,
  Image,
  List,
  BookOpen
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AccessibilityIssue {
  id: string;
  category: "structure" | "images" | "text" | "navigation" | "color";
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  wcagCriteria: string;
  howToFix: string;
}

interface AccessibilityResult {
  overallScore: number;
  wcagLevel: "A" | "AA" | "AAA" | "Fail";
  totalIssues: number;
  errors: number;
  warnings: number;
  passed: number;
  issues: AccessibilityIssue[];
  passedChecks: string[];
  recommendations: string[];
}

const PdfAccessibilityChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AccessibilityResult | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += `[Page ${i}]\n` + content.items.map((item: any) => item.str).join(" ") + "\n\n";
    }
    
    return text;
  };

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFile(file);
    setResult(null);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({ title: "PDF loaded!", description: "Ready for accessibility check." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to read PDF.", variant: "destructive" });
    }
  }, []);

  const checkAccessibility = async () => {
    if (!extractedText) {
      toast({ title: "No file", description: "Please upload a PDF first.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "accessibility-check",
          text: extractedText.slice(0, 25000)
        }
      });

      if (error) throw error;
      
      const safeResult: AccessibilityResult = {
        overallScore: data?.overallScore ?? 0,
        wcagLevel: data?.wcagLevel ?? "Fail",
        totalIssues: data?.totalIssues ?? 0,
        errors: data?.errors ?? 0,
        warnings: data?.warnings ?? 0,
        passed: data?.passed ?? 0,
        issues: Array.isArray(data?.issues) ? data.issues : [],
        passedChecks: Array.isArray(data?.passedChecks) ? data.passedChecks : [],
        recommendations: Array.isArray(data?.recommendations) ? data.recommendations : []
      };
      
      setResult(safeResult);
      toast({ 
        title: "Check complete!", 
        description: `Accessibility score: ${safeResult.overallScore}/100` 
      });
    } catch (error) {
      console.error("Accessibility check error:", error);
      toast({ title: "Error", description: "Failed to check accessibility.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/10 text-yellow-600">Warning</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "structure": return <List className="h-4 w-4" />;
      case "images": return <Image className="h-4 w-4" />;
      case "text": return <Type className="h-4 w-4" />;
      case "navigation": return <BookOpen className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const report = JSON.stringify(result, null, 2);
    const blob = new Blob([report], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accessibility-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="PDF Accessibility Checker - WCAG Compliance Scanner | Pine Tools Hub"
        description="Free PDF accessibility checker. Scan PDFs for WCAG 2.1 compliance issues, alt text, document structure, and get remediation suggestions. Make your PDFs accessible for screen readers."
        keywords="pdf accessibility checker, wcag pdf scanner, accessible pdf, pdf screen reader, ada compliance pdf, pdf accessibility remediation, make pdf accessible"
        canonical="https://pinetoolshub.com/pdf-accessibility-checker"
      />
      <ToolStructuredData
        toolName="PDF Accessibility Checker"
        toolDescription="Scan PDFs for WCAG accessibility issues and get recommendations to make documents accessible for everyone."
        toolUrl="https://pinetoolshub.com/pdf-accessibility-checker"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="PDF Accessibility Checker"
          description="Scan your PDF for WCAG 2.1 compliance. Detect missing alt text, heading structure issues, and get remediation suggestions."
          icon={<Accessibility className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload PDF
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

            <Button 
              onClick={checkAccessibility} 
              disabled={isAnalyzing || !extractedText}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking Accessibility...
                </>
              ) : (
                <>
                  <Accessibility className="h-4 w-4 mr-2" />
                  Check Accessibility
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {!result ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Accessibility className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload a PDF</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    We'll check for WCAG 2.1 compliance and provide remediation guidance.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Accessibility Score</h3>
                        <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}/100
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={result.wcagLevel === "Fail" ? "destructive" : "secondary"}>
                          WCAG {result.wcagLevel}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.errors} errors, {result.warnings} warnings
                        </p>
                      </div>
                    </div>
                    <Progress value={result.overallScore} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Issues Found ({result.totalIssues})</CardTitle>
                    <Button variant="outline" size="sm" onClick={downloadReport}>
                      <Download className="h-4 w-4 mr-1" />
                      Export Report
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {result.issues.map((issue, i) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(issue.category)}
                            {getSeverityBadge(issue.severity)}
                            <span className="text-xs text-muted-foreground">{issue.wcagCriteria}</span>
                          </div>
                          <h4 className="font-medium text-sm">{issue.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                          <div className="mt-2 p-2 bg-green-500/10 rounded text-xs">
                            <span className="font-medium text-green-600">Fix: </span>
                            {issue.howToFix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {result.passedChecks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Passed Checks ({result.passedChecks.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {result.passedChecks.slice(0, 5).map((check, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {check}
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

export default PdfAccessibilityChecker;
