import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Presentation, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PowerPointToPdf = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const faqs = [
    {
      question: "How do I convert PowerPoint to PDF online for free?",
      answer: "Upload your PPT or PPTX file to our I Love PDF PowerPoint converter. For full conversion, we recommend using Microsoft PowerPoint's built-in 'Save as PDF' feature or Google Slides for the best results."
    },
    {
      question: "Will my PowerPoint animations be preserved in PDF?",
      answer: "PDF is a static format, so animations and transitions won't be preserved. Each slide becomes a static page in the PDF document."
    },
    {
      question: "Can I convert PPTX files to PDF?",
      answer: "Yes! Both older PPT and newer PPTX PowerPoint formats can be converted to PDF. The output will be a standard PDF file viewable on any device."
    },
    {
      question: "Is my PowerPoint presentation secure during conversion?",
      answer: "We prioritize your privacy. For the most secure conversion, use offline tools like Microsoft PowerPoint or LibreOffice which process files entirely on your device."
    },
    {
      question: "What's the maximum file size for PowerPoint conversion?",
      answer: "For browser-based conversion, we recommend files under 50MB. Larger presentations with many images may take longer to process."
    },
    {
      question: "Can I convert multiple PowerPoint files at once?",
      answer: "Currently, our tool processes one presentation at a time. For batch conversion, consider using desktop software like Microsoft PowerPoint."
    }
  ];

  return (
    <>
      <SEOHead
        title="PowerPoint to PDF Converter Free Online - I Love PDF PPT to PDF | Pine Tools Hub"
        description="Convert PowerPoint to PDF online for free with our I Love PDF PPT converter. Transform PPTX presentations to PDF format. Best PowerPoint to PDF tool with complete privacy."
        keywords="powerpoint to pdf, ppt to pdf, convert pptx to pdf, i love pdf powerpoint, presentation to pdf, ppt converter, ilovepdf ppt, slides to pdf"
        canonical="https://pinetoolshub.com/powerpoint-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="PowerPoint to PDF Converter"
          description="Convert your PowerPoint presentations to PDF format. I Love PDF PPT converter helps you create shareable PDF documents - completely free and secure."
          icon={<Presentation className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ 
              "application/vnd.ms-powerpoint": [".ppt"],
              "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"]
            }}
            multiple={false}
            label="Drop a PowerPoint file here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  PowerPoint file selected
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For the best PowerPoint to PDF conversion with preserved formatting, we recommend:
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Microsoft PowerPoint: File → Save As → PDF</li>
                    <li>Google Slides: File → Download → PDF Document</li>
                    <li>LibreOffice Impress: File → Export as PDF</li>
                  </ul>
                  These methods ensure perfect conversion with all formatting intact.
                </AlertDescription>
              </Alert>

              <Button disabled className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Use Desktop App for Best Results
              </Button>
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PowerPoint to PDF Converter - I Love PDF PPT Tool</h2>
            <p>
              Need to convert your PowerPoint presentations to PDF? Pine Tools Hub's <strong>I Love PDF PowerPoint to PDF</strong> guide helps you create professional PDF documents from your PPTX and PPT files with perfect formatting preservation.
            </p>
            <p>
              While browser-based PowerPoint conversion has limitations with complex formatting, we provide the best methods to achieve perfect results using tools you already have.
            </p>
            <h3>Best Methods to Convert PowerPoint to PDF</h3>
            <ul>
              <li><strong>Microsoft PowerPoint:</strong> Open your presentation → File → Save As → Choose PDF format. This method preserves all formatting, fonts, and images perfectly.</li>
              <li><strong>Google Slides:</strong> Upload your PPTX to Google Drive → Open with Google Slides → File → Download → PDF Document. Great free option!</li>
              <li><strong>LibreOffice Impress:</strong> Free, open-source alternative that handles PPT to PDF conversion excellently.</li>
            </ul>
            <h3>Why Convert PowerPoint to PDF?</h3>
            <ul>
              <li><strong>Universal Viewing:</strong> PDFs open on any device without PowerPoint</li>
              <li><strong>Consistent Formatting:</strong> Your slides look the same everywhere</li>
              <li><strong>Smaller File Size:</strong> PDFs are often smaller than PPTX files</li>
              <li><strong>Print Ready:</strong> PDFs are ideal for professional printing</li>
              <li><strong>Secure Sharing:</strong> Recipients can't accidentally edit your content</li>
            </ul>
            <h3>I Love PDF PowerPoint Alternative</h3>
            <p>
              Looking for an <strong>I Love PDF PPT to PDF alternative</strong>? Pine Tools Hub offers comprehensive guides and tools for all your document conversion needs. While PowerPoint conversion works best with desktop applications, our other PDF tools like merge, split, and compress work entirely in your browser with complete privacy.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PowerPointToPdf;
