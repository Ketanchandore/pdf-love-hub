import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const TextCompare = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [compared, setCompared] = useState(false);

  const comparison = useMemo(() => {
    if (!text1 || !text2) return null;

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLines = Math.max(lines1.length, lines2.length);

    const differences: { line: number; text1: string; text2: string; type: "modified" | "added" | "removed" | "same" }[] = [];
    let addedCount = 0;
    let removedCount = 0;
    let modifiedCount = 0;
    let sameCount = 0;

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";

      if (line1 === line2) {
        differences.push({ line: i + 1, text1: line1, text2: line2, type: "same" });
        sameCount++;
      } else if (line1 && !line2) {
        differences.push({ line: i + 1, text1: line1, text2: "", type: "removed" });
        removedCount++;
      } else if (!line1 && line2) {
        differences.push({ line: i + 1, text1: "", text2: line2, type: "added" });
        addedCount++;
      } else {
        differences.push({ line: i + 1, text1: line1, text2: line2, type: "modified" });
        modifiedCount++;
      }
    }

    const similarity = ((sameCount / maxLines) * 100).toFixed(1);

    return { differences, addedCount, removedCount, modifiedCount, sameCount, similarity };
  }, [text1, text2]);

  const handleCompare = () => {
    if (!text1 || !text2) {
      toast.error("Please enter text in both fields");
      return;
    }
    setCompared(true);
    toast.success("Texts compared!");
  };

  const clearAll = () => {
    setText1("");
    setText2("");
    setCompared(false);
    toast.success("Cleared!");
  };

  const faqs = [
    {
      question: "How does the text compare tool work?",
      answer: "Our text comparison tool analyzes two pieces of text line by line. It identifies lines that are identical (unchanged), lines that exist only in the first text (removed), lines that exist only in the second text (added), and lines that have been modified. Results are color-coded for easy visualization."
    },
    {
      question: "Is this text diff tool free?",
      answer: "Yes! PineToolsHub text compare is 100% free with no limits. Compare unlimited text, code, or documents. No signup, no registration, no hidden fees - just paste your texts and compare instantly."
    },
    {
      question: "What can I use text comparison for?",
      answer: "Common uses include: comparing code versions to find changes, checking document revisions, verifying content updates, detecting plagiarism differences, reviewing contract changes, and debugging by comparing output differences."
    },
    {
      question: "Does this work with code files?",
      answer: "Absolutely! Our text compare tool works with any text including programming code, HTML, CSS, JavaScript, Python, JSON, and more. It's perfect for developers who need to quickly diff two code snippets without using Git or other version control tools."
    },
    {
      question: "Is there a character or line limit?",
      answer: "There's no hard limit. You can compare long documents, entire files, or short snippets. The comparison runs in your browser, so performance depends on your device, but it handles thousands of lines easily."
    },
    {
      question: "How is similarity percentage calculated?",
      answer: "Similarity is calculated by dividing the number of identical lines by the total number of lines, then multiplying by 100. A 100% similarity means the texts are identical, while 0% means no lines match."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Text Compare - Free Online Diff Tool | Compare Text Files 2025"
        description="Compare two texts and find differences instantly. Free online text diff tool - highlight added, removed, and modified lines. Perfect for code comparison!"
        keywords="text compare, diff tool, compare text online, text difference checker, online diff, compare two texts, text comparison tool, code diff, file compare"
        canonical="https://pinetoolshub.com/text-compare"
      />
      
      <ToolStructuredData
        toolName="Text Compare - Free Online Diff Tool"
        toolDescription="Compare two texts and find differences instantly. Highlights added, removed, and modified lines with color coding and similarity percentage."
        toolUrl="https://pinetoolshub.com/text-compare"
        category="Text"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Text Compare"
        description="Compare two texts and find differences instantly. Free online diff tool - highlights added, removed, and modified lines!"
        icon={<GitCompare className="h-8 w-8" />}
        color="bg-amber-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Input Areas */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Original Text</label>
              <Textarea
                placeholder="Paste your original text here..."
                value={text1}
                onChange={(e) => { setText1(e.target.value); setCompared(false); }}
                className="min-h-[250px] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Modified Text</label>
              <Textarea
                placeholder="Paste the modified text here..."
                value={text2}
                onChange={(e) => { setText2(e.target.value); setCompared(false); }}
                className="min-h-[250px] text-sm font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={handleCompare} disabled={!text1 || !text2}>
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Texts
            </Button>
            <Button onClick={clearAll} variant="outline" disabled={!text1 && !text2}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {/* Results */}
          {compared && comparison && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{comparison.similarity}%</p>
                    <p className="text-xs text-muted-foreground">Similarity</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{comparison.addedCount}</p>
                    <p className="text-xs text-muted-foreground">Added</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-400">{comparison.removedCount}</p>
                    <p className="text-xs text-muted-foreground">Removed</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{comparison.modifiedCount}</p>
                    <p className="text-xs text-muted-foreground">Modified</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-muted-foreground">{comparison.sameCount}</p>
                    <p className="text-xs text-muted-foreground">Unchanged</p>
                  </CardContent>
                </Card>
              </div>

              {/* Diff View */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Line-by-Line Comparison</h3>
                  <div className="overflow-x-auto">
                    <div className="font-mono text-sm space-y-1">
                      {comparison.differences.map((diff, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-2 p-2 rounded ${
                            diff.type === "same" ? "bg-muted/20" :
                            diff.type === "added" ? "bg-green-500/20 border-l-4 border-green-500" :
                            diff.type === "removed" ? "bg-red-500/20 border-l-4 border-red-500" :
                            "bg-yellow-500/20 border-l-4 border-yellow-500"
                          }`}
                        >
                          <span className="text-muted-foreground w-8 flex-shrink-0">{diff.line}</span>
                          <div className="flex-1 grid md:grid-cols-2 gap-4">
                            <div className={diff.type === "added" ? "text-muted-foreground line-through" : ""}>
                              {diff.text1 || <span className="text-muted-foreground italic">(empty)</span>}
                            </div>
                            <div className="hidden md:flex items-center justify-center">
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className={diff.type === "removed" ? "text-muted-foreground line-through" : ""}>
                              {diff.text2 || <span className="text-muted-foreground italic">(empty)</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Text Comparison Tool</h2>
          <p className="text-muted-foreground mb-4">
            Need to compare two texts and find differences? Our free text diff tool highlights exactly what changed between 
            two versions. Whether you're comparing code files, document revisions, or any text content - see additions, 
            deletions, and modifications at a glance.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">Features</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Line-by-Line Comparison:</strong> See exactly which lines changed</li>
            <li><strong>Color-Coded Results:</strong> Green for additions, red for removals, yellow for modifications</li>
            <li><strong>Similarity Score:</strong> Get a percentage of how similar the texts are</li>
            <li><strong>Side-by-Side View:</strong> Compare original and modified text together</li>
            <li><strong>Works with Code:</strong> Perfect for diffing JavaScript, Python, HTML, CSS, and more</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default TextCompare;
