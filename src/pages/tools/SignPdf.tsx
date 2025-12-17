import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Download, Trash2 } from "lucide-react";

const SignPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [signatureName, setSignatureName] = useState("");
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
      
      // Convert data URL to bytes
      const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
      const signatureImage = await pdf.embedPng(signatureImageBytes);
      
      setProgress(60);
      
      // Add signature to first page
      const pages = pdf.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      // Scale signature to reasonable size
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
      question: "How do I sign a PDF online?",
      answer: "Upload your PDF, draw your signature in the signature pad, and click Sign PDF. Your signature will be added to the first page of the document."
    },
    {
      question: "Is this a legally binding signature?",
      answer: "This tool adds a visual signature to your PDF. For legally binding digital signatures with certificates, you may need specialized software."
    },
    {
      question: "Can I sign multiple pages?",
      answer: "Currently, the signature is added to the first page. For multiple signatures, you can process the PDF multiple times."
    },
    {
      question: "Is my signature stored anywhere?",
      answer: "No! All processing happens locally in your browser. Your signature is never uploaded to any server."
    }
  ];

  return (
    <>
      <SEOHead
        title="Sign PDF Free Online - Add Signature to PDF | Pine Tools Hub"
        description="Sign PDF documents online for free. Draw your signature and add it to PDF files instantly. I Love PDF style tool with complete privacy."
        keywords="sign pdf, add signature to pdf, pdf signature free, i love pdf sign, electronic signature pdf, sign document online free"
        canonical="https://pinetoolshub.com/sign-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Sign PDF Online"
          description="Add your signature to PDF documents. Draw your signature and place it on your PDF - fast, free, and private."
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
            <h2>Free PDF Signature Tool - Sign Documents Online</h2>
            <p>
              Add your signature to PDF documents instantly with Pine Tools Hub. Perfect for signing contracts, agreements, forms, and other documents.
            </p>
            <h3>How to Sign a PDF</h3>
            <ol>
              <li>Upload the PDF you want to sign</li>
              <li>Draw your signature in the signature pad</li>
              <li>Click "Sign PDF" to add your signature</li>
              <li>Download your signed document</li>
            </ol>
            <h3>Privacy First</h3>
            <p>
              Your documents and signature never leave your device. All processing happens locally in your browser, ensuring complete privacy for sensitive documents.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default SignPdf;