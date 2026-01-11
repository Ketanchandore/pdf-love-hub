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
  HeartPulse,
  FileText,
  Loader2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Shield,
  BookOpen,
  Target,
  Sparkles,
  TrendingUp
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "fair" | "poor";
  details: string;
  suggestions: string[];
}

interface HealthScoreResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  categories: {
    readability: ScoreCategory;
    completeness: ScoreCategory;
    structure: ScoreCategory;
    accuracy: ScoreCategory;
    legalSafety: ScoreCategory;
    seoReadiness: ScoreCategory;
  };
  strengths: string[];
  improvements: string[];
  summary: string;
}

const DocumentHealthScore = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<HealthScoreResult | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
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
    setResult(null);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({ title: "Document loaded!", description: "Ready for health analysis." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to read document.", variant: "destructive" });
    }
  }, []);

  const analyzeHealth = async () => {
    if (!extractedText) {
      toast({ title: "No file", description: "Please upload a document first.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "document-health-score",
          text: extractedText.slice(0, 25000)
        }
      });

      if (error) throw error;
      
      const defaultCategory: ScoreCategory = {
        name: "Unknown",
        score: 0,
        maxScore: 100,
        status: "poor",
        details: "Unable to analyze",
        suggestions: []
      };
      
      const safeResult: HealthScoreResult = {
        overallScore: data?.overallScore ?? 0,
        grade: data?.grade ?? "F",
        categories: {
          readability: data?.categories?.readability ?? { ...defaultCategory, name: "Readability" },
          completeness: data?.categories?.completeness ?? { ...defaultCategory, name: "Completeness" },
          structure: data?.categories?.structure ?? { ...defaultCategory, name: "Structure" },
          accuracy: data?.categories?.accuracy ?? { ...defaultCategory, name: "Accuracy" },
          legalSafety: data?.categories?.legalSafety ?? { ...defaultCategory, name: "Legal Safety" },
          seoReadiness: data?.categories?.seoReadiness ?? { ...defaultCategory, name: "SEO Readiness" }
        },
        strengths: Array.isArray(data?.strengths) ? data.strengths : [],
        improvements: Array.isArray(data?.improvements) ? data.improvements : [],
        summary: data?.summary ?? "Analysis complete."
      };
      
      setResult(safeResult);
      toast({ 
        title: "Analysis complete!", 
        description: `Document Grade: ${safeResult.grade}` 
      });
    } catch (error) {
      console.error("Health score error:", error);
      toast({ title: "Error", description: "Failed to analyze document.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-500 bg-green-500/10";
      case "B": return "text-blue-500 bg-blue-500/10";
      case "C": return "text-yellow-500 bg-yellow-500/10";
      case "D": return "text-orange-500 bg-orange-500/10";
      default: return "text-red-500 bg-red-500/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-500";
      case "good": return "text-blue-500";
      case "fair": return "text-yellow-500";
      default: return "text-red-500";
    }
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "readability": return <Eye className="h-4 w-4" />;
      case "completeness": return <Target className="h-4 w-4" />;
      case "structure": return <BookOpen className="h-4 w-4" />;
      case "accuracy": return <Sparkles className="h-4 w-4" />;
      case "legalsafety": return <Shield className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const report = JSON.stringify(result, null, 2);
    const blob = new Blob([report], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document-health-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="Document Health Score - PDF Quality Analyzer | Pine Tools Hub"
        description="Free document health checker. Analyze your PDFs for readability, completeness, accuracy, and legal safety. Get a comprehensive quality score like a credit score for your documents."
        keywords="document quality checker, pdf analyzer, document health score, pdf quality audit, document readability checker, pdf completeness checker"
        canonical="https://pinetoolshub.com/document-health-score"
      />
      <ToolStructuredData
        toolName="Document Health Score"
        toolDescription="Analyze document quality with scores for readability, completeness, accuracy, structure, and legal safety."
        toolUrl="https://pinetoolshub.com/document-health-score"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="Document Health Score"
          description="Get a comprehensive quality score for your document - like a credit score for your PDFs. Analyze readability, completeness, accuracy, and more."
          icon={<HeartPulse className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Document
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
              onClick={analyzeHealth} 
              disabled={isAnalyzing || !extractedText}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <HeartPulse className="h-4 w-4 mr-2" />
                  Get Health Score
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {!result ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <HeartPulse className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload a Document</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Get a comprehensive quality score analyzing 6 key dimensions.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Overall Health Score</h3>
                        <div className="text-4xl font-bold text-primary">
                          {result.overallScore}/100
                        </div>
                      </div>
                      <div className={`text-5xl font-bold rounded-full h-20 w-20 flex items-center justify-center ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </div>
                    </div>
                    <Progress value={result.overallScore} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-3">{result.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Category Breakdown</CardTitle>
                    <Button variant="outline" size="sm" onClick={downloadReport}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(result.categories).map(([key, category]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(key)}
                              <span className="font-medium text-sm">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${getStatusColor(category.status)}`}>
                                {category.score}/{category.maxScore}
                              </span>
                              <Badge variant="outline" className="capitalize">{category.status}</Badge>
                            </div>
                          </div>
                          <Progress value={(category.score / category.maxScore) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground">{category.details}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {result.strengths.slice(0, 4).map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        To Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {result.improvements.slice(0, 4).map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentHealthScore;
