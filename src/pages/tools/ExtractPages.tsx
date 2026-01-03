import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileOutput, Download } from "lucide-react";

const ExtractPages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setPageRange(`1-${pdf.getPageCount()}`);
    }
  };

  const parsePageRange = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(",").map((p) => p.trim());
    
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        for (let i = start; i <= end && i <= pageCount; i++) {
          if (i >= 1 && !pages.includes(i)) pages.push(i);
        }
      } else {
        const num = parseInt(part);
        if (num >= 1 && num <= pageCount && !pages.includes(num)) pages.push(num);
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const extractPages = async () => {
    if (!file || !pageRange) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const pagesToExtract = parsePageRange(pageRange);
      
      for (let i = 0; i < pagesToExtract.length; i++) {
        const pageIndex = pagesToExtract[i] - 1;
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
        newPdf.addPage(copiedPage);
        setProgress(((i + 1) / pagesToExtract.length) * 100);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, `extracted-pages.pdf`);

      setFile(null);
      setPageCount(0);
      setPageRange("");
    } catch (error) {
      console.error("Error extracting pages:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I extract specific pages from a PDF online free?",
      answer: "Upload your PDF to our free extract pages tool, enter the page numbers you want to extract (e.g., '1, 3, 5-10'), and click Extract Pages. The selected pages are saved as a new PDF document - no registration, no watermark."
    },
    {
      question: "Can I extract non-consecutive pages from a PDF?",
      answer: "Yes! You can specify individual pages (1, 3, 5), page ranges (1-5), or combine both (1, 3, 5-10). The extracted pages are saved in the order you specify."
    },
    {
      question: "Is my PDF secure during the extraction process?",
      answer: "Absolutely! All processing happens locally in your browser. Your PDF never leaves your device or gets uploaded to any server, ensuring complete privacy for sensitive documents."
    },
    {
      question: "Will the extracted PDF maintain original quality?",
      answer: "Yes! We extract pages without any compression or quality loss. Your extracted PDF will have identical quality to the original pages - all text, images, and formatting preserved perfectly."
    },
    {
      question: "Can I extract pages from a PDF on mobile phone?",
      answer: "Yes! Our extract pages online tool works perfectly on smartphones and tablets. The responsive interface adapts to any screen size for easy page extraction on iPhone, Android, and iPad devices."
    },
    {
      question: "What's the difference between extract pages and split PDF?",
      answer: "Extract pages lets you select specific pages to save as a new PDF. Split PDF divides the entire document into multiple smaller PDFs. Use extract for specific pages, split for dividing the whole document."
    },
    {
      question: "Can I extract pages from a password-protected PDF?",
      answer: "You'll need to unlock the PDF first using our free Unlock PDF tool before extracting pages. Once unlocked, you can extract any pages you need."
    },
    {
      question: "Is this extract pages tool better than iLovePDF extract?",
      answer: "Our free PDF extract pages tool offers complete privacy since all processing happens in your browser - your documents never get uploaded to external servers like with cloud-based alternatives."
    }
  ];

  return (
    <>
      <SEOHead
        title="Extract Pages from PDF Online Free - Select & Save Specific Pages | Pine Tools Hub"
        description="Extract specific pages from PDF files online free without watermark. Select individual pages or page ranges and save as new PDF. No registration, works on mobile, 100% private."
        keywords="extract pdf pages free, pdf page extractor online, remove pages from pdf, select pdf pages, save specific pdf pages, extract pages from pdf, ilovepdf extract alternative"
        canonical="https://pinetoolshub.com/extract-pages"
      />
      <ToolStructuredData
        toolName="Extract Pages from PDF"
        toolDescription="Free online PDF page extractor. Select and save specific pages from PDF documents as a new file - no watermark, no registration required."
        toolUrl="https://pinetoolshub.com/extract-pages"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Extract Pages from PDF Online Free"
          description="Select and save specific pages from your PDF as a new document. No watermark, no registration - works on mobile & desktop."
          icon={<FileOutput className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            label="Drop a PDF file here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {pageCount} page{pageCount !== 1 ? "s" : ""} total
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pages to Extract</label>
                <Input
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g., 1, 3, 5-10"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter page numbers separated by commas. Use dash for ranges (e.g., 1-5, 8, 10-15).
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Extracting pages..." />
              ) : (
                <Button onClick={extractPages} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Extract Pages
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Page Extractor - Save Specific Pages Online</h2>
            <p>
              Need to <strong>extract specific pages from a large PDF</strong>? Pine Tools Hub's free page extractor lets you select exactly which pages you need and save them as a new PDF document. Perfect for pulling out important sections, sharing specific pages, or creating smaller documents from large PDFs.
            </p>
            <p>
              Our PDF page extractor processes everything directly in your browser, keeping your documents completely private. There's no uploading to external servers, no waiting in queues, and no privacy concerns - ideal for sensitive documents.
            </p>

            <h3>How to Extract Pages from PDF Online Free</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select the PDF with pages you want to extract</li>
              <li><strong>Enter Page Numbers:</strong> Type the specific pages or ranges you want (e.g., "1, 3, 5-10")</li>
              <li><strong>Click Extract Pages:</strong> Selected pages are compiled into a new PDF</li>
              <li><strong>Download Result:</strong> Save your extracted pages immediately</li>
            </ol>

            <h3>Page Selection Options</h3>
            <ul>
              <li><strong>Single pages:</strong> <code>1, 3, 5</code> - extract only pages 1, 3, and 5</li>
              <li><strong>Page ranges:</strong> <code>1-10</code> - extract pages 1 through 10</li>
              <li><strong>Combination:</strong> <code>1, 3, 5-10, 15</code> - mix of individual pages and ranges</li>
            </ul>

            <h3>Common Uses for PDF Page Extraction</h3>
            <ul>
              <li><strong>Share Specific Sections:</strong> Extract only relevant pages to share with colleagues or clients</li>
              <li><strong>Create Summaries:</strong> Pull out executive summary or key pages from reports</li>
              <li><strong>Reduce File Size:</strong> Extract needed pages from large documents to save storage</li>
              <li><strong>Archive Organization:</strong> Extract and organize important pages from various documents</li>
              <li><strong>Presentation Prep:</strong> Extract slides or pages needed for presentations</li>
            </ul>

            <h3>Best Free PDF Extract Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF page extraction alternative to iLovePDF</strong>? Pine Tools Hub offers browser-based extraction with complete privacy. Your documents never leave your device, making our tool ideal for sensitive files.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ExtractPages;