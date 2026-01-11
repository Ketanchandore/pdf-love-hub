import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Globe,
  FileText,
  Loader2,
  Download,
  Copy,
  BookOpen,
  Brain,
  Sparkles,
  Youtube,
  Link2,
  StickyNote
} from "lucide-react";

interface ExtractionResult {
  title: string;
  summary: string;
  keyPoints: string[];
  notes: string;
  flashcards: Array<{ question: string; answer: string }>;
  mindmapText: string;
  sourceUrl: string;
}

const WebToKnowledge = () => {
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  const extractKnowledge = async () => {
    if (!url.trim()) {
      toast({ title: "Missing URL", description: "Please enter a URL to extract.", variant: "destructive" });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid URL.", variant: "destructive" });
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "web-to-knowledge",
          url: url.trim()
        }
      });

      if (error) throw error;
      
      const safeResult: ExtractionResult = {
        title: data?.title ?? "Untitled",
        summary: data?.summary ?? "No summary available.",
        keyPoints: Array.isArray(data?.keyPoints) ? data.keyPoints : [],
        notes: data?.notes ?? "",
        flashcards: Array.isArray(data?.flashcards) ? data.flashcards : [],
        mindmapText: data?.mindmapText ?? "",
        sourceUrl: url
      };
      
      setResult(safeResult);
      toast({ 
        title: "Extraction complete!", 
        description: `Created summary, notes, and ${safeResult.flashcards.length} flashcards.` 
      });
    } catch (error) {
      console.error("Extraction error:", error);
      toast({ title: "Error", description: "Failed to extract knowledge. The URL may be inaccessible.", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const downloadAsFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadNotes = () => {
    if (!result) return;
    const content = `# ${result.title}\n\nSource: ${result.sourceUrl}\n\n## Summary\n${result.summary}\n\n## Key Points\n${result.keyPoints.map(p => `- ${p}`).join('\n')}\n\n## Notes\n${result.notes}`;
    downloadAsFile(content, "notes.md", "text/markdown");
  };

  const downloadFlashcards = () => {
    if (!result) return;
    const content = result.flashcards.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
    downloadAsFile(content, "flashcards.txt", "text/plain");
  };

  return (
    <>
      <SEOHead
        title="Web to Knowledge Extractor - URL to Notes & Flashcards | Pine Tools Hub"
        description="Free web content extractor. Convert any URL, YouTube video, or blog post into organized notes, summaries, flashcards, and mindmaps. Perfect for research and learning."
        keywords="url to notes, web content extractor, youtube to notes, blog to flashcards, web scraper to pdf, save webpage as notes, extract knowledge from url"
        canonical="https://pinetoolshub.com/web-to-knowledge"
      />
      <ToolStructuredData
        toolName="Web to Knowledge Extractor"
        toolDescription="Convert any URL into organized notes, summaries, flashcards, and mindmaps for learning and research."
        toolUrl="https://pinetoolshub.com/web-to-knowledge"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="Web to Knowledge Extractor"
          description="Paste any URL and convert it into organized notes, flashcards, and summaries. Perfect for research, learning, and content curation."
          icon={<Globe className="h-6 w-6" />}
        />

        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Enter URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/article or YouTube URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={extractKnowledge} disabled={isExtracting}>
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Extract
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Blog posts</span>
                <span className="flex items-center gap-1"><Youtube className="h-3 w-3" /> YouTube</span>
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Articles</span>
              </div>
            </CardContent>
          </Card>

          {result && (
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{result.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{result.sourceUrl}</p>
                </CardHeader>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="summary" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-1">
                    <StickyNote className="h-4 w-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    Flashcards
                  </TabsTrigger>
                  <TabsTrigger value="mindmap" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Mindmap
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Summary & Key Points</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.summary, "Summary")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{result.summary}</p>
                      <h4 className="font-medium text-sm mb-2">Key Points:</h4>
                      <ul className="space-y-1">
                        {result.keyPoints.map((point, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Organized Notes</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.notes, "Notes")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadNotes}>
                          <Download className="h-4 w-4 mr-1" />
                          .md
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={result.notes}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="flashcards">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Flashcards ({result.flashcards.length})</CardTitle>
                      <Button variant="outline" size="sm" onClick={downloadFlashcards}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                        {result.flashcards.map((card, i) => (
                          <div key={i} className="p-4 bg-muted rounded-lg">
                            <div className="font-medium text-sm mb-2">Q: {card.question}</div>
                            <div className="text-sm text-muted-foreground">A: {card.answer}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mindmap">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Mindmap Structure</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.mindmapText, "Mindmap")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={result.mindmapText}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                        placeholder="Mindmap structure in text format..."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WebToKnowledge;
