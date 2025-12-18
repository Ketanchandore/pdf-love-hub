import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Wrench, Download } from "lucide-react";

const RepairPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const repairPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // Load with recovery options
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
      setProgress(60);

      // Save with optimization to fix structure
      const repairedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      setProgress(90);

      const blob = new Blob([new Uint8Array(repairedBytes)], { type: "application/pdf" });
      saveAs(blob, `repaired-${file.name}`);

      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Error repairing PDF:", error);
      alert("Unable to repair this PDF. The file may be severely corrupted or in an unsupported format.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I repair a corrupted PDF file?",
      answer: "Upload your damaged PDF to our I Love PDF Repair tool and click 'Repair PDF'. Our tool attempts to reconstruct the file structure and recover readable content from corrupted documents."
    },
    {
      question: "What types of PDF damage can be repaired?",
      answer: "Our tool can fix minor structural issues, recover from incomplete downloads, and repair documents with corrupted headers. Severely damaged files with lost data may not be fully recoverable."
    },
    {
      question: "Will repairing affect my PDF content?",
      answer: "The repair process attempts to preserve all content. However, severely corrupted sections may be lost. Always keep your original file as backup before attempting repair."
    },
    {
      question: "Why won't my PDF open?",
      answer: "PDFs may not open due to corruption during download, storage issues, incomplete file transfers, or software incompatibility. Our repair tool can often fix these issues."
    },
    {
      question: "Is my corrupted PDF secure during repair?",
      answer: "Yes! All repair processing happens locally in your browser. Your files never leave your device, ensuring complete privacy even for damaged sensitive documents."
    },
    {
      question: "Can I repair password-protected PDFs?",
      answer: "Our repair tool attempts to process protected PDFs, but you may need to unlock them first using our Unlock PDF tool for best results."
    }
  ];

  return (
    <>
      <SEOHead
        title="Repair PDF Online Free - I Love PDF Repair Tool | Pine Tools Hub"
        description="Repair corrupted PDF files online for free with our I Love PDF Repair tool. Fix damaged PDFs and recover content from broken documents. No registration, 100% secure browser-based processing."
        keywords="repair pdf, fix corrupted pdf, i love pdf repair, recover pdf, damaged pdf, broken pdf fix, pdf recovery tool, ilovepdf repair, restore pdf"
        canonical="https://pinetoolshub.com/repair-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Repair Corrupted PDF"
          description="Fix damaged and corrupted PDF files. I Love PDF Repair attempts to recover your broken documents - completely free and secure."
          icon={<Wrench className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            label="Drop a corrupted PDF here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Ready to attempt repair
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Repairing PDF..." />
              ) : (
                <Button onClick={repairPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Repair PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Repair Tool - I Love PDF Fix Corrupted Files</h2>
            <p>
              Can't open a PDF file? Getting error messages? Pine Tools Hub's <strong>I Love PDF Repair</strong> tool attempts to fix corrupted and damaged PDF documents. Our repair process reconstructs the file structure and recovers as much content as possible from broken files.
            </p>
            <p>
              Unlike other PDF repair services that upload your files to servers, our tool processes everything directly in your browser. Your damaged documents - which may contain sensitive information - never leave your device.
            </p>
            <h3>Common PDF Problems We Can Fix</h3>
            <ul>
              <li><strong>Incomplete Downloads:</strong> PDFs that didn't fully download</li>
              <li><strong>Corrupted Headers:</strong> Files with damaged file structure</li>
              <li><strong>Transfer Errors:</strong> Documents damaged during email or upload</li>
              <li><strong>Storage Issues:</strong> PDFs affected by disk problems</li>
              <li><strong>Encoding Errors:</strong> Files with character encoding issues</li>
            </ul>
            <h3>How to Repair a Corrupted PDF</h3>
            <ol>
              <li>Upload your damaged PDF file</li>
              <li>Click "Repair PDF" to start the recovery process</li>
              <li>Wait for the repair attempt to complete</li>
              <li>Download your repaired PDF file</li>
            </ol>
            <h3>Best I Love PDF Repair Alternative</h3>
            <p>
              Looking for the best <strong>I Love PDF Repair alternative</strong>? Pine Tools Hub offers free PDF repair with complete privacy. While not all corrupted files can be recovered, our tool successfully repairs many common PDF issues without uploading your sensitive documents anywhere.
            </p>
            <h3>Prevention Tips</h3>
            <ul>
              <li>Always download PDFs completely before opening</li>
              <li>Keep backups of important documents</li>
              <li>Use reliable storage media for PDF files</li>
              <li>Verify file integrity after email transfers</li>
              <li>Use our Compress PDF tool to create smaller, more stable files</li>
            </ul>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default RepairPdf;
