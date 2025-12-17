import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
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
      question: "How do I extract specific pages from a PDF?",
      answer: "Upload your PDF, enter the page numbers you want to extract (e.g., 1,3,5-10), and click Extract Pages. The selected pages will be saved as a new PDF."
    },
    {
      question: "Can I extract non-consecutive pages?",
      answer: "Yes! You can specify individual pages (1,3,5) or ranges (1-5) or combine both (1,3,5-10). Pages are extracted in the order you specify."
    },
    {
      question: "Is my PDF secure during extraction?",
      answer: "Absolutely! All processing happens locally in your browser. Your PDF never leaves your device, ensuring complete privacy."
    },
    {
      question: "Will the extracted PDF maintain quality?",
      answer: "Yes! We extract pages without any compression or quality loss. Your extracted PDF will be identical to the original pages."
    }
  ];

  return (
    <>
      <SEOHead
        title="Extract Pages from PDF Free Online - I Love PDF Extract | Pine Tools Hub"
        description="Extract specific pages from PDF files online for free. Select and save individual pages or page ranges. I Love PDF style tool with complete privacy."
        keywords="extract pdf pages, pdf page extractor, remove pages from pdf, select pdf pages, i love pdf extract, pdf page selector free"
        canonical="https://pinetoolshub.com/extract-pages"
      />

      <div className="py-12">
        <ToolHero
          title="Extract PDF Pages"
          description="Select and extract specific pages from your PDF. I Love PDF style tool - fast, free, and private."
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
                  placeholder="e.g., 1,3,5-10"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter page numbers separated by commas. Use dash for ranges (e.g., 1-5).
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
            <h2>Free PDF Page Extractor - I Love PDF Extract Tool</h2>
            <p>
              Need to save specific pages from a large PDF? Pine Tools Hub's extract pages tool lets you select exactly which pages you need and save them as a new PDF document.
            </p>
            <h3>How to Extract PDF Pages</h3>
            <ol>
              <li>Upload your PDF file</li>
              <li>Enter the page numbers you want to extract</li>
              <li>Click "Extract Pages" to create your new PDF</li>
              <li>Download the extracted pages</li>
            </ol>
            <h3>Page Selection Options</h3>
            <ul>
              <li><strong>Single pages:</strong> 1, 3, 5</li>
              <li><strong>Page ranges:</strong> 1-10, 15-20</li>
              <li><strong>Combination:</strong> 1, 3, 5-10, 15</li>
            </ul>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ExtractPages;