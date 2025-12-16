import { useState } from "react";
import imageCompression from "browser-image-compression";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ImageDown, Download } from "lucide-react";

const CompressImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOriginalSize(files[0].size);
      setCompressedSize(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressImage = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality[0] / 100,
        onProgress: (p: number) => setProgress(p),
      };

      const compressedFile = await imageCompression(file, options);
      setCompressedSize(compressedFile.size);

      saveAs(compressedFile, `compressed-${file.name}`);
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I compress images online for free?",
      answer: "Upload your image to our I Love Image Compress tool, adjust the quality slider to balance size and quality, and click 'Compress Image'. Your optimized image will be ready to download instantly."
    },
    {
      question: "What image formats can I compress?",
      answer: "Our compressor supports JPG, JPEG, PNG, and WebP formats. These are the most common web image formats that benefit from compression."
    },
    {
      question: "How much can I reduce image file size?",
      answer: "Compression results vary by image. Photos typically achieve 50-80% reduction, while graphics and screenshots may see 30-60% reduction depending on the quality setting."
    },
    {
      question: "Will compression affect image quality?",
      answer: "Our smart compression minimizes visible quality loss. Use the quality slider to find your ideal balance - higher values preserve more quality, lower values achieve smaller file sizes."
    },
    {
      question: "Is there a maximum image size?",
      answer: "Our tool handles images up to 10MB. Very large images may take longer to process but will compress successfully. For extremely large files, consider resizing first."
    },
    {
      question: "Is my image secure during compression?",
      answer: "Absolutely! All compression happens locally in your browser. Your images never leave your device, ensuring complete privacy."
    }
  ];

  return (
    <>
      <SEOHead
        title="Compress Images Online Free - I Love Image Compress | Pine Tools Hub"
        description="Compress images online for free with our I Love Image Compress tool. Reduce JPG, PNG, and WebP file sizes without losing quality. No registration, 100% secure."
        keywords="compress image, reduce image size, i love image compress, image compressor online, shrink image, make image smaller, compress jpg png free"
        canonical="https://pinetoolshub.com/compress-image"
      />

      <div className="py-12">
        <ToolHero
          title="Compress Images"
          description="Reduce your image file sizes without compromising quality. I Love Image Compress helps you create smaller, web-optimized images - completely free and secure."
          icon={<ImageDown className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
              "image/webp": [".webp"],
            }}
            multiple={false}
            label="Drop an image file here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="flex gap-6 items-start">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Original size: {formatFileSize(originalSize)}
                  </p>
                  {compressedSize > 0 && (
                    <div className="p-3 bg-primary/10 rounded">
                      <p className="text-sm font-medium text-primary">
                        Compressed size: {formatFileSize(compressedSize)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reduced by {Math.round((1 - compressedSize / originalSize) * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={10}
                    max={100}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower quality = smaller file size. 70-80% is recommended for web use.
                  </p>
                </div>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Compressing image..." />
              ) : (
                <Button onClick={compressImage} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Compress Image
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Online Image Compressor - I Love Image Compress Tool</h2>
            <p>
              Large images slow down websites and consume storage space. Pine Tools Hub's I Love Image Compress tool helps you reduce image file sizes quickly while maintaining visual quality. Whether you're optimizing images for a website, email, or storage, our compressor delivers excellent results.
            </p>
            <p>
              Our smart compression algorithm analyzes your images and applies optimal techniques to achieve maximum size reduction with minimal quality loss. All processing happens in your browser, keeping your images completely private.
            </p>
            <h3>Why Compress Your Images?</h3>
            <ul>
              <li><strong>Faster Websites:</strong> Smaller images load faster, improving user experience</li>
              <li><strong>Better SEO:</strong> Page speed is a ranking factor for search engines</li>
              <li><strong>Save Bandwidth:</strong> Reduce hosting costs and data usage</li>
              <li><strong>Email Friendly:</strong> Stay under email attachment limits</li>
              <li><strong>Storage Savings:</strong> Free up space on your devices and cloud</li>
            </ul>
            <h3>How to Compress Images</h3>
            <ol>
              <li>Upload your image file (JPG, PNG, or WebP)</li>
              <li>Adjust the quality slider to your preference</li>
              <li>Click "Compress Image" to process</li>
              <li>Download your optimized image</li>
            </ol>
            <h3>Quality vs. Size Trade-off</h3>
            <p>
              The quality slider lets you find the perfect balance. For web images, 70-80% quality typically looks great while significantly reducing file size. For important photos you want to preserve, use 85-95% quality. For thumbnails or previews, 60-70% is often sufficient.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default CompressImage;
