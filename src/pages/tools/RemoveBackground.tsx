import { useState } from "react";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Eraser, Download } from "lucide-react";

const RemoveBackground = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setProcessedImage(null);
    }
  };

  const removeBackground = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Create canvas to process image
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      img.onload = async () => {
        setProgress(30);
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        setProgress(50);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple background removal based on edge detection
        // This is a basic implementation - for production, use ML models
        const bgColor = detectBackgroundColor(data, canvas.width, canvas.height);
        const tolerance = 30;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          if (
            Math.abs(r - bgColor.r) < tolerance &&
            Math.abs(g - bgColor.g) < tolerance &&
            Math.abs(b - bgColor.b) < tolerance
          ) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        setProgress(80);
        
        ctx.putImageData(imageData, 0, 0);
        
        const resultUrl = canvas.toDataURL("image/png");
        setProcessedImage(resultUrl);
        
        setProgress(100);
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    }
  };

  const detectBackgroundColor = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    // Sample corners to detect background color
    const samples = [
      { x: 0, y: 0 },
      { x: width - 1, y: 0 },
      { x: 0, y: height - 1 },
      { x: width - 1, y: height - 1 },
    ];
    
    let r = 0, g = 0, b = 0;
    
    for (const sample of samples) {
      const idx = (sample.y * width + sample.x) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
    }
    
    return {
      r: Math.round(r / 4),
      g: Math.round(g / 4),
      b: Math.round(b / 4),
    };
  };

  const downloadImage = () => {
    if (processedImage) {
      saveAs(processedImage, `no-background-${file?.name.replace(/\.[^.]+$/, ".png")}`);
    }
  };

  const faqs = [
    {
      question: "How do I remove background from images online?",
      answer: "Upload your image to our I Love Image Background Remover, click 'Remove Background', and download your transparent PNG. The process is automatic and takes just seconds."
    },
    {
      question: "What types of images work best?",
      answer: "Images with solid, uniform backgrounds (like white, gray, or single colors) work best. Photos with complex or multi-colored backgrounds may require manual editing."
    },
    {
      question: "What format is the output image?",
      answer: "The processed image is saved as PNG format, which supports transparency. This allows you to place your subject on any background."
    },
    {
      question: "Can I remove backgrounds from product photos?",
      answer: "Yes! Product photos with clean backgrounds are ideal for our tool. The resulting transparent images are perfect for e-commerce listings."
    },
    {
      question: "Is there a file size limit?",
      answer: "Our tool handles most standard image sizes. Very large images may take longer to process but will work successfully."
    },
    {
      question: "Is my image secure during processing?",
      answer: "Absolutely! All background removal happens locally in your browser. Your images never leave your device, ensuring complete privacy."
    }
  ];

  return (
    <>
      <SEOHead
        title="Remove Background from Image Free Online - I Love Image BG Remover | Pine Tools Hub"
        description="Remove background from images online for free with our I Love Image Background Remover. Create transparent PNG images instantly. No registration, 100% secure."
        keywords="remove background, background remover, i love image background, transparent image, remove bg free, png transparent, background eraser online"
        canonical="https://pinetoolshub.com/remove-background"
      />

      <div className="py-12">
        <ToolHero
          title="Remove Image Background"
          description="Create transparent PNG images by removing backgrounds. I Love Image Background Remover makes it quick and easy - completely free and secure."
          icon={<Eraser className="h-8 w-8 text-primary" />}
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-medium text-center">Original</p>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Original"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-center">Result</p>
                  <div 
                    className="border rounded-lg p-4 h-72 flex items-center justify-center"
                    style={{
                      background: processedImage 
                        ? "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px"
                        : undefined
                    }}
                  >
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-64 object-contain"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        Click "Remove Background" to process
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Removing background..." />
              ) : processedImage ? (
                <Button onClick={downloadImage} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download Transparent PNG
                </Button>
              ) : (
                <Button onClick={removeBackground} className="w-full" size="lg">
                  <Eraser className="mr-2 h-5 w-5" />
                  Remove Background
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Image Background Remover - I Love Transparent PNG Tool</h2>
            <p>
              Need to remove the background from an image? Pine Tools Hub's I Love Image Background Remover automatically detects and removes backgrounds, creating transparent PNG images you can use anywhere. Perfect for product photos, profile pictures, and creative projects.
            </p>
            <p>
              Our background removal tool processes everything in your browser, keeping your images completely private. There's no uploading to servers or waiting for processing - everything happens instantly on your device.
            </p>
            <h3>What Can You Do with Transparent Images?</h3>
            <ul>
              <li><strong>E-commerce:</strong> Create clean product photos for online stores</li>
              <li><strong>Social Media:</strong> Make custom profile pictures and stickers</li>
              <li><strong>Design Projects:</strong> Overlay subjects on new backgrounds</li>
              <li><strong>Presentations:</strong> Add clean images to slides</li>
              <li><strong>Marketing:</strong> Create professional marketing materials</li>
            </ul>
            <h3>How to Remove Image Background</h3>
            <ol>
              <li>Upload your image (JPG, PNG, or WebP)</li>
              <li>Click "Remove Background" to process</li>
              <li>Preview your transparent image</li>
              <li>Download as a PNG file with transparency</li>
            </ol>
            <h3>Tips for Best Results</h3>
            <p>
              For optimal background removal, use images with clear contrast between the subject and background. Solid-colored backgrounds (white, gray, or single colors) work best. Complex backgrounds with multiple colors or patterns may require manual touch-ups in an image editor.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default RemoveBackground;
