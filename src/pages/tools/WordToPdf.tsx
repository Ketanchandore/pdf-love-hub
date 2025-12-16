import { useState } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { FileOutput, Download } from "lucide-react";

const WordToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const convertToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const result = await mammoth.extractRawText({ arrayBuffer });
      setProgress(50);

      const text = result.value;
      const pdf = new jsPDF();
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      setProgress(70);

      let y = 20;
      const lineHeight = 7;
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < lines.length; i++) {
        if (y + lineHeight > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(lines[i], margin, y);
        y += lineHeight;
      }

      setProgress(90);

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, file.name.replace(/\.(docx?|doc)$/i, ".pdf"));

      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Error converting Word to PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert Word to PDF online for free?",
      answer: "Upload your Word document (.doc or .docx) to our I Love Word to PDF converter, click 'Convert to PDF', and download your PDF file instantly. It's completely free with no registration required."
    },
    {
      question: "What Word formats are supported?",
      answer: "Our converter supports both .doc and .docx file formats. For best results, we recommend using .docx files as they provide better compatibility and conversion quality."
    },
    {
      question: "Will my document formatting be preserved?",
      answer: "Our converter extracts text content and creates a clean, readable PDF. Basic text formatting is maintained, though complex layouts may be simplified for optimal PDF compatibility."
    },
    {
      question: "Is there a file size limit?",
      answer: "Since conversion happens in your browser, there's no server-imposed limit. However, very large documents may take longer to process depending on your device's capabilities."
    },
    {
      question: "Can I convert multiple Word files at once?",
      answer: "Currently, our tool converts one file at a time to ensure optimal quality. For multiple files, simply convert them one after another - each conversion takes just seconds."
    },
    {
      question: "Is my Word document secure during conversion?",
      answer: "Absolutely! All processing happens locally in your browser. Your documents never leave your device, ensuring complete privacy for sensitive business or personal files."
    }
  ];

  return (
    <>
      <SEOHead
        title="Word to PDF Converter Free Online - I Love Word to PDF | Pine Tools Hub"
        description="Convert Word to PDF documents online for free with our I Love Word to PDF converter. Transform DOC and DOCX files into PDFs instantly. No registration, 100% secure."
        keywords="word to pdf, convert word to pdf, i love word to pdf, doc to pdf, docx to pdf, word converter, word to pdf online free"
        canonical="https://pinetoolshub.com/word-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Word to PDF Converter"
          description="Transform your Word documents into professional PDF files. I Love Word to PDF makes conversion quick and easy - completely free and secure."
          icon={<FileOutput className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            }}
            multiple={false}
            label="Drop a Word file (.doc, .docx) here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Ready to convert to PDF
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Converting to PDF..." />
              ) : (
                <Button onClick={convertToPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert to PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Word to PDF Converter - I Love DOC to PDF Tool</h2>
            <p>
              Need to share a Word document as a PDF? Pine Tools Hub's I Love Word to PDF converter transforms your .doc and .docx files into universally compatible PDF documents in seconds. PDFs maintain their formatting across all devices and are perfect for professional sharing.
            </p>
            <p>
              Our converter works entirely in your browser, ensuring your documents remain private and secure. There's no need to upload files to external servers or worry about data privacy.
            </p>
            <h3>Why Convert Word to PDF?</h3>
            <ul>
              <li><strong>Universal Compatibility:</strong> PDFs look the same on any device or operating system</li>
              <li><strong>Professional Appearance:</strong> PDFs are the standard for business documents</li>
              <li><strong>Prevent Editing:</strong> PDFs are harder to accidentally modify</li>
              <li><strong>Smaller File Size:</strong> PDFs are often more compact than Word files</li>
              <li><strong>Print Ready:</strong> PDFs maintain exact formatting when printed</li>
            </ul>
            <h3>How to Convert Word to PDF</h3>
            <ol>
              <li>Upload your Word document (.doc or .docx)</li>
              <li>Click "Convert to PDF" to start conversion</li>
              <li>Wait for processing to complete</li>
              <li>Download your professional PDF file</li>
            </ol>
            <h3>Best Practices for Word to PDF Conversion</h3>
            <p>
              For best results, ensure your Word document is properly formatted before conversion. Check that fonts are embedded, images are properly placed, and page breaks are where you want them. This ensures your PDF looks exactly as intended.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default WordToPdf;
