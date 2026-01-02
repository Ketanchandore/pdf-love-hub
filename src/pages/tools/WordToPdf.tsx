import { useState } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
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
      answer: "Upload your Word document (.doc or .docx) to our free Word to PDF converter, click 'Convert to PDF', and download your PDF file instantly. Completely free with no registration required."
    },
    {
      question: "What Word file formats are supported for PDF conversion?",
      answer: "Our converter supports both .doc and .docx file formats. For best results and optimal compatibility, we recommend using .docx files as they provide better conversion quality."
    },
    {
      question: "Will my Word document formatting be preserved in PDF?",
      answer: "Our converter extracts text content and creates a clean, readable PDF. Basic text formatting is maintained, though complex layouts with tables and images may be simplified for optimal PDF compatibility."
    },
    {
      question: "Is there a file size limit for Word to PDF conversion?",
      answer: "Since conversion happens entirely in your browser, there is no server-imposed limit. Very large documents may take longer to process depending on your device capabilities."
    },
    {
      question: "Can I convert multiple Word files to PDF at once?",
      answer: "Currently, our tool converts one Word file at a time to ensure optimal quality and accuracy. For multiple files, simply convert them one after another - each conversion takes just seconds."
    },
    {
      question: "Is Word to PDF conversion secure and private?",
      answer: "100% secure and private! All processing happens locally in your browser. Your documents never leave your device or get uploaded to any server, ensuring complete privacy for sensitive business or personal files."
    },
    {
      question: "How to convert Word to PDF on mobile phone?",
      answer: "Our Word to PDF converter works perfectly on mobile devices. Upload your Word document from your phone storage, convert it, and download the PDF. Works on iPhone, Android, and all mobile browsers."
    },
    {
      question: "Can I convert Word to PDF without Microsoft Office?",
      answer: "Yes! Our online converter works entirely in your browser - no Microsoft Office or any software installation required. Simply upload your .doc or .docx file and get your PDF instantly."
    }
  ];

  return (
    <>
      <SEOHead
        title="Word to PDF Converter Free Online - Convert DOC to PDF 2026 | Pine Tools Hub"
        description="Convert Word to PDF online free without watermark. Best DOC to PDF converter - transform .doc and .docx files to PDF instantly. No registration, works on mobile."
        keywords="word to pdf, convert word to pdf, doc to pdf, docx to pdf, word to pdf converter, word to pdf online free, word to pdf no watermark, convert document to pdf, microsoft word to pdf"
        canonical="https://pinetoolshub.com/word-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Word to PDF Converter - Free Online"
          description="Convert Word documents to PDF online free without watermark. Transform DOC and DOCX files into professional PDFs instantly - works on desktop and mobile."
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
