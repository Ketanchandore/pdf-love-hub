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
import { Crop, Download } from "lucide-react";

const CropPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [margins, setMargins] = useState({ top: 20, right: 20, bottom: 20, left: 20 });
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

  const cropPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        
        page.setCropBox(
          margins.left,
          margins.bottom,
          width - margins.left - margins.right,
          height - margins.top - margins.bottom
        );
        
        setProgress(((i + 1) / pages.length) * 100);
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, `cropped-${file.name}`);

      setFile(null);
      setPageCount(0);
    } catch (error) {
      console.error("Error cropping PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I crop a PDF online free?",
      answer: "Upload your PDF to our free online crop tool, set the margin values for how much to remove from each edge (top, bottom, left, right), and click Crop PDF. All pages will be cropped uniformly and you can download the result instantly."
    },
    {
      question: "What do the margin values mean when cropping PDF?",
      answer: "The margin values specify how many points to remove from each edge of every page. Higher values mean more cropping. For reference, 72 points equals 1 inch, so entering 72 in any field removes one inch from that edge."
    },
    {
      question: "Will cropping PDF reduce the file size?",
      answer: "Cropping sets the visible area of your PDF but may not significantly reduce file size since the original content remains in the file. For file size reduction, use our Compress PDF tool after cropping."
    },
    {
      question: "Can I crop different pages differently in one PDF?",
      answer: "Currently, all pages in your PDF are cropped with the same margin settings. For page-specific cropping with different margins, extract individual pages first, crop them separately, then merge them back together."
    },
    {
      question: "Can I crop PDF on mobile phone?",
      answer: "Yes! Our crop PDF online tool works perfectly on smartphones and tablets. The responsive interface adapts to any screen size, making it easy to crop PDFs on iPhone, Android, and iPad devices."
    },
    {
      question: "Is cropping PDF the same as trimming margins?",
      answer: "Yes, cropping and trimming are the same operation. Both remove the specified amount from the edges of your PDF pages, eliminating unwanted whitespace, borders, or margins from your documents."
    },
    {
      question: "Will cropping affect the quality of my PDF content?",
      answer: "No, cropping is a lossless operation that only changes the visible area. All text, images, and formatting within the cropped area remain at their original quality with no degradation."
    },
    {
      question: "Is this crop PDF tool better than iLovePDF crop?",
      answer: "Our free PDF cropping tool offers complete privacy since all processing happens in your browser - your documents never get uploaded to external servers, unlike cloud-based alternatives like iLovePDF."
    }
  ];

  return (
    <>
      <SEOHead
        title="Crop PDF Online Free - Remove Margins & Trim Pages | Pine Tools Hub"
        description="Crop PDF pages online free without watermark. Remove unwanted margins, whitespace, and borders from PDF documents. Works on mobile, no registration required, 100% private."
        keywords="crop pdf online free, trim pdf margins, remove pdf whitespace, cut pdf edges, pdf cropper free, resize pdf pages, crop pdf no watermark, remove pdf borders, ilovepdf crop alternative"
        canonical="https://pinetoolshub.com/crop-pdf"
      />
      <ToolStructuredData
        toolName="Crop PDF Pages Online"
        toolDescription="Free online PDF cropping tool. Remove unwanted margins and whitespace from PDF documents - no watermark, no registration required."
        toolUrl="https://pinetoolshub.com/crop-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Crop PDF Pages Online Free"
          description="Remove unwanted margins, whitespace, and borders from your PDF documents. Free, no watermark, works on mobile & desktop."
          icon={<Crop className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} will be cropped
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Crop Margins (points - 72 points = 1 inch)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Top</label>
                    <Input
                      type="number"
                      value={margins.top}
                      onChange={(e) => setMargins({ ...margins, top: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Right</label>
                    <Input
                      type="number"
                      value={margins.right}
                      onChange={(e) => setMargins({ ...margins, right: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Bottom</label>
                    <Input
                      type="number"
                      value={margins.bottom}
                      onChange={(e) => setMargins({ ...margins, bottom: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Left</label>
                    <Input
                      type="number"
                      value={margins.left}
                      onChange={(e) => setMargins({ ...margins, left: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter 0 for no cropping on that edge. Common values: 36 (half inch), 72 (1 inch), 144 (2 inches).
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Cropping PDF..." />
              ) : (
                <Button onClick={cropPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Crop PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Cropping Tool - Remove Margins & Whitespace</h2>
            <p>
              Need to <strong>crop PDF pages online free</strong>? Pine Tools Hub's PDF cropping tool removes unwanted margins, whitespace, and borders from your documents instantly. Perfect for cleaning up scanned documents, removing excess borders, or standardizing page sizes across your PDF.
            </p>
            <p>
              Our <strong>free PDF cropper</strong> processes everything directly in your browser, keeping your documents completely private. There's no uploading to external servers, no waiting in queues, and no privacy concerns - ideal for sensitive business or personal documents.
            </p>

            <h3>How to Crop a PDF Online Free - Step by Step</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select the PDF you want to crop</li>
              <li><strong>Set Crop Margins:</strong> Enter how many points to remove from each edge (72 points = 1 inch)</li>
              <li><strong>Click Crop PDF:</strong> All pages are cropped uniformly with your settings</li>
              <li><strong>Download Result:</strong> Save your cropped PDF immediately to your device</li>
            </ol>

            <h3>Common Uses for PDF Cropping</h3>
            <ul>
              <li><strong>Scanned Documents:</strong> Remove scanner borders, shadows, and artifacts from scanned pages</li>
              <li><strong>Printing Preparation:</strong> Trim excess margins before printing to save paper</li>
              <li><strong>Document Standardization:</strong> Make all pages in a document consistent in size</li>
              <li><strong>eBook Formatting:</strong> Remove extra whitespace for better reading on mobile devices</li>
              <li><strong>Presentation Cleanup:</strong> Remove unwanted borders from PDF slides</li>
              <li><strong>Archive Digitization:</strong> Clean up old scanned documents and archives</li>
            </ul>

            <h3>Understanding Crop Margins (Points to Inches)</h3>
            <p>
              PDF measurements use points, where 72 points equals 1 inch. Here are common values for reference:
            </p>
            <ul>
              <li><strong>36 points:</strong> Half inch (0.5")</li>
              <li><strong>72 points:</strong> One inch (1")</li>
              <li><strong>108 points:</strong> One and a half inches (1.5")</li>
              <li><strong>144 points:</strong> Two inches (2")</li>
            </ul>

            <h3>Best Free PDF Crop Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF cropping alternative to iLovePDF</strong>? Pine Tools Hub offers superior privacy with browser-based processing. Your documents never leave your device, making our tool ideal for sensitive documents that shouldn't be uploaded to cloud servers.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default CropPdf;