import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { RotateCw, Download } from "lucide-react";

const RotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
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

  const rotatePdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setProgress(30);

      const pages = pdf.getPages();
      pages.forEach((page) => {
        page.setRotation(degrees(page.getRotation().angle + rotation));
      });
      setProgress(70);

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `rotated-${file.name}`);

      setProgress(100);
      setFile(null);
      setPageCount(0);
    } catch (error) {
      console.error("Error rotating PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I rotate a PDF online for free?",
      answer: "Upload your PDF to our I Love PDF Rotate tool, select your rotation angle (90°, 180°, or 270°), and click 'Rotate PDF'. Your rotated document will be ready to download instantly."
    },
    {
      question: "Can I rotate specific pages in a PDF?",
      answer: "Currently, our tool rotates all pages in the PDF by the same angle. For selective page rotation, use our Organize PDF tool which offers more granular control."
    },
    {
      question: "What rotation angles are available?",
      answer: "You can rotate pages by 90° (clockwise), 180° (upside down), or 270° (counter-clockwise). Choose the angle that best fixes your document orientation."
    },
    {
      question: "Will rotating affect my PDF quality?",
      answer: "No, rotation is a lossless operation. Your text, images, and formatting remain exactly the same - only the page orientation changes."
    },
    {
      question: "Can I rotate a scanned PDF document?",
      answer: "Yes! Our rotate tool works with any PDF, including scanned documents. It's perfect for fixing the orientation of incorrectly scanned pages."
    },
    {
      question: "Is my PDF secure during rotation?",
      answer: "Absolutely! All processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    }
  ];

  return (
    <>
      <SEOHead
        title="Rotate PDF Online Free - I Love PDF Rotate Tool | Pine Tools Hub"
        description="Rotate PDF pages online for free with our I Love PDF Rotate tool. Fix document orientation by rotating pages 90°, 180°, or 270°. No registration, 100% secure."
        keywords="rotate pdf, turn pdf pages, i love pdf rotate, pdf rotation tool, fix pdf orientation, rotate pdf online free, rotate pdf pages"
        canonical="https://pinetoolshub.com/rotate-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Rotate PDF Pages"
          description="Fix the orientation of your PDF pages by rotating them. I Love PDF Rotate makes it quick and easy - completely free and secure."
          icon={<RotateCw className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} will be rotated
                </p>
              </div>

              <div className="space-y-4">
                <p className="font-medium">Rotation Angle:</p>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    variant={rotation === 90 ? "default" : "outline"}
                    onClick={() => setRotation(90)}
                    className="flex items-center gap-2"
                  >
                    <RotateCw className="h-4 w-4" />
                    90° Clockwise
                  </Button>
                  <Button
                    variant={rotation === 180 ? "default" : "outline"}
                    onClick={() => setRotation(180)}
                  >
                    180°
                  </Button>
                  <Button
                    variant={rotation === 270 ? "default" : "outline"}
                    onClick={() => setRotation(270)}
                    className="flex items-center gap-2"
                  >
                    270° Counter-clockwise
                  </Button>
                </div>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Rotating PDF..." />
              ) : (
                <Button onClick={rotatePdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Rotate PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Online PDF Rotator - I Love PDF Rotate Tool</h2>
            <p>
              Got a PDF with pages in the wrong orientation? Pine Tools Hub's I Love PDF Rotate tool lets you quickly fix document orientation with just a few clicks. Whether your pages are sideways, upside down, or need fine-tuning, our rotator handles it effortlessly.
            </p>
            <p>
              Our PDF rotation tool processes everything in your browser, keeping your documents completely private. There's no uploading to servers, no waiting in queues, and no privacy concerns.
            </p>
            <h3>Common Reasons to Rotate PDFs</h3>
            <ul>
              <li><strong>Scanned Documents:</strong> Fix pages scanned in the wrong orientation</li>
              <li><strong>Mobile Scans:</strong> Correct PDFs created from phone cameras</li>
              <li><strong>Mixed Orientation:</strong> Standardize landscape and portrait pages</li>
              <li><strong>Presentation Prep:</strong> Ensure all slides display correctly</li>
              <li><strong>Print Ready:</strong> Fix orientation before printing</li>
            </ul>
            <h3>How to Rotate PDF Pages</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Select your desired rotation angle</li>
              <li>Click "Rotate PDF" to apply the rotation</li>
              <li>Download your corrected PDF file</li>
            </ol>
            <h3>Rotation Options Explained</h3>
            <p>
              <strong>90° Clockwise:</strong> Turns pages a quarter turn to the right - perfect for pages that are sideways.<br />
              <strong>180°:</strong> Flips pages upside down - ideal for documents that are completely inverted.<br />
              <strong>270° Counter-clockwise:</strong> Turns pages a quarter turn to the left - same as 90° but in the opposite direction.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default RotatePdf;
