import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToPng = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
    }
  };

  const convertToPng = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const zip = new JSZip();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const pngData = canvas.toDataURL("image/png");
        const base64Data = pngData.split(",")[1];
        zip.file(`page-${i}.png`, base64Data, { base64: true });

        setProgress((i / pdf.numPages) * 100);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "pdf-to-png.zip");

      setFile(null);
      setPageCount(0);
    } catch (error) {
      console.error("Error converting PDF to PNG:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert PDF to PNG images online for free?",
      answer: "Upload your PDF to our free PDF to PNG converter, click 'Convert to PNG', and download your high-quality lossless PNG images as a ZIP file. Each page becomes a separate PNG image."
    },
    {
      question: "Why choose PNG over JPG for PDF conversion?",
      answer: "PNG offers lossless compression, preserving every pixel perfectly and supporting transparency. Choose PNG when you need the highest quality, sharp text, or when your PDF contains graphics with transparent backgrounds."
    },
    {
      question: "What resolution are the converted PNG images from PDF?",
      answer: "Our converter creates ultra high-resolution PNG images at 2x scale, ensuring crisp, clear images perfect for presentations, printing, professional work, or detailed viewing on high-DPI displays."
    },
    {
      question: "Can I convert a multi-page PDF to PNG images?",
      answer: "Yes! Every page of your PDF is converted to a separate lossless PNG image. All images are packaged in a convenient ZIP file for easy download and organization."
    },
    {
      question: "Is there a page limit for PDF to PNG conversion?",
      answer: "There is no strict limit since processing happens entirely in your browser. Most PDFs up to 50 pages convert smoothly depending on your device memory capabilities."
    },
    {
      question: "Is PDF to PNG conversion secure and private?",
      answer: "100% secure and private! All conversion happens locally in your browser. Your PDF never leaves your device or gets uploaded to any server, ensuring complete privacy."
    },
    {
      question: "How to convert PDF to PNG on mobile phone?",
      answer: "Our PDF to PNG converter works perfectly on mobile devices. Upload your PDF from your phone, convert it, and download the PNG images. Works on iPhone, Android, and all mobile browsers."
    },
    {
      question: "PDF to PNG vs PDF to JPG - which should I choose?",
      answer: "Choose PNG for lossless quality, transparency support, and sharp text/graphics. Choose JPG for smaller file sizes when slight compression is acceptable. PNG is better for documents, JPG for photos."
    }
  ];

  return (
    <>
      <SEOHead
        title="PDF to PNG Converter Free Online - Lossless Image Quality | Pine Tools Hub"
        description="Convert PDF to PNG images online for free with lossless quality. Extract PNG images from PDF pages with transparency support. Best PDF to PNG converter - no watermark."
        keywords="pdf to png, convert pdf to png, pdf to image, pdf to png online free, pdf to png converter, extract png from pdf, pdf to png lossless, pdf to png transparent"
        canonical="https://pinetoolshub.com/pdf-to-png"
      />

      <div className="py-12">
        <ToolHero
          title="PDF to PNG Converter - Free Online"
          description="Convert PDF pages to lossless PNG images with transparency support. Extract images from PDF in highest quality - works on desktop and mobile."
          icon={<ImageIcon className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} will be converted to PNG
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Converting to PNG..." />
              ) : (
                <Button onClick={convertToPng} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert to PNG
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF to PNG Converter - I Love PDF to Image Tool</h2>
            <p>
              Need the highest quality images from your PDF? Pine Tools Hub's I Love PDF to PNG converter transforms each page of your PDF into crystal-clear PNG images. PNG format offers lossless compression, meaning every detail is preserved perfectly.
            </p>
            <p>
              Our tool processes everything in your browser, keeping your documents private and secure. There's no uploading to servers, no waiting in queues, and no privacy concerns.
            </p>
            <h3>PNG vs JPG: When to Choose PNG</h3>
            <ul>
              <li><strong>Transparency:</strong> PNG supports transparent backgrounds, JPG doesn't</li>
              <li><strong>Lossless Quality:</strong> PNG preserves every pixel perfectly</li>
              <li><strong>Text and Graphics:</strong> PNG is ideal for documents with sharp text</li>
              <li><strong>Screenshots:</strong> PNG captures screen content more accurately</li>
              <li><strong>Editing:</strong> PNG is better for images you'll edit further</li>
            </ul>
            <h3>How to Convert PDF to PNG</h3>
            <ol>
              <li>Upload your PDF file using the upload area</li>
              <li>Click "Convert to PNG" to start conversion</li>
              <li>Wait for all pages to be processed</li>
              <li>Download your PNG images as a ZIP file</li>
            </ol>
            <h3>High-Quality Output</h3>
            <p>
              Our converter renders each PDF page at 2x scale, producing ultra-sharp PNG images. This high resolution ensures your images look great on high-DPI displays and when printed. The lossless PNG format means no compression artifacts - just pixel-perfect quality.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PdfToPng;
