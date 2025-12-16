import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const convertToWord = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n--- Page " + i + " ---\n\n";
        setProgress((i / totalPages) * 80);
      }

      // Create a simple HTML document that Word can open
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${file.name.replace(".pdf", "")}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
            p { margin-bottom: 12px; }
          </style>
        </head>
        <body>
          ${fullText.split("\n").map(line => `<p>${line}</p>`).join("")}
        </body>
        </html>
      `;

      setProgress(90);

      const blob = new Blob([htmlContent], { type: "application/msword" });
      saveAs(blob, file.name.replace(".pdf", ".doc"));

      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Error converting PDF to Word:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert PDF to Word online for free?",
      answer: "Simply upload your PDF file to our I Love PDF to Word converter, click 'Convert to Word', and download your editable DOC file. The entire process takes just seconds and is completely free."
    },
    {
      question: "Will my PDF formatting be preserved in Word?",
      answer: "Our converter extracts text content from your PDF and creates a clean Word document. Basic formatting is maintained, though complex layouts with multiple columns or intricate designs may require minor adjustments."
    },
    {
      question: "Can I edit the converted Word document?",
      answer: "Yes! The output is a fully editable Word document (.doc) that you can open in Microsoft Word, Google Docs, or any compatible word processor to make changes."
    },
    {
      question: "Is there a page limit for PDF to Word conversion?",
      answer: "There's no strict page limit. Since processing happens in your browser, the only limitation is your device's memory. Most documents up to 100 pages convert without issues."
    },
    {
      question: "Is my document secure during conversion?",
      answer: "Absolutely! All conversion happens locally in your browser. Your PDF file never leaves your device, ensuring complete privacy for sensitive documents."
    },
    {
      question: "What if my PDF contains images?",
      answer: "Our current converter focuses on text extraction. For PDFs with important images, consider using our PDF to JPG tool to extract images separately."
    }
  ];

  return (
    <>
      <SEOHead
        title="PDF to Word Converter Free Online - I Love PDF to Word | Pine Tools Hub"
        description="Convert PDF to Word documents online for free with our I Love PDF to Word converter. Transform PDFs into editable DOC files instantly. No registration, 100% secure."
        keywords="pdf to word, convert pdf to word, i love pdf to word, pdf to doc, pdf converter, pdf to word online free, pdf to docx"
        canonical="https://pinetoolshub.com/pdf-to-word"
      />

      <div className="py-12">
        <ToolHero
          title="PDF to Word Converter"
          description="Transform your PDF files into editable Word documents. I Love PDF to Word makes conversion quick and easy - completely free and secure."
          icon={<FileText className="h-8 w-8 text-primary" />}
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
                  Ready to convert to Word
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Converting to Word..." />
              ) : (
                <Button onClick={convertToWord} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert to Word
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF to Word Converter - I Love PDF to DOC Tool</h2>
            <p>
              Need to edit text in a PDF document? Pine Tools Hub's I Love PDF to Word converter transforms your static PDF files into fully editable Word documents in seconds. Whether you need to update a contract, revise a report, or extract content for reuse, our converter makes it simple.
            </p>
            <p>
              Unlike other online converters that upload your files to servers, our tool processes everything directly in your browser. This means your sensitive documents remain completely private - they never leave your device.
            </p>
            <h3>Benefits of Converting PDF to Word</h3>
            <ul>
              <li><strong>Edit Freely:</strong> Make changes to text, formatting, and layout</li>
              <li><strong>Copy Content:</strong> Extract text for use in other documents</li>
              <li><strong>Update Documents:</strong> Revise outdated information quickly</li>
              <li><strong>Collaborate Easier:</strong> Share editable files with team members</li>
              <li><strong>No Software Needed:</strong> Works directly in your web browser</li>
            </ul>
            <h3>How to Convert PDF to Word</h3>
            <ol>
              <li>Upload your PDF file using the upload area above</li>
              <li>Click "Convert to Word" to start the conversion</li>
              <li>Wait for processing to complete</li>
              <li>Download your editable Word document</li>
            </ol>
            <h3>Tips for Best Results</h3>
            <p>
              For optimal conversion results, use PDFs with clear, selectable text rather than scanned images. If your PDF is a scanned document, you may need OCR (Optical Character Recognition) software to convert the images to text first.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PdfToWord;
