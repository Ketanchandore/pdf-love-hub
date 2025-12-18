import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { GitCompare, Search } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ComparePdf = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [comparison, setComparison] = useState<string | null>(null);

  const handleFile1Selected = (files: File[]) => {
    if (files.length > 0) {
      setFile1(files[0]);
      setComparison(null);
    }
  };

  const handleFile2Selected = (files: File[]) => {
    if (files.length > 0) {
      setFile2(files[0]);
      setComparison(null);
    }
  };

  const extractText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    
    return text;
  };

  const comparePdfs = async () => {
    if (!file1 || !file2) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(20);
      const text1 = await extractText(file1);
      setProgress(50);
      const text2 = await extractText(file2);
      setProgress(80);

      const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 0);

      const set1 = new Set(words1);
      const set2 = new Set(words2);

      const common = words1.filter(w => set2.has(w)).length;
      const similarity = ((2 * common) / (words1.length + words2.length) * 100).toFixed(1);

      const uniqueToFile1 = [...set1].filter(w => !set2.has(w)).slice(0, 20);
      const uniqueToFile2 = [...set2].filter(w => !set1.has(w)).slice(0, 20);

      setComparison(`
## Comparison Results

**File 1:** ${file1.name} (${words1.length} words)
**File 2:** ${file2.name} (${words2.length} words)

### Similarity Score: ${similarity}%

### Words unique to File 1:
${uniqueToFile1.join(", ") || "None found"}

### Words unique to File 2:
${uniqueToFile2.join(", ") || "None found"}
      `);

      setProgress(100);
    } catch (error) {
      console.error("Error comparing PDFs:", error);
      setComparison("Error comparing files. Please ensure both PDFs contain text content.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I compare two PDF files?",
      answer: "Upload both PDF files to our I Love PDF Compare tool, then click 'Compare PDFs'. Our tool analyzes the text content and shows you the similarity score and unique content in each file."
    },
    {
      question: "What does the similarity score mean?",
      answer: "The similarity score shows what percentage of content is shared between both documents. 100% means identical text, while lower scores indicate more differences."
    },
    {
      question: "Can I compare scanned PDFs?",
      answer: "Our comparison tool works with PDFs containing selectable text. For scanned documents, you may need to OCR them first to extract text for comparison."
    },
    {
      question: "Is my document comparison secure?",
      answer: "Yes! All comparison happens locally in your browser. Your files never leave your device, ensuring complete privacy for sensitive legal or business documents."
    },
    {
      question: "Can I compare PDFs with different page counts?",
      answer: "Yes! Our tool compares the overall text content regardless of page count. It's useful for comparing document versions or finding content changes."
    },
    {
      question: "Does it show exactly what changed between versions?",
      answer: "Our tool provides a summary comparison showing similarity and unique words. For detailed line-by-line comparison, professional diff tools may be needed."
    }
  ];

  return (
    <>
      <SEOHead
        title="Compare PDF Files Online Free - I Love PDF Compare Tool | Pine Tools Hub"
        description="Compare PDF files online for free with our I Love PDF Compare tool. Find differences between documents and check similarity scores. No registration, 100% secure browser-based comparison."
        keywords="compare pdf, pdf comparison, i love pdf compare, diff pdf, compare documents, find differences pdf, pdf similarity, ilovepdf compare, document comparison"
        canonical="https://pinetoolshub.com/compare-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Compare PDF Files"
          description="Find differences between two PDF documents. I Love PDF Compare analyzes your files and shows similarity scores - completely free and secure."
          icon={<GitCompare className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">First PDF</h3>
              <FileUpload
                onFilesSelected={handleFile1Selected}
                accept={{ "application/pdf": [".pdf"] }}
                multiple={false}
                label="Drop first PDF here"
              />
              {file1 && (
                <p className="mt-2 text-sm text-muted-foreground">{file1.name}</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Second PDF</h3>
              <FileUpload
                onFilesSelected={handleFile2Selected}
                accept={{ "application/pdf": [".pdf"] }}
                multiple={false}
                label="Drop second PDF here"
              />
              {file2 && (
                <p className="mt-2 text-sm text-muted-foreground">{file2.name}</p>
              )}
            </div>
          </div>

          {file1 && file2 && (
            <div className="mt-8">
              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Comparing PDFs..." />
              ) : (
                <Button onClick={comparePdfs} className="w-full" size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  Compare PDFs
                </Button>
              )}
            </div>
          )}

          {comparison && (
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{comparison}</pre>
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Comparison Tool - I Love PDF Compare Documents</h2>
            <p>
              Need to find differences between two PDF files? Pine Tools Hub's <strong>I Love PDF Compare</strong> tool analyzes both documents and shows you exactly what's different. Perfect for comparing contract versions, checking document revisions, or verifying content accuracy.
            </p>
            <p>
              Unlike other PDF comparison tools that upload your sensitive documents to servers, our tool processes everything directly in your browser. Your confidential legal, business, or personal documents never leave your device.
            </p>
            <h3>Why Compare PDF Documents?</h3>
            <ul>
              <li><strong>Contract Review:</strong> Spot changes between contract versions</li>
              <li><strong>Document Versions:</strong> Track edits across document revisions</li>
              <li><strong>Plagiarism Check:</strong> Compare documents for content similarity</li>
              <li><strong>Quality Assurance:</strong> Verify document accuracy and completeness</li>
              <li><strong>Legal Review:</strong> Identify modifications in legal documents</li>
            </ul>
            <h3>How to Compare PDF Files</h3>
            <ol>
              <li>Upload the first PDF document</li>
              <li>Upload the second PDF document to compare</li>
              <li>Click "Compare PDFs" to analyze</li>
              <li>Review the similarity score and differences</li>
            </ol>
            <h3>Best I Love PDF Compare Alternative</h3>
            <p>
              Looking for the best <strong>I Love PDF Compare alternative</strong>? Pine Tools Hub offers free PDF comparison with complete privacy. Our browser-based tool delivers fast document analysis without compromising the security of your sensitive files.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ComparePdf;
