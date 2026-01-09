import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, Sparkles, Copy, Download, RefreshCw, CheckCircle, 
  FileText, MessageSquare, Send, User, Bot
} from "lucide-react";
import { motion } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractedData {
  documentType: string;
  extractedData: Record<string, any>;
  confidence: string;
  missingFields: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SemanticPdfAssistant = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("extract");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setExtractedData(null);
      setChatMessages([]);
      
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
            description: `Ready to analyze ${Math.min(pdf.numPages, 50)} pages`,
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

  const extractData = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please upload a PDF first",
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
          type: "extract",
          text: text,
          documentType: "general",
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result) {
        setExtractedData(data.result);
        toast({
          title: "Extraction Complete!",
          description: "Key data has been extracted from your document",
        });
      }
    } catch (error: any) {
      console.error("Extraction error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to extract data",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, toast]);

  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim() || !text.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          type: "chat",
          text: text,
          query: chatInput,
          conversationHistory: chatMessages,
        },
      });

      if (error) throw error;

      if (data?.result) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.result }]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, text, chatMessages, toast]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadAsJson = () => {
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "document"}-extracted.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsCsv = () => {
    if (!extractedData) return;
    const flatData = flattenObject(extractedData.extractedData);
    const csv = Object.entries(flatData).map(([key, value]) => `"${key}","${value}"`).join("\n");
    const blob = new Blob([`Field,Value\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "document"}-extracted.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const flattenObject = (obj: Record<string, any>, prefix = ""): Record<string, string> => {
    return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], prefixedKey));
      } else {
        acc[prefixedKey] = Array.isArray(obj[key]) ? obj[key].join(", ") : String(obj[key]);
      }
      return acc;
    }, {});
  };

  const faqs = [
    {
      question: "What data can the Semantic PDF Assistant extract?",
      answer: "Our AI can extract structured data from invoices (amounts, dates, vendor info), contracts (parties, terms, clauses), resumes (experience, skills), and general documents (names, dates, key facts). It identifies entities, relationships, and important data points automatically.",
    },
    {
      question: "How accurate is the AI extraction?",
      answer: "Our AI provides high accuracy for standard document formats. Each extraction includes a confidence score and lists any potentially missing fields. For critical data, we recommend human verification of the extracted information.",
    },
    {
      question: "Can I ask questions about my document?",
      answer: "Yes! The Q&A feature lets you ask natural language questions like 'What is the payment deadline?' or 'Who are the parties to this contract?' The AI answers based solely on your document content.",
    },
    {
      question: "What export formats are available?",
      answer: "You can export extracted data as JSON for integration with other systems, or as CSV for spreadsheet analysis. The structured format makes it easy to import into your existing workflows.",
    },
    {
      question: "Is my document data kept private?",
      answer: "Yes, your documents are processed securely and not stored permanently. The content is sent to our AI for analysis and immediately discarded after generating results.",
    },
  ];

  return (
    <>
      <SEOHead
        title="AI PDF Data Extractor | Extract Invoice, Contract & Resume Data"
        description="Extract structured data from PDFs using AI. Get invoice amounts, contract terms, resume skills automatically. Export to JSON/CSV. Ask questions about your documents."
        canonicalUrl="https://pinetoolshub.com/semantic-pdf-assistant"
        keywords="PDF data extraction, AI document analyzer, extract invoice data, contract analysis, resume parser, document Q&A, PDF to JSON"
      />
      <ToolStructuredData
        toolName="Semantic PDF Assistant"
        toolDescription="AI-powered PDF data extraction and document Q&A"
        toolUrl="https://pinetoolshub.com/semantic-pdf-assistant"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <ToolHero
          title="Semantic PDF Assistant"
          description="Extract structured data from any document using AI. Get invoice amounts, contract terms, and more. Ask questions about your documents."
          icon={<Brain className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
          <Card className="border-2 border-dashed">
            <CardContent className="p-6">
              <FileUpload
                accept={{ "application/pdf": [".pdf"] }}
                maxSize={20 * 1024 * 1024}
                onFilesSelected={handleFilesSelected}
              />
              {file && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <Badge variant="secondary">{text.length.toLocaleString()} characters</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {text && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="extract" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Extract Data
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ask Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="extract" className="mt-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    {!extractedData ? (
                      <>
                        {isProcessing ? (
                          <ProcessingStatus progress={progress} message="AI is analyzing your document..." />
                        ) : (
                          <Button onClick={extractData} className="w-full h-12 text-lg" size="lg">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Extract Key Data
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-semibold">Data Extracted</span>
                            <Badge>{extractedData.documentType}</Badge>
                            <Badge variant={extractedData.confidence === "high" ? "default" : "secondary"}>
                              {extractedData.confidence} confidence
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadAsJson}>
                              <Download className="h-4 w-4 mr-1" /> JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadAsCsv}>
                              <Download className="h-4 w-4 mr-1" /> CSV
                            </Button>
                          </div>
                        </div>

                        {extractedData.missingFields?.length > 0 && (
                          <div className="p-3 bg-yellow-500/10 rounded-lg text-sm">
                            <span className="font-medium">Potentially missing:</span>{" "}
                            {extractedData.missingFields.join(", ")}
                          </div>
                        )}

                        <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(extractedData.extractedData, null, 2)}
                          </pre>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => {
                            setExtractedData(null);
                            setFile(null);
                            setText("");
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Analyze Another Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-80 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Ask any question about your document</p>
                          <p className="text-sm mt-2">
                            Try: "What are the key dates?" or "Summarize the main points"
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                          >
                            {msg.role === "assistant" && (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === "user" && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                      {isChatLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary animate-pulse" />
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-3 border rounded-lg bg-background"
                        placeholder="Ask about your document..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                        disabled={isChatLoading}
                      />
                      <Button onClick={sendChatMessage} disabled={isChatLoading || !chatInput.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Transform Documents into Actionable Data</h2>
          <p className="text-muted-foreground">
            Stop manually copying data from PDFs. Our AI-powered Semantic PDF Assistant automatically identifies
            and extracts key information from invoices, contracts, resumes, and more. Export to JSON or CSV
            for seamless integration with your existing tools.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Beyond Simple Text Extraction</h3>
          <p className="text-muted-foreground">
            Unlike basic OCR tools, our semantic AI understands document structure and context. It knows that
            "Total: $1,500" in an invoice is different from the same text in a contract, and extracts data
            accordingly.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Conversational Document Analysis</h3>
          <p className="text-muted-foreground">
            Need a specific answer? Ask questions in plain English. "What is the payment deadline?"
            "Who signed this contract?" "List all the skills mentioned." Get instant, accurate answers
            based on your document content.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default SemanticPdfAssistant;
