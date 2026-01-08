import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Download, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Flashcard {
  front: string;
  back: string;
}

const FlashcardGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [numCards, setNumCards] = useState([10]);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      // Extract text from PDF
      if (selectedFile.type === "application/pdf") {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          
          for (let i = 1; i <= pdf.numPages; i++) {
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

  const generateFlashcards = useCallback(async () => {
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

    try {
      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke("ai-study-assistant", {
        body: {
          type: "flashcards",
          text: text.slice(0, 15000), // Limit text length
          options: { numFlashcards: numCards[0] },
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result && Array.isArray(data.result)) {
        setFlashcards(data.result);
        setCurrentIndex(0);
        setIsFlipped(false);
        toast({
          title: "Success!",
          description: `Generated ${data.result.length} flashcards`,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Flashcard generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate flashcards",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, numCards, toast]);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const exportFlashcards = () => {
    const csv = flashcards.map((card) => `"${card.front.replace(/"/g, '""')}","${card.back.replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([`Front,Back\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcards.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "How does the AI flashcard generator work?",
      answer: "Our AI analyzes your PDF or text content, identifies key concepts, definitions, and important information, then creates question-answer pairs optimized for spaced repetition learning. The AI understands context and creates meaningful connections between concepts.",
    },
    {
      question: "Can I export flashcards to Anki or other apps?",
      answer: "Yes! You can export your flashcards as a CSV file, which can be imported into Anki, Quizlet, and most other flashcard applications. The format is compatible with standard import features.",
    },
    {
      question: "How many flashcards can I generate at once?",
      answer: "You can generate up to 50 flashcards from a single document. For longer documents, the AI focuses on the most important concepts to create high-quality, focused flashcards.",
    },
    {
      question: "Is my document data secure?",
      answer: "Yes, your documents are processed securely and are not stored on our servers. The text is sent to our AI only for processing and is immediately discarded after generating flashcards.",
    },
    {
      question: "What types of content work best?",
      answer: "The flashcard generator works best with educational content like textbooks, lecture notes, study guides, and research papers. It can extract key concepts from any informative text.",
    },
  ];

  return (
    <>
      <SEOHead
        title="AI Flashcard Generator from PDF | Create Study Cards Instantly"
        description="Transform any PDF or text into smart flashcards using AI. Perfect for students, professionals, and lifelong learners. Export to Anki, Quizlet, and more."
        canonicalUrl="https://pinetoolshub.com/flashcard-generator"
        keywords="flashcard generator, AI flashcards, PDF to flashcards, study cards, Anki flashcards, spaced repetition, exam preparation"
      />
      <ToolStructuredData
        name="AI Flashcard Generator"
        description="Transform PDFs and text into smart flashcards using AI"
        category="Education"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <ToolHero
          title="AI Flashcard Generator"
          description="Transform any PDF or text into smart study flashcards using AI. Perfect for exam preparation and active recall learning."
          icon={<BookOpen className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-8">
          {flashcards.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-6 space-y-6">
                <FileUpload
                  acceptedFormats={{
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

                <div className="flex items-center gap-4">
                  <Label className="whitespace-nowrap">Number of cards: {numCards[0]}</Label>
                  <Slider
                    value={numCards}
                    onValueChange={setNumCards}
                    min={5}
                    max={50}
                    step={5}
                    className="flex-1"
                  />
                </div>

                {isProcessing ? (
                  <ProcessingStatus progress={progress} message="Generating flashcards with AI..." />
                ) : (
                  <Button
                    onClick={generateFlashcards}
                    disabled={!text.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Flashcards
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Flashcard Display */}
              <div className="flex justify-center">
                <div 
                  className="relative w-full max-w-xl h-80 cursor-pointer perspective-1000"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentIndex}-${isFlipped}`}
                      initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 rounded-2xl shadow-2xl p-8 flex items-center justify-center text-center ${
                        isFlipped 
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" 
                          : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                      }`}
                    >
                      <div>
                        <p className="text-sm opacity-70 mb-2">
                          {isFlipped ? "Answer" : "Question"} • Card {currentIndex + 1}/{flashcards.length}
                        </p>
                        <p className="text-xl md:text-2xl font-medium">
                          {isFlipped ? flashcards[currentIndex].back : flashcards[currentIndex].front}
                        </p>
                        <p className="text-sm opacity-70 mt-4">Click to flip</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevCard}
                  disabled={flashcards.length <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Flip Card
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextCard}
                  disabled={flashcards.length <= 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-1 flex-wrap max-w-md mx-auto">
                {flashcards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentIndex(idx);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={exportFlashcards} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
                <Button
                  onClick={() => {
                    setFlashcards([]);
                    setText("");
                    setFile(null);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Why Use AI Flashcards for Studying?</h2>
          <p className="text-muted-foreground">
            Flashcards are one of the most effective study techniques, backed by decades of cognitive science research.
            Our AI-powered flashcard generator takes this proven method and supercharges it by automatically identifying
            the most important concepts in your study material.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">How Active Recall Boosts Learning</h3>
          <p className="text-muted-foreground">
            When you test yourself with flashcards, you're engaging in active recall – the process of actively
            stimulating your memory during the learning process. This is far more effective than passive reading
            or highlighting, leading to better long-term retention.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Perfect for Any Subject</h3>
          <p className="text-muted-foreground">
            Whether you're studying medicine, law, languages, history, or any other subject, our AI adapts to
            your content. It understands context and creates flashcards that test your knowledge of key concepts,
            definitions, relationships, and applications.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default FlashcardGenerator;
