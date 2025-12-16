import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Image, Download } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToJpg = () => {
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

  const convertToJpg = async () => {
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

        const jpgData = canvas.toDataURL("image/jpeg", 0.9);
        const base64Data = jpgData.split(",")[1];
        zip.file(`page-${i}.jpg`, base64Data, { base64: true });

        setProgress((i / pdf.numPages) * 100);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "pdf-to-jpg.zip");

      setFile(null);
      setPageCount(0);
    } catch (error) {
      console.error("Error converting PDF to JPG:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert PDF to JPG images online?",
      answer: "Simply upload your PDF to our I Love PDF to JPG converter, click 'Convert to JPG', and download your images as a ZIP file. Each page becomes a separate high-quality JPG image."
    },
    {
      question: "What quality are the converted JPG images?",
      answer: "Our converter creates high-resolution JPG images at 2x scale with 90% quality. This ensures your images are crisp and clear, perfect for presentations, printing, or web use."
    },
    {
      question: "Can I convert a multi-page PDF to JPG?",
      answer: "Yes! Every page of your PDF is converted to a separate JPG image. All images are packaged in a convenient ZIP file for easy download."
    },
    {
      question: "Is there a page limit for conversion?",
      answer: "There's no strict page limit. Since processing happens in your browser, the limitation is your device's memory. Most PDFs up to 50 pages convert without issues."
    },
    {
      question: "Why would I convert PDF to JPG?",
      answer: "JPG images are great for sharing on social media, embedding in presentations, uploading to websites that don't support PDF, or when you need to edit pages as images."
    },
    {
      question: "Is my PDF secure during conversion?",
      answer: "Absolutely! All conversion happens locally in your browser. Your PDF never leaves your device, ensuring complete privacy and security."
    }
  ];

  return (
    <>
      <SEOHead
        title="PDF to JPG Converter Free Online - I Love PDF to JPG | Pine Tools Hub"
        description="Convert PDF to JPG images online for free with our I Love PDF to JPG converter. Transform PDF pages into high-quality JPG images instantly. No registration, 100% secure."
        keywords="pdf to jpg, convert pdf to jpg, i love pdf to jpg, pdf to image, pdf to jpeg, pdf converter, pdf to jpg online free"
        canonical="https://pinetoolshub.com/pdf-to-jpg"
      />

      <div className="py-12">
        <ToolHero
          title="PDF to JPG Converter"
          description="Transform your PDF pages into high-quality JPG images. I Love PDF to JPG makes conversion quick and easy - completely free and secure."
          icon={<Image className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} will be converted to JPG
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Converting to JPG..." />
              ) : (
                <Button onClick={convertToJpg} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert to JPG
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF to JPG Converter - I Love PDF to Image Tool</h2>
            <p>
              Need to turn PDF pages into images? Pine Tools Hub's I Love PDF to JPG converter transforms each page of your PDF into a high-quality JPG image. Whether you need images for a presentation, social media, or website, our converter delivers crystal-clear results.
            </p>
            <p>
              Our tool processes everything in your browser, keeping your documents private and secure. There's no uploading to servers, no waiting in queues, and no concerns about data privacy.
            </p>
            <h3>Why Convert PDF to JPG?</h3>
            <ul>
              <li><strong>Social Media Sharing:</strong> Share PDF content as images on Instagram, Twitter, Facebook</li>
              <li><strong>Presentations:</strong> Embed PDF pages directly into PowerPoint or Keynote</li>
              <li><strong>Website Content:</strong> Display PDF pages as images on your website</li>
              <li><strong>Image Editing:</strong> Edit PDF content in image editing software</li>
              <li><strong>Universal Viewing:</strong> JPGs open on any device without PDF readers</li>
            </ul>
            <h3>How to Convert PDF to JPG</h3>
            <ol>
              <li>Upload your PDF file using the upload area</li>
              <li>Click "Convert to JPG" to start conversion</li>
              <li>Wait for all pages to be processed</li>
              <li>Download your JPG images as a ZIP file</li>
            </ol>
            <h3>High-Quality Output</h3>
            <p>
              Our converter renders each PDF page at 2x scale, producing crisp, detailed images perfect for any use case. The 90% JPG quality setting balances file size with image clarity, giving you professional results every time.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PdfToJpg;
