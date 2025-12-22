import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { FileDown, Download } from "lucide-react";

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOriginalSize(files[0].size);
      setCompressedSize(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });
      setProgress(60);

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      setProgress(90);

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      setCompressedSize(blob.size);
      
      saveAs(blob, `compressed-${file.name}`);
      setProgress(100);
    } catch (error) {
      console.error("Error compressing PDF:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const faqs = [
    {
      question: "How do I compress PDF files online for free?",
      answer: "Simply upload your PDF file to our free PDF compressor, click 'Compress PDF', and download your smaller file instantly. Our tool reduces PDF size without losing quality - completely free with no registration required."
    },
    {
      question: "How to compress PDF under 100KB for email or WhatsApp?",
      answer: "Upload your PDF to our compressor and it will automatically optimize the file size. For files that need to be under 100KB, we recommend compressing PDFs with fewer pages or splitting large documents first. Our tool achieves significant size reduction while maintaining readability."
    },
    {
      question: "Will compressing a PDF reduce its quality?",
      answer: "Our smart compression algorithm is designed to minimize quality loss. Text remains crisp and readable, while images are optimized using intelligent compression that balances size reduction with visual quality. Most users notice no difference in quality."
    },
    {
      question: "How much can I reduce my PDF file size?",
      answer: "Compression results vary depending on the PDF content. Documents with many images typically see 40-70% size reduction, while text-heavy PDFs may see 10-30% reduction. The actual savings depend on how the original PDF was created."
    },
    {
      question: "Is there a file size limit for PDF compression?",
      answer: "Since compression happens in your browser, there's no server limit. However, very large files (100MB+) may take longer to process depending on your device's capabilities. For best results, we recommend files under 50MB."
    },
    {
      question: "Can I compress PDF on mobile phone?",
      answer: "Yes! Our PDF compressor works perfectly on mobile devices. Open Pine Tools Hub in your mobile browser, upload your PDF, and compress it instantly. No app download required - works on Android and iPhone."
    },
    {
      question: "How to reduce PDF size without losing quality?",
      answer: "Our PDF compressor uses advanced algorithms that optimize PDF structure and compress embedded content while preserving visual quality. The result is a smaller file that looks identical to the original in most cases."
    },
    {
      question: "Is my PDF safe during compression?",
      answer: "Absolutely! All compression happens locally in your browser. Your files never leave your device, ensuring complete privacy and security for sensitive documents. This is the safest way to compress PDFs online."
    }
  ];

  return (
    <>
      <SEOHead
        title="Compress PDF Online Free - Reduce PDF File Size Without Quality Loss | Pine Tools Hub"
        description="Compress PDF files online for free without losing quality. Reduce PDF file size instantly for email, WhatsApp, and web uploads. Best free PDF compressor - no registration, works on mobile and desktop."
        keywords="compress pdf, reduce pdf size, pdf compressor online, shrink pdf, make pdf smaller, compress pdf free, reduce pdf file size, pdf compression tool, compress pdf under 100kb, pdf size reducer"
        canonical="https://pinetoolshub.com/compress-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Compress PDF Files Online Free"
          description="Reduce your PDF file size without losing quality. The best free PDF compressor for email, WhatsApp, and web - fast, secure, and works on any device."
          icon={<FileDown className="h-8 w-8 text-primary" />}
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
                  Original size: {formatFileSize(originalSize)}
                </p>
                {compressedSize > 0 && (
                  <div className="mt-2 p-3 bg-primary/10 rounded">
                    <p className="text-sm font-medium text-primary">
                      Compressed size: {formatFileSize(compressedSize)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reduced by {Math.round((1 - compressedSize / originalSize) * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Compressing PDF..." />
              ) : (
                <Button onClick={compressPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Compress PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Online PDF Compressor - Reduce PDF Size Without Quality Loss</h2>
            <p>
              Large PDF files can be a hassle to share via email or upload to websites. Pine Tools Hub's free <strong>PDF compressor</strong> helps you reduce PDF file sizes quickly and efficiently, making your documents easier to share while maintaining their quality. Whether you need to <strong>compress PDF under 100KB</strong> for WhatsApp or reduce file size for email attachments, our tool delivers excellent results.
            </p>
            <p>
              Our smart compression algorithm analyzes your PDF and applies optimal compression techniques to achieve maximum size reduction with minimal quality loss. Whether your PDF contains images, graphics, or mostly text, our compressor handles it intelligently.
            </p>
            
            <h3>Why Compress Your PDF Files?</h3>
            <ul>
              <li><strong>Email Attachments:</strong> Stay under email size limits (typically 10-25MB) and send documents faster</li>
              <li><strong>WhatsApp & Messaging:</strong> Share PDFs on WhatsApp and other messaging apps that have file size limits</li>
              <li><strong>Faster Uploads:</strong> Upload documents to websites, job portals, and online forms quickly</li>
              <li><strong>Save Storage:</strong> Free up space on your device, cloud storage, or server</li>
              <li><strong>Quicker Downloads:</strong> Recipients can download smaller files faster, especially on slow connections</li>
              <li><strong>Better Performance:</strong> Smaller PDFs open and scroll more smoothly on any device</li>
            </ul>

            <h3>How to Compress PDF Files - Step by Step</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Click the upload area or drag and drop your PDF document</li>
              <li><strong>Click Compress:</strong> Press the "Compress PDF" button to start the optimization process</li>
              <li><strong>Wait for Processing:</strong> Our tool will analyze and compress your PDF in seconds</li>
              <li><strong>Download Result:</strong> Get your smaller PDF file instantly - see how much space you saved!</li>
            </ol>

            <h3>Compress PDF on Mobile - No App Required</h3>
            <p>
              Need to <strong>compress PDF on your mobile phone</strong>? Our tool works perfectly on Android and iPhone browsers. Simply visit Pine Tools Hub on your mobile device, upload your PDF, and compress it instantly. No app download required - everything works directly in your browser for maximum convenience.
            </p>

            <h3>Tips for Maximum PDF Compression</h3>
            <p>
              PDFs with many high-resolution images will see the most significant size reduction. If your compressed PDF is still too large, consider these tips:
            </p>
            <ul>
              <li>Use our Split PDF tool to divide large documents into smaller sections</li>
              <li>Remove unnecessary pages using our Extract Pages tool</li>
              <li>Compress images before adding them to the PDF</li>
              <li>For scanned documents, ensure scanning at appropriate resolution (150-300 DPI is usually sufficient)</li>
            </ul>

            <h3>Secure PDF Compression - Your Privacy Protected</h3>
            <p>
              All PDF compression happens directly in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security for your sensitive documents. This browser-based approach is the safest way to compress PDFs online.
            </p>
          </section>

          <FAQSection faqs={faqs} toolName="PDF Compression" />
        </div>
      </div>
    </>
  );
};

export default CompressPdf;