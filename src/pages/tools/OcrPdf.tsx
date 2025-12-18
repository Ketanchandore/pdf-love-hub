import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { ScanText, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OcrPdf = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const faqs = [
    {
      question: "What is OCR PDF and how does it work?",
      answer: "OCR (Optical Character Recognition) scans images in your PDF and converts them to searchable, selectable text. It's essential for making scanned documents editable and searchable."
    },
    {
      question: "Can OCR convert handwritten text?",
      answer: "OCR works best with printed text. Handwritten text recognition is possible but accuracy varies greatly depending on handwriting clarity and style."
    },
    {
      question: "Will OCR preserve my PDF layout?",
      answer: "Modern OCR tries to preserve the original layout including columns, tables, and formatting. Complex layouts may require some manual adjustment after conversion."
    },
    {
      question: "What languages does OCR support?",
      answer: "Professional OCR tools support 100+ languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and many more."
    },
    {
      question: "Is OCR processing secure?",
      answer: "For maximum security with sensitive documents, we recommend using offline OCR tools that process files entirely on your device without internet upload."
    },
    {
      question: "How accurate is PDF OCR?",
      answer: "Modern OCR achieves 95-99% accuracy on clear, high-quality scans. Lower quality images or unusual fonts may reduce accuracy."
    }
  ];

  return (
    <>
      <SEOHead
        title="OCR PDF Online Free - I Love PDF OCR Scanner | Pine Tools Hub"
        description="OCR PDF files online for free with our I Love PDF OCR tool. Convert scanned documents to searchable, editable text. Best OCR PDF tool for extracting text from images."
        keywords="ocr pdf, pdf ocr online, i love pdf ocr, scan to text, convert scanned pdf, searchable pdf, text recognition, ilovepdf ocr, extract text from pdf"
        canonical="https://pinetoolshub.com/ocr-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="OCR PDF - Text Recognition"
          description="Convert scanned PDFs to searchable, editable documents. I Love PDF OCR extracts text from images - making your documents searchable and accessible."
          icon={<ScanText className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            label="Drop a scanned PDF here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Scanned PDF selected for OCR
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For best OCR results with scanned documents, we recommend these free tools:
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li><strong>Google Drive:</strong> Upload PDF → Right-click → Open with Google Docs (automatic OCR)</li>
                    <li><strong>Microsoft OneNote:</strong> Insert PDF image → Right-click → Copy Text from Picture</li>
                    <li><strong>Adobe Acrobat:</strong> Tools → Enhance Scans → Recognize Text</li>
                    <li><strong>Online-OCR.net:</strong> Free online OCR with good accuracy</li>
                  </ul>
                  These tools provide superior accuracy for text extraction from scanned documents.
                </AlertDescription>
              </Alert>

              <Button disabled className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Use Recommended Tools Above
              </Button>
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free OCR PDF Tool - I Love PDF Text Recognition</h2>
            <p>
              Have a scanned PDF that you need to edit or search? <strong>I Love PDF OCR</strong> technology converts images of text into actual, selectable text. This powerful feature transforms static scanned documents into fully searchable, editable files.
            </p>
            <p>
              OCR (Optical Character Recognition) analyzes the shapes of letters and numbers in your scanned PDF and converts them to digital text. This makes your documents searchable, allows text copying, and enables editing in word processors.
            </p>
            <h3>What is OCR and Why Do You Need It?</h3>
            <ul>
              <li><strong>Search Documents:</strong> Find specific text in scanned files instantly</li>
              <li><strong>Copy & Paste:</strong> Extract text from scanned pages for reuse</li>
              <li><strong>Edit Content:</strong> Modify scanned documents like regular text files</li>
              <li><strong>Accessibility:</strong> Make documents readable by screen readers</li>
              <li><strong>Archive Digitization:</strong> Convert paper archives to searchable digital files</li>
            </ul>
            <h3>Best Free OCR Methods</h3>
            <ol>
              <li><strong>Google Drive OCR:</strong> Upload your PDF to Google Drive, right-click and open with Google Docs. Google automatically performs OCR and you can copy the text.</li>
              <li><strong>Microsoft Office Lens:</strong> Free mobile app that scans documents and applies OCR automatically.</li>
              <li><strong>Tesseract OCR:</strong> Free, open-source OCR engine for advanced users.</li>
            </ol>
            <h3>I Love PDF OCR Alternative</h3>
            <p>
              Looking for the best <strong>I Love PDF OCR alternative</strong>? Pine Tools Hub provides guidance on the most accurate free OCR solutions. While browser-based OCR has limitations with complex documents, the tools we recommend deliver professional-quality text extraction from scanned PDFs.
            </p>
            <h3>Tips for Better OCR Results</h3>
            <ul>
              <li>Use high-resolution scans (300 DPI or higher)</li>
              <li>Ensure good contrast between text and background</li>
              <li>Straighten skewed pages before OCR processing</li>
              <li>Clean up any speckles or noise in scanned images</li>
              <li>Use consistent lighting when scanning documents</li>
            </ul>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default OcrPdf;
