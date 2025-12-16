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

const PngToPdf = () => {
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

        pdf.addImage(imageUrl, "PNG", x, y, imgWidth, imgHeight);
        setProgress(((i + 1) / files.length) * 100);
      }

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, "png-to-pdf.pdf");

      setFiles([]);
    } catch (error) {
      console.error("Error converting PNG to PDF:", error);
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
      question: "How do I convert PNG images to PDF online?",
      answer: "Upload your PNG images to our I Love PNG to PDF converter, arrange them in your preferred order, and click 'Convert to PDF'. All images will be combined into a single PDF document."
    },
    {
      question: "Can I convert multiple PNG files to one PDF?",
      answer: "Yes! You can upload as many PNG images as you need. Each image becomes a page in the final PDF, arranged in the order you specify."
    },
    {
      question: "Will PNG transparency be preserved?",
      answer: "PNG transparency is converted to white background in the PDF, as PDFs don't support transparency in the same way. The image quality and details are fully preserved."
    },
    {
      question: "What image formats are supported?",
      answer: "This tool is optimized for PNG files. For JPG images, use our JPG to PDF converter. Both tools produce equally high-quality PDF documents."
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
        title="PNG to PDF Converter Free Online - I Love PNG to PDF | Pine Tools Hub"
        description="Convert PNG images to PDF online for free with our I Love PNG to PDF converter. Combine multiple PNG files into one PDF document instantly. No registration, 100% secure."
        keywords="png to pdf, convert png to pdf, i love png to pdf, image to pdf, combine png to pdf, png to pdf online free, png converter"
        canonical="https://pinetoolshub.com/png-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="PNG to PDF Converter"
          description="Transform your PNG images into a professional PDF document. I Love PNG to PDF makes it easy to combine multiple images - completely free and secure."
          icon={<FileImage className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{
              "image/png": [".png"],
            }}
            multiple={true}
            maxFiles={50}
            label="Drop PNG images here or click to browse"
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
            <h2>Free PNG to PDF Converter - I Love Image to PDF Tool</h2>
            <p>
              Want to combine PNG images into a single PDF document? Pine Tools Hub's I Love PNG to PDF converter makes it incredibly easy. Whether you're creating documentation, compiling screenshots, or preparing images for sharing, our tool delivers professional results in seconds.
            </p>
            <p>
              Our converter processes everything in your browser, ensuring your images remain completely private. There's no uploading to external servers or waiting for server-side processing.
            </p>
            <h3>Why Convert PNG to PDF?</h3>
            <ul>
              <li><strong>Documentation:</strong> Compile screenshots into organized documents</li>
              <li><strong>Archiving:</strong> Store images in a universally compatible format</li>
              <li><strong>Sharing:</strong> Send multiple images as a single file</li>
              <li><strong>Printing:</strong> Prepare images for professional printing</li>
              <li><strong>Presentations:</strong> Package images for easy distribution</li>
            </ul>
            <h3>How to Convert PNG to PDF</h3>
            <ol>
              <li>Upload your PNG images</li>
              <li>Arrange images in your preferred order</li>
              <li>Click "Convert to PDF" to create your document</li>
              <li>Download your new PDF file</li>
            </ol>
            <h3>Smart Image Handling</h3>
            <p>
              Our converter automatically centers each PNG image on the PDF page and scales it to fit while maintaining the original aspect ratio. This ensures your images look great regardless of their original dimensions. The high-quality output preserves all the detail of your original PNG files.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PngToPdf;
