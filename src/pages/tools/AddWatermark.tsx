import { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
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
          rotate: degrees(-45),
        });

        setProgress(30 + ((i + 1) / totalPages) * 60);
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
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
      question: "How do I add a watermark to PDF online for free?",
      answer: "Upload your PDF to our free PDF watermark tool, enter your watermark text (like CONFIDENTIAL, DRAFT, or your company name), and click 'Add Watermark'. Download your watermarked PDF instantly."
    },
    {
      question: "Can I customize the watermark text and appearance?",
      answer: "Yes! Enter any text you want as your watermark. The watermark is automatically positioned diagonally across each page with professional semi-transparent styling for optimal visibility."
    },
    {
      question: "Will the watermark appear on all PDF pages?",
      answer: "Yes, the watermark is applied to every page of your PDF document, ensuring consistent branding or protection throughout the entire document. No page is left unwatermarked."
    },
    {
      question: "Can I add an image or logo watermark to PDF?",
      answer: "Currently, our tool supports text watermarks which are highly effective for copyright protection, confidentiality notices, draft marking, and branding purposes. Text watermarks load faster and display consistently."
    },
    {
      question: "Can I remove a watermark from PDF later?",
      answer: "Watermarks added by our tool become part of the PDF content. To remove them, you would need the original unwatermarked file. Always keep a backup of your original documents before watermarking."
    },
    {
      question: "Is adding watermark to PDF secure and private?",
      answer: "100% secure and private! All watermark processing happens locally in your browser. Your PDF files never leave your device or get uploaded to any server."
    },
    {
      question: "How to add watermark to PDF on mobile phone?",
      answer: "Our PDF watermark tool works perfectly on mobile devices. Upload your PDF from your phone, enter watermark text, and download the watermarked PDF. Works on iPhone, Android, and all mobile browsers."
    },
    {
      question: "What are common uses for PDF watermarks?",
      answer: "PDF watermarks are commonly used for marking documents as CONFIDENTIAL, DRAFT, or SAMPLE. They are also used for copyright protection, company branding, and preventing unauthorized distribution."
    }
  ];

  return (
    <>
      <SEOHead
        title="Add Watermark to PDF Free Online - Stamp PDF Documents | Pine Tools Hub"
        description="Add watermark to PDF files online for free. Stamp PDF documents with custom text like CONFIDENTIAL, DRAFT, or your company name. No registration, works on mobile."
        keywords="add watermark pdf, pdf watermark, watermark pdf online, stamp pdf, pdf watermark tool, add text to pdf, pdf stamp tool, watermark pdf free, mark pdf confidential, brand pdf"
        canonical="https://pinetoolshub.com/add-watermark"
      />

      <div className="py-12">
        <ToolHero
          title="Add Watermark to PDF - Free Online"
          description="Stamp PDF documents with custom text watermarks like CONFIDENTIAL or your brand name. Free PDF watermark tool - works on desktop and mobile devices."
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
