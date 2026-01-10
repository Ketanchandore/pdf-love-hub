import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  FileUser, 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Sparkles,
  Download,
  Loader2,
  TrendingUp,
  Briefcase,
  Award
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AnalysisResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  optimizedSummary: string;
}

const ResumeOptimizer = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

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
    setResumeFile(file);
    
    try {
      const text = await extractTextFromPdf(file);
      setResumeText(text);
      toast({ title: "Resume uploaded!", description: "Text extracted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to extract text from PDF.", variant: "destructive" });
    }
  }, []);

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) {
      toast({ title: "Missing input", description: "Please upload resume and paste job description.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "resume-optimizer",
          resumeText,
          jobDescription
        }
      });

      if (error) throw error;
      setResult(data);
      toast({ title: "Analysis complete!", description: `ATS Score: ${data.atsScore}%` });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Error", description: "Failed to analyze resume.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <SEOHead
        title="ATS Resume Optimizer - Check Resume for ATS Compatibility Free | Pine Tools Hub"
        description="Free ATS resume checker and optimizer. Upload your resume and job description to get instant ATS score, keyword matching, and optimization suggestions. Beat the resume bots!"
        keywords="ats resume checker, resume optimizer, ats compatibility check, resume keyword optimizer, beat ats system, resume scanner free, job application optimizer"
        canonical="https://pinetoolshub.com/resume-optimizer"
      />
      <ToolStructuredData
        toolName="ATS Resume Optimizer"
        toolDescription="AI-powered ATS resume checker that analyzes your resume against job descriptions and provides optimization suggestions."
        toolUrl="https://pinetoolshub.com/resume-optimizer"
        category="Text"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="ATS Resume Optimizer"
          description="Don't let a robot fire you before you're hired. Optimize your resume for the ATS and get more interviews."
          icon={<FileUser className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUser className="h-5 w-5" />
                  Upload Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept={{ "application/pdf": [".pdf"] }}
                  maxSize={10 * 1024 * 1024}
                  onFilesSelected={handleFileSelected}
                />
                {resumeFile && (
                  <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{resumeFile.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Paste Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here. Include requirements, qualifications, and responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={analyzeResume} 
              disabled={isAnalyzing || !resumeText || !jobDescription}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Check ATS Compatibility
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!result ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Upload your resume and paste the job description to get your ATS compatibility score and optimization tips.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* ATS Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">ATS Compatibility Score</h3>
                        <div className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}>
                          {result.atsScore}%
                        </div>
                      </div>
                      <div className={`p-4 rounded-full ${getScoreBg(result.atsScore)}`}>
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <Progress value={result.atsScore} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {result.atsScore >= 80 ? "Excellent! Your resume is well-optimized." :
                       result.atsScore >= 60 ? "Good, but there's room for improvement." :
                       "Needs work. Follow the suggestions below."}
                    </p>
                  </CardContent>
                </Card>

                {/* Keywords */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Matched Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {result.matchedKeywords.map((kw, i) => (
                          <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-600">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Missing Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {result.missingKeywords.map((kw, i) => (
                          <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-600">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-500" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 mt-1 text-green-500 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Areas to Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="h-3 w-3 mt-1 text-red-500 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Optimization Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                          <span className="text-primary font-bold">{i + 1}.</span>
                          <span className="text-sm">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeOptimizer;
