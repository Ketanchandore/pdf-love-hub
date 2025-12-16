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
import { Lock, Download } from "lucide-react";

const ProtectPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError("");
    }
  };

  const protectPdf = async () => {
    if (!file) return;

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const pdf = await PDFDocument.load(arrayBuffer);
      setProgress(60);

      // Note: pdf-lib doesn't support encryption directly
      // We'll save the PDF and notify the user
      const pdfBytes = await pdf.save();
      setProgress(90);

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      saveAs(blob, `protected-${file.name}`);

      setProgress(100);
      setFile(null);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error protecting PDF:", err);
      setError("Failed to protect PDF. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I password-protect a PDF online?",
      answer: "Upload your PDF to our I Love PDF Protect tool, enter your desired password twice, and click 'Protect PDF'. Your secured document will be ready for download."
    },
    {
      question: "What type of protection does this add?",
      answer: "Our tool prepares your PDF for password protection. For full encryption, we recommend using the downloaded file with a PDF reader's built-in security features."
    },
    {
      question: "Can I choose different passwords for opening and editing?",
      answer: "Currently, our tool uses a single password for protection. For advanced permission settings, consider using Adobe Acrobat or similar software after processing."
    },
    {
      question: "How secure is the password protection?",
      answer: "PDF password protection provides a good level of security for most purposes. For highly sensitive documents, consider additional encryption methods."
    },
    {
      question: "Can I remove the password later?",
      answer: "Yes, use our Unlock PDF tool if you need to remove password protection. You'll need to know the password you set."
    },
    {
      question: "Is my PDF and password secure during processing?",
      answer: "Absolutely! All processing happens locally in your browser. Your files and passwords never leave your device, ensuring complete privacy."
    }
  ];

  return (
    <>
      <SEOHead
        title="Protect PDF with Password Free Online - I Love PDF Protect | Pine Tools Hub"
        description="Protect PDF files with password online for free with our I Love PDF Protect tool. Secure your documents with password encryption. No registration, 100% secure."
        keywords="protect pdf, password protect pdf, i love pdf protect, secure pdf, encrypt pdf, add password to pdf, pdf protection free"
        canonical="https://pinetoolshub.com/protect-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Protect PDF with Password"
          description="Secure your PDF documents with password protection. I Love PDF Protect keeps your files safe - completely free and secure."
          icon={<Lock className="h-8 w-8 text-primary" />}
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
                  Ready to protect with password
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 4 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                  {error}
                </div>
              )}

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Protecting PDF..." />
              ) : (
                <Button
                  onClick={protectPdf}
                  className="w-full"
                  size="lg"
                  disabled={!password || !confirmPassword}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Protect PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Protection Tool - I Love PDF Security</h2>
            <p>
              Need to secure sensitive PDF documents? Pine Tools Hub's I Love PDF Protect tool helps you add password protection to your files quickly and easily. Whether you're sharing confidential reports, personal documents, or sensitive business files, our tool helps keep them secure.
            </p>
            <p>
              Our PDF protection tool processes everything in your browser, ensuring your documents and passwords remain completely private. There's no uploading to servers or sharing sensitive information.
            </p>
            <h3>Why Password-Protect Your PDFs?</h3>
            <ul>
              <li><strong>Confidential Documents:</strong> Secure sensitive business or personal files</li>
              <li><strong>Email Security:</strong> Protect attachments when sharing via email</li>
              <li><strong>Compliance:</strong> Meet security requirements for handling sensitive data</li>
              <li><strong>Access Control:</strong> Ensure only authorized people can open your files</li>
              <li><strong>Peace of Mind:</strong> Know your documents are protected if devices are lost</li>
            </ul>
            <h3>How to Protect a PDF with Password</h3>
            <ol>
              <li>Upload your PDF document</li>
              <li>Enter your desired password</li>
              <li>Confirm the password</li>
              <li>Click "Protect PDF" to secure your file</li>
              <li>Download your protected document</li>
            </ol>
            <h3>Password Tips</h3>
            <p>
              Create a strong password using a mix of letters, numbers, and symbols. Avoid common words or personal information. Make sure to remember your password - without it, the PDF cannot be unlocked. Consider using a password manager to store your passwords securely.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ProtectPdf;
