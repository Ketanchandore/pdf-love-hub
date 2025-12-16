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
import { Label } from "@/components/ui/label";
import { Layers, Download, Trash2 } from "lucide-react";

const OrganizePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageOrder, setPageOrder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      setSelectedPages(Array.from({ length: count }, (_, i) => i + 1));
      setPageOrder(Array.from({ length: count }, (_, i) => i + 1).join(", "));
    }
  };

  const parsePageOrder = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(",").map((p) => p.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= pageCount) {
              pages.push(i);
            }
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
          pages.push(pageNum);
        }
      }
    }

    return pages;
  };

  const organizePdf = async () => {
    if (!file) return;

    const pages = parsePageOrder(pageOrder);
    if (pages.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      setProgress(30);

      const newPdf = await PDFDocument.create();

      for (let i = 0; i < pages.length; i++) {
        const pageIndex = pages[i] - 1;
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
        newPdf.addPage(copiedPage);
        setProgress(30 + ((i + 1) / pages.length) * 60);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `organized-${file.name}`);

      setProgress(100);
      setFile(null);
      setPageCount(0);
      setSelectedPages([]);
      setPageOrder("");
    } catch (error) {
      console.error("Error organizing PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I rearrange pages in a PDF online?",
      answer: "Upload your PDF to our I Love PDF Organize tool, enter your desired page order (e.g., '3, 1, 2, 5-7'), and click 'Organize PDF'. Your reorganized document will be ready to download."
    },
    {
      question: "Can I delete pages from a PDF?",
      answer: "Yes! Simply omit the pages you want to delete from the page order. If your PDF has 5 pages and you enter '1, 2, 4, 5', page 3 will be removed."
    },
    {
      question: "Can I duplicate pages in the PDF?",
      answer: "Yes! Include the same page number multiple times in your order. For example, '1, 2, 2, 3' will duplicate page 2 in your final document."
    },
    {
      question: "How do I specify page ranges?",
      answer: "Use hyphens for ranges, like '1-5' to include pages 1 through 5. Combine with commas: '1-3, 7, 10-15' includes pages 1-3, page 7, and pages 10-15."
    },
    {
      question: "Will organizing affect page quality?",
      answer: "No, organizing is a lossless operation. All content, formatting, images, and text remain exactly the same - only the page order changes."
    },
    {
      question: "Is my PDF secure during organizing?",
      answer: "Absolutely! All processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    }
  ];

  return (
    <>
      <SEOHead
        title="Organize PDF Pages Free Online - I Love PDF Organize | Pine Tools Hub"
        description="Organize and rearrange PDF pages online for free with our I Love PDF Organize tool. Reorder, delete, or duplicate pages easily. No registration, 100% secure."
        keywords="organize pdf, rearrange pdf pages, i love pdf organize, reorder pdf, delete pdf pages, pdf page manager, organize pdf online free"
        canonical="https://pinetoolshub.com/organize-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Organize PDF Pages"
          description="Rearrange, delete, or duplicate pages in your PDF. I Love PDF Organize gives you full control - completely free and secure."
          icon={<Layers className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} available
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageOrder">Page Order</Label>
                <Input
                  id="pageOrder"
                  value={pageOrder}
                  onChange={(e) => setPageOrder(e.target.value)}
                  placeholder="e.g., 3, 1, 2, 5-7"
                />
                <p className="text-xs text-muted-foreground">
                  Enter page numbers separated by commas. Use ranges like "1-5". 
                  Omit pages to delete them. Repeat numbers to duplicate.
                </p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium mb-2">Preview of page order:</p>
                <div className="flex flex-wrap gap-2">
                  {parsePageOrder(pageOrder).map((page, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                    >
                      {page}
                    </span>
                  ))}
                </div>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Organizing PDF..." />
              ) : (
                <Button
                  onClick={organizePdf}
                  className="w-full"
                  size="lg"
                  disabled={parsePageOrder(pageOrder).length === 0}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Organize PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Page Organizer - I Love PDF Rearrange Tool</h2>
            <p>
              Need to rearrange, delete, or duplicate pages in a PDF? Pine Tools Hub's I Love PDF Organize tool gives you complete control over your document's page structure. Whether you're fixing page order, removing unnecessary pages, or creating custom document versions, our tool makes it simple.
            </p>
            <p>
              Our PDF organizer processes everything in your browser, keeping your documents completely private. There's no uploading to servers, no waiting in queues, and no privacy concerns.
            </p>
            <h3>What Can You Do with PDF Organize?</h3>
            <ul>
              <li><strong>Rearrange Pages:</strong> Put pages in any order you need</li>
              <li><strong>Delete Pages:</strong> Remove unwanted pages from your document</li>
              <li><strong>Duplicate Pages:</strong> Create copies of important pages</li>
              <li><strong>Extract Sections:</strong> Pull out specific page ranges</li>
              <li><strong>Reverse Order:</strong> Flip the entire document order</li>
            </ul>
            <h3>How to Organize PDF Pages</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Enter your desired page order (e.g., "3, 1, 2, 5-7")</li>
              <li>Review the preview of your new page order</li>
              <li>Click "Organize PDF" to create your reorganized document</li>
              <li>Download your new PDF</li>
            </ol>
            <h3>Page Order Syntax</h3>
            <p>
              Use commas to separate page numbers: <code>1, 3, 5</code><br />
              Use hyphens for ranges: <code>1-5</code> includes pages 1, 2, 3, 4, 5<br />
              Combine both: <code>1-3, 7, 10-12</code><br />
              Duplicate pages by repeating numbers: <code>1, 1, 2, 3</code>
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default OrganizePdf;
