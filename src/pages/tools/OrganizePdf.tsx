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
import { Label } from "@/components/ui/label";
import { Layers, Download } from "lucide-react";

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
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
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
      question: "How do I rearrange pages in a PDF online free?",
      answer: "Upload your PDF to our free organize tool, enter your desired page order (e.g., '3, 1, 2, 5-7'), and click 'Organize PDF'. Your reorganized document will be ready to download instantly - no registration, no watermark."
    },
    {
      question: "Can I delete pages from a PDF using this tool?",
      answer: "Yes! Simply omit the pages you want to delete from the page order. For example, if your PDF has 5 pages and you enter '1, 2, 4, 5', page 3 will be removed from the final document."
    },
    {
      question: "Can I duplicate pages in my PDF?",
      answer: "Yes! Include the same page number multiple times in your order. For example, '1, 2, 2, 3' will duplicate page 2, so it appears twice in your final document."
    },
    {
      question: "How do I specify page ranges when organizing PDF?",
      answer: "Use hyphens for ranges, like '1-5' to include pages 1 through 5. Combine with commas for complex orders: '1-3, 7, 10-15' includes pages 1-3, page 7, and pages 10-15."
    },
    {
      question: "Will organizing affect the quality of my PDF pages?",
      answer: "No, organizing is a completely lossless operation. All text, images, formatting, links, and embedded content remain exactly the same - only the page order changes."
    },
    {
      question: "Is my PDF secure during the organizing process?",
      answer: "Absolutely! All processing happens locally in your browser. Your files never leave your device or get uploaded to any server, ensuring complete privacy and security."
    },
    {
      question: "Can I organize PDF on mobile phone?",
      answer: "Yes! Our organize PDF online tool works perfectly on smartphones and tablets. The responsive interface makes it easy to rearrange, delete, or duplicate pages on any device."
    },
    {
      question: "Is this organize PDF tool better than iLovePDF organize?",
      answer: "Our free PDF organizing tool offers complete privacy since all processing happens in your browser - your documents never get uploaded to external servers like with cloud-based alternatives."
    }
  ];

  return (
    <>
      <SEOHead
        title="Organize PDF Pages Online Free - Rearrange, Delete, Duplicate | Pine Tools Hub"
        description="Organize and rearrange PDF pages online free without watermark. Reorder, delete, or duplicate pages easily. No registration, works on mobile, 100% private browser-based PDF organizer."
        keywords="organize pdf online free, rearrange pdf pages, reorder pdf, delete pdf pages, duplicate pdf pages, pdf page manager, pdf organizer free, ilovepdf organize alternative"
        canonical="https://pinetoolshub.com/organize-pdf"
      />
      <ToolStructuredData
        toolName="Organize PDF Pages Online"
        toolDescription="Free online PDF page organizer. Rearrange, delete, or duplicate pages in your PDF documents - no watermark, no registration required."
        toolUrl="https://pinetoolshub.com/organize-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Organize PDF Pages Online Free"
          description="Rearrange, delete, or duplicate pages in your PDF documents. Complete control over page order - free, no watermark, works on mobile & desktop."
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
            <h2>Free PDF Page Organizer - Rearrange, Delete & Duplicate Pages</h2>
            <p>
              Need to <strong>rearrange, delete, or duplicate pages in a PDF</strong>? Pine Tools Hub's free PDF organizer gives you complete control over your document's page structure. Whether you're fixing page order, removing unnecessary pages, or creating custom document versions, our tool makes it simple and fast.
            </p>
            <p>
              Our PDF organizer processes everything directly in your browser, keeping your documents completely private. There's no uploading to external servers, no waiting in queues, and no privacy concerns - ideal for sensitive business, legal, or personal documents.
            </p>

            <h3>What Can You Do with PDF Organize?</h3>
            <ul>
              <li><strong>Rearrange Pages:</strong> Put pages in any order you need - move, swap, or completely reorganize</li>
              <li><strong>Delete Pages:</strong> Remove unwanted pages from your document by omitting them from the order</li>
              <li><strong>Duplicate Pages:</strong> Create copies of important pages by repeating their numbers</li>
              <li><strong>Extract Sections:</strong> Pull out specific page ranges into a new document</li>
              <li><strong>Reverse Order:</strong> Flip the entire document order (enter pages in reverse)</li>
              <li><strong>Create Custom Versions:</strong> Build exactly the document you need from any combination of pages</li>
            </ul>

            <h3>How to Organize PDF Pages Online Free</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select your PDF document</li>
              <li><strong>Enter Page Order:</strong> Type the page numbers in your desired order (e.g., "3, 1, 2, 5-7")</li>
              <li><strong>Review Preview:</strong> See the visual preview of your new page order</li>
              <li><strong>Click Organize PDF:</strong> Process your document with the new page arrangement</li>
              <li><strong>Download Result:</strong> Save your reorganized PDF immediately</li>
            </ol>

            <h3>Page Order Syntax Guide</h3>
            <ul>
              <li><strong>Individual pages:</strong> <code>1, 3, 5</code> - includes only pages 1, 3, and 5</li>
              <li><strong>Page ranges:</strong> <code>1-5</code> - includes pages 1, 2, 3, 4, 5</li>
              <li><strong>Combined:</strong> <code>1-3, 7, 10-12</code> - includes pages 1-3, page 7, and pages 10-12</li>
              <li><strong>Duplicate pages:</strong> <code>1, 1, 2, 3</code> - page 1 appears twice</li>
              <li><strong>Reversed:</strong> <code>5, 4, 3, 2, 1</code> - reverses a 5-page document</li>
            </ul>

            <h3>Best Free PDF Organize Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF organizing alternative to iLovePDF</strong>? Pine Tools Hub offers browser-based page organization with complete privacy. Your documents never leave your device, making our tool ideal for sensitive files that shouldn't be uploaded to cloud servers.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default OrganizePdf;