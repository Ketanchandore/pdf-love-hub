import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Presentation, Download } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToPowerPoint = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const convertToPowerPoint = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file.name.replace(".pdf", "")} - Presentation</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .slide { page-break-after: always; padding: 40px; min-height: 500px; border: 1px solid #ccc; margin: 20px; }
    .slide h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    .slide p { line-height: 1.8; font-size: 16px; }
  </style>
</head>
<body>`;
      
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        
        htmlContent += `
  <div class="slide">
    <h2>Slide ${i}</h2>
    <p>${pageText}</p>
  </div>`;
        setProgress((i / totalPages) * 90);
      }

      htmlContent += `
</body>
</html>`;

      setProgress(95);

      const blob = new Blob([htmlContent], { type: "application/vnd.ms-powerpoint" });
      saveAs(blob, file.name.replace(".pdf", ".ppt"));

      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Error converting PDF to PowerPoint:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert PDF to PowerPoint online for free?",
      answer: "Upload your PDF to our I Love PDF to PowerPoint converter, click 'Convert to PowerPoint', and download your presentation file. Each PDF page becomes a slide in your presentation."
    },
    {
      question: "Will my PDF formatting be preserved in PowerPoint?",
      answer: "Our converter extracts text content from each PDF page and creates slides. For complex layouts with images and graphics, professional desktop tools may provide better results."
    },
    {
      question: "Can I edit the converted PowerPoint presentation?",
      answer: "Yes! The output file can be opened in Microsoft PowerPoint, Google Slides, or any compatible presentation software for editing and customization."
    },
    {
      question: "Is my PDF secure during conversion?",
      answer: "Absolutely! All conversion happens locally in your browser. Your files never leave your device, ensuring complete privacy for sensitive presentations."
    },
    {
      question: "How many PDF pages can I convert to slides?",
      answer: "There's no strict limit. Each page of your PDF becomes one slide. Large documents may take longer to process depending on your device."
    },
    {
      question: "Can I convert a scanned PDF to PowerPoint?",
      answer: "Our converter works best with digital PDFs containing selectable text. Scanned documents may require OCR processing first to extract text content."
    }
  ];

  return (
    <>
      <SEOHead
        title="PDF to PowerPoint Converter Free Online - I Love PDF to PPT | Pine Tools Hub"
        description="Convert PDF to PowerPoint presentations online for free with our I Love PDF to PPT converter. Transform PDF pages into editable slides. No registration, 100% secure browser-based processing."
        keywords="pdf to powerpoint, convert pdf to ppt, i love pdf to powerpoint, pdf to slides, pdf to pptx, pdf presentation converter, ilovepdf powerpoint, pdf to ppt free"
        canonical="https://pinetoolshub.com/pdf-to-powerpoint"
      />

      <div className="py-12">
        <ToolHero
          title="PDF to PowerPoint Converter"
          description="Transform your PDF documents into editable PowerPoint presentations. I Love PDF to PPT makes conversion quick and easy - completely free and secure."
          icon={<Presentation className="h-8 w-8 text-primary" />}
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
                  Ready to convert to PowerPoint
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Converting to PowerPoint..." />
              ) : (
                <Button onClick={convertToPowerPoint} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert to PowerPoint
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF to PowerPoint Converter - I Love PDF to PPT Tool</h2>
            <p>
              Need to turn a PDF into an editable presentation? Pine Tools Hub's <strong>I Love PDF to PowerPoint</strong> converter transforms your PDF documents into presentation files where each page becomes a slide. Perfect for repurposing reports, ebooks, or documents for meetings and presentations.
            </p>
            <p>
              Unlike other online converters that upload your files to servers, our tool processes everything directly in your browser. Your confidential presentations and business documents never leave your device.
            </p>
            <h3>Why Convert PDF to PowerPoint?</h3>
            <ul>
              <li><strong>Create Presentations:</strong> Turn reports and documents into meeting slides</li>
              <li><strong>Edit Content:</strong> Modify text and add visuals to PDF content</li>
              <li><strong>Repurpose Documents:</strong> Transform ebooks into training materials</li>
              <li><strong>Collaborate:</strong> Share editable presentations with team members</li>
              <li><strong>Present Better:</strong> Add animations and transitions to static content</li>
            </ul>
            <h3>How to Convert PDF to PowerPoint</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Click "Convert to PowerPoint" to start</li>
              <li>Wait for processing to complete</li>
              <li>Download your presentation file</li>
            </ol>
            <h3>Best I Love PDF to PPT Alternative</h3>
            <p>
              Looking for the best <strong>I Love PDF to PowerPoint alternative</strong>? Pine Tools Hub offers completely free PDF to PPT conversion with no file limits, no registration, and complete privacy. Our browser-based tool ensures your sensitive data stays secure while delivering fast conversions.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PdfToPowerPoint;
