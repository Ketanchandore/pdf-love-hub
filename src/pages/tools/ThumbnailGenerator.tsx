import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Youtube, Download, Upload, Type, Palette, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData } from "@/components/seo/StructuredData";

const ThumbnailGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [text, setText] = useState("Your Title Here");
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(72);
  const [fontFamily, setFontFamily] = useState("Impact");
  const [textY, setTextY] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  const [overlayColor, setOverlayColor] = useState("#000000");

  const templates = [
    { name: "YouTube (1280x720)", width: 1280, height: 720 },
    { name: "Instagram Post (1080x1080)", width: 1080, height: 1080 },
    { name: "Instagram Story (1080x1920)", width: 1080, height: 1920 },
    { name: "Twitter Header (1500x500)", width: 1500, height: 500 },
    { name: "Facebook Cover (820x312)", width: 820, height: 312 },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const drawThumbnail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        // Cover the canvas
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Draw overlay
        ctx.fillStyle = overlayColor + Math.round(overlayOpacity * 2.55).toString(16).padStart(2, "0");
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        drawText(ctx, canvas);
      };
    } else {
      drawText(ctx, canvas);
    }
  }, [backgroundImage, text, textColor, strokeColor, fontSize, fontFamily, textY, overlayOpacity, overlayColor, selectedTemplate]);

  const drawText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const y = (canvas.height * textY) / 100;

    // Text stroke
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = fontSize / 10;
    ctx.strokeText(text, canvas.width / 2, y);

    // Text fill
    ctx.fillStyle = textColor;
    ctx.fillText(text, canvas.width / 2, y);
  };

  // Redraw on changes
  useState(() => {
    drawThumbnail();
  });

  const downloadThumbnail = () => {
    drawThumbnail();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `thumbnail-${selectedTemplate.width}x${selectedTemplate.height}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Thumbnail downloaded!");
    }, 100);
  };

  const faqs = [
    { question: "What size should a YouTube thumbnail be?", answer: "YouTube recommends 1280x720 pixels (16:9 aspect ratio) with a minimum width of 640 pixels. Our tool uses this exact size." },
    { question: "Can I use my own background image?", answer: "Yes! Simply drag and drop or click to upload any image. It will be automatically scaled to fit the thumbnail dimensions." },
    { question: "What fonts work best for thumbnails?", answer: "Bold, thick fonts like Impact, Arial Black, or Bebas Neue work best as they're readable even at small sizes." },
    { question: "How do I make text more readable?", answer: "Add a dark overlay to your background image and use a contrasting text color with a stroke/outline for maximum visibility." },
    { question: "What formats can I download?", answer: "Thumbnails are downloaded as high-quality PNG files, which work perfectly for all platforms." },
  ];

  return (
    <>
      <SEOHead
        title="Thumbnail Generator - YouTube, Instagram, Twitter | Free Online"
        description="Create stunning thumbnails for YouTube, Instagram, Twitter, and Facebook. Add text, overlays, and custom designs. Free online thumbnail maker."
        keywords="thumbnail generator, youtube thumbnail maker, instagram thumbnail, twitter header maker, thumbnail creator free, video thumbnail generator"
        canonical="https://pinetoolshub.com/thumbnail-generator"
      />
      <ToolStructuredData
        toolName="Thumbnail Generator"
        toolDescription="Create stunning thumbnails for YouTube, Instagram, Twitter, and Facebook with custom text and overlays."
        toolUrl="https://pinetoolshub.com/thumbnail-generator"
        category="Image"
      />

      <ToolHero
        title="Thumbnail Generator"
        description="Create eye-catching thumbnails for YouTube, Instagram, Twitter & more. Add text, overlays, and download instantly."
        icon={<Youtube className="h-6 w-6" />}
      />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Settings Panel */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Layers className="h-4 w-4" /> Template</h3>
                    <Select 
                      value={selectedTemplate.name} 
                      onValueChange={(v) => setSelectedTemplate(templates.find(t => t.name === v) || templates[0])}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm">Upload background image</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Type className="h-4 w-4" /> Text</h3>
                    <div>
                      <Label>Title Text</Label>
                      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Your title here" />
                    </div>
                    <div>
                      <Label>Font</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Impact">Impact</SelectItem>
                          <SelectItem value="Arial Black">Arial Black</SelectItem>
                          <SelectItem value="Helvetica">Helvetica Bold</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Verdana">Verdana Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Font Size</Label>
                        <span className="text-sm text-muted-foreground">{fontSize}px</span>
                      </div>
                      <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={24} max={150} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Text Position (Y)</Label>
                        <span className="text-sm text-muted-foreground">{textY}%</span>
                      </div>
                      <Slider value={[textY]} onValueChange={([v]) => setTextY(v)} min={10} max={90} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Text Color</Label>
                        <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                      </div>
                      <div>
                        <Label>Stroke Color</Label>
                        <Input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4" /> Overlay</h3>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Overlay Opacity</Label>
                        <span className="text-sm text-muted-foreground">{overlayOpacity}%</span>
                      </div>
                      <Slider value={[overlayOpacity]} onValueChange={([v]) => setOverlayOpacity(v)} min={0} max={80} />
                    </div>
                    <div>
                      <Label>Overlay Color</Label>
                      <Input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Preview</h3>
                      <Button onClick={drawThumbnail} variant="outline" size="sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Refresh Preview
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-4 flex justify-center overflow-auto">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto rounded shadow-lg"
                        style={{ maxHeight: "500px" }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={downloadThumbnail} className="w-full" size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  Download Thumbnail ({selectedTemplate.width}x{selectedTemplate.height})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} toolName="Thumbnail Generator" />
    </>
  );
};

export default ThumbnailGenerator;
