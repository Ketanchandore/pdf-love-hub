import { useState, useCallback, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import FAQSection from "@/components/seo/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageCircle, Send, User, Bot, FileText, Upload, 
  Trash2, Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What is this document about?",
  "Summarize the key points",
  "What are the important dates mentioned?",
  "Who are the parties involved?",
  "What are the main terms and conditions?",
  "Are there any deadlines I should know about?",
];

const DocumentChat = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setMessages([]);
      
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
          
          // Add welcome message
          setMessages([{
            role: "assistant",
            content: `I've loaded "${selectedFile.name}" (${Math.min(pdf.numPages, 50)} pages). Ask me anything about this document! For example:\n\n• "What is this document about?"\n• "Summarize the key points"\n• "What are the important dates?"`,
            timestamp: new Date(),
          }]);
          
          toast({
            title: "Document Ready",
            description: "You can now ask questions about your document",
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

  const sendMessage = useCallback(async (messageText?: string) => {
    const query = messageText || input.trim();
    if (!query || !text.trim()) return;

    const userMessage: ChatMessage = { 
      role: "user", 
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          type: "chat",
          text: text,
          query: query,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;

      if (data?.result) {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: data.result,
          timestamp: new Date(),
        }]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, text, messages, toast]);

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: `Chat cleared. You can continue asking questions about "${file?.name}".`,
      timestamp: new Date(),
    }]);
  };

  const faqs = [
    {
      question: "How does the Document Chat work?",
      answer: "Simply upload a PDF and start asking questions in natural language. Our AI reads and understands your document, then answers your questions based on the actual content. It's like having a conversation with your document.",
    },
    {
      question: "What types of questions can I ask?",
      answer: "You can ask anything! Request summaries, find specific information, understand complex terms, compare sections, identify key dates, or ask for clarification on any part of the document.",
    },
    {
      question: "Does it remember our conversation?",
      answer: "Yes! The chat maintains context throughout your session. You can ask follow-up questions like 'Tell me more about that' or 'What does that mean for the payment terms?' and the AI will understand the context.",
    },
    {
      question: "How accurate are the answers?",
      answer: "The AI bases answers solely on your document content. It will tell you if information isn't available in the document. For critical decisions, always verify by reading the original text.",
    },
    {
      question: "Is my document secure?",
      answer: "Yes, your document is processed securely and not stored permanently. The content is used only for answering your questions and is discarded after your session.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Chat with PDF | Ask Questions About Your Documents AI"
        description="Have a conversation with your PDF documents. Ask questions in natural language and get instant, accurate answers. AI-powered document understanding."
        canonicalUrl="https://pinetoolshub.com/document-chat"
        keywords="chat with PDF, talk to PDF, ask PDF questions, document AI, PDF chatbot, document conversation, AI document assistant"
      />
      <ToolStructuredData
        toolName="Document Chat"
        toolDescription="Have natural conversations with your PDF documents using AI"
        toolUrl="https://pinetoolshub.com/document-chat"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ToolHero
          title="Document Chat"
          description="Have a conversation with your documents. Ask questions in plain English and get instant answers from your PDF."
          icon={<MessageCircle className="h-6 w-6" />}
        />

        <div className="mt-8">
          {!file ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-8">
                <FileUpload
                  accept={{ "application/pdf": [".pdf"] }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFilesSelected}
                  label="Drop your PDF to start chatting"
                  description="or click to select a file"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {text.length.toLocaleString()} characters loaded
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearChat}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setText("");
                      setMessages([]);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    New Doc
                  </Button>
                </div>
              </div>

              {/* Chat Container */}
              <div 
                ref={chatContainerRef}
                className="h-[400px] overflow-y-auto p-4 space-y-4"
              >
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.role === "user" ? "bg-primary" : "bg-muted"
                      }`}>
                        {msg.role === "user" ? (
                          <User className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <Bot className="h-4 w-4 text-foreground" />
                        )}
                      </div>
                      <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                        <div className={`inline-block p-3 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Lightbulb className="h-3 w-3" />
                    <span>Try asking:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.slice(0, 4).map((q, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => sendMessage(q)}
                        disabled={isLoading}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ask about your document..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    size="lg" 
                    className="rounded-full px-6"
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Talk to Your Documents</h2>
          <p className="text-muted-foreground">
            Stop scrolling through endless pages looking for that one piece of information. With Document Chat,
            just ask! Our AI reads and understands your entire document, giving you instant answers in plain language.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Natural Conversation</h3>
          <p className="text-muted-foreground">
            Ask questions like you would ask a colleague who read the document. "What's the deadline?"
            "Who needs to sign?" "Explain section 3 in simple terms." The AI understands context and
            provides relevant, accurate answers.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Perfect for Research & Review</h3>
          <p className="text-muted-foreground">
            Students reviewing research papers, professionals analyzing reports, lawyers examining contracts —
            Document Chat makes it easy to quickly extract the information you need without reading every page.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default DocumentChat;
