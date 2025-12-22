import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Download } from "lucide-react";

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<"all" | "range">("all");
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
    }
  };

  const splitPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const zip = new JSZip();

      if (splitMode === "all") {
        for (let i = 0; i < pdf.getPageCount(); i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          const pdfBytes = await newPdf.save();
          zip.file(`page-${i + 1}.pdf`, pdfBytes);
          setProgress(((i + 1) / pdf.getPageCount()) * 100);
        }
      } else {
        const ranges = pageRange.split(",").map((r) => r.trim());
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const newPdf = await PDFDocument.create();

          if (range.includes("-")) {
            const [start, end] = range.split("-").map((n) => parseInt(n) - 1);
            for (let j = start; j <= end && j < pdf.getPageCount(); j++) {
              const [page] = await newPdf.copyPages(pdf, [j]);
              newPdf.addPage(page);
            }
          } else {
            const pageIndex = parseInt(range) - 1;
            if (pageIndex >= 0 && pageIndex < pdf.getPageCount()) {
              const [page] = await newPdf.copyPages(pdf, [pageIndex]);
              newPdf.addPage(page);
            }
          }

          if (newPdf.getPageCount() > 0) {
            const pdfBytes = await newPdf.save();
            zip.file(`split-${i + 1}.pdf`, pdfBytes);
          }
          setProgress(((i + 1) / ranges.length) * 100);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "split-pdfs.zip");

      setFile(null);
      setPageCount(0);
    } catch (error) {
      console.error("Error splitting PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I split a PDF into separate pages for free?",
      answer: "Upload your PDF to our free PDF splitter, select 'Extract all pages' to split into individual pages, then click 'Split PDF'. Each page will be saved as a separate PDF file in a convenient ZIP download. No registration required and completely free."
    },
    {
      question: "Can I extract specific pages from a PDF document?",
      answer: "Yes! Use the 'Custom range' option to specify exactly which pages you want to extract. Enter page numbers like '1, 3, 5-10' to extract those specific pages. This is perfect for getting just the pages you need from a large document."
    },
    {
      question: "How to split PDF on mobile phone?",
      answer: "Our PDF splitter works perfectly on mobile devices. Open Pine Tools Hub in your mobile browser, upload your PDF, and split it instantly. No app download required - works on Android and iPhone browsers."
    },
    {
      question: "Is my PDF safe when splitting online?",
      answer: "Absolutely! Our PDF splitter processes files entirely in your browser. Your documents never leave your device, ensuring complete privacy and security for sensitive information. This is the safest way to split PDFs online."
    },
    {
      question: "What's the maximum PDF size I can split?",
      answer: "Since processing happens locally in your browser, there's no server limit. Large files may take longer depending on your device, but typically files up to 100MB work smoothly. For best performance, we recommend files under 50MB."
    },
    {
      question: "Can I split a password-protected PDF?",
      answer: "You'll need to unlock the PDF first using our Unlock PDF tool, then you can split it. Password protection prevents modification without authorization for security reasons."
    },
    {
      question: "How do I download split PDF pages?",
      answer: "After splitting, all extracted pages are packaged into a single ZIP file for easy download. Simply click the download button and extract the ZIP to access your individual PDF files on any device."
    },
    {
      question: "Can I split PDF without losing quality?",
      answer: "Yes! Our PDF splitter extracts pages without any compression or quality loss. Your split PDFs will be identical to the original pages - all text, images, and formatting preserved perfectly."
    }
  ];

  return (
    <>
      <SEOHead
        title="Split PDF Online Free - Extract Pages from PDF Without Watermark | Pine Tools Hub"
        description="Split PDF files online for free without watermark. Extract specific pages, divide PDF documents into multiple files instantly. Best free PDF splitter - no registration, works on mobile and desktop."
        keywords="split pdf, separate pdf pages, extract pdf pages, divide pdf, pdf splitter online, split pdf free, split pdf without watermark, pdf page extractor, split pdf on mobile"
        canonical="https://pinetoolshub.com/split-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Split PDF Files Online Free"
          description="Extract pages or divide your PDF into multiple documents without watermark. The best free PDF splitter - fast, secure, and works on any device."
          icon={<Scissors className="h-8 w-8 text-primary" />}
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
                <p className="text-sm text-muted-foreground">{pageCount} pages</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={splitMode === "all" ? "default" : "outline"}
                    onClick={() => setSplitMode("all")}
                  >
                    Extract All Pages
                  </Button>
                  <Button
                    variant={splitMode === "range" ? "default" : "outline"}
                    onClick={() => setSplitMode("range")}
                  >
                    Custom Range
                  </Button>
                </div>

                {splitMode === "range" && (
                  <div className="space-y-2">
                    <Label htmlFor="pageRange">Page Range (e.g., 1-3, 5, 7-10)</Label>
                    <Input
                      id="pageRange"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder="1-3, 5, 7-10"
                    />
                  </div>
                )}
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Splitting PDF..." />
              ) : (
                <Button onClick={splitPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Split PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Online PDF Splitter - Extract Pages Without Watermark</h2>
            <p>
              Need to <strong>split a PDF into multiple files</strong> or extract specific pages? Pine Tools Hub's free PDF splitter makes it incredibly easy to divide your documents exactly the way you need them. Whether you're separating chapters from an ebook, extracting important pages from a report, or creating individual files from a multi-page document, our splitter handles it all without adding any watermark.
            </p>
            <p>
              Our PDF splitter works entirely in your browser, meaning your files stay private and secure. There's no need to upload sensitive documents to unknown servers - everything happens locally on your device for maximum privacy.
            </p>
            
            <h3>Key Features of Our Free PDF Splitter</h3>
            <ul>
              <li><strong>Extract All Pages:</strong> Split every page into its own individual PDF file with one click</li>
              <li><strong>Custom Page Ranges:</strong> Select specific pages or page ranges to extract (e.g., 1-5, 8, 10-15)</li>
              <li><strong>Batch Download:</strong> Get all split files in a convenient ZIP archive for easy organization</li>
              <li><strong>Quality Preserved:</strong> Original formatting, text, images, and resolution maintained perfectly</li>
              <li><strong>No Watermarks:</strong> Your split PDFs are completely clean with no branding added</li>
              <li><strong>Works on Mobile:</strong> Split PDFs on your phone without downloading any app</li>
              <li><strong>Free Forever:</strong> No subscription, no payment, no registration required</li>
            </ul>

            <h3>How to Split PDF Files - Step by Step Guide</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select your PDF document</li>
              <li><strong>Choose Split Method:</strong> Select "Extract all pages" for individual files, or "Custom range" for specific pages</li>
              <li><strong>Specify Pages (Optional):</strong> If using custom range, enter page numbers like "1-3, 5, 7-10"</li>
              <li><strong>Click Split PDF:</strong> Press the button to process your document</li>
              <li><strong>Download ZIP:</strong> Get your split files packaged in a convenient ZIP archive</li>
            </ol>

            <h3>Common Uses for PDF Splitting</h3>
            <ul>
              <li><strong>Extract Single Pages:</strong> Pull out specific pages from contracts, reports, or forms</li>
              <li><strong>Separate Chapters:</strong> Divide ebooks or manuals into individual chapters</li>
              <li><strong>Share Specific Sections:</strong> Send only relevant parts of a document to recipients</li>
              <li><strong>Reduce File Size:</strong> Create smaller files by removing unnecessary pages</li>
              <li><strong>Archive Individual Pages:</strong> Store important pages separately for easy access</li>
            </ul>

            <h3>Split PDF on Mobile - No App Required</h3>
            <p>
              Need to <strong>split a PDF on your mobile phone</strong>? Our tool works perfectly on Android and iPhone browsers. Simply visit Pine Tools Hub on your mobile device, upload your PDF, select your split options, and download the result. No app installation required - everything works directly in your browser.
            </p>
          </section>

          <FAQSection faqs={faqs} toolName="PDF Split" />
        </div>
      </div>
    </>
  );
};

export default SplitPdf;