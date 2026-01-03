import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
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

      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
      setProgress(60);

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
      question: "How do I repair a corrupted PDF file online free?",
      answer: "Upload your damaged PDF to our free online repair tool and click 'Repair PDF'. Our tool attempts to reconstruct the file structure and recover readable content from corrupted documents - no registration, no software installation required."
    },
    {
      question: "What types of PDF damage can be repaired?",
      answer: "Our repair tool can fix minor structural issues, recover from incomplete downloads, repair documents with corrupted headers, and fix files damaged during email transfer or storage. Severely damaged files with lost data may not be fully recoverable."
    },
    {
      question: "Will repairing affect my PDF content quality?",
      answer: "The repair process attempts to preserve all original content including text, images, and formatting. However, severely corrupted sections may be lost. Always keep your original file as backup before attempting repair."
    },
    {
      question: "Why won't my PDF file open?",
      answer: "PDFs may not open due to corruption during download, storage issues, incomplete file transfers, software incompatibility, or damaged headers. Our repair tool can often fix these common issues and make your PDF readable again."
    },
    {
      question: "Is my corrupted PDF secure during repair?",
      answer: "Yes! All repair processing happens locally in your browser. Your files never leave your device or get uploaded to any server, ensuring complete privacy even for damaged sensitive documents."
    },
    {
      question: "Can I repair password-protected PDFs?",
      answer: "Our repair tool attempts to process protected PDFs, but for best results you may need to unlock them first using our free Unlock PDF tool before attempting repair."
    },
    {
      question: "Can I repair PDF on mobile phone?",
      answer: "Yes! Our repair PDF online tool works perfectly on smartphones and tablets. The responsive interface adapts to any screen size for easy PDF repair on iPhone, Android, and iPad devices."
    },
    {
      question: "Is this repair PDF tool better than iLovePDF repair?",
      answer: "Our free PDF repair tool offers complete privacy since all processing happens in your browser - your corrupted documents never get uploaded to external servers, unlike cloud-based alternatives like iLovePDF."
    }
  ];

  return (
    <>
      <SEOHead
        title="Repair Corrupted PDF Online Free - Fix Damaged PDF Files | Pine Tools Hub"
        description="Repair corrupted PDF files online free. Fix damaged PDFs and recover content from broken documents instantly. No registration, works on mobile, 100% secure browser-based PDF repair tool."
        keywords="repair pdf online free, fix corrupted pdf, recover damaged pdf, broken pdf fix, pdf recovery tool, repair pdf file, fix pdf not opening, corrupted pdf repair, ilovepdf repair alternative"
        canonical="https://pinetoolshub.com/repair-pdf"
      />
      <ToolStructuredData
        toolName="Repair Corrupted PDF"
        toolDescription="Free online PDF repair tool. Fix damaged and corrupted PDF files and recover content from broken documents - no registration required."
        toolUrl="https://pinetoolshub.com/repair-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Repair Corrupted PDF Online Free"
          description="Fix damaged and corrupted PDF files instantly. Recover content from broken documents - completely free, works on mobile & desktop, 100% private."
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
            <h2>Free PDF Repair Tool - Fix Corrupted & Damaged Files</h2>
            <p>
              Can't open a PDF file? Getting error messages like "file is damaged and could not be repaired"? Pine Tools Hub's <strong>free PDF repair tool</strong> attempts to fix corrupted and damaged PDF documents by reconstructing the file structure and recovering as much content as possible from broken files.
            </p>
            <p>
              Unlike other PDF repair services that upload your files to external servers, our tool processes everything directly in your browser. Your damaged documents - which may contain sensitive information - never leave your device, ensuring complete privacy during the repair process.
            </p>

            <h3>Common PDF Problems We Can Fix</h3>
            <ul>
              <li><strong>Incomplete Downloads:</strong> PDFs that didn't fully download from email or websites</li>
              <li><strong>Corrupted Headers:</strong> Files with damaged file structure or metadata that won't open</li>
              <li><strong>Transfer Errors:</strong> Documents damaged during email attachment or file upload</li>
              <li><strong>Storage Issues:</strong> PDFs affected by disk problems, bad sectors, or storage corruption</li>
              <li><strong>Encoding Errors:</strong> Files with character encoding or formatting issues</li>
              <li><strong>Software Crashes:</strong> PDFs corrupted when applications crashed during creation or saving</li>
            </ul>

            <h3>How to Repair a Corrupted PDF Online Free</h3>
            <ol>
              <li><strong>Upload Damaged PDF:</strong> Drag and drop or click to select the corrupted PDF file</li>
              <li><strong>Click Repair PDF:</strong> Our tool analyzes and attempts to reconstruct the file structure</li>
              <li><strong>Wait for Processing:</strong> Repair time depends on file size and corruption level</li>
              <li><strong>Download Repaired File:</strong> Save the recovered PDF to your device</li>
            </ol>

            <h3>Tips to Prevent PDF Corruption</h3>
            <ul>
              <li>Always wait for PDF downloads to complete fully before opening</li>
              <li>Keep backup copies of important documents in multiple locations</li>
              <li>Use reliable storage media and check disk health regularly</li>
              <li>Verify file integrity after email transfers or cloud syncing</li>
              <li>Use our Compress PDF tool to create smaller, more stable files</li>
              <li>Avoid interrupting PDF creation or saving processes</li>
            </ul>

            <h3>Best Free PDF Repair Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF repair alternative to iLovePDF</strong>? Pine Tools Hub offers browser-based PDF repair with complete privacy. While not all severely corrupted files can be recovered, our tool successfully repairs many common PDF issues without uploading your sensitive documents to external servers.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default RepairPdf;