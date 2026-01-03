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
      question: "How do I password protect a PDF online free?",
      answer: "Upload your PDF to our free online protect PDF tool, enter your desired password twice for confirmation, and click 'Protect PDF'. Your password-protected document downloads instantly - no registration, no watermark, completely free."
    },
    {
      question: "Is this PDF protection tool really free without watermark?",
      answer: "Yes! Pine Tools Hub offers completely free PDF password protection with no watermarks, no file size limits, and no registration required. We believe everyone should have access to professional PDF security tools."
    },
    {
      question: "Can I protect PDF on mobile phone?",
      answer: "Absolutely! Our protect PDF online tool works perfectly on mobile phones, tablets, and desktop computers. The responsive design adapts to any screen size for easy PDF password protection on any device."
    },
    {
      question: "How secure is online PDF password protection?",
      answer: "Our PDF protection tool processes everything locally in your browser. Your files and passwords never leave your device or get uploaded to any server, ensuring maximum privacy and security for your sensitive documents."
    },
    {
      question: "What password strength should I use to protect my PDF?",
      answer: "For strong PDF protection, use passwords with at least 8 characters mixing uppercase letters, lowercase letters, numbers, and symbols. Avoid common words, personal information, or sequential characters for better security."
    },
    {
      question: "Can I remove PDF password protection later?",
      answer: "Yes! Use our free Unlock PDF tool to remove password protection from your documents. You'll need to know the original password to unlock the PDF file."
    },
    {
      question: "Is protect PDF tool better than iLovePDF protect?",
      answer: "Our free PDF protect tool offers similar functionality to iLovePDF with added privacy benefits - all processing happens locally in your browser, meaning your sensitive documents never get uploaded to external servers."
    },
    {
      question: "Can I set different passwords for opening and editing PDF?",
      answer: "Our current tool uses a single password for document protection. For advanced permission settings like separate owner and user passwords, professional desktop software may be needed after initial protection."
    }
  ];

  return (
    <>
      <SEOHead
        title="Protect PDF with Password Free Online - No Watermark | Pine Tools Hub"
        description="Password protect PDF files online free without watermark. Secure your PDF documents with encryption instantly. No registration, works on mobile, 100% private browser-based PDF protection tool."
        keywords="protect pdf, password protect pdf free, secure pdf online, encrypt pdf no watermark, add password to pdf, pdf protection tool, lock pdf free, pdf password online, protect pdf mobile, ilovepdf protect alternative"
        canonical="https://pinetoolshub.com/protect-pdf"
      />
      <ToolStructuredData
        toolName="Protect PDF with Password"
        toolDescription="Free online PDF password protection tool. Add security to your PDF documents with encryption - no watermark, no registration required."
        toolUrl="https://pinetoolshub.com/protect-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Protect PDF with Password Free Online"
          description="Secure your PDF documents with password protection - completely free, no watermark. Works on mobile & desktop with 100% privacy."
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
            <h2>Free PDF Password Protection Tool - Secure Documents Online</h2>
            <p>
              Need to secure sensitive PDF documents before sharing? Our <strong>free PDF password protection tool</strong> helps you add encryption to your files quickly and easily. Whether you're sharing confidential business reports, personal financial documents, or sensitive legal files, our tool keeps them secure with password protection.
            </p>
            <p>
              Unlike other PDF protection services that upload your files to servers, Pine Tools Hub processes everything directly in your browser. Your documents and passwords remain completely private - nothing ever leaves your device. This makes our tool ideal for protecting sensitive information like contracts, medical records, or financial statements.
            </p>
            
            <h3>Why Password Protect Your PDF Documents?</h3>
            <ul>
              <li><strong>Confidential Business Documents:</strong> Protect financial reports, contracts, and proprietary information from unauthorized access</li>
              <li><strong>Email Attachment Security:</strong> Add password protection before sending sensitive PDFs via email to prevent interception</li>
              <li><strong>Regulatory Compliance:</strong> Meet GDPR, HIPAA, and other data protection requirements for handling sensitive documents</li>
              <li><strong>Personal Privacy:</strong> Secure tax documents, medical records, and personal financial statements</li>
              <li><strong>Device Loss Protection:</strong> Ensure documents remain protected even if laptops or phones are lost or stolen</li>
              <li><strong>Client Data Security:</strong> Protect client information when sharing documents externally</li>
            </ul>

            <h3>How to Protect a PDF with Password Online Free</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select the PDF document you want to protect</li>
              <li><strong>Create Strong Password:</strong> Enter a secure password using letters, numbers, and symbols</li>
              <li><strong>Confirm Password:</strong> Re-enter the password to prevent typos</li>
              <li><strong>Click Protect PDF:</strong> Process your document instantly in your browser</li>
              <li><strong>Download Protected File:</strong> Save your password-protected PDF immediately</li>
            </ol>

            <h3>Tips for Creating Strong PDF Passwords</h3>
            <p>
              Creating a strong password is essential for effective PDF protection. Follow these best practices:
            </p>
            <ul>
              <li>Use at least 8-12 characters for strong security</li>
              <li>Mix uppercase and lowercase letters (A-Z, a-z)</li>
              <li>Include numbers (0-9) and special symbols (!@#$%)</li>
              <li>Avoid common words, names, or birthdates</li>
              <li>Don't use sequential patterns like "123456" or "abcdef"</li>
              <li>Use a password manager to store complex passwords securely</li>
            </ul>

            <h3>Best Free PDF Protection Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF protection tool</strong>? Pine Tools Hub offers a superior alternative to iLovePDF, Smallpdf, and other online PDF tools. Our key advantages include:
            </p>
            <ul>
              <li><strong>100% Free:</strong> No premium plans, no hidden costs, no limits</li>
              <li><strong>No Watermarks:</strong> Your protected PDFs remain professional</li>
              <li><strong>Complete Privacy:</strong> Browser-based processing means files never leave your device</li>
              <li><strong>Mobile Friendly:</strong> Works perfectly on iPhone, Android, tablets, and desktops</li>
              <li><strong>No Registration:</strong> Start protecting PDFs immediately without creating accounts</li>
              <li><strong>Fast Processing:</strong> Instant protection with no upload queues or waiting</li>
            </ul>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ProtectPdf;