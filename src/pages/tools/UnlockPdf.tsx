import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Unlock, Download } from "lucide-react";

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError("");
    }
  };

  const unlockPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        password: password || undefined,
      });
      setProgress(60);

      const unlockedPdf = await PDFDocument.create();
      const pages = await unlockedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => unlockedPdf.addPage(page));
      setProgress(80);

      const pdfBytes = await unlockedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `unlocked-${file.name}`);

      setProgress(100);
      setFile(null);
      setPassword("");
    } catch (err: any) {
      console.error("Error unlocking PDF:", err);
      setError("Failed to unlock PDF. Please check the password and try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I unlock a password-protected PDF?",
      answer: "Upload your protected PDF to our I Love PDF Unlock tool, enter the password if you know it, and click 'Unlock PDF'. Your unlocked document will be ready for download."
    },
    {
      question: "Can I unlock a PDF without knowing the password?",
      answer: "Our tool can remove restrictions from some PDFs that don't require a password to open. For fully encrypted PDFs, you'll need to know the original password."
    },
    {
      question: "Is it legal to unlock PDFs?",
      answer: "Yes, if you have authorization to access the content. Our tool is designed for legitimate uses like unlocking your own documents when you've forgotten the password."
    },
    {
      question: "What types of PDF protection can be removed?",
      answer: "Our tool can remove password protection that prevents editing, copying, or printing. It works best with owner-password protected PDFs rather than user-password encrypted ones."
    },
    {
      question: "Will unlocking affect the PDF content?",
      answer: "No, unlocking only removes the password protection. All content, formatting, images, and text remain exactly the same."
    },
    {
      question: "Is my PDF secure during the unlocking process?",
      answer: "Absolutely! All processing happens locally in your browser. Your files and passwords never leave your device, ensuring complete privacy."
    }
  ];

  return (
    <>
      <SEOHead
        title="Unlock PDF Online Free - I Love PDF Unlock Tool | Pine Tools Hub"
        description="Unlock password-protected PDF files online for free with our I Love PDF Unlock tool. Remove PDF restrictions and passwords instantly. No registration, 100% secure."
        keywords="unlock pdf, remove pdf password, i love pdf unlock, pdf password remover, unlock pdf online, unprotect pdf, remove pdf protection free"
        canonical="https://pinetoolshub.com/unlock-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Unlock PDF Files"
          description="Remove password protection from your PDF documents. I Love PDF Unlock makes it quick and easy - completely free and secure."
          icon={<Unlock className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            label="Drop a password-protected PDF here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Ready to unlock
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">PDF Password (if required)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (leave empty if unknown)"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to attempt unlocking without a password
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                  {error}
                </div>
              )}

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Unlocking PDF..." />
              ) : (
                <Button onClick={unlockPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Unlock PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Unlock Tool - I Love PDF Password Remover</h2>
            <p>
              Locked out of your own PDF? Pine Tools Hub's I Love PDF Unlock tool helps you remove password protection from PDF documents quickly and easily. Whether you've forgotten a password or need to edit a restricted document you own, our tool can help.
            </p>
            <p>
              Our PDF unlocker processes everything in your browser, ensuring your documents and passwords remain completely private. There's no uploading to servers or sharing sensitive information.
            </p>
            <h3>When to Use PDF Unlock</h3>
            <ul>
              <li><strong>Forgotten Passwords:</strong> Unlock your own documents when you can't remember the password</li>
              <li><strong>Edit Restrictions:</strong> Remove restrictions that prevent editing or copying</li>
              <li><strong>Print Restrictions:</strong> Enable printing on restricted documents</li>
              <li><strong>Form Filling:</strong> Unlock PDFs to fill in form fields</li>
              <li><strong>Document Management:</strong> Standardize document permissions across your files</li>
            </ul>
            <h3>How to Unlock a PDF</h3>
            <ol>
              <li>Upload your password-protected PDF</li>
              <li>Enter the password if you know it (leave blank otherwise)</li>
              <li>Click "Unlock PDF" to remove protection</li>
              <li>Download your unlocked PDF file</li>
            </ol>
            <h3>Important Note</h3>
            <p>
              This tool is intended for legitimate use only - unlocking your own documents or documents you have permission to access. Always respect copyright and document ownership. Some strongly encrypted PDFs may require the original password to unlock.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default UnlockPdf;
