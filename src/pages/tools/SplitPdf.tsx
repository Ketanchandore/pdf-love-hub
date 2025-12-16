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
      question: "How do I split a PDF into separate pages?",
      answer: "Upload your PDF to our I Love PDF Split tool, select 'Extract all pages' to split into individual pages, then click 'Split PDF'. Each page will be saved as a separate PDF file in a convenient ZIP download."
    },
    {
      question: "Can I extract specific pages from a PDF?",
      answer: "Yes! Use the 'Custom range' option to specify exactly which pages you want to extract. Enter page numbers like '1, 3, 5-10' to extract those specific pages."
    },
    {
      question: "Is my PDF safe when splitting online?",
      answer: "Absolutely! Our PDF splitter processes files entirely in your browser. Your documents never leave your device, ensuring complete privacy and security."
    },
    {
      question: "What's the maximum PDF size I can split?",
      answer: "Since processing happens locally in your browser, there's no server limit. Large files may take longer depending on your device, but typically files up to 100MB work smoothly."
    },
    {
      question: "Can I split a password-protected PDF?",
      answer: "You'll need to unlock the PDF first using our Unlock PDF tool, then you can split it. Password protection prevents modification without authorization."
    },
    {
      question: "How do I download split PDF pages?",
      answer: "After splitting, all extracted pages are packaged into a single ZIP file for easy download. Simply click the download button and extract the ZIP to access your individual PDF files."
    }
  ];

  return (
    <>
      <SEOHead
        title="Split PDF Online Free - I Love PDF Split Tool | Pine Tools Hub"
        description="Split PDF files online for free with our I Love PDF Split tool. Extract pages, divide documents, and separate PDFs instantly. No registration required, 100% secure."
        keywords="split pdf, separate pdf pages, i love pdf split, extract pdf pages, divide pdf, pdf splitter online, split pdf free"
        canonical="https://pinetoolshub.com/split-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Split PDF Files"
          description="Extract pages or divide your PDF into multiple documents. I Love PDF Split makes it easy to separate your files - completely free and secure."
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
            <h2>Free Online PDF Splitter - I Love PDF Split Tool</h2>
            <p>
              Need to split a PDF into multiple files or extract specific pages? Pine Tools Hub's I Love PDF Split tool makes it incredibly easy to divide your documents exactly the way you need them. Whether you're separating chapters from an ebook, extracting important pages from a report, or creating individual files from a multi-page document, our splitter handles it all.
            </p>
            <p>
              Our PDF splitter works entirely in your browser, meaning your files stay private and secure. There's no need to upload sensitive documents to unknown servers - everything happens locally on your device.
            </p>
            <h3>Key Features of Our PDF Splitter</h3>
            <ul>
              <li><strong>Extract All Pages:</strong> Split every page into its own PDF file</li>
              <li><strong>Custom Ranges:</strong> Select specific pages or page ranges to extract</li>
              <li><strong>Batch Download:</strong> Get all split files in a convenient ZIP archive</li>
              <li><strong>Quality Preserved:</strong> Original formatting and resolution maintained</li>
              <li><strong>No Watermarks:</strong> Your split PDFs are completely clean</li>
              <li><strong>Free Forever:</strong> No subscription or payment required</li>
            </ul>
            <h3>How to Split PDF Files</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Choose to extract all pages or specify custom ranges</li>
              <li>Click "Split PDF" to process</li>
              <li>Download your split files as a ZIP archive</li>
            </ol>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default SplitPdf;
