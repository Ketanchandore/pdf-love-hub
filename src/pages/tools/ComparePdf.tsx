import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
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
      question: "How do I compare two PDF files online free?",
      answer: "Upload both PDF files to our free comparison tool, then click 'Compare PDFs'. Our tool analyzes the text content in both documents and shows you the similarity score along with unique content found in each file - no registration required."
    },
    {
      question: "What does the similarity score mean?",
      answer: "The similarity score shows what percentage of text content is shared between both documents. 100% means identical text, while lower scores indicate more differences. This helps you quickly understand how similar or different two document versions are."
    },
    {
      question: "Can I compare scanned PDF documents?",
      answer: "Our comparison tool works with PDFs containing selectable text. For scanned documents (image-based PDFs), you may need to run OCR (Optical Character Recognition) first to extract text before comparison."
    },
    {
      question: "Is my document comparison secure and private?",
      answer: "Yes! All comparison processing happens locally in your browser. Your files never leave your device or get uploaded to any server, ensuring complete privacy for sensitive legal, business, or personal documents."
    },
    {
      question: "Can I compare PDFs with different page counts?",
      answer: "Yes! Our tool compares the overall text content regardless of page count or layout. It's useful for comparing document versions, checking for content changes, or finding plagiarism between documents."
    },
    {
      question: "Does it show exactly what changed between document versions?",
      answer: "Our tool provides a summary comparison showing overall similarity percentage and lists of unique words in each document. For detailed line-by-line or character-level comparison, professional diff tools may be needed."
    },
    {
      question: "Can I compare PDF on mobile phone?",
      answer: "Yes! Our compare PDF online tool works perfectly on smartphones and tablets. The responsive interface adapts to any screen size for easy document comparison on iPhone, Android, and iPad devices."
    },
    {
      question: "Is this compare PDF tool better than iLovePDF compare?",
      answer: "Our free PDF comparison tool offers complete privacy since all processing happens in your browser - your documents never get uploaded to external servers, unlike cloud-based alternatives like iLovePDF."
    }
  ];

  return (
    <>
      <SEOHead
        title="Compare PDF Files Online Free - Find Differences Between Documents | Pine Tools Hub"
        description="Compare PDF files online free. Find differences between two PDF documents and check similarity scores instantly. No registration, works on mobile, 100% private browser-based comparison tool."
        keywords="compare pdf online free, pdf comparison tool, diff pdf files, find differences pdf, compare documents online, pdf similarity checker, compare two pdfs free, ilovepdf compare alternative"
        canonical="https://pinetoolshub.com/compare-pdf"
      />
      <ToolStructuredData
        toolName="Compare PDF Files Online"
        toolDescription="Free online PDF comparison tool. Find differences between documents and check similarity scores - no registration required."
        toolUrl="https://pinetoolshub.com/compare-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Compare PDF Files Online Free"
          description="Find differences between two PDF documents instantly. Check similarity scores and identify unique content - completely free, private, works on mobile."
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
            <h2>Free PDF Comparison Tool - Find Differences Between Documents</h2>
            <p>
              Need to <strong>compare two PDF files online free</strong>? Pine Tools Hub's PDF comparison tool analyzes both documents and shows you exactly what's different. Perfect for comparing contract versions, checking document revisions, verifying content accuracy, or detecting changes between drafts.
            </p>
            <p>
              Unlike other PDF comparison tools that upload your sensitive documents to external servers, our tool processes everything directly in your browser. Your confidential legal, business, or personal documents never leave your device, ensuring complete privacy during comparison.
            </p>

            <h3>Why Compare PDF Documents?</h3>
            <ul>
              <li><strong>Contract Review:</strong> Spot changes and modifications between contract versions before signing</li>
              <li><strong>Document Revisions:</strong> Track edits and updates across document drafts and versions</li>
              <li><strong>Plagiarism Detection:</strong> Compare documents for content similarity and originality</li>
              <li><strong>Quality Assurance:</strong> Verify document accuracy and completeness against originals</li>
              <li><strong>Legal Review:</strong> Identify modifications in legal documents, agreements, and policies</li>
              <li><strong>Academic Work:</strong> Check papers and essays for content overlap</li>
            </ul>

            <h3>How to Compare PDF Files Online Free</h3>
            <ol>
              <li><strong>Upload First PDF:</strong> Drag and drop or click to select your first document</li>
              <li><strong>Upload Second PDF:</strong> Add the second document you want to compare</li>
              <li><strong>Click Compare PDFs:</strong> Our tool analyzes text content in both files</li>
              <li><strong>Review Results:</strong> See similarity score and lists of unique content in each document</li>
            </ol>

            <h3>Best Free PDF Comparison Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF comparison alternative to iLovePDF</strong>? Pine Tools Hub offers browser-based document comparison with complete privacy. Our tool delivers fast, accurate comparison results without compromising the security of your sensitive files.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ComparePdf;