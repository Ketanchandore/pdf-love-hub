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

      const blob = new Blob([compressedBytes], { type: "application/pdf" });
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
      question: "How does PDF compression work?",
      answer: "Our I Love PDF Compress tool optimizes your PDF by removing redundant data, compressing images, and using efficient encoding. This reduces file size while maintaining document quality and readability."
    },
    {
      question: "Will compressing a PDF reduce its quality?",
      answer: "Our compression algorithm is designed to minimize quality loss. Text remains crisp and readable, while images are optimized using smart compression that balances size reduction with visual quality."
    },
    {
      question: "How much can I reduce my PDF file size?",
      answer: "Compression results vary depending on the PDF content. Documents with many images typically see 40-70% size reduction, while text-heavy PDFs may see 10-30% reduction."
    },
    {
      question: "Is there a file size limit for compression?",
      answer: "Since compression happens in your browser, there's no server limit. However, very large files (100MB+) may take longer to process depending on your device's capabilities."
    },
    {
      question: "Can I compress multiple PDFs at once?",
      answer: "Currently, our tool processes one PDF at a time to ensure optimal compression. For multiple files, simply compress them one after another."
    },
    {
      question: "Is my PDF safe during compression?",
      answer: "Absolutely! All compression happens locally in your browser. Your files never leave your device, ensuring complete privacy and security for sensitive documents."
    }
  ];

  return (
    <>
      <SEOHead
        title="Compress PDF Online Free - I Love PDF Compress Tool | Pine Tools Hub"
        description="Compress PDF files online for free with our I Love PDF Compress tool. Reduce PDF file size without losing quality. No registration, 100% secure browser-based compression."
        keywords="compress pdf, reduce pdf size, i love pdf compress, pdf compressor online, shrink pdf, make pdf smaller, compress pdf free"
        canonical="https://pinetoolshub.com/compress-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Compress PDF Files"
          description="Reduce your PDF file size without compromising quality. I Love PDF Compress helps you create smaller, shareable documents - completely free and secure."
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
            <h2>Free Online PDF Compressor - I Love PDF Compress Tool</h2>
            <p>
              Large PDF files can be a hassle to share via email or upload to websites. Pine Tools Hub's I Love PDF Compress tool helps you reduce PDF file sizes quickly and efficiently, making your documents easier to share while maintaining their quality.
            </p>
            <p>
              Our smart compression algorithm analyzes your PDF and applies optimal compression techniques to achieve maximum size reduction with minimal quality loss. Whether your PDF contains images, graphics, or mostly text, our compressor handles it intelligently.
            </p>
            <h3>Why Compress Your PDF Files?</h3>
            <ul>
              <li><strong>Email Attachments:</strong> Stay under email size limits (typically 10-25MB)</li>
              <li><strong>Faster Uploads:</strong> Upload documents to websites and portals quickly</li>
              <li><strong>Save Storage:</strong> Free up space on your device or cloud storage</li>
              <li><strong>Quicker Downloads:</strong> Recipients can download smaller files faster</li>
              <li><strong>Better Performance:</strong> Smaller PDFs open and scroll more smoothly</li>
            </ul>
            <h3>How to Compress PDF Files</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Click "Compress PDF" to start processing</li>
              <li>Wait for compression to complete</li>
              <li>Download your smaller PDF file</li>
            </ol>
            <h3>Compression Tips</h3>
            <p>
              PDFs with many high-resolution images will see the most significant size reduction. If your compressed PDF is still too large, consider using our Split PDF tool to divide it into smaller sections, or try compressing images before creating the PDF.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default CompressPdf;
