import { useState } from "react";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { FileImage, Download, Trash2 } from "lucide-react";

const JpgToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await readFileAsDataURL(file);

        const img = new window.Image();
        img.src = imageUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let imgWidth = img.width;
        let imgHeight = img.height;
        
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        imgWidth *= ratio;
        imgHeight *= ratio;
        
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        pdf.addImage(imageUrl, "JPEG", x, y, imgWidth, imgHeight);
        setProgress(((i + 1) / files.length) * 100);
      }

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, "images-to-pdf.pdf");

      setFiles([]);
    } catch (error) {
      console.error("Error converting JPG to PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const faqs = [
    {
      question: "How do I convert JPG to PDF online free without watermark?",
      answer: "Upload your JPG images to our free JPG to PDF converter, arrange them in order, and click 'Convert to PDF'. Download your PDF instantly - completely free with no watermark, no registration required."
    },
    {
      question: "Can I combine multiple JPG images into one PDF?",
      answer: "Yes! Our image to PDF converter lets you upload as many JPG and PNG images as needed. Each image becomes a page in your final PDF document, arranged in your preferred order."
    },
    {
      question: "What image formats are supported for PDF conversion?",
      answer: "Our best JPG to PDF converter supports JPG, JPEG, and PNG formats. All images are automatically centered and scaled to fit the PDF page while maintaining their original aspect ratio and quality."
    },
    {
      question: "Will my image quality be preserved when converting to PDF?",
      answer: "Absolutely! Your images are embedded in the PDF at their original resolution. The PDF maintains high quality suitable for professional printing and digital viewing. No compression or quality loss."
    },
    {
      question: "Is there a limit on how many images I can convert to PDF?",
      answer: "There is no strict limit since processing happens entirely in your browser. For best performance, we recommend converting batches of up to 50 images at a time on most devices."
    },
    {
      question: "Is JPG to PDF conversion secure and private?",
      answer: "100% secure and private! All processing happens locally in your browser. Your images never leave your device or get uploaded to any server, ensuring complete privacy and data security."
    },
    {
      question: "How to convert JPG to PDF on mobile phone?",
      answer: "Our JPG to PDF converter works perfectly on mobile devices. Simply upload your photos from your phone gallery, arrange them, and convert to PDF. Works on iPhone, Android, and all mobile browsers."
    },
    {
      question: "Can I convert PNG images to PDF as well?",
      answer: "Yes! Our converter supports both JPG and PNG image formats. You can even mix both formats in the same PDF document for maximum flexibility."
    }
  ];

  return (
    <>
      <SEOHead
        title="JPG to PDF Converter Free Online - Best Image to PDF Tool 2026 | Pine Tools Hub"
        description="Convert JPG to PDF online free without watermark. Best JPG to PDF converter - combine multiple images into one PDF instantly. No registration, 100% secure, works on mobile."
        keywords="jpg to pdf, convert jpg to pdf, image to pdf, jpeg to pdf, combine images to pdf, jpg to pdf online free, jpg to pdf converter, photo to pdf, pictures to pdf, jpg to pdf no watermark, jpg to pdf mobile"
        canonical="https://pinetoolshub.com/jpg-to-pdf"
      />
      <ToolStructuredData
        toolName="JPG to PDF Converter"
        toolDescription="Convert JPG images to PDF online free without watermark. Combine multiple photos into one PDF document instantly."
        toolUrl="https://pinetoolshub.com/jpg-to-pdf"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="JPG to PDF Converter - Free Online"
          description="Convert JPG images to PDF online free without watermark. Combine multiple photos into one professional PDF document instantly - works on desktop and mobile."
          icon={<FileImage className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
            multiple={true}
            maxFiles={50}
            label="Drop JPG or PNG images here or click to browse"
          />

          {files.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Selected Images ({files.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                      <p className="text-xs text-white truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Creating PDF..." />
              ) : (
                <Button onClick={convertToPdf} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert {files.length} Image{files.length !== 1 ? "s" : ""} to PDF
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Best Free JPG to PDF Converter Online - No Watermark</h2>
            <p>
              Looking for the best way to convert JPG to PDF online free? Pine Tools Hub offers the fastest, most secure image to PDF converter available. Whether you need to combine multiple photos into a single PDF, create a photo album, compile scanned documents, or prepare images for professional sharing, our tool delivers perfect results in seconds.
            </p>
            <p>
              Unlike other JPG to PDF converters, our tool processes everything directly in your browser. Your images never leave your device - no uploads to external servers, no privacy concerns, no waiting in queues. This makes it the most secure and fastest JPG to PDF converter available online.
            </p>
            
            <h3>Why Use Our JPG to PDF Converter?</h3>
            <ul>
              <li><strong>100% Free, No Watermark:</strong> Convert JPG to PDF without any watermarks or limitations</li>
              <li><strong>Works on Mobile:</strong> Convert photos to PDF directly from your iPhone or Android phone</li>
              <li><strong>Combine Multiple Images:</strong> Merge multiple JPG files into one PDF document</li>
              <li><strong>High Quality Output:</strong> Preserve original image resolution and quality</li>
              <li><strong>No Registration Required:</strong> Start converting immediately without signing up</li>
              <li><strong>Complete Privacy:</strong> Your images never leave your device</li>
            </ul>
            
            <h3>How to Convert JPG to PDF Online Free</h3>
            <ol>
              <li><strong>Upload Images:</strong> Drag and drop your JPG or PNG images, or click to browse</li>
              <li><strong>Arrange Order:</strong> Organize images in your preferred sequence</li>
              <li><strong>Convert Instantly:</strong> Click "Convert to PDF" to create your document</li>
              <li><strong>Download PDF:</strong> Save your new PDF file with one click</li>
            </ol>
            
            <h3>Popular Uses for JPG to PDF Conversion</h3>
            <p>
              Our image to PDF converter is perfect for creating digital photo albums from vacation pictures, compiling receipts and invoices for expense reports, combining scanned document pages into single files, preparing portfolios for job applications, and creating eBooks from image-based content.
            </p>
            
            <h3>JPG to PDF Converter Features</h3>
            <p>
              Our smart converter automatically centers each image on the PDF page and scales it to fit perfectly while maintaining the original aspect ratio. This ensures your photos and images look professional regardless of their original dimensions. Whether you are converting a single photo or combining dozens of images, the output PDF maintains excellent quality suitable for printing or digital viewing.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default JpgToPdf;
