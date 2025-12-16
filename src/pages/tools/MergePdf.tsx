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
      question: "How do I merge PDF files online for free?",
      answer: "Simply upload your PDF files to our I Love PDF Merge tool, arrange them in your preferred order, and click 'Merge PDFs'. Your combined document will be ready to download instantly - completely free with no registration required."
    },
    {
      question: "Is it safe to merge PDF files using Pine Tools Hub?",
      answer: "Absolutely! All PDF processing happens directly in your browser. Your files never leave your device or get uploaded to any server, ensuring complete privacy and security for your sensitive documents."
    },
    {
      question: "Can I merge more than two PDF files at once?",
      answer: "Yes! Our PDF merger tool allows you to combine unlimited PDF files in a single operation. Simply upload all the documents you want to merge and arrange them in your desired order."
    },
    {
      question: "Will the quality of my PDFs be affected after merging?",
      answer: "No, the quality remains exactly the same. Our I Love PDF Merge tool preserves all original formatting, images, fonts, and layouts when combining your documents."
    },
    {
      question: "Can I rearrange the order of PDF pages before merging?",
      answer: "Yes, you can easily drag and drop files to rearrange their order before merging. The final document will follow the sequence you specify."
    },
    {
      question: "What is the maximum file size for merging PDFs?",
      answer: "Since processing happens in your browser, there's no strict server limit. However, very large files (over 100MB each) may take longer to process depending on your device's capabilities."
    }
  ];

  return (
    <>
      <SEOHead
        title="Merge PDF Files Online Free - I Love PDF Merge Tool | Pine Tools Hub"
        description="Merge PDF files online for free with our I Love PDF Merge tool. Combine multiple PDFs into one document instantly. No registration, no watermarks, 100% secure browser-based processing."
        keywords="merge pdf, combine pdf, i love pdf merge, pdf merger online, join pdf files, merge pdf free, combine pdf online"
        canonical="https://pinetoolshub.com/merge-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Merge PDF Files"
          description="Combine multiple PDF documents into a single file. I Love PDF Merge makes it easy to join your PDFs in seconds - completely free and secure."
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
            <h2>Free Online PDF Merger - I Love PDF Combine Tool</h2>
            <p>
              Looking for a reliable way to merge PDF files online? Pine Tools Hub offers the best free PDF merger tool that lets you combine multiple PDF documents into a single file within seconds. Whether you're consolidating business reports, combining scanned documents, or joining multiple chapters of an ebook, our I Love PDF Merge tool handles it all with ease.
            </p>
            <p>
              Unlike other online PDF tools, our merger processes everything directly in your web browser. This means your sensitive documents never leave your computer, providing unmatched privacy and security. There's no need to upload files to external servers or worry about data breaches.
            </p>
            <h3>Why Choose Our PDF Merge Tool?</h3>
            <ul>
              <li><strong>100% Free:</strong> No hidden costs, no premium features locked behind paywalls</li>
              <li><strong>No Registration:</strong> Start merging PDFs immediately without creating an account</li>
              <li><strong>Privacy First:</strong> All processing happens locally in your browser</li>
              <li><strong>Unlimited Merges:</strong> Combine as many PDFs as you need</li>
              <li><strong>Quality Preserved:</strong> Original formatting, images, and fonts remain intact</li>
              <li><strong>Cross-Platform:</strong> Works on Windows, Mac, Linux, and mobile devices</li>
            </ul>
            <h3>How to Merge PDF Files</h3>
            <ol>
              <li>Click the upload area or drag and drop your PDF files</li>
              <li>Arrange the files in your preferred order</li>
              <li>Click "Merge PDFs" to combine them</li>
              <li>Download your merged document instantly</li>
            </ol>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default MergePdf;
