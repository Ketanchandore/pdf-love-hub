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
      answer: "Simply upload your PDF file to our free PDF to Word converter, click 'Convert to Word', and download your editable DOC file instantly. The entire process takes just seconds and is completely free with no registration required."
    },
    {
      question: "How to convert PDF to Word without losing formatting?",
      answer: "Our converter extracts text content from your PDF and creates a clean Word document. Basic formatting is maintained, including paragraphs and spacing. For PDFs with complex layouts, some minor adjustments may be needed after conversion."
    },
    {
      question: "Can I edit the converted Word document?",
      answer: "Yes! The output is a fully editable Word document (.doc) that you can open in Microsoft Word, Google Docs, LibreOffice, or any compatible word processor to make changes, add content, and reformat as needed."
    },
    {
      question: "How to convert PDF to Word on mobile phone?",
      answer: "Our PDF to Word converter works perfectly on mobile devices. Open Pine Tools Hub in your mobile browser, upload your PDF, and convert it instantly. No app download required - works on Android and iPhone."
    },
    {
      question: "Is there a page limit for PDF to Word conversion?",
      answer: "There's no strict page limit. Since processing happens in your browser, the only limitation is your device's memory. Most documents up to 100 pages convert without any issues."
    },
    {
      question: "Is my document secure during conversion?",
      answer: "Absolutely! All conversion happens locally in your browser. Your PDF file never leaves your device, ensuring complete privacy for sensitive business or personal documents."
    },
    {
      question: "What if my PDF contains images?",
      answer: "Our current converter focuses on text extraction for optimal quality. For PDFs with important images, you can also use our PDF to JPG tool to extract images separately, or use our PDF to PNG converter for lossless quality."
    },
    {
      question: "Can I convert scanned PDF to Word?",
      answer: "Scanned PDFs contain images rather than text, so text extraction may be limited. For scanned documents, consider using OCR software first, or use our tool for PDFs with selectable text for best results."
    }
  ];

  return (
    <>
      <SEOHead
        title="PDF to Word Converter Free Online - Convert PDF to DOC Without Watermark | Pine Tools Hub"
        description="Convert PDF to Word documents online for free without watermark. Transform PDFs into editable DOC files instantly. Best free PDF to Word converter - no registration, works on mobile and desktop."
        keywords="pdf to word, convert pdf to word, pdf to doc, pdf to docx, pdf converter, pdf to word online free, pdf to word without watermark, convert pdf to editable word, pdf to word on mobile"
        canonical="https://pinetoolshub.com/pdf-to-word"
      />

      <div className="py-12">
        <ToolHero
          title="PDF to Word Converter Free Online"
          description="Transform your PDF files into editable Word documents without watermark. The best free PDF to Word converter - fast, secure, and works on any device."
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
            <h2>Free PDF to Word Converter - Transform PDFs to Editable Documents</h2>
            <p>
              Need to edit text in a PDF document? Pine Tools Hub's free <strong>PDF to Word converter</strong> transforms your static PDF files into fully editable Word documents in seconds. Whether you need to update a contract, revise a report, or extract content for reuse, our converter makes it simple and completely free.
            </p>
            <p>
              Unlike other online converters that upload your files to servers, our tool processes everything directly in your browser. This means your sensitive documents remain completely private - they never leave your device. This is the safest and most secure way to <strong>convert PDF to Word online</strong>.
            </p>
            
            <h3>Benefits of Converting PDF to Word</h3>
            <ul>
              <li><strong>Edit Text Freely:</strong> Make changes to text, formatting, and layout in any word processor</li>
              <li><strong>Copy Content Easily:</strong> Extract text and content for use in other documents</li>
              <li><strong>Update Documents:</strong> Revise outdated information quickly without recreating the entire document</li>
              <li><strong>Collaborate Better:</strong> Share editable files with team members for collaborative editing</li>
              <li><strong>No Software Needed:</strong> Works directly in your web browser on any device</li>
              <li><strong>Works on Mobile:</strong> Convert PDFs on your phone without downloading any app</li>
            </ul>

            <h3>How to Convert PDF to Word - Step by Step</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Click the upload area or drag and drop your PDF file</li>
              <li><strong>Click Convert:</strong> Press the "Convert to Word" button to start the conversion</li>
              <li><strong>Wait for Processing:</strong> Our tool will extract text and format your Word document</li>
              <li><strong>Download Result:</strong> Get your editable Word document (.doc) instantly</li>
            </ol>

            <h3>Convert PDF to Word on Mobile</h3>
            <p>
              Need to <strong>convert PDF to Word on your mobile phone</strong>? Our converter works perfectly on Android and iPhone browsers. Simply visit Pine Tools Hub on your mobile device, upload your PDF, and convert it instantly. No app download required - everything works directly in your browser for maximum convenience.
            </p>

            <h3>Tips for Best PDF to Word Conversion Results</h3>
            <p>
              For optimal conversion results, follow these tips:
            </p>
            <ul>
              <li>Use PDFs with clear, selectable text rather than scanned images</li>
              <li>Simple layouts convert better than complex multi-column designs</li>
              <li>Check that fonts are embedded properly in the original PDF</li>
              <li>For scanned documents, use OCR software first to make text selectable</li>
              <li>After conversion, review the Word document and make any necessary formatting adjustments</li>
            </ul>

            <h3>Secure PDF to Word Conversion</h3>
            <p>
              All PDF to Word conversion happens directly in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security for your sensitive documents. This browser-based approach is the safest way to convert PDFs online.
            </p>
          </section>

          <FAQSection faqs={faqs} toolName="PDF to Word" />
        </div>
      </div>
    </>
  );
};

export default PdfToWord;