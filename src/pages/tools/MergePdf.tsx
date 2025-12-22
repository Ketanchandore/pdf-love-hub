import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Merge, Download, Trash2 } from "lucide-react";

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const fileBytes = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        setProgress(((i + 1) / files.length) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      saveAs(blob, "merged-document.pdf");

      setFiles([]);
    } catch (error) {
      console.error("Error merging PDFs:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I merge PDF files online for free without watermark?",
      answer: "Simply upload your PDF files to our free PDF merge tool, arrange them in your preferred order, and click 'Merge PDFs'. Your combined document will be ready to download instantly - completely free with no watermark and no registration required. This is the best way to combine multiple PDFs online."
    },
    {
      question: "Is it safe to merge PDF files using Pine Tools Hub?",
      answer: "Absolutely! All PDF processing happens directly in your browser using secure technology. Your files never leave your device or get uploaded to any server, ensuring complete privacy and security for your sensitive documents. This is the most secure way to merge PDF files online."
    },
    {
      question: "Can I merge more than two PDF files at once?",
      answer: "Yes! Our PDF merger tool allows you to combine unlimited PDF files in a single operation. Simply upload all the documents you want to merge and arrange them in your desired order. Whether you need to join 2 PDFs or 20 PDFs, our tool handles it easily."
    },
    {
      question: "Will the quality of my PDFs be affected after merging?",
      answer: "No, the quality remains exactly the same. Our PDF merge tool preserves all original formatting, images, fonts, and layouts when combining your documents. Your merged PDF will look exactly like the originals."
    },
    {
      question: "How can I merge PDF files on mobile phone?",
      answer: "Our PDF merger works perfectly on mobile devices. Simply open Pine Tools Hub in your mobile browser, upload your PDF files, and merge them instantly. No app download required - works on Android and iPhone mobile browsers."
    },
    {
      question: "What is the maximum file size for merging PDFs?",
      answer: "Since processing happens in your browser, there's no strict server limit. However, very large files (over 100MB each) may take longer to process depending on your device capabilities. For best results, we recommend files under 50MB each."
    },
    {
      question: "How to merge PDF files without software download?",
      answer: "Our online PDF merger requires no software installation. Simply visit Pine Tools Hub, upload your PDFs, and combine them directly in your browser. It works on any device with a modern web browser - Windows, Mac, Linux, or mobile."
    },
    {
      question: "Can I rearrange the order of PDF pages before merging?",
      answer: "Yes, you can easily drag and drop files to rearrange their order before merging. The final document will follow the sequence you specify. This makes it easy to organize your documents exactly how you want them."
    }
  ];

  return (
    <>
      <SEOHead
        title="Merge PDF Files Online Free - Combine Multiple PDFs Without Watermark | Pine Tools Hub"
        description="Merge PDF files online for free without watermark. Combine multiple PDF documents into one instantly. Best free PDF merger tool - no registration, no limits, 100% secure browser-based processing. Works on mobile and desktop."
        keywords="merge pdf, combine pdf, pdf merger online, join pdf files, merge pdf free, combine pdf online, merge pdf without watermark, pdf joiner, combine multiple pdfs, merge pdf files free online, how to merge pdf"
        canonical="https://pinetoolshub.com/merge-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Merge PDF Files Online Free"
          description="Combine multiple PDF documents into a single file without watermark. The best free PDF merger tool - fast, secure, and works on any device including mobile."
          icon={<Merge className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={true}
            maxFiles={20}
            label="Drop PDF files here or click to browse"
          />

          {files.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Merging PDF files..." />
              ) : (
                <Button
                  onClick={mergePdfs}
                  disabled={files.length < 2}
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Merge {files.length} PDFs
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Online PDF Merger - Combine PDF Files Without Watermark</h2>
            <p>
              Looking for a reliable way to <strong>merge PDF files online for free</strong>? Pine Tools Hub offers the best free PDF merger tool that lets you combine multiple PDF documents into a single file within seconds. Whether you're consolidating business reports, combining scanned documents, or joining multiple chapters of an ebook, our PDF merge tool handles it all with ease and without adding any watermark.
            </p>
            <p>
              Unlike other online PDF tools, our merger processes everything directly in your web browser. This means your sensitive documents never leave your computer, providing unmatched privacy and security. There's no need to upload files to external servers or worry about data breaches. This is the safest way to <strong>combine PDF files online</strong>.
            </p>
            
            <h3>Why Choose Our Free PDF Merge Tool?</h3>
            <ul>
              <li><strong>100% Free Without Watermark:</strong> No hidden costs, no watermarks added to your merged PDF, no premium features locked behind paywalls</li>
              <li><strong>No Registration Required:</strong> Start merging PDFs immediately without creating an account or signing up</li>
              <li><strong>Privacy First:</strong> All PDF processing happens locally in your browser - your files stay on your device</li>
              <li><strong>Unlimited PDF Merges:</strong> Combine as many PDF files as you need without any restrictions</li>
              <li><strong>Quality Preserved:</strong> Original formatting, images, fonts, and layouts remain intact after merging</li>
              <li><strong>Works on Mobile:</strong> Merge PDF files on your Android phone, iPhone, or tablet without downloading any app</li>
              <li><strong>Cross-Platform:</strong> Works perfectly on Windows, Mac, Linux, and all mobile devices</li>
            </ul>

            <h3>How to Merge PDF Files Online - Step by Step Guide</h3>
            <p>Follow these simple steps to combine multiple PDFs into one document:</p>
            <ol>
              <li><strong>Upload Your PDFs:</strong> Click the upload area or drag and drop your PDF files. You can add multiple files at once.</li>
              <li><strong>Arrange in Order:</strong> Rearrange the files in your preferred order. The merged PDF will follow this sequence.</li>
              <li><strong>Click Merge PDFs:</strong> Press the merge button to combine all your documents into one PDF file.</li>
              <li><strong>Download Instantly:</strong> Your merged document will download automatically - no waiting, no email required.</li>
            </ol>

            <h3>Best Uses for PDF Merging</h3>
            <p>Our free PDF merger is perfect for many common tasks:</p>
            <ul>
              <li><strong>Combining Business Documents:</strong> Merge contracts, reports, and proposals into comprehensive packages</li>
              <li><strong>Creating Complete Applications:</strong> Join multiple forms and supporting documents for job or college applications</li>
              <li><strong>Organizing Scanned Files:</strong> Combine multiple scanned pages into a single organized document</li>
              <li><strong>Building Ebooks:</strong> Join chapters and sections into complete digital books</li>
              <li><strong>Preparing Presentations:</strong> Merge multiple PDF presentations into one comprehensive deck</li>
            </ul>

            <h3>Merge PDF Files Without Software Installation</h3>
            <p>
              Our online PDF merger requires absolutely no software download or installation. Everything works directly in your web browser, making it the most convenient way to combine PDF files. Whether you're using a computer at work, your personal laptop, or even a borrowed device, you can merge PDFs instantly without leaving any trace.
            </p>
            <p>
              This browser-based approach also means you always have access to the latest version of our tool with the most up-to-date features and security. No updates to download, no compatibility issues - just instant PDF merging whenever you need it.
            </p>
          </section>

          <FAQSection faqs={faqs} toolName="PDF Merge" />
        </div>
      </div>
    </>
  );
};

export default MergePdf;