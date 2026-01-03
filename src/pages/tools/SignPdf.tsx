import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { PenTool, Download, Trash2 } from "lucide-react";

const SignPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const signPdf = async () => {
    if (!file || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const canvas = canvasRef.current;
      const signatureDataUrl = canvas.toDataURL("image/png");
      
      setProgress(20);
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      setProgress(40);
      
      const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
      const signatureImage = await pdf.embedPng(signatureImageBytes);
      
      setProgress(60);
      
      const pages = pdf.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      const signatureWidth = 150;
      const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth;
      
      firstPage.drawImage(signatureImage, {
        x: width - signatureWidth - 50,
        y: 50,
        width: signatureWidth,
        height: signatureHeight,
      });
      
      setProgress(80);
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, `signed-${file.name}`);
      
      setProgress(100);
      setFile(null);
      setPageCount(0);
      clearSignature();
    } catch (error) {
      console.error("Error signing PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I sign a PDF online free without software?",
      answer: "Upload your PDF to our free online signature tool, draw your signature using your mouse or finger on touchscreens, and click Sign PDF. Your signature is instantly added to the document - no software installation, no registration, completely free."
    },
    {
      question: "Is this electronic signature legally valid?",
      answer: "Our tool adds a visual signature image to your PDF, which is accepted for many informal agreements and personal documents. For legally binding digital signatures with cryptographic certificates required for contracts, you may need specialized e-signature software."
    },
    {
      question: "Can I sign PDF on my mobile phone?",
      answer: "Yes! Our sign PDF online tool works perfectly on smartphones and tablets. Simply draw your signature with your finger on the touchscreen. Works on iPhone, Android, iPad, and all mobile browsers."
    },
    {
      question: "Is my signature and PDF secure?",
      answer: "Absolutely! All processing happens locally in your browser. Your signature and PDF documents never leave your device or get uploaded to any server, ensuring complete privacy for sensitive documents."
    },
    {
      question: "Can I add signature to multiple pages in PDF?",
      answer: "Currently, the signature is added to the first page of your document. For adding signatures to multiple pages, you can process the PDF multiple times or use the signed PDF as a template."
    },
    {
      question: "How do I create a professional-looking signature?",
      answer: "For the best results, use smooth, deliberate strokes when drawing your signature. On mobile devices, use your finger tip. On desktop, use a mouse or stylus. Practice a few times and clear to retry until you're satisfied."
    },
    {
      question: "Is this sign PDF tool better than iLovePDF sign?",
      answer: "Our free PDF signature tool offers complete privacy since all processing happens in your browser - your documents never get uploaded to external servers unlike cloud-based alternatives like iLovePDF."
    },
    {
      question: "Can I add typed text signature instead of drawing?",
      answer: "Our current tool focuses on handwritten-style signatures that you draw. For typed text signatures, you can use our Add Watermark tool to add text to your PDF documents."
    }
  ];

  return (
    <>
      <SEOHead
        title="Sign PDF Online Free - Add Signature to PDF Without Software | Pine Tools Hub"
        description="Sign PDF documents online free without software. Draw your electronic signature and add it to PDF files instantly. Works on mobile & desktop, no registration required, 100% private."
        keywords="sign pdf online free, add signature to pdf, electronic signature pdf, e-sign pdf free, sign pdf without software, pdf signature tool, sign document online free, esign pdf mobile, ilovepdf sign alternative"
        canonical="https://pinetoolshub.com/sign-pdf"
      />
      <ToolStructuredData
        toolName="Sign PDF Online Free"
        toolDescription="Free online PDF signature tool. Draw your signature and add it to PDF documents instantly - no software, no registration required."
        toolUrl="https://pinetoolshub.com/sign-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Sign PDF Online Free - No Software Needed"
          description="Add your electronic signature to PDF documents instantly. Draw your signature and place it on any PDF - works on mobile & desktop, completely free and private."
          icon={<PenTool className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} - Signature will be added to page 1
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Draw Your Signature</label>
                  <Button variant="outline" size="sm" onClick={clearSignature}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-2 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="w-full cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use your mouse or finger to draw your signature
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Signing PDF..." />
              ) : (
                <Button onClick={signPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Sign PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Electronic Signature Tool - Sign PDF Documents Online</h2>
            <p>
              Need to <strong>sign a PDF document online free</strong>? Pine Tools Hub's electronic signature tool lets you add your handwritten signature to any PDF instantly. Perfect for signing contracts, agreements, forms, applications, and other important documents without printing or scanning.
            </p>
            <p>
              Our <strong>free PDF signature tool</strong> works entirely in your browser, meaning your documents and signature never leave your device. This provides maximum privacy and security for sensitive documents like employment contracts, rental agreements, or financial forms.
            </p>

            <h3>How to Sign a PDF Online Free - Step by Step</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select the PDF document you want to sign</li>
              <li><strong>Draw Your Signature:</strong> Use your mouse (desktop) or finger (mobile/tablet) to draw your signature in the signature pad</li>
              <li><strong>Perfect Your Signature:</strong> Click "Clear" to retry until you're satisfied with your signature</li>
              <li><strong>Click Sign PDF:</strong> Your signature is instantly added to the document</li>
              <li><strong>Download Signed Document:</strong> Save your signed PDF immediately to your device</li>
            </ol>

            <h3>Why Use Our Free PDF Signature Tool?</h3>
            <ul>
              <li><strong>No Software Installation:</strong> Works directly in your web browser on any device</li>
              <li><strong>Mobile Friendly:</strong> Sign PDFs on iPhone, Android phones, iPads, and tablets using your finger</li>
              <li><strong>Complete Privacy:</strong> All processing happens locally - documents never uploaded to servers</li>
              <li><strong>100% Free:</strong> No hidden costs, no premium plans, no watermarks</li>
              <li><strong>No Registration:</strong> Start signing immediately without creating accounts</li>
              <li><strong>Instant Processing:</strong> Sign and download in seconds, not minutes</li>
            </ul>

            <h3>Common Documents to Sign Online</h3>
            <ul>
              <li>Employment contracts and offer letters</li>
              <li>Rental and lease agreements</li>
              <li>Purchase orders and invoices</li>
              <li>Permission slips and consent forms</li>
              <li>Insurance documents and claims</li>
              <li>Tax forms and financial documents</li>
              <li>Medical consent and HIPAA forms</li>
              <li>School and educational documents</li>
            </ul>

            <h3>Best Free PDF Signature Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free alternative to iLovePDF sign</strong>? Pine Tools Hub offers superior privacy since all signature processing happens locally in your browser. Unlike cloud-based services that upload your sensitive documents to external servers, your PDFs and signature never leave your device with our tool.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default SignPdf;