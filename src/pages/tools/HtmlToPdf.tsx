import { useState } from "react";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Code, Download, Globe } from "lucide-react";

const HtmlToPdf = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const convertHtmlToPdf = async () => {
    if (!htmlContent.trim()) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      
      // Parse HTML and extract text
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlContent, "text/html");
      const textContent = htmlDoc.body.textContent || "";
      
      setProgress(30);
      
      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(textContent, maxWidth);
      
      setProgress(60);
      
      let y = 20;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.getHeight();
      
      for (let i = 0; i < lines.length; i++) {
        if (y + lineHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(lines[i], margin, y);
        y += lineHeight;
      }
      
      setProgress(90);
      
      const pdfBlob = doc.output("blob");
      saveAs(pdfBlob, "html-to-pdf.pdf");
      
      setProgress(100);
      setHtmlContent("");
    } catch (error) {
      console.error("Error converting HTML to PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert HTML to PDF?",
      answer: "Paste your HTML code into the text area and click 'Convert to PDF'. The content will be extracted and saved as a PDF document."
    },
    {
      question: "Does this preserve HTML formatting?",
      answer: "Basic text content is preserved. For complex layouts with images and CSS, the tool extracts readable text content."
    },
    {
      question: "Can I convert a webpage URL to PDF?",
      answer: "Due to browser security restrictions, direct URL conversion isn't possible. Copy the webpage content and paste it instead."
    },
    {
      question: "Is there a size limit?",
      answer: "There's no strict limit, but very large HTML documents may take longer to process. Most documents convert in seconds."
    }
  ];

  return (
    <>
      <SEOHead
        title="HTML to PDF Converter Free Online - I Love HTML to PDF | Pine Tools Hub"
        description="Convert HTML content to PDF documents online for free. Transform web content and HTML code into downloadable PDF files. I Love PDF style tool."
        keywords="html to pdf, convert html to pdf, webpage to pdf, i love html to pdf, html pdf converter free, web page to pdf online"
        canonical="https://pinetoolshub.com/html-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="HTML to PDF Converter"
          description="Convert HTML content to PDF documents. I Love PDF style tool - fast, free, and private."
          icon={<Code className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4" />
                HTML Content
              </label>
              <Textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Paste your HTML code here...&#10;&#10;Example:&#10;<h1>Hello World</h1>&#10;<p>This is a paragraph.</p>"
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            {htmlContent && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {htmlContent.length} characters ready to convert
                </p>
              </div>
            )}

            {isProcessing ? (
              <ProcessingStatus progress={progress} message="Converting to PDF..." />
            ) : (
              <Button 
                onClick={convertHtmlToPdf} 
                className="w-full" 
                size="lg"
                disabled={!htmlContent.trim()}
              >
                <Download className="mr-2 h-5 w-5" />
                Convert to PDF
              </Button>
            )}
          </div>

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free HTML to PDF Converter - I Love PDF Style Tool</h2>
            <p>
              Convert HTML content to PDF documents instantly with Pine Tools Hub. Perfect for saving web content, converting HTML emails, or archiving HTML documents.
            </p>
            <h3>How to Convert HTML to PDF</h3>
            <ol>
              <li>Paste your HTML code into the text area</li>
              <li>Click "Convert to PDF" button</li>
              <li>Download your PDF document</li>
            </ol>
            <h3>Use Cases</h3>
            <ul>
              <li><strong>Save web content:</strong> Archive important web pages as PDF</li>
              <li><strong>Convert emails:</strong> Save HTML emails as PDF documents</li>
              <li><strong>Create reports:</strong> Turn HTML templates into PDF reports</li>
              <li><strong>Documentation:</strong> Convert HTML docs to shareable PDFs</li>
            </ul>
            <h3>Privacy Guaranteed</h3>
            <p>
              All conversion happens locally in your browser. Your HTML content is never sent to any server, ensuring complete privacy and security.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default HtmlToPdf;