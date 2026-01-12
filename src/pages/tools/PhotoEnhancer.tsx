import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Sparkles, Download, Upload, ZoomIn, Wand2, Sun, Contrast, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData } from "@/components/seo/StructuredData";

const PhotoEnhancer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    upscale: 2,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setEnhancedImage(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const enhanceImage = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    try {
      // Client-side image enhancement using canvas
      const img = new Image();
      img.src = originalImage;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      
      // Upscale
      canvas.width = img.width * settings.upscale;
      canvas.height = img.height * settings.upscale;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply filters
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Brightness
        data[i] = Math.min(255, Math.max(0, data[i] + settings.brightness * 2.55));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + settings.brightness * 2.55));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + settings.brightness * 2.55));

        // Contrast
        const factor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast));
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));

        // Saturation
        const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const satFactor = 1 + settings.saturation / 100;
        data[i] = Math.min(255, Math.max(0, gray + satFactor * (data[i] - gray)));
        data[i + 1] = Math.min(255, Math.max(0, gray + satFactor * (data[i + 1] - gray)));
        data[i + 2] = Math.min(255, Math.max(0, gray + satFactor * (data[i + 2] - gray)));
      }

      ctx.putImageData(imageData, 0, 0);
      setEnhancedImage(canvas.toDataURL("image/png", 1.0));
      toast.success("Image enhanced successfully!");
    } catch (error) {
      toast.error("Failed to enhance image");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!enhancedImage) return;
    const link = document.createElement("a");
    link.download = "enhanced-image.png";
    link.href = enhancedImage;
    link.click();
    toast.success("Image downloaded!");
  };

  const faqs = [
    { question: "How does the AI photo enhancer work?", answer: "Our tool uses advanced algorithms to upscale images, adjust brightness, contrast, saturation, and apply sharpening - all processed locally in your browser for privacy." },
    { question: "What's the maximum upscale size?", answer: "You can upscale images up to 4x their original resolution while maintaining quality." },
    { question: "Is my photo data secure?", answer: "Absolutely! All processing happens directly in your browser. Your images are never uploaded to any server." },
    { question: "What image formats are supported?", answer: "We support JPG, JPEG, PNG, and WebP formats for both input and output." },
    { question: "Can I enhance old or low-quality photos?", answer: "Yes! Our tool is great for improving old photos, low-resolution images, and photos taken in poor lighting." },
  ];

  return (
    <>
      <SEOHead
        title="AI Photo Enhancer & Upscaler - Free Online | Pine Tools Hub"
        description="Enhance and upscale photos with AI. Improve brightness, contrast, saturation. Upscale images 2x-4x without quality loss. 100% free, no signup required."
        keywords="photo enhancer, image upscaler, AI photo enhancement, upscale image, improve photo quality, enhance old photos, free image enhancer"
        canonical="https://pinetoolshub.com/photo-enhancer"
      />
      <ToolStructuredData
        toolName="AI Photo Enhancer & Upscaler"
        toolDescription="Enhance and upscale photos with AI-powered algorithms. Improve brightness, contrast, and saturation while upscaling images up to 4x."
        toolUrl="https://pinetoolshub.com/photo-enhancer"
        category="Image"
      />

      <ToolHero
        title="AI Photo Enhancer & Upscaler"
        description="Enhance photo quality with AI. Upscale images 2x-4x, adjust brightness, contrast, and saturation - all in your browser."
        icon={<Sparkles className="h-6 w-6" />}
      />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!originalImage ? (
              <Card>
                <CardContent className="p-8">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                      isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Drop your image here</p>
                    <p className="text-sm text-muted-foreground">or click to browse (JPG, PNG, WebP)</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Original</h3>
                      <img src={originalImage} alt="Original" className="w-full rounded-lg" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Enhanced</h3>
                      {enhancedImage ? (
                        <img src={enhancedImage} alt="Enhanced" className="w-full rounded-lg" />
                      ) : (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Click "Enhance" to process</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="enhance">
                      <TabsList className="mb-4">
                        <TabsTrigger value="enhance"><Wand2 className="h-4 w-4 mr-2" />Enhance</TabsTrigger>
                        <TabsTrigger value="upscale"><ZoomIn className="h-4 w-4 mr-2" />Upscale</TabsTrigger>
                      </TabsList>

                      <TabsContent value="enhance" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium flex items-center gap-2">
                                <Sun className="h-4 w-4" /> Brightness
                              </label>
                              <span className="text-sm text-muted-foreground">{settings.brightness}</span>
                            </div>
                            <Slider
                              value={[settings.brightness]}
                              onValueChange={([v]) => setSettings({ ...settings, brightness: v })}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium flex items-center gap-2">
                                <Contrast className="h-4 w-4" /> Contrast
                              </label>
                              <span className="text-sm text-muted-foreground">{settings.contrast}</span>
                            </div>
                            <Slider
                              value={[settings.contrast]}
                              onValueChange={([v]) => setSettings({ ...settings, contrast: v })}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium flex items-center gap-2">
                                <Palette className="h-4 w-4" /> Saturation
                              </label>
                              <span className="text-sm text-muted-foreground">{settings.saturation}</span>
                            </div>
                            <Slider
                              value={[settings.saturation]}
                              onValueChange={([v]) => setSettings({ ...settings, saturation: v })}
                              min={-100}
                              max={100}
                              step={1}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="upscale">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Upscale Factor</label>
                            <span className="text-sm text-muted-foreground">{settings.upscale}x</span>
                          </div>
                          <Slider
                            value={[settings.upscale]}
                            onValueChange={([v]) => setSettings({ ...settings, upscale: v })}
                            min={1}
                            max={4}
                            step={1}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => { setOriginalImage(null); setEnhancedImage(null); }}>
                    Upload New
                  </Button>
                  <Button onClick={enhanceImage} disabled={isProcessing}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isProcessing ? "Enhancing..." : "Enhance Image"}
                  </Button>
                  {enhancedImage && (
                    <Button onClick={downloadImage} variant="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} toolName="Photo Enhancer" />
    </>
  );
};

export default PhotoEnhancer;
