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
import { Network, Sparkles, Copy, Download, RefreshCw, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface MindmapNode {
  title: string;
  level: number;
  children: MindmapNode[];
  points: string[];
}

const MindmapGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mindmapText, setMindmapText] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setMindmapText("");
      
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

  const generateMindmap = useCallback(async () => {
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
          type: "mindmap",
          text: text.slice(0, 15000),
        },
      });

      setProgress(80);

      if (error) throw error;

      if (data?.result) {
        setMindmapText(data.result);
        // Expand all nodes by default
        const nodes = new Set<string>();
        data.result.split("\n").forEach((line: string) => {
          if (line.startsWith("#")) {
            nodes.add(line);
          }
        });
        setExpandedNodes(nodes);
        toast({
          title: "Mindmap Generated!",
          description: "Your visual knowledge map is ready",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Mindmap error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate mindmap",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  }, [text, toast]);

  const parseMindmap = (text: string): MindmapNode[] => {
    const lines = text.split("\n").filter((l) => l.trim());
    const root: MindmapNode[] = [];
    const stack: { node: MindmapNode; level: number }[] = [];

    lines.forEach((line) => {
      if (line.startsWith("#")) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const title = line.replace(/^#+\s*/, "");
        const node: MindmapNode = { title, level, children: [], points: [] };

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          root.push(node);
        } else {
          stack[stack.length - 1].node.children.push(node);
        }

        stack.push({ node, level });
      } else if (line.startsWith("-") && stack.length > 0) {
        const point = line.replace(/^-\s*/, "");
        stack[stack.length - 1].node.points.push(point);
      }
    });

    return root;
  };

  const toggleNode = (title: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const renderNode = (node: MindmapNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(`${"#".repeat(node.level)} ${node.title}`);
    const hasChildren = node.children.length > 0 || node.points.length > 0;
    const colors = [
      "border-l-primary",
      "border-l-blue-500",
      "border-l-green-500",
      "border-l-orange-500",
      "border-l-purple-500",
    ];
    const bgColors = [
      "bg-primary/10",
      "bg-blue-500/10",
      "bg-green-500/10",
      "bg-orange-500/10",
      "bg-purple-500/10",
    ];

    return (
      <motion.div
        key={`${node.title}-${depth}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`ml-${Math.min(depth * 4, 16)}`}
        style={{ marginLeft: depth * 16 }}
      >
        <div
          className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${colors[depth % colors.length]} ${bgColors[depth % bgColors.length]}`}
          onClick={() => hasChildren && toggleNode(`${"#".repeat(node.level)} ${node.title}`)}
        >
          {hasChildren ? (
            <span className="mt-1 text-muted-foreground">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          ) : (
            <span className="w-4" />
          )}
          <span className={`font-medium ${depth === 0 ? "text-lg" : depth === 1 ? "text-base" : "text-sm"}`}>
            {node.title}
          </span>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {node.points.map((point, i) => (
                <div
                  key={i}
                  className="ml-8 py-1 px-2 text-sm text-muted-foreground flex items-start gap-2"
                  style={{ marginLeft: (depth + 1) * 16 + 16 }}
                >
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </div>
              ))}
              {node.children.map((child) => renderNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(mindmapText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadMindmap = () => {
    const blob = new Blob([mindmapText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "document"}-mindmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "What is a mindmap and how does it help studying?",
      answer: "A mindmap is a visual representation of information that shows relationships between concepts. It helps studying by organizing information hierarchically, making it easier to understand, remember, and review complex topics.",
    },
    {
      question: "How does AI generate mindmaps from documents?",
      answer: "Our AI analyzes your document to identify the main topic, key concepts, sub-topics, and relationships. It then organizes this information into a hierarchical structure that can be visualized as a mindmap.",
    },
    {
      question: "Can I edit the generated mindmap?",
      answer: "The mindmap is exported in Markdown format, which you can easily edit in any text editor. You can also copy the raw text and paste it into mindmap software like MindMeister, XMind, or Obsidian.",
    },
    {
      question: "What types of documents work best?",
      answer: "Mindmaps work best with structured content like textbooks, research papers, lecture notes, and study guides. The AI can identify and organize concepts from any informative text.",
    },
    {
      question: "How do I use the interactive mindmap?",
      answer: "Click on any branch to expand or collapse its children. This helps you focus on specific sections while studying. You can expand all branches for a complete overview or collapse them to see just the main topics.",
    },
  ];

  const parsedMindmap = mindmapText ? parseMindmap(mindmapText) : [];

  return (
    <>
      <SEOHead
        title="AI Mindmap Generator from PDF | Visual Knowledge Maps"
        description="Transform any PDF or document into an interactive mindmap using AI. Visualize concepts, relationships, and ideas for better understanding and memory."
        canonicalUrl="https://pinetoolshub.com/mindmap-generator"
        keywords="mindmap generator, AI mindmap, PDF to mindmap, visual learning, concept map, knowledge map, study tool, diagram generator"
      />
      <ToolStructuredData
        name="AI Mindmap Generator"
        description="Transform documents into visual mindmaps using AI"
        category="Education"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <ToolHero
          title="AI Mindmap Generator"
          description="Transform any document into an interactive visual mindmap. Understand complex topics by seeing how concepts connect."
          icon={<Network className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
          {parsedMindmap.length === 0 ? (
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
                  <ProcessingStatus progress={progress} message="AI is creating your mindmap..." />
                ) : (
                  <Button
                    onClick={generateMindmap}
                    disabled={!text.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Mindmap
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Your Knowledge Map
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadMindmap}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on any topic to expand or collapse its subtopics
                  </p>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {parsedMindmap.map((node) => renderNode(node))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => {
                    setMindmapText("");
                    setText("");
                    setFile(null);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create New Mindmap
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Visualize Knowledge for Better Learning</h2>
          <p className="text-muted-foreground">
            Mindmaps are powerful tools for understanding and remembering complex information. By visualizing how
            concepts relate to each other, you create stronger mental connections that improve recall and comprehension.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Visual Learning Works</h3>
          <p className="text-muted-foreground">
            Our brains process visual information 60,000 times faster than text. Mindmaps leverage this by presenting
            information spatially, allowing you to see the big picture while still understanding the details.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Perfect for Any Subject</h3>
          <p className="text-muted-foreground">
            Whether you're studying science, history, literature, or business, mindmaps help organize information
            in a way that makes sense to your brain. Use them for note-taking, revision, or planning.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default MindmapGenerator;
