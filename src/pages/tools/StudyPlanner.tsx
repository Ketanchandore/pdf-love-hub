import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Sparkles, Copy, Download, RefreshCw, CheckCircle, Clock, BookOpen, Target } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const StudyPlanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [studyPlan, setStudyPlan] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setStudyPlan("");
      
      if (selectedFile.type === "application/pdf") {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          
          for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += pageText + "\n\n";
          }
          
          setText(fullText);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to extract text from PDF",
            variant: "destructive",
          });
        }
      }
    }
  };

  const generateStudyPlan = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please upload a PDF or paste your syllabus/notes",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Build context for the AI
      const context = `
Subject: ${subject || "General"}
${examDate ? `Exam Date: ${examDate}` : ""}
Study hours per day: ${hoursPerDay}

Content to study:
${text.slice(0, 15000)}
      `.trim();

      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke("ai-study-assistant", {
        body: {
          type: "study-plan",
          text: context,
          options: { subject },
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result) {
        setStudyPlan(data.result);
        toast({
          title: "Study Plan Created!",
          description: "Your personalized study schedule is ready",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Study plan error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate study plan",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, subject, examDate, hoursPerDay, toast]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(studyPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadPlan = () => {
    const blob = new Blob([studyPlan], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-plan-${subject || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "How does the AI study planner work?",
      answer: "Our AI analyzes your study material, identifies key topics and their complexity, then creates a structured study schedule. It considers your available time, exam date, and recommended study techniques like spaced repetition.",
    },
    {
      question: "What should I upload for best results?",
      answer: "Upload your syllabus, course outline, textbook table of contents, or lecture notes. The more comprehensive your content, the more detailed and accurate your study plan will be.",
    },
    {
      question: "Can I customize the study plan?",
      answer: "Yes! You can specify your subject, exam date, and daily study hours. The AI will create a plan that fits your schedule and prioritizes topics based on importance and difficulty.",
    },
    {
      question: "Does it use spaced repetition?",
      answer: "Yes, the study plan incorporates spaced repetition principles, scheduling review sessions at optimal intervals to maximize long-term retention of the material.",
    },
    {
      question: "What if I fall behind schedule?",
      answer: "You can regenerate a new study plan at any time. Upload your remaining material and adjust the exam date or study hours to get an updated schedule that accounts for your current progress.",
    },
  ];

  return (
    <>
      <SEOHead
        title="AI Study Planner | Create Personalized Study Schedule from Syllabus"
        description="Generate a personalized study plan from your syllabus or notes using AI. Get a structured schedule with time estimates, priorities, and review intervals."
        canonicalUrl="https://pinetoolshub.com/study-planner"
        keywords="study planner, AI study schedule, exam preparation, revision timetable, study plan generator, spaced repetition, exam study guide"
      />
      <ToolStructuredData
        toolName="AI Study Planner"
        toolDescription="Create personalized study schedules from your course material"
        toolUrl="https://pinetoolshub.com/study-planner"
        category="Text"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ToolHero
          title="AI Study Planner"
          description="Create a personalized study schedule from your syllabus or notes. Get a structured plan with priorities, time estimates, and review intervals."
          icon={<Calendar className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
          {!studyPlan ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-6 space-y-6">
                <FileUpload
                  accept={{
                    "application/pdf": [".pdf"],
                    "text/plain": [".txt"],
                  }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFilesSelected}
                />

                <div className="text-center text-muted-foreground">or paste your syllabus/notes</div>

                <textarea
                  className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  placeholder="Paste your syllabus, course outline, or study topics here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2 block">Subject Name</Label>
                    <Input
                      placeholder="e.g., Biology 101"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Exam Date (Optional)</Label>
                    <Input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Hours per Day</Label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(e.target.value)}
                    />
                  </div>
                </div>

                {isProcessing ? (
                  <ProcessingStatus progress={progress} message="AI is creating your study plan..." />
                ) : (
                  <Button
                    onClick={generateStudyPlan}
                    disabled={!text.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Study Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Your Personalized Study Plan
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadPlan}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <BookOpen className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-medium">{subject || "General"}</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <Clock className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-sm text-muted-foreground">Daily Hours</p>
                      <p className="font-medium">{hoursPerDay}h/day</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <Target className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-sm text-muted-foreground">Target Date</p>
                      <p className="font-medium">{examDate || "Flexible"}</p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed bg-background p-4 rounded-lg max-h-[500px] overflow-y-auto">
                      {studyPlan}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setStudyPlan("");
                      setText("");
                      setFile(null);
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Create New Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Study Smarter with AI-Powered Planning</h2>
          <p className="text-muted-foreground">
            A well-structured study plan is the foundation of exam success. Our AI analyzes your course material
            and creates a personalized schedule that maximizes your learning efficiency and retention.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Science-Backed Study Techniques</h3>
          <p className="text-muted-foreground">
            The study plan incorporates proven learning techniques including spaced repetition, active recall,
            and interleaving. These methods have been shown to significantly improve long-term retention compared
            to passive studying.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Adaptive to Your Schedule</h3>
          <p className="text-muted-foreground">
            Whether you have 1 hour or 8 hours per day, the AI adapts the study plan to fit your available time.
            It prioritizes topics based on complexity and importance, ensuring you cover the most critical material first.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default StudyPlanner;
