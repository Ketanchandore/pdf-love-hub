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
        
        // Set crop box (mediaBox minus margins)
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
      question: "How do I crop a PDF?",
      answer: "Upload your PDF, set the margin values for how much to crop from each edge, and click Crop PDF. All pages will be cropped uniformly."
    },
    {
      question: "What do the margin values mean?",
      answer: "The margin values specify how many points to remove from each edge of the page. Higher values mean more cropping."
    },
    {
      question: "Will cropping reduce file size?",
      answer: "Cropping sets the visible area but may not significantly reduce file size as the original content is still in the file."
    },
    {
      question: "Can I crop different pages differently?",
      answer: "Currently, all pages are cropped with the same margins. For page-specific cropping, process pages separately."
    }
  ];

  return (
    <>
      <SEOHead
        title="Crop PDF Free Online - I Love PDF Crop Tool | Pine Tools Hub"
        description="Crop PDF pages online for free. Remove unwanted margins and whitespace from PDF documents. I Love PDF style tool with complete privacy."
        keywords="crop pdf, pdf cropper, trim pdf margins, i love pdf crop, remove pdf whitespace, cut pdf edges free"
        canonical="https://pinetoolshub.com/crop-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Crop PDF Pages"
          description="Remove unwanted margins and whitespace from your PDF. I Love PDF style tool - fast, free, and private."
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
                <label className="text-sm font-medium">Crop Margins (points)</label>
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
                  1 inch = 72 points. Enter 0 for no cropping on that edge.
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
            <h2>Free PDF Cropping Tool - I Love PDF Style</h2>
            <p>
              Remove unwanted margins, whitespace, and edges from your PDF documents with Pine Tools Hub's crop tool. Perfect for cleaning up scanned documents or removing excess borders.
            </p>
            <h3>How to Crop a PDF</h3>
            <ol>
              <li>Upload your PDF file</li>
              <li>Set the margin values for each edge</li>
              <li>Click "Crop PDF" to apply the cropping</li>
              <li>Download your cropped document</li>
            </ol>
            <h3>Common Use Cases</h3>
            <ul>
              <li><strong>Scanned documents:</strong> Remove scanner borders and shadows</li>
              <li><strong>Printed margins:</strong> Trim excess white space from documents</li>
              <li><strong>Standardization:</strong> Make all pages consistent size</li>
            </ul>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default CropPdf;