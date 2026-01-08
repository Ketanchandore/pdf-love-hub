import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Sparkles, Copy, Download, RefreshCw, CheckCircle } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfSummarizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setSummary("");
      
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
            title: "PDF Loaded",
            description: `Extracted text from ${Math.min(pdf.numPages, 50)} pages`,
          });
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

  const generateSummary = useCallback(async () => {
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
          type: "summarize",
          text: text.slice(0, 20000),
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result) {
        setSummary(data.result);
        toast({
          title: "Summary Generated!",
          description: "Your document has been summarized",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Summary error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, toast]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "document"}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "How does AI PDF summarization work?",
      answer: "Our AI reads and understands the content of your PDF, identifies the main ideas, key arguments, and supporting details, then creates a concise summary that captures the essence of the document while preserving important information.",
    },
    {
      question: "How long can the PDF be?",
      answer: "We process up to 50 pages of your PDF. For longer documents, we focus on the first 50 pages to provide a comprehensive summary while maintaining quality and speed.",
    },
    {
      question: "What types of documents work best?",
      answer: "The summarizer works excellently with research papers, articles, reports, textbooks, legal documents, and any text-heavy PDFs. It's particularly useful for academic and professional content.",
    },
    {
      question: "Is my document kept private?",
      answer: "Yes, your documents are processed securely and not stored on our servers. The content is only used for generating the summary and is immediately discarded afterward.",
    },
    {
      question: "Can I summarize multiple documents?",
      answer: "You can summarize documents one at a time. Upload a new PDF or paste new text to generate a fresh summary. Each summary is independent and based solely on the current document.",
    },
  ];

  return (
    <>
      <SEOHead
        title="AI PDF Summarizer | Get TL;DR Summary of Any Document"
        description="Instantly summarize any PDF document using AI. Get key insights, main points, and concise summaries. Perfect for research papers, reports, and long documents."
        canonicalUrl="https://pinetoolshub.com/pdf-summarizer"
        keywords="PDF summarizer, AI summary, document summary, TL;DR, research paper summary, report summarizer, text summarization"
      />
      <ToolStructuredData
        name="AI PDF Summarizer"
        description="Instantly summarize any PDF document using AI"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ToolHero
          title="AI PDF Summarizer"
          description="Get instant TL;DR summaries of any PDF document. Our AI extracts key points, main ideas, and essential information."
          icon={<FileText className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
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
                className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                placeholder="Paste your document text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="AI is analyzing your document..." />
              ) : (
                <Button
                  onClick={generateSummary}
                  disabled={!text.trim()}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Summary
                </Button>
              )}
            </CardContent>
          </Card>

          {summary && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Document Summary
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadSummary}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {summary}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSummary("");
                    setText("");
                    setFile(null);
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Summarize Another Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Why Use an AI Document Summarizer?</h2>
          <p className="text-muted-foreground">
            In today's information-rich world, we're often overwhelmed by the sheer volume of documents we need to read.
            Our AI summarizer helps you quickly understand the key points of any document, saving you hours of reading time.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Perfect for Research & Study</h3>
          <p className="text-muted-foreground">
            Students and researchers can quickly scan through research papers to determine relevance before committing
            to a full read. Get the main findings, methodology, and conclusions in seconds.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Business & Professional Use</h3>
          <p className="text-muted-foreground">
            Busy professionals can quickly digest reports, contracts, and proposals. Our AI identifies action items,
            key metrics, and important clauses to help you make informed decisions faster.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default PdfSummarizer;
