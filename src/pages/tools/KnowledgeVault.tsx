import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Brain, 
  Upload,
  Search,
  Send,
  Loader2,
  FileText,
  MessageSquare,
  Sparkles,
  Trash2,
  FolderOpen
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Document {
  id: string;
  name: string;
  text: string;
  wordCount: number;
  uploadedAt: Date;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const KnowledgeVault = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 100); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    
    return text;
  };

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    const newDocs: Document[] = [];
    
    for (const file of files) {
      try {
        let text = "";
        if (file.type === "application/pdf") {
          text = await extractTextFromPdf(file);
        } else {
          text = await file.text();
        }
        
        newDocs.push({
          id: crypto.randomUUID(),
          name: file.name,
          text,
          wordCount: text.split(/\s+/).length,
          uploadedAt: new Date()
        });
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
      }
    }
    
    setDocuments(prev => [...prev, ...newDocs]);
    toast({ 
      title: "Documents added!", 
      description: `Added ${newDocs.length} document(s) to your vault.` 
    });
    setIsProcessing(false);
  }, []);

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({ title: "Document removed" });
  };

  const askQuestion = async () => {
    if (!query.trim() || documents.length === 0) {
      toast({ 
        title: "Can't query", 
        description: documents.length === 0 ? "Add documents first." : "Enter a question.",
        variant: "destructive" 
      });
      return;
    }

    const userMessage: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsQuerying(true);

    try {
      // Combine all document texts (truncated)
      const context = documents.map(d => 
        `[Document: ${d.name}]\n${d.text.slice(0, 5000)}`
      ).join("\n\n---\n\n");

      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "knowledge-vault-query",
          query: query,
          context: context.slice(0, 30000),
          documentNames: documents.map(d => d.name)
        }
      });

      if (error) throw error;
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Query error:", error);
      toast({ title: "Error", description: "Failed to query documents.", variant: "destructive" });
    } finally {
      setIsQuerying(false);
    }
  };

  const totalWords = documents.reduce((sum, d) => sum + d.wordCount, 0);

  return (
    <>
      <SEOHead
        title="Knowledge Vault - Chat with Multiple Documents | Pine Tools Hub"
        description="Upload multiple PDFs and documents to create your personal searchable knowledge base. Ask questions across all your files and get AI-powered answers with source citations."
        keywords="chat with multiple pdfs, document knowledge base, search all pdfs, multi document chat, personal ai assistant, document qa system, pdf question answering"
        canonical="https://pinetoolshub.com/knowledge-vault"
      />
      <ToolStructuredData
        toolName="Knowledge Vault"
        toolDescription="Personal knowledge base that lets you chat with multiple documents and get AI-powered answers with source citations."
        toolUrl="https://pinetoolshub.com/knowledge-vault"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="Knowledge Vault"
          description="Upload multiple documents to create your personal searchable brain. Ask questions across all your files and get answers with source citations."
          icon={<Brain className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Documents Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Your Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept={{ 
                    "application/pdf": [".pdf"],
                    "text/plain": [".txt"],
                    "text/markdown": [".md"]
                  }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFilesSelected}
                  multiple
                />
                
                {isProcessing && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing documents...
                  </div>
                )}
              </CardContent>
            </Card>

            {documents.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Vault Contents</span>
                    <Badge variant="secondary">{documents.length} files</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {documents.map(doc => (
                        <div 
                          key={doc.id}
                          className="flex items-start justify-between p-2 rounded-lg bg-muted group"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.wordCount.toLocaleString()} words
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    Total: {totalWords.toLocaleString()} words indexed
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Ask Your Documents
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-sm">
                        <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Your Knowledge Awaits</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          Upload documents and ask questions like:
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="p-2 bg-muted rounded">"Summarize all documents"</p>
                          <p className="p-2 bg-muted rounded">"Find contradictions between files"</p>
                          <p className="p-2 bg-muted rounded">"What are the key deadlines?"</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-border/50">
                                <p className="text-xs opacity-70 mb-1">Sources:</p>
                                <div className="flex flex-wrap gap-1">
                                  {msg.sources.map((src, j) => (
                                    <Badge key={j} variant="secondary" className="text-xs">
                                      {src}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isQuerying && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Searching your vault...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder={documents.length === 0 
                      ? "Upload documents first..." 
                      : "Ask anything about your documents..."
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askQuestion()}
                    disabled={documents.length === 0 || isQuerying}
                  />
                  <Button 
                    onClick={askQuestion}
                    disabled={documents.length === 0 || isQuerying || !query.trim()}
                  >
                    {isQuerying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeVault;
