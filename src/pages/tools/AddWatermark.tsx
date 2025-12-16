import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stamp, Download } from "lucide-react";

const AddWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const addWatermark = async () => {
    if (!file || !watermarkText) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      setProgress(30);

      const pages = pdf.getPages();
      const totalPages = pages.length;

      for (let i = 0; i < totalPages; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) / 10;

        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * fontSize * 0.3),
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.75, 0.75, 0.75),
          opacity: 0.3,
          rotate: { type: "degrees" as const, angle: -45 },
        });

        setProgress(30 + ((i + 1) / totalPages) * 60);
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `watermarked-${file.name}`);

      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Error adding watermark:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I add a watermark to a PDF online?",
      answer: "Upload your PDF to our I Love PDF Watermark tool, enter your watermark text, and click 'Add Watermark'. Your watermarked document will be ready to download instantly."
    },
    {
      question: "Can I customize the watermark appearance?",
      answer: "Yes! You can enter any text you want as your watermark. The watermark is automatically positioned diagonally across each page with semi-transparent styling."
    },
    {
      question: "Will the watermark appear on all pages?",
      answer: "Yes, the watermark is applied to every page of your PDF document, ensuring consistent branding or protection throughout the entire document."
    },
    {
      question: "Can I add an image watermark?",
      answer: "Currently, our tool supports text watermarks. Text watermarks are highly effective for copyright protection, confidentiality notices, and branding purposes."
    },
    {
      question: "Can I remove a watermark later?",
      answer: "Watermarks added by our tool become part of the PDF. To remove them, you would need to use the original unwatermarked file. Always keep a backup of your original documents."
    },
    {
      question: "Is my PDF secure during watermarking?",
      answer: "Absolutely! All processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    }
  ];

  return (
    <>
      <SEOHead
        title="Add Watermark to PDF Free Online - I Love PDF Watermark | Pine Tools Hub"
        description="Add watermarks to PDF files online for free with our I Love PDF Watermark tool. Protect your documents with custom text watermarks. No registration, 100% secure."
        keywords="add watermark pdf, pdf watermark, i love pdf watermark, watermark pdf online, stamp pdf, protect pdf watermark, pdf watermark tool free"
        canonical="https://pinetoolshub.com/add-watermark"
      />

      <div className="py-12">
        <ToolHero
          title="Add Watermark to PDF"
          description="Protect your PDF documents with custom text watermarks. I Love PDF Watermark makes it quick and easy - completely free and secure."
          icon={<Stamp className="h-8 w-8 text-primary" />}
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
                  Ready to add watermark
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermarkText">Watermark Text</Label>
                <Input
                  id="watermarkText"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                />
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Adding watermark..." />
              ) : (
                <Button
                  onClick={addWatermark}
                  className="w-full"
                  size="lg"
                  disabled={!watermarkText}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Add Watermark
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Watermark Tool - I Love PDF Stamp</h2>
            <p>
              Need to protect your PDF documents or add branding? Pine Tools Hub's I Love PDF Watermark tool makes it easy to add professional text watermarks to your documents. Whether you're marking documents as confidential, adding copyright notices, or including your company name, our tool delivers clean, consistent results.
            </p>
            <p>
              Our watermark tool processes everything in your browser, keeping your sensitive documents completely private. There's no uploading to servers or waiting for processing - everything happens instantly on your device.
            </p>
            <h3>Why Add Watermarks to PDFs?</h3>
            <ul>
              <li><strong>Copyright Protection:</strong> Mark documents with ownership information</li>
              <li><strong>Confidentiality:</strong> Label sensitive documents appropriately</li>
              <li><strong>Branding:</strong> Add your company name to shared documents</li>
              <li><strong>Draft Marking:</strong> Clearly identify documents as drafts</li>
              <li><strong>Discourage Copying:</strong> Make unauthorized redistribution less appealing</li>
            </ul>
            <h3>How to Add Watermark to PDF</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Enter your desired watermark text</li>
              <li>Click "Add Watermark" to apply</li>
              <li>Download your watermarked PDF</li>
            </ol>
            <h3>Professional Watermark Styling</h3>
            <p>
              Our watermarks are professionally styled with semi-transparent text positioned diagonally across each page. This ensures the watermark is visible but doesn't interfere with reading the document content. The gray color and opacity are carefully chosen for optimal visibility without being obtrusive.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default AddWatermark;
