import { useState } from "react";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
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
      question: "How do I convert JPG images to PDF online?",
      answer: "Upload your JPG images to our I Love JPG to PDF converter, arrange them in your preferred order, and click 'Convert to PDF'. All images will be combined into a single PDF document."
    },
    {
      question: "Can I convert multiple JPG files to one PDF?",
      answer: "Yes! You can upload as many JPG images as you need. Each image becomes a page in the final PDF, arranged in the order you specify."
    },
    {
      question: "What image formats are supported?",
      answer: "Our converter supports JPG, JPEG, and PNG image formats. All images are automatically centered and scaled to fit the PDF page while maintaining their aspect ratio."
    },
    {
      question: "Will my image quality be preserved?",
      answer: "Yes! Your images are embedded in the PDF at their original resolution. The PDF maintains high quality suitable for printing and digital viewing."
    },
    {
      question: "Is there a limit on how many images I can convert?",
      answer: "There's no strict limit since processing happens in your browser. For best results, we recommend converting batches of up to 50 images at a time."
    },
    {
      question: "Is my data secure during conversion?",
      answer: "Absolutely! All processing happens locally in your browser. Your images never leave your device, ensuring complete privacy and security."
    }
  ];

  return (
    <>
      <SEOHead
        title="JPG to PDF Converter Free Online - I Love JPG to PDF | Pine Tools Hub"
        description="Convert JPG images to PDF online for free with our I Love JPG to PDF converter. Combine multiple images into one PDF document instantly. No registration, 100% secure."
        keywords="jpg to pdf, convert jpg to pdf, i love jpg to pdf, image to pdf, jpeg to pdf, combine images to pdf, jpg to pdf online free"
        canonical="https://pinetoolshub.com/jpg-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="JPG to PDF Converter"
          description="Transform your JPG images into a professional PDF document. I Love JPG to PDF makes it easy to combine multiple images - completely free and secure."
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
            <h2>Free JPG to PDF Converter - I Love Image to PDF Tool</h2>
            <p>
              Want to combine multiple images into a single PDF document? Pine Tools Hub's I Love JPG to PDF converter makes it incredibly easy. Whether you're creating a photo album, compiling scanned documents, or preparing images for sharing, our tool delivers professional results in seconds.
            </p>
            <p>
              Our converter processes everything in your browser, ensuring your photos and images remain completely private. There's no uploading to external servers or waiting for server-side processing.
            </p>
            <h3>Why Convert Images to PDF?</h3>
            <ul>
              <li><strong>Document Sharing:</strong> Combine multiple scanned pages into one document</li>
              <li><strong>Photo Albums:</strong> Create shareable PDF photo collections</li>
              <li><strong>Presentations:</strong> Package images for professional presentations</li>
              <li><strong>Archiving:</strong> Store images in a universally compatible format</li>
              <li><strong>Printing:</strong> Prepare images for professional printing services</li>
            </ul>
            <h3>How to Convert JPG to PDF</h3>
            <ol>
              <li>Upload your JPG or PNG images</li>
              <li>Arrange images in your preferred order</li>
              <li>Click "Convert to PDF" to create your document</li>
              <li>Download your new PDF file</li>
            </ol>
            <h3>Smart Image Handling</h3>
            <p>
              Our converter automatically centers each image on the PDF page and scales it to fit while maintaining the original aspect ratio. This ensures your images look great regardless of their original dimensions.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default JpgToPdf;
