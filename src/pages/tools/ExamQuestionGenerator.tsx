import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Sparkles, CheckCircle, XCircle, Eye, EyeOff, Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Question {
  type: "mcq" | "short" | "tf";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

const ExamQuestionGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [numQuestions, setNumQuestions] = useState([10]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setQuestions([]);
      
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

  const generateQuestions = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please upload a PDF or paste text first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setShowAnswers({});
    setUserAnswers({});

    try {
      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke("ai-study-assistant", {
        body: {
          type: "questions",
          text: text.slice(0, 15000),
          options: { numQuestions: numQuestions[0], difficulty },
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result && Array.isArray(data.result)) {
        setQuestions(data.result);
        toast({
          title: "Questions Generated!",
          description: `Created ${data.result.length} practice questions`,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Question generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate questions",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, numQuestions, difficulty, toast]);

  const toggleAnswer = (index: number) => {
    setShowAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleUserAnswer = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
        correct++;
      }
    });
    return correct;
  };

  const exportQuestions = () => {
    const content = questions
      .map((q, i) => {
        let text = `${i + 1}. [${q.type.toUpperCase()}] ${q.question}\n`;
        if (q.options) {
          q.options.forEach((opt, j) => {
            text += `   ${String.fromCharCode(65 + j)}. ${opt}\n`;
          });
        }
        text += `\nAnswer: ${q.answer}\nExplanation: ${q.explanation}\n\n---\n`;
        return text;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "practice-questions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "What types of questions does the AI generate?",
      answer: "Our AI generates three types of questions: Multiple Choice (MCQ), Short Answer, and True/False. The mix is optimized to test different levels of understanding, from basic recall to application of concepts.",
    },
    {
      question: "Can I control the difficulty level?",
      answer: "Yes! You can choose between Easy, Medium, and Hard difficulty levels. Easy questions focus on definitions and basic facts, Medium tests understanding and application, while Hard questions require analysis and critical thinking.",
    },
    {
      question: "How accurate are the generated questions?",
      answer: "Our AI generates high-quality questions based on the content you provide. Each question includes an explanation to help you understand the answer. However, we recommend reviewing questions for subjects where precision is critical.",
    },
    {
      question: "Can I use these for actual exams?",
      answer: "These questions are designed as practice material to help you prepare for exams. Teachers and instructors can use them as inspiration, but should review and adapt them to their specific curriculum requirements.",
    },
    {
      question: "How do I export the questions?",
      answer: "Click the 'Export Questions' button to download all questions, answers, and explanations as a text file. You can then print them, share with classmates, or import into other study tools.",
    },
  ];

  return (
    <>
      <SEOHead
        title="AI Exam Question Generator | Create Practice Tests from PDF"
        description="Generate practice exam questions from any PDF or text. MCQ, short answer, and true/false questions with explanations. Perfect for exam preparation."
        canonicalUrl="https://pinetoolshub.com/exam-question-generator"
        keywords="exam question generator, practice test maker, MCQ generator, quiz generator, exam preparation, study questions, AI question generator"
      />
      <ToolStructuredData
        toolName="AI Exam Question Generator"
        toolDescription="Generate practice exam questions from any document using AI"
        toolUrl="https://pinetoolshub.com/exam-question-generator"
        category="Text"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ToolHero
          title="AI Exam Question Generator"
          description="Transform any study material into practice exam questions. MCQ, short answer, and true/false with explanations."
          icon={<HelpCircle className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
          {questions.length === 0 ? (
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

                <div className="text-center text-muted-foreground">or paste text directly</div>

                <textarea
                  className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  placeholder="Paste your study material here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Number of questions: {numQuestions[0]}</Label>
                    <Slider
                      value={numQuestions}
                      onValueChange={setNumQuestions}
                      min={5}
                      max={30}
                      step={5}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Difficulty Level</Label>
                    <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as any)} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="easy" />
                        <Label htmlFor="easy">Easy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="hard" />
                        <Label htmlFor="hard">Hard</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {isProcessing ? (
                  <ProcessingStatus progress={progress} message="AI is generating questions..." />
                ) : (
                  <Button
                    onClick={generateQuestions}
                    disabled={!text.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Practice Questions
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Score Banner */}
              {Object.keys(userAnswers).length === questions.length && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-primary text-primary-foreground text-center"
                >
                  <p className="text-2xl font-bold">
                    Your Score: {getScore()}/{questions.length} ({Math.round((getScore() / questions.length) * 100)}%)
                  </p>
                </motion.div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={showAnswers[index] ? "border-primary/50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={q.type === "mcq" ? "default" : q.type === "tf" ? "secondary" : "outline"}>
                                {q.type === "mcq" ? "Multiple Choice" : q.type === "tf" ? "True/False" : "Short Answer"}
                              </Badge>
                            </div>
                            <p className="font-medium mb-3">{q.question}</p>

                            {/* MCQ Options */}
                            {q.type === "mcq" && q.options && (
                              <RadioGroup
                                value={userAnswers[index] || ""}
                                onValueChange={(v) => handleUserAnswer(index, v)}
                                className="space-y-2"
                              >
                                {q.options.map((opt, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`flex items-center space-x-2 p-2 rounded ${
                                      showAnswers[index]
                                        ? opt === q.answer
                                          ? "bg-green-100 dark:bg-green-900/30"
                                          : userAnswers[index] === opt
                                          ? "bg-red-100 dark:bg-red-900/30"
                                          : ""
                                        : ""
                                    }`}
                                  >
                                    <RadioGroupItem value={opt} id={`q${index}-opt${optIndex}`} />
                                    <Label htmlFor={`q${index}-opt${optIndex}`}>{opt}</Label>
                                    {showAnswers[index] && opt === q.answer && (
                                      <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                    )}
                                  </div>
                                ))}
                              </RadioGroup>
                            )}

                            {/* True/False */}
                            {q.type === "tf" && (
                              <RadioGroup
                                value={userAnswers[index] || ""}
                                onValueChange={(v) => handleUserAnswer(index, v)}
                                className="flex gap-4"
                              >
                                {["True", "False"].map((opt) => (
                                  <div
                                    key={opt}
                                    className={`flex items-center space-x-2 p-2 rounded ${
                                      showAnswers[index]
                                        ? opt.toLowerCase() === q.answer.toLowerCase()
                                          ? "bg-green-100 dark:bg-green-900/30"
                                          : userAnswers[index]?.toLowerCase() === opt.toLowerCase()
                                          ? "bg-red-100 dark:bg-red-900/30"
                                          : ""
                                        : ""
                                    }`}
                                  >
                                    <RadioGroupItem value={opt} id={`q${index}-${opt}`} />
                                    <Label htmlFor={`q${index}-${opt}`}>{opt}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            )}

                            {/* Short Answer */}
                            {q.type === "short" && (
                              <input
                                type="text"
                                className="w-full p-2 border rounded bg-background"
                                placeholder="Type your answer..."
                                value={userAnswers[index] || ""}
                                onChange={(e) => handleUserAnswer(index, e.target.value)}
                              />
                            )}

                            {/* Show/Hide Answer Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-3"
                              onClick={() => toggleAnswer(index)}
                            >
                              {showAnswers[index] ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide Answer
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Show Answer
                                </>
                              )}
                            </Button>

                            {/* Answer & Explanation */}
                            {showAnswers[index] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 p-3 bg-muted rounded-lg"
                              >
                                <p className="font-medium text-green-600 dark:text-green-400">
                                  Answer: {q.answer}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{q.explanation}</p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={exportQuestions} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Questions
                </Button>
                <Button
                  onClick={() => {
                    setQuestions([]);
                    setText("");
                    setFile(null);
                    setUserAnswers({});
                    setShowAnswers({});
                  }}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New Questions
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Master Any Subject with Practice Questions</h2>
          <p className="text-muted-foreground">
            Practice testing is one of the most effective study techniques, proven by research to significantly improve
            long-term retention and understanding. Our AI question generator helps you create custom practice tests
            from any study material.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Practice Testing Works</h3>
          <p className="text-muted-foreground">
            When you actively retrieve information through testing, you strengthen the neural pathways associated with
            that knowledge. This is far more effective than passive review methods like re-reading notes.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default ExamQuestionGenerator;
